import Grid from '@mui/material/Unstable_Grid2';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import GroupIdInput from './GroupIdInput';
import RequiredRetweetsInput from './RequiredRetweetsInput';
import CommentInput from './GroupCommentInput';
import { GroupRow, RowsType } from '../../../../types/Row';
import { generateUniqueId } from '../../../utils';
import { useAppContext } from '../../../../contexts/AppContext';
import Converter from '../../../../models/Converter';

interface AddGroupDialogProps {
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  setGroupRows: Dispatch<SetStateAction<RowsType>>;
}

export default function AddGroupDialog(props: AddGroupDialogProps) {
  const { dialogOpen, setDialogOpen, setGroupRows } = props;

  const context = useAppContext();
  const { dispatch } = context;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState('');

  const [groupId, setGroupId] = useState('');
  const [requiredRetweets, setRequiredRetweets] = useState('');
  const [comment, setComment] = useState('');

  const [groupIdError, setGroupIdError] = useState('');
  const [requiredRetweetsError, setRequiredRetweetsError] = useState('');
  const [groupCommentError, setGroupCommentError] = useState('');

  const clearFields = () => {
    setGroupId('');
    setRequiredRetweets('');
    setComment('');

    setGroupIdError('');
    setRequiredRetweetsError('');
    setGroupCommentError('');

    setSnackbarOpen(false);
    setSnackbarContent('');
  };

  const handleSave = () => {
    if (!groupId || !requiredRetweets) {
      setSnackbarContent('Enter group id and required retweets number');
      setSnackbarOpen(true);
    } else if (groupIdError || requiredRetweetsError || groupCommentError) {
      setSnackbarContent('Filled fields contain errors');
      setSnackbarOpen(true);
    } else {
      setGroupRows((prevRows) => {
        const newRows = [...prevRows];
        const newGroupRow: GroupRow = {
          index: newRows.length,
          id: generateUniqueId(),
          groupId,
          requiredRetweets: Number.parseInt(requiredRetweets, 10),
          comment,
          usedBy: [],
        };
        newRows.push(newGroupRow);

        dispatch({
          type: 'add_group',
          data: Converter.fromGroupRow(newGroupRow),
        });

        return newRows;
      });
      setDialogOpen(false);
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
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      onTransitionExited={clearFields}
      fullWidth
      maxWidth="sm"
    >
      <Box
        sx={{
          py: 2,
          px: 4,
        }}
      >
        <Typography variant="h6">Add group</Typography>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { width: 1 },
          }}
          autoComplete="off"
        >
          <Grid container spacing={2} mt={1}>
            <Grid xs={7}>
              <GroupIdInput
                groupId={groupId}
                setGroupId={setGroupId}
                groupIdError={groupIdError}
                setGroupIdError={setGroupIdError}
              />
            </Grid>
            <Grid xs={5}>
              <RequiredRetweetsInput
                requiredRetweets={requiredRetweets}
                setRequiredRetweets={setRequiredRetweets}
                requiredRetweetsError={requiredRetweetsError}
                setRequiredRetweetsError={setRequiredRetweetsError}
              />
            </Grid>
            <Grid xs={12}>
              <CommentInput
                comment={comment}
                setComment={setComment}
                groupCommentError={groupCommentError}
                setGroupCommentError={setGroupCommentError}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 1.5 }}>
            <Button
              variant="outlined"
              onClick={() => setDialogOpen(false)}
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
          </Box>
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
      </Box>
    </Dialog>
  );
}
