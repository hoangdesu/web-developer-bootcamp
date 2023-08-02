import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import ThemeProvider from 'react-bootstrap/ThemeProvider';
import 'bootstrap/dist/css/bootstrap.min.css';

import AppContextProvider from './store/AppContextProvider';

import App from './App';
import About from './pages/About';
import Campground, { loader as addCampgroundLoader } from './pages/Campground';
import { loader as editCampgroundLoader } from './pages/EditCampground';
import NewCampground from './pages/NewCampground';
import EditCampground from './pages/EditCampground';
import ErrorBoundary from './pages/ErrorBoundary';
import Loading from './pages/Loading';
import Register from './pages/Register';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // default: true
        },
    },
});

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorBoundary />,
    },
    {
        path: '/campgrounds/:campgroundId',
        element: <Campground />,
        loader: addCampgroundLoader,
        errorElement: <ErrorBoundary />,
    },
    {
        path: '/about',
        element: <About />,
    },
    {
        path: '/campgrounds/new',
        element: <NewCampground />,
        errorElement: <ErrorBoundary />,
    },
    {
        path: '/campgrounds/:campgroundId/edit',
        element: <EditCampground />,
        loader: editCampgroundLoader,
    },
    {
        path: '/campgrounds',
        loader: async () => {
            throw redirect('/');
        },
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/error',
        element: <ErrorBoundary />,
        errorElement: <ErrorBoundary />,
    },
    {
        path: '/loading',
        element: <Loading />,
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <AppContextProvider>
                    <RouterProvider router={router} />
                </AppContextProvider>
            </QueryClientProvider>
        </ThemeProvider>
    </React.StrictMode>,
);
