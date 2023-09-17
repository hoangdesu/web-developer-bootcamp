import React, { useEffect, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { getModalContent } from '../../helpers/modal';

const style = {
    position: 'fixed',
    top: '20vh',
    left: 'calc(50% - (400px/2))',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
    zIndex: '100',
    animation: 'slide-down 300ms ease-out forwards',

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
};

const ReservationModal = props => {
    const { modalType, makeReservation, setModalType } = props;
    const modalProps = {
        open: props.open,
        onClose: props.onClose,
    };

    console.log(props);

    // const makeReservation = evt => {
    //     if (!appContext.currentUser) {
    //         // display modal
    //         return;
    //     }

    //     if (!inputStartDate || !inputEndDate || !days) {
    //         return;
    //     }

    //     const reservation = {
    //         bookedBy: appContext.currentUser.id,
    //         campground: campground._id,
    //         nights: days,
    //         checkIn: inputStartDate,
    //         checkOut: inputEndDate,
    //         guests: parseInt(guests),
    //         totalPrice: totalAfterDiscount,
    //         status: 'PENDING',
    //     };

    //     console.log(reservation);

    //     axios.post('/api/v1/reservation/new', { reservation }).then(data => {
    //         console.log(data.data);
    //     });
    // };

    console.log('modalType', modalType);

    const [content, setContent] = useState<React.ReactNode>(
        getModalContent(modalType, setModalType),
    );

    useEffect(() => {
        setContent(getModalContent(modalType, setModalType));
    }, [setContent, setModalType, modalType]);

    console.log(content);

    return (
        <Modal
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            {...modalProps}
        >
            <Box sx={style}>{content}</Box>
        </Modal>
    );
};

export default ReservationModal;
