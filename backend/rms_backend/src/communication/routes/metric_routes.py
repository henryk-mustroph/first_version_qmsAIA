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

from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder

from communication.database_connector.db_connector import connect_to_db
from communication.models.metric import Metric

router = APIRouter()


@router.post("/", response_description="Create a new metric", status_code=status.HTTP_201_CREATED,
             response_model=Metric)
async def create_metric(db=Depends(connect_to_db), metric: Metric = Body(...)):
    """

    """
    try:
        metric_dict = jsonable_encoder(metric)
        new_metric = await db["metrics"].insert_one(metric_dict)
        created_metric = await db["metrics"].find_one({"_id": new_metric.inserted_id})
        return created_metric
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/", response_description="Get all Metrics", response_model=list[Metric])
async def get_all_metrics(db=Depends(connect_to_db)):
    """

    """
    metrics = []
    query = {}
    cursor = db["metrics"].find(query)
    async for metric in cursor:
        metrics.append(metric)
    return metrics


@router.get("/{metric_id}/", response_description="Get a single Metric", response_model=Metric)
async def get_purpose_by_id(metric_id: str, db=Depends(connect_to_db)):
    """

    """
    query = {"_id": metric_id}
    metric = await db["metrics"].find_one(query)
    if metric:
        return metric
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Purpose with {metric_id} id not found!")


@router.get("/type/{metric_type}/", response_description="Get all metrics by type", response_model=list[Metric])
async def get_all_metrics_by_type(metric_type: str, db=Depends(connect_to_db)):
    """

    """
    metrics = []
    query = {"type": metric_type}
    metrics_by_type = db["metrics"].find(query)
    async for metric in metrics_by_type:
        metrics.append(metric)
    return metrics
