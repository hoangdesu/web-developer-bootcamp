import React, { useContext } from 'react';
import AppContext from '../../store/app-context';
import { Alert, AlertColor, Snackbar } from '@mui/material';

const PageSnackbar = () => {
    const appContext = useContext(AppContext);
    const { isOpen, message, severity } = appContext.snackbar;

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        // Keep the same UI before closing snackbar.
        // Otherwise message and severity will be flashed before closing (:/)
        appContext.setSnackbar(false, message, severity);
    };

    return (
        <Snackbar open={isOpen} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity as AlertColor} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default PageSnackbar;
