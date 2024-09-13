from fastapi import APIRouter, Request, HTTPException, Depends
import httpx
import logging
import os
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Environment variables for service URLs
USER_AUTH_SERVICE_URL = os.getenv("USER_AUTH_SERVICE_URL")
RMS_SERVICE_URL = os.getenv("RMS_SERVICE_URL")
DMDGS_SERVICE_URL = os.getenv("DMDGS_SERVICE_URL")

BACKEND_SERVICES = {
    "user_auth_service": USER_AUTH_SERVICE_URL,
    "rms_service": RMS_SERVICE_URL,
    "dmdgs_service": DMDGS_SERVICE_URL
}

# Define router
router = APIRouter()


# Forward the request to the backend service and send back response to the frontend
async def forward_request(request: Request, backend_url: str):
    try:
        method = request.method
        url = f"{backend_url}"
        headers = dict(request.headers)
        params = request.query_params
        body = await request.body()

        logger.info(f"Forwarding request to {url} with method {method}")

        async with httpx.AsyncClient(timeout=200.0) as client:
            response = await client.request(
                method, url, headers=headers, params=params, content=body
            )

        logger.info(f"Received response {response.status_code} from {url}")

        response.raise_for_status()  # Raise an exception for 4xx/5xx responses

        return response.json()

    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
    except httpx.RequestError as e:
        logger.error(f"Request error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


# Call the backend service and forward request to the service
@router.api_route("/{service}/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def gateway_handler(request: Request, service: str, path: str):
    if service not in BACKEND_SERVICES:
        raise HTTPException(status_code=404, detail="Service not found")

    backend_url = BACKEND_SERVICES[service] + "/" + path
    response = await forward_request(request, backend_url)

    return response