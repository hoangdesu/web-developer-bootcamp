import React, { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Alert, Button } from 'react-bootstrap';

import PageContainer from '../components/PageContainer';
import PrimaryBlackButton from '../components/Buttons/PrimaryBlackButton';
import { AxiosError } from 'axios';
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
                    {err?.message || err?.data || err || 'Something went wrong'}
                </Alert.Heading>
                <p>{err?.stack || '😕'}</p>
            </Alert>

            <PrimaryBlackButton onClick={() => navigate('/')}>
                <ArrowBackIcon /> Back to Homepage
            </PrimaryBlackButton>
        </PageContainer>
    );
};

export default ErrorBoundary;
