from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder

from communication.database_connector.db_connector import connect_to_db
from communication.models.llm_user import LLMUser

router = APIRouter()


@router.post("/", response_description="Create a new LLM User", status_code=status.HTTP_201_CREATED,
             response_model=LLMUser)
async def create_llm_user(db=Depends(connect_to_db), llm_user: LLMUser = Body(...)):
    """

    """
    try:
        llm_user_dict = jsonable_encoder(llm_user)
        new_llm_user = await db["llm_users"].insert_one(llm_user_dict)
        created_llm_user = await db["llm_users"].find_one({"_id": new_llm_user.inserted_id})
        return created_llm_user
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/", response_description="Get all LLM User", response_model=list[LLMUser])
async def get_all_llm_users(db=Depends(connect_to_db)):
    """

    """
    llm_users = []
    query = {}
    cursor = db["llm_users"].find(query)
    async for llm_user in cursor:
        llm_users.append(llm_user)
    return llm_users


@router.get("/{llm_user_id}/", response_description="Get a single LLM User", response_model=LLMUser)
async def get_llm_user(llm_user_id: str, db=Depends(connect_to_db)):
    """

    """
    query = {"_id": llm_user_id}
    llm_user = await db["llm_users"].find_one(query)
    if llm_user:
        return llm_user
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"LLM User with {llm_user_id} id not found!")
