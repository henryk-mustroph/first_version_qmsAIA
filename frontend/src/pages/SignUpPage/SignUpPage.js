import React, {useState} from 'react';
import {Box, Button, TextField, Typography, Container, Grid, Snackbar} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useNavigate} from 'react-router-dom';
import {Link as RouterLink} from 'react-router-dom';

import './SignUpPage.css';

const SignUp = () => {

    // Ensure the font is loaded by using a ThemeProvider
    const theme = createTheme({
        typography: {
            fontFamily: 'Encode Sans Expanded, sans-serif',
        },
    });

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // State for Snackbar
    const [snackbarData, setSnackbarData] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const navigate = useNavigate();

    // Create User in RMS Database:
    const createRefUserServices = async (_id, path) => {
        const user = {
            _id
        };
        try {
            const response = await fetch(path, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('User object created:', data);
            return data;
        } catch (error) {
            console.error('There was a problem creating the user object:', error);
            throw error;
        }
    };

    const handleSignUp = async (e) => {
        var data = null;
        e.preventDefault();
        if (!username || !email || !password) {
            handleOpenSnackbar('Signup was not successfull: All fields are mandatory!', 'error')
            return;
        }

        // Local Development
        // const response = await fetch('http://127.0.0.1:4999/user_auth_service/users/signup/', {

        //Production
        const response = await fetch('https://power.bpm.cit.tum.de/henryk_backend/user_auth_service/users/signup/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, email, password})
        });
        if (response.ok) {
            try {
                data = await response.json();

                // 2/3. Store user data in rms module and DMDGS module

                // Production
                const userJsonRMS = await createRefUserServices(data._id, 'https://power.bpm.cit.tum.de/henryk_backend/rms_service/users/');

                // Production
                const userJsonDMDGS = await createRefUserServices(data._id, 'https://power.bpm.cit.tum.de/henryk_backend/dmdgs_service/users/');

                // 4. Check that users are the same for RMS and DMDGS
                console.log(userJsonRMS);
                console.log(userJsonDMDGS);
                handleOpenSnackbar('Login successfully', 'success')
                navigate('/');

            } catch (error) {
                handleOpenSnackbar('An error occurred while creating risk identification and assessment', 'error')
                console.error('There was a problem fetching the data:', error);
            }

        } else {
            handleOpenSnackbar('Login not successfully: Wrong user name/ email or password', 'error')
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

    return (
        <div className="signup-page">

            <h1 className="login-title">Quality Management System for Large Language Models</h1>
            <h2 className="signup-title">Sign Up an make an account to access the QMS.</h2>

            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <h3> Sign Up</h3>

                    <Box component="form" onSubmit={handleSignUp} noValidate sx={{mt: 1}}>

                        <ThemeProvider theme={theme}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </ThemeProvider>

                        <ThemeProvider theme={theme}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </ThemeProvider>

                        <ThemeProvider theme={theme}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </ThemeProvider>

                        <Button
                            style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Sign Up
                        </Button>
                        <Grid container>
                            <Grid item>
                                <RouterLink to="/" style={{textDecoration: 'none'}}>

                                    <ThemeProvider theme={theme}>
                                        <Typography variant="body2" color="primary">
                                            {"Already have an account? Sign in"}
                                        </Typography>
                                    </ThemeProvider>

                                </RouterLink>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Snackbar */}
                    <Snackbar open={snackbarData.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
                        <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar}
                                  severity={snackbarData.severity}
                                  style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}>
                            {snackbarData.message}
                        </MuiAlert>
                    </Snackbar>

                </Box>
            </Container>

        </div>
    );
};

export default SignUp;
