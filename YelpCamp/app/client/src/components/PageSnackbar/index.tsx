import React, { useContext } from 'react';
import AppContext from '../../store/app-context';
import { Alert, AlertColor, Snackbar } from '@mui/material';

const PageSnackbar = () => {
    const appContext = useContext(AppContext);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        appContext.snackbar.close();
    };

    console.log('appContext.snackbar', appContext.snackbar);

    return (
        <Snackbar
            open={appContext.snackbar.isOpen}
            autoHideDuration={2000}
            onClose={handleClose}
            message="Note archived"
            //   action={action}
        >
            <Alert
                onClose={handleClose}
                severity={appContext.snackbar.severity as AlertColor}
                sx={{ width: '100%' }}
            >
                {appContext.snackbar.message}
            </Alert>
        </Snackbar>
    );
};

export default PageSnackbar;
