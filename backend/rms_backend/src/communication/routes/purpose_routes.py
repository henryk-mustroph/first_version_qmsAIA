from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder

from communication.database_connector.db_connector import connect_to_db
from communication.models.purpose import Purpose

router = APIRouter()


@router.post("/", response_description="Create a new Purpose", status_code=status.HTTP_201_CREATED,
             response_model=Purpose)
async def create_purpose(db=Depends(connect_to_db), purpose: Purpose = Body(...)):
    """

    """
    try:
        purpose_dict = jsonable_encoder(purpose)
        new_purpose = await db["purposes"].insert_one(purpose_dict)
        created_purpose = await db["purposes"].find_one({"_id": new_purpose.inserted_id})
        return created_purpose
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/", response_description="Get all Purposes", response_model=list[Purpose])
async def get_all_purposes(db=Depends(connect_to_db)):
    """

    """
    purposes = []
    query = {}
    cursor = db["purposes"].find(query)
    async for purpose in cursor:
        purposes.append(purpose)
    return purposes


@router.get("/{purpose_id}/", response_description="Get a single Purpose", response_model=Purpose)
async def get_purpose_by_id(purpose_id: str, db=Depends(connect_to_db)):
    """

    """
    query = {"_id": purpose_id}
    purpose = await db["purposes"].find_one(query)
    if purpose:
        return purpose
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Purpose with {purpose_id} id not found!")
