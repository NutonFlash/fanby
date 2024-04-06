import Box from '@mui/material/Box/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import errorRobot from '../../../assets/robot/robot_red.png';
import background from '../../../assets/white_bg.jpg';
import WindowButtons from '../layout/WindowButtons';

const SUPPORT_URL = window.electron.env.get('SUPPORT_URL');

export default function NotFoundPage() {
  return (
    <Box>
      <AppBar position="static">
        <Box display="flex" justifyContent="end" width={1}>
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
        height="calc(100vh - 36px)"
        flexDirection="column"
      >
        <img src={errorRobot} alt="Dissapointed robot Fanby" height={200} />
        <Box px={3} py={2} sx={{ textAlign: 'center' }}>
          <Typography fontSize={40} fontWeight={600}>
            Error 404
          </Typography>
          <Typography fontSize={28} py={2}>
            Oops... Page not found.
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
