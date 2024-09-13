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

import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import {Button} from '@mui/material';
import Cookies from "js-cookie";

import NavBar from "../../../components/NavBar/NavBar";
import "./ResultPage.css";


const ResultPage = () => {

    const [riskAssessments, setRiskAssessments] = useState([]);
    // Loaded data
    const [loading, setLoading] = useState(true);
    const [riskLoaded, setRiskLoaded] = useState(false);

    useEffect(() => {
        const user_id = Cookies.get('/current_user/id');

        // Production
        fetchData(`http://x.x.x.x:4999/rms_service/users/${user_id}/risk_assessments/`, setRiskAssessments);

    }, [riskAssessments, riskLoaded]);

    const fetchData = async (url, setData) => {
        await fetch(url, {method: 'GET', mode: 'cors', headers: {'Content-Type': 'application/json'}})
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network responded error!');
                }
                return response.json();
            })
            .then(data => {
                console.log(data)
                setData(data);
                // When data arrived, set risk loaded to true
                if (data.length > 0) {
                    setRiskLoaded(true);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('There was a problem fetching the llm data:', error);
            });
    };

    const navigate = useNavigate();

    const handleView = (item) => {
        // Route to a risk assessment result detai page:
        navigate('/risk_result_detail', {state: {item}});
    }

    return (
        <React.Fragment>
            <NavBar/>
            <div className="result-data-page">
                <h1 className='result-data-title' style={{textAlign: "center"}}>Past Risk Assessment Results</h1>
                {loading ? (<p align='center'>Loading...</p>)
                    :
                    (riskLoaded ? (
                            <table className="data-result-table" align='center'>
                                <thead>
                                <tr>
                                    <th>LLM</th>
                                    <th>Domain</th>
                                    <th>Date & Time</th>
                                    <th>Check Result!</th>
                                </tr>
                                </thead>
                                <tbody>
                                {riskAssessments.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.risk_identification.language_model.name}</td>
                                        <td>{item.risk_identification.domain.name}</td>
                                        <td>{item.timestamp}</td>
                                        <td>
                                            <Button onClick={() => handleView(item)}>View</Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p align='center'>No risk assessments were executed.</p>
                        )
                    )}
            </div>
        </React.Fragment>
    );
}

export default ResultPage;
