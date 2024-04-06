import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import {
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridSlotsComponentsProps,
  GridRowSelectionModel,
} from '@mui/x-data-grid';
import { Dispatch, SetStateAction } from 'react';
import Proxy from '../../../../models/Proxy';

declare module '@mui/x-data-grid' {
  export interface ToolbarPropsOverrides {
    selectedRows: GridRowSelectionModel;
    setAddedProxies: Dispatch<SetStateAction<Proxy[]>>;
  }
}

export default function Toolbar(
  props: NonNullable<GridSlotsComponentsProps['toolbar']>,
) {
  const { selectedRows = [], setAddedProxies = () => {} } = props;

  const handleDelete = async () => {
    setAddedProxies((prev) =>
      prev.filter((proxy) => !selectedRows.includes(proxy.id)),
    );
  };

  return (
    <GridToolbarContainer sx={{ m: 1 }}>
      <Grid container spacing={2}>
        <Grid>
          <GridToolbarFilterButton sx={{ height: 30 }} />
        </Grid>
        <Grid>
          <Button
            variant="contained"
            color="error"
            disabled={Boolean(!selectedRows.length)}
            onClick={handleDelete}
            sx={{ height: 30 }}
          >
            Delete
          </Button>
        </Grid>
      </Grid>
    </GridToolbarContainer>
  );
}
