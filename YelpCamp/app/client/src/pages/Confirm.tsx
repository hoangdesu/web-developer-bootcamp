import styled from '@emotion/styled';
import axios from 'axios';
import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import CheckmarkCSSAnimation from '../components/CheckmarkCSSAnimation';

const Button = styled.button`
    width: 200px;
    height: 100px;
`;

const Confirm = () => {
    const { reservationId } = useLoaderData();
    console.log(reservationId);
    const [showCheckmark, setShowCheckmark] = useState(false);

    const makePayment = () => {
        axios.get(`/api/v1/reservation/${reservationId}/pay`).then(data => {
            console.log('AFTER PAY:', data);
            // reservationQuery.refetch();
            setShowCheckmark(true);
        });
    };
    return (
        <div>
            <h1>Confirm on mobile</h1>

            <p>id: {reservationId}</p>

            {showCheckmark && <CheckmarkCSSAnimation />}

            <div className="w-screen h-screen flex flex-col items-center justify-center">
                <Button onClick={makePayment}>Confirm</Button>
            </div>

        </div>
    );
};

export default Confirm;
