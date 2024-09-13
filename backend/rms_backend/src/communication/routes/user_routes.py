import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder

from communication.database_connector.db_connector import connect_to_db
from communication.models.user import User
from communication.models.risk_assessment import RiskAssessment

router = APIRouter()


# CREATE a User:
@router.post("/", response_description="Create a new user", status_code=status.HTTP_201_CREATED, response_model=User)
async def create_user(db=Depends(connect_to_db), user: User = Body(...)):
    try:
        user_dict = jsonable_encoder(user)
        user = await db["users"].find_one({"_id": user_dict['_id']})
        if not user:
            new_user = await db["users"].insert_one(user_dict)
            created_user = await db["users"].find_one({"_id": new_user.inserted_id})
            return created_user
        else:
            return user
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# GET all users
@router.get("/", response_description="Get all users", response_model=list[User])
async def get_all_users(db=Depends(connect_to_db)):
    users = []
    query = {}
    cursor = db["users"].find(query)
    async for user in cursor:
        users.append(user)
    return users


# GET a User:
@router.get("/{user_id}/", response_description="Get a single user", response_model=User)
async def get_user(user_id: str, db=Depends(connect_to_db)):
    query = {"_id": user_id}
    user = await db["users"].find_one(query)
    if user:
        return user
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User {user_id} not found")


# GET all risk assessment of user with user id:
@router.get("/{user_id}/risk_assessments/", response_description="Get all risk assessments stored in the user",
            response_model=list[RiskAssessment])
async def get_all_risk_assessments_of_user(user_id: str, db=Depends(connect_to_db)):
    try:
        # Get user with id
        query = {"_id": user_id}
        user = await db["users"].find_one(query)
        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User {user_id} not found")

        # Get a list of risk assessments:
        risk_assessment_ids = user.get('risk_assessments', [])
        if not risk_assessment_ids:
            return []
        else:
            risk_assessments = []
            for risk_assessment_id in risk_assessment_ids:
                query = {"_id": risk_assessment_id}
                risk_assessment = await db["risk_assessments"].find_one(query)
                if risk_assessment is not None:
                    risk_assessments.append(risk_assessment)
            return risk_assessments
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
