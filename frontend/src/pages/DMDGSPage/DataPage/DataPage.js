import React, {useEffect, useState} from 'react';
import {Button, TextField, Select, MenuItem, InputLabel, FormControl, Box, Container} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import NavBar from "../../../components/NavBar/NavBar";
import Cookies from "js-cookie";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import "./DataPage.css";

// Ensure the font is loaded by using a ThemeProvider
const theme = createTheme({
    typography: {
        fontFamily: 'Encode Sans Expanded, sans-serif',
    },
});

const DataPage = () => {

    const [llms, setLlms] = useState([]);
    const [llm, setLlm] = useState(null);

    const [domains, setDomains] = useState([]);
    const [domain, setDomain] = useState(null);

    const [types, setTypes] = useState([]);
    const [type, setType] = useState(null);

    const [data, setData] = useState({
        name: '',
        origin: '',
        size: '',
    });

    const [dataCheck, setDataCheck] = useState({
        description: ''
    });

    const [submittedData, setSubmittedData] = useState(null);

    // State for Snackbar
    const [snackbarData, setSnackbarData] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Get the data for the training data, llm,
    useEffect(() => {
        // Production
        // Fetch data for select boxes
        fetchData('https://power.bpm.cit.tum.de/henryk_backend/dmdgs_service/domains/', setDomains);
        fetchData('https://power.bpm.cit.tum.de/henryk_backend/dmdgs_service/types/', setTypes);
        fetchData('https://power.bpm.cit.tum.de/henryk_backend/dmdgs_service/language_models/', setLlms);
    }, []);

    const fetchData = async (url, setDataCallback) => {
        try {
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Network responded with an error!');
            }
            const data = await response.json();
            setDataCallback(data);
        } catch (error) {
            console.error('There was a problem fetching the data:', error);
        }
    };

    // Create Training Data:
    const createTrainingDataCheck = async (description) => {
        const trainingDataCheck = {
            description
        };
        try {

            //Production
            const response = await fetch('https://power.bpm.cit.tum.de/henryk_backend/dmdgs_service/training_data_checks/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(trainingDataCheck)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Training data check object created:', data);
            return data;
        } catch (error) {
            console.error('There was a problem creating the training data check object:', error);
            throw error; // Propagate the error to be handled by the caller
        }
    };

    // Create Training Data:
    const createTrainingData = async (name, origin, type, domain, size, llms, training_data_check) => {
        const trainingData = {
            name,
            origin,
            type,
            domain,
            size,
            llms,
            training_data_check
        };
        try {
            // Production
            const response = await fetch('https://power.bpm.cit.tum.de/henryk_backend/dmdgs_service/training_data/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(trainingData)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Training data object created:', data);
            return data;
        } catch (error) {
            console.error('There was a problem creating the training data object:', error);
            throw error; // Propagate the error to be handled by the caller
        }
    };

    // Create Training Data:
    const updateUserAddTrainingData = async (user_id, trainingData_id) => {
        try {
            // Production
            const response = await fetch(`https://power.bpm.cit.tum.de/henryk_backend/dmdgs_service/users/${user_id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: trainingData_id
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('User is updated and training data reference added to user:', data);
            return data;
        } catch (error) {
            console.error('There was a problem creating the training data check object:', error);
            throw error;
        }
    };

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
    };

    const handleComplete = async () => {
        // 1. Users enters all data which are not optional:
        if (!data.name || !type || !domain || !llm || !dataCheck) {
            handleOpenSnackbar('Please fill in all required (non-optional) fields.', 'error');
            return;
        }
        try {
            // 2. Create Training Data Check
            let trainingDataCheck = null;
            try {
                trainingDataCheck = await createTrainingDataCheck(dataCheck.description);
            } catch (error) {
                console.log("Error: " + error);
                handleOpenSnackbar('Training Data Check information could not be processed.', 'error');
                throw (error);
            }

            // 3. Create Training Data
            var trainingData = null;
            try {
                trainingData = await createTrainingData(
                    data.name,
                    data.origin,
                    type,
                    domain,
                    data.size,
                    [llm],
                    trainingDataCheck
                );

            } catch (error) {
                console.log("Error: " + error);
                handleOpenSnackbar('Training Data information could not be processed.', 'error');
                throw (error);
            }

            // 4. Get the id of the training_data object that is returned and store it in cookies under /data/training_data/id
            const trainingDataId = trainingData._id;
            Cookies.set('/data/training_data/id', trainingDataId);

            // 5. Update the User that is stored in the cookie in /user by calling updateUserAddTrainingData
            const userId = Cookies.get('/current_user/id');
            await updateUserAddTrainingData(userId, trainingDataId);

            // 6. Set the cookies values for /data back in case all requests were successful
            const formData = {llm, ...data, description: dataCheck.description, domain: domain.name};
            setSubmittedData(formData);
            Cookies.set('/data', JSON.stringify(formData));

            // 7. Reset form fields
            setDomain(null)
            setType(null)
            setLlm(null);
            setData({name: '', origin: '', size: ''});
            setDataCheck({description: ''});

            // 8. Open success snackbar
            handleOpenSnackbar('Data successfully submitted!', 'success');

        } catch (error) {
            console.log("Error: " + error);
            handleOpenSnackbar('There was an error submitting the training data information.', 'error');
            throw (error);
        }
    };

    return (
        <div>
            <NavBar/>
            <div className="data-page">
                <h1 className='data-title'>Data Management and Data Governance System</h1>

                {/* Snackbar */}
                <Snackbar open={snackbarData.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
                    <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar}
                              severity={snackbarData.severity} style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}>
                        {snackbarData.message}
                    </MuiAlert>
                </Snackbar>

                <div className='data-content'>
                    <p className='page-description'>
                        This page is a dummy for the data management and data governance system so far. You can select
                        your LLM, the data you used to train, validate and test it, and a description of compliance. For
                        example, what guarantees that the use of the data does not violate the regulations of the GDPR.
                    </p>

                    <div className="data-classification-box">
                        <h2 align="center">AI Data Management and Data Governance Regulations</h2>
                        <p align="left"> All regulations are based on the Article set up in the EU Artificial
                            Intelligence Act [1]</p>
                        <p align="left">
                            <ul>
                                <li><b>Important High-Risk AI System Regulations:</b></li>
                                <ul>
                                    <li><b>Article 10:</b> Data Management and Data Governance</li>
                                </ul>
                            </ul>
                        </p>
                    </div>

                    <Container maxWidth="md">
                        <Box sx={{width: '100%', maxWidth: '1000px', margin: '0 auto'}}>

                            <h3 align='center'>LLM Information</h3>

                            <FormControl fullWidth margin="normal">
                                <InputLabel id="llmName-label" style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}>
                                    LLM - Choose the LLM that used the data for training, validating, or testing
                                </InputLabel>
                                <Select
                                    fullWidth
                                    labelId="llmName-label"
                                    style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                                    value={llm ? llm.name : ''}
                                    onChange={(e) => {
                                        const selectedLlm = llms.find(item => item.name === e.target.value);
                                        setLlm(selectedLlm);
                                    }}
                                    label="LLM - Choose the LLM that used the data for training, validating, or testing"
                                >
                                    {llms.map((llm) => (
                                        <MenuItem
                                            key={llm._id}
                                            value={llm.name}
                                            style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                                        >
                                            {llm.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <h3 align='center'>Data Information</h3>
                            <ThemeProvider theme={theme}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Data Name - Give the dataset a name!"
                                    style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                                    value={data.name}
                                    onChange={(e) => setData({...data, name: e.target.value})}
                                />
                            </ThemeProvider>

                            <ThemeProvider theme={theme}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Data Origin - Where does the data come from?"
                                    style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                                    multiline
                                    rows={4}
                                    value={data.origin}
                                    onChange={(e) => setData({...data, origin: e.target.value})}
                                />
                            </ThemeProvider>

                            <FormControl fullWidth margin="normal">
                                <InputLabel id="type-label" style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}>
                                    Type - Select the type of the data!
                                </InputLabel>
                                <Select
                                    labelId="type-label"
                                    style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                                    value={type ? type.name : ''}
                                    onChange={(e) => {
                                        const selectedType = types.find(item => item.name === e.target.value);
                                        setType(selectedType);
                                    }}
                                    label="Type - Select the type of the data!"
                                >
                                    {types.map((option) => (
                                        <MenuItem
                                            key={option._id}
                                            value={option.name}
                                            style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                                        >
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <InputLabel id="domain-label" style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}>
                                    Domain - From which domain is the dataset!
                                </InputLabel>
                                <Select
                                    labelId="domain-label"
                                    style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                                    value={domain ? domain.name : ''}
                                    onChange={(e) => {
                                        const selectedDomain = domains.find(item => item.name === e.target.value);
                                        setDomain(selectedDomain);
                                    }}
                                    label="Domain - From which domain is the dataset!"
                                >
                                    {domains.map((option) => (
                                        <MenuItem
                                            key={option._id}
                                            value={option.name}
                                            style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                                        >
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <ThemeProvider theme={theme}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Size - What is the size of the dataset?"
                                    style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                                    value={data.size}
                                    onChange={(e) => setData({...data, size: e.target.value})}
                                />
                            </ThemeProvider>

                            <h3 align='center'>Data Check Information</h3>
                            <ThemeProvider theme={theme}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Description - Add a description and proof that data is compliant with EU AIA Article 10"
                                    style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                                    multiline
                                    rows={5}
                                    value={dataCheck.description}
                                    onChange={(e) => setDataCheck({description: e.target.value})}
                                />
                            </ThemeProvider>

                            <div className="complete-button">
                                <Button
                                    onClick={handleComplete}
                                    className="complete-button-detail"
                                    color="inherit"
                                    fontFamily="inherit"
                                    variant="contained"
                                >
                                    Complete
                                </Button>
                            </div>

                        </Box>

                        {submittedData && (
                            <Box>
                                <h3 align='center'>Submitted Data</h3>

                                <p align='left'><strong>LLM Name:</strong> <br/>
                                    <span>{submittedData.llm.name}</span>
                                </p>

                                <p align='left'><strong>Data Name:</strong> <br/>
                                    <span>{submittedData.name}</span>
                                </p>

                                <p align='left'><strong>Domain:</strong> <br/>
                                    <spa>{submittedData.domain}</spa>
                                </p>

                                <p align='left'><strong>Compliance Description:</strong> <br/>
                                    <span>{submittedData.description}</span>
                                </p>

                            </Box>
                        )}
                    </Container>
                    <p className='footer'>[1] European Union: Regulation of the european parliament and of the council
                        of laying down harmonised rules on artificial intelligence and amending regulations (artificial
                        intelligence act) (corrigendum 19.04.2024) (2024), 2021/0106(COD)</p>
                </div>
            </div>
        </div>
    );
};

export default DataPage;
