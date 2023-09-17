import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useQueries } from 'react-query';
import Logo from '../assets/logo.png';
import styled from '@emotion/styled';

export async function loader({ params }) {
    return { reservationId: params.reservationId };
}

const StyledLogo = styled.img`
    position: absolute;
    width: 60px;
    top: 80px;
    left: 80px;
    background: white;
`;

const Reservation = () => {
    const { reservationId } = useLoaderData();
    const [status, setStatus] = useState('PENDING');
    const [seconds, setSeconds] = useState(60);

    const navigate = useNavigate();

    console.log(window.location.protocol, window.location.host, window.location.hostname);
    const urlForQR = `${window.location.protocol}//${window.location.host}/reservation/${reservationId}/confirm`;

    console.log('urlForQR', urlForQR);

    // axios.post(`/api/v1/reservation/${reservationId}/pay`)
    const [reservationQuery, qrQuery] = useQueries([
        {
            queryKey: ['getReservationById'],
            queryFn: () =>
                axios.get(`/api/v1/reservation/${reservationId}`).then(data => data.data),
        },
        {
            queryKey: ['getQr'],
            queryFn: () =>
                axios
                    .post(`/api/v1/reservation/${reservationId}/qr`, { url: urlForQR })
                    .then(data => data.data),
        },
    ]);

    useEffect(() => {
        const paymentTimer = setInterval(() => {
            axios
                .get(`/api/v1/reservation/${reservationId}/status`)
                .then(res => res.data)
                .then(data => {
                    console.log('STATUS:', data);
                    if (data === 'PAID') {
                        // setStatus('PAID!');
                        reservationQuery.refetch();
                        setTimeout(() => {
                            navigate(-1);
                        }, 1000);
                    }
                });
            // reservationQuery.refetch();
            // axios.get(`/api/v1/reservation/${reservationId}`).then(data => data.data),


            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                clearInterval(paymentTimer);
            }
        }, 1000);
        return () => {
            clearInterval(paymentTimer);
        };
    });

    if (reservationQuery.isLoading || qrQuery.isLoading) return <>Loading...</>;
    if (reservationQuery.error || qrQuery.isLoading) return <>Error</>;

    const reservation = reservationQuery.data;
    // console.log(reservation);

    const qr = qrQuery.data;
    console.log(qr);

    const makePayment = () => {
        axios.get(`/api/v1/reservation/${reservationId}/pay`).then(data => {
            console.log('AFTER PAY:', data);
            reservationQuery.refetch();
        });
    };

    return (
        <div>
            <h1>Confirm Reservation</h1>
            <p>Confirm Reservation: {reservationId}</p>
            <p>Booked by: {reservation.bookedBy.username}</p>
            <p>Campground: {reservation.campground.title}</p>
            <p>Checkin: {reservation.checkIn}</p>
            <p>Checkout: {reservation.checkOut}</p>
            <p>Status: {reservation.status}</p>

            <p>{seconds}</p>
            <button onClick={makePayment}>Pay</button>

            <div style={{float: 'left', position: 'relative'}}>
                <img src={qr} alt="qr" />
                <StyledLogo src={Logo} alt="logo" />
            </div>
        </div>
    );
};

export default Reservation;
