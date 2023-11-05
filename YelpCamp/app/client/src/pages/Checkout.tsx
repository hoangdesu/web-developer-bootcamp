import axios from '../config/yelpcampAxios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import Loading from './Loading';
import ErrorBoundary from './ErrorBoundary';
import { Col, Container, Row } from 'react-bootstrap';
import { USDtoVND, averageRating, formatDateWithoutTime } from '../helpers/campground';
import Logo from '../assets/logo.png';
import * as qrCode from '@bitjson/qr-code';
import AppContext from '../store/app-context';
import ModalPaymentReceived from '../components/Modals/ModalPaymentReceived';
import styled from '@emotion/styled';
import useWindowDimensions from '../hooks/useWindowDimensions';
import WaitingGIF from '../assets/waiting.gif';
import SecondaryTransparentButton from '../components/Buttons/SecondaryTransparentButton';
import ModalConfirmCancelReservation from '../components/Modals/ModalConfirmCancelReservation';

export async function loader({ params }) {
    return { reservationId: params.reservationId };
}

const StyledContainer = styled.div`
    margin-top: 1rem;

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
    const { width: windowWidth } = useWindowDimensions();
    const qrRef = useRef(null);
    const [timer, setTimer] = useState(60);
    const [resvStatus, setResvStatus] = useState<'PENDING' | 'PAID' | 'CANCELLED'>('PENDING');

    useEffect(() => {
        qrCode.defineCustomElements(window);
    }, []);

    const {
        data: resv,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ['getReservationById'],
        queryFn: () => axios.get(`/api/v1/reservations/${reservationId}`).then(data => data.data),
        onSuccess: resv => {
            setResvStatus(resv.status);
        },
    });

    useEffect(() => {
        const paymentTimer = setInterval(() => {
            axios.get(`/api/v1/reservations/${reservationId}/status`).then(res => {
                const { data: status } = res;
                console.log('STATUS:', status);
                if (status === 'PAID') {
                    refetch();
                    appContext.setModal({
                        open: true,
                        content: <ModalPaymentReceived />,
                    });
                    clearInterval(paymentTimer);
                }
            });

            if (timer > 0) {
                setTimer(prev => prev - 1);
            } else if (timer === 0) {
                clearInterval(paymentTimer);
            }
        }, 1000);
        return () => {
            clearInterval(paymentTimer);
        };
    });

    if (isLoading) return <Loading />;

    if (isError) return <ErrorBoundary err={'Invalid Reservation ID'} />;

    const urlForQR = `${window.location.protocol}//${window.location.host}/reservations/${reservationId}/confirm`;

    const subTotal = (resv.totalAmount * 100) / (100 - resv.discount.percentage);
    const discount = subTotal - resv.totalAmount;

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
                                {windowWidth > 768 ? (
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
                                                    height: '120px',
                                                }}
                                            />
                                            <div className="flex flex-col justify-between">
                                                <h5>{resv.campground.title}</h5>
                                                <p className="text-muted">
                                                    {resv.campground.location}
                                                </p>
                                                <p className="">
                                                    Hosted by: {resv.campground.author.username}
                                                </p>
                                            </div>
                                        </Link>
                                        <div className="ml-auto">
                                            <p>★ {averageRating(resv.campground)}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        to={`/campgrounds/${resv.campground._id}`}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                        className="flex flex-col gap-3"
                                        target="_blank"
                                    >
                                        <img
                                            src={resv.campground.images[0].url}
                                            alt="Campground thumbnail"
                                            style={{
                                                objectFit: 'cover',
                                                width: '100%',
                                                height: '150px',
                                                objectPosition: 'center',
                                            }}
                                        />
                                        <div className="flex flex-col justify-between mt-3">
                                            <h5>{resv.campground.title}</h5>
                                            <p className="text-muted">{resv.campground.location}</p>
                                            <div className="flex flex-row justify-between">
                                                <span className="">
                                                    Hosted by: {resv.campground.author.username}
                                                </span>
                                                <span className="ml-auto">
                                                    ★ {averageRating(resv.campground)}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                )}
                            </Row>

                            <hr />
                            <h5 className="mt-[-32px]">Your stay</h5>
                            <Row>
                                <div className="border bg-secondary-color w-fit p-3 rounded flex gap-3 ml-3">
                                    <div className="right-border relative">
                                        <span className="absolute-text">Check-in</span>
                                        <span className="font-medium">
                                            {windowWidth > 768
                                                ? formatDateWithoutTime(resv.checkIn, 'full')
                                                : formatDateWithoutTime(resv.checkIn, 'medium')}
                                        </span>
                                    </div>

                                    <div className="relative">
                                        <span className="absolute-text">Check out</span>
                                        <span className="font-medium">
                                            {windowWidth > 768
                                                ? formatDateWithoutTime(resv.checkOut, 'full')
                                                : formatDateWithoutTime(resv.checkOut, 'medium')}
                                        </span>
                                    </div>
                                </div>
                            </Row>
                            <Row>
                                <div className="border bg-secondary-color w-fit p-3 rounded flex gap-3 ml-3">
                                    <div className="right-border relative">
                                        <span className="absolute-text">Nights</span>
                                        <span className="font-medium">
                                            {resv.nights} {resv.nights === 1 ? 'night' : 'nights'}
                                        </span>
                                    </div>

                                    <div className="relative">
                                        <span className="absolute-text">Guests</span>
                                        <span className="font-medium">
                                            {resv.guests} {resv.guests === 1 ? 'guest' : 'guests'}
                                        </span>
                                    </div>
                                </div>
                            </Row>

                            <hr />
                            <Row>
                                <span className="mt-[-16px]">Reservation ID: </span>
                                <span className="text-muted text-sm">{resv._id}</span>
                            </Row>
                        </Col>

                        {/* Right col */}
                        <Col className="bg-white border flex flex-col gap-5 p-3">
                            <Row>
                                <h5>Invoice</h5>

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

                                <div className="text-muted text-sm flex flex-row justify-between">
                                    <span>🇻🇳 Vietnam Dong</span>
                                    <span>{USDtoVND(resv.totalAmount)}₫</span>
                                </div>
                            </Row>

                            <Row className="mt-[-1rem]">
                                {/* Show QR code only for pending reservation */}
                                {resvStatus === 'PENDING' && (
                                    <>
                                        <h5>Scan QR code to pay</h5>
                                        <p className="text-muted text-xs w-[95%]">
                                            (You can also click on the QR code to open mobile view)
                                        </p>
                                        <div
                                            onClick={() => {
                                                window.open(
                                                    urlForQR,
                                                    '_blank',
                                                    'width=400, height=600',
                                                );
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
                                                    maxWidth: '250px',
                                                    margin: 0,
                                                    padding: 0,
                                                }}
                                                ref={qrRef}
                                                onMouseEnter={() => {
                                                    qrRef.current.animateQRCode('RadialRipple');
                                                }}
                                            >
                                                <img
                                                    src={Logo}
                                                    alt="logo"
                                                    slot="icon"
                                                    style={{ background: 'white', width: '100%' }}
                                                />
                                            </qr-code>
                                        </div>
                                    </>
                                )}

                                {resvStatus === 'PENDING' ? (
                                    <p className="flex flex-row items-end gap-2">
                                        <span>Status: waiting for payment... </span>
                                        {timer > 0 && (
                                            <span>
                                                <img src={WaitingGIF} alt="" width={25} />
                                            </span>
                                        )}
                                    </p>
                                ) : (
                                    <div className="mt-3">
                                        <p>Status: {resv.status}</p>
                                        <div>
                                            <SecondaryTransparentButton
                                                className="w-full"
                                                onClick={() => navigate('/')}
                                            >
                                                Back to Home
                                            </SecondaryTransparentButton>
                                        </div>
                                    </div>
                                )}

                                {resvStatus === 'PENDING' && (
                                    <div>
                                        <SecondaryTransparentButton
                                            className="w-full"
                                            onClick={() =>
                                                appContext.setModal({
                                                    open: true,
                                                    content: (
                                                        <ModalConfirmCancelReservation
                                                            resv={resv}
                                                        />
                                                    ),
                                                })
                                            }
                                        >
                                            Cancel reservation
                                        </SecondaryTransparentButton>
                                    </div>
                                )}
                            </Row>
                        </Col>
                    </Row>
                </StyledContainer>
            </Container>
        </PageContainer>
    );
};

export default Checkout;
