import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Campground, { loader as campgroundLoader } from './pages/Campground';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/campgrounds/:campgroundId',
    element: <Campground />,
    loader: campgroundLoader
  },
  {
    path: '/about',
    element: <About />
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
