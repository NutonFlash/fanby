import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from 'react';
import GroupsTable from '../components/tables/group/GroupsTable';
import AddGroupDialog from '../components/dialogs/group/add/AddGroupDialog';
import { RowsType } from '../types/Row';
import UploadGroupsDialog from '../components/dialogs/group/upload/UploadGroupsDialog';
import { useAppContext } from '../contexts/AppContext';

export default function GroupsPage() {
  // const [addGroupDialogOpen, setAddGroupDialogOpen] = useState(false);
  // const [uploadGroupsDialogOpen, setUploadGroupsDialogOpen] = useState(false);

  return (
    <Box m={2}>
      <GroupsTable />
      {/* <Grid container gap={2} sx={{ mt: 2 }}>
        <Grid>
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={() => {
              setAddGroupDialogOpen(true);
            }}
          >
            Add group
          </Button>
        </Grid>
        <Grid>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={() => setUploadGroupsDialogOpen(true)}
          >
            Batch upload
          </Button>
        </Grid>
      </Grid>
      <AddGroupDialog
        dialogOpen={addGroupDialogOpen}
        setDialogOpen={setAddGroupDialogOpen}
        setGroupRows={setGroupRows}
      />
      <UploadGroupsDialog
        isDialogOpen={uploadGroupsDialogOpen}
        setIsDialogOpen={setUploadGroupsDialogOpen}
        setGroupRows={setGroupRows}
      /> */}
    </Box>
  );
}
