import React, { useContext } from 'react';
import AppContext from '../../store/app-context';
import { useNavigate } from 'react-router-dom';

const ModalConfirmReservation = ({ reservation, makeReservation }) => {
    const appContext = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <div>
            ModalConfirmReservation
            <p>{reservation.bookedBy}</p>
            <p>{reservation.nights}</p>
            <button onClick={() => appContext.setModal({ open: false, content: null })}>
                Cancel
            </button>
            <button onClick={makeReservation}>Confirm</button>
        </div>
    );
};

export default ModalConfirmReservation;
