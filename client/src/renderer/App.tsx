import { createHashRouter, RouterProvider, redirect } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ReactNode } from 'react';
import Layout from './layout/Layout';
import AccountsPage from './pages/AccountsPage';
import GroupsPage from './pages/GroupsPage';
import ProxiesPage from './pages/ProxiesPage';
import { AppProvider } from './contexts/AppContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PaymentsPage from './pages/PaymentsPage';
import { checkAndRefreshTokens } from './services/tokens';
import ErrorPage from './pages/ErrorPage';
import NotFoundPage from './pages/NotFoundPage';
import { AccountsProvider } from './contexts/AccountsContext';
import { ProxiesProvider } from './contexts/ProxiesContext';
import { GroupsProvider } from './contexts/GroupsContext';
import { InvoicesProvider } from './contexts/InvoicesContext';

function Providers({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <AccountsProvider>
        <GroupsProvider>
          <ProxiesProvider>
            <InvoicesProvider>{children}</InvoicesProvider>
          </ProxiesProvider>
        </GroupsProvider>
      </AccountsProvider>
    </AppProvider>
  );
}

export default function App() {
  const { store } = window.electron;

  const rootLoader = async () => {
    const isFirstLaunch = !store.has('firstLaunch');

    if (isFirstLaunch) {
      store.set('firstLaunch', false);
      return redirect('/register');
    }

    return '';
  };

  const protectiveLoader = async () => {
    await checkAndRefreshTokens();
    return '';
  };

  const router = createHashRouter([
    {
      path: '/register',
      element: <RegisterPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/login',
      element: <LoginPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/error',
      element: <ErrorPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: '*',
      element: <NotFoundPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/',
      element: <Layout />,
      loader: rootLoader,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          loader: protectiveLoader,
          element: <AccountsPage />,
        },
        {
          path: 'accounts',
          loader: protectiveLoader,
          element: <AccountsPage />,
        },
        {
          path: 'proxies',
          loader: protectiveLoader,
          element: <ProxiesPage />,
        },
        {
          path: 'groups',
          loader: protectiveLoader,
          element: <GroupsPage />,
        },
        {
          path: 'payments',
          loader: protectiveLoader,
          element: <PaymentsPage />,
        },
      ],
    },
  ]);

  const theme = createTheme({
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
    },
  });

  return (
    <Providers>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Providers>
  );
}
