import React from 'react';
import {useNavigate} from 'react-router-dom';
import Cookies from "js-cookie";
import Button from '@mui/material/Button';


const Mitigation = ({activeStep, updateStep}) => {

    const navigate = useNavigate();

    // Button Logic
    const handleBack = () => {
        updateStep(3);
    };

    const handleFinish = () => {
        // Remove Assessment tokens:
        Cookies.remove('rms/risk_assessment');
        Cookies.remove('rms/risk_assessment/id');
        navigate('/home');
    };

    return (
        <React.Fragment>
            <div>
                <p className='page-description'>
                    After the risk class is categorized, the risk must be analysed quantitatively. Choose between the
                    provided risk driver metrics which are grouped into performance, consistency and explainability
                    metrics.
                </p>
            </div>

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
                    onClick={handleFinish}
                >
                    End Risk Estimation Process
                </Button>
            </div>

        </React.Fragment>

    );
};

export default Mitigation;
