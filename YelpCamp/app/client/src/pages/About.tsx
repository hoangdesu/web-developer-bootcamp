import React from 'react';

import Navbar from '../components/Navbar';
import PageContainer from '../components/PageContainer';
import Footer from '../components/Footer';

const About: React.FunctionComponent = () => {
    return (
        <PageContainer>
            <Navbar />

            <h1>About</h1>
            
            <Footer />
        </PageContainer>
    );
};

export default About;
