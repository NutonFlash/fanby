import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState } from 'react';
import Box from '@mui/material/Box';
import { AlertColor } from '@mui/material/Alert';
import AccountsTable from '../components/tables/account/AccountsTable';
import Account from '../models/Account';
import CommonInfo from '../components/CommonInfo';
import AppNotification from '../components/AppNotification';
import AddAccountDialog from '../components/dialogs/account/add/AddAccountDialog';
import { ProxiesProvider } from '../contexts/ProxiesContext';

export default function AccountsPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>('success');

  const [editAccount, setEditAccount] = useState<Account | null>(null);

  return (
    <Box m={2}>
      <CommonInfo />

      <AccountsTable
        setEditDialogOpen={setEditDialogOpen}
        setEditAccount={setEditAccount}
        setSnackbarOpen={setSnackbarOpen}
        setSnackbarContent={setSnackbarContent}
        setSnackbarSeverity={setSnackbarSeverity}
      />

      <Button
        variant="contained"
        startIcon={<AddCircleIcon />}
        onClick={() => {
          setEditAccount(null);
          setAddDialogOpen(true);
        }}
        sx={{ mt: 2 }}
      >
        Add account
      </Button>
      {/* <AccountManagementDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        editAccount={editAccount}
        setAccountRows={setAccountRows}
        title={dialogTitle}
      /> */}
      <ProxiesProvider>
        <AddAccountDialog
          dialogOpen={addDialogOpen}
          setDialogOpen={setAddDialogOpen}
          setSnackbarOpen={setSnackbarOpen}
          setSnackbarContent={setSnackbarContent}
          setSnackbarSeverity={setSnackbarSeverity}
        />
      </ProxiesProvider>
      <AppNotification
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        snackbarContent={snackbarContent}
        snackbarSeverity={snackbarSeverity}
      />
    </Box>
  );
}
