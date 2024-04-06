import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import { GridColDef } from '@mui/x-data-grid';

interface Rate {
  quantity: number;
  price: number;
}

const rateList: Rate[] = [
  {
    quantity: 1,
    price: 100,
  },
  {
    quantity: 5,
    price: 95,
  },
  {
    quantity: 15,
    price: 85,
  },
  {
    quantity: 25,
    price: 70,
  },
  {
    quantity: 50,
    price: 50,
  },
];

export function calculateOrderPrice(quantity: number) {
  for (let i = 0; i < rateList.length - 1; i += 1) {
    if (quantity < rateList[i + 1].quantity) {
      return quantity * rateList[i].price;
    }
  }
  return quantity * rateList[rateList.length - 1].price;
}

export function calculateDiscount(quantity: number) {
  const retailPrice = rateList[0].price;
  return quantity * retailPrice - calculateOrderPrice(quantity);
}

export default function PriceList() {
  const columns: GridColDef[] = [
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 0.6,
      sortable: false,
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 0.4,
      sortable: false,
      renderCell: ({ value }) => {
        return `${value}$`;
      },
    },
  ];

  return (
    <Paper elevation={3}>
      <Box p={1} pb={0}>
        <Typography fontSize={16} fontWeight={600} pb={1}>
          Price List
        </Typography>
        <Divider sx={{ opacity: 1, borderColor: 'rgba(0, 0, 0, 0.35)' }} />

        <DataGrid
          rows={rateList.map((rate, index) => {
            return { id: index, ...rate };
          })}
          columns={columns}
          hideFooter
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          disableRowSelectionOnClick
          sx={{
            borderRadius: 0,
            borderColor: 'white',
            '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within':
              {
                outline: 'none',
              },
            '& .MuiDataGrid-row:hover, .MuiDataGrid-row.Mui-hovered': {
              backgroundColor: 'inherit',
            },
            '& .MuiDataGrid-iconSeparator': {
              visibility: 'hidden',
            },
          }}
        />
      </Box>
    </Paper>
  );
}
