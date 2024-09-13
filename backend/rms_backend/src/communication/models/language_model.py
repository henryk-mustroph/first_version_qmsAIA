import uuid
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class LanguageModel(BaseModel):
    id: Optional[str] = Field(default_factory=uuid.uuid4, alias="_id")
    name: str = Field(...)
    size: Optional[str] = Field(default=None)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "language_model": {
                "id": "test01",
                "name": "LLama2-7b",
                "size": "24.74 GB GPU RAM"
            }
        },
    )
