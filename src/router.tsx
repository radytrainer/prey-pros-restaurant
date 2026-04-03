import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthGuard } from './components/AuthGuard';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Kitchen } from './pages/Kitchen';
import { Admin } from './pages/Admin';
import { Tables } from './pages/Tables';
import { CustomerMenu } from './pages/CustomerMenu';
import { Profile } from './pages/Profile';
import { Users } from './pages/Users';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <AuthGuard />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'kitchen', element: <Kitchen /> },
          { path: 'admin', element: <Admin /> },
          { path: 'tables', element: <Tables /> },
          { path: 'profile', element: <Profile /> },
          { path: 'users', element: <Users /> },
        ],
      },
    ],
  },
  {
    path: 'order/:tableId',
    element: <CustomerMenu />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};
