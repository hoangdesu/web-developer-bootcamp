import React from 'react';
import ModalConfirmPayment from '../pages/Campground/ModalConfirmPayment';
import ModalLogin from '../pages/Campground/ModalLogin';

export const getModalContent = (
    modalType: string,
    setModalType: React.Dispatch<React.SetStateAction<'login' | 'confirm'>>,
) => {
    switch (modalType) {
        case 'login':
            return <ModalLogin setModalType={setModalType} />;
            break;
        case 'confirm':
            return <ModalConfirmPayment />;
            break;
        default:
            return null;
    }
};
