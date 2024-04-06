import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { KeyboardEvent, MouseEvent } from 'react';
import Box from '@mui/material/Box';
import WindowButtons from './WindowButtons';

interface AppBarComponentProps {
  pageTitle: string;
  toggleDrawer: (open: boolean) => (event: KeyboardEvent | MouseEvent) => void;
}

export default function AppBarComponent(props: AppBarComponentProps) {
  const { pageTitle, toggleDrawer } = props;

  return (
    <AppBar position="static">
      <Box display="flex" justifyContent="space-between" height={46}>
        <Box
          display="flex"
          justifyContent="space-around"
          alignItems="center"
          sx={{ pl: 3 }}
        >
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
          <Typography variant="h6">{pageTitle}</Typography>
        </Box>
        <WindowButtons />
      </Box>
    </AppBar>
  );
}
