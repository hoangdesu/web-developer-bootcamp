import React, { useContext, useRef, useState } from 'react';
import AppContext from '../../store/app-context';
import { Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import PrimaryBlackButton from '../../components/Buttons/PrimaryBlackButton';

const InputGroupText = styled(InputGroup.Text)`
    &:hover {
        cursor: pointer;
        background-color: #eff3f6b7;
    }
`;

const ModalLogin = () => {
    const appContext = useContext(AppContext);
    const [validated, setValidated] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const navigate = useNavigate();

    const formUsername = useRef<HTMLInputElement>(null);
    const formPassword = useRef<HTMLInputElement>(null);

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
                        appContext.setModal({
                            open: false,
                            content: null,
                        });
                    });
                })

                // TODO: handle log in error
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
        <div>
            <h2 className="mb-2">Welcome to YelpCamp</h2>
            {/* <p className="text-center text-muted">Please login to confirm your reservation</p> */}
            <Form className="mt-4" noValidate validated={validated} onSubmit={handleSubmit}>
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

                <PrimaryBlackButton>Login</PrimaryBlackButton>
            </Form>
            <p className="mt-4">
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
    );
};

export default ModalLogin;
