import Button from '@mui/material/Button';
import {
  GridColDef,
  useGridApiRef,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { useEffect } from 'react';
import CustomNoRowsOverlay from '../CustomNoRowsOverlay';
import { useAppContext } from '../../../contexts/AppContext';
import { useInvoicesContext } from '../../../contexts/InvoicesContext';
import CustomDataGrid from '../CustomDataGrid';

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const colorFromStatus = (status: string) => {
  switch (status) {
    case 'Created':
      return 'primary';
    case 'Completed':
      return 'success';
    case 'Pending':
      return 'warning';
    case 'Error':
    case 'Expired':
      return 'error';
    default:
      return 'secondary';
  }
};

export default function InvoicesTable() {
  const appContext = useAppContext();
  const { apiService } = appContext.state;

  const invoicesContext = useInvoicesContext();
  const { state, dispatch } = invoicesContext;

  useEffect(() => {
    (async () => {
      const result = await apiService.invoices.all();
      if (result.type === 'success') {
        dispatch({ type: 'set_invoices', data: result.data });
        dispatch({ type: 'set_loaded', data: true });
      }
    })();
  }, []);

  const apiRef = useGridApiRef();

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: '№',
      width: 60,
      renderCell(params) {
        return params.row.index + 1;
      },
    },
    {
      field: 'id',
      headerName: 'Order Id',
      width: 85,
    },
    {
      field: 'amount',
      headerName: 'Amount, $',
      width: 90,
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 95,
      valueFormatter: (params) => {
        return formatDate(params.value);
      },
    },
    {
      field: 'currency',
      headerName: 'Currency',
      width: 120,
    },
    {
      field: 'received',
      headerName: 'Received',
      minWidth: 110,
      flex: 0.35,
      valueFormatter: (params) => {
        const stringValue = params.value.toString();
        const dotIndex = stringValue.indexOf('.');

        if (dotIndex !== -1 && stringValue.length - dotIndex > 6) {
          return parseFloat(params.value.toFixed(5));
        }

        return params.value;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 110,
      flex: 0.35,
      renderCell: (params: GridRenderCellParams) => (
        <Chip label={params.value} color={colorFromStatus(params.value)} />
      ),
    },
    {
      field: 'actions',
      headerName: '',
      type: 'actions',
      minWidth: 100,
      flex: 0.3,
      getActions: ({ row }) => {
        return [
          <Button
            variant="contained"
            sx={{ maxWidth: 90, minWidth: 50, flexGrow: 1 }}
            onClick={() => window.electron.shell.openExternal(row.link)}
            disabled={!(row.status === 'Created')}
          >
            Pay
          </Button>,
        ];
      },
    },
  ];

  return (
    <Box sx={{ width: 1 }}>
      <CustomDataGrid
        rows={state.invoices.map((invoice, index) => {
          return { ...invoice, index };
        })}
        columns={columns}
        apiRef={apiRef}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 15, 25]}
        autoHeight={Boolean(state.invoices.length)}
        disableColumnMenu
        slots={{
          noRowsOverlay: CustomNoRowsOverlay,
        }}
        slotProps={{
          noRowsOverlay: {
            header: 'No Invoices',
          },
        }}
        sx={{
          height: 400,
          '& .MuiDataGrid-actionsCell': {
            justifyContent: 'center',
            width: 1,
          },
        }}
      />
    </Box>
  );
}
