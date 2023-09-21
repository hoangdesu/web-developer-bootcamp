import React, { createContext } from 'react';
import { Alert, User, Modal } from '../types';

interface AppContextType {
    alert: Alert | null;
    setAlert: (alert: Alert) => void;
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    modal: Modal;
    setModal: (modal: Modal) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export default AppContext;
