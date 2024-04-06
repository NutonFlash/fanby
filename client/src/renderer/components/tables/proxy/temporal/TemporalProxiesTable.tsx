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
import { Dispatch, SetStateAction, useState } from 'react';
import Box from '@mui/material/Box';
import CustomNoRowsOverlay from '../../CustomNoRowsOverlay';
import Toolbar from './Toolbar';
import HostEdit, { validateHost } from '../HostEdit';
import PortEdit, { validatePort } from '../PortEdit';
import UsernameEdit, { validateUsername } from '../UsernameEdit';
import PasswordEdit, { validatePassword } from '../PasswordEdit';
import { useProxiesContext } from '../../../../contexts/ProxiesContext';
import Proxy from '../../../../models/Proxy';
import CustomDataGrid from '../../CustomDataGrid';

interface TemporalProxiesTableProps {
  addedProxies: Proxy[];
  setAddedProxies: Dispatch<SetStateAction<Proxy[]>>;
}

export default function TemporalProxiesTable(props: TemporalProxiesTableProps) {
  const { addedProxies, setAddedProxies } = props;

  const apiRef = useGridApiRef();

  const proxiesContext = useProxiesContext();
  const { state } = proxiesContext;

  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const [oldValue, setOldValue] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isChanged, setIsChanged] = useState(false);

  const handleDeleteClick = (id: GridRowId) => async () => {
    setAddedProxies((prev) => prev.filter((proxy) => proxy.id !== id));
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

  const handleEditStop = (params: GridCellEditStopParams) => {
    const { id, field: rawField, row } = params;
    const field = rawField as ProxyKey;

    if (!isChanged) {
      return;
    }

    const editedProxy = Proxy.deserialize(row);
    const allProxies = [
      ...addedProxies.filter((proxy) => proxy.id !== id),
      ...state.proxies,
    ];

    const isValid = !fieldValidation[field as FieldValidationKey](
      newValue.toString(),
      editedProxy as Proxy,
      allProxies,
    );

    if (isValid) {
      apiRef.current.setEditCellValue({ id, field, value: newValue });
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
      renderEditCell: (params: GridRenderEditCellParams) => (
        <HostEdit
          {...params}
          addedProxies={addedProxies}
          setNewValue={setNewValue}
          setIsChanged={setIsChanged}
        />
      ),
    },
    {
      field: 'port',
      headerName: 'Port',
      width: 120,
      editable: true,
      renderEditCell: (params: GridRenderEditCellParams) => (
        <PortEdit
          {...params}
          addedProxies={addedProxies}
          setNewValue={setNewValue}
          setIsChanged={setIsChanged}
        />
      ),
    },
    {
      field: 'username',
      headerName: 'Username',
      minWidth: 150,
      flex: 0.35,
      editable: true,
      renderEditCell: (params: GridRenderEditCellParams) => (
        <UsernameEdit
          {...params}
          addedProxies={addedProxies}
          setNewValue={setNewValue}
          setIsChanged={setIsChanged}
        />
      ),
    },
    {
      field: 'password',
      headerName: 'Password',
      minWidth: 150,
      flex: 0.35,
      editable: true,
      renderEditCell: (params: GridRenderEditCellParams) => (
        <PasswordEdit
          {...params}
          addedProxies={addedProxies}
          setNewValue={setNewValue}
          setIsChanged={setIsChanged}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 100,
      type: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box sx={{ width: 1 }}>
      <CustomDataGrid
        rows={addedProxies.map((proxy, index) => {
          return { ...proxy, index };
        })}
        columns={columns}
        onCellEditStart={handleEditStart}
        onCellEditStop={handleEditStop}
        onRowSelectionModelChange={handleRowSelection}
        rowSelectionModel={selectedRows}
        apiRef={apiRef}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 15, 25]}
        autoHeight={Boolean(addedProxies.length)}
        checkboxSelection
        slots={{
          noRowsOverlay: CustomNoRowsOverlay,
          toolbar: Toolbar,
        }}
        slotProps={{
          toolbar: {
            selectedRows,
            setAddedProxies,
          },
          noRowsOverlay: {
            header: 'No Proxies',
          },
        }}
        sx={{ height: 400 }}
      />
    </Box>
  );
}
