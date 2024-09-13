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
from concurrent.futures import ThreadPoolExecutor
import asyncio


class Explainability(ABC):
    def __init__(self, model):
        self.model = model


class LLMExplainability(Explainability):
    def __init__(self, model):
        super().__init__(model)
        self.executor = ThreadPoolExecutor()

    async def __slice_data(self, instruction, task, target):
        instruction_tokens = self.model.tokenizer(instruction).input_ids
        len_instruction_tokens = len(instruction_tokens)

        input = instruction + " " + task
        input_tokens = self.model.tokenizer(input).input_ids
        len_input_tokens = len(input_tokens)
        task_slice = slice(len_instruction_tokens, len_input_tokens)

        input_target = input + " " + target
        input_target_tokens = self.model.tokenizer(input_target).input_ids
        len_input_target = len(input_target_tokens)
        target_slice = slice(len_input_tokens, len_input_target)

        return task_slice, target_slice

    def __grads_of_task_tokens_sync(self, task_slice, target_slice, input_target_tokens):
        input_target_tokens.detach()

        model_type = str(type(self.model.model_specification))
        supported_models = ['llama', 'gpt2', 'gpt_neo', 'phi', 'phi3']
        if 'gpt2' in model_type or 'gpt_neo' in model_type:
            model_embed = self.model.model_specification.transformer.wte
        elif any(keyword in model_type for keyword in supported_models):
            model_embed = self.model.model_specification.model.embed_tokens
        else:
            raise NotImplementedError
        embed = model_embed
        embed_weights = model_embed.weight

        if not (input_target_tokens.shape[0] >= task_slice.stop > task_slice.start):
            print("Invalid token indices found.")
            return None

        one_hot_task = torch.zeros(task_slice.stop - task_slice.start, embed_weights.shape[0],
                                   dtype=embed_weights.dtype, device=embed_weights.device)
        one_hot_task.scatter_(1, input_target_tokens[task_slice].unsqueeze(1), 1)
        one_hot_task.requires_grad_()

        task_embeds = (one_hot_task @ embed_weights).unsqueeze(0)
        input_embeds = embed(input_target_tokens.unsqueeze(0)).detach()

        input_grad_embeds = torch.cat(
            [input_embeds[:, :task_slice.start, :], task_embeds, input_embeds[:, task_slice.stop:, :]], dim=1)

        scaler = GradScaler()
        self.model.model_specification.zero_grad()

        with autocast():
            output = self.model.model_specification(inputs_embeds=input_grad_embeds)
            logits = output.logits[0]
            logits = logits[target_slice.start - 1:target_slice.stop - 1]

            target_tokens = input_target_tokens[target_slice]
            loss = F.cross_entropy(logits, target_tokens)

        scaler.scale(loss).backward()
        gradients = one_hot_task.grad.detach()

        if torch.isnan(gradients).any():
            print("NaNs found in gradients")
            gradients = np.zeros_like(gradients)

        return gradients

    async def __grads_of_task_tokens(self, task_slice, target_slice, input_target_tokens):
        loop = asyncio.get_event_loop()
        gradients = await loop.run_in_executor(
            self.executor,
            self.__grads_of_task_tokens_sync,
            task_slice,
            target_slice,
            input_target_tokens
        )
        return gradients

    async def __calculate_token_grad_dict(self, gradients, task_tokens):
        gradients_cpu = gradients.cpu().numpy()
        epsilon = 1e-10
        norms = np.linalg.norm(gradients_cpu, ord=np.inf, axis=1) + epsilon

        min_importance = np.min(norms)
        max_importance = np.max(norms)

        if min_importance == max_importance:
            normalized_magnitudes = np.zeros_like(norms)
        else:
            normalized_magnitudes = (norms - min_importance) / (max_importance - min_importance)

        token_gradient_dict = {}
        for i, token in enumerate(task_tokens):
            gradient_value = normalized_magnitudes[i].item()
            token_gradient_dict[self.model.tokenizer.decode([token])] = gradient_value

        return token_gradient_dict

    async def gradient_based_saliency_exp(self, instruction: str, task: str, target: str):
        try:
            task_slice, target_slice = await self.__slice_data(instruction, task, target)

            input = instruction + " " + task
            input_target = input + " " + target

            input_tokens = self.model.tokenizer(input,
                                                truncation=True,
                                                return_tensors='pt',
                                                return_attention_mask=True).input_ids[0]

            input_target_tokens = self.model.tokenizer(input_target,
                                                       truncation=True,
                                                       return_tensors='pt',
                                                       return_attention_mask=True).input_ids[0]

            device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
            input_tokens = input_tokens.to(device)
            input_target_tokens = input_target_tokens.to(device)

            gradients = await self.__grads_of_task_tokens(task_slice=task_slice,
                                                          target_slice=target_slice,
                                                          input_target_tokens=input_target_tokens)

            token_gradient_dict = await self.__calculate_token_grad_dict(gradients=gradients,
                                                                         task_tokens=input_tokens[task_slice])

            return token_gradient_dict

        except Exception as e:
            print(e)
            return {'results': []}
