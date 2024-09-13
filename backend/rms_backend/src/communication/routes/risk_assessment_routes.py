from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder

from communication.database_connector.db_connector import connect_to_db
from communication.models.risk_assessment import RiskAssessment
from communication.models.risk_analysis import RiskAnalysis

router = APIRouter()


@router.post("/", response_description="Create a new Risk Assessment", status_code=status.HTTP_201_CREATED)
async def create_risk_assessment(user_id: str = Body(...), risk_assessment: RiskAssessment = Body(...),
                                 db=Depends(connect_to_db)):
    """

    """
    try:
        # Convert RiskAssessment model to dict
        risk_assessment_dict = jsonable_encoder(risk_assessment)
        # Insert risk assessment into 'risk_assessments' collection
        new_risk_assessment = await db["risk_assessments"].insert_one(risk_assessment_dict)
        # Retrieve the inserted risk assessment document
        created_risk_assessment = await db["risk_assessments"].find_one({"_id": new_risk_assessment.inserted_id})
        # Update the user document to include the new risk assessment ID
        await db["users"].update_one(
            {"_id": user_id},
            {"$addToSet": {"risk_assessments": str(new_risk_assessment.inserted_id)}}
        )
        # Return the created risk assessment document (optional)
        return created_risk_assessment
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/", response_description="Get all Risk Assessments", response_model=list[RiskAssessment])
async def get_all_risk_assessments(db=Depends(connect_to_db)):
    """

    """
    risk_assessments = []
    query = {}
    cursor = db["risk_assessments"].find(query)
    async for risk_assessment in cursor:
        risk_assessments.append(risk_assessment)
    return risk_assessments


@router.get("/{risk_assessment_id}/", response_description="Get a single Risk Assessment",
            response_model=RiskAssessment)
async def get_risk_assessment_by_id(risk_assessment_id: str, db=Depends(connect_to_db)):
    """

    """
    query = {"_id": risk_assessment_id}
    risk_assessment = await db["risk_assessments"].find_one(query)
    if risk_assessment:
        return risk_assessment
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Purpose with {risk_assessment_id} id not found!")


@router.put("/{risk_assessment_id}/", response_description="Added risk analysis into risk assessment.",
            response_model=RiskAssessment)
async def update_risk_assessment_add_risk_analysis(risk_assessment_id: str, risk_analysis: RiskAnalysis = Body(...),
                                                   db=Depends(connect_to_db)
                                                   ):
    """

    """
    try:
        # Check that Risk Assessment with id exist:
        query = {"_id": risk_assessment_id}
        risk_assessment = await db["risk_assessments"].find_one(query)
        if risk_assessment is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Risk Assessment with id {risk_assessment_id} id not found!")

        # Check that Risk Analysis exists:
        risk_analysis_id = jsonable_encoder(risk_analysis)['_id']
        query = {"_id": risk_analysis_id}
        risk_analysis_doc = await db["risk_analyses"].find_one(query)
        if risk_analysis_doc is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Risk Analysis with id {risk_analysis_id} id not found!")

        # Update user with id and add risk assessment to the list of risk assessments
        risk_analysis_dict = risk_analysis.model_dump()
        await db["risk_assessments"].update_one({"_id": risk_assessment_id}, {"$set": {"risk_analysis": risk_analysis_dict}})
        updated_risk_assessment = await db["risk_assessments"].find_one({"_id": risk_assessment_id})
        return updated_risk_assessment
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.delete("/{user_id}/risk_assessment/{risk_assessment_id}/",
               response_description="Delete a risk assessment from a user")
async def delete_user_risk_assessment(user_id: str, risk_assessment_id: str, db=Depends(connect_to_db)):
    """

    """
    try:
        # Find the user by user_id
        query_user = {"_id": user_id}
        user = await db["users"].find_one(query_user)
        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        # Check if the risk assessment is in the user's list
        risk_assessments_user = user.get("risk_assessments", [])
        if risk_assessment_id not in risk_assessments_user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail="Risk Assessment not found in user's list")

        # Delete the risk assessment from 'risk_assessments' collection
        await db["risk_assessments"].delete_one({"_id": risk_assessment_id})

        # Remove the risk assessment ID from the user's list
        await db["users"].update_one({"_id": user_id}, {"$pull": {"risk_assessments": risk_assessment_id}})

        # Return a success message or any relevant data (optional)
        return {"detail": "Risk assessment deleted successfully."}

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
