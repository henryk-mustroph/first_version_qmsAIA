import uuid
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class Metric(BaseModel):
    id: Optional[str] = Field(default_factory=uuid.uuid4, alias="_id")
    type: str = Field(...)
    name: str = Field(...)
    description: Optional[str] = Field(default=None)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "metric": {
                "id": "test01",
                "type": "Performance",
                "name": "Accuracy",
                "description": "This metric comtues the LLM's task success rate by calculating (TP + TN) / (TP + TN + FP + FN), where TP is defined as ...",
            }
        },
    )
