import React from 'react';

import { useRouteError } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';

const ErrorBoundary = () => {
    const error = useRouteError();
    console.error('ERROR:', error);
    return (
        <PageContainer>
            <Navbar />
            <div>
                <h1>Error</h1>
                <p>{error.message || error.data}</p>
            </div>
            <Footer />
        </PageContainer>
    );
};

export default ErrorBoundary;
