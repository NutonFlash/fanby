import Box from '@mui/material/Box';
import { useState } from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import CropSquareSharpIcon from '@mui/icons-material/CropSquareSharp';
import CloseIcon from '@mui/icons-material/Close';
import BarButton from './BarButton';
import windowRestoreIcon from '../../../assets/window-restore.svg';

export default function WindowButtons() {
  const [isMaximized, setIsMaximized] = useState(
    window.electron.mainWindow.isMaximized(),
  );

  const handleRestoreClick = () => {
    window.electron.mainWindow.restore();
    setIsMaximized(false);
  };

  const handleMaximizeClick = () => {
    window.electron.mainWindow.maximize();
    setIsMaximized(true);
  };

  const handleMinimizeClick = () => {
    window.electron.mainWindow.minimize();
  };

  const handleCloseClick = () => {
    window.electron.mainWindow.close();
  };

  return (
    <Box display="flex" alignItems="center" height={1}>
      <BarButton
        icon={<RemoveIcon sx={{ height: 18 }} />}
        hoverColor="rgba(255, 255, 255, 0.25)"
        onClick={handleMinimizeClick}
      />
      {isMaximized ? (
        <BarButton
          icon={
            <img
              alt="window restore icon"
              src={windowRestoreIcon}
              height={13}
            />
          }
          hoverColor="rgba(255, 255, 255, 0.25)"
          onClick={handleRestoreClick}
        />
      ) : (
        <BarButton
          icon={<CropSquareSharpIcon sx={{ height: 18 }} />}
          hoverColor="rgba(255, 255, 255, 0.25)"
          onClick={handleMaximizeClick}
        />
      )}

      <BarButton
        icon={<CloseIcon sx={{ height: 20 }} />}
        hoverColor="rgba(235, 52, 52, 1)"
        onClick={handleCloseClick}
      />
    </Box>
  );
}
