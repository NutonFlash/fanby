import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import { Dispatch, SetStateAction, useState } from 'react';
import Alert, { AlertColor } from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppContext } from '../../../../contexts/AppContext';
import TemporalProxiesTable from '../../../tables/proxy/temporal/TemporalProxiesTable';
import ProxiesInput from './ProxiesInput';
import Proxy from '../../../../models/Proxy';
import { useProxiesContext } from '../../../../contexts/ProxiesContext';

export interface AddProxiesDialogProps {
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  setSnackbarOpen: Dispatch<SetStateAction<boolean>>;
  setSnackbarContent: Dispatch<SetStateAction<string>>;
  setSnackbarSeverity: Dispatch<SetStateAction<AlertColor>>;
  snackbarSeverity: AlertColor;
}

export default function AddProxiesDialog(props: AddProxiesDialogProps) {
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

  const { apiService } = appContext.state;
  const { dispatch } = proxiesContext;

  const [addedProxies, setAddedProxies] = useState<Proxy[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDialogSave = async () => {
    setLoading(true);

    const result = await apiService.proxies.add(addedProxies);

    setLoading(false);

    if (result.type === 'success') {
      dispatch({
        type: 'add_proxies',
        data: result.data,
      });

      setSnackbarOpen(true);
      if (addedProxies.length === 1) {
        setSnackbarContent('Proxy has been added');
      } else {
        setSnackbarContent('Proxies have been added');
      }
      setSnackbarSeverity('success');

      setDialogOpen(false);
    } else {
      setSnackbarOpen(true);
      setSnackbarContent(result.message);
      setSnackbarSeverity('error');
    }
  };

  const clearFields = () => {
    setAddedProxies([]);
    if (snackbarSeverity === 'error') {
      setSnackbarOpen(false);
    }
  };

  return (
    <Dialog
      fullScreen
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      TransitionProps={{
        onExited: clearFields,
      }}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDialogOpen(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Add proxies
          </Typography>
          <Button
            color="inherit"
            variant="outlined"
            onClick={handleDialogSave}
            sx={{ width: 80 }}
          >
            {loading ? <CircularProgress color="inherit" size={24} /> : 'SAVE'}
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ my: 3, mx: 5 }}>
        <Alert severity="warning" sx={{ width: 'fit-content', fontSize: 16 }}>
          Warning: You can use only{' '}
          <b>
            <code>HTTP|HTTPS</code>
          </b>{' '}
          proxies, not{' '}
          <b>
            <code>SOCKS5</code>
          </b>
          .
        </Alert>
        <Box sx={{ mt: 2 }}>
          <ProxiesInput
            addedProxyRows={addedProxies}
            setAddedProxyRows={setAddedProxies}
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarContent={setSnackbarContent}
            setSnackbarSeverity={setSnackbarSeverity}
          />
        </Box>
        <Box sx={{ mt: 4, mb: 2 }}>
          <TemporalProxiesTable
            addedProxies={addedProxies}
            setAddedProxies={setAddedProxies}
          />
        </Box>
      </Box>
    </Dialog>
  );
}
