import React, { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Alert, Button } from 'react-bootstrap';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';

interface ErrorBoundaryProps {
    err?: Error;
}

const ErrorBoundary: FunctionComponent<ErrorBoundaryProps> = ({ err = null }) => {
    const navigate = useNavigate();

    return (
        <PageContainer>
            <Navbar />
            <Container className="mt-3">
                <Alert variant="danger">
                    <Alert.Heading>
                        {err?.message || err?.data || 'Something went wrong'}
                    </Alert.Heading>
                    <p>{err?.stack || ':/'}</p>
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
