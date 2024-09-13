import uuid
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

from communication.models.language_model import LanguageModel
from communication.models.domain import Domain
from communication.models.capability import Capability
from communication.models.purpose import (Purpose)
from communication.models.llm_user import LLMUser
from communication.models.llm_subject import LLMSubject


class RiskIdentification(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    language_model: LanguageModel = Field(...)
    domain: Domain = Field(...)
    capability: Capability = Field(...)
    purpose: Purpose = Field(...)
    llm_user: LLMUser = Field(...)
    llm_subject: Optional[LLMSubject] = Field(default=None)
    risk_class: Optional[dict] = Field(default=None)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "risk_identification": {
                "id": "test01",
                "language_model": {"name": "LLama2-7b", "size": "24.74 GB GPU RAM"},
                "domain": {"id": "test01", "name": "Medicine / Phramacy"},
                "capability": {"id": "test01", "name": "Automated Decision Making"},
                "purpose": {"id": "test01", "name": "Verification of LLM"},
                "llm_user": {"id": "test01", "name": "Tester"},
                "llm_subject": {"id": "test01", "name": "Automated Tool"},
                "risk_class": {"name": "high_risk",
                               "reason": "model is integrated into medical domain for patient treatment",
                               "potential_obligations": [9, 11, 12, 13, 14, 15],
                               "suggestion": "",
                               "potential_technical_risks": {"performance": "...",
                                                             "consistency": "...",
                                                             "explainability": "...",
                                                             "fairness": "...",
                                                             "security": "..."
                                                             }}
            }
        },
    )
