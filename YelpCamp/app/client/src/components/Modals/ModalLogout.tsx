import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import appContext from '../../store/app-context';
import { useNavigate } from 'react-router-dom';
import AppContext from '../../store/app-context';

const ModalLogout = () => {
    const navigate = useNavigate();
    const appContext = useContext(AppContext);

    const logoutHandler = async () => {
        await axios
            .post('/api/v1/users/logout')
            .then(res => {
                appContext.setModal({ open: false, content: null });

                appContext.setCurrentUser(null);
                // appContext.setSnackbar(true, 'Goodbye', 'success');
                localStorage.removeItem('currentUser');
                appContext.setAlert({
                    message: `Goodbye!`,
                    variant: 'success',
                });

                navigate('/');
            })
            .catch(err => {});
    };
    return (
        <div>
            <h1>ModalLogout</h1>
            <button onClick={logoutHandler}>Log out</button>
        </div>
    );
};

export default ModalLogout;
