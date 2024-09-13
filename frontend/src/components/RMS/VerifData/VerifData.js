import React, {useEffect, useState} from "react";
import {Button} from '@mui/material';
import Cookies from "js-cookie";

import './VerifData.css'

const VerifData = ({activeStep, updateStep}) => {

    const [dataResults, setDataResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        if(Cookies.get('rms/risk_identification/domain') && Cookies.get('rms/component/data/type')) {
            const domain = JSON.parse(Cookies.get('rms/risk_identification/domain'));
            const domain_id = domain._id;
            const type = Cookies.get('rms/component/data/type');
            fetchData(`http://x.x.x.x:4999/rms_service/data/${domain_id}/${type}/`, setDataResults)
        }
        else{
            setDataResults([]);
            setDataLoaded(true);
            setLoading(false);
        }

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

    const handleNext = async () => {
        updateStep(3);
    };

    // Button Logic
    const handleBack = () => {
        updateStep(1);
    };

    return (
        <React.Fragment>

            <div>

                {loading ?
                    (
                        <p align='center'>Loading...</p>
                    )
                    :
                    (
                        dataResults.length > 0 ?
                            (
                                <div>
                                    <p className='page-description'>
                                        The Data shown was loaded from the database based on the selected DOMAIN and DATA TYPE.
                                    </p>

                                    <table className="data-table" align='center'>
                                        <thead>
                                        <tr>
                                            <th>Domain</th>
                                            <th>Type</th>
                                            <th>Task</th>
                                            <th>Instruction</th>
                                            <th>Task</th>
                                            <th>Ground-truth Target</th>
                                            <th>Adversarial Target</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {dataResults.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.domain.name}</td>
                                                <td>{item.type}</td>
                                                <td>{item.task}</td>
                                                <td>{item.instruction}</td>
                                                <td>{item.input_text}</td>
                                                <td>{item.gt_text}</td>
                                                <td>{item.adversarial_target}</td>

                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>


                                    <div className="verif-stepper-buttons">
                                        <Button
                                            color="inherit"
                                            fontFamily="inherit"
                                            disabled={activeStep === 0}
                                            onClick={handleBack}
                                            className="verif-stepper-button-back"
                                        >
                                            Back
                                        </Button>

                                        <Button
                                            color="inherit"
                                            fontFamily="inherit"
                                            variant="contained"
                                            className="verif-stepper-button-next"
                                            onClick={handleNext}
                                        >
                                            Execute Risk Analysis
                                        </Button>
                                    </div>
                                </div>
                            )
                            :
                            (
                                <div>

                                    <p align='center'>No data can be selected based on the chosen Domain and Type of Data
                                        type.
                                    </p>

                                    <div className="verif-stepper-buttons">
                                        <Button
                                            color="inherit"
                                            fontFamily="inherit"
                                            disabled={activeStep === 0}
                                            onClick={handleBack}
                                            className="verif-stepper-button-back"
                                        >
                                            Back
                                        </Button>

                                        <Button
                                            color="inherit"
                                            fontFamily="inherit"
                                            variant="contained"
                                            className="verif-stepper-button-next"
                                            onClick={handleNext}
                                        >
                                            Go to Risk Analysis
                                        </Button>
                                    </div>
                                </div>
                            )
                    )
                }
            </div>
        </React.Fragment>
    );
}

export default VerifData;
