import React, { useState, useRef, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import axios from 'axios';

import AppContext from '../store/app-context';

import { Form, Button, InputGroup } from 'react-bootstrap';
import { Visibility, VisibilityOff } from '@mui/icons-material/';

import PrimaryBlackButton from '../components/Buttons/PrimaryBlackButton';
import Logo from '../assets/logo.png';
import LoginBGImage from '../assets/login-bg.jpg';
import PageSnackbar from '../components/PageSnackbar';

const InputGroupText = styled(InputGroup.Text)`
    &:hover {
        cursor: pointer;
        background-color: #eff3f6b7;
    }
`;

const Container = styled.div`
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
        margin-left: 40%;
        margin-bottom: 5%;

        @media screen and (max-width: 992px) {
            margin: 20px;
            margin-bottom: 100px;
        }
    }

    .hover-underline-animation {
        display: inline-block;
        position: relative;
    }

    .hover-underline-animation:after {
        content: '';
        position: absolute;
        width: 100%;
        transform: scaleX(0);
        height: 2px;
        bottom: 0;
        left: 0;
        background-color: var(--primary-dark-color);
        transform-origin: bottom right;
        transition: transform 0.25s ease-out;
    }

    .hover-underline-animation:hover:after {
        transform: scaleX(1);
        transform-origin: bottom left;
    }
`;

const Login: React.FunctionComponent = () => {
    const [validated, setValidated] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const navigate = useNavigate();
    const appContext = useContext(AppContext);

    const formUsername = useRef<HTMLInputElement>(null);
    const formPassword = useRef<HTMLInputElement>(null);

    // axios.defaults.baseURL = 'https://yelp-camp-api.onrender.com';


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

    const loginHandler = (event: React.FormEvent<HTMLFormElement>) => {
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
        <Container>
            <div className="login-box">
                <Link to="/" className="block text-inherit no-underline hover:text-black">
                    <div className="w-full flex flex-row items-center justify-center gap-2">
                        <img src={Logo} alt="yelpcamp-logo" className="w-[60px]" />
                        <h2 className="text-center hover-underline-animation">YelpCamp</h2>
                    </div>
                </Link>

                <p className="text-muted text-center italic my-4">"Life is a journey"</p>
        
        {/* // TODO: set login state */}
                <Form className="mb-5" noValidate validated={validated} onSubmit={loginHandler}>
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
                    <PrimaryBlackButton className="mt-4 w-full">Login</PrimaryBlackButton>
                </Form>
                <p className="mt-3">
                    New here?{' '}
                    <Link to="/register" className="text-emerald-600 hover:text-emerald-800">
                        Register an account
                    </Link>{' '}
                </p>
                <p className="mt-3">
                    Forgot password?{' '}
                    <Link to="/reset" className="text-emerald-600 hover:text-emerald-800">
                        Reset password
                    </Link>{' '}
                </p>
            </div>

            <PageSnackbar />
        </Container>
    );
};

export default Login;
