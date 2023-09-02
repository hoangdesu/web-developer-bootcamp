

import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import axios from 'axios';

import AppContext from '../store/app-context';

import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import { Visibility, VisibilityOff } from '@mui/icons-material/';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';
import FlashAlert from '../components/FlashAlert';

const InputGroupText = styled(InputGroup.Text)`
    &:hover {
        cursor: pointer;
        background-color: #eff3f6b7;
    }
`;

const Register: React.FunctionComponent = () => {
    const [validated, setValidated] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const navigate = useNavigate();
    const appContext = useContext(AppContext);

    const formUsername = useRef<HTMLInputElement>(null);
    const formEmail = useRef<HTMLInputElement>(null);
    const formPassword = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            appContext.setAlert({
                message: `You're already logged in as ${currentUser.username}`,
                variant: 'success',
            });
            navigate('/');
        }
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            axios
                .post(
                    '/api/v1/users',
                    {
                        username: formUsername.current?.value || '',
                        email: formEmail.current?.value || '',
                        password: formPassword.current?.value || '',
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                )
                .then(res => {
                    axios.get('/api/v1/auth/currentuser').then(resp => {
                        appContext.setAlert({
                            message: `Welcome to YelpCamp, ${resp.data.username}!`,
                            variant: 'success',
                        });
                        appContext.setCurrentUser(resp.data);
                        localStorage.setItem('currentUser', JSON.stringify(resp.data));
                        navigate(`/`);
                    });
                })
                .catch(err => {
                    console.log(err);
                    appContext.setAlert({
                        message: err.response?.data?.message || 'This email has been used',
                        variant: 'warning',
                    });
                    setValidated(false);
                    form.reset();
                });
        }
        setValidated(true);
    };

    return (
        <PageContainer>
            <Navbar />
            <Container className="mt-5 px-[30%]">
                <FlashAlert />
                <h1 className="text-center mb-4">Register</h1>
                <Form className="mb-5" noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" ref={formUsername} required />
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Username is required!</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="text" ref={formEmail} required />
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Email is required!</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <InputGroup className="mb-2">
                            <Form.Control type={showPassword ? 'text' : 'password'} ref={formPassword} required />
                            <InputGroupText onClick={() => setShowPassword(show => !show)}>
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </InputGroupText>
                            <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">Password is required!</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Button variant="success" type="submit" className="mt-3">
                        Register
                    </Button>
                </Form>
            </Container>
            <Footer />
        </PageContainer>
    );
};

export default Register;
