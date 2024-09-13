# Quality Managment System for LLMs based on the EU Artificial Intelligence Act Project

## Overview

The prototype QMS for LLMs is part of a research project and provides a proof of concept on how to build a software that varifies and documents high-risk AI and GPAI systems according to the EU AIA regulations.

A Quality Management System according to Article 17 of the EU AIA. It incorporates a Risk Management System (Article 9 EU AIA) and a Data Management and Governance System (Article 10 EU AIA).

### Project Structure

- **Main Path**: `qms_llm`
- **Frontend**: `qms_llm_frontend`
- **Backends**:
  - `api_gateway`
  - `dmdgs_backend`
  - `rms_backend`
  - `user_authentication`

## Building and running your application with Docker

The frontend and the Backend contain several docker container

navigate to: `/frontend` and `/backend` respectively and execute: `docker compose up --build`.

Your application will be available at http://localhost:3000/qmsAIA.

### References
* [Docker's Node.js guide](https://docs.docker.com/language/nodejs/)


## Building and running your application

### Prerequisites

- Python 3.11.7
- Conda for environment management
- Node.js and npm (for React.js frontend)
- MongoDB Atlas account and API token

### Setup Instructions

#### Backend Setup
1. **Conda Environment Setup**:
  - Ensure you have Conda installed. If not, download and install it from [here](https://docs.conda.io/projects/conda/en/latest/user-guide/install/index.html).
  - Navigate to the main project path `qms_llm`.
  - Create the Conda environment using the provided `.yml` file:
    ```sh
    conda env create -f environment.yml
    ```
  - Activate the environment:
    ```sh
    conda activate risk_est_llm
    ```
2. **Backend Services**:
  - Each backend service (`api_gateway`, `dmdgs_backend`, `rms_backend`) can be started individually.
  - Navigate to each backend directory and start the service:
    ```sh
    cd api_gateway
    python3 run_backend.py
    ```
    Repeat this process for `dmdgs_backend` and `rms_backend`.
3. **GPU Capcabilities and Huggingface**:
  - To run the technical evaluation metrics and to access the LLMs, a HuggingFace API token is required.
  - The metrics must be run for a 7B model or larger at least on 24GB GPU.

#### Frontend Setup
1. **Install Dependencies**:
   - Navigate to the frontend directory `qms_llm_frontend`.
   - Install the required packages using npm:
     ```sh
     npm install
     ```
2. **Start the Frontend**:
   - After installing the dependencies, start the frontend development server:
     ```sh
     npm start
     ```

#### Database Setup
1. **MongoDB Atlas**:
   - Create an account on MongoDB Atlas [here](https://www.mongodb.com/cloud/atlas).
   - Create a new cluster and get the connection string.
   - Generate an API token for your application.
   - Note the database name, as it will be required for configuration.

2. **Create `.env` file in  `dmdgs_backend/src/communication/database_connector` and `rms_backend/src/communication/database_connector`**:
    - Insert two lines into the `.env` file: ATLAS_URI, DB_NAME

#### Verification Component in RMS
1. **Hugging Face**:
  - Make an account on Hugging Face [here](https://huggingface.co/settings/tokens).
  - Get API token
  - In the `./verification` directory of the RMS, when running the `main.py` file add your API token.
2. **GPU Resources**:
  - Use the formula provided in the paper to calculate the GPU VRAM to execute the technical metrics on a choosen LLM, for a batch size of one.
  
## Licence
The licence is given in the main path of the project. 

Corresponding preprint:
@article{mustroph2024design,
  title={Design of a Quality Management System based on the EU Artificial Intelligence Act},
  author={Mustroph, Henryk and Rinderle-Ma, Stefanie},
  journal={arXiv preprint arXiv:2408.04689},
  year={2024}
}

RMS_SERVICE_URL=http://127.0.0.1:5001
DMDGS_SERVICE_URL=http://127.0.0.1:5002
USER_AUTH_SERVICE_URL=http://127.0.0.1:5003