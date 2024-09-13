from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import os


def download_model(model_path, model_name):
    """Download a Hugging Face model and tokenizer to the specified directory"""
    try:
        # Check if the directory already exists
        if not os.path.exists(model_path):
            # Create the directory
            os.makedirs(model_path)

        model = AutoModelForCausalLM.from_pretrained(
            model_name,
            device_map='auto',
            torch_dtype=torch.float16,
            use_cache=False,
            trust_remote_code=True
        )
        tokenizer = AutoTokenizer.from_pretrained(
            model_name,
            trust_remote_code=True
        )

        # Save the model and tokenizer to the specified directory
        model.save_pretrained(model_path)
        tokenizer.save_pretrained(model_path)

        print(f"Model and tokenizer saved to {model_path}")

    except Exception as e:
        print(f"Error: {e}")
        raise


if __name__ == "__main__":
    # Set the path where you want to save the model
    model_path = 'app/models/Phi3-mini-128k'
    model_name = "microsoft/Phi-3-mini-128k-instruct"
    download_model(model_path, model_name)
