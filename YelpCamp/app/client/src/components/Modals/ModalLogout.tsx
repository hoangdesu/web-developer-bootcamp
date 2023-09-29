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
                appContext.setCurrentUser(null);
                localStorage.removeItem('currentUser');

                appContext.setModal({ open: false, content: null });
                appContext.setSnackbar(true, 'Goodbye!', 'success');

                navigate('/');

                // appContext.setSnackbar(true, 'Goodbye', 'success');
                // appContext.setAlert({
                //     message: `Goodbye!`,
                //     variant: 'success',
                // });
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
