import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Dispatch, SetStateAction, useState } from 'react';
import { AlertColor } from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ProxySelect from '../ProxySelect';
import UsernameInput from '../UsernameInput';
import PasswordInput from '../PasswordInput';
import { useAppContext } from '../../../../contexts/AppContext';
import userAvatar from '../../../../../../assets/robot/robot_avatar.png';
import { useProxiesContext } from '../../../../contexts/ProxiesContext';
import { useAccountsContext } from '../../../../contexts/AccountsContext';

export interface AddAccountDialogProps {
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  setSnackbarOpen: Dispatch<SetStateAction<boolean>>;
  setSnackbarContent: Dispatch<SetStateAction<string>>;
  setSnackbarSeverity: Dispatch<SetStateAction<AlertColor>>;
  snackbarSeverity: AlertColor;
}

export default function AddAccountDialog(props: AddAccountDialogProps) {
  const {
    dialogOpen,
    setDialogOpen,
    setSnackbarOpen,
    setSnackbarContent,
    setSnackbarSeverity,
    snackbarSeverity,
  } = props;

  const appContext = useAppContext();
  const proxiesContext = useProxiesContext();
  const accountsContext = useAccountsContext();

  const { apiService } = appContext.state;
  const { proxies } = proxiesContext.state;
  const { dispatch } = accountsContext;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [proxy, setProxy] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [loading, setLoading] = useState(false);

  const clearFields = () => {
    setUsername('');
    setPassword('');
    setProxy('');

    setUsernameError('');
    setPasswordError('');

    if (snackbarSeverity === 'error') {
      setSnackbarOpen(false);
    }
  };

  const handleSave = async () => {
    if (!username || !password) {
      setSnackbarContent('Enter username and password');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } else if (usernameError || passwordError) {
      setSnackbarContent('Filled fields contain errors');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } else {
      const foundProxy = proxies.find(
        (proxyItem) => proxyItem.toString() === proxy,
      );

      const proxyId = foundProxy ? foundProxy.id : null;

      setLoading(true);

      const result = await apiService.accounts.add(username, password, proxyId);

      setLoading(false);

      if (result.type === 'success') {
        dispatch({
          type: 'add_account',
          data: result.data,
        });
        setDialogOpen(false);

        setSnackbarContent('Account has been added');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        setSnackbarContent(result.message);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      onTransitionExited={clearFields}
      fullWidth
      maxWidth="sm"
    >
      <Typography variant="h6" sx={{ px: 4, py: 2 }}>
        Add account
      </Typography>
      <Divider />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        component="form"
        flexDirection="column"
        rowGap={2}
        sx={{
          width: 400,
          py: 2,
          mx: 'auto',
        }}
        autoComplete="off"
      >
        <Box
          width={1}
          mb={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Avatar
            src={userAvatar}
            alt="user avatar"
            sx={{ height: 125, width: 125, mb: 1, p: 1, boxShadow: 3 }}
          />
          <Typography fontSize={18}>
            {username ? `@${username}` : ''}
          </Typography>
        </Box>
        <UsernameInput
          username={username}
          setUsername={setUsername}
          usernameError={usernameError}
          setUsernameError={setUsernameError}
          sx={{ width: 300 }}
        />
        <PasswordInput
          password={password}
          setPassword={setPassword}
          passwordError={passwordError}
          setPasswordError={setPasswordError}
          sx={{ width: 300 }}
        />
        <ProxySelect proxy={proxy} setProxy={setProxy} sx={{ width: 300 }} />
      </Box>
      <Box sx={{ px: 4, py: 3 }}>
        <Button
          variant="outlined"
          onClick={() => setDialogOpen(false)}
          sx={{ float: 'left' }}
        >
          Cancel
        </Button>
        <Button variant="outlined" onClick={handleSave} sx={{ float: 'right' }}>
          Save
        </Button>
      </Box>
      <Backdrop open={loading}>
        <CircularProgress sx={{ color: 'white' }} />
      </Backdrop>
    </Dialog>
  );
}
