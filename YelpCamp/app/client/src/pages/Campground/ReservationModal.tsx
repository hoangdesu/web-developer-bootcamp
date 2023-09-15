import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -200%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #222325',
    borderRadius: '6px',
    boxShadow: 24,
    p: 4,
};

const ReservationModal = props => {
    const { modalType, makeReservation } = props;
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

    console.log(modalType);

    if (modalType === 'login')
        return (
            <Modal
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                {...modalProps}
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Login
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Login
                    </Typography>
                </Box>
            </Modal>
        );

    return (
        <Modal
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            {...modalProps}
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Reserve confirm
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                </Typography>
            </Box>
        </Modal>
    );
};

export default ReservationModal;
