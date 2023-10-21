import axios from '../config/yelpcampAxios';
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useLoaderData } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import Loading from './Loading';
import ErrorBoundary from './ErrorBoundary';
import { Col, Container, Row } from 'react-bootstrap';
import { averageRating } from '../helpers/campground';
import Logo from '../assets/logo.png';
import * as qrCode from '@bitjson/qr-code';

export async function loader({ params }) {
    return { reservationId: params.reservationId };
}

const Checkout = () => {
    const { reservationId } = useLoaderData() as { reservationId: string };

    useEffect(() => {
        const qrEl = qrCode.defineCustomElements(window);
    }, []);

    const {
        data: resv,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['getReservationById'],
        queryFn: () => axios.get(`/api/v1/reservations/${reservationId}`).then(data => data.data),
    });

    console.log(resv);

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
                    <Col lg={8} className="bg-white flex flex-col gap-5 p-3">
                        <Row>
                            <p>// basic info abt campground</p>
                            <div className="">
                                <img
                                    src={resv.campground.images[0].thumbnail}
                                    alt="Campground thumbnail"
                                    width={100}
                                />
                                <div className="inline">
                                    <span>{resv.campground.title}</span>
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

                        <Row>
                            <p>// info abt the reservation</p>
                            <div>Check-in: {resv.checkIn}</div>
                            <div>Check-in: {resv.checkOut}</div>
                            <p>Nights: {resv.nights}</p>
                            <p>Guests: {resv.guests}</p>
                        </Row>
                    </Col>

                    {/* Right col */}
                    <Col className="flex flex-col gap-5 p-3">
                        <Row>
                            <p>// Price</p>

                            <p>Total amount: ${resv.totalAmount}</p>
                        </Row>
                        <Row>
                            <p>// QR code</p>
                            <span>timer</span>

                            <p>Scan to pay</p>
                            <a href={urlForQR} target="_blank" className="">
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
                            </a>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </PageContainer>
    );
};

export default Checkout;
