import React, { useContext, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from '../../config/yelpcampAxios';
import { Form, InputGroup } from 'react-bootstrap';
import PrimaryBlackButton from '../../components/Buttons/PrimaryBlackButton';
import { useNavigate } from 'react-router-dom';
import CheckmarkCSSAnimation from '../../components/CheckmarkCSSAnimation';
import AppContext from '../../store/app-context';

const InputGroupText = styled(InputGroup.Text)`
    &:hover {
        cursor: pointer;
        background-color: #eff3f6b7;
    }
`;

const UserUpdateInfo = ({ user }) => {
    const userEmailRef = useRef<HTMLInputElement>(null);
    const userCurrentPasswordRef = useRef<HTMLInputElement>(null);
    const userNewPasswordRef = useRef<HTMLInputElement>(null);
    const [validated, setValidated] = useState<boolean>(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const navigate = useNavigate();
    const appContext = useContext(AppContext);

    const updateUserInfoHandler = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        const form = evt.currentTarget;
        if (form.checkValidity() === false) {
            evt.stopPropagation();
        } else {
            const data = {
                email: userEmailRef.current?.value,
                currentPassword: userCurrentPasswordRef.current?.value,
                newPassword: userNewPasswordRef.current?.value,
            };
            axios
                .put(`/api/v1/users/${user._id}/update-info`, data)
                .then(res => {
                    navigate(0);
                })
                .catch(err => {
                    // appContext.setAlert({
                    //     message: 'Wrong username or password. Please login again',
                    //     variant: 'warning',
                    // });
                    // appContext.setCurrentUser(null);
                    // setValidated(false);
                    // form.reset();
                    console.log(err);
                });
        }
        setValidated(true);
    };

    {
        /* TODO: ADD AUTH TO ONLY ALLOW LOGGEDIN USER TO EDIT THEIR OWN DATA */
    }

    const isAuthor = () => {
        return user.username.toString() === appContext.currentUser?.username.toString(); // TODO: no login -> error -> need to login
    };

    // TODO: UI design -> separate out changing email with changing password. Wrap in different boxes
    return (
        <div>
            <h1>User info</h1>
            <p>Username: {user.username}</p>
            <p>UserId: {user._id}</p>
            <p>Email: {user.email}</p>

            {/* TODO: ADD AUTH TO ONLY ALLOW LOGGEDIN USER TO EDIT THEIR OWN DATA */}
            {isAuthor() && (
                <>
                    <h3>Update information</h3>

                    <Form
                        className="mb-5"
                        noValidate
                        validated={validated}
                        onSubmit={updateUserInfoHandler}
                    >
                        {/* <Form.Label>Email</Form.Label>
    <Form.Control type="text" defaultValue={user.email} ref={userEmailRef} />
    <Form.Label>Current Password</Form.Label>

    <Form.Control
        type="password"
        defaultValue={user.password}
        ref={userCurrentPasswordRef}
    />
    <Form.Label>New Password</Form.Label>

    <Form.Control type="password" defaultValue={user.email} ref={userNewPasswordRef} /> */}

                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Email: (current: {user.email})</Form.Label>
                            <Form.Control type="text" ref={userEmailRef} />
                            <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                                Email is required!
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="currentPassword">
                            <Form.Label>Current Password</Form.Label>
                            <InputGroup className="mb-2">
                                <Form.Control
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    ref={userCurrentPasswordRef}
                                    required
                                />
                                <InputGroupText
                                    onClick={() => setShowCurrentPassword(show => !show)}
                                >
                                    {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                                </InputGroupText>
                                <Form.Control.Feedback type="valid">
                                    Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                    Password is required!
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        {/* TODO: only allow changing password if newpassword !== oldPassword */}
                        {/* STYLING: each info is a box */}
                        <Form.Group className="mb-3" controlId="newPassword">
                            <Form.Label>New Password</Form.Label>
                            <InputGroup className="mb-2">
                                <Form.Control
                                    type={showNewPassword ? 'text' : 'password'}
                                    ref={userNewPasswordRef}
                                    // required
                                />
                                <InputGroupText onClick={() => setShowNewPassword(show => !show)}>
                                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                </InputGroupText>
                                <Form.Control.Feedback type="valid">
                                    Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                    Password is required!
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <PrimaryBlackButton>Update</PrimaryBlackButton>

                        <CheckmarkCSSAnimation />
                    </Form>
                </>
            )}
        </div>
    );
};

export default UserUpdateInfo;
