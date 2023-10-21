import React, { useContext, useEffect } from 'react';
import AppContext from '../../store/app-context';
import { Box, CircularProgress, Modal } from '@mui/material';
import ModalLogin from './ModalLogin';

const style = {
    position: 'fixed',
    top: '16vh',
    left: 'calc(50% - (500px/2))',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    maxHeight: '600px',
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(6, 5, 5, 0.25)',
    zIndex: '100',
    animation: 'slide-down 300ms ease-out forwards',
    outline: 'none',
    overflowY: 'scroll',

    '@keyframes slide-down': {
        from: {
            opacity: 0,
            transform: 'translateY(-3rem)',
        },
        to: {
            opacity: '1',
            transform: 'translateY(0)',
        },
    },

    '@media (max-width: 600px)': {
        left: 'calc(50% - (90%/2))',
        width: '90%',
        top: '8vh',
    },
};

const index = () => {
    const appContext = useContext(AppContext);

    let content = appContext.modal.content;

    if (appContext.modal.open && !appContext.modal.content) {
        return <CircularProgress color="success" />;
    }

    if (appContext.modal.requiresLoggedIn && !appContext.currentUser) {
        content = <ModalLogin />;
    }

    return (
        <Modal
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            open={appContext.modal.open}
            onClose={() => appContext.setModal({ open: false, content: null })}
        >
            <Box sx={style}>{content}</Box>
        </Modal>
    );
};

export default index;
