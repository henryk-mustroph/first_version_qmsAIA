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
from communication.models.capability import Capability

router = APIRouter()


@router.post("/", response_description="Create a new Capability", status_code=status.HTTP_201_CREATED,
             response_model=Capability)
async def create_capability(db=Depends(connect_to_db), capability: Capability = Body(...)):
    """

    """
    try:
        capability_dict = jsonable_encoder(capability)
        new_capability = await db["capabilities"].insert_one(capability_dict)
        created_capability = await db["capabilities"].find_one({"_id": new_capability.inserted_id})
        return created_capability
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/", response_description="Get all Capabilities", response_model=list[Capability])
async def get_all_capabilities(db=Depends(connect_to_db)):
    """

    """
    capabilities = []
    query = {}
    cursor = db["capabilities"].find(query)
    async for capability in cursor:
        capabilities.append(capability)
    return capabilities


@router.get("/{capability_id}/", response_description="Get a single Capability", response_model=Capability)
async def get_capability(capability_id: str, db=Depends(connect_to_db)):
    """

    """
    query = {"_id": capability_id}
    capability = await db["capabilities"].find_one(query)
    if capability:
        return capability
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Capability with {capability_id} id not found!")
