import React, { useEffect, useReducer, ReactNode, FunctionComponent } from 'react';
import AppContext from './app-context';
import { Alert, User } from '../types';

interface ContextProviderProps {
    children?: ReactNode;
}

interface appState {
    alert: Alert | null;
    currentUser: User | null;
}

const initialAppState: appState = {
    alert: null,
    currentUser: null,
};

const appReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ALERT':
            return {
                ...state,
                alert: action.alert,
            };
            break;
        case 'SET_CURRENT_USER':
            return {
                ...state, // spread to keep other state, otherwise state will be reset
                currentUser: action.user,
            };
            break;
        default:
            return initialAppState;
            break;
    }
};

const AppContextProvider: FunctionComponent<ContextProviderProps> = ({ children }) => {
    const [appState, dispatchAppAction] = useReducer(appReducer, initialAppState);

    const setAlert = (alert: Alert) => {
        dispatchAppAction({ type: 'SET_ALERT', alert: alert });
    };

    const setCurrentUser = (user: User | null) => {
        dispatchAppAction({ type: 'SET_CURRENT_USER', user: user });
    };

    const appContext = {
        alert: appState.alert,
        setAlert: setAlert,
        currentUser: appState.currentUser,
        setCurrentUser: setCurrentUser,
    };

    useEffect(() => {
        const user = localStorage.getItem('currentUser') as string;
        setCurrentUser(JSON.parse(user));
    }, []);

    return <AppContext.Provider value={appContext}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
