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

import React, {useEffect, useState, useCallback} from 'react';
import {Navigate, Outlet, useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const ProtectedRoute = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [snackbarData, setSnackbarData] = useState({
        open: false,
        message: '',
        severity: 'warning', // Default severity
    });

    const handleCloseSnackbar = () => {
        setSnackbarData((prev) => ({...prev, open: false}));
    };

    const handleOpenSnackbar = (message, severity) => {
        setSnackbarData({open: true, message, severity});
    };

    const logout = useCallback((message, severity) => {
        Cookies.remove('/current_user/token');
        Cookies.remove('/current_user/id');
        Cookies.remove('/current_user/username');
        handleOpenSnackbar(message, severity);
        setTimeout(() => {
            navigate('/');
        }, 5000);
    }, [navigate]);

    const checkTokenValidity = useCallback(() => {
        const token = Cookies.get('/current_user/token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp > currentTime) {
                    setIsAuthenticated(true);
                    return true;
                } else {
                    logout('Your session has expired. Please log in again.', 'warning');
                    return false;
                }
            } catch (error) {
                console.error('Token decoding failed:', error);
                logout('An error occurred with your session. Please log in again.', 'error');
                return false;
            }
        } else {
            logout('You are not authenticated. Please log in.', 'error');
            return false;
        }
    }, [logout]);

    useEffect(() => {
        const isTokenValid = checkTokenValidity();
        setLoading(false);
        if (isTokenValid) {
            const interval = setInterval(() => {
                checkTokenValidity();
            }, 50000);
            return () => clearInterval(interval);
        }
    }, [checkTokenValidity]);

    if (loading) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <CircularProgress/>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/"/>;
    }

    return (
        <>
            <Outlet/>
            <Snackbar open={snackbarData.open} autoHideDuration={5000} onClose={handleCloseSnackbar}>
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleCloseSnackbar}
                    severity={snackbarData.severity}
                    style={{fontFamily: 'Encode Sans Expanded, sans-serif', backgroundColor: 'orange'}}
                >
                    {snackbarData.message}
                </MuiAlert>
            </Snackbar>
        </>
    );
};

export default ProtectedRoute;
