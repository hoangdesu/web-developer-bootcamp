import React, { useEffect, useRef, useState, useContext } from 'react';
import axios from '../config/yelpcampAxios';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useQueries } from 'react-query';
import Logo from '../assets/logo.png';
import styled from '@emotion/styled';
import * as qrCode from '@bitjson/qr-code';
import { QRCode } from 'react-qrcode-logo';
import PageContainer from '../components/PageContainer';
import AppContext from '../store/app-context';
import CheckmarkCSSAnimation from '../components/CheckmarkCSSAnimation';

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
    const { reservationId } = useLoaderData() as { reservationId: string };
    const [status, setStatus] = useState('PENDING');
    const [seconds, setSeconds] = useState(60);
    const appContext = useContext(AppContext);

    const navigate = useNavigate();

    console.log(window.location.protocol, window.location.host, window.location.hostname);
    const urlForQR = `${window.location.protocol}//${window.location.host}/reservation/${reservationId}/confirm`;

    const qrRef = useRef(null);
    console.log('qrRef', qrRef.current);

    console.log('urlForQR', urlForQR);
    useEffect(() => {
        const qrEl = qrCode.defineCustomElements(window);
        console.log('qrEl', qrEl);

        // qrRef.animateQRCode((targets, _x, _y, _count, entity) => ({
        //     targets,
        //     from: entity === 'module' ? Math.random() * 200 : 200,
        //     duration: 500,
        //     easing: 'cubic-bezier(.5,0,1,1)',
        //     web: { opacity: [1, 0], scale: [1, 1.1, 0.5] },
        //   }));
        // document.getElementById('qr1').animateQRCode((targets, _x, _y, _count, entity) => ({
        //     targets,
        //     from: entity === 'module' ? Math.random() * 200 : 200,
        //     duration: 500,
        //     easing: 'cubic-bezier(.5,0,1,1)',
        //     web: { opacity: [1, 0], scale: [1, 1.1, 0.5] }
        //   }));

        const qr1 = document.getElementById('qr1');
        console.log('qr1', qr1);

        qr1?.addEventListener('click', () => {
            console.log('hi');
        });

        if (!qrRef.current) return;
        qrRef.current.addEventListener('click', () => {
            console.log('clicked qr');
        });
    }, []);

    React.useEffect(() => {
        console.log('qrRef', qrRef);
        console.log('qrRef.current', qrRef.current);
        // qrRef.current.animateQRCode('MaterializeIn');
        if (qrRef.current) {
            qrRef.current.animateQRCode('RadialRippleIn');
        }
        // if (!qrRef.current) return;
        // qrRef.current.addEventListener('click', () => {
        //     console.log('clicked qr');

        // })
    }, [qrRef]);

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
                        setStatus('PAID!');
                        setTimeout(() => {
                            navigate(`/user/${appContext.currentUser!.username}?tab=reservations`);
                        }, 5000);
                        reservationQuery.refetch();
                        appContext.setModal({
                            open: true,
                            content: (
                                <div>
                                    <h1>Payment received</h1>
                                    <p>Thank you for your reservation with YelpCamp!</p>

                                    <CheckmarkCSSAnimation />
                                </div>
                            ),
                        });
                    }
                });
            // reservationQuery.refetch();
            // axios.get(`/api/v1/reservation/${reservationId}`).then(data => data.data),

            // qrRef.current.animateQRCode('RadialRippleIn')

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
        <PageContainer>
            <h1>Confirm Reservation</h1>
            <p>Confirm Reservation: {reservationId}</p>
            <p>Booked by: {reservation.bookedBy.username}</p>
            <p>Campground: {reservation.campground.title}</p>
            <p>Checkin: {reservation.checkIn}</p>
            <p>Checkout: {reservation.checkOut}</p>
            <p>Status: {reservation.status}</p>

            <p>{seconds}</p>
            <button onClick={makePayment}>Pay</button>

            <div style={{ float: 'left', position: 'relative' }}>
                <img src={qr} alt="qr" />
                <StyledLogo src={Logo} alt="logo" />
            </div>

            <qr-code
                id="qr1"
                contents={urlForQR}
                module-color="#1c7d43"
                position-ring-color="#13532d"
                position-center-color="#70c559"
                mask-x-to-y-ratio="1.2"
                style={{
                    width: '300px',
                    height: '300px',
                    margin: '2em auto',
                    backgroundColor: '#fff',
                }}
                ref={qrRef}
            >
                <img
                    src={Logo}
                    alt="logo"
                    slot="icon"
                    style={{ background: 'white', width: '100%' }}
                />
            </qr-code>
            <button
                onClick={() => {
                    console.log(qrRef);
                    qrRef.current.addEventListener('click', () => {
                        console.log('clicked qr');
                    });
                    qrRef.current.animateQRCode('RadialRippleIn');
                    // qrRef.current.animateQRCode((targets, _x, _y, _count, entity) => ({
                    //     targets,
                    //     from: entity === 'module' ? Math.random() * 200 : 200,
                    //     duration: 500,
                    //     easing: 'cubic-bezier(.5,0,1,1)',
                    //     web: { opacity: [1, 0], scale: [1, 1.1, 0.5] },
                    //   }));
                }}
            >
                QRREF
            </button>

            <QRCode
                value={urlForQR}
                logoImage={Logo}
                ecLevel={'H'}
                size={300}
                removeQrCodeBehindLogo
                logoPadding={10}
            />
            {/* 
            <img
                src="https://cdn.dribbble.com/users/1751799/screenshots/5512482/media/1cbd3594bb5e8d90924a105d4aae924c.gif"
                alt=""
            /> */}
        </PageContainer>
    );
};

export default Reservation;
