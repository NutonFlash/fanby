import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {
  GridActionsCellItem,
  GridColDef,
  GridRenderEditCellParams,
  GridCellEditStopParams,
  useGridApiRef,
  GridRowId,
  GridRowSelectionModel,
  GridCellEditStartParams,
} from '@mui/x-data-grid';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { AlertColor } from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import CustomNoRowsOverlay from '../../CustomNoRowsOverlay';
import Toolbar from './Toolbar';
import HostEdit, { validateHost } from '../HostEdit';
import PortEdit, { validatePort } from '../PortEdit';
import UsernameEdit, { validateUsername } from '../UsernameEdit';
import PasswordEdit, { validatePassword } from '../PasswordEdit';
import { useProxiesContext } from '../../../../contexts/ProxiesContext';
import CustomDataGrid from '../../CustomDataGrid';
import { useAppContext } from '../../../../contexts/AppContext';
import Proxy from '../../../../models/Proxy';
import RowStyle from './RowStyle';
import CustomCell from './CustomCell';

interface MainProxiesTableProps {
  setSnackbarOpen: Dispatch<SetStateAction<boolean>>;
  setSnackbarContent: Dispatch<SetStateAction<string>>;
  setSnackbarSeverity: Dispatch<SetStateAction<AlertColor>>;
}

export default function MainProxiesTable(props: MainProxiesTableProps) {
  const { setSnackbarOpen, setSnackbarContent, setSnackbarSeverity } = props;

  const apiRef = useGridApiRef();

  const appContext = useAppContext();
  const proxiesContext = useProxiesContext();

  const { apiService, socketService } = appContext.state;
  const { state, dispatch } = proxiesContext;

  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const [linearProgressValue, setLinearProgressValue] = useState(0);

  const [loading, setLoading] = useState(false);
  const [loadingDeteteBtn, setLoadingDeleteBtn] = useState<
    Record<string, boolean>
  >({});
  const [loadingCells, setLoadingCells] = useState<Record<string, boolean>>({});

  const [oldValue, setOldValue] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isChanged, setIsChanged] = useState(false);

  const [highlightedProxies, setHighlightedProxies] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    (async () => {
      if (!state.isLoaded) {
        setLoading(true);

        const result = await apiService.proxies.all();

        setLoading(false);

        if (result.type === 'success') {
          dispatch({
            type: 'set_proxies',
            data: result.data,
          });
          dispatch({ type: 'set_loaded', data: true });
        }
      }
    })();

    socketService.on('proxy_info', (data) => {
      setHighlightedProxies((prev) => ({
        ...prev,
        [data.proxyId]: data.info.status,
      }));
      setTimeout(() => {
        setHighlightedProxies((prev) => {
          const newHighlightedProxies = { ...prev };
          delete newHighlightedProxies[data.proxyId];
          return newHighlightedProxies;
        });
      }, 20000);

      setLinearProgressValue(data.progress < 99 ? data.progress : 0);
    });

    return () => {
      socketService.off('proxy_info');
    };
  }, []);

  const handleDeleteClick = (id: GridRowId) => async () => {
    setLoadingDeleteBtn((prev) => ({ ...prev, [id]: true }));

    const result = await apiService.proxies.delete([id] as string[]);

    setLoadingDeleteBtn((prev) => ({ ...prev, [id]: false }));

    if (result.type === 'success') {
      dispatch({
        type: 'delete_proxies',
        data: [id],
      });
      setSnackbarOpen(true);
      setSnackbarContent('Proxy has been deleted');
      setSnackbarSeverity('success');
    } else {
      setSnackbarOpen(true);
      setSnackbarContent(result.message);
      setSnackbarSeverity('error');
    }
  };

  type FieldValidationKey = 'host' | 'port' | 'username' | 'password';

  const fieldValidation = {
    host: validateHost,
    port: validatePort,
    username: validateUsername,
    password: validatePassword,
  };

  type ProxyKey = keyof Proxy;

  const handleEditStart = (params: GridCellEditStartParams) => {
    setOldValue(params.value.toString());
  };

  const handleEditStop = async (params: GridCellEditStopParams) => {
    const { id, field: rawField, row } = params;
    const field = rawField as ProxyKey;

    if (!isChanged) {
      return;
    }

    const editedProxy = Proxy.deserialize(row);

    const isValid = !fieldValidation[field as FieldValidationKey](
      newValue.toString(),
      editedProxy,
      state.proxies.filter((proxy) => proxy.id !== id),
    );

    if (isValid) {
      setLoadingCells((prev) => ({ ...prev, [`${id}-${field}`]: true }));

      const result = await apiService.proxies.update(id as string, {
        [field]: newValue,
      });

      setLoadingCells((prev) => {
        const newLoadingCells = { ...prev };
        delete newLoadingCells[`${id}-${field}`];
        return newLoadingCells;
      });

      if (result.type === 'success') {
        dispatch({
          type: 'update_proxy',
          data: {
            ...editedProxy,
            [field]: newValue,
          },
        });
        apiRef.current.setEditCellValue({ id, field, value: newValue });
      } else {
        apiRef.current.setEditCellValue({ id, field, value: oldValue });
        setSnackbarOpen(true);
        setSnackbarContent(result.message);
        setSnackbarSeverity('error');
      }
    } else {
      apiRef.current.setEditCellValue({ id, field, value: oldValue });
    }

    setNewValue('');
    setIsChanged(false);
  };

  const handleRowSelection = (rowSelectionModel: GridRowSelectionModel) => {
    setSelectedRows(rowSelectionModel);
  };

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
      field: 'host',
      headerName: 'Host',
      minWidth: 120,
      flex: 0.3,
      editable: true,
      renderCell(params) {
        if (loadingCells[`${params.id}-${params.field}`]) {
          return (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width={1}
            >
              <CircularProgress size={23} />
            </Box>
          );
        }
        return <CustomCell {...params} />;
      },
      renderEditCell: (params: GridRenderEditCellParams) => {
        return (
          <HostEdit
            {...params}
            setNewValue={setNewValue}
            setIsChanged={setIsChanged}
          />
        );
      },
    },
    {
      field: 'port',
      headerName: 'Port',
      width: 120,
      editable: true,
      renderCell(params) {
        if (loadingCells[`${params.id}-${params.field}`]) {
          return (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width={1}
            >
              <CircularProgress size={23} />
            </Box>
          );
        }
        return <CustomCell {...params} />;
      },
      renderEditCell: (params: GridRenderEditCellParams) => {
        return (
          <PortEdit
            {...params}
            setNewValue={setNewValue}
            setIsChanged={setIsChanged}
          />
        );
      },
    },
    {
      field: 'username',
      headerName: 'Username',
      minWidth: 150,
      flex: 0.35,
      editable: true,
      renderCell(params) {
        if (loadingCells[`${params.id}-${params.field}`]) {
          return (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width={1}
            >
              <CircularProgress size={23} />
            </Box>
          );
        }
        return <CustomCell {...params} />;
      },
      renderEditCell: (params: GridRenderEditCellParams) => {
        return (
          <UsernameEdit
            {...params}
            setNewValue={setNewValue}
            setIsChanged={setIsChanged}
          />
        );
      },
    },
    {
      field: 'password',
      headerName: 'Password',
      minWidth: 150,
      flex: 0.35,
      editable: true,
      renderCell(params) {
        if (loadingCells[`${params.id}-${params.field}`]) {
          return (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width={1}
            >
              <CircularProgress size={23} />
            </Box>
          );
        }
        return <CustomCell {...params} />;
      },
      renderEditCell: (params: GridRenderEditCellParams) => {
        return (
          <PasswordEdit
            {...params}
            setNewValue={setNewValue}
            setIsChanged={setIsChanged}
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 100,
      type: 'actions',
      getActions: ({ id }) => {
        return [
          loadingDeteteBtn[id] ? (
            <CircularProgress size={23} />
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

  const theme = useTheme();

  return (
    <Box sx={{ width: 1 }}>
      <CustomDataGrid
        rows={state.proxies.map((proxy, index) => {
          return { ...proxy, index };
        })}
        columns={columns}
        onCellEditStart={handleEditStart}
        onCellEditStop={handleEditStop}
        onRowSelectionModelChange={handleRowSelection}
        rowSelectionModel={selectedRows}
        apiRef={apiRef}
        loading={loading}
        getRowClassName={(params) =>
          highlightedProxies[params.id]
            ? `super-app-theme--${highlightedProxies[params.id]}`
            : ''
        }
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 15, 25]}
        autoHeight={Boolean(state.proxies.length)}
        checkboxSelection
        slots={{
          noRowsOverlay: CustomNoRowsOverlay,
          toolbar: Toolbar,
        }}
        slotProps={{
          toolbar: {
            selectedRows,
            linearProgressValue,
            setSnackbarOpen,
            setSnackbarContent,
            setSnackbarSeverity,
          },
          noRowsOverlay: {
            header: 'No Proxies',
          },
        }}
        sx={RowStyle(theme)}
      />
    </Box>
  );
}
