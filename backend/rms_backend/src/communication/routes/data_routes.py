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
from communication.models.data import Data

router = APIRouter()


# CREATE a new Data object:
@router.post("/", response_description="Create a new data object", status_code=status.HTTP_201_CREATED,
             response_model=Data)
async def create_data(db=Depends(connect_to_db), data: Data = Body(...)):
    try:
        data_dict = jsonable_encoder(data)
        new_data = await db["data"].insert_one(data_dict)
        created_data = await db["data"].find_one({"_id": new_data.inserted_id})
        return created_data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# GET all Data
@router.get("/", response_description="Get all distinct data", response_model=list[Data])
async def get_all_data(db=Depends(connect_to_db)):
    data = []
    cursor = db["data"].find({})
    async for d in cursor:
        data.append(d)
    return data


# GET all Types of Data
@router.get("/types/", response_description="Get all distinct types of data", response_model=list[str])
async def get_all_distinct_tasks_of_data(db=Depends(connect_to_db)):
    type_list = []
    cursor = db["data"].find({})
    async for data in cursor:
        type_d = data["type"]
        if not type_d in type_list:
            type_list.append(type_d)
    return type_list


# GET all Tasks of Data
@router.get("/tasks/", response_description="Get all distinct tasks of data", response_model=list[str])
async def get_all_distinct_tasks_of_data(db=Depends(connect_to_db)):
    task_descr_list = []
    cursor = db["data"].find({})
    async for data in cursor:
        task = data["task"]
        if not task in task_descr_list:
            task_descr_list.append(task)
    return task_descr_list


# GET all Data by domain and type:
@router.get("/{domain_id}/{type}/", response_description="Get the data by domain and type", response_model=list[Data])
async def get_all_data_by_domain_and_type(domain_id: str, type: str, db=Depends(connect_to_db)):
    # Output list
    data_list = []
    # Build the filter query
    query = {"domain._id": domain_id, "type": type}
    cursor = db["data"].find(query)
    async for data in cursor:
        data_list.append(data)
    return data_list
