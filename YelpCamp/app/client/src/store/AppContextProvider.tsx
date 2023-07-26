import React, { useReducer } from 'react';
import AppContext from './app-context';

interface appState {
    alert: string | null;
}

const initialAppState: appState = {
    alert: null,
};

const appReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ALERT':
            return {
                ...state,
                alert: action.alert,
            };
            break;
        default:
            return initialAppState;
            break;
    }
};

const AppContextProvider = ({ children }) => {
    const [appState, dispatchAppAction] = useReducer(appReducer, initialAppState);

    const setAlert = (alert: string | null) => {
        dispatchAppAction({ type: 'SET_ALERT', alert: alert });
    };

    const appContext = {
        alert: appState.alert,
        setAlert: setAlert,
    };

    return <AppContext.Provider value={appContext}>{children}</AppContext.Provider>;
};

export default AppContextProvider;

// Unterminated regular expression literal.ts(1161) error caused by naming file ".ts"
// -> rename to tsx solves
