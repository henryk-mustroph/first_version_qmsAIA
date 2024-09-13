import React from "react";
import Button from '@mui/material/Button';

import './ErrorPage.css'
import {useNavigate} from "react-router-dom";

const ErrorPage = () => {

    const navigate = useNavigate();

    const backToHome = async () => {
        navigate('/home');
    };

    return (
        <div className="error-page">
            <div className="error-content">
                <h1 className='error-title'>Page not found</h1>
                <div className='button'>
                    <Button
                        color="inherit"
                        fontFamily="inherit"
                        variant="contained"
                        className="verif-stepper-button-next"
                        onClick={backToHome}
                    >
                        Back to Homepage
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;