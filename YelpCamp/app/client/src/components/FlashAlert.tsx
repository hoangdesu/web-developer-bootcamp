import React, { useContext } from 'react';
import AppContext from '../store/app-context';
import FlashMessage from './FlashMessage';
import { Alert } from 'react-bootstrap';

const FlashAlert: React.FC = () => {
    const appContext = useContext(AppContext);

    return appContext.alert?.message ? (
        <FlashMessage duration={3 * 1000} persistOnHover={true}>
            <Alert variant={appContext.alert.variant} onClose={() => appContext.setAlert(null)} dismissible className="mb-2">
                <span>{appContext.alert.message}</span>
            </Alert>
        </FlashMessage>
    ) : null;
};

export default FlashAlert;
