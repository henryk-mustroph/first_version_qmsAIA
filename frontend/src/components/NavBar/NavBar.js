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
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';

import Cookies from "js-cookie";

const NavBar = () => {

    const handleLogout = () => {
        // 1. Get all cookies of RMS:
        // User:
        const currentUserToken = Cookies.get('/current_user/token');
        console.log(currentUserToken);
        const currentUserId = Cookies.get('/current_user/id');
        console.log(currentUserId);
        const currentUsername = Cookies.get('/current_user/username');
        console.log(currentUsername);

        Cookies.remove('/current_user/token');
        Cookies.remove('/current_user/id');
        Cookies.remove('/current_user/username');

        // Risk Management
        // Component
        const savedLLM = Cookies.get('rms/compnent/llm');
        console.log("LLM: "+savedLLM);
        const savedTask = Cookies.get('rms/component/data/task');
        console.log("Task: "+savedTask);
        const savedType = Cookies.get('rms/component/data/type');
        console.log("Type: "+savedType);

        Cookies.remove('rms/component/llm');
        Cookies.remove('rms/component/data/task');
        Cookies.remove('rms/component/data/type');

        // Risk Identification
        const savedDomain = Cookies.get('rms/risk_identification/domain');
        console.log(savedDomain);
        const savedPurpose = Cookies.get('rms/risk_identification/purpose');
        console.log(savedPurpose);
        const savedCapability = Cookies.get('rms/risk_identification/capability');
        console.log(savedCapability);
        const savedLLMUser = Cookies.get('rms/risk_identification/llm_user');
        console.log(savedLLMUser);
        const savedLLMSubject = Cookies.get('rms/risk_identification/llm_subject');
        console.log(savedLLMSubject);

        Cookies.remove('rms/risk_identification/domain');
        Cookies.remove('rms/risk_identification/purpose');
        Cookies.remove('rms/risk_identification/capability');
        Cookies.remove('rms/risk_identification/llm_user');
        Cookies.remove('rms/risk_identification/llm_subject');

        // Risk Analysis:
        const raMetrics = Cookies.get('rms/risk_analysis/metrics');
        console.log(raMetrics);

        Cookies.remove('rms/risk_analysis/metrics');

        // Risk Assessment:
        const savedRiskAssessmentId = Cookies.get('rms/risk_assessment/id');
        console.log(savedRiskAssessmentId);
        const savedRiskAssessment = Cookies.get('rms/risk_assessment');
        console.log(savedRiskAssessment);

        Cookies.remove('rms/risk_assessment/risk_analysis/results');
        Cookies.remove('rms/risk_assessment/id')

        // 2. Get all Cookies of Data:

        // Bring the page back to the starting point.
        window.location.href = ''
    }

    return (
        <div style={{ width: '100%' }}>
            <Box display="flex" flexWrap="wrap" align-items="center" justifyContent="center" bgcolor={"white"}>

                {/* HOME */}
                <Box display="flex" align-items="center" style={{ padding: "12px" }}>
                    <Button style={{ color: "black" }} onClick={() => {
                        window.location.href = 'home'
                    }}>
                        <div style={{ textDecorationLine: 'underline' }}>Home</div>
                    </Button>
                </Box>

                {/* LLMs*/}
                <Box display="flex" align-items="center" style={{ padding: "12px" }}>
                    <Button style={{ color: "black" }} onClick={() => {
                        window.location.href = 'llmInfo'
                    }}>
                        <div style={{ textDecorationLine: 'underline' }}>LLMs</div>
                    </Button>
                </Box>

                {/* EU AIA Information */}
                <Box display="flex" align-items="center" style={{ padding: "12px" }}>
                    <Button style={{ color: "black" }} onClick={() => {
                        window.location.href = 'legal'
                    }}>
                        <div style={{ textDecorationLine: 'underline' }}>EU AIA Information</div>
                    </Button>
                </Box>

                <Box display="flex" align-items="right" style={{ padding: "12px" }}>
                    <Button style={{ color: "blue" }} onClick={handleLogout}>
                        <div style={{ textDecorationLine: 'underline' }}>Logout</div>
                    </Button>
                </Box>

                <Box display="flex" align-items="right" style={{ padding: "12px" }}>
                    <IconButton edge="end" color="inherit">
                        <AccountCircle />
                    </IconButton>
                </Box>

            </Box>
        </div>
    )
}

export default NavBar;