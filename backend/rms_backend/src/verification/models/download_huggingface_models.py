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
