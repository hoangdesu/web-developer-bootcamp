import React from 'react';

import Container from 'react-bootstrap/Container';

import Navbar from '../components/Navbar';
import PageContainer from '../components/PageContainer';
import Footer from '../components/Footer';

const About: React.FunctionComponent = () => {
    return (
        <PageContainer>
            <Navbar />

            <Container>
                <h1>About</h1>
            </Container>
            
            <Footer />
        </PageContainer>
    );
};

export default About;
