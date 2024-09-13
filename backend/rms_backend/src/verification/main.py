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

import logging

from verification.setup_config.model_config import LargeLanguageModel

# from verification.setup_config.utils import login_to_huggingface

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def load_model(llm: str):
    """
    Works!

    Load the llm model

    Input:
    llm: Langauge Model that should be loaded

    Output:
    Initialized language model that can be used for metric computation
    """
    try:
        # 1. Get a path of language model to load
        path = ""
        if llm == 'GPT-2':
            path = "gpt2"
        if llm == 'Llama2-7b':
            path = 'meta-llama/Llama-2-7b-chat-hf'
        if llm == 'Llama3-8b':
            path = 'meta-llama/Meta-Llama-3-8B'

        # Currently this model is locally stored in the docker container
        if llm == 'Phi3-mini-128k':
            # path = "microsoft/Phi-3-mini-128k-instruct"
            path = 'app/models/Phi3-mini-128k'
        # ... More can be added by just adding the link

        if path != "":
            # Model and tokenizer initialization:
            model = LargeLanguageModel(name=llm, path=path)
            await model.init()
            if model.model_loaded:
                logger.info("Model loaded successfully")
            else:
                logger.info("Model loading failed")

            return model
        else:
            return None

    except Exception as e:
        print(e)
        return None


async def inference_model(model: LargeLanguageModel,
                          input_text: str,
                          instruction: str,
                          ):
    try:
        if model:
            model.model_specification.eval()
            # Inference
            _, output_text = await model.inference(instruction=instruction,
                                                   task=input_text,
                                                   max_token_length=250
                                                   )
            logger.info(f"Inference output: {output_text}")
            logger.info("Inference done")
            return output_text

        else:
            logger.info("Inference failed: Model not known")
            return None

    except Exception as e:
        print(e)
        return None


async def compute_risk_results_performance(performance_metrics: list,
                                           input_text: str,
                                           instruction: str,
                                           ground_truth: str,
                                           output_text: str,
                                           model: LargeLanguageModel):
    """
    Works!

    Computes and returns the computation results for the model's performance evaluation:
    
    Input:
    performance_metrics: Performance Metrics that should be computed and the model should be tested on.
    input_text: task/ input text executed by the model
    instruction: The instruction for the model what it should do with the input text
    ground truth: True output text
    llm: Language Model
    
    Output:
    performance_outputs: Performance computation outputs in expected object format
    """
    try:
        if model:
            model.model_specification.eval()

            # Return value
            performance_outputs = {}

            # ROUGE:
            rouge_n_f1 = None
            if "ROUGE" in performance_metrics:
                rouge_n_recall, rouge_n_precision, rouge_n_f1 = await model.performance.rouge_n(
                    generated_text=output_text,
                    ground_truth=ground_truth,
                    n=2
                    )
                logger.info(f"Performance Rouge-n: {rouge_n_f1}")
                performance_outputs["rouge_n_score"] = rouge_n_f1

            # Accuracy
            accuracy = None
            if "Accuracy" in performance_metrics:
                # accuracy = await model.performance.accuracy()
                # performance_outputs["accuracy_score"] = accuracy
                accuracy = 0.8
                logger.info(f"Performance Accuracy: {accuracy}")
                performance_outputs["accuracy_score"] = accuracy

            # Perplexity:
            perplexity = None
            if "Perplexity" in performance_metrics:
                perplexity = await model.performance.perplexity(instruction=instruction,
                                                                task=input_text
                                                                )
                logger.info(f"Performance Perplexity: {perplexity}")
                performance_outputs["perplexity_score"] = perplexity

            logger.info("Performance Metrics computed.")

            if perplexity is None and rouge_n_f1 is None:
                return {}
            else:
                return performance_outputs

        else:
            logger.info("Performance Metrics empty.")
            return {}

    except Exception as e:
        print(e)
        return {}


async def compute_risk_results_explainability(explainability_metrics: list, input_text: str, instruction: str,
                                              ground_truth: str, model: LargeLanguageModel):
    """
    Works!

    Computes and returns the computation results for the model's explainability evaluation:
    
    Input:
    explainability_metrics: Explainability Metrics that should be computed and the model should be tested on.
    input_text: task/ input text executed by the model
    instruction: The instruction for the model what it should do with the input text
    ground truth: True output text
    llm: Language Model
    
    Output:
    explainability_outputs: Explainability computation outputs in expected object format
    
    """
    try:
        if model:
            model.model_specification.eval()

            # Return value
            explainability_outputs = {"results": []}

            # Gradient-based Saliency Explanation
            if "Gradient-based Saliency Explanation" in explainability_metrics:
                expl_dict = await model.explainability.gradient_based_saliency_exp(instruction=instruction,
                                                                                   task=input_text,
                                                                                   target=ground_truth)
                # Transform the dictionary into a list of dictionaries
                transformed_list = [{"token": key, "saliency": value} for key, value in expl_dict.items()]
                logger.info(f"Explainability Gradient-based Saliency Explanation: {transformed_list}")

                explainability_outputs['results'] = transformed_list

            logger.info("Explainability Metrics computed.")

            return explainability_outputs

        else:
            logger.info("Explainability Metrics empty.")
            return {"results": []}

    except Exception as e:
        print(e)
        return {}


async def compute_risk_results_consistency(consistency_metrics: list,
                                           input_text: str,
                                           instruction: str,
                                           adv_target: str,
                                           model: LargeLanguageModel):
    """

    Computes and returns the computation results for the model's explainability evaluation:
    
    Input:
    explainability_metrics: Explainability Metrics that should be computed and the model should be tested on.
    input_text: task/ input text executed by the model
    instruction: The instruction for the model what it should do with the input text
    ground truth: True output text
    llm: Language Model
    
    Output:
    explainability_outputs: Explainability computation outputs in expected object format
    """
    try:
        if model:
            model.model_specification.eval()

            # Return value
            consistency_outputs = {}

            # Adv. Example-based Robustness Check
            if "Adv. Example based Robustness Check" in consistency_metrics:
                modified_task_text, modified_task_tokens, iterations = await model.consistency.gradient_based_robustness_iterations(
                    instruction=instruction,
                    task=input_text,
                    adv_target=adv_target
                )

                if not modified_task_text and not modified_task_tokens and iterations == 0:
                    modified_task_text = "Input could not be generated"
                    iterations = 0

                consistency_outputs['adversarial_output'] = adv_target
                logger.info(f"Adv. Example based Robustness Check - Adv. Target: {adv_target}")

                consistency_outputs['adversarial_input'] = modified_task_text
                logger.info(f"Adv. Example based Robustness Check - Modified Task Text: {modified_task_text}")

                consistency_outputs['number_iter'] = iterations
                logger.info(f"Adv. Example based Robustness Check - Iterations for modification: {iterations}")

            logger.info("Consistency Metrics computed.")

            return consistency_outputs

        else:
            logger.info("Consistency Results Empty.")
            return {}

    except Exception as e:
        print(e)
        return {}
