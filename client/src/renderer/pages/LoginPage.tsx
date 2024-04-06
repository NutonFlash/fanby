import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import { AlertColor } from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import CircularProgress from '@mui/material/CircularProgress';
import backgroundImage from '../../../assets/login-background.jpg';
import robotWelcome from '../../../assets/robot/robot_welcome.png';
import EmailInput from '../components/login/EmailInput';
import PasswordInput from '../components/login/PasswordInput';
import { useAppContext } from '../contexts/AppContext';
import WindowButtons from '../layout/WindowButtons';
import AppNotification from '../components/AppNotification';

const ForgotButton = styled(Button)({
  color: 'black',
  backgroundColor: 'white',
  '&:hover': {
    backgroundColor: '#f1f0f0',
  },
});

const calculateSpacing = (emailError: string, passwordError: string) => {
  const errorsNumber = [emailError, passwordError].reduce(
    (accumulator, curVal) => (curVal ? accumulator + 1 : accumulator),
    0,
  );
  switch (errorsNumber) {
    case 0: {
      return 2;
    }
    case 1: {
      return 1.5;
    }
    case 2: {
      return 1;
    }
    default: {
      return 0;
    }
  }
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>('success');

  const [loading, setLoading] = useState(false);

  const context = useAppContext();

  const { apiService, socketService } = context.state;

  const handleSignIn = async () => {
    setLoading(true);

    if (!email || !password) {
      setSnackbarOpen(true);
      setSnackbarContent('Enter email and password');
      setSnackbarSeverity('error');
      return;
    }
    if (emailError || passwordError) {
      setSnackbarOpen(true);
      setSnackbarContent('Filled fields contain errors');
      setSnackbarSeverity('error');
      return;
    }

    const result = await apiService.auth.login(email, password);

    setLoading(false);

    if (result.type === 'success') {
      const { accessToken, refreshToken } = result.data;

      window.electron.store.set('accessToken', accessToken);
      window.electron.store.set('refreshToken', refreshToken);

      socketService.connect(window.electron.env.get('WSS_URL'));

      setSnackbarOpen(true);
      setSnackbarContent('Login successful!');
      setSnackbarSeverity('success');

      setTimeout(() => {
        window.location.hash = '#accounts';
      }, 3000);
    } else if (result.status >= 400 && result.status < 500) {
      const { message } = result;
      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setSnackbarContent(message);
    }
  };

  const [space, setSpace] = useState(2);

  useEffect(() => {
    setSpace(calculateSpacing(emailError, passwordError));
  }, [emailError, passwordError]);

  return (
    <Box>
      <AppBar position="static">
        <Box display="flex" justifyContent="end" width={1}>
          <WindowButtons />
        </Box>
      </AppBar>
      <Box
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100vw',
          height: 'calc(100vh - 36px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper elevation={16} sx={{ width: 375, height: 550 }}>
          <Box
            display="flex"
            justifyContent="space-around"
            flexDirection="column"
            height={1}
          >
            <Box pb={space}>
              <Typography
                fontSize={26}
                fontWeight={600}
                color="primary"
                textAlign="center"
                pb={1}
              >
                Welcome!
              </Typography>
              <Box width={1} display="flex" justifyContent="center">
                <img src={robotWelcome} alt="cute robot as logo" height={75} />
              </Box>
            </Box>
            <Box mx={4}>
              <Typography variant="h6" color="primary" fontWeight={600}>
                Login
              </Typography>
              <Stack py={space} spacing={3}>
                <EmailInput
                  email={email}
                  setEmail={setEmail}
                  emailError={emailError}
                  setEmailError={setEmailError}
                />
                <PasswordInput
                  password={password}
                  setPassword={setPassword}
                  passwordError={passwordError}
                  setPasswordError={setPasswordError}
                />
              </Stack>
            </Box>
            <Stack
              justifyContent="center"
              alignItems="center"
              spacing={2}
              pb={2}
            >
              <Button
                variant="contained"
                sx={{ borderRadius: 5, width: 200 }}
                onClick={handleSignIn}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign in'
                )}
              </Button>
              <ForgotButton
                variant="contained"
                sx={{
                  borderRadius: 5,
                  width: 200,
                }}
              >
                Forgot password?
              </ForgotButton>
              <Box pt={space}>
                <span>Don&apos;t have an account?</span>{' '}
                <Link href="#register">Sign up</Link>
              </Box>
            </Stack>
          </Box>
        </Paper>
        <AppNotification
          snackbarOpen={snackbarOpen}
          setSnackbarOpen={setSnackbarOpen}
          snackbarContent={snackbarContent}
          snackbarSeverity={snackbarSeverity}
        />
      </Box>
    </Box>
  );
}
