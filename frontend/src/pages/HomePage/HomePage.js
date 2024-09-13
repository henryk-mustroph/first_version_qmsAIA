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
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import {useNavigate} from 'react-router-dom';

import NavBar from "../../components/NavBar/NavBar";

import "./HomePage.css";

// Pictures for cards:
import risk_est from "../../static/images/risk_estimation.png"
import past_res from "../../static/images/past_results_data.png"
import data from "../../static/images/data_check.png"
import risk_verif_data from "../../static/images/risk_verif_data.png"

const HomePage = () => {

    const navigate = useNavigate();

    const handleClickRiskResult = () => {
        // Route to a different page
        navigate('/risk_result');
    };

    const handleClickDataResult = () => {
        // Route to a different page
        navigate('/data_result');
    };

    const handleClickRiskVerif = () => {
        // Route to a different page
        navigate('/risk_verif');
    };

    const handleClickDataVerif = () => {
        // Route to a different page
        navigate('/data_verif');
    };

    return (
        <div>
            <NavBar/>
            <div className="home-page">
                <h1 className="home-title">Quality Management System</h1>

                <div className="home-content">

                    {/* Article 9: Risk Managment System */}
                    <p className='description'>
                        <strong>Article 9 Risk Management System</strong> <br/>
                        <span>Perform Risk Identification, Risk Analysis, and Risk Assessment</span>.
                    </p>

                    <Container maxWidth="md">
                        <Grid container spacing={4} alignItems="center" justifyContent="center">

                            {/* RMS Verif Data */}
                            <Grid item xs={12} sm={6} md={4}>
                                <Card className='card'>
                                    <CardMedia
                                        className='card-image'
                                        image={risk_verif_data}
                                        title="Risk Verification Data"
                                    />
                                    <CardContent className='card-description'>
                                        <Typography variant='home-content'>
                                            <b>Risk Estimation Data:</b> Add Risk Data that can be analyzed
                                            in the Risk Estimation Process.
                                        </Typography>
                                        <Button className='card-actions' onClick={() => {
                                            window.location.href = 'compdata'
                                        }}>
                                            <h3 className="button-name">Add</h3>
                                        </Button>
                                    </CardContent>
                                    <CardActions/>
                                </Card>
                            </Grid>

                            {/* RMS Process */}
                            <Grid item xs={12} sm={6} md={4}>
                                <Card className='card'>
                                    <CardMedia
                                        className='card-image'
                                        image={risk_est}
                                        title="Risk Estimation Process"
                                    />
                                    <CardContent className='card-description'>
                                        <Typography variant='home-content'>
                                            <b>Risk Estimation Process:</b> Perform, a risk identification, analysis,
                                            and assessment.
                                        </Typography>
                                        <Button className='card-actions' onClick={handleClickRiskVerif}>
                                            <h3 className="button-name">Start</h3>
                                        </Button>
                                    </CardContent>
                                    <CardActions/>
                                </Card>
                            </Grid>

                            {/* RMS Results */}
                            <Grid item xs={12} sm={6} md={4}>
                                <Card className='card'>
                                    <CardMedia
                                        className='card-image'
                                        image={past_res}
                                        title="Risk Estimation Process"
                                    />
                                    <CardContent className='card-description'>
                                        <Typography variant='home-content'>
                                            <b>Past Risk Estimation Results:</b> View the past risk estimation results.
                                        </Typography>

                                        <Button className='card-actions' onClick={handleClickRiskResult}>
                                            <h3 className="button-name">Compare</h3>
                                        </Button>
                                    </CardContent>
                                    <CardActions/>
                                </Card>
                            </Grid>
                        </Grid>
                    </Container>

                    {/* Article 10 DMDGS */}
                    <p className='description'>
                        <strong> Article 10 Data Management and Governance System</strong> <br/>
                        <span>Add a reference to your data that it is compliant with the EU AIA regulations.</span>
                    </p>
                    <Container maxWidth="md">
                        <Grid container spacing={4} alignItems="center" justifyContent="center">

                            {/* DMDGS Process */}
                            <Grid item xs={12} sm={6} md={4}>
                                <Card className='card'>
                                    <CardMedia
                                        className='card-image'
                                        image={data}
                                        title="Risk Estimation Process"
                                    />
                                    <CardContent className='card-description'>
                                        <Typography variant='home-content'>
                                            <strong>Perform Data Check:</strong> Upload a reference to your used data,
                                            and a proof ov compliance.
                                        </Typography>

                                        <Button className='card-actions' onClick={handleClickDataVerif}>
                                            <h3 className="button-name">Start</h3>
                                        </Button>
                                    </CardContent>
                                    <CardActions/>
                                </Card>
                            </Grid>

                            {/* DMDGS Results */}
                            <Grid item xs={12} sm={6} md={4}>
                                <Card className='card'>
                                    <CardMedia
                                        className='card-image'
                                        image={past_res}
                                        title="Risk Estimation Process"
                                    />
                                    <CardContent className='card-description'>
                                        <Typography variant='home-content'>
                                            <strong>Past Data Check Results:</strong> Keep, view, and edit your past
                                            data management checks.
                                        </Typography>
                                        <Button className='card-actions' onClick={handleClickDataResult}>
                                            <h3 className="button-name">Compare</h3>
                                        </Button>
                                    </CardContent>
                                    <CardActions/>
                                </Card>
                            </Grid>

                        </Grid>
                    </Container>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
