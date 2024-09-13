import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import {Button} from '@mui/material';
import Cookies from "js-cookie";

import NavBar from "../../../components/NavBar/NavBar";
import "./ResultPage.css";

const ResultPage = () => {

    const [dataResults, setDataResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        const user_id = Cookies.get('/current_user/id');
        // Production
        fetchData(`http://x.x.x.x:4999/dmdgs_service/users/${user_id}/training_data/`, setDataResults);
    }, [dataResults, dataLoaded]);


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
                if (data.length > 0) {
                    setDataLoaded(true);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('There was a problem fetching the llm data:', error);
            });
    };

    const navigate = useNavigate();

    const handleView = (item) => {
        navigate('/data_result_detail', {state: {item}});
    }

    return (
        <React.Fragment>
            <NavBar/>

            <div className="result-data-page">
                <h1 className='result-data-title' style={{textAlign: "center"}}>Past Data Checks Results</h1>

                {loading ? (<p align='center'>Loading...</p>)
                    :
                    (dataResults.length > 0 ? (
                            <table className="data-result-table" align='center'>
                                <thead>
                                <tr>
                                    <th>Data Name</th>
                                    <th>LLM Name</th>
                                    <th>Domain</th>
                                    <th>Type</th>
                                    <th>Check Results</th>
                                </tr>
                                </thead>
                                <tbody>
                                {dataResults.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.llms[0].name}</td>
                                        <td>{item.domain.name}</td>
                                        <td>{item.type.name}</td>
                                        <td>
                                            <Button onClick={() => handleView(item)}>View</Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (<p align='center'>No data were referenced and checked.</p>)
                    )
                }

            </div>

        </React.Fragment>
    );
}

export default ResultPage;
