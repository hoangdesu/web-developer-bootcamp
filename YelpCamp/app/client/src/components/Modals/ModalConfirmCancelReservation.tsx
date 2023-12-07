import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/yelpcampAxios';
import AppContext from '../../store/app-context';
import PrimaryBlackButton from '../Buttons/PrimaryBlackButton';
import SecondaryTransparentButton from '../Buttons/SecondaryTransparentButton';

const ModalConfirmCancelReservation = ({ resv }) => {
    const navigate = useNavigate();
    const appContext = useContext(AppContext);

    const cancelReservationHandler = () => {
        axios
            .post(`/api/v1/reservations/${resv._id}/cancel`)
            .then(res => {
                appContext.setSnackbar(true, 'Your reservation has been cancelled', 'success');
                navigate('/');
            })
            .catch(err => {
                appContext.setSnackbar(true, 'Error: Failed to cancel your reservation', 'error');
            });
    };

    return (
        <div>
            <h3 className="mb-2">Are you sure you want to cancel your reservation?</h3>
            <div className="w-full flex flex-row gap-2">
                <SecondaryTransparentButton
                    onClick={() => appContext.setModal({ open: false, content: null })}
                >
                    No
                </SecondaryTransparentButton>
                <PrimaryBlackButton onClick={cancelReservationHandler}>
                    Yes, cancel reservation
                </PrimaryBlackButton>
            </div>
        </div>
    );
};

export default ModalConfirmCancelReservation;
