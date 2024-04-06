import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { MouseEventHandler } from 'react';
import { useLocation } from 'react-router-dom';

export interface NavItemProps {
  icon: ReactJSXElement;
  content: string;
  to: string;
  onClick?: MouseEventHandler;
}

const isSelected = (pathname: string, hashTo: string) => {
  const path = pathname === '/' ? '/accounts' : pathname;
  return path.substring(1) === hashTo.substring(1);
};

export default function NavItem(props: NavItemProps) {
  const { icon, content, to, onClick } = props;
  const location = useLocation();

  return (
    <ListItem disablePadding>
      <ListItemButton
        component="a"
        href={to}
        selected={isSelected(location.pathname, to)}
        onClick={onClick}
        sx={{
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.07)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(25, 118, 210, 0.135)',
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.165)',
          },
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={content} />
      </ListItemButton>
    </ListItem>
  );
}

NavItem.defaultProps = {
  onClick: null,
};
