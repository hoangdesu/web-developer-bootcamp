import React, { useEffect, useState } from 'react';
import axios from '../../config/yelpcampAxios';
import { useQueries } from 'react-query';
import { useLoaderData } from 'react-router-dom';

export async function loader({ params }) {
    return { campgroundId: params.campgroundId };
}

const ModalConfirmPayment = () => {
    const { campgroundId } = useLoaderData();
    console.log('campgroundId', campgroundId);
    const [seconds, setSeconds] = useState(60);
    const [status, setStatus] = useState('PENDING');

    const url = `${window.location.protocol}//${window.location.host}/reservation/abc/confirm`;

    useEffect(() => {
        const paymentTimer = setInterval(() => {
            axios
                .get('/api/v1/reservation/status')
                .then(res => res.data)
                .then(data => {
                    console.log(data);
                    if (data === 'PAID') {
                        setStatus('PAID!');
                    }
                });

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
    console.log(window.location.protocol, window.location.host, window.location.hostname);
    const urlForQR = `${window.location.protocol}//${window.location.host}`;

    const [qrQuery] = useQueries([
        {
            queryKey: ['reservationQR'],
            queryFn: () =>
                // axios.get(`/api/v1/reservation/${url}/qr`).then(res => res.data),
                axios
                    .post(`/api/v1/reservation/qr`, {
                        url: urlForQR,
                    })
                    .then(res => res.data),
        },
    ]);

    if (qrQuery.isLoading) return <>Loading...</>;

    if (qrQuery.error) return <>Error</>;

    return (
        <div>
            <h1>Confirm payment</h1>
            <p>Online payment</p>

            <img src={qrQuery.data} alt="" height={200} />
            <p>{seconds}</p>
            <p>Status: {status}</p>
        </div>
    );
};

export default ModalConfirmPayment;
