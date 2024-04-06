import { useState, useEffect, KeyboardEvent, MouseEvent } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import DrawerComponent from './DrawerComponent';
import AppBarComponent from './AppBarComponent';

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const location = useLocation();

  const [pageTitle, setPageTitle] = useState('');

  const titleFromPath = (path: string) => {
    if (path === '/') return 'Accounts';
    const cuttedPath = path.substring(1);
    return cuttedPath[0].toUpperCase() + cuttedPath.substring(1);
  };

  useEffect(() => {
    setPageTitle(titleFromPath(location.pathname));
  }, [location]);

  const toggleDrawer =
    (open: boolean) => (event: KeyboardEvent | MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as KeyboardEvent).key === 'Tab' ||
          (event as KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setDrawerOpen(open);
    };

  return (
    <Box>
      <Box sx={{ flexGrow: 1 }}>
        <AppBarComponent pageTitle={pageTitle} toggleDrawer={toggleDrawer} />
        <DrawerComponent drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
      </Box>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
}
