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
import './Consistency.css'; // Import CSS file here

const Consistency = ({data}) => {

    const [parsedData, setParsedData] = useState([]);
    const [hasData, setHasData] = useState(true);

    useEffect(() => {
        const consistencyData = parseConsistency(data);
        setParsedData(consistencyData);
        setHasData(consistencyData.length > 0);
    }, [data]);

    const parseConsistency = (jsonData) => {
        const data_list = Object.values(jsonData);
        let dataInfoValues = [];
        let consistency = [];
        const consistencyData = [];
        let mergedInfoConsistency = {};

        for (let i = 0; i < data_list.length; i++) {
            dataInfoValues = data_list[i]["data"];
            consistency = data_list[i]["consistency"];
            if (Object.keys(consistency).length === 0) {
                continue;  // Skip this item if consistency is empty
            }
            mergedInfoConsistency = Object.assign({}, dataInfoValues, consistency);
            consistencyData.push(mergedInfoConsistency);
        }
        return consistencyData;
    };

    if (!hasData) {
        return (
            <div>
                <h3 style={{textAlign: 'center'}}>Consistency Metrics Results</h3>
                <p style={{textAlign: 'center'}}>No data available!</p>
            </div>
        );
    }

    return (
        <div>
            <h3 style={{textAlign: 'center'}}>Consistency Metrics Results</h3>

            <p style={{textAlign: 'left'}}>
                <strong>Adversarial-based Consistency Check:</strong> <br/>
                <span>This metric shows the new generated input metric that was computed to predict a wrong output
                    sequence.
                    The number of iterations to do so is depicted.
                </span>
            </p>

            {parsedData.map((item, index) => (
                <div key={index}>

                    <p style={{textAlign: 'left'}}>
                        <strong>Ground Truth Output:</strong> <br/>
                        <span style={{color: 'green'}}>{item.gt_text}</span>
                    </p>

                    <p style={{textAlign: 'left'}}>
                        <strong>Adversarial Output:</strong> <br/>
                        <span style={{color: 'red'}}>{item.adversarial_output}</span>
                    </p>

                    <p style={{textAlign: 'left'}}>
                        <strong>Generated Adversarial Input:</strong> <br/>
                        <span style={{color: 'red'}}>{item.adversarial_input}</span>
                    </p>

                    <div className='consistency-table-container'>
                        <table className="consistency-table">
                            <thead>
                            <tr>
                                <th>Data Type</th>
                                <th>Number of Iterations, to generate adversarial input</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{item.type}</td>
                                <td>{item.number_iter}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            ))}
        </div>
    );
};

export default Consistency;
