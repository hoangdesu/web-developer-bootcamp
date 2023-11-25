import React, { useContext } from 'react';
import AppContext from '../../store/app-context';
import { Box, CircularProgress, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styled from '@emotion/styled';

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
    overflowX: 'hidden',

    '::-webkit-scrollbar': {
        display: 'none',
    },

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

const CloseButton = styled(CloseIcon)`
    position: absolute;
    top: 0;
    right: 0;
    margin: 12px;
    background: #f3f0f0;
    border-radius: 50%;
    padding: 6px;
    width: 2rem;
    height: 2rem;
    transition: all 0.2s ease;

    &:hover {
        cursor: pointer;
        background: #e1dcdc;
    }
`;

const index = () => {
    const appContext = useContext(AppContext);

    let content = appContext.modal.content;

    if (appContext.modal.open && !appContext.modal.content) {
        return <CircularProgress color="success" />;
    }

    return (
        <Modal
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            open={appContext.modal.open}
            onClose={() => appContext.setModal({ open: false, content: null })}
        >
            <Box sx={style}>
                <CloseButton onClick={() => appContext.setModal({ open: false, content: null })} />
                {content}
            </Box>
        </Modal>
    );
};

export default index;
