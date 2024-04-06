import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import InvoicesTable from '../tables/invoice/InvoicesTable';

export default function InvoiceList() {
  return (
    <Paper elevation={3}>
      <Box p={1} sx={{ fontSize: 15 }}>
        <Typography fontWeight={600} pb={1}>
          Invoices
        </Typography>
        <Divider
          sx={{ opacity: 1, borderColor: 'rgba(0, 0, 0, 0.35)', mb: 2 }}
        />
        <InvoicesTable />
      </Box>
    </Paper>
  );
}
