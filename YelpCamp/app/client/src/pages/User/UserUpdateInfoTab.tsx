import React, { useContext, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from '../../config/yelpcampAxios';
import { Form, InputGroup } from 'react-bootstrap';
import PrimaryBlackButton from '../../components/Buttons/PrimaryBlackButton';
import { useNavigate } from 'react-router-dom';
import AppContext from '../../store/app-context';
import { User } from '../../types';

const InputGroupText = styled(InputGroup.Text)`
    &:hover {
        cursor: pointer;
        background-color: #eff3f6b7;
    }
`;

interface InfoTabProps {
    user: User & { _id: string };
    refetch: () => void;
}

const UserUpdateInfoTab: React.FC<InfoTabProps> = ({ user, refetch }) => {
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
                    appContext.setSnackbar(
                        true,
                        'Your account information has been updated!',
                        'success',
                    );
                    refetch();
                    form.reset();
                    setValidated(false);
                })
                .catch(err => {
                    appContext.setSnackbar(
                        true,
                        'Something went wrong. Your account information was not updated.',
                        'error',
                    );
                });
        }
        setValidated(true);
    };

    const isAuthor = () => {
        return user.username.toString() === appContext.currentUser?.username.toString();
    };

    return (
        <div>
            <div>
                <h1>User info</h1>
                <p className="text-muted">Update your email and password.</p>
            </div>
            <hr />
            <div>
                <p>
                    <span className="font-medium">Username:</span> {user.username}
                </p>
                <p>
                    <span className="font-medium">User ID:</span> {user._id}
                </p>
            </div>
            <hr />

            {isAuthor() && (
                <>
                    <Form
                        className="mb-5 mt-3 max-w-[500px]"
                        noValidate
                        validated={validated}
                        onSubmit={updateUserInfoHandler}
                    >
                        <Form.Group className="mb-4" controlId="username">
                            <Form.Label className="font-medium">Update email</Form.Label>
                            <Form.Control
                                type="text"
                                ref={userEmailRef}
                                placeholder="john@doe.com"
                            />
                            <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                                Email is required!
                            </Form.Control.Feedback>
                            <span className="text-muted text-sm">
                                Your current email address: {user.email}
                            </span>
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="newPassword">
                            <Form.Label className="font-medium">Update password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showNewPassword ? 'text' : 'password'}
                                    ref={userNewPasswordRef}
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
                            <span className="text-muted text-sm">Your new password.</span>
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="currentPassword">
                            <Form.Label className="font-medium">Current password</Form.Label>
                            <InputGroup>
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
                            <span className="text-muted text-sm">
                                Enter your current password to confirm the changes.
                            </span>
                        </Form.Group>

                        <PrimaryBlackButton>Update user info</PrimaryBlackButton>
                    </Form>
                </>
            )}
        </div>
    );
};

export default UserUpdateInfoTab;
