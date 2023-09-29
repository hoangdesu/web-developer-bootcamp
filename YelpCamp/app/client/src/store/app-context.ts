import React, { createContext } from 'react';
import { Alert, User, Modal, Snackbar, TSeverity } from '../types';

export interface AppContextType {
    alert: Alert | null;
    setAlert: (alert: Alert | null) => void;
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    modal: Modal;
    setModal: (modal: Modal) => void;
    snackbar: Snackbar;
    setSnackbar: (
        isOpen: boolean,
        message?: string | React.ReactNode | React.ReactElement,
        severity?: TSeverity,
    ) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export default AppContext;
