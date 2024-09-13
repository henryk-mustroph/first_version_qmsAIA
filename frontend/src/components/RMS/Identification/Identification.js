import React, {useEffect, useState} from "react";
import {useTheme} from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

import Cookies from "js-cookie";

import "./Identification.css";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name, specificName, theme) {
    return {
        fontWeight:
            specificName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
        fontFamily: 'Encode Sans Expanded, sans-serif',
        display: 'block'
    };
}

const Identification = ({activeStep, updateStep}) => {

    const theme = useTheme();

    //Domain values
    const [domain, setDomain] = useState('');
    const [domains, setDomains] = useState([]);

    //Purpose values
    const [purpose, setPurpose] = useState('');
    const [purposes, setPurposes] = useState([]);

    //Capability values
    const [capability, setCapability] = useState('');
    const [capabilities, setCapabilities] = useState([]);

    //LLM User values
    const [llmUser, setLLMUser] = useState('');
    const [llmUsers, setLLMUsers] = useState([]);

    //LLM Subjects values
    const [llmSubject, setLLMSubject] = useState('');
    const [llmSubjects, setLLMSubjects] = useState([]);

    useEffect(() => {
        // Production
        // Fetch Domain from: list of json (dict): format: [{_id: string, name: string}]
        fetchData('https://power.bpm.cit.tum.de/henryk_backend/rms_service/domains/', setDomains);
        // Fetch Tasks from: list of strings: format: [task1, task2, ...]
        fetchData('https://power.bpm.cit.tum.de/henryk_backend/rms_service/purposes/', setPurposes);
        // Fetch LLMs from: list of json (dict): format: [{_id: string, name: string, size: string}]
        fetchData('https://power.bpm.cit.tum.de/henryk_backend/rms_service/capabilities/', setCapabilities);
        // Fetch Domain from: list of json (dict): format: [{_id: string, name: string}]
        fetchData('https://power.bpm.cit.tum.de/henryk_backend/rms_service/llm_users/', setLLMUsers);
        // Fetch Types from: list of strigns: format: [type1, type2, ...]
        fetchData('https://power.bpm.cit.tum.de/henryk_backend/rms_service/llm_subjects/', setLLMSubjects);

        // Load values from the cokies in case, they were already set.
        const savedDomain = Cookies.get('rms/risk_identification/domain');
        if (savedDomain) {
            setDomain(JSON.parse(savedDomain).name);
        }

        const savedPurpose = Cookies.get('rms/risk_identification/purpose');
        if (savedPurpose) {
            setPurpose(JSON.parse(savedPurpose).name);
        }

        const savedCapability = Cookies.get('rms/risk_identification/capability');
        if (savedCapability) {
            setCapability(JSON.parse(savedCapability).name);
        }

        const savedLLMUser = Cookies.get('rms/risk_identification/llm_user');
        if (savedLLMUser) {
            setLLMUser(JSON.parse(savedLLMUser).name);
        }

        const savedLLMSubject = Cookies.get('rms/risk_identification/llm_subject');
        if (savedLLMSubject) {
            setLLMSubject(JSON.parse(savedLLMSubject).name);
        }

    }, []);

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
            })
            .catch(error => {
                console.error('There was a problem fetching the llm data:', error);
            });
    };

    const handleDomainChange = (event) => {
        const {
            target: {value},
        } = event;
        const selectedDomain = domains.find(domain => domain.name === value);
        setDomain(value);
        Cookies.set('rms/risk_identification/domain', JSON.stringify(selectedDomain), {
            secure: true,
            sameSite: 'Strict'
        });
    };

    const handlePurposeChange = (event) => {
        const {
            target: {value},
        } = event;
        const selectedPurpose = purposes.find(purpose => purpose.name === value);
        setPurpose(value);
        Cookies.set('rms/risk_identification/purpose', JSON.stringify(selectedPurpose), {
            secure: true,
            sameSite: 'Strict'
        });
    };

    const handleCapabilityChange = (event) => {
        const {
            target: {value},
        } = event;
        const selectedCapability = capabilities.find(capability => capability.name === value);
        setCapability(value);
        Cookies.set('rms/risk_identification/capability', JSON.stringify(selectedCapability), {
            secure: true,
            sameSite: 'Strict'
        });
    };

    const handleLLMUserChange = (event) => {
        const {
            target: {value},
        } = event;
        const selectedLLMUser = llmUsers.find(llmUser => llmUser.name === value);
        setLLMUser(value);
        Cookies.set('rms/risk_identification/llm_user', JSON.stringify(selectedLLMUser), {
            secure: true,
            sameSite: 'Strict'
        });
    };

    const handleLLMSubjectChange = (event) => {
        const {
            target: {value},
        } = event;
        const selectedLLMSubject = llmSubjects.find(llmSubject => llmSubject.name === value);
        setLLMSubject(value);
        Cookies.set('rms/risk_identification/llm_subject', JSON.stringify(selectedLLMSubject), {
            secure: true,
            sameSite: 'Strict'
        });
    };

    const handleNext = async () => {
        // const risk_class = determineRiskClass(llm, domain, purpose, capability, llmUser, llmSubject);
        updateStep(2);
    };

    // Button Logic
    const handleBack = () => {
        updateStep(0);
    };

    return (
        <React.Fragment>

            <p className="page-description">
                After the model and the compliance text domain and type were chosen,
                the risk estimation process starts with the identification of risk and the risk class categorization.
                The risk identification is based on the most basic and simplest vocabulary-based approach presented
                by[1].

                A more detailed approach which extend the basic vocabulary-based approach, called <a
                href="https://delaramglp.github.io/vair/" target="_blank" rel="noopener noreferrer">VAIR</a> is
                introduced and published by the authors as well.
            </p>

            {/* Add additional content or components here based on your functionality */}
            <div className="dropdown-container">
                <div className="dropdown-info">
                    <h3 className="dropdown-title">Domain</h3>
                    <p className="dropdown-description">In what area/ sector is the LLM intended to be used in?</p>
                </div>
                <FormControl sx={{m: 4, width: 600}}>
                    <InputLabel id="domain-input-label"
                                style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}>Domain</InputLabel>
                    <Select
                        id="domain-select"
                        value={domain}
                        onChange={handleDomainChange}
                        input={<OutlinedInput label="Domain"/>}
                        MenuProps={MenuProps}
                        style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                    >
                        {domains.map((domain) => (
                            <MenuItem
                                key={domain._id}
                                value={domain.name}
                                style={getStyles(domain.name, domains, theme)}
                            >
                                {domain.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <div className="dropdown-container">
                <div className="dropdown-info">
                    <h3 className="dropdown-title">Purpose</h3>
                    <p className="dropdown-description">What is the objective that is intended to be solved by the
                        LLM?
                    </p>
                </div>
                <FormControl sx={{m: 4, width: 600}}>
                    <InputLabel style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}>Purpose</InputLabel>
                    <Select
                        id="purpose-select"
                        value={purpose}
                        onChange={handlePurposeChange}
                        input={<OutlinedInput label="Purpose"/>}
                        style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                        MenuProps={MenuProps}
                    >
                        {purposes.map((purpose) => (
                            <MenuItem
                                key={purpose._id}
                                value={purpose.name}
                                style={getStyles(purpose.name, purposes, theme)}
                            >
                                {purpose.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <div className="dropdown-container">
                <div className="dropdown-info">
                    <h3 className="dropdown-title">Capabilities</h3>
                    <p className="dropdown-description">What is the technical capability of the LLM system?</p>
                </div>
                <FormControl sx={{m: 4, width: 600}}>
                    <InputLabel style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}>Capability</InputLabel>
                    <Select
                        id="cap-select"
                        value={capability}
                        onChange={handleCapabilityChange}
                        input={<OutlinedInput label="Capability"/>}
                        style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                        MenuProps={MenuProps}
                    >
                        {capabilities.map((capability) => (
                            <MenuItem
                                key={capability._id}
                                value={capability.name}
                                style={getStyles(capability.name, capabilities, theme)}
                            >
                                {capability.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <div className="dropdown-container">
                <div className="dropdown-info">
                    <h3 className="dropdown-title">LLM User</h3>
                    <p className="dropdown-description">Under whose authority should the LLM system be used?</p>
                </div>
                <FormControl sx={{m: 4, width: 600}}>
                    <InputLabel style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}>LLM User</InputLabel>
                    <Select
                        id="llmUser-select"
                        value={llmUser}
                        onChange={handleLLMUserChange}
                        input={<OutlinedInput label="LLM User"/>}
                        style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                        MenuProps={MenuProps}
                    >
                        {llmUsers.map((llmUser) => (
                            <MenuItem
                                key={llmUser._id}
                                value={llmUser.name}
                                style={getStyles(llmUser.name, llmUsers, theme)}
                            >
                                {llmUser.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

            </div>

            <div className="dropdown-container">
                <div className="dropdown-info">
                    <h3 className="dropdown-title">LLM Subject</h3>
                    <p className="dropdown-description">Who uses and is influenced by the output of the LLM?</p>
                </div>
                <FormControl sx={{m: 4, width: 600}}>
                    <InputLabel style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}>LLM Subject</InputLabel>
                    <Select
                        id="llmSubject-select"
                        value={llmSubject}
                        onChange={handleLLMSubjectChange}
                        input={<OutlinedInput label="User and Subject"/>}
                        style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                        MenuProps={MenuProps}
                    >
                        {llmSubjects.map((llmSubject) => (
                            <MenuItem
                                key={llmSubject._id}
                                value={llmSubject.name}
                                style={getStyles(llmSubject.name, llmSubjects, theme)}
                            >
                                {llmSubject.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

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
                    onClick={handleNext}
                >
                    Determine Risk Class
                </Button>
            </div>

            <p className="footer">
                [1] Delaram Golpayegani, Harshvardhan J. Pandit, Dave Lewis, To Be High-Risk, or Not To Be-Semantic
                Specifications and Implications of the AI Act's High-Risk AI Applications and Harmonised Standards, ACM
                Conference on Fairness, Accountability, and Transparency (FAccT), Chicago, IL, 12-15 June, 2023
            </p>

        </React.Fragment>
    );
};

export default Identification;