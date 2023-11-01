import axios from '../config/yelpcampAxios';
import React, { useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useLoaderData, useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import Loading from './Loading';
import ErrorBoundary from './ErrorBoundary';
import { Col, Container, Row } from 'react-bootstrap';
import { averageRating } from '../helpers/campground';
import Logo from '../assets/logo.png';
import * as qrCode from '@bitjson/qr-code';
import AppContext from '../store/app-context';
import ModalPaymentReceived from '../components/Modals/ModalPaymentReceived';

export async function loader({ params }) {
    return { reservationId: params.reservationId };
}

const Checkout = () => {
    const { reservationId } = useLoaderData() as { reservationId: string };
    const appContext = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        const qrEl = qrCode.defineCustomElements(window);

        // TODO: check if status === PAID, redirect to Reservation page w/ message: you have paid
    }, []);

    const {
        data: resv,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ['getReservationById'],
        queryFn: () => axios.get(`/api/v1/reservations/${reservationId}`).then(data => data.data),
    });

    console.log(resv);

    useEffect(() => {
        const paymentTimer = setInterval(() => {
            axios.get(`/api/v1/reservations/${reservationId}/status`).then(res => {
                const { data } = res;
                console.log('STATUS:', data);
                if (data === 'PAID') {
                    // setStatus('PAID!');

                    // setTimeout(() => {
                    //     navigate(`/users/${appContext.currentUser!.username}?tab=reservations`);
                    // }, 5000);
                    refetch();
                    appContext.setModal({
                        open: true,
                        content: <ModalPaymentReceived />,
                    });
                    clearInterval(paymentTimer);
                }
            });
            // reservationQuery.refetch();

            // qrRef.current.animateQRCode('RadialRippleIn')

            // if (seconds > 0) {
            //     setSeconds(seconds - 1);
            // }
            // if (seconds === 0) {
            //     clearInterval(paymentTimer);
            // }
        }, 1000);
        return () => {
            clearInterval(paymentTimer);
        };
    }, []);

    if (isLoading) return <Loading />;

    if (isError) return <ErrorBoundary err={'Invalid Reservation ID'} />;

    const urlForQR = `${window.location.protocol}//${window.location.host}/reservations/${reservationId}/confirm`;

    // UI design ref: https://dribbble.com/shots/4631896-Prepayment-page
    return (
        <PageContainer>
            <h1>Checkout</h1>
            <Container>
                <Row>
                    {/* // Left col */}
                    <Col lg={8} className="bg-white border flex flex-col gap-5 p-3 mr-5 max-[991px]:mb-5">
                        <Row>
                            <p>id: {resv._id}</p>
                            <div className="">
                                <img
                                    src={resv.campground.images[0].thumbnail}
                                    alt="Campground thumbnail"
                                    width={100}
                                />
                                <div className="inline">
                                    <span>{resv.campground.title}</span>
                                    {/* bug: always show NEW */}
                                    <p>★ {averageRating(resv.campground)}</p>
                                    <p>{resv.campground.location}</p>
                                    <p>Host: {resv.campground.author.username}</p>
                                </div>
                            </div>
                        </Row>

                        <hr />

                        <Row>
                            <p>// info abt the reservation</p>
                            <div>Check-in: {resv.checkIn}</div>
                            <div>Check-out: {resv.checkOut}</div>
                            <p>Nights: {resv.nights}</p>
                            <p>Guests: {resv.guests}</p>
                        </Row>
                    </Col>

                    {/* Right col */}
                    <Col className="bg-white border flex flex-col gap-5 p-3">
                        <Row>
                            <p>// Price</p>

                            <p>Total amount: ${resv.totalAmount.toFixed(2)}</p>
                        </Row>
                        <Row>
                            <p>// QR code</p>

                            <p>Scan this QR code to pay</p>
                            <p>(You can also click on the QR code to open mobile view)</p>
                            {/* <a href={urlForQR} target="_blank" className=""> */}
                            <div
                                onClick={() => {
                                    window.open(urlForQR, '_blank', 'width=400, height=600');
                                }}
                                className="hover:cursor-pointer"
                            >
                                <qr-code
                                    id="qr1"
                                    contents={urlForQR}
                                    module-color="#1c7d43"
                                    position-ring-color="#13532d"
                                    position-center-color="#70c559"
                                    mask-x-to-y-ratio="1.2"
                                    style={{
                                        // width: '300px',
                                        // height: '300px',
                                        // margin: '2em auto',
                                        margin: 0,
                                        // backgroundColor: '#fff',
                                        padding: 0,
                                    }}
                                    // ref={qrRef}
                                    // ref={qrref}
                                >
                                    <img
                                        src={Logo}
                                        alt="logo"
                                        slot="icon"
                                        style={{ background: 'white', width: '100%' }}
                                    />
                                </qr-code>
                            </div>
                            <p>Status: {resv.status}</p>
                            {/* </a> */}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </PageContainer>
    );
};

export default Checkout;
