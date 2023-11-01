import React, { useEffect, useReducer, ReactNode, FunctionComponent } from 'react';
import AppContext, { AppContextType } from './app-context';
import { Alert, Modal, Snackbar, User } from '../types';

interface ContextProviderProps {
    children?: ReactNode;
}

const initialAppState: AppContextType = {
    alert: null,
    setAlert: () => {},
    currentUser: null,
    setCurrentUser: () => {},
    modal: {
        open: false,
        content: null,
        requiresLoggedIn: false,
    },
    setModal: () => {},
    snackbar: {
        isOpen: false,
        message: '',
        severity: 'info',
    },
    setSnackbar: () => {},
};

const appReducer = (state: AppContextType, action) => {
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

    const setSnackbar = (
        isOpen: boolean,
        message: string | React.ReactNode | React.ReactElement,
        severity = 'info',
    ) => {
        const snackbar = {
            isOpen,
            message,
            severity,
        };
        dispatchAppAction({ type: 'SET_SNACKBAR', snackbar: snackbar });
    };

    const appContext: AppContextType = {
        alert: appState.alert,
        setAlert: setAlert,
        currentUser: appState.currentUser,
        setCurrentUser: setCurrentUser,
        modal: appState.modal,
        setModal: setModal,
        snackbar: appState.snackbar,
        setSnackbar: setSnackbar,
    };

    useEffect(() => {
        const user = localStorage.getItem('currentUser') as string;
        setCurrentUser(JSON.parse(user));
        document.documentElement.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant", // Optional if you want to skip the scrolling animation
          });
    }, []);

    return <AppContext.Provider value={appContext}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
