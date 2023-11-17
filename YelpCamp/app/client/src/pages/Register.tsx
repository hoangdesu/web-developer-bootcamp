import React, { useState, useRef, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import axios from '../config/yelpcampAxios';

import AppContext from '../store/app-context';

import { Form, InputGroup, Spinner } from 'react-bootstrap';
import { Visibility, VisibilityOff } from '@mui/icons-material/';

import RegisterBG from '../assets/register-bg.jpeg';
import Logo from '../assets/logo.png';
import PrimaryBlackButton from '../components/Buttons/PrimaryBlackButton';
import PageSnackbar from '../components/PageSnackbar';

const InputGroupText = styled(InputGroup.Text)`
    &:hover {
        cursor: pointer;
        background-color: #eff3f6b7;
    }
`;

const Div = styled.div<{ mouseCoords: { x: number; y: number } }>`
    width: 100vw;
    height: 100vh;

    background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2)), url(${RegisterBG});
    background-position: ${props => props.mouseCoords.x / 50}%
        calc(80% + ${props => props.mouseCoords.y / 100}%);
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
        box-sizing: border-box;
        margin-right: 40%;

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
    const [isRegistering, setIsRegistering] = useState(false);

    const formUsername = useRef<HTMLInputElement>(null);
    const formEmail = useRef<HTMLInputElement>(null);
    const formPassword = useRef<HTMLInputElement>(null);

    const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

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

        // for moving background effect
        const handleWindowMouseMove = event => {
            setMouseCoords({
                x: event.clientX,
                y: event.clientY,
            });
        };
        window.addEventListener('mousemove', handleWindowMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleWindowMouseMove);
        };
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            setIsRegistering(true);
            axios
                .post(
                    '/api/v1/users',
                    {
                        username: formUsername.current?.value.toLowerCase() || '',
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
                        appContext.setCurrentUser(resp.data);
                        localStorage.setItem('currentUser', JSON.stringify(resp.data));
                        appContext.setAlert({
                            message: `Welcome to YelpCamp, ${resp.data.username}!`,
                            variant: 'success',
                        });
                        navigate(`/`);
                    });
                })
                .catch(err => {
                    appContext.setSnackbar(true, err.response?.data?.message, 'error');
                    setValidated(false);
                    form.reset();
                    setIsRegistering(false);
                });
        }
        setValidated(true);
    };

    return (
        <Div mouseCoords={mouseCoords}>
            <div className="login-box">
                <Link to="/" className="block text-inherit no-underline hover:text-black">
                    <div className="w-full flex flex-row items-center justify-center gap-2">
                        <img src={Logo} alt="yelpcamp-logo" className="w-[60px]" />
                        <h2 className="text-center hover-underline-animation">YelpCamp</h2>
                    </div>
                </Link>

                <p className="text-center my-4">Welcome to YelpCamp!</p>

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

                    {isRegistering ? (
                        <PrimaryBlackButton className="my-4 w-full" disabled={true}>
                            <Spinner
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                as="span"
                            />
                            <span> Creating your account...</span>
                        </PrimaryBlackButton>
                    ) : (
                        <PrimaryBlackButton className="my-4 w-full">Register</PrimaryBlackButton>
                    )}
                </Form>
                <p className="my-3">
                    Have an account?{' '}
                    <Link to="/login" className="text-emerald-600 hover:text-emerald-800">
                        Login
                    </Link>{' '}
                </p>
            </div>
            <PageSnackbar />
        </Div>
    );
};

export default Register;
