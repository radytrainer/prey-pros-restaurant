import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthGuard } from './components/AuthGuard';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Menu } from './pages/Menu';
import { Inventory } from './pages/Inventory';
import { Kitchen } from './pages/Kitchen';
import { Reports } from './pages/Reports';
import { Admin } from './pages/Admin';
import { Tables } from './pages/Tables';
import { Suppliers } from './pages/Suppliers';
import { CustomerMenu } from './pages/CustomerMenu';
import { Profile } from './pages/Profile';

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
          { path: 'menu', element: <Menu /> },
          { path: 'inventory', element: <Inventory /> },
          { path: 'kitchen', element: <Kitchen /> },
          { path: 'reports', element: <Reports /> },
          { path: 'admin', element: <Admin /> },
          { path: 'tables', element: <Tables /> },
          { path: 'suppliers', element: <Suppliers /> },
          { path: 'profile', element: <Profile /> },
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
