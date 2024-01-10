// import AccountTable from './components/AccountTable';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import Layout from './Layout';
import AccountsPage from './pages/AccountsPage';

export default function App() {
  const router = createHashRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: 'accounts',
          element: <AccountsPage />,
        },
        {
          path: 'proxies',
          element: <p>proxies</p>,
        },
        {
          path: 'groups',
          element: <p>groups</p>,
        },
        {
          path: 'statistics',
          element: <p>statistics</p>,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
