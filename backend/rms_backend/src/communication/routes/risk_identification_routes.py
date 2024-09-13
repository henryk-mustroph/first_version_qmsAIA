from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder

from communication.database_connector.db_connector import connect_to_db
from communication.models.risk_identification import RiskIdentification

router = APIRouter()


def determine_risk_class(llm, domain, capability, purpose):
    """
    
    Output that will be included to the risk class

    """
    name = ""
    reason = ""
    potential_obligations = []
    suggestion = ""
    potential_technical_risks = {"performance": [], "consistency_explainability": [], "fairness": [], "security": []}

    special_model = ["language_model"]

    high_risk_domains = ['Administration of justice',
                         'Critical Infrastructure',
                         'Education Vocational training',
                         'Employment/ Workers Management',
                         'Public service',
                         'Law enforcement',
                         'Migration/ Border Control management']

    high_risk_purpose = ['Automated decision making in the medical/ pharmaceutical, finance, or law domain',
                         'Assessing risk of criminal offenses, personally traits, irregular immigration',
                         'Interpreting law and compliance texts for automatic checks',
                         'Creating, analysing, evaluating educational outcome',
                         'Job application analysis and filtering']

    high_risk_capability = ['Summarization', 'Translation', 'Emotion recognition']

    if ((domain["name"] in high_risk_domains and capability["name"] in high_risk_capability) or (
            purpose["name"] in high_risk_purpose and capability["name"] in high_risk_capability)):
        name = "GPAI system and high risk AI system"
        reason = f"The AI system has high risk because it is in the domain: {domain['name']} and has the capability: {capability['name']}. This analysis is according to the information of Annex 3 of the EU AIA."

        potential_obligations = [53, 55, 9, 10, 11, 12, 13, 14, 15, 61]
        suggestion = ""
        potential_technical_risks["performance"] = [
            'Bad Accuracy: Values less than 50% states that model has problem to process, the input data, or does not understandthe task in a given domain.',
            'LLMs trained on one domain may struggle to generalize to new or unseen domains, leading to poor performance in certain contexts.',
            'Over time, the performance of LLMs may degrade due to changes in the input distribution, concept drift, or model updates.'
        ]
        potential_technical_risks["consistency_explainability"] = [
            'LLMs may generate inconsistent outputs for similar inputs, raising concerns about reliability and trustworthiness.',
            'LLMs decision-making processes are often not transparent, making it difficult to understand how they arrive at their outputs, which can undermine trust and makes it mor complicated for users to understand the output generation.'
        ]
        potential_technical_risks['fairness'] = [
            'LLMs trained on biased data may perpetuate or exacerbate existing societal biases, leading to unfair treatment of certain groups or individuals.',
            'Assessing the fairness of LLMs requires careful consideration of various fairness metrics and may involve trade-offs between different fairness criteria.'
        ]
        potential_technical_risks['security'] = [
            'LLMs are susceptible to adversarial attacks, where malicious inputs are crafted to manipulate their outputs, potentially leading to security breaches or misinformation propagation.',
            'LLMs trained on sensitive or personal data may inadvertently disclose sensitive information, raising privacy concerns and legal implications.'
        ]
    else:
        name = "GPAI system and limited AI system"
        reason = "The AI system has limited risk because it is not in a critical domain or has a critical purpose"
        potential_obligations = [53, 55]
        suggestion = ""

    risk_class_dict = {"name": name,
                       "reason": reason,
                       "potential_obligation": potential_obligations,
                       "suggestion": suggestion,
                       "potential_technical_risks": potential_technical_risks
                       }

    return risk_class_dict


@router.post("/", response_description="Create a new Risk Identification", status_code=status.HTTP_201_CREATED,
             response_model=RiskIdentification)
async def create_risk_identification(db=Depends(connect_to_db), risk_identification: RiskIdentification = Body(...)):
    """

    """
    try:
        risk_identification_dict = jsonable_encoder(risk_identification)

        # Determine risk class:
        llm = risk_identification_dict['language_model']
        domain = risk_identification_dict['domain']
        capability = risk_identification_dict['capability']
        purpose = risk_identification_dict['purpose']
        risk_class = determine_risk_class(llm=llm, domain=domain, capability=capability, purpose=purpose)
        risk_identification_dict['risk_class'] = risk_class

        new_risk_identification = await db["risk_identifications"].insert_one(risk_identification_dict)
        created_risk_identification = await db["risk_identifications"].find_one({"_id": new_risk_identification.inserted_id})
        return created_risk_identification
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/", response_description="Get all Risk Identifications", response_model=list[RiskIdentification])
async def get_all_risk_identifications(db=Depends(connect_to_db)):
    """

    """
    risk_identifications = []
    query = {}
    cursor = db["risk_identifications"].find(query)
    async for risk_identification in cursor:
        risk_identifications.append(risk_identification)
    return risk_identifications


@router.get("/{risk_identification_id}/", response_description="Get a single Risk Identification",
            response_model=RiskIdentification)
async def get_risk_identification_by_id(risk_identification_id: str, db=Depends(connect_to_db)):
    """

    """
    query = {"_id": risk_identification_id}
    risk_identification = await db["risk_identifications"].find_one(query)
    if risk_identification:
        return risk_identification
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Risk Identification Categorization with {risk_identification_id} id not found!")


@router.delete("/{risk_identification_id}/",
               response_description="Delete a risk assessment from a user")
async def delete_risk_identification(risk_identification_id: str, db=Depends(connect_to_db)):
    """

    """
    try:
        # Find the user by user_id
        query_risk_identification = {"_id": risk_identification_id}
        risk_ident = await db["risk_identifications"].find_one(query_risk_identification)
        if risk_ident is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Risk Identification not found")

        # Delete the risk assessment from 'risk_assessments' collection
        await db["risk_identifications"].delete_one({"_id": risk_identification_id})
        # Return a success message or any relevant data (optional)
        return {"detail": "Risk Identification deleted successfully."}

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
