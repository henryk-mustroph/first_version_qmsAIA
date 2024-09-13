/*
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
*/

import React, {useState, useEffect} from 'react';

import './RiskIdentificationResult.css'

const RiskIdentificationResults = ({data}) => {
    const [parsedData, setParsedData] = useState(null);

    useEffect(() => {
        console.log('Loading risk identification data:', data);
        setParsedData(data);
    }, [data]);

    if (!parsedData) {
        return <div>Loading...</div>;
    }

    // Helper function to render list items
    const renderListItems = (items) => (
        items.map((item, index) => <li key={index}>{item}</li>)
    );

    return (
        <div>
            <h3 style={{textAlign: 'center'}}>Risk Identification Class Results</h3>

            <div>
                <p style={{textAlign: 'left'}}><strong>Determined Risk Class:</strong> <br/>
                    <span style={{textAlign: 'left'}}>{parsedData.name} </span>
                </p>
            </div>

            <div>
                <p style={{textAlign: 'left'}}><strong>Reason for Risk Class determination:</strong> <br/>
                    <span style={{textAlign: 'left'}}>{parsedData.reason}</span>
                </p>
            </div>

            <div>
                <p style={{textAlign: 'left'}}><strong>Potential Obligations that must be checked for model:</strong>
                    <br/>
                    <span style={{textAlign: 'left'}}>Articles {parsedData.potential_obligation.join(', ')}
                        of the EU Artificial Intelligence Act.
                    </span>
                </p>
            </div>

            <div>
                <p style={{textAlign: 'left'}}><strong>Suggestions:</strong> <br/>
                    <span style={{textAlign: 'left'}}>{parsedData.suggestion}</span>
                </p>

            </div>

            <div className="metrics-risk-box">
                <h3>Potential Technical Risks</h3>

                <div>
                    <p style={{textAlign: 'left'}}><strong>Performance</strong></p>
                    <ul style={{textAlign: 'left'}}>
                        {renderListItems(parsedData.potential_technical_risks.performance)}
                    </ul>
                </div>

                <div>
                    <p style={{textAlign: 'left'}}><strong>Consistency and Explainability</strong></p>
                    <ul style={{textAlign: 'left'}}>
                        {renderListItems(parsedData.potential_technical_risks.consistency_explainability)}
                    </ul>
                </div>

                <div>
                    <p style={{textAlign: 'left'}}><strong>Fairness</strong></p>
                    <ul style={{textAlign: 'left'}}>
                        {renderListItems(parsedData.potential_technical_risks.fairness)}
                    </ul>
                </div>

                <div>
                    <p style={{textAlign: 'left'}}><strong>Security</strong></p>
                    <ul style={{textAlign: 'left'}}>
                        {renderListItems(parsedData.potential_technical_risks.security)}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default RiskIdentificationResults;
