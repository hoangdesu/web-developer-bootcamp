import React, { useState, useRef, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import axios from 'axios';

import AppContext from '../store/app-context';

import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import { Visibility, VisibilityOff } from '@mui/icons-material/';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';
import FlashAlert from '../components/FlashAlert';
import PrimaryBlackButton from '../components/Buttons/PrimaryBlackButton';
import Logo from '../assets/logo.png';
import LoginBGImage from '../assets/login-bg.jpg';

const InputGroupText = styled(InputGroup.Text)`
    &:hover {
        cursor: pointer;
        background-color: #eff3f6b7;
    }
`;

const Div = styled.div`
    width: 100vw;
    height: 100vh;
    /* background-image: url(https://images.unsplash.com/photo-1522660517748-2931a7a4aaf6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2130&q=80); */

    /* top, transparent black, faked with gradient */
    background: 
    // linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2)),
        /* bottom, image url(https://images.unsplash.com/photo-1602391833977-358a52198938?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2148&q=80) */
        /* bottom, image */ url(${LoginBGImage});
    background-position: center;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s all ease;

    .login-box {
        background-color: white;
        border-radius: 12px;
        width: 450px;
        min-height: fit-content;
        padding: 3rem;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 8px 16px;
        /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1); */
        box-sizing: border-box;
        margin-left: 50%;
        /* margin-bottom: 300px; */
        margin-bottom: 05%;

        @media screen and (max-width: 992px) {
            margin: 20px;
            margin-bottom: 100px;
        }
    }
`;

const ResetPassword: React.FunctionComponent = () => {
    const [validated, setValidated] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const navigate = useNavigate();
    const appContext = useContext(AppContext);

    const formUsername = useRef<HTMLInputElement>(null);
    const formPassword = useRef<HTMLInputElement>(null);

    useEffect(() => {
        document.title = 'YelpCamp | Login';
        const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);
        if (currentUser) {
            appContext.setAlert({
                message: `Welcome back, ${currentUser.username}`,
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
                    '/api/v1/users/login',
                    {
                        username: formUsername.current?.value || '',
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
                            message: `Welcome back, ${resp.data.username}!`,
                            variant: 'success',
                        });
                        appContext.setCurrentUser(resp.data);
                        localStorage.setItem('currentUser', JSON.stringify(resp.data));
                        // navigate(-1); // back to previous page
                        navigate('/');
                    });
                })
                .catch(err => {
                    appContext.setAlert({
                        message: 'Wrong username or password. Please login again',
                        variant: 'warning',
                    });
                    appContext.setCurrentUser(null);
                    setValidated(false);
                    form.reset();
                });
        }
        setValidated(true);
    };

    return (
        <Div>
            <div className="login-box">
                <Link
                    to="/"
                    className="block text-inherit no-underline hover:text-black"
                >
                    <div className="w-full flex flex-row items-center justify-center gap-3 mb-5">
                        <img src={Logo} alt="yelpcamp-logo" className="w-[70px]" />
                        <h2 className="text-center">Reset password</h2>
                    </div>
                </Link>

                <Form className="mb-5" noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" ref={formUsername} required />
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            Username is required!
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <InputGroup className="mb-2">
                            <Form.Control
                                type={showPassword ? 'text' : 'password'}
                                ref={formPassword}
                                required
                            />
                            <InputGroupText onClick={() => setShowPassword(show => !show)}>
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </InputGroupText>
                            <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                                Password is required!
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <PrimaryBlackButton className="my-3">Reset password form</PrimaryBlackButton>
                    <p className="mt-3">
                        New here?{' '}
                        <Link to="/register" className="text-emerald-600 hover:text-emerald-800">
                            ...
                        </Link>{' '}
                    </p>
                    <Link
                        to="/reset"
                        className="block mt-2 mb-[-24px] text-emerald-600 hover:text-emerald-800"
                    >
                        Reset password
                    </Link>{' '}
                </Form>
            </div>
        </Div>
    );
};

export default ResetPassword;

{
    /* </PageContainer> */
}
