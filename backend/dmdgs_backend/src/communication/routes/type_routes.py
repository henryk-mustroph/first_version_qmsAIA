from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder

from communication.database_connector.db_connector import connect_to_db
from communication.models.type import Type

router = APIRouter()


# Create a type:
@router.post("/", response_description="Create new type", status_code=status.HTTP_201_CREATED, response_model=Type)
async def create_type(db=Depends(connect_to_db), type: Type = Body(...)):
    try:
        type_dict = jsonable_encoder(type)
        new_type = db["types"].insert_one(type_dict)
        created_type = db["types"].find_one({"_id": new_type.inserted_id})
        return created_type
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# GET all types
@router.get("/", response_description="Get all types", response_model=list[Type])
async def get_all_types(db=Depends(connect_to_db)):
    types = []
    query = {}
    cursor = db["types"].find(query)
    for type in cursor:
        types.append(type)
    return types


# GET a type:
@router.get("/{type_id}/", response_description="Get a single type", response_model=Type)
async def get_user(type_id: str, db=Depends(connect_to_db)):
    query = {"_id": type_id}
    type = db["types"].find_one(query)
    if type:
        return type
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User {type_id} not found")
