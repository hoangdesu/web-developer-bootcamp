import React, { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

import PageContainer from '../components/PageContainer';
import PrimaryBlackButton from '../components/Buttons/PrimaryBlackButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface ErrorBoundaryProps {
    err?: Error | string;
}

const ErrorBoundary: FunctionComponent<ErrorBoundaryProps> = ({ err = null }) => {
    const navigate = useNavigate();

    return (
        <PageContainer>
            <Alert variant="danger">
                <Alert.Heading>
                    {`Error: ${err?.response.data}` ||
                        err?.message ||
                        err?.data ||
                        err ||
                        'Something went wrong'}
                </Alert.Heading>
                <p>{'😕'}</p>
            </Alert>

            <PrimaryBlackButton
                onClick={() => navigate('/')}
                className="flex flex-row items-center justify-center"
            >
                <ArrowBackIcon /> Back to Homepage
            </PrimaryBlackButton>
        </PageContainer>
    );
};

export default ErrorBoundary;
