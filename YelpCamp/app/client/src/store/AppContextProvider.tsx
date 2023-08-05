import React, { useReducer } from 'react';
import AppContext from './app-context';
import { Alert, User } from '../types';

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

const AppContextProvider = ({ children }) => {
    const [appState, dispatchAppAction] = useReducer(appReducer, initialAppState);

    const setAlert = (alert: Alert) => {
        dispatchAppAction({ type: 'SET_ALERT', alert: alert });
    };

    const setCurrentUser = (user: User) => {
        dispatchAppAction({ type: 'SET_CURRENT_USER', user: user });
    };

    const appContext = {
        alert: appState.alert,
        setAlert: setAlert,
        currentUser: appState.currentUser,
        setCurrentUser: setCurrentUser,
    };

    return <AppContext.Provider value={appContext}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
