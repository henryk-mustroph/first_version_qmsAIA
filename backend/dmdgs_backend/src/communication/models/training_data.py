import uuid
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

from communication.models.training_data_check import TrainingDataCheck
from communication.models.language_model import LanguageModel
from communication.models.domain import Domain
from communication.models.type import Type


class TrainingData(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    name: str = Field(...)
    origin: Optional[str] = Field(default="General Open Source Data")
    type: Type = Field(...)
    domain: Domain = Field(...)
    size: Optional[str] = Field(...)
    llms: list[LanguageModel] = Field(...)
    training_data_check: Optional[TrainingDataCheck] = Field(default=None)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "training_data": {
                "id": "test01",
                "name": "GLUE",
                "origin": "General Open Source Data",
                "type": {"id": "test01", "name": "Text"},
                "domain": {"id": "test01", "name": "Medical"},
                "size": "25GB",
                "llms": [{"id": "test01", "name": "LLama2"}],
                "training_data_check": {"id": "test01",
                                        "description": "Data is proved according to GPAI signed by xyz."}
            },
        }
    )
