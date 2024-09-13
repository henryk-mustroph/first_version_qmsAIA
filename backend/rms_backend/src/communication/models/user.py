import uuid
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class User(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    risk_assessments: Optional[list[str]] = Field(default=[])

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "user": {
                "id": "test01",
                "risk_assessments": ["test01"]
            },
        }
    )
