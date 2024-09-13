#
# This file is part of first_version_qmsAIA.
#
# first_version_qmsAIA is free software: you can redistribute it and/or modify it
# under the terms of the GNU Lesser General Public License as published by the
# Free Software Foundation, either version 3 of the License, or (at your
# option) any later version.
#
# social_network_miner_compliance_check is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more
# details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with first_version_qmsAIA (file COPYING in the main directory). If not, see
# http://www.gnu.org/licenses/.

import torch
import torch.nn.functional as F
import numpy as np
from abc import ABC
from torch.cuda.amp import autocast, GradScaler
import os
import asyncio
from concurrent.futures import ThreadPoolExecutor

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Consistency(ABC):
    """
    Consistency class: Implement, reliability, robustness, and security metrics for AI systems.

    Constructor Parameter:
    - model: A loaded LLM from Hugging Face
    """

    def __init__(self, model):
        self.model = model


class LLMConsistency(Consistency):
    """
    LLMConsistency class: Implement, reliability, robustness, and security metrics for LLM.

    Constructor Parameter:
    - model: A loaded LLM from Hugging Face
    """

    def __init__(self, model):
        super().__init__(model)
        self.executor = ThreadPoolExecutor()

    async def __slice_data(self, instruction, task, target):
        """
        HELPER (PRIVATE) METHOD

        __slice_data: Tokenize the texts and split the tokens in instruction, task and target

        Parameter:
        - instruction: Text that explains how to process task
        - task: Text that is processed
        - target: Ground-truth output

        Return:
        - task_slice: List that stores the indices from the task of input token list
        - target_slice: List that stores the indices from the target of input token list
        """

        # Get tokens of instruction only
        instruction_tokens = self.model.tokenizer(instruction).input_ids
        # length of instruction tokens
        len_instruction_tokens = len(instruction_tokens)

        # input = instruction + task:
        input = instruction + " " + task
        # Get tokens for instruction + task
        input_tokens = self.model.tokenizer(input).input_ids
        # length of instruction + task tokens
        len_input_tokens = len(input_tokens)
        # Token list from index: len_instruction_tokens - index: len_input_tokens - 1
        task_slice = slice(len_instruction_tokens, len_input_tokens)

        # Instruction + Task + Target
        input_target = input + " " + target
        # Get tokens for prompt + compliance text + target
        input_target_tokens = self.model.tokenizer(input_target).input_ids
        len_input_target = len(input_target_tokens)
        target_slice = slice(len_input_tokens, len_input_target)

        return task_slice, target_slice

    def __grads_of_task_tokens_sync(self, task_slice, target_slice, input_target_tokens, embed, embed_weights):
        """
        HELPER (PRIVATE) METHOD

        __grads_of_task_tokens_sync: Get gradients of each token in a task

        Parameter:
        - task_slice: Start and end index of task token in input tokens sequence
        - input_tokens: Tokens of: instruction + " " + task

        Return:
        gradients: tensor of output encoding embeddings for a task
        """

        # Detach the input from the gradient calculation
        input_target_tokens.detach()

        # Check for valid indices and lengths
        if not (input_target_tokens.shape[0] >= task_slice.stop > task_slice.start):
            print("Invalid token indices found.")
            return None

        # Shape: sequence length (only task input) x vocabulary size
        one_hot_task = torch.zeros(task_slice.stop - task_slice.start, embed_weights.shape[0],
                                   dtype=embed_weights.dtype, device=embed_weights.device)
        # insert into zero vectors for each row at index of task token a 1
        one_hot_task.scatter_(1, input_target_tokens[task_slice].unsqueeze(1), 1)
        # Set for the One hot encoded compliance text the gradients to true:
        one_hot_task.requires_grad_()

        # (sequence length (only task input) x vocabulary size) x (vocabulary size x embedding dimension)
        # = sequence length x embedding dim -> unsqueeze = batch size (1) x sequence length x embedding dim
        task_embeds = (one_hot_task @ embed_weights).unsqueeze(0)

        # Concatenate the embeddings
        # Shape: batch size x sequence length (full input) x embedded dimension
        input_embeds = embed(input_target_tokens.unsqueeze(0)).detach()

        # (batch size x 0-task slice start, embedded sim) with (batch size (1) x task slice start-task slice stop x embedding dim) (batch size x task slice stop-end, embedded dim)
        # = batch size x sequence length (full input) x embedded dimension
        input_grad_embeds = torch.cat(
            [input_embeds[:, :task_slice.start, :], task_embeds, input_embeds[:, task_slice.stop:, :]], dim=1)

        # Define scaler for gradient scaling
        scaler = GradScaler()

        # Clear existing gradients (assuming you have optimizer managing them elsewhere)
        self.model.model_specification.zero_grad()

        # Calculate loss:
        # Forward pass with autocast
        with autocast():
            output = self.model.model_specification(inputs_embeds=input_grad_embeds)
            logits = output.logits[0]
            # Get the logits only in the range of the target to calculate the loss
            logits = logits[target_slice.start - 1:target_slice.stop - 1]
            target_tokens = input_target_tokens[target_slice]
            # Compute the loss
            loss = F.cross_entropy(logits, target_tokens)

        # Backward pass with gradient scaling
        scaler.scale(loss).backward()

        # Get gradients
        gradients = one_hot_task.grad.detach()

        # Check for NaNs in gradients
        if torch.isnan(gradients).any():
            gradients.zero_()

        one_hot_task.grad = None

        return gradients

    async def __grads_of_task_tokens(self, task_slice, target_slice, input_target_tokens, embed, embed_weights):
        loop = asyncio.get_event_loop()
        gradients = await loop.run_in_executor(
            self.executor,
            self.__grads_of_task_tokens_sync,
            task_slice,
            target_slice,
            input_target_tokens,
            embed,
            embed_weights
        )
        return gradients

    async def __create_adversarial_example(self,
                                           input_adv_target_tokens,
                                           task_slice,
                                           adv_target_slice,
                                           max_iters,
                                           learning_rate,
                                           embed,
                                           embed_weights
                                           ):
        try:
            iterations = 0

            # Get adversarial tokens:
            adv_target_tokens = input_adv_target_tokens[adv_target_slice]
            # Contains the tokens of the prompt + task + adversarial target
            input_adv_target_tokens.detach()

            logger.info("start adv. creation")

            logger.info(f"maximum iterations: {range(max_iters)}")

            # Iterate as long as the adversarial output will be classified by the model or the iterations reach the maximum
            for i in range(max_iters):

                logger.info(f"iteration i: {i}")
                logger.info(f"grad calc iterations: {iterations}")

                # Gradients of task tokens only
                gradients = await self.__grads_of_task_tokens(task_slice=task_slice,
                                                              target_slice=adv_target_slice,
                                                              input_target_tokens=input_adv_target_tokens,
                                                              embed=embed,
                                                              embed_weights=embed_weights
                                                              )
                logger.info(f"gradients: {gradients}")
                all_grads_zero = torch.all(gradients == 0)
                logger.info(f"All grads zero: {all_grads_zero.item()}")

                # Error handling in case the method returns NaN gradients:
                if iterations > 0 and all_grads_zero.item():
                    return input_adv_target_tokens[task_slice], iterations

                if iterations == 0 and all_grads_zero.item():
                    return None, 0

                # Update the input tokens using the gradients
                # Prevents gradient tracking during the update step to save memory and computation
                with torch.no_grad():
                    # Get the sign of the gradient, to know the direction how to modify, set a well-suited learning rate and modify the input token using integer.
                    input_adv_target_tokens[task_slice] = abs(
                        input_adv_target_tokens[task_slice] + learning_rate * gradients.sign().sum(dim=1).to(torch.int64))

                logger.info("first token opt.")

                # Get tokens of output of modified input target tokens
                input_target_tokens_with_batch_size = input_adv_target_tokens.unsqueeze(0)

                input_embeds = embed(input_target_tokens_with_batch_size).detach()
                output = self.model.model_specification(inputs_embeds=input_embeds)
                logits = output.logits[0]
                logits = logits[adv_target_slice.start - 1:adv_target_slice.stop - 1]

                logger.info("logits of predicted")

                # Get vocabulary from the model's tokenizer
                vocab = self.model.tokenizer.get_vocab()
                vocab_tokens = list(vocab.values())

                # Convert predicted indices to tokens, filtering out indices not found in the vocabulary
                predicted_indices = torch.argmax(logits, dim=1).tolist()
                predicted_tokens = [vocab_tokens[idx] for idx in predicted_indices if idx in vocab_tokens]

                if predicted_tokens == adv_target_tokens.tolist():
                    return input_adv_target_tokens[task_slice], iterations

                logger.info("comparison")

                iterations += 1

            return input_adv_target_tokens[task_slice], iterations

        except Exception as e:
            logger.error(e)
            return None, 0

    async def gradient_based_robustness_iterations(self, instruction: str, task: str, adv_target: str):
        """
        gradient_robustness_iterations: Call all helper methods and generate adversarial input example by counting
        the number of change iterations.

        Parameter:
            - instruction: Text that explains how to process task
            - task: Text that is processed
            - target: Ground-truth output

        Return:
            - token_gradient_dict: Dictionary that stores for each token as text the gradient value
        """
        try:

            # Set CUDA_LAUNCH_BLOCKING environment variable
            os.environ['CUDA_LAUNCH_BLOCKING'] = '1'

            # Get the embedding of the model:
            model_type = str(type(self.model.model_specification))
            supported_models = ['llama', 'gpt2', 'gpt_neo', 'phi', 'phi3']
            # Get model embeddings
            if 'gpt2' in model_type or 'gpt_neo' in model_type:
                model_embed = self.model.model_specification.transformer.wte
            elif any(keyword in model_type for keyword in supported_models):
                model_embed = self.model.model_specification.model.embed_tokens
            else:
                raise NotImplementedError
            embed = model_embed
            embed_weights = model_embed.weight

            logger.info("Slicing starts")
            task_slice, adv_target_slice = await self.__slice_data(instruction, task, adv_target)
            logger.info("Slicing done")

            # Input = prompt + task text
            input = instruction + " " + task
            # Input & target = input + adv target
            input_adv_target = input + " " + adv_target

            logger.info("Tokenization start")
            input_adv_target_tokens = self.model.tokenizer(input_adv_target,
                                                           truncation=True,
                                                           return_tensors='pt',
                                                           return_attention_mask=True).input_ids[0]
            logger.info("Tokenization done")

            # Move tensors to the desired device
            device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

            # Tokens for target:
            input_adv_target_tokens = input_adv_target_tokens.to(device)

            logger.info("Adv. example creation starts")
            # Get the output of the adversarial task creation

            max_iters = 30
            learning_rate = 0.1

            modified_task_tokens, iterations = await self.__create_adversarial_example(
                input_adv_target_tokens=input_adv_target_tokens,
                task_slice=task_slice,
                adv_target_slice=adv_target_slice,
                max_iters=max_iters,
                learning_rate=learning_rate,
                embed=embed,
                embed_weights=embed_weights
            )
            logger.info("Adv. example creation done")

            logger.info(f"Consistency iterations: {iterations}")
            logger.info(f"Consistency modified task tokens: {modified_task_tokens}")

            # Either: modified_task_tokens = None, and iterations = 0
            if iterations == 0:
                return None, modified_task_tokens, 0
            # Or: modified_task_tokens and iteration > 0
            else:
                # Decode adversarial task to text
                modified_task_text = self.model.tokenizer.decode(modified_task_tokens)
                return modified_task_text, modified_task_tokens, iterations

        except Exception as e:
            print(e)
            return None, None, None
