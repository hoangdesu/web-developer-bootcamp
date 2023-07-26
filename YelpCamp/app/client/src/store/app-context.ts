import { createContext } from 'react';

const AppContext = createContext({
    alert: null,
    setAlert: () => {},
});

export default AppContext;
