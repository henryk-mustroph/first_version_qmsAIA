import uuid
from pydantic import BaseModel, ConfigDict, Field


class Capability(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    name: str = Field(...)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "capability": {
                "id": "test01",
                "name": "Automated Decision Making"
            }
        },
    )
