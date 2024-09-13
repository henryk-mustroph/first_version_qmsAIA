from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder

from communication.database_connector.db_connector import connect_to_db
from communication.models.language_model import LanguageModel

router = APIRouter()


@router.post("/", response_description="Create a new language model", status_code=status.HTTP_201_CREATED,
             response_model=LanguageModel)
async def create_language_model(db=Depends(connect_to_db), language_model: LanguageModel = Body(...)):
    """

    """
    try:
        language_model_dict = jsonable_encoder(language_model)
        new_language_model = await db["language_models"].insert_one(language_model_dict)
        created_language_model = await db["language_models"].find_one({"_id": new_language_model.inserted_id})
        return created_language_model
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/", response_description="Get all language models", response_model=list[LanguageModel])
async def get_all_users(db=Depends(connect_to_db)):
    """

    """
    users = []
    query = {}
    cursor = db["language_models"].find(query)
    async for user in cursor:
        users.append(user)
    return users


@router.get("/{llm_id}/", response_description="Get the language model by id", response_model=LanguageModel)
async def get_all_compliance_data_by_domain_and_type(llm_id: str, db=Depends(connect_to_db)):
    """

    """
    query = {"_id": llm_id}
    llm = await db["language_models"].find_one(query)
    if llm:
        return llm
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"LLM with {llm_id} id not found")
