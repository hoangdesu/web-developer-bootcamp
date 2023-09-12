import React, { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Alert, Button } from 'react-bootstrap';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';

interface ErrorBoundaryProps {
    error?: Error;
}

const ErrorBoundary: FunctionComponent<ErrorBoundaryProps> = ({ error = null }) => {
    const navigate = useNavigate();

    return (
        <PageContainer>
            <Navbar />
            <Container className="mt-3">
                <Alert variant="danger">
                    <Alert.Heading>
                        {error?.message || error?.data || 'Something went wrong'}
                    </Alert.Heading>
                    <p>{error?.stack || ':/'}</p>
                </Alert>

                <Button variant="secondary" onClick={() => navigate('/')}>
                    Home
                </Button>
            </Container>
            <Footer />
        </PageContainer>
    );
};

export default ErrorBoundary;
