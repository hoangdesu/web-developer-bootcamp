import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import About from './pages/About';
import Campground, { loader as addCampgroundLoader } from './pages/Campground';
import { loader as editCampgroundLoader } from './pages/EditCampground';
import { QueryClient, QueryClientProvider } from 'react-query';
import NewCampground from './pages/NewCampground';
import EditCampground from './pages/EditCampground';

const queryClient = new QueryClient();

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/campgrounds/:campgroundId',
        element: <Campground />,
        loader: addCampgroundLoader,
    },
    {
        path: '/about',
        element: <About />,
    },
    {
        path: '/campgrounds/new',
        element: <NewCampground />,
    },
    {
        path: '/campgrounds/:campgroundId/edit',
        element: <EditCampground />,
        loader: editCampgroundLoader,
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </React.StrictMode>,
);
