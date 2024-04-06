import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import {
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridRowId,
  GridRowParams,
  GridRowSelectionModel,
  useGridApiRef,
} from '@mui/x-data-grid';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import { AlertColor } from '@mui/material/Alert';
import Account from '../../../models/Account';
import { useAppContext } from '../../../contexts/AppContext';
import { useAccountsContext } from '../../../contexts/AccountsContext';
import CustomDataGrid from '../CustomDataGrid';
import CustomNoRowsOverlay from '../CustomNoRowsOverlay';
import Toolbar from './Toolbar';
import AccountStatusChip from './AccountStatusChip';
import OpertionStateChip from './OperationStateChip';
import SwitchIos from './SwitchIos';

function chipFromDate(date: Date) {
  const secLeft = (date.getTime() - Date.now()) / 1000;
  const minsLeft = Math.floor(secLeft / 60);
  const hoursLeft = Math.floor(minsLeft / 60);
  const daysLeft = Math.floor(hoursLeft / 24);
  let label = `Expires in ${daysLeft} days`;
  let severity: 'error' | 'info' | 'warning' = 'info';

  if (daysLeft < 7) {
    severity = 'warning';
  }
  if (daysLeft === 1) {
    label = 'Expires tomorrow';
  }
  if (daysLeft < 1) {
    label = `Expires in ${hoursLeft} hours`;
    if (hoursLeft < 1) {
      label = `Expires in ${minsLeft} minutes`;
      if (minsLeft < 1) {
        label = 'Expires in a minute';
      }
    }
  }
  return <AccountStatusChip label={label} type={severity} />;
}

interface AccountsTableProps {
  setEditDialogOpen: Dispatch<SetStateAction<boolean>>;
  setEditAccount: Dispatch<SetStateAction<Account | null>>;
  setSnackbarOpen: Dispatch<SetStateAction<boolean>>;
  setSnackbarContent: Dispatch<SetStateAction<string>>;
  setSnackbarSeverity: Dispatch<SetStateAction<AlertColor>>;
}

export default function AccountsTable(props: AccountsTableProps) {
  const {
    setEditDialogOpen,
    setEditAccount,
    setSnackbarOpen,
    setSnackbarContent,
    setSnackbarSeverity,
  } = props;

  const appContext = useAppContext();
  const { apiService } = appContext.state;

  const accountsContext = useAccountsContext();
  const { state, dispatch } = accountsContext;

  const [loading, setLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    (async () => {
      if (!state.isLoaded) {
        setLoading(true);

        const result = await apiService.accounts.all(true, false);

        setLoading(false);

        if (result.type === 'success') {
          dispatch({
            type: 'set_accounts',
            data: result.data,
          });
          dispatch({ type: 'set_loaded', data: true });
        }
      }
    })();
  }, []);

  const apiRef = useGridApiRef();

  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const handleDeleteClick = (id: GridRowId) => async () => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));

    const result = await apiService.accounts.delete([id] as string[]);

    setLoadingStates((prev) => ({ ...prev, [id]: false }));

    if (result.type === 'success') {
      dispatch({
        type: 'delete_accounts',
        data: [id] as string[],
      });
      setSnackbarOpen(true);
      setSnackbarContent('Account has been deleted');
      setSnackbarSeverity('success');
    } else {
      setSnackbarOpen(true);
      setSnackbarContent(result.message);
      setSnackbarSeverity('error');
    }
  };

  const handleEditClick = (rowId: GridRowId) => () => {
    setEditAccount(() => {
      const foundAcc = state.accounts.filter(
        (account) => account.id === rowId,
      )[0];
      return foundAcc;
    });
    setEditDialogOpen(true);
  };

  const handleRowSelection = (rowSelectionModel: GridRowSelectionModel) => {
    setSelectedRows(rowSelectionModel);
  };

  const columns: GridColDef[] = [
    {
      field: 'index',
      width: 60,
      headerName: '№',
      renderCell(params) {
        return params.row.index + 1;
      },
    },
    {
      field: 'username',
      headerName: 'Account',
      headerAlign: 'center',
      minWidth: 150,
      flex: 0.2,
      valueFormatter(params) {
        return `@${params.value}`;
      },
    },
    {
      field: 'retweetsToday',
      renderHeader: () => (
        <Tooltip
          title="Retweets Today"
          placement="bottom"
          arrow
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 0],
                  },
                },
              ],
            },
          }}
        >
          <span
            style={{
              textWrap: 'wrap',
              lineHeight: 'normal',
              textAlign: 'center',
            }}
          >
            Retweets Today
          </span>
        </Tooltip>
      ),
      align: 'center',
      width: 100,
    },
    {
      field: 'groupNumber',
      headerName: 'Groups',
      headerAlign: 'center',
      width: 100,
      align: 'center',
    },
    {
      field: 'isActivated',
      headerName: 'Status',
      width: 215,
      renderCell(params: GridRenderCellParams) {
        if (params.value) {
          return chipFromDate(params.row.expirationDate);
        }
        return <AccountStatusChip label="Not Activated" type="error" />;
      },
    },
    {
      field: 'isRunning',
      headerName: 'Script Running',
      headerAlign: 'center',
      align: 'center',
      width: 125,
      renderCell(params: GridRenderCellParams) {
        return <SwitchIos disabled={!params.row.isActivated} />;
      },
    },
    {
      field: 'statusLabel',
      headerAlign: 'center',
      renderHeader: () => (
        <Tooltip
          title="Operation State"
          placement="bottom"
          arrow
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 0],
                  },
                },
              ],
            },
          }}
        >
          <span
            style={{
              textWrap: 'wrap',
              lineHeight: 'normal',
              textAlign: 'center',
            }}
          >
            Operation State
          </span>
        </Tooltip>
      ),
      align: 'center',
      renderCell: (params) => {
        const { value, row } = params;
        return <OpertionStateChip label={value} type={row.statusType} />;
      },
      minWidth: 120,
      flex: 0.25,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      type: 'actions',
      getActions: (params: GridRowParams) => {
        const { id } = params;

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          loadingStates[id] ? (
            <CircularProgress size={20} />
          ) : (
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />
          ),
        ];
      },
    },
  ];

  return (
    <Box sx={{ width: 1 }}>
      <CustomDataGrid
        rows={state.accounts.map((account: Account, index: number) => {
          return { index, ...account };
        })}
        columns={columns}
        onRowSelectionModelChange={handleRowSelection}
        rowSelectionModel={selectedRows}
        apiRef={apiRef}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        loading={loading}
        checkboxSelection
        autoHeight={Boolean(state.accounts.length)}
        sx={{ height: 400 }}
        slots={{
          noRowsOverlay: CustomNoRowsOverlay,
          toolbar: Toolbar,
        }}
        slotProps={{
          noRowsOverlay: {
            header: 'No Accounts',
          },
          toolbar: {
            selectedRows,
            setSnackbarOpen,
            setSnackbarContent,
            setSnackbarSeverity,
          },
        }}
      />
    </Box>
  );
}
