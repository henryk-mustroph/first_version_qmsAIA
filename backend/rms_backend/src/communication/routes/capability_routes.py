from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder

from communication.database_connector.db_connector import connect_to_db
from communication.models.capability import Capability

router = APIRouter()


@router.post("/", response_description="Create a new Capability", status_code=status.HTTP_201_CREATED,
             response_model=Capability)
async def create_capability(db=Depends(connect_to_db), capability: Capability = Body(...)):
    """

    """
    try:
        capability_dict = jsonable_encoder(capability)
        new_capability = await db["capabilities"].insert_one(capability_dict)
        created_capability = await db["capabilities"].find_one({"_id": new_capability.inserted_id})
        return created_capability
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/", response_description="Get all Capabilities", response_model=list[Capability])
async def get_all_capabilities(db=Depends(connect_to_db)):
    """

    """
    capabilities = []
    query = {}
    cursor = db["capabilities"].find(query)
    async for capability in cursor:
        capabilities.append(capability)
    return capabilities


@router.get("/{capability_id}/", response_description="Get a single Capability", response_model=Capability)
async def get_capability(capability_id: str, db=Depends(connect_to_db)):
    """

    """
    query = {"_id": capability_id}
    capability = await db["capabilities"].find_one(query)
    if capability:
        return capability
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Capability with {capability_id} id not found!")
