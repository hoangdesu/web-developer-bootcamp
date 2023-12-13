import React from 'react';

import { Outlet, createBrowserRouter, redirect } from 'react-router-dom';

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
import ConfirmOnMobile, { loader as resvLoader } from './pages/ConfirmOnMobile';
import ResetPassword from './pages/ResetPassword';
import Checkout, { loader as checkouResvtLoader } from './pages/Checkout';
import ScrollToTop from './components/ScrollToTop';

const Layout = () => {
    return (
        <>
            <ScrollToTop>
                <Outlet />
            </ScrollToTop>
        </>
    );
};

export default createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <App />,
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
                path: '/reset',
                element: <ResetPassword />,
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
                path: '/reservations/:reservationId/checkout',
                element: <Checkout />,
                loader: checkouResvtLoader,
                errorElement: <ErrorBoundary />,
            },
            {
                path: '/reservations/:reservationId/confirm',
                element: <ConfirmOnMobile />,
                loader: resvLoader,
                errorElement: <ErrorBoundary />,
            },
            {
                path: '/testing',
                element: <Testing />,
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
        ],
    },
]);
