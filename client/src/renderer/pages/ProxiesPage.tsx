import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState } from 'react';
import { AlertColor } from '@mui/material';
import MainProxiesTable from '../components/tables/proxy/main/MainProxiesTable';
import AddProxiesDialog from '../components/dialogs/proxy/add/AddProxiesDialog';
import AppNotification from '../components/AppNotification';

export default function ProxiesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('error');

  return (
    <Box m={2}>
      <MainProxiesTable
        setSnackbarOpen={setSnackbarOpen}
        setSnackbarContent={setSnackbarContent}
        setSnackbarSeverity={setSnackbarSeverity}
      />
      <Button
        variant="contained"
        startIcon={<AddCircleIcon />}
        onClick={() => {
          setDialogOpen(true);
        }}
        sx={{ mt: 2 }}
      >
        Add proxies
      </Button>
      <AddProxiesDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        setSnackbarOpen={setSnackbarOpen}
        setSnackbarContent={setSnackbarContent}
        setSnackbarSeverity={setSnackbarSeverity}
        snackbarSeverity={snackbarSeverity}
      />
      <AppNotification
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        snackbarContent={snackbarContent}
        snackbarSeverity={snackbarSeverity}
      />
    </Box>
  );
}
