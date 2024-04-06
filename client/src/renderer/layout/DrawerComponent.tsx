import { KeyboardEvent, MouseEvent, useMemo } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import CellTowerIcon from '@mui/icons-material/CellTower';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import PaymentIcon from '@mui/icons-material/Payment';
import { NavItemProps } from './NavItem';
import robot from '../../../assets/robot/robot_wth_bird.png';
import NavItemList from './NavItemList';
import { useAppContext } from '../contexts/AppContext';

const SUPPORT_URL = window.electron.env.get('SUPPORT_URL');

interface DrawerContentProps {
  toggleDrawer: (open: boolean) => (event: KeyboardEvent | MouseEvent) => void;
}

function DrawerContent(props: DrawerContentProps) {
  const { toggleDrawer } = props;

  const appContext = useAppContext();
  const { socketService } = appContext.state;

  const topNavItems: NavItemProps[] = [
    {
      icon: <PersonIcon />,
      content: 'Accounts',
      to: '#accounts',
    },
    {
      icon: <GroupIcon />,
      content: 'Groups',
      to: '#groups',
    },
    {
      icon: <CellTowerIcon />,
      content: 'Proxies',
      to: '#proxies',
    },
    {
      icon: <PaymentIcon />,
      content: 'Payments',
      to: '#payments',
    },
  ];

  const bottomNavItems = [
    {
      icon: <HelpCenterIcon />,
      content: 'Support',
      to: '#',
      onClick: (event: MouseEvent) => {
        event.preventDefault();
        window.electron.shell.openExternal(SUPPORT_URL);
      },
    },
    {
      icon: <LogoutIcon />,
      content: 'Logout',
      to: '#',
      onClick: (event: MouseEvent) => {
        event.preventDefault();
        socketService.disconnect();
        window.electron.store.delete('accessToken');
        window.electron.store.delete('refreshToken');
        window.location.hash = '#login';
      },
    },
  ];

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height={1}
    >
      <Box>
        <Box
          display="flex"
          justifyContent="space-around"
          alignItems="center"
          p={2}
          pt={3}
        >
          <img src={robot} alt="cute robot as logo" height={75} />
          <Typography
            color="rgb(2,49,184)"
            fontSize={30}
            fontWeight={600}
            pt={4}
          >
            Fanby
          </Typography>
        </Box>
        <NavItemList navItems={topNavItems} toggleDrawer={toggleDrawer} />
      </Box>
      <Box>
        <NavItemList navItems={bottomNavItems} toggleDrawer={toggleDrawer} />
      </Box>
    </Box>
  );
}

interface DrawerComponentProps {
  drawerOpen: boolean;
  toggleDrawer: (open: boolean) => (event: KeyboardEvent | MouseEvent) => void;
}

export default function DrawerComponent(props: DrawerComponentProps) {
  const { drawerOpen, toggleDrawer } = props;

  const DrawerContentComponent = useMemo(
    () => <DrawerContent toggleDrawer={toggleDrawer} />,
    [toggleDrawer],
  );

  return (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={toggleDrawer(false)}
      sx={{
        '& .MuiDrawer-paper': { width: 220 },
      }}
    >
      {DrawerContentComponent}
    </Drawer>
  );
}
