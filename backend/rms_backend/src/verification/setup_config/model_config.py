import logging
import re
from abc import ABC, abstractmethod
import asyncio

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from concurrent.futures import ThreadPoolExecutor

from verification.consistency.consistency_metrics import LLMConsistency
from verification.explainability.explainability_metrics import LLMExplainability
from verification.performance.performance_metrics import LLMPerformance

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Model(ABC):
    """
    Model class:

    Constructor Parameter:
    - name: Name of the model
    - model_specification: Specification of the model
    """

    def __init__(self, name: str):
        self._name = name
        self._performance = None
        self._explainability = None
        self._consistency = None

    @abstractmethod
    def init(self):
        pass

    @property
    def name(self):
        return self._name

    @property
    def performance(self):
        return self._performance

    @property
    def explainability(self):
        return self._explainability

    @property
    def consistency(self):
        return self._consistency


class LargeLanguageModel(Model, ABC):
    """
    LargeLanguageModel class:

    Constructor Parameter:
    - name: Name of the model
    - model_specification: Specification of the model
    - tokenizer: Tokenizer of the LLM from Hugging Face
    """

    def __init__(self, name: str, path: str):
        super().__init__(name)
        # Standard:
        self.path = path
        self.executor = ThreadPoolExecutor()

        # Initialize the model right
        self._model_specification = None
        self._tokenizer = None
        self._model_loaded = False  # Flag to check if the model is loaded

        # Load the right strategies: Load the right strategies
        self._performance = None
        self._consistency = None
        self._explainability = None

    async def __load_model(self):
        model_spec = AutoModelForCausalLM.from_pretrained(self.path,
                                                          device_map='auto',
                                                          torch_dtype=torch.float16,
                                                          use_cache=False,
                                                          trust_remote_code=True)
        return model_spec

    async def __load_tokenizer(self):
        tokenizer = AutoTokenizer.from_pretrained(self.path,
                                                  trust_remote_code=True)
        return tokenizer

    async def init(self):
        try:
            model_task = asyncio.create_task(self.__load_model())
            tokenizer_task = asyncio.create_task(self.__load_tokenizer())

            self._model_specification = await model_task
            self._tokenizer = await tokenizer_task

            self._performance = LLMPerformance(self)
            self._consistency = LLMConsistency(self)
            self._explainability = LLMExplainability(self)

            # Set model loaded flag
            self._model_loaded = True

        except Exception as e:
            logger.error(f"Failed to load model {self.name}: {e}")
            self._model_loaded = False

    @property
    def model_specification(self):
        return self._model_specification

    @property
    def tokenizer(self):
        return self._tokenizer

    @property
    def model_loaded(self):
        return self._model_loaded

    async def __generate_inf_model(self, input_ids, max_token_length):
        output_tensor = self.model_specification.generate(
            input_ids,
            max_length=max_token_length,
            num_return_sequences=1,
            temperature=0.7,
            top_k=50,
            top_p=0.95,
            repetition_penalty=1.2,
            pad_token_id=self.tokenizer.pad_token_id,
            eos_token_id=self.tokenizer.eos_token_id,
            early_stopping=True
        )
        return output_tensor

    async def inference(self, instruction: str, task: str, max_token_length: int):
        """
        Generates an output by the model based on the instruction and task.

        Parameters:
        - instruction (str): Instruction for the model.
        - task (str): Task input for the model.
        - max_token_length (int): Maximum length of the output tokens.

        Returns:
        - output_tensor: Tokens of generated output.
        - output_text: Text of generated output.
        """
        prompt_text = instruction + " " + task

        logger.info("Inference started!")

        input_ids = self.tokenizer.encode(prompt_text, return_tensors='pt').to('cuda')
        logger.info(f"Inputs: {input_ids}")

        # Offload the generate method to the executor
        output_tensor_res = asyncio.create_task(self.__generate_inf_model(input_ids=input_ids,
                                                                          max_token_length=max_token_length))

        output_tensor = await output_tensor_res

        response = output_tensor[0][input_ids.shape[-1]:]
        output_text = self.tokenizer.decode(response, skip_special_tokens=True)

        return output_tensor, output_text

    async def extract_json(self, text: str):
        """
        extract_json_as_string_from_output: Extract expected JSON output from LLM generated output if present

        Parameter:
        - text: Output text generated from LLM

        Return:
        - match.group(): String that represents the JSON of output
        """
        # Define a regex pattern to match JSON objects
        json_pattern = re.compile(r'\[.*?\]', re.DOTALL)
        # Search for the JSON pattern in the text
        match = json_pattern.search(text)
        # If a match is found, return the matched string
        if match:
            return match.group()
        return None
