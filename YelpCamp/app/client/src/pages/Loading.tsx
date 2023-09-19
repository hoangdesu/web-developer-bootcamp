import styled from '@emotion/styled';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Container = styled.div`
    width: 100vw;
    height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

// TODO: replace Spinner loading with skeleton
const Loading = () => {
    return (
        <>
            <Navbar />
            <Container>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        </>
    );
};

export default Loading;
