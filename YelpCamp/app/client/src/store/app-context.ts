import { createContext } from 'react';

const AppContext = createContext({
    alert: null || '',
    setAlert: (alert: string | null) => {}
});

export default AppContext;
