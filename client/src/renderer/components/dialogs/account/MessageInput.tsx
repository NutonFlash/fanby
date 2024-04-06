import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
  useState,
  useRef,
  Dispatch,
  SetStateAction,
  ChangeEvent,
  useEffect,
} from 'react';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from '@mui/x-data-grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Modal from '@mui/material/Modal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CustomNoRowsOverlay from '../../tables/CustomNoRowsOverlay';
import Message from '../../../models/Message';
import { generateUniqueId } from '../../../utils';

export interface MessageRow extends Message {
  index: number;
}

const MAX_MESSAGE_LENGTH = 10000;

function validateMessage(message: string) {
  if (message.length > 10000) {
    return `Message is too long. It can be up to ${MAX_MESSAGE_LENGTH} characters.`;
  }
  return '';
}

interface MessageInputProps {
  messageRows: MessageRow[];
  setMessageRows: Dispatch<SetStateAction<MessageRow[]>>;
}

export default function MessageInput(props: MessageInputProps) {
  const { messageRows, setMessageRows } = props;

  const [dialogTitle, setDialogTitle] = useState('');

  const [message, setMessage] = useState('');
  const [messageError, setMessageError] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState('');

  const [openModal, setOpenModal] = useState(false);

  const messageId = useRef<string>('');

  const handleOpenModal = () => {
    setOpenModal(true);
    setDialogTitle('Add message');
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    messageId.current = '';
    setMessage('');
    setMessageError('');
    setSnackbarContent('');
    setSnackbarOpen(false);
  };

  const handleSave = () => {
    if (message && !messageError) {
      if (messageId.current) {
        setMessageRows((prevRows) => {
          return prevRows.map((row) => {
            if (row.id === messageId.current) {
              row.content = message;
            }
            return row;
          });
        });
      } else {
        setMessageRows((prevRows) => [
          ...prevRows,
          {
            index: prevRows.length,
            id: generateUniqueId(),
            content: message,
          },
        ]);
      }
      handleCloseModal();
    } else {
      if (!message) {
        setSnackbarContent('Message is empty');
      } else {
        setSnackbarContent('Message is too long');
      }
      setSnackbarOpen(true);
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    const editRow = messageRows.filter((row) => row.id === id)[0];
    setMessage(editRow?.content || '');
    messageId.current = id as string;
    setDialogTitle('Edit message');
    setOpenModal(true);
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setMessageRows((prevRows) => {
      const deleteRow = prevRows.filter((row) => row.id === id)[0];
      const newRows = prevRows.slice(0, deleteRow.index);
      for (let i = deleteRow.index + 1; i < prevRows.length; i += 1) {
        prevRows[i].index = i - 1;
        newRows.push(prevRows[i]);
      }
      return newRows;
    });
  };

  const onMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (newValue.length === 0) {
      setMessageError('');
    } else {
      setMessageError(validateMessage(newValue));
    }
    setMessage(newValue);
  };

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: '№',
      headerAlign: 'center',
      align: 'center',
      width: 100,
      disableColumnMenu: true,
      renderCell(params) {
        return params.row.index + 1;
      },
    },
    {
      field: 'content',
      headerName: 'Message',
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      disableColumnMenu: true,
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

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 2 / 3,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    borderRadius: 1,
    pt: 2,
    px: 4,
    pb: 3,
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (snackbarOpen) {
      timeoutId = setTimeout(() => {
        setSnackbarOpen(false);
      }, 6000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [snackbarOpen, setSnackbarOpen]);

  return (
    <Box sx={{ height: 'auto' }}>
      <Typography variant="body1" mb={1}>
        Messages:
      </Typography>
      <DataGrid
        rows={messageRows}
        columns={columns}
        isRowSelectable={() => false}
        isCellEditable={() => false}
        autoPageSize
        showCellVerticalBorder
        showColumnVerticalBorder
        slots={{ noRowsOverlay: CustomNoRowsOverlay }}
        slotProps={{
          noRowsOverlay: {
            header: 'No Messages',
          },
        }}
        sx={{
          height: 266,
          '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within':
            {
              outline: 'none',
            },
        }}
      />
      <Button
        variant="contained"
        startIcon={<AddCircleIcon />}
        onClick={handleOpenModal}
        sx={{ mt: 1.5 }}
      >
        Add message
      </Button>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6">{dialogTitle}</Typography>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { my: 2, width: 1 },
            }}
            autoComplete="off"
          >
            <TextField
              label="Message"
              variant="outlined"
              value={message}
              onChange={onMessageChange}
              multiline
              minRows={3}
              maxRows={15}
              sx={{ my: 2, width: 1, typography: 'body2' }}
              error={Boolean(messageError)}
              helperText={messageError}
            />
          </Box>
          <Button
            variant="outlined"
            onClick={handleCloseModal}
            sx={{ float: 'left' }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={handleSave}
            sx={{ float: 'right' }}
          >
            Save
          </Button>
          <Snackbar
            open={snackbarOpen}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity="error"
              sx={{ width: '100%' }}
            >
              {snackbarContent}
            </Alert>
          </Snackbar>
        </Box>
      </Modal>
    </Box>
  );
}
