import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { Container, Alert, Button } from 'react-bootstrap';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';

const ErrorBoundary = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    // console.log('ERRORRR:', error);
    return (
        <PageContainer>
            <Navbar />
            <Container className="mt-3">
                <Alert variant="danger">
                    <Alert.Heading>{error.message || error.data}</Alert.Heading>
                    <p>{error.stack || ''}</p>
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
