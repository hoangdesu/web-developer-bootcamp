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
import RegisterBG from '../assets/register-bg.jpg';
import Logo from '../assets/logo.png';
import PrimaryBlackButton from '../components/Buttons/PrimaryBlackButton';

const InputGroupText = styled(InputGroup.Text)`
    &:hover {
        cursor: pointer;
        background-color: #eff3f6b7;
    }
`;

const Div = styled.div`
    width: 100vw;
    height: 100vh;

    /* top, transparent black, faked with gradient */
    background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2)), url(${RegisterBG});
    // TODO: find some vietnam scenery photos here
    /* url(https://images.unsplash.com/photo-1504457047772-27faf1c00561?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2147&q=80); */

    background-position: 50% 50%;
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
        margin-right: 50%;
        /* margin-bottom: 5%; */

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

const Register: React.FunctionComponent = () => {
    const [validated, setValidated] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const navigate = useNavigate();
    const appContext = useContext(AppContext);

    const formUsername = useRef<HTMLInputElement>(null);
    const formEmail = useRef<HTMLInputElement>(null);
    const formPassword = useRef<HTMLInputElement>(null);

    useEffect(() => {
        document.title = 'YelpCamp | Register';
        const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);
        if (currentUser) {
            appContext.setAlert({
                message: `You're already logged in as ${currentUser.username}`,
                variant: 'success',
            });
            navigate('/');
        }
    }, []);

    // TODO: this shit somehow stops working :/ => fix
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
        <Div>
            <div className="login-box">
                {/* <h1 className="text-center mb-4">Welcome to</h1> */}
                <Link to="/" className="block text-inherit no-underline hover:text-black">
                    <div className="w-full flex flex-row items-center justify-center gap-3">
                        <img src={Logo} alt="yelpcamp-logo" className="w-[70px]" />
                        <h2 className="text-center hover-underline-animation">YelpCamp</h2>
                    </div>
                </Link>

                <p className="text-muted text-center italic my-4">"Go touch some grass"</p>

                <Form className="mb-5" noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" ref={formUsername} required />
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            Username is required!
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="text" ref={formEmail} required />
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            Email is required!
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

                    {/* <Button variant="success" type="submit" className="mt-3">
                        Register
                    </Button> */}

                    <PrimaryBlackButton className="mt-3">Register</PrimaryBlackButton>

                    <p className="mt-3">
                        Have an account?{' '}
                        <Link to="/login" className="text-emerald-600 hover:text-emerald-800">
                            Login
                        </Link>{' '}
                    </p>
                </Form>
            </div>
        </Div>
    );
};

export default Register;
