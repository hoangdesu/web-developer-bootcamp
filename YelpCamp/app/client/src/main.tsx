import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import ThemeProvider from 'react-bootstrap/ThemeProvider';
import 'mapbox-gl/dist/mapbox-gl.css';
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
import Login from './pages/Login';
import User, { loader as usernameLoader } from './pages/User';
import Testing from './pages/Testing';
import Search from './pages/Search';
import Reservation, { loader as resvLoader } from './pages/Reservation';
import Confirm from './pages/Confirm';

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
        element: <Register />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/users/:username',
        element: <User />,
        loader: usernameLoader,
        errorElement: <ErrorBoundary />,
    },
    {
        path: '/search',
        element: <Search />,
        errorElement: <ErrorBoundary />,
    },
    {
        path: '/reservation/:reservationId',
        element: <Reservation />,
        loader: resvLoader,
        errorElement: <ErrorBoundary />,
    },
    {
        path: '/reservation/:reservationId/confirm',
        element: <Confirm />,
        loader: resvLoader,
        errorElement: <ErrorBoundary />,
    },
    {
        path: '/testing',
        element: <Testing />
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
