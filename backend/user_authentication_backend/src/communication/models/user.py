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
