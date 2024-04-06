import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { AlertColor } from '@mui/material/Alert';
import InvoiceForm from '../components/payment/InvoiceForm';
import PriceList from '../components/payment/PriceList';
import InvoiceList from '../components/payment/InvoiceList';
import { useAppContext } from '../contexts/AppContext';
import AppNotification from '../components/AppNotification';
import Invoice from '../models/Invoice';
import { useInvoicesContext } from '../contexts/InvoicesContext';

export default function PaymentsPage() {
  const appContext = useAppContext();
  const invoicesContext = useInvoicesContext();

  const { socketService } = appContext.state;
  const { dispatch } = invoicesContext;

  useEffect(() => {
    socketService.on('invoice_update', (data: Invoice) => {
      dispatch({ type: 'update_invoice', data });
    });

    return () => {
      socketService.off('invoice_update');
    };
  }, []);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>('success');

  return (
    <Box m={2}>
      <Grid container spacing={3} justifyContent="space-around">
        <Grid xs={10} md={4}>
          <Stack spacing={2} minWidth={200}>
            <InvoiceForm
              setSnackbarOpen={setSnackbarOpen}
              setSnackbarContent={setSnackbarContent}
              setSnackbarSeverity={setSnackbarSeverity}
            />
            <PriceList />
          </Stack>
        </Grid>
        <Grid xs={10} md={8}>
          <InvoiceList />
        </Grid>
      </Grid>
      <AppNotification
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        snackbarContent={snackbarContent}
        snackbarSeverity={snackbarSeverity}
      />
    </Box>
  );
}
