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
