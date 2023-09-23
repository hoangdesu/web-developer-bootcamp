import React, { useEffect, useReducer, ReactNode, FunctionComponent } from 'react';
import AppContext from './app-context';
import { Alert, Modal, Snackbar, User } from '../types';

interface ContextProviderProps {
    children?: ReactNode;
}

interface appState {
    alert: Alert | null;
    currentUser: User | null;
    modal: Modal;
    snackbar: Snackbar;
}

const initialAppState: appState = {
    alert: null,
    currentUser: null,
    modal: {
        open: false,
        content: null,
        requiresLoggedIn: false,
    },
    snackbar: {
        isOpen: false,
        message: '',
        severity: 'success',
        set: function (isOpen: boolean, message = 'default message', severity = 'info') {
            console.log('inside set snackbar', this.isOpen);
            this.isOpen = isOpen;
            this.message = message;
            this.severity = severity;
        },
        close: function () {
            this.isOpen = false;
            this.message = '';
            console.log('inside close function', this.isOpen)
        },
    },
};

const appReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ALERT':
            return {
                ...state,
                alert: action.alert,
            };
        case 'SET_CURRENT_USER':
            return {
                ...state, // spread to keep other state, otherwise state will be reset
                currentUser: action.user,
            };
        case 'SET_MODAL':
            return {
                ...state,
                modal: action.modal,
            };
        case 'SET_SNACKBAR':
            return {
                ...state,
                snackbar: action.snackbar,
            };
        default:
            return initialAppState;
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

    const setModal = (modal: Modal | null) => {
        dispatchAppAction({ type: 'SET_MODAL', modal: modal });
    };

    const setSnackbar = (snackbar: Snackbar) => {
        dispatchAppAction({ type: 'SET_SNACKBAR', snackbar: snackbar });
    };

    const appContext = {
        alert: appState.alert,
        setAlert: setAlert,
        currentUser: appState.currentUser,
        setCurrentUser: setCurrentUser,
        modal: appState.modal,
        setModal: setModal,
        snackbar: appState.snackbar,
    };

    useEffect(() => {
        const user = localStorage.getItem('currentUser') as string;
        setCurrentUser(JSON.parse(user));
    }, []);

    return <AppContext.Provider value={appContext}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
