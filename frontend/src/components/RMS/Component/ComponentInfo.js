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

import React, {useEffect, useState} from "react";
import {useTheme} from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

import Cookies from "js-cookie";

import "./ComponentInfo.css";

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

const ComponentInfo = ({activeStep, updateStep}) => {

    const theme = useTheme();
    //LLM values
    const [llm, setLLM] = useState('');
    const [llms, setLLMs] = useState([]);

    //Task values
    const [task, setTask] = useState('');
    const [tasks, setTasks] = useState([]);

    //Type values
    const [type, setType] = useState('');
    const [types, setTypes] = useState([]);

    useEffect(() => {
        // Production
        // Fetch LLMs from: list of json (dict): format: [{_id: string, name: string, size: string}]
        fetchData('http://x.x.x.x:4999/rms_service/language_models/', setLLMs)
        // Fetch Tasks from: list of strings: format: [task1, task2, ...]
        fetchData('http://x.x.x.x:4999/rms_service/data/tasks/', setTasks);
        // Fetch Types from: list of strings: format: [type1, type2, ...]
        fetchData('http://x.x.x.x:4999/rms_service/data/types/', setTypes);

        // Load values from the cokies in case, they were already set.
        const savedLLM = Cookies.get('rms/component/llm');
        if (savedLLM) {
            setLLM(JSON.parse(savedLLM).name);
        }

        const savedTask = Cookies.get('rms/component/data/task');
        if (savedTask) {
            setTask(savedTask)
        }

        const savedType = Cookies.get('rms/component/data/type');
        if (savedType) {
            setType(savedType);
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

    const handleLLMChange = (event) => {
        const {
            target: {value},
        } = event;
        const selectedLLM = llms.find(llm => llm.name === value);
        setLLM(value);
        Cookies.set('rms/component/llm', JSON.stringify(selectedLLM), {secure: true, sameSite: 'Strict'});
    };

    const handleTaskChange = (event) => {
        const {
            target: {value},
        } = event;
        setTask(value);
        Cookies.set('rms/component/data/task', value, {secure: true, sameSite: 'Strict'});
    };

    const handleTypeChange = (event) => {
        const {
            target: {value},
        } = event;
        setType(value);
        Cookies.set('rms/component/data/type', value, {secure: true, sameSite: 'Strict'});
    };

    // Buttons Logic
    const handleBack = () => {
        updateStep(0);
    };

    const handleNext = () => {
        updateStep(1);
    };

    return (
        <React.Fragment>
            <p className="page-description">
                The risk estimation process consists of four steps.
                First, the general components that should be checked must be defined.
                Choose between the LLM that is verified and the compliance text domain and type that is used as input
            </p>

            <div className="dropdown-container">
                <div className="dropdown-info">
                    <h3 className="dropdown-title">LLM</h3>
                    <p className="dropdown-description">Choose your LLM to analyze!</p>
                </div>
                <FormControl sx={{m: 4, width: 600}}>
                    <InputLabel id="demo-multiple-llm-label"
                                style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}>LLM</InputLabel>
                    <Select
                        id="llm-select"
                        value={llm}
                        onChange={handleLLMChange}
                        input={<OutlinedInput label="LLM"/>}
                        MenuProps={MenuProps}
                        style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                    >
                        {llms.map((llm) => (
                            <MenuItem
                                key={llm._id}
                                value={llm.name}
                                style={getStyles(llm.name, llms, theme)}
                            >
                                {llm.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <div className="dropdown-container">
                <div className="dropdown-info">
                    <h3 className="dropdown-title">Task</h3>
                    <p className="dropdown-description">Choose the Task that is performed by the LLM!</p>
                </div>
                <FormControl sx={{m: 4, width: 600}}>
                    <InputLabel id="demo-multiple-llm-label"
                                style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}>Task</InputLabel>
                    <Select
                        id="llm-select"
                        value={task}
                        onChange={handleTaskChange}
                        input={<OutlinedInput label="Task"/>}
                        MenuProps={MenuProps}
                        style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                    >
                        {tasks.map((task, index) => (
                            <MenuItem
                                key={task}
                                value={task}
                                style={getStyles(task, tasks, theme)}
                            >
                                {task}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>


            <div className="dropdown-container">
                <div className="dropdown-info">
                    <h3 className="dropdown-title">Type of Data</h3>
                    <p className="dropdown-description">(Optionally) Choose the type of input data processed by the
                        LLM!</p>
                </div>
                <FormControl sx={{m: 4, width: 600}}>
                    <InputLabel id="type-input-label"
                                style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}>Type</InputLabel>
                    <Select
                        id="type-select"
                        value={type}
                        onChange={handleTypeChange}
                        input={<OutlinedInput label="Type"/>}
                        MenuProps={MenuProps}
                        style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                    >
                        {types.map((type) => (
                            <MenuItem
                                key={type}
                                value={type}
                                style={getStyles(type, types, theme)}
                            >
                                {type}
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
                    Start Risk Estimation
                </Button>
            </div>

        </React.Fragment>
    );
};

export default ComponentInfo;
