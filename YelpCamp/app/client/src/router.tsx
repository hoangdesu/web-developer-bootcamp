import React from 'react';

import {
    Outlet,
    ScrollRestoration,
    createBrowserRouter,
    redirect,
    useNavigation,
} from 'react-router-dom';

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
import ResetPassword from './pages/ResetPassword';
import Checkout, { loader as checkouResvtLoader } from './pages/Checkout';
import ScrollToTop from './components/ScrollToTop';

const Layout = () => {
    // You can provide a custom implementation of what "key" should be used to
    // cache scroll positions for a given location.  Using the location.key will
    // provide standard browser behavior and only restore on back/forward
    // navigations.  Using location.pathname will provide more aggressive
    // restoration and will also restore on normal link navigations to a
    // previously-accessed path.  Or - go nuts and lump many pages into a
    // single key (i.e., anything /wizard/* uses the same key)!
    // let getKey = React.useCallback((location: Location, matches: ReturnType<typeof useMatches>) => {
    //     let match = matches.find(m => (m.handle as any)?.scrollMode);
    //     if ((match?.handle as any)?.scrollMode === 'pathname') {
    //         return location.pathname;
    //     }

    //     return location.key;
    // }, []);

    return (
        <>
            <ScrollToTop>
                <Outlet />
            </ScrollToTop>

            {/*
          Including this component inside a data router component tree is what
          enables restoration
        */}
            {/* <ScrollRestoration getKey={getKey} /> */}
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
                path: '/reservations/:reservationId',
                element: <Reservation />,
                loader: resvLoader,
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
                element: <Confirm />,
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
