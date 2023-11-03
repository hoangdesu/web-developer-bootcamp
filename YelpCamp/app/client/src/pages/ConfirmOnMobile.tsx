import styled from '@emotion/styled';
import axios from '../config/yelpcampAxios';
import React, { useRef, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import CheckmarkCSSAnimation from '../components/CheckmarkCSSAnimation';
import { useQuery } from 'react-query';
import Loading from './Loading';
import ErrorBoundary from './ErrorBoundary';
import { Container, Form, InputGroup } from 'react-bootstrap';
import PrimaryBlackButton from '../components/Buttons/PrimaryBlackButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Button = styled.button`
    width: 200px;
    height: 100px;
`;

const ConfirmOnMobile = () => {
    const { reservationId } = useLoaderData();
    console.log(reservationId);
    const [showCheckmark, setShowCheckmark] = useState(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [validated, setValidated] = useState<boolean>(false);
    const formPassword = useRef(null);

    const {
        data: resv,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ['getReservationById'],
        queryFn: () => axios.get(`/api/v1/reservations/${reservationId}`).then(data => data.data),
        // onSuccess: resv => {
        //     setResvStatus(resv.status);
        // },
    });

    // TODO
    const makePayment = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            axios.get(`/api/v1/reservations/${reservationId}/pay`).then(data => {
                console.log('AFTER PAY:', data);
                // reservationQuery.refetch();
                setShowCheckmark(true);
            });
        }
        setValidated(true);
    };

    if (isLoading) return <></>;

    if (isError) return <ErrorBoundary err={'Invalid Reservation ID'} />;

    console.log(resv);

    return (
        <Container className="my-3 h-[80vh] flex flex-col">
            <h1>Confirm on mobile</h1>

            {/* <p>id: {reservationId}</p> */}
            {/* <p>Campground: {resv.campground.title}</p> */}
            <p>
                You're making a purchase of <span className="font-bold text-lg">${resv.totalAmount.toFixed(2)}</span>{' '}
                to YelpCamp. Please re-enter your password to confirm payment.
            </p>

            {showCheckmark && <CheckmarkCSSAnimation />}

            <Form className="mt-auto" noValidate validated={validated} onSubmit={makePayment}>
                <Form.Group controlId="password">
                    <InputGroup>
                        <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            ref={formPassword}
                            required
                        />
                        <InputGroup.Text onClick={() => setShowPassword(show => !show)}>
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </InputGroup.Text>
                        <Form.Control.Feedback type="invalid">
                            Invalid password
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>

                <PrimaryBlackButton className="w-full">Confirm</PrimaryBlackButton>
            </Form>
        </Container>
    );
};

export default ConfirmOnMobile;
