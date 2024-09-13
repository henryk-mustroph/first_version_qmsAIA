#
# This file is part of first_version_qmsAIA.
#
# first_version_qmsAIA is free software: you can redistribute it and/or modify it
# under the terms of the GNU Lesser General Public License as published by the
# Free Software Foundation, either version 3 of the License, or (at your
# option) any later version.
#
# social_network_miner_compliance_check is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more
# details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with first_version_qmsAIA (file COPYING in the main directory). If not, see
# http://www.gnu.org/licenses/.

from fastapi import APIRouter
from fastapi import HTTPException, status, Depends, Body
from fastapi.encoders import jsonable_encoder
import logging

from communication.database_connector.db_connector import connect_to_db
from communication.models.risk_analysis import RiskAnalysis
from verification.main import load_model, inference_model, compute_risk_results_performance, \
    compute_risk_results_explainability, \
    compute_risk_results_consistency

router = APIRouter()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def add_results(data, metrics, language_model):
    """
    Takes as input: data, metrics, and language model selected in the UI.
    Output: Technical Evalaution Results of LLM based on data and selected metrics
    """
    
    results = []

    try:
        # Sort metrics by type
        metrics_performance = [metric['name'] for metric in metrics if metric['type'] == 'Performance']
        metrics_explainability = [metric['name'] for metric in metrics if metric['type'] == 'Explainability']
        metrics_consistency = [metric['name'] for metric in metrics if metric['type'] == 'Consistency']

        logger.info(f"Metrics Performance: {metrics_performance}")
        logger.info(f"Metrics Consistency: {metrics_consistency}")
        logger.info(f"Metrics Explainability: {metrics_explainability}")

        # Check clicked metrics -> If no metric selected return empty result
        if not metrics_performance and not metrics_explainability and not metrics_consistency:
            logger.info("No metrics available")
            return results

        # Load model
        logger.info("Model loading starts.")
        model = await load_model(llm=language_model['name'])
        logger.info("Model loaded.")

        # Load the model -> If model is not loaded return empty result
        if not model or not model.model_loaded:
            return results

        # Check selected data -> Return empty result values when no data is selected
        if not data:
            results = [{"data": {}, "performance": {}, "explainability": {"results": []}, "consistency": {}}]
            return results

        # For each selected data value: Perform the following calculations:
        for d in data:
            instruction = d['instruction']
            input_text = d['input_text']
            ground_truth = d['gt_text']
            adversarial_target = d['adversarial_target']

            # Store data in result
            result_value = {
                'data': d,
                'performance': {},
                'explainability': {'results': []},
                'consistency': {}
            }

            logger.info("Inference is called.")
            # Inference the model
            output_text = await inference_model(model=model,
                                                input_text=input_text,
                                                instruction=instruction)

            logger.info(f"Inference is completed - Output text: {output_text}")

            # Compute performance metrics
            logger.info("Performance computations are called.")
            # Store performance values in the result
            result_value['performance'] = await compute_risk_results_performance(
                performance_metrics=metrics_performance,
                input_text=input_text,
                instruction=instruction,
                ground_truth=ground_truth,
                output_text=output_text,
                model=model)

            logger.info(f"Performance Result: {result_value['performance']}")
            logger.info("Performance computations finished.")

            # Compute explainability metrics
            logger.info("Explainability computations are called.")
            # Store explainability values in the result
            result_value['explainability'] = await compute_risk_results_explainability(
                explainability_metrics=metrics_explainability,
                input_text=input_text,
                instruction=instruction,
                ground_truth=ground_truth,
                model=model)

            logger.info(f"Explainability Result: {result_value['explainability']}")
            logger.info("Explainability computations finished.")

            # Compute consistency metrics
            logger.info("Consistency computations are called.")
            # Store consistency value in the result
            result_value['consistency'] = await compute_risk_results_consistency(
                consistency_metrics=metrics_consistency,
                input_text=input_text,
                instruction=instruction,
                adv_target=adversarial_target,
                model=model)

            logger.info(f"Consistency Result: {result_value['consistency']}")
            logger.info("Consistency computations finished.")

            # Append computed results to the list of results -> One result value for each data element
            results.append(result_value)

    except Exception as e:
        logger.error(f"Error in add_results: {e}")
        return results

    return results


@router.post("/", response_description="Create a new Risk Analysis", status_code=status.HTTP_201_CREATED,
             response_model=RiskAnalysis)
async def create_risk_analysis(db=Depends(connect_to_db), risk_analysis: RiskAnalysis = Body(...)):
    """
    Create a new Risk Analysis
    """
    try:
        logger.info("Starting create_risk_analysis")
        risk_analysis_dict = jsonable_encoder(risk_analysis)

        # Create results from data and metrics
        data = risk_analysis_dict['data']
        metrics = risk_analysis_dict['metrics']
        llm = risk_analysis_dict['language_model']

        logger.info("Calling add_results")
        try:
            # Wait for the add_results function to complete
            results = await add_results(data=data, metrics=metrics, language_model=llm)
            risk_analysis_dict['results'] = results
            logger.info("Updated and Dict inserted results: %s", results)
        except Exception as e:
            logger.error(f"Error in add_results: {e}")
            raise HTTPException(status_code=500, detail="Error generating results")

        logger.info("Inserting risk analysis into the database")
        new_risk_analysis = await db["risk_analyses"].insert_one(risk_analysis_dict)
        logger.info("Risk Analysis inserted!")

        logger.info("Fetching created risk analysis from the database")
        created_risk_analysis = await db["risk_analyses"].find_one({"_id": new_risk_analysis.inserted_id})
        logger.info("Created Risk Analysis: %s", created_risk_analysis)

        return created_risk_analysis

    except HTTPException as e:
        logger.error("HTTP Exception occurred: %s", e, exc_info=True)
        raise e
    except Exception as e:
        logger.error("Exception occurred: %s", e, exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/", response_description="Get all Risk Analyses", response_model=list[RiskAnalysis])
async def get_all_risk_analyses(db=Depends(connect_to_db)):
    """
    Get all Risk Analyses
    """
    risk_analyses = []
    query = {}
    cursor = db["risk_analyses"].find(query)
    async for risk_analysis in cursor:
        risk_analyses.append(risk_analysis)
    return risk_analyses


@router.get("/{risk_analysis_id}/", response_description="Get a single Risk Analysis",
            response_model=RiskAnalysis)
async def get_risk_analysis_by_id(risk_analysis_id: str, db=Depends(connect_to_db)):
    """
    Get a single Risk Analysis by id
    """
    query = {"_id": risk_analysis_id}
    risk_analysis = await db["risk_analyses"].find_one(query)
    if risk_analysis:
        return risk_analysis
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Purpose with {risk_analysis_id} id not found!")


@router.put("/{risk_analysis_id}/add_results/", response_description="Update Risk Analysis by adding Results",
            response_model=RiskAnalysis)
async def update_risk_analysis_add_results(risk_analysis_id: str, results: list = Body(...), db=Depends(connect_to_db)):
    """
    Update a Risk Analysis by adding the results to it
    """
    try:
        query = {"_id": risk_analysis_id}
        risk_analysis = await db["risk_analyses"].find_one(query)
        if not risk_analysis:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Purpose with {risk_analysis_id} id not found!")
        # Update risk analysis:
        await db["risk_analyses"].update_one({"_id": risk_analysis_id}, {"$set": {"results": results}})
        updated_risk_analysis = await db["risk_analyses"].find_one(query)

        # Update risk assessment in case the risk analysis is already in the risk assessment
        risk_assessment = await db["risk_assessments"].find_one({"risk_analysis._id": risk_analysis_id})
        if not risk_assessment:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Purpose with {risk_analysis_id} id not found!")
        await db["risk_assessments"].update_one({"_id": risk_assessment["_id"]},
                                                {"$set": {"risk_analysis": updated_risk_analysis}})

        return updated_risk_analysis
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.delete("/{risk_analysis_id}/",
               response_description="Delete risk identification")
async def delete_risk_analysis(risk_analysis_id: str, db=Depends(connect_to_db)):
    """
    Delete a Risk Analysis
    """
    try:
        # Find the user by user_id
        query_risk_analysis = {"_id": risk_analysis_id}
        risk_analysis = await db["risk_analyses"].find_one(query_risk_analysis)
        if risk_analysis is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Risk Analysis not found")

        # Delete the risk assessment from 'risk_assessments' collection
        await db["risk_analyses"].delete_one({"_id": risk_analysis_id})
        # Return a success message or any relevant data (optional)
        return {"detail": "Risk Analysis deleted successfully."}

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
