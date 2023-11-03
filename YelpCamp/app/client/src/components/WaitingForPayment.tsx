import styled from '@emotion/styled';
import React from 'react';

const Container = styled.div`
    /* height: 100vh; */
    height: 100px;
    /* width: 100px; */
    display: flex;
    /* justify-content: center; */
    /* align-items: center; */
    /* background: #000; */
    .wave {
        width: 4px;
        height: 50px;
        background: linear-gradient(45deg, #313333, #1d1c1c);
        margin: 10px;
        animation: wave 1s linear infinite;
        border-radius: 20px;
    }
    .wave:nth-child(2) {
        animation-delay: 0.1s;
    }
    .wave:nth-child(3) {
        animation-delay: 0.2s;
    }
    .wave:nth-child(4) {
        animation-delay: 0.3s;
    }
    .wave:nth-child(5) {
        animation-delay: 0.4s;
    }
    .wave:nth-child(6) {
        animation-delay: 0.5s;
    }
    .wave:nth-child(7) {
        animation-delay: 0.6s;
    }
    .wave:nth-child(8) {
        animation-delay: 0.7s;
    }
    .wave:nth-child(9) {
        animation-delay: 0.8s;
    }
    .wave:nth-child(10) {
        animation-delay: 0.9s;
    }

    @keyframes wave {
        0% {
            transform: scale(0);
        }
        50% {
            transform: scale(1);
        }
        100% {
            transform: scale(0);
        }
    }
`;

const WaitingForPayment = () => {
    return (
        <Container>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
        </Container>
    );
};

export default WaitingForPayment;
