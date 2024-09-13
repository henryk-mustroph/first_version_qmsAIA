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

import uuid
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from passlib.context import CryptContext

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class User(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    username: str
    email: Optional[str]
    password: str = Field(...)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "testuser": {
                "id": "tets_id",
                "username": "testuser",
                "email": "testuser@example.com",
                "password": pwd_context.hash("test_password"),
                "disabled": False,
            },
        }
    )
