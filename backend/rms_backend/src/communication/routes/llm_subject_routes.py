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
from communication.models.llm_subject import LLMSubject

router = APIRouter()


@router.post("/", response_description="Create a new LLM Subject", status_code=status.HTTP_201_CREATED,
             response_model=LLMSubject)
async def create_llm_subject(db=Depends(connect_to_db), llm_subject: LLMSubject = Body(...)):
    """

    """
    try:
        llm_subj_dict = jsonable_encoder(llm_subject)
        new_llm_subj = await db["llm_subjects"].insert_one(llm_subj_dict)
        created_llm_subj = await db["llm_subjects"].find_one({"_id": new_llm_subj.inserted_id})
        return created_llm_subj
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/", response_description="Get all LLM Subject", response_model=list[LLMSubject])
async def get_all_llm_subjects(db=Depends(connect_to_db)):
    """

    """
    users = []
    query = {}
    cursor = db["llm_subjects"].find(query)
    async for user in cursor:
        users.append(user)
    return users


@router.get("/{llm_subject_id}/", response_description="Get a single LLM Subject", response_model=LLMSubject)
async def get_llm_subject_by_id(llm_subject_id: str, db=Depends(connect_to_db)):
    """

    """
    query = {"_id": llm_subject_id}
    llm_subject = await db["llm_subjects"].find_one(query)
    if llm_subject:
        return llm_subject
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"LLM Subject with {llm_subject} id not found!")
