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
import LinearProgress, {
  LinearProgressProps,
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useAppContext } from '../../../../contexts/AppContext';
import { useProxiesContext } from '../../../../contexts/ProxiesContext';
import CheckResultDialog, {
  CheckResult,
  initCheckResult,
} from './CheckResultDialog';

declare module '@mui/x-data-grid' {
  export interface ToolbarPropsOverrides {
    selectedRows: GridRowSelectionModel;
    linearProgressValue: number;
    setSnackbarOpen: Dispatch<SetStateAction<boolean>>;
    setSnackbarContent: Dispatch<SetStateAction<string>>;
    setSnackbarSeverity: Dispatch<SetStateAction<AlertColor>>;
  }
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#1a90ff',
  },
}));

function LinearProgressWithLabel({
  value,
  ...otherProps
}: LinearProgressProps & { value: number }) {
  return (
    <Box
      sx={{
        display: value > 0 ? 'flex' : 'none',
        alignItems: 'center',
        width: 1,
      }}
    >
      <Box sx={{ width: 1, mr: 1 }}>
        <BorderLinearProgress {...otherProps} value={value} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ visibility: value > 0 ? 'visible' : 'hidden' }}
        >{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function CustomToolbar(
  props: NonNullable<GridSlotsComponentsProps['toolbar']>,
) {
  const {
    selectedRows = [],
    setSnackbarOpen = () => {},
    setSnackbarContent = () => {},
    setSnackbarSeverity = () => {},
    linearProgressValue = 0,
  } = props;

  const appContext = useAppContext();
  const proxiesContext = useProxiesContext();

  const { apiService } = appContext.state;
  const { dispatch } = proxiesContext;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [checkResult, setCheckResult] = useState<CheckResult>(initCheckResult);

  const [checkLoading, setCheckLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleCheck = async (ids: string[]) => {
    setCheckLoading(true);

    const result = await apiService.proxies.check(ids);

    setCheckLoading(false);

    if (result.type === 'success') {
      setCheckResult(result.data);
      setDialogOpen(true);
    } else {
      setSnackbarOpen(true);
      setSnackbarContent(result.message);
      setSnackbarSeverity('error');
    }
  };

  const handleDelete = async (ids: string[]) => {
    setDeleteLoading(true);

    const result = await apiService.proxies.delete(ids);

    setDeleteLoading(false);

    if (result.type === 'success') {
      dispatch({
        type: 'delete_proxies',
        data: ids,
      });
      setSnackbarOpen(true);
      if (selectedRows.length === 1) {
        setSnackbarContent('Proxy has been deleted');
      } else {
        setSnackbarContent('Proxies have been deleted');
      }
      setSnackbarSeverity('success');
    } else {
      setSnackbarOpen(true);
      setSnackbarContent(result.message);
      setSnackbarSeverity('error');
    }
  };

  return (
    <>
      <GridToolbarContainer sx={{ m: 1 }}>
        <Grid container spacing={2}>
          <Grid>
            <GridToolbarFilterButton sx={{ height: 30 }} />
          </Grid>
          <Grid>
            <Button
              variant="contained"
              disabled={Boolean(!selectedRows.length)}
              onClick={() => handleCheck(selectedRows as string[])}
              sx={{ height: 30 }}
            >
              {checkLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                'Check'
              )}
            </Button>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              color="error"
              disabled={Boolean(!selectedRows.length)}
              onClick={() => handleDelete(selectedRows as string[])}
              sx={{ height: 30 }}
            >
              {deleteLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                'Delete'
              )}
            </Button>
          </Grid>
        </Grid>
        <LinearProgressWithLabel
          variant="determinate"
          value={linearProgressValue}
        />
      </GridToolbarContainer>
      <CheckResultDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        checkResult={checkResult}
        handleCheck={handleCheck}
        handleDelete={handleDelete}
      />
    </>
  );
}
