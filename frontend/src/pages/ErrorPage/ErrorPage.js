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