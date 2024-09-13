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

from abc import ABC
from collections import Counter
from concurrent.futures import ThreadPoolExecutor

import nltk
import torch
from nltk.util import ngrams
import asyncio


class Performance(ABC):
    """
    Performance class: Implement here all methods that can be used to analyze the accuracy and performance of an AI system

    Constructor Parameter:
    - model: A loaded LLM from Hugging Face
    """

    def __init__(self, model):
        self.model = model

    async def accuracy(self):
        pass


class LLMPerformance(Performance):
    """
    LLMPerformance class: Implement here all methods that can be used to analyze the accuracy and performance of an AI system

    Constructor Parameter:
    - model: A loaded LLM from Hugging Face
    """

    def __init__(self, model):
        super().__init__(model)
        self.executor = ThreadPoolExecutor()

    async def accuracy(self):
        await super().accuracy()
        return None

    async def rouge_n(self, generated_text: str, ground_truth: str, n: int):
        """
        rouge_n: Calculate the ROUGE-N score (recall, precision, F1)

        Parameter:
        - generated_text: Output text of an LLM
        - ground_truth: The human-based output
        - n: n-gram, defines the length of the sequences that will be checked on similarity

        Return:
        - rouge_n_recall: The ROUGE-N recall score
        - rouge_n_precision: The ROUGE-N precision score
        - rouge_n_f1: The ROUGE-N F1 score
        """
        generated_tokens = nltk.word_tokenize(generated_text)
        gt_tokens = nltk.word_tokenize(ground_truth)

        # Generate n-grams
        generated_ngrams = list(ngrams(generated_tokens, n))
        gt_ngrams = list(ngrams(gt_tokens, n))

        # Count n-grams
        generated_ngrams_count = Counter(generated_ngrams)
        gt_ngrams_count = Counter(gt_ngrams)

        # Calculate overlap
        overlap = sum((generated_ngrams_count & gt_ngrams_count).values())

        total_generated_ngrams = sum(generated_ngrams_count.values())
        total_reference_ngrams = sum(gt_ngrams_count.values())

        # ROUGE-N score (Recall-based)
        rouge_n_recall = overlap / total_reference_ngrams if total_reference_ngrams > 0 else 0

        # ROUGE-N score (Precision-based)
        rouge_n_precision = overlap / total_generated_ngrams if total_generated_ngrams > 0 else 0

        # ROUGE-N F1 score
        rouge_n_f1 = 2.0 * ((rouge_n_precision * rouge_n_recall) / (rouge_n_precision + rouge_n_recall + 1e-8))

        return rouge_n_recall, rouge_n_precision, rouge_n_f1

    async def perplexity(self, instruction: str, task: str):
        """
        perplexity: Calculate the perplexity score for model output

        Parameter:
        - instruction: Text that defines how the task should be processed
        - task: Text that will be processed by the LLM

        Return:
        - perplexity: Perplexity score for model output
        """
        input_text = instruction + " " + task

        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        # Encode the input text
        encodings = self.model.tokenizer(input_text, return_tensors='pt').to('cuda')
        input_ids = encodings.input_ids.to(device)

        # Calculate loss
        with torch.no_grad():
            # Generate outputs
            outputs = self.model.model_specification(input_ids, labels=input_ids)
            loss = outputs.loss
            perplexity = torch.exp(loss).item()

        # perplexity = 5

        return perplexity
