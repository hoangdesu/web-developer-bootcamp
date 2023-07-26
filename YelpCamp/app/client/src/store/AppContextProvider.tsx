import React, { useReducer } from 'react';
import AppContext from './app-context';

interface appState {
    alert: string | null;
};

const initialAppState: appState = {
    alert: 'ok',
}

const appReducer = (state, action) => {
    switch(action.type) {
        case 'SET_ALERT':
            console.log('inside set_alert', action.alert)
            return {
                ...state,
                alert: action.alert
            }
            break;
        default:
            return initialAppState;
            break;
    }
};

const AppContextProvider = (props) => {
    const [appState, dispatchAppAction] = useReducer(appReducer, initialAppState);

    const setAlert = (alert: string | null) => {
        console.log('setting alert', alert)
        dispatchAppAction({ type: 'SET_ALERT', alert: alert });
    }
    
    const appContext = {
        alert: appState.alert,
        setAlert: setAlert
    }

    return (
        <AppContext.Provider value={appContext}>
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContextProvider;

// Unterminated regular expression literal.ts(1161) error caused by naming file ".ts"
// -> rename to tsx solves
