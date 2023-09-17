import React from 'react';
import axios from 'axios';
import { useQueries } from 'react-query';
import { useLoaderData } from 'react-router-dom';

export async function loader({ params }) {
    return { campgroundId: params.campgroundId };
}

const ModalConfirmPayment = () => {
    const { campgroundId } = useLoaderData();
    console.log('campgroundId', campgroundId);

    const url = `${window.location.protocol}//${window.location.host}/reservation/abc/confirm`

    const [qrQuery] = useQueries([
        {
            queryKey: ['reservationQR'],
            queryFn: () =>
                // axios.get(`/api/v1/reservation/${url}/qr`).then(res => res.data),
                axios.get(`/api/v1/reservation/${campgroundId}/qr`).then(res => res.data),
        },
    ]);

    if (qrQuery.isLoading) return <>Loading...</>;

    if (qrQuery.error) return <>Error</>;

    console.log(window.location.protocol, window.location.host, window.location.hostname);
    

    return (
        <div>
            <h1>Confirm payment</h1>
            <p>Online payment</p>

            <img src={qrQuery.data} alt="" height={200}/>
        </div>
    );
};

export default ModalConfirmPayment;
