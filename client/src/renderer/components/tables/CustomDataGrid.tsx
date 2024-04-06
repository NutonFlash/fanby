import { DataGrid, DataGridProps } from '@mui/x-data-grid';

interface CustomDataGridProps extends DataGridProps {}

export default function CustomDataGrid(props: CustomDataGridProps) {
  const { slotProps, sx, ...rest } = props;

  return (
    <DataGrid
      disableColumnMenu
      disableRowSelectionOnClick
      showCellVerticalBorder
      showColumnVerticalBorder
      slotProps={{
        baseTooltip: {
          placement: 'bottom',
          arrow: true,
          slotProps: {
            popper: {
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, -20],
                  },
                },
              ],
            },
          },
        },
        ...slotProps,
      }}
      sx={{
        ...sx,
        '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within':
          {
            outline: 'none',
          },
      }}
      {...rest}
    />
  );
}
