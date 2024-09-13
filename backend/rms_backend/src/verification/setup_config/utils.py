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
