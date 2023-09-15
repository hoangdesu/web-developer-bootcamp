import React from 'react';
import ModalConfirmPayment from '../pages/Campground/ModalConfirmPayment';
import ModalLogin from '../pages/Campground/ModalLogin';

export const getModalContent = (modalType: string) => {
    switch (modalType) {
        case 'login':
            return <ModalLogin />;
            break;
        case 'confirm':
            return <ModalConfirmPayment />;
            break;
        default:
            return null;
    }
};
