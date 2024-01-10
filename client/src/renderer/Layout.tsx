import * as React from 'react';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import CellTowerIcon from '@mui/icons-material/CellTower';
import BarChartIcon from '@mui/icons-material/BarChart';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  const [state, setState] = useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState(open);
    };

  const navItems = [
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
      icon: <BarChartIcon />,
      content: 'Statistics',
      to: '#statistics',
    },
  ];

  const navList = (
    <Box
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navItems.map((item) => (
          <ListItem key={item.content} disablePadding>
            <ListItemButton component="a" href={item.to}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.content} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const anchor = 'left';

  return (
    <Box>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Fanby
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
        <Drawer anchor={anchor} open={state} onClose={toggleDrawer(false)}>
          {navList}
        </Drawer>
      </Box>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
}
