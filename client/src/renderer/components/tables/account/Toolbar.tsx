import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import {
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridSlotsComponentsProps,
  GridRowSelectionModel,
} from '@mui/x-data-grid';
import { Dispatch, SetStateAction, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { AlertColor } from '@mui/material/Alert';
import { useAccountsContext } from '../../../contexts/AccountsContext';
import { useAppContext } from '../../../contexts/AppContext';

declare module '@mui/x-data-grid' {
  export interface ToolbarPropsOverrides {
    selectedRows: GridRowSelectionModel;
    setSnackbarOpen: Dispatch<SetStateAction<boolean>>;
    setSnackbarContent: Dispatch<SetStateAction<string>>;
    setSnackbarSeverity: Dispatch<SetStateAction<AlertColor>>;
  }
}

export default function Toolbar(
  props: NonNullable<GridSlotsComponentsProps['toolbar']>,
) {
  const {
    selectedRows = [],
    setSnackbarOpen = () => {},
    setSnackbarContent = () => {},
    setSnackbarSeverity = () => {},
  } = props;

  const appContext = useAppContext();
  const accountsContext = useAccountsContext();

  const { apiService } = appContext.state;
  const { dispatch } = accountsContext;

  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    const result = await apiService.accounts.delete(selectedRows as string[]);

    setLoading(false);

    if (result.type === 'success') {
      dispatch({
        type: 'delete_accounts',
        data: selectedRows as string[],
      });
      setSnackbarOpen(true);
      if (selectedRows.length === 1) {
        setSnackbarContent('Account has been deleted');
      } else {
        setSnackbarContent('Accounts have been deleted');
      }
      setSnackbarSeverity('success');
    } else {
      setSnackbarOpen(true);
      setSnackbarContent(result.message);
      setSnackbarSeverity('error');
    }
  };

  return (
    <GridToolbarContainer sx={{ m: 1 }}>
      <Grid container spacing={2}>
        <Grid>
          <GridToolbarFilterButton sx={{ height: 30 }} />
        </Grid>
        <Grid>
          <Button
            variant="contained"
            color="error"
            disabled={Boolean(!selectedRows.length)}
            onClick={handleDelete}
            sx={{ height: 30 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Delete'
            )}
          </Button>
        </Grid>
      </Grid>
    </GridToolbarContainer>
  );
}
