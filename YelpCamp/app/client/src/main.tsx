import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import ThemeProvider from 'react-bootstrap/ThemeProvider';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import AppContextProvider from './store/AppContextProvider';
import router from './router';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // default: true
        },
    },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    // <React.StrictMode>
    <ThemeProvider>
        <QueryClientProvider client={queryClient}>
            <AppContextProvider>
                <RouterProvider router={router} />
            </AppContextProvider>
        </QueryClientProvider>
    </ThemeProvider>,
    // </React.StrictMode>,
);
