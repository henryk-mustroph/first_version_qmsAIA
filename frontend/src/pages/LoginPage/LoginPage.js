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

import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {Box, Button, TextField, Typography, Container, Grid} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {jwtDecode} from 'jwt-decode';

import './LoginPage.css';

const LoginPage = () => {

    // Ensure the font is loaded by using a ThemeProvider
    const theme = createTheme({
        typography: {
            fontFamily: 'Encode Sans Expanded, sans-serif',
        },
    });

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // State for Snackbar
    const [snackbarData, setSnackbarData] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const navigate = useNavigate();

    // Get token and user id from user authentication
    const handleLogin = async (e) => {
        const email = null;
        const user = {
            username,
            email,
            password
        };
        let data = null;
        try {
            e.preventDefault();
            // Production
            const response = await fetch('http://x.x.x.x:4999/user_auth_service/users/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            if (response.ok) {
                data = await response.json();

                // Get access token of user:
                Cookies.set('/current_user/token', data.access_token, {secure: true, sameSite: 'Strict'});
                // Get id of user:
                const token = jwtDecode(data.access_token)
                Cookies.set('/current_user/id', token.id, {secure: true, sameSite: 'Strict'});
                Cookies.set('/current_user/username', token.username, {secure: true, sameSite: 'Strict'});

                navigate('/home');

            } else {
                handleOpenSnackbar('Login not successfull: Wrong user name/ email or password', 'error');
                setUsername('');
                setPassword('');
                console.error('Login failed');
            }

        } catch (error) {
            handleOpenSnackbar('Login not successfull: Wrong user name/ email or password', 'error');
            setUsername('');
            setPassword('');
            console.error('There was a problem fetching the user data:', error);
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

        <React.Fragment>

            {/* Snackbar */}
            <Snackbar open={snackbarData.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleCloseSnackbar}
                    severity={snackbarData.severity}
                    style={{fontFamily: 'Encode Sans Expanded, sans-serif'}}
                >
                    {snackbarData.message}
                </MuiAlert>
            </Snackbar>

            <div className="login-page">
                <h1 className="login-title">Quality Management System for AI Systems</h1>
                <h2 className="signup-title">Log In to the QMS to verify and document your AI System.</h2>
                <h3 className="signup-title">Test Username: test</h3>
                <h3 className="signup-title">Test Password: test</h3>
                <Container component="main" maxWidth="xs">
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <h3>Sign in</h3>

                        <Box component="form" onSubmit={handleLogin} noValidate sx={{mt: 1}}>
                            <ThemeProvider theme={theme}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username or Email Address"
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
                                className='login-button'
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{mt: 3, mb: 2}}
                            >
                                Sign In
                            </Button>

                        </Box>
                    </Box>
                </Container>
            </div>

        </React.Fragment>
    );
};

export default LoginPage;

