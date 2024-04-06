import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Account from '../../../../models/Account';
import GroupSelect from '../GroupSelect';
import ProxySelect from '../ProxySelect';
import MessageInput, { MessageRow } from '../MessageInput';
import UsernameInput from '../UsernameInput';
import PasswordInput from '../PasswordInput';
import { RowsType, AccountRow } from '../../../../types/Row';
import { generateUniqueId } from '../../../../utils';
import Message from '../../../../models/Message';
import { useAppContext } from '../../../../contexts/AppContext';
import Converter from '../../../../models/Converter';

export interface AccountManagementDialogProps {
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  editAccount: Account | null;
  setAccountRows: Dispatch<SetStateAction<RowsType>>;
}

export default function AccountManagementDialog(
  props: AccountManagementDialogProps,
) {
  const {
    dialogOpen: isDialogOpen,
    setDialogOpen: setIsDialogOpen,
    editAccount,
    title,
    setAccountRows,
  } = props;

  const context = useAppContext();
  const { state, dispatch } = context;

  const { groups, proxies } = state;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [proxy, setProxy] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [messageRows, setMessageRows] = useState<MessageRow[]>([]);

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState('');

  const mapFieldsValue = () => {
    setUsername(editAccount?.username || '');
    setPassword(editAccount?.password || '');
    setProxy(editAccount?.proxy?.toString() || '');
    setSelectedGroups(editAccount?.groups || []);
    setMessageRows(
      editAccount
        ? editAccount.messages.map((message, index) => {
            return { ...message, index };
          })
        : [],
    );
  };

  const clearFields = () => {
    setUsername('');
    setPassword('');
    setProxy('');
    setSelectedGroups([]);
    setMessageRows([]);

    setUsernameError('');
    setPasswordError('');

    setSnackbarOpen(false);
    setSnackbarContent('');
  };

  const handleDialogSave = () => {
    if (!username || !password) {
      setSnackbarContent('Enter username and password');
      setSnackbarOpen(true);
    } else if (usernameError || passwordError) {
      setSnackbarContent('Filled fields contain errors');
      setSnackbarOpen(true);
    } else {
      const id = editAccount ? editAccount.id : generateUniqueId();

      const chosenProxy =
        proxies.find((proxyItem) => proxyItem.toString() === proxy) || null;

      const addedMessages = messageRows.map(
        (messageRow) => new Message(generateUniqueId(), messageRow.content),
      );

      setAccountRows((prevRows) => {
        if (editAccount) {
          const newRows = [...prevRows];
          const editRow: AccountRow = newRows.filter(
            (row) => row.id === id,
          )[0] as AccountRow;

          const oldGroups = editRow.groups;
          const oldUsername = editRow.username;

          editRow.proxy = chosenProxy;
          editRow.groups = selectedGroups;
          editRow.messages = addedMessages;
          editRow.username = username;
          editRow.password = password;

          dispatch({
            type: 'set_account',
            data: Converter.fromAccountRow(editRow),
          });

          const addedGroups = selectedGroups.filter(
            (groupId) => !oldGroups.includes(groupId),
          );
          const deletedGroups = oldGroups.filter(
            (groupId) => !selectedGroups.includes(groupId),
          );
          const unchangedGroups = selectedGroups.filter(
            (groupId) =>
              !addedGroups.includes(groupId) &&
              !deletedGroups.includes(groupId),
          );

          addedGroups.forEach((groupId) => {
            const group = groups.filter(
              (_group) => _group.groupId === groupId,
            )[0];
            group.usedBy.push(editRow.username);
            dispatch({ type: 'set_group', data: group });
          });
          deletedGroups.forEach((groupId) => {
            const group = groups.filter(
              (_group) => _group.groupId === groupId,
            )[0];
            const index = group.usedBy.indexOf(oldUsername);
            group.usedBy.splice(index, 1);
            dispatch({ type: 'set_group', data: group });
          });
          unchangedGroups.forEach((groupId) => {
            const group = groups.filter(
              (_group) => _group.groupId === groupId,
            )[0];
            const index = group.usedBy.indexOf(oldUsername);
            group.usedBy[index] = editRow.username;
            dispatch({ type: 'set_group', data: group });
          });

          return newRows;
        }

        const newRow: AccountRow = {
          index: prevRows.length,
          id,
          proxy: chosenProxy,
          groups: selectedGroups,
          messages: addedMessages,
          username,
          password,
          messageNumber: 0,
          retweetNumber: 0,
        };

        dispatch({
          type: 'add_account',
          data: Converter.fromAccountRow(newRow),
        });

        selectedGroups.forEach((groupId) => {
          const group = groups.filter(
            (_group) => _group.groupId === groupId,
          )[0];
          group.usedBy.push(newRow.username);
          dispatch({ type: 'set_group', data: group });
        });

        return [...prevRows, newRow];
      });

      setIsDialogOpen(false);
    }
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
    <Dialog
      fullScreen
      open={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
      TransitionProps={{
        onEnter: mapFieldsValue,
        onExited: clearFields,
      }}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setIsDialogOpen(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {title}
          </Typography>
          <Button color="inherit" variant="outlined" onClick={handleDialogSave}>
            SAVE
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="form"
        autoComplete="off"
        sx={{
          mx: 5,
          my: 3,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Grid container>
            <Grid sm={6}>
              <Stack spacing={3}>
                <UsernameInput
                  username={username}
                  setUsername={setUsername}
                  usernameError={usernameError}
                  setUsernameError={setUsernameError}
                  editAccount={editAccount}
                />
                <PasswordInput
                  password={password}
                  setPassword={setPassword}
                  passwordError={passwordError}
                  setPasswordError={setPasswordError}
                />
              </Stack>
            </Grid>
            <Grid sm={6}>
              <Stack spacing={3}>
                <ProxySelect
                  proxy={proxy}
                  setProxy={setProxy}
                  proxies={proxies}
                />
                <GroupSelect
                  selectedGroups={selectedGroups}
                  setSelectedGroups={setSelectedGroups}
                  groups={groups}
                />
              </Stack>
            </Grid>
          </Grid>
        </Box>
        <Stack>
          <Box sx={{ width: 1 }}>
            <MessageInput
              messageRows={messageRows}
              setMessageRows={setMessageRows}
            />
          </Box>
        </Stack>
      </Box>
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
    </Dialog>
  );
}
