import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import ThemeProvider from 'react-bootstrap/ThemeProvider';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import AppContextProvider from './store/AppContextProvider';
import router from './router';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
// axios.defaults.headers.common['Cross-Origin-Opener-Policy'] = 'same-origin';
// axios.defaults.headers.common['Cross-Origin-Embedder-Policy'] = 'require-corp';
// axios.defaults.headers.common['Content-Type'] = 'application/json';
// axios.defaults.withCredentials = true;
// res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
// res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")

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
