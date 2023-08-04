import { createContext } from 'react';
import { Alert, User } from '../types';

const AppContext = createContext({
    alert: {
        message: String,
        variant: String,
    },
    setAlert: (alert: Alert) => {},
    currentUser: {},
    setCurrentUser: (user: User | null) => {},
});

export default AppContext;
