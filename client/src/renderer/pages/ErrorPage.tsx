import Box from '@mui/material/Box/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import { useEffect } from 'react';
import errorRobot from '../../../assets/robot/robot_red.png';
import background from '../../../assets/white_bg.jpg';
import { useAppContext } from '../contexts/AppContext';
import WindowButtons from '../layout/WindowButtons';

const SUPPORT_URL = window.electron.env.get('SUPPORT_URL');

interface AppError {
  code: number;
  message: string;
  lastPath: string;
}

export default function ErrorPage() {
  const context = useAppContext();
  const { apiService } = context.state;

  const { store } = window.electron;

  const appError: AppError = store.get('appError', {
    code: 503,
    message: 'The server is currently unavailable.',
    lastPath: '',
  });

  useEffect(() => {
    let reconnectInterval: NodeJS.Timeout | null = null;
    let reconnectAttempts = 0;
    let isCheckingServer = false;

    async function checkServer(): Promise<void> {
      if (isCheckingServer) {
        if (reconnectInterval) {
          clearTimeout(reconnectInterval);
          reconnectInterval = null;
        }
      }

      isCheckingServer = true;

      let result = null;

      if (appError.code === 503) {
        result = await apiService.health.server();
      } else {
        result = await apiService.health.database();
      }

      if (result.type === 'success') {
        window.location.hash = appError.lastPath;
        store.delete('appError');
        isCheckingServer = false;
        return;
      }

      const delay =
        (reconnectAttempts < 5 ? 2 ** reconnectAttempts : 60) * 1000;

      reconnectInterval = setTimeout(async () => {
        reconnectAttempts += 1;
        await checkServer();
      }, delay);

      isCheckingServer = false;
    }

    (() => checkServer())();
  }, []);

  return (
    <Box>
      <AppBar position="absolute">
        <Box display="flex" justifyContent="end" width={1} height={46}>
          <WindowButtons />
        </Box>
      </AppBar>
      <Box
        sx={{
          height: '100%',
          width: '100%',
          left: 0,
          top: 0,
          position: 'absolute',
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          opacity: 0.55,
          zIndex: -1,
        }}
      />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        flexDirection="column"
      >
        <img src={errorRobot} alt="Dissapointed robot Fanby" height={200} />
        <Box px={3} py={2} sx={{ textAlign: 'center' }}>
          <Typography fontSize={40} fontWeight={600}>
            Error {appError.code}
          </Typography>
          <Typography fontSize={28} py={2}>
            Oops... {appError.message}
          </Typography>
          <Box py={1}>
            <Typography fontSize={18}>
              We apologize for the inconvenience.
            </Typography>
            <Typography fontSize={18}>
              If you believe this is an application error, please contact{' '}
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  window.electron.shell.openExternal(SUPPORT_URL);
                }}
                style={{
                  color: 'blue',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  font: 'inherit',
                  outline: 'inherit',
                }}
              >
                our support team
              </button>{' '}
              for assistance.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
