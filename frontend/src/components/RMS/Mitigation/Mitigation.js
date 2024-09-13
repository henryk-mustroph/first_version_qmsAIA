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
