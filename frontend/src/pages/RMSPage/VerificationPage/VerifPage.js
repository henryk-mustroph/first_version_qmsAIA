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

import React from "react";

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';

import "./VerifPage.css";

import NavBar from "../../../components/NavBar/NavBar";
import ComponentInfo from "../../../components/RMS/Component/ComponentInfo";
import Identification from "../../../components/RMS/Identification/Identification";
import Analysis from "../../../components/RMS/Analysis/Analysis";
import VerifData from "../../../components/RMS/VerifData/VerifData";
import Assessment from "../../../components/RMS/Assessment/Assessment";
import Mitigation from "../../../components/RMS/Mitigation/Mitigation"

const steps = ['Define Components', 'Risk Identification', 'Verification Data' ,'Risk Analysis', 'Risk Assessment', 'Risk Mitigation'];

const VerifPage = () => {

    const [activeStep, setActiveStep] = React.useState(0);

    // This function will be passed down to child components to update the variable
    const updateStep = (newValue) => {
        setActiveStep(newValue);
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <React.Fragment>
                    <h1 className="verif-title">LLM & Task - Specification</h1>
                    <ComponentInfo activeStep={activeStep} updateStep={updateStep}/>
                </React.Fragment>
            case 1:
                return <React.Fragment>
                    <h1 className="verif-title">Risk Identification - Categorization</h1>
                    <Identification activeStep={activeStep} updateStep={updateStep}/>
                </React.Fragment>
            case 2:
                return <React.Fragment>
                    <h1 className="verif-title">Selected Data for Analysis - Execution</h1>
                    <VerifData activeStep={activeStep} updateStep={updateStep}/>
                </React.Fragment>
            case 3:
                return <React.Fragment>
                    <h1 className="verif-title">Risk Analysis - Execution</h1>
                    <Analysis activeStep={activeStep} updateStep={updateStep}/>
                </React.Fragment>
            case 4:
                return <React.Fragment>
                    <h1 className="verif-title">Risk Assessment - Documentation</h1>
                    <Assessment activeStep={activeStep} updateStep={updateStep}/>
                </React.Fragment>
            default:
                return <React.Fragment>
                    <h1 className="verif-title">Risk Mitigation - Optimization</h1>
                    <Mitigation activeStep={activeStep} updateStep={updateStep}/>
                </React.Fragment>
        }
    };

    return (
        <div>
            <NavBar/>
            <div className="verif-page">
                <h1 className="verif-title" style={{textAlign: "center"}}>Risk Management System</h1>

                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>
                                    <Typography style={{
                                        fontFamily: 'Encode Sans Expanded, sans-serif',
                                        fontSize: '0.8rem'
                                    }}> {label} </Typography>
                                </StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>

                <div className="verif-content">
                    {/*Logic: Defines which content is shown*/}
                    {getStepContent(activeStep)}
                </div>
            </div>
        </div>

    );
};

export default VerifPage;