import React, {useEffect, useState} from 'react';
import NavBar from "../../../components/NavBar/NavBar"
import {createTheme, ThemeProvider} from '@mui/material/styles';

import './CompDataPage.css';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {Box, Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import Container from "@mui/material/Container";

// Ensure the font is loaded by using a ThemeProvider
const theme = createTheme({
    typography: {
        fontFamily: 'Encode Sans Expanded, sans-serif',
    },
});

const CompDataPage = () => {

    const [domains, setDomains] = useState([]);
    const [domain, setDomain] = useState(null);

    const types = ["ISO Standard", "Legal Data", "Process Description"]
    const [type, setType] = useState("");

    const [source, setSource] = useState("");
    const [inputText, setInputText] = useState("");

    const tasks = ["Summarization", "Modelling"]
    const [task, setTask] = useState("");

    const [instruction, setInstruction] = useState("");
    const [gtText, setGTText] = useState("");
    const [adversarialTarget, setAdversarialTarget] = useState("");

    // Get the data for the training data, llm,
    useEffect(() => {
        // Local Development
        // Fetch data for select boxes
        fetchData('https://power.bpm.cit.tum.de/henryk_backend/rms_service/domains/', setDomains).then(r => console.log(r));
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

    // State for Snackbar
    const [snackbarData, setSnackbarData] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Close Snackbar
    const handleCloseSnackbar = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarData({...snackbarData, open: false});
    };

    // Open Snackbar
    const handleOpenSnackbar = (message, severity) => {
        setSnackbarData({
            open: true,
            message: message,
            severity: severity
        });

        setDomain(null)
        setType("")
        setTask("")
        setSource("")
        setInputText("")
        setInstruction("")
        setGTText("")
        setAdversarialTarget("")
    };

    // Create Training Data:
    const createTrainingData = async (domain, type, source, inputText, task, instruction, gtText, adversarialTarget) => {
        // If condition: Check that all mandatory risk analysis data by user are set.
        if (domain && type !== "" && inputText !== "" && tasks && instruction !== "" && gtText !== "") {
            const riskAnalysisData = {
                "domain": domain,
                "type": type,
                "source": source,
                "input_text": inputText,
                "task": task,
                "instruction": instruction,
                "gt_text": gtText,
                "adversarial_target": adversarialTarget
            };
            try {
                // Production
                const response = await fetch('https://power.bpm.cit.tum.de/henryk_backend/rms_service/data/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(riskAnalysisData)
                });
                if (!response.ok) {
                    handleOpenSnackbar("Risk analysis data did not store successfully.", "error")
                    return;
                }
                const data = await response.json();
                console.log('Risk analysis data object created:', data);
                handleOpenSnackbar("Risk analysis data stored successfully.", "success")
                // return data;
            } catch (error) {
                console.error('There was a problem creating the training data object:', error);
                handleOpenSnackbar("Risk analysis data did not store successfully.", "error")
                // throw error; // Propagate the error to be handled by the caller
            }
        }
        // Else: Open snackbar and signal error.
        else {
            handleOpenSnackbar("Fill out all required fields.", "error");
        }
    };

    const submitRiskData = async () => {
        await createTrainingData(domain, type, source, inputText, task, instruction, gtText, adversarialTarget)
    }

    return (
        <div className="legal-page">
            <NavBar/>
            <div className='legal-page-text'>
                <h1 className='verif-data-title'>Verification Data for Risk Estimation
                </h1>

                {/* Snackbar */}
                <Snackbar open={snackbarData.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
                    <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar}
                              severity={snackbarData.severity} style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}>
                        {snackbarData.message}
                    </MuiAlert>
                </Snackbar>

                <p>The data compliance page let you add the data that are used for a risk estimation.
                    The data which is added here, is selected for evaluating the model in the risk analysis,
                    depending on the domain, and type of the data.
                </p>

                <Container maxWidth="md">
                    <Box sx={{width: '100%', maxWidth: '1000px', margin: '0 auto'}}>

                        <h3 align='center'>Domain, Type, Task & Source</h3>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="domain-label" style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}>
                                Domain: Choose the domain the prompt and input data belongs to.
                            </InputLabel>
                            <Select
                                fullWidth
                                labelId="domain-label"
                                label="Domain: Choose the domain the prompt and input data belongs to."
                                style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                                value={domain ? domain.name : ''}
                                onChange={(e) => {
                                    const selectedDomain = domains.find(item => item.name === e.target.value);
                                    setDomain(selectedDomain);
                                }}
                            >
                                {domains.map((d) => (
                                    <MenuItem
                                        key={d._id}
                                        value={d.name}
                                        style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                                    >
                                        {d.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel id="domain-label" style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}>
                                Type: Choose the type of data, the category of text.
                            </InputLabel>
                            <Select
                                fullWidth
                                labelId="type-label"
                                label="Type: Choose the type of data, the category of text."
                                style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                {types.map((t) => (
                                    <MenuItem
                                        key={t}
                                        value={t}
                                        style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                                    >
                                        {t}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel id="domain-label" style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}>
                                Task: Choose the task the prompt stands for.
                            </InputLabel>
                            <Select
                                fullWidth
                                labelId="task-label"
                                label="Task: Choose the task the prompt stands for."
                                style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                                value={task}
                                onChange={(e) => setTask(e.target.value)}
                            >
                                {tasks.map((ta) => (
                                    <MenuItem
                                        key={ta}
                                        value={ta}
                                        style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                                    >
                                        {ta}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <ThemeProvider theme={theme}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Source: Where is the data from or where is the data actually located."
                                style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                            />
                        </ThemeProvider>

                        <h3 align='center'>Prompt & Input Text</h3>

                        <ThemeProvider theme={theme}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Prompt: Instruction for LLM."
                                style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                                multiline
                                rows={5}
                                value={instruction}
                                onChange={(e) => setInstruction(e.target.value)}
                            />
                        </ThemeProvider>

                        <ThemeProvider theme={theme}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Input Text: This text is analyzed by the LLM and is added after the prompt."
                                style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                                multiline
                                rows={5}
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </ThemeProvider>


                        <h3 align='center'> Target (Ground Truth) & Adversarial Target</h3>

                        <ThemeProvider theme={theme}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Target - Target text, the ground truth output by the model based on the prompt and input text."
                                style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                                multiline
                                rows={5}
                                value={gtText}
                                onChange={(e) => setGTText(e.target.value)}
                            />
                        </ThemeProvider>

                        <ThemeProvider theme={theme}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Adversarial Target: Wrong output by the model that should not be generated."
                                style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                                multiline
                                rows={5}
                                value={adversarialTarget}
                                onChange={(e) => setAdversarialTarget(e.target.value)}
                            />
                        </ThemeProvider>

                        {/*Button
                        <div className="complete-button">
                            <Button
                                onClick={submitRiskData}
                                className="complete-button-detail"
                                color="inherit"
                                fontFamily="inherit"
                                variant="contained"
                            >
                                Save
                            </Button>
                        </div>
                        */}

                        <h3>Button to post your own data is coming soon!</h3>

                    </Box>
                </Container>

            </div>
        </div>
    );
}

export default CompDataPage;
