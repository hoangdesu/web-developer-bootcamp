import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../../store/app-context';
import PrimaryBlackButton from '../Buttons/PrimaryBlackButton';
import SecondaryTransparentButton from '../Buttons/SecondaryTransparentButton';

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

                // navigate('/');
            })
            .catch(err => {
                appContext.setSnackbar(true, 'Error logging out', 'error');
            });
    };
    return (
        <div>
            <h2>Log out from YelpCamp?</h2>
            <div className="flex flex-row items-center gap-2 mt-3">
                <SecondaryTransparentButton
                    onClick={() => appContext.setModal({ open: false, content: null })}
                >
                    Cancel
                </SecondaryTransparentButton>
                <PrimaryBlackButton onClick={logoutHandler} className="w-full">
                    Log out
                </PrimaryBlackButton>
            </div>
        </div>
    );
};

export default ModalLogout;
