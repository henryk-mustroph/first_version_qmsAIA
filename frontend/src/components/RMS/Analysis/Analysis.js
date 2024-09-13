import React, {useState, useEffect} from 'react';
import {Button, Checkbox as MuiCheckbox, Box} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import Cookies from "js-cookie";

import './Analysis.css';
import CircularProgress from "@mui/material/CircularProgress";

const moment = require('moment')

const Checkbox = ({ label, isChecked, onChange }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', wordWrap: 'break-word', marginBottom: '5px' }}>
            <MuiCheckbox checked={isChecked} onChange={onChange} />
            {label}
        </Box>
    );
};

const Analysis = ({activeStep, updateStep}) => {

    const [allPerformanceChecked, setAllPerformanceChecked] = useState(false);
    const [allConsistencyChecked, setAllConsistencyChecked] = useState(false);
    const [allExplainabilityChecked, setAllExplainabilityChecked] = useState(false);

    const [loading, setLoading] = useState(false);

    const [subChecks, setSubChecks] = useState({});

    const [performanceMetrics, setPerformanceMetrics] = useState([]);
    const [consistencyMetrics, setConsistencyMetrics] = useState([]);
    const [explainabilityMetrics, setExplainabilityMetrics] = useState([]);

    // State for Snackbar
    const [snackbarData, setSnackbarData] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        // Production Development
        fetchData('https://power.bpm.cit.tum.de/henryk_backend/rms_service/metrics/type/Performance/', setPerformanceMetrics);
        // Fetch all consistency metrics
        fetchData('https://power.bpm.cit.tum.de/henryk_backend/rms_service/metrics/type/Consistency/', setConsistencyMetrics);
        // Fetch all explainability metrics
        fetchData('https://power.bpm.cit.tum.de/henryk_backend/rms_service/metrics/type/Explainability/', setExplainabilityMetrics);

    }, []);

    // Get data from the database
    const fetchData = async (url, setData) => {
        await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network responded error!');
                }
                return response.json();
            })
            .then(data => {
                console.log(data)
                setData(data);
            })
            .catch(error => {
                console.error('There was a problem fetching the llm data:', error);
            });
    };

    // Handle selection of checkboxes for metrics that should be executed by th model:
    const handleSubCheck = (type, check_all, subcategory) => {
        if (check_all) {
            var updatedSubChecks = subChecks;
            switch (type) {
                case "performance":
                    if (allPerformanceChecked) {
                        for (let i = 0; i < subcategory.length; i++) {
                            updatedSubChecks = {...updatedSubChecks, [subcategory[i].name]: false}
                        }
                    } else {
                        for (let i = 0; i < subcategory.length; i++) {
                            updatedSubChecks = {...updatedSubChecks, [subcategory[i].name]: true}
                        }
                    }
                    break;
                case "consistency":
                    if (allConsistencyChecked) {
                        for (let i = 0; i < subcategory.length; i++) {
                            updatedSubChecks = {...updatedSubChecks, [subcategory[i].name]: false}
                        }
                    } else {
                        for (let i = 0; i < subcategory.length; i++) {
                            updatedSubChecks = {...updatedSubChecks, [subcategory[i].name]: true}
                        }
                    }
                    break;
                case "explainability":
                    if (allExplainabilityChecked) {
                        for (let i = 0; i < subcategory.length; i++) {
                            updatedSubChecks = {...updatedSubChecks, [subcategory[i].name]: false};
                        }
                    } else {
                        for (let i = 0; i < subcategory.length; i++) {
                            updatedSubChecks = {...updatedSubChecks, [subcategory[i].name]: true};
                        }
                    }
                    break;

                default:
                    break;
            }
            if (type === "performance") {
                if (allPerformanceChecked) {
                    setAllPerformanceChecked(false);
                } else {
                    setAllPerformanceChecked(true);
                }
            }
            if (type === "consistency") {
                if (allConsistencyChecked) {
                    setAllConsistencyChecked(false);
                } else {
                    setAllConsistencyChecked(true);
                }
            }
            if (type === "explainability") {
                if (allExplainabilityChecked) {
                    setAllExplainabilityChecked(false);
                } else {
                    setAllExplainabilityChecked(true);
                }
            }
            // Set Checkboxes
            setSubChecks(updatedSubChecks);
        } else {
            updatedSubChecks = {...subChecks, [subcategory]: !subChecks[subcategory]};
            setSubChecks(updatedSubChecks);

            if (type === "performance" && allPerformanceChecked) {
                setAllPerformanceChecked(false);
            }
            if (type === "consistency" && allConsistencyChecked) {
                setAllConsistencyChecked(false);
            }
            if (type === "explainability" && allExplainabilityChecked) {
                setAllExplainabilityChecked(false);
            }
        }

        // Store selected values in cookies
        let metrics = [];
        const mergedMetrics = [...performanceMetrics, ...consistencyMetrics, ...explainabilityMetrics];
        const checkedMetricNames = [];
        // Iterate through all checked metrics:
        for (let i = 0; i < Object.keys(updatedSubChecks).length; i++) {
            if (updatedSubChecks[Object.keys(updatedSubChecks)[i]]) {
                checkedMetricNames.push(Object.keys(updatedSubChecks)[i]);
            }
        }
        for (let i = 0; i < updatedSubChecks.length; i++) {
            if (updatedSubChecks[i]) {
                checkedMetricNames.push(updateStep.key())
            }
        }
        // Checked metric names
        for (let i = 0; i < checkedMetricNames.length; i++) {
            metrics.push(mergedMetrics.filter(metric => metric.name === checkedMetricNames[i])[0]);
        }
        metrics = metrics.map(item => JSON.stringify(item));
        // Set the current chosen metrics to the cookies:
        Cookies.set("rms/risk_analysis/metrics", JSON.stringify(metrics), {secure: true, sameSite: 'Strict'});
    };

    // Close Snackbar
    const handleCloseSnackbar = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarData({...snackbarData, open: false});
        // Go to Risk assessment page
        updateStep(4);
    };

    // Close Snackbar
    const handleOpenSnackbar = (message, severity) => {
        setSnackbarData({
            open: true,
            message: message,
            severity: severity
        });
    };

    // Logic for next button:
    const createRiskIdentification = async (language_model, domain, purpose, capability, llm_user, llm_subject) => {
        const riskIdentificationData = {
            language_model,
            domain,
            purpose,
            capability,
            llm_user,
            llm_subject
        };
        try {
            // Production
            const response = await fetch('https://power.bpm.cit.tum.de/henryk_backend/rms_service/risk_identifications/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(riskIdentificationData)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Risk identification object created:', data);
            return data;
        } catch (error) {
            console.error('There was a problem creating the risk identification object:', error);
            throw error;
        }
    };

    // Get data by domain and type
    const getDataByDomainAndType = async (domain_id, type) => {
        try {
            // Production
            const response = await fetch(`https://power.bpm.cit.tum.de/henryk_backend/rms_service/data/${domain_id}/${type}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Metrics were calculated and Risk Analysis object was created:', data);
            return data;
        } catch (error) {
            console.error('There was a problem creating the risk analysis object:', error);
            throw error;
        }
    };


    const createRiskAnalysis = async (language_model, data, metrics) => {
        const riskAnalysisData = {
            language_model,
            data,
            metrics
        };

        // Define a function to fetch with timeout using AbortController
        const fetchWithTimeout = (url, options, timeout = 240000) => {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);

            return fetch(url, {
                ...options,
                signal: controller.signal
            }).then(response => {
                clearTimeout(id);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response;
            }).catch(error => {
                clearTimeout(id);
                if (error.name === 'AbortError') {
                    throw new Error('Timeout waiting for response');
                }
                throw error;
            });
        };

        try {
            // Show loading indicator
            setLoading(true);

            // Use fetchWithTimeout to send the request
            const response = await fetchWithTimeout('https://power.bpm.cit.tum.de/henryk_backend/rms_service/risk_analyses/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(riskAnalysisData)
            });

            const responseData = await response.json();
            console.log('Metrics were calculated and Risk Analysis object was created:', responseData);
            return responseData;
        } catch (error) {
            console.error('There was a problem creating the risk analysis object:', error);
            throw error; // Propagate the error to be handled by the caller
        } finally {
            setLoading(false); // Hide loading indicator regardless of success or failure
        }
    };


    // Create risk assessment object and add risk assessment id to the list
    const createRiskAssessment = async (user_id, timestamp, risk_identification, risk_analysis) => {
        const risk_assessment = {
            timestamp,
            risk_identification,
            risk_analysis
        };

        const requestData = {
            user_id,
            risk_assessment
        };

        try {
            // Production
            const response = await fetch('https://power.bpm.cit.tum.de/henryk_backend/rms_service/risk_assessments/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData) // Convert the combined object to JSON string
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Risk assessment object created:', data);
            return data;
        } catch (error) {
            console.error('There was a problem creating the risk assessment object:', error);
            throw error; // Propagate the error to be handled by the caller
        }
    };

    // Get data by domain and type
    const deleteRiskProcessSubsteps = async (path) => {
        try {
            const response = await fetch(path, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Risk Assessment Subprocess Deleted', data);
            return data;
        } catch (error) {
            console.error('The was a problem in delting the Risk Assessment subprocess.', error);
            throw error;
        }
    };

    /*
    Risk Assessment Process and Logic:

      1. Get Component Data (Mandatory: LLM)
      2. Get Risk Identification Data (Mandatory: Domain, Purpose, Capability, LLMUser, LLMSubject)
      3. Create Risk Identification
      4. Get Risk Analysis (Mandatory: Risk Identification, Metrics)
      5. Create Risk Analysis
      6. Get Risk Assessment Data (Mandatory: Risk Identification, Risk Analysis)
      7. Create risk assessment
      8. Remove all cookies of risk assessment process
      9. Show success snackbar
    */
    const handleNext = async () => {
        let riskIdentification;
        let riskAnalysis;
        try {
            // 1. Get Component Data:
            const savedLLM = JSON.parse(Cookies.get('rms/component/llm'));
            // const savedTask = Cookies.get('rms/component/data/task');
            const savedType = Cookies.get('rms/component/data/type');

            // 2. Get Risk identification data:
            const savedDomain = JSON.parse(Cookies.get('rms/risk_identification/domain'));
            const savedPurpose = JSON.parse(Cookies.get('rms/risk_identification/purpose'));
            const savedCapability = JSON.parse(Cookies.get('rms/risk_identification/capability'));
            const savedLLMUser = JSON.parse(Cookies.get('rms/risk_identification/llm_user'));
            const savedLLMSubject = JSON.parse(Cookies.get('rms/risk_identification/llm_subject'));

            // Get Risk analysis metrics data:
            const metrics = JSON.parse(Cookies.get('rms/risk_analysis/metrics'));
            const parsedMetrics = metrics.map(item => JSON.parse(item));

            // 3. Create Risk Identification:
            riskIdentification = null;
            let data = null;
            riskAnalysis = null;
            let riskAssessment = null;

            if (savedLLM && savedDomain && savedPurpose && savedCapability && savedLLMUser && savedLLMSubject) {
                riskIdentification = await createRiskIdentification(savedLLM, savedDomain, savedPurpose, savedCapability, savedLLMUser, savedLLMSubject);
            } else {
                handleOpenSnackbar('Please fill out all data in the risk identification', 'error');
                return;
            }

            // 4. Get data that are analyzed in risk analysis:
            data = await getDataByDomainAndType(savedDomain._id, savedType);

            // 6. Create Risk Analysis:
            if (riskIdentification && parsedMetrics) {
                riskAnalysis = await createRiskAnalysis(savedLLM, data, parsedMetrics);

            } else {
                handleOpenSnackbar('Select at least one metric that should be analyzed ', 'error');
                return;
            }

            // 7. Get time data for risk assessment:
            const currentTimestamp = Date.now();
            const timestampString = moment(currentTimestamp).format();

            // 8. Create risk assessment
            const userId = Cookies.get('/current_user/id');

            if (riskIdentification && riskAnalysis) {
                riskAssessment = await createRiskAssessment(userId, timestampString, riskIdentification, riskAnalysis);
            } else {
                handleOpenSnackbar('Risk Assessment could not be stored since either identification or analysis are not present.', 'error');
                return;
            }

            // 9. Remove all cookies and set back checkboxes of risk assessment process:
            // Set back the checkboxes
            setAllPerformanceChecked(false);
            setAllExplainabilityChecked(false);
            setAllConsistencyChecked(false)
            setPerformanceMetrics([]);
            setExplainabilityMetrics([]);
            setConsistencyMetrics([]);
            // Component
            Cookies.remove('rms/component/llm');
            Cookies.remove('rms/component/data/task');
            Cookies.remove('rms/component/data/type');
            // Identification
            Cookies.remove('rms/risk_identification/domain');
            Cookies.remove('rms/risk_identification/purpose');
            Cookies.remove('rms/risk_identification/capability');
            Cookies.remove('rms/risk_identification/llm_user');
            Cookies.remove('rms/risk_identification/llm_subject');
            // Analysis:
            Cookies.remove('rms/risk_analysis/metrics');

            const riskIdentificationClass = JSON.stringify(riskAssessment.risk_identification.risk_class)
            Cookies.set('rms/risk_assessment/risk_identification/risk_class', riskIdentificationClass, {
                secure: true,
                sameSite: 'Strict'
            });

            const results = JSON.stringify(riskAssessment.risk_analysis.results)
            Cookies.set('rms/risk_assessment/risk_analysis/results', results, {secure: true, sameSite: 'Strict'});

            Cookies.set('rms/risk_assessment/id', riskAssessment._id, {secure: true, sameSite: 'Strict'});

            // 10. Show success Snackbar
            handleOpenSnackbar('Risk Analysis successfull! Risk Assessment will be generated.', 'success');

        } catch (error) {
            // Handle errors here
            console.error('Error:', error);
            handleOpenSnackbar('Risk Analysis could not be computed.', 'error', 'error');
            // Delete the created risk identification in case the process is not executed correctly
            if (riskIdentification != null && riskIdentification._id != null) {
                try {
                    // Production
                    const deleteMsg = deleteRiskProcessSubsteps(`https://power.bpm.cit.tum.de/henryk_backend/rms_service/risk_identifications/${riskIdentification._id}/`);
                    console.log(deleteMsg);
                } catch (error) {
                    // Handle errors here
                    console.error('Error:', error);
                    handleOpenSnackbar('Risk Identification could not be deleted', 'error', 'error');
                }
            }
            // Delete the created risk identification in case the process is not executed correctly
            if (riskAnalysis != null && riskAnalysis._id != null) {
                try {
                    // Production
                    const deleteMsg = deleteRiskProcessSubsteps(`https://power.bpm.cit.tum.de/henryk_backend/rms_service/risk_analyses/${riskAnalysis._id}/`);
                    console.log(deleteMsg);
                } catch (error) {
                    // Handle errors here
                    console.error('Error:', error);
                    handleOpenSnackbar('Risk Analysis could not be deleted', 'error', 'error');
                }
            }
        }
    }

    // Redirect the user back to the identification page
    const handleBack = () => {
        updateStep(2);
    };

    return (
        <React.Fragment>
            {/* Snackbar */}
            <Snackbar open={snackbarData.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
                <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity={snackbarData.severity}
                          style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}>
                    {snackbarData.message}
                </MuiAlert>
            </Snackbar>

            <p className='page-description'>
                In the third phase of the Risk Estimation Tool, identified technical risks are classified and can be
                assessed, performing the risk analysis.
                This involves a detailed evaluation of the model's performance, consistency and explainability
                considering the stored data.
                Our objectives include generating compliance documentation according to EU AIA standards and enhancing
                transparency by identifying additional risks and model deficiencies.
                To execute this evaluation, we utilize various approaches from well-evaluated evaluation pipelines and
                metrics, stated in the corresponding scientific paper.</p>

            {/*Checkbox Box of EU AIA Class and Obligations*/}
            <div className="risk-classification-box">
                <h2>AI Risk Estimation Regulations</h2>
                <p align="left"> All regulations are based on the Article set up in the EU Artificial Intelligence Act
                    [1]</p>

                <p align="left">
                    <ul>
                        <li><b>Important GPAI Systems Regulations:</b></li>
                        <ul>
                            <li><b>Article 53 & 55</b> Obligations for providers of GPAI models (with systematic risk)
                            </li>
                        </ul>
                        <li><b>Important High-Risk AI System Regulations:</b></li>
                        <ul>
                            <li><b>Article 9</b> Risk Management System</li>
                            <li><b>Article 15</b> Accuracy, Robustness and Cybersecurity Evaluations</li>
                        </ul>
                    </ul>
                </p>

                <p align="left">To get a more detailed list of obligations for an the used AI system with identified
                    risk check the more detailed <a
                        href="https://artificialintelligenceact.eu/assessment/eu-ai-act-compliance-checker/"
                        target="_blank" rel="noopener noreferrer">EU AIA Compliance Checker</a>.</p>
            </div>

            {/*Checkboxes*/}
            <div className="metrics-container">
                <div className="metrics-info">
                    <h3 className="metrics-title">Performance - Metrics</h3>
                    <p className="metrics-description">Choose the performance metrics that should be executed.</p>
                </div>
                <div>
                    <Box sx={{display: 'flex', flexDirection: 'column', ml: 3}}>
                        <Checkbox
                            label="All Performance"
                            isChecked={allPerformanceChecked}
                            onChange={() => handleSubCheck("performance", true, performanceMetrics)}
                        />
                        {performanceMetrics.map((metric) => (
                            <Checkbox
                                key={metric._id}
                                label={metric.name}
                                isChecked={subChecks[metric.name] || false}
                                onChange={() => handleSubCheck("performance", false, metric.name)}
                            />
                        ))}
                    </Box>
                </div>
            </div>

            <div className="metrics-container">
                <div className="metrics-info">
                    <h3 className="metrics-title">Consistency - Metrics</h3>
                    <p className="metrics-description">Choose the consistency metrics that should be executed.</p>
                </div>
                <div>
                    <Box sx={{display: 'flex', flexDirection: 'column', ml: 3}}>
                        <Checkbox
                            label="All Consistency"
                            isChecked={allConsistencyChecked}
                            onChange={() => handleSubCheck("consistency", true, consistencyMetrics)}
                        />
                        {consistencyMetrics.map((metric) => (
                            <Checkbox
                                key={metric._id}
                                label={metric.name}
                                isChecked={subChecks[metric.name] || false}
                                onChange={() => handleSubCheck("consistency", false, metric.name)}
                            />
                        ))}
                    </Box>
                </div>
            </div>

            <div className="metrics-container">
                <div className="metrics-info">
                    <h3 className="metrics-title">Explainability - Metrics</h3>
                    <p className="metrics-description">Choose the explainability metrics that should be executed.</p>
                </div>
                <div>
                    <Box sx={{display: 'flex', flexDirection: 'column', ml: 3}}>
                        <Checkbox
                            label="All Explainability"
                            isChecked={allExplainabilityChecked}
                            onChange={() => handleSubCheck("explainability", true, explainabilityMetrics)}
                        />
                        {explainabilityMetrics.map((metric) => (
                            <Checkbox
                                key={metric._id}
                                label={metric.name}
                                isChecked={subChecks[metric.name] || false}
                                onChange={() => handleSubCheck("explainability", false, metric.name)}
                            />
                        ))}
                    </Box>
                </div>
            </div>

            {/* Loading indicator */}
            {loading && (
                <div className="loading-container">
                    <CircularProgress size={60} thickness={4}/>
                    <p className="metrics-description">Loading...</p>
                    <p className="metrics-description">Technical Metrics are calculated currently.</p>
                </div>
            )}

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

            <p className="footer">[1] European Union: Regulation of the european parliament and of the council of laying
                down harmonised rules on artificial intelligence and amending regulations (artificial intelligence act)
                (corrigendum 19.04.2024) (2024), 2021/0106(COD)</p>
            <p className="footer-last">* No metrics implemented yet</p>

        </React.Fragment>
    );
};

export default Analysis;
