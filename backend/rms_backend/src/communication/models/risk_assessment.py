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

from communication.models.risk_identification import RiskIdentification
from communication.models.risk_analysis import RiskAnalysis


class RiskAssessment(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    timestamp: str = Field(...)
    risk_identification: RiskIdentification = Field(...)
    risk_analysis: Optional[RiskAnalysis] = Field(...)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "RiskAssessment": {
                "id'": "test01",
                "timestamp": "05-05-2023",
                "risk_identification": {
                    "id": "test01",
                    "language_model": {"name": "LLama2-7b", "size": "24.74 GB GPU RAM"},
                    "domain": {"id": "test01", "name": "Medicine / Phramacy"},
                    "capability": {"id": "test01", "name": "Automated Decision Making"},
                    "purpose": {"id": "test01", "name": "Verification of LLM", },
                    "llm_user": {"id": "test01", "name": "Tester"},
                    "llm_subject": {"id": "test01", "name": "Automated Tool"},
                    "risk_class": "high-level risk"
                },
                "risk_analysis": {
                    "id": "test01",
                    "language_model": {
                        "name": "LLama2-7b",
                        "size": "24.74 GB GPU RAM"
                    },
                    "data": [{
                        "id": "test01",
                        "domain": {"id": "test01", "name": "Medicine / Phramacy"},
                        "type": "Legal Guideline",
                        "source": "Medicinal Products Act: Section 10 Labelling",
                        "input_text": "(1) Finished medicinal products that are not intended for clinical trials and are not exempted from the obligation to obtain a marketing authorisation pursuant to section 21 (2) no. 1a, 1b or 3 may only be placed on the market within the purview of this Act provided that the following information is displayed on the containers and, where used, on the outer packaging in easily legible and indelible characters, in readily comprehensible German and pursuant to the details referred to in section 11a",
                        "prompt": {"Summarization": "Summarize the following text:"},
                        "gt_text": {}
                    }],
                    "metrics": [{
                        "id": "test01",
                        "type": "Performance",
                        "name": "Accuracy",
                        "description": "This metric comtues the LLM's task success rate by calculating (TP + TN) / (TP + TN + FP + FN), where TP is defined as ..."
                    }],
                    "results": {"performance": {'accuracy': 0.7}, "consistency": {}, "explainability": {}}
                }
            }
        },
    )
