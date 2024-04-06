import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRenderEditCellParams,
  GridCellEditStopParams,
  useGridApiRef,
  GridRowId,
  GridRowSelectionModel,
} from '@mui/x-data-grid';
import { Dispatch, SetStateAction, useState } from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import RequiredRetweetsEdit, {
  validateRequiredRetweets,
} from './RequiredRetweetsEdit';
import UsedBySelect from './UsedBySelect';
import CustomNoRowsOverlay from '../CustomNoRowsOverlay';
import CustomToolbar from '../account/Toolbar';
import GroupCommentEdit, { validateGroupComment } from './GroupCommentEdit';
import Converter from '../../../models/Converter';
import { useGroupsContext } from '../../../contexts/GroupsContext';
import CustomDataGrid from '../CustomDataGrid';
import Group from '../../../models/Group';

export default function GroupsTable() {
  const apiRef = useGridApiRef();

  const groupsContext = useGroupsContext();

  const { state, dispatch } = groupsContext;

  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  // const handleDeleteClick = (id: GridRowId) => () => {
  //   const deleteRow = groupRows.filter((row) => row.id === id)[0];

  //   dispatch({
  //     type: 'delete_group',
  //     data: Converter.fromGroupRow(deleteRow as GroupRow),
  //   });

  //   setGroupRows((prevRows) => {
  //     const newRows = prevRows.slice(0, deleteRow.index);
  //     for (let i = deleteRow.index + 1; i < prevRows.length; i += 1) {
  //       prevRows[i].index = i - 1;
  //       newRows.push(prevRows[i]);
  //     }
  //     return newRows;
  //   });
  // };

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
      disableColumnMenu: true,
    },
    {
      field: 'groupId',
      headerName: 'Id',
      minWidth: 180,
      disableColumnMenu: true,
    },
    {
      field: 'requiredRetweets',
      headerName: 'Required retweets',
      width: 100,
      align: 'center',
      editable: true,
      disableColumnMenu: true,
      renderHeader: () => (
        <Tooltip
          title="Required retweets"
          placement="bottom"
          arrow
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 3],
                  },
                },
              ],
            },
          }}
        >
          <span
            style={{
              textAlign: 'center',
              lineHeight: 'normal',
              whiteSpace: 'normal',
            }}
          >
            Required retweets
          </span>
        </Tooltip>
      ),
      // renderEditCell: (params: GridRenderEditCellParams) => (
      //   <RequiredRetweetsEdit
      //     {...params}
      //     setNewValue={setNewValue}
      //     setHasChanged={setHasChanged}
      //   />
      // ),
    },
    {
      field: 'comment',
      headerName: 'Comment',
      minWidth: 150,
      flex: 0.6,
      editable: true,
      disableColumnMenu: true,
      // renderEditCell: (params: GridRenderEditCellParams) => (
      //   <GroupCommentEdit
      //     {...params}
      //     setNewValue={setNewValue}
      //     setHasChanged={setHasChanged}
      //   />
      // ),
    },
    {
      field: 'usedBy',
      headerName: 'Used by',
      minWidth: 150,
      flex: 0.4,
      editable: true,
      disableColumnMenu: true,
      valueFormatter: (params) => {
        return params.value.join(', ');
      },
      // renderEditCell: (params: GridRenderEditCellParams) => (
      //   <UsedBySelect
      //     {...params}
      //     setNewValue={setNewValue}
      //     setHasChanged={setHasChanged}
      //   />
      // ),
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
            // onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box sx={{ width: 1 }}>
      <CustomDataGrid
        rows={state.groups.map((group: Group, index: number) => {
          return { ...group, index };
        })}
        columns={columns}
        // onCellEditStop={handleEditStop}
        onRowSelectionModelChange={handleRowSelection}
        rowSelectionModel={selectedRows}
        apiRef={apiRef}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 15, 25, 50, 100]}
        autoHeight={Boolean(state.groups.length)}
        checkboxSelection
        sx={{
          height: 400,
        }}
        noRowsOverlayHeader="No Groups"
        toolbarProps={{
          selectedRows,
          type: 'groups',
          context: { state, dispatch },
        }}
      />
    </Box>
  );
}
