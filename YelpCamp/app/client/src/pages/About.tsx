import React from 'react';

import Container from 'react-bootstrap/Container';

import Navbar from '../components/Navbar';
import PageContainer from '../components/PageContainer';
import Footer from '../components/Footer';

const About: React.FunctionComponent = () => {
    document.title = 'YelpCamp | About';
    return (
        <PageContainer>
            <h1>About</h1>
            <p>put something here...</p>
        </PageContainer>
    );
};

export default About;
