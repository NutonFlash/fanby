import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { KeyboardEvent, MouseEvent } from 'react';
import NavItem, { NavItemProps } from './NavItem';

interface NavItemListProps {
  navItems: NavItemProps[];
  toggleDrawer: (open: boolean) => (event: KeyboardEvent | MouseEvent) => void;
}

export default function NavItemList(props: NavItemListProps) {
  const { navItems, toggleDrawer } = props;
  return (
    <List disablePadding>
      <Box onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
        <Divider />
        {navItems.map((item) => (
          <Box key={item.content}>
            <NavItem
              key={item.content}
              icon={item.icon}
              content={item.content}
              to={item.to}
              onClick={item.onClick}
            />
            <Divider />
          </Box>
        ))}
      </Box>
    </List>
  );
}
