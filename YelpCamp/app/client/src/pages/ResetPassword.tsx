import React, { useState, useContext, useEffect, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import axios from '../config/yelpcampAxios';

import AppContext from '../store/app-context';

import { Form, InputGroup, Spinner } from 'react-bootstrap';
import { Visibility, VisibilityOff } from '@mui/icons-material/';
import PrimaryBlackButton from '../components/Buttons/PrimaryBlackButton';
import Logo from '../assets/logo.png';
import ResetPwdImg from '../assets/reset-password.png';
import SecondaryTransparentButton from '../components/Buttons/SecondaryTransparentButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const InputGroupText = styled(InputGroup.Text)`
    &:hover {
        cursor: pointer;
        background-color: #eff3f6b7;
    }
`;

const Container = styled.div`
    background-color: var(--primary-color);
    width: 100vw;
    height: 100vh;

    .content {
        background-color: var(--primary-color);
        background-position: center;
        background-size: cover;
        display: flex;
        align-items: center;
        gap: 50px;
        justify-content: space-evenly;
        transition: 0.2s all ease;
        padding-bottom: 20%;

        @media screen and (max-width: 992px) {
            .img {
                display: none;
            }
        }

        .reset-password-box {
            border-radius: 12px;
            width: 450px;
            min-height: fit-content;
            padding: 3rem;
            box-sizing: border-box;

            @media screen and (max-width: 992px) {
                margin: 20px;
                flex-direction: column;
                padding: 2rem;
            }
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

const ResetPassword: React.FunctionComponent = () => {
    const [validated, setValidated] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const appContext = useContext(AppContext);

    const [formUsername, setFormUsername] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formPassword, setFormPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [view, setView] = useState<'check' | 'reset'>('check');

    useEffect(() => {
        document.title = 'YelpCamp | Reset password';
    }, []);

    const checkMatchingHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            axios
                .post(
                    '/api/v1/auth/matching-username-password',
                    {
                        username: formUsername,
                        email: formEmail,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                )
                .then(res => {
                    setView('reset');
                })
                .catch(err => {
                    appContext.setSnackbar(
                        true,
                        "Error: Username and password don't match",
                        'error',
                    );
                });
        }
        setValidated(true);
    };

    const resetPasswordHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (confirmPassword !== formPassword) {
            appContext.setSnackbar(true, "Passwords don't match", 'error');
            return;
        }

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            axios
                .post(
                    '/api/v1/users/reset-password',
                    {
                        username: formUsername,
                        email: formEmail,
                        newPassword: confirmPassword,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                )
                .then(res => {
                    appContext.setSnackbar(true, 'Your password has been reset!', 'success');
                    navigate('/login');
                })
                .catch(err => {
                    appContext.setCurrentUser(null);
                    setValidated(false);
                    form.reset();
                });
        }
        setValidated(true);
    };

    return (
        <Container>
            <div className="py-4 flex flex-row items-center justify-center">
                <Link
                    to="/"
                    className="hover:text-black text-primary-dark-color gap-2 no-underline flex flex-row items-end justify-cente"
                >
                    <img src={Logo} alt="yelpcamp-logo" className="w-[50px]" />
                    <h4 className="text-center hover-underline-animation">YelpCamp</h4>
                </Link>
            </div>
            <div className="content">
                <div className="reset-password-box">
                    {view === 'check' && (
                        <>
                            <Form
                                className="mb-5"
                                noValidate
                                validated={validated}
                                onSubmit={checkMatchingHandler}
                            >
                                <h1>Reset password</h1>
                                <Form.Text>
                                    Enter matching username and email to reset your password
                                </Form.Text>
                                <Form.Group className="mt-4 mb-3" controlId="username">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formUsername}
                                        onChange={e => setFormUsername(e.currentTarget.value)}
                                        required
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Looks good!
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        Username is required!
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formEmail}
                                        onChange={e => setFormEmail(e.currentTarget.value)}
                                        required
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Looks good!
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        Email is required!
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <PrimaryBlackButton className="mt-4 w-full">
                                    Continue
                                </PrimaryBlackButton>
                            </Form>
                        </>
                    )}
                    {view === 'reset' && (
                        <>
                            <Form
                                className="mb-5"
                                // noValidate
                                // validated={validated}
                                onSubmit={resetPasswordHandler}
                            >
                                <h1>Reset password</h1>
                                <Form.Text>
                                    Enter matching username and email to reset your password
                                </Form.Text>

                                <Form.Group className="mt-4 mb-3" controlId="password">
                                    <Form.Label>New password</Form.Label>
                                    <InputGroup className="mb-2">
                                        <Form.Control
                                            type={showPassword ? 'text' : 'password'}
                                            isValid={!!formPassword}
                                            value={formPassword}
                                            onChange={e => setFormPassword(e.currentTarget.value)}
                                            required
                                        />
                                        <InputGroupText
                                            onClick={() => setShowPassword(show => !show)}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </InputGroupText>
                                        <Form.Control.Feedback type="valid">
                                            Looks good!
                                        </Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            Password is required!
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mt-4 mb-3" controlId="confirm-password">
                                    <Form.Label>Confirm new password</Form.Label>
                                    <InputGroup className="mb-2">
                                        <Form.Control
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            required
                                            onChange={e => {
                                                setConfirmPassword(e.currentTarget.value);
                                            }}
                                            isValid={confirmPassword === formPassword}
                                            isInvalid={confirmPassword !== formPassword}
                                            value={confirmPassword}
                                        />
                                        <InputGroupText
                                            onClick={() => setShowConfirmPassword(show => !show)}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </InputGroupText>
                                        {formPassword && (
                                            <>
                                                <Form.Control.Feedback type="valid">
                                                    Looks good!
                                                </Form.Control.Feedback>
                                                <Form.Control.Feedback type="invalid">
                                                    Passwords don't match
                                                </Form.Control.Feedback>
                                            </>
                                        )}
                                    </InputGroup>
                                </Form.Group>

                                <div className="w-full flex flex-row justify-between gap-2 mt-4">
                                    <SecondaryTransparentButton onClick={() => setView('check')}>
                                        <ArrowBackIcon />
                                    </SecondaryTransparentButton>
                                    <PrimaryBlackButton className="grow">
                                        Reset password
                                    </PrimaryBlackButton>
                                </div>
                            </Form>
                        </>
                    )}
                    <p className="mt-3">
                        New here?{' '}
                        <Link to="/register" className="text-emerald-600 hover:text-emerald-800">
                            Register an account
                        </Link>
                    </p>
                    <Link
                        to="/login"
                        className="block mt-2 mb-[-24px] text-emerald-600 hover:text-emerald-800"
                    >
                        Login to your account
                    </Link>
                </div>
                <div className="img">
                    <Suspense
                        fallback={
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        }
                    >
                        <img src={ResetPwdImg} alt="reset-password" height={'450px'} />
                    </Suspense>
                </div>
            </div>
        </Container>
    );
};

export default ResetPassword;
