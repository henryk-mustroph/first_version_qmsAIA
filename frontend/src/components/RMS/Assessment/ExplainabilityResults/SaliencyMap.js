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

import React, {useEffect, useState} from 'react';
import {Box, Typography} from '@mui/material';

// Function to map saliency value to color
const getColorFromSaliency = (value) => {
    const green = Math.floor(255 * value);
    const red = Math.floor(255 * (1 - value));
    return `rgb(${red}, ${green}, 0)`;
};

const SaliencyMap = ({data}) => {
    const [parsedData, setParsedData] = useState([]);
    const [hasData, setHasData] = useState(true);

    useEffect(() => {
        console.log('Loading rms data:', data);
        const explainabilityData = parseExplainability(data);

        setParsedData(explainabilityData);

        if (explainabilityData.length > 0) {
            const explainabilityDataResults = explainabilityData[0].results;
            if(explainabilityDataResults.length > 0) {
                setHasData(true);
            }
            else{
                setHasData(false);
            }
        }
        else{
            setHasData(false);
        }

    }, [data]);

    const parseExplainability = (jsonData) => {
        const data_list = Object.values(jsonData);
        let dataInfoValues = [];
        let explainability = [];
        const explainabilityData = [];
        let mergedInfoExplainability = {};

        for (let i = 0; i < data_list.length; i++) {
            dataInfoValues = data_list[i]["data"];
            explainability = data_list[i]["explainability"];
            if (Object.keys(explainability).length === 0) {
                continue; // Skip this item if explainability is empty
            }
            mergedInfoExplainability = Object.assign({}, dataInfoValues, explainability);
            explainabilityData.push(mergedInfoExplainability);
        }
        return explainabilityData;
    };

    if (!hasData) {
        return (
            <div>
                <h3 style={{textAlign: 'center'}}>Explainability Metrics Results</h3>
                <p style={{textAlign: 'center'}}>No data available!</p>
            </div>
        );
    }

    return (
        <div>
            <h3 style={{textAlign: 'center'}}>Explainability Metrics Results</h3>
            <p style={{textAlign: 'left'}}>
                <strong>Gradient-based Token Importance Map:</strong> <br/>
                <span>This metric illustrates the importance and sensitivity of each input token
                    (importance: green (1 - very important) to red (0 - unimportant))
                    based on the calculated gradient values of the LLM output w.r.t to the generated output.
                </span>
            </p>

            {parsedData.map((item, outerIndex) => (
                <div key={outerIndex}>

                    <p style={{textAlign: 'left'}}>
                        <strong>Task:</strong> <br/>
                        <span> {item.instruction} </span> <br/>
                        <span style={{color: 'blue'}}>{item.input_text}</span>
                    </p>

                    <Box display="flex" flexWrap="wrap" justifyContent="left">
                        {item.results.map((item2, innerIndex) => (
                            <div key={innerIndex}
                                 style={{display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
                                <Typography
                                    style={{
                                        backgroundColor: getColorFromSaliency(item2.saliency),
                                        padding: '0.2em 0.4em',
                                        margin: '0.1em',
                                        borderRadius: '4px',
                                        color: '#fff',
                                        fontFamily: 'Encode Sans Expanded, sans-serif'
                                    }}
                                >
                                    {item2.token}
                                </Typography>
                                <Typography
                                    style={{
                                        padding: '0.2em 0.4em',
                                        margin: '0.1em',
                                        borderRadius: '4px',
                                        color: 'black',
                                        fontFamily: 'Encode Sans Expanded, sans-serif'
                                    }}
                                >
                                    {item2.saliency}
                                </Typography>
                            </div>
                        ))}
                    </Box>

                </div>
            ))}
        </div>
    );
};

export default SaliencyMap;