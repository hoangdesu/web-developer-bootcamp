import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import appContext from '../../store/app-context';
import { useNavigate } from 'react-router-dom';
import AppContext from '../../store/app-context';

const ModalLogout = () => {
    const navigate = useNavigate();
    const appContext = useContext(AppContext);

    const logoutHandler = async () => {
        appContext.setModal({ open: true, content: <ModalLogout /> });

        await axios.post('/api/v1/users/logout');
        appContext.setCurrentUser(null);
        localStorage.removeItem('currentUser');
        appContext.setAlert({
            message: `Goodbye!`,
            variant: 'success',
        });
        navigate('/');
    };
    return (
        <div>
            ModalLogout
            <button onClick={logoutHandler}>Log out</button>
        </div>
    );
};

export default ModalLogout;
