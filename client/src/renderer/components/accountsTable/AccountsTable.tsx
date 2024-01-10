import * as React from 'react';
import { useState } from 'react';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowId,
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import AccountProxy from '../../Classes/AccountProxy';
import Account from '../../Classes/Account';

const proxies: AccountProxy[] = [
  new AccountProxy('1', 'example.com', 80),
  new AccountProxy('2', 'check.com', 23, 'lox', 'passlox'),
  new AccountProxy('3', 'doiki.com', 323, 'lox', 'passlox'),
  new AccountProxy('4', 'proxu.com', 8080),
];

const accounts: Account[] = [];
for (let i = 0; i < 20; i += 1) {
  accounts.push(
    new Account(
      `${i + 1}`,
      'nutonflash',
      'Sahalox2',
      proxies[Math.floor(Math.random() * (proxies.length - 1))],
    ),
  );
}

const initialRows = accounts.map(
  ({ id, username, password, proxy, messageNumber, retweetNumber }, index) => {
    return {
      id,
      index,
      username,
      password,
      proxy,
      messages: messageNumber,
      retweets: retweetNumber,
    };
  },
);

function FullScreenDialog(props: object) {
  const { isDialogOpen, setIsDialogOpen, editAccount } = props;

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <Dialog fullScreen open={isDialogOpen} onClose={handleClose}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Edit account
          </Typography>
          <Button autoFocus color="inherit" onClick={handleClose}>
            save
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="form" autoComplete="off">
        <TextField label="Usernsme" value={editAccount.username} />
        <TextField label="Password" value={editAccount.password} />
        <Select label="Proxy" value={editAccount.proxy.toString()}>
          {proxies.map((proxy) => (
            <MenuItem>{proxy.toString()}</MenuItem>
          ))}
        </Select>
      </Box>
    </Dialog>
  );
}

export default function AccountsTable() {
  const [rows, setRows] = useState(initialRows);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editAccount, setEditAccount] = useState(new Account('0'));

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleEditClick = (id: GridRowId) => () => {
    setEditAccount(rows.filter((row) => row.id === id)[0]);
    setIsDialogOpen(true);
  };

  const columns: GridColDef[] = [
    { field: 'index', headerName: '№', width: 80 },
    { field: 'username', headerName: 'Username', width: 100, editable: true },
    { field: 'password', headerName: 'Password', width: 100, editable: true },
    {
      field: 'proxy',
      headerName: 'Proxy',
      width: 200,
      editable: true,
      type: 'singleSelect',
      valueOptions: proxies.map((proxy) => proxy.toString()),
    },
    {
      field: 'messages',
      headerName: 'Messages',
      width: 80,
      align: 'center',
    },
    {
      field: 'retweets',
      headerName: 'Retweets',
      width: 80,
      align: 'center',
    },
    {
      field: 'actions',
      width: 100,
      type: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
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
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
      <FullScreenDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        editAccount={editAccount}
      />
    </div>
  );
}
