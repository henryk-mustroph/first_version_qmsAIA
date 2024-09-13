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
        fetchData(`https://power.bpm.cit.tum.de/henryk_backend/rms_service/users/${user_id}/risk_assessments/`, setRiskAssessments);

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
