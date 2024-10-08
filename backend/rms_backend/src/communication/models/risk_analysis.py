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

from communication.models.language_model import LanguageModel
from communication.models.metric import Metric
from communication.models.data import Data


class RiskAnalysis(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    language_model: LanguageModel = Field(...)
    data: list[Data] = Field(...)
    metrics: list[Metric] = Field(...)
    results: Optional[list] = Field(default=None)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "risk_analysis": {
                "id": "test01",
                "language_model": {"name": "LLama2-7b", "size": "24.74 GB GPU RAM"},
                "data": [{
                    "id": "test01",
                    "domain": {"id": "test01", "name": "Medicine / Phramacy"},
                    "type": "Legal Guideline",
                    "source": "Medicinal Products Act: Section 10 Labelling",
                    "input_text": "(1) Finished medicinal products that are not intended for clinical trials and are not exempted from the obligation to obtain a marketing authorisation pursuant to section 21 (2) no. 1a, 1b or 3 may only be placed on the market within the purview of this Act provided that the following information is displayed on the containers and, where used, on the outer packaging in easily legible and indelible characters, in readily comprehensible German and pursuant to the details referred to in section 11a",
                    "tasks": {"Summarization": "Summarize the following text:"},
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
        },
    )
