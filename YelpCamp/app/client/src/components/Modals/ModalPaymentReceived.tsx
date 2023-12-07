import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../../store/app-context';
import CheckmarkCSSAnimation from '../CheckmarkCSSAnimation';

const ModalPaymentReceived = () => {
    const [redirectSeconds, setRedirectSeconds] = useState(5);
    const appContext = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setRedirectSeconds(redirectSeconds - 1);
            if (redirectSeconds === 1) {
                navigate(`/users/${appContext.currentUser!.username}?tab=reservations`);

                appContext.setModal({ open: false, content: null });
                clearInterval(timer);
            }
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    });

    return (
        <div>
            <h1>Payment received</h1>
            <p>Thank you for your reservation with YelpCamp!</p>

            <CheckmarkCSSAnimation />

            <p>You will be redirected to your reservation in {redirectSeconds} seconds...</p>
        </div>
    );
};

export default ModalPaymentReceived;
