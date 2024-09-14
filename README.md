# First Version of the Quality Managment System for AI Systems based on the EU Artificial Intelligence Act

## Overview

The prototype QMS is part of a research project and provides a proof-of-concept on how to build a SaaS web application that varifies and documents high-risk AI and GPAI systems according to the EU AIA regulations.

The first version prototype QMS according to Article 17 of the EU AIA incorporates a Risk Management System (Art. 9 EU AIA) and a Data Management and Governance System (Art. 10 EU AIA).

## Access Prototype as Web Application:

https://power.bpm.cit.tum.de/qmsAIA/

### Project Structure

- **Main Path**: `first_version_qmsAIA`
- **Frontend**: `frontend`
- **Backends**: `backend`:
  - `api_gateway`
  - `dmdgs_backend`
  - `rms_backend`
  - `user_authentication`

## Building and running your application with Docker (self-deployment)

### Prerequisites

#### Adding .env files:

**Add a .env file to `/backend`:**
  - `/api_gateway/src`: 
    `RMS_SERVICE_URL=http://x.x.x.x:5001`
    `DMDGS_SERVICE_URL=http://x.x.x.x:5002`
    `USER_AUTH_SERVICE_URL=http://x.x.x.x:5003`
  - Replace `x.x.x.x`with a valid host.

**Create `.env` file in  `dmdgs_backend/src/communication/database_connector`, `rms_backend/src/communication/database_connector` and `user_authentication_backend/src/communication/database_connector`**:
    - Insert two lines into the `.env` file: ATLAS_URI, DB_NAME

#### Change host address in frontend files:

The frontend and the backend contain docker container each:
Navigate to: `/frontend` and `/backend` respectively and execute: 
  - `docker compose build --no-cache && docker compose up --force-recreate`
  - `docker compose up`

Your application will be available at http://localhost:3000/qmsAIA.

## Database Setup

1. **MongoDB Atlas**:
   - Create an account on MongoDB Atlas [here](https://www.mongodb.com/cloud/atlas).
   - Create a new cluster and get the connection string.
   - Generate an API token for your application.
   - Note the database name, as it will be required for configuration.

## Verification Component in RMS

1. **Hugging Face**:
  - Make an account on Hugging Face [here](https://huggingface.co/settings/tokens).
  - Get API token
  - In the `./verification` directory of the RMS, when running the `main.py` file add your API token.
2. **GPU Resources**:
  - Use the formula provided in the paper to calculate the GPU VRAM to execute the technical metrics on a choosen LLM, for a batch size of one.
  
## Licence
The licence is given in the main path of the project: COPYING. 

Corresponding preprint:
Mustroph, H., & Rinderle-Ma, S. (2024). Design of a Quality Management System based on the EU Artificial Intelligence Act. arXiv preprint arXiv:2408.04689.

## Contact

For questions reach out to: henryk.mustroph@tum.de