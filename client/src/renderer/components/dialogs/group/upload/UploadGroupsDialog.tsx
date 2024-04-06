import Dialog from '@mui/material/Dialog';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { styled } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Group from '../../../../models/Group';
import { generateUniqueId } from '../../../utils';
import UploadedGroupsTable from './UploadedGroupsTable';
import { GroupRow, RowsType } from '../../../../types/Row';
import { useAppContext } from '../../../../contexts/AppContext';
import Converter from '../../../../models/Converter';

interface UploadGroupsDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
  setGroupRows: Dispatch<SetStateAction<RowsType>>;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  width: 1,
});

const GROUP_ID_LENGTH = 19;
const MAX_REQUIRED_RETWEETS = 10;

function parseGroupFile(file: File): Promise<Group[]> {
  const groups: Group[] = [];

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (!event.target) throw new Error("Can't read selected file");

        let fileContent = event.target.result as string;
        fileContent = fileContent.trim();

        if (!fileContent) throw new Error('File is empty');

        const lines = fileContent.split('\n');

        lines.forEach((lineItem, index) => {
          const line = lineItem.trim();

          if (line.split(',').length !== 2)
            throw new Error(`Invalid format on ${index + 1} line`);

          const [groupId, requiredRetweets] = line.split(',', 2);

          const groupIdRegex = `\\d{${GROUP_ID_LENGTH}}`;
          const groupIdMatch = groupId.match(groupIdRegex);

          if (!(groupIdMatch && groupIdMatch[0] === groupId))
            throw new Error(`Invalid group id on ${index + 1} line`);

          const requiredRetweetsRegex = `\\d+`;
          const requiredRetweetsMatch = requiredRetweets.match(
            requiredRetweetsRegex,
          );

          if (
            requiredRetweetsMatch &&
            requiredRetweetsMatch[0] === requiredRetweets
          ) {
            if (Number.parseInt(requiredRetweets, 10) > MAX_REQUIRED_RETWEETS) {
              throw new Error(
                `Too big number of required retweets on ${index + 1} line`,
              );
            }
          } else {
            throw new Error(
              `Invalid required retweets number on ${index + 1} line`,
            );
          }

          groups.push(
            new Group(
              generateUniqueId(),
              groupId,
              Number.parseInt(requiredRetweets, 10),
            ),
          );
        });
        resolve(groups);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => {
      reject(new Error("Can't read selected file"));
    };
    reader.readAsText(file);
  });
}

export default function UploadGroupsDialog(props: UploadGroupsDialogProps) {
  const { isDialogOpen, setIsDialogOpen, setGroupRows } = props;

  const context = useAppContext();
  const { dispatch } = context;

  const [addedGroups, setAddedGroups] = useState<RowsType>([]);

  const [duplicationError, setDuplicationError] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState('');

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length) {
      try {
        const uploadedGroups = await parseGroupFile(event.target.files[0]);
        setAddedGroups(
          uploadedGroups.map((group, index) => {
            return { index, ...group };
          }),
        );
      } catch (error) {
        setSnackbarOpen(true);
        setSnackbarContent((error as Error).message);
      }
    }
    event.target.value = '';
  };

  const handleSave = () => {
    if (!addedGroups.length) {
      setSnackbarContent('Upload the file with groups');
      setSnackbarOpen(true);
      return;
    }
    if (duplicationError) {
      setSnackbarContent('Duplicated groups was found');
      setSnackbarOpen(true);
      return;
    }
    setGroupRows((prevRows) => {
      const newRows = [...prevRows];
      addedGroups.forEach((group) => {
        const newGroup = { ...group };
        newGroup.index = newRows.length;
        newRows.push(newGroup);

        dispatch({
          type: 'add_group',
          data: Converter.fromGroupRow(newGroup as GroupRow),
        });
      });

      return newRows;
    });
    setAddedGroups([]);
    setIsDialogOpen(false);
  };

  const clearFields = () => {
    setAddedGroups([]);
    setDuplicationError(false);
    setSnackbarOpen(false);
    setSnackbarContent('');
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
      open={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
      TransitionProps={{
        onExited: clearFields,
      }}
      fullWidth
      maxWidth="md"
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
            Batch upload
          </Typography>
          <Button color="inherit" variant="outlined" onClick={handleSave}>
            SAVE
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ py: 3, px: 5 }}>
        <Box>
          <Typography>
            Please upload a text file with groups in the following format:
          </Typography>
          <Typography
            sx={{
              my: 1,
              ml: 1,
              py: 1,
              px: 2,
              boxShadow: '2px 2px 4px -2px rgba(0,0,0,0.58)',
              border: 'grey solid 1px',
              borderRadius: 2,
              width: 'fit-content',
            }}
          >
            <code>
              1234567891234567890, 2
              <br />
              1234567891234567891, 5
              <br />
              1234567891234567892, 4
            </code>
          </Typography>
          <Typography>
            Ensure your file has the extension <code>.txt</code> or{' '}
            <code>.csv</code> and <code>UTF-8</code> encoding.
          </Typography>
        </Box>
        <Button
          variant="contained"
          component="label"
          endIcon={<AttachFileIcon />}
          sx={{ mt: 1 }}
        >
          Select file
          <VisuallyHiddenInput type="file" onChange={handleFileSelect} />
        </Button>
        <Box sx={{ mt: 2 }}>
          <UploadedGroupsTable
            groupRows={addedGroups}
            setGroupRows={setAddedGroups}
            setDuplicationError={setDuplicationError}
          />
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
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
