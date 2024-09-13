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
from communication.models.purpose import Purpose

router = APIRouter()


@router.post("/", response_description="Create a new Purpose", status_code=status.HTTP_201_CREATED,
             response_model=Purpose)
async def create_purpose(db=Depends(connect_to_db), purpose: Purpose = Body(...)):
    """

    """
    try:
        purpose_dict = jsonable_encoder(purpose)
        new_purpose = await db["purposes"].insert_one(purpose_dict)
        created_purpose = await db["purposes"].find_one({"_id": new_purpose.inserted_id})
        return created_purpose
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/", response_description="Get all Purposes", response_model=list[Purpose])
async def get_all_purposes(db=Depends(connect_to_db)):
    """

    """
    purposes = []
    query = {}
    cursor = db["purposes"].find(query)
    async for purpose in cursor:
        purposes.append(purpose)
    return purposes


@router.get("/{purpose_id}/", response_description="Get a single Purpose", response_model=Purpose)
async def get_purpose_by_id(purpose_id: str, db=Depends(connect_to_db)):
    """

    """
    query = {"_id": purpose_id}
    purpose = await db["purposes"].find_one(query)
    if purpose:
        return purpose
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Purpose with {purpose_id} id not found!")
