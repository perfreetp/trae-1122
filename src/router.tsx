import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Cabinet from '@/pages/Cabinet';
import Devices from '@/pages/Devices';
import Alarms from '@/pages/Alarms';
import Inspection from '@/pages/Inspection';
import Capacity from '@/pages/Capacity';
import Changes from '@/pages/Changes';
import Reports from '@/pages/Reports';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/cabinet',
        element: <Cabinet />,
      },
      {
        path: '/devices',
        element: <Devices />,
      },
      {
        path: '/alarms',
        element: <Alarms />,
      },
      {
        path: '/inspection',
        element: <Inspection />,
      },
      {
        path: '/capacity',
        element: <Capacity />,
      },
      {
        path: '/changes',
        element: <Changes />,
      },
      {
        path: '/reports',
        element: <Reports />,
      },
    ],
  },
]);
