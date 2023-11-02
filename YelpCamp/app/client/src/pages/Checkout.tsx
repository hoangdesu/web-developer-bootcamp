import axios from '../config/yelpcampAxios';
import React, { useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import Loading from './Loading';
import ErrorBoundary from './ErrorBoundary';
import { Col, Container, Row } from 'react-bootstrap';
import { averageRating, formatDateWithoutTime } from '../helpers/campground';
import Logo from '../assets/logo.png';
import * as qrCode from '@bitjson/qr-code';
import AppContext from '../store/app-context';
import ModalPaymentReceived from '../components/Modals/ModalPaymentReceived';
import styled from '@emotion/styled';

export async function loader({ params }) {
    return { reservationId: params.reservationId };
}

const StyledContainer = styled.div`
    .right-border {
        padding-right: 16px;
        border-right: 1px solid #999da1;
    }

    .absolute-text {
        position: absolute;
        left: 0;
        bottom: 3rem;
    }

    .total {
        border-top: 1px dashed black;
        padding-top: 8px;
    }
`;

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
        let timerOn = false; // TODO: remove in production
        if (timerOn) {
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
        }
    }, []);

    if (isLoading) return <Loading />;

    if (isError) return <ErrorBoundary err={'Invalid Reservation ID'} />;

    const urlForQR = `${window.location.protocol}//${window.location.host}/reservations/${reservationId}/confirm`;

    const subTotal = (resv.totalAmount * 100) / (100 - resv.discount.percentage);
    const discount = subTotal - resv.totalAmount;

    // UI design ref: https://dribbble.com/shots/4631896-Prepayment-page
    return (
        <PageContainer>
            <h1>Checkout</h1>
            <Container>
                <StyledContainer>
                    <Row>
                        {/* // Left col */}
                        <Col
                            lg={8}
                            className="bg-white border flex flex-col gap-5 p-3 mr-5 max-[991px]:mb-5"
                        >
                            <Row className="">
                                <div className="flex flex-row items-start gap-3">
                                    <Link
                                        to={`/campgrounds/${resv.campground._id}`}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                        className="flex flex-row gap-3"
                                        target="_blank"
                                    >
                                        <img
                                            src={resv.campground.images[0].thumbnail}
                                            alt="Campground thumbnail"
                                            style={{
                                                objectFit: 'cover',
                                                // maxWidth: '150px'
                                                height: '120px',
                                            }}
                                        />
                                        <div className="flex flex-col justify-between">
                                            <h5>{resv.campground.title}</h5>
                                            <p className="text-muted">{resv.campground.location}</p>
                                            <p className="">
                                                Hosted by: {resv.campground.author.username}
                                            </p>
                                        </div>
                                    </Link>
                                    <div className="ml-auto">
                                        <p>★ {averageRating(resv.campground)}</p>
                                    </div>
                                </div>
                            </Row>

                            <hr />

                            <Row>
                                <div className="border bg-secondary-color w-fit p-3 rounded flex gap-3 m-3">
                                    <div className="right-border relative">
                                        <span className="absolute-text">Check-in</span>
                                        <span>{formatDateWithoutTime(resv.checkIn)}</span>
                                    </div>

                                    <div className="relative">
                                        <span className="absolute-text">Check out</span>
                                        <span>{formatDateWithoutTime(resv.checkOut)}</span>
                                    </div>
                                </div>
                            </Row>
                            <Row>
                                <div className="border bg-secondary-color w-fit p-3 rounded flex gap-3 m-3">
                                    <div className="right-border relative">
                                        <span className="absolute-text">Nights</span>
                                        <span>
                                            {resv.nights} {resv.nights === 1 ? 'night' : 'nights'}
                                        </span>
                                    </div>

                                    <div className="relative">
                                        <span className="absolute-text">Guests</span>
                                        <span>
                                            {resv.guests} {resv.guests === 1 ? 'guest' : 'guests'}
                                        </span>
                                    </div>
                                </div>
                            </Row>
                        </Col>

                        {/* Right col */}
                        <Col className="bg-white border flex flex-col gap-5 p-3">
                            <Row>
                                {/* <p>// Price</p> */}
                                <div className="flex flex-row justify-between">
                                    <span>Subtotal</span>
                                    <span>
                                        $
                                        {subTotal
                                            .toFixed(2)
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    </span>
                                </div>

                                <div className="flex flex-row justify-between">
                                    <span>Discount code</span>
                                    <span
                                        className={`${
                                            resv.discount.percentage > 0 && 'text-red-500'
                                        }`}
                                    >
                                        {resv.discount.code || '-'}
                                    </span>
                                </div>

                                <div className="flex flex-row justify-between">
                                    <span>Discount (${resv.discount.percentage})</span>
                                    <span
                                        className={`${
                                            resv.discount.percentage > 0 && 'text-red-500'
                                        }`}
                                    >
                                        -$
                                        {discount
                                            .toFixed(2)
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    </span>
                                </div>

                                <div className="flex flex-row justify-between items-baseline mt-2 total">
                                    <span>Total amount</span>
                                    <span className="h5 font-bold ">
                                        $
                                        {resv.totalAmount
                                            .toFixed(2)
                                            .toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    </span>
                                </div>
                            </Row>

                            <Row>
                                {/* <p>// QR code</p> */}

                                <h5>Scan this QR code to pay</h5>
                                <p className="text-muted text-sm w-[95%]">
                                    (You can also click on the QR code to open mobile view)
                                </p>
                                {/* <a href={urlForQR} target="_blank" className=""> */}
                                <div
                                    onClick={() => {
                                        window.open(urlForQR, '_blank', 'width=400, height=600');
                                    }}
                                    className="hover:cursor-pointer flex items-center justify-center"
                                >
                                    <qr-code
                                        id="qr1"
                                        contents={urlForQR}
                                        module-color="#1c7d43"
                                        position-ring-color="#13532d"
                                        position-center-color="#70c559"
                                        mask-x-to-y-ratio="1.2"
                                        style={{
                                            // maxWidth: '250px',
                                            height: '300px',
                                            margin: 0,
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
                </StyledContainer>
            </Container>
        </PageContainer>
    );
};

export default Checkout;
