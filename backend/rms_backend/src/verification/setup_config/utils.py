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

import os
import subprocess
from dotenv import load_dotenv


async def login_to_huggingface():
    """
    Login to huggingface to use the open-accessible large language models
    """
    # Load the .env file
    load_dotenv()

    # Get the access token from the environment variables
    access_token = os.getenv("ACCESS_TOKEN")

    if not access_token:
        print("ACCESS_TOKEN not found in .env file")
        return

    try:
        # Login to Hugging Face using the access token
        subprocess.run(["huggingface-cli", "login", "--token", access_token], check=True)
        print("Login successful!")

        # Verify the login by checking the current user
        subprocess.run(["huggingface-cli", "whoami"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error during login: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
