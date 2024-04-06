import {
  GridActionsCellItem,
  GridCellEditStopParams,
  GridColDef,
  GridRenderCellParams,
  GridRenderEditCellParams,
  GridRowId,
  useGridApiRef,
} from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import ErrorIcon from '@mui/icons-material/Error';
import RequiredRetweetsEdit, {
  validateRequiredRetweets,
} from '../../../tables/group/RequiredRetweetsEdit';
import { GroupRow, RowsType } from '../../../../types/Row';
import { useAppContext } from '../../../../contexts/AppContext';
import Group from '../../../../models/Group';
import Converter from '../../../../models/Converter';

interface UploadedGroupsTableProps {
  groupRows: RowsType;
  setGroupRows: Dispatch<SetStateAction<RowsType>>;
  setDuplicationError: Dispatch<SetStateAction<boolean>>;
}

function validateGroup(
  newGroup: Group,
  groups: Group[],
  uploadedGroups: Group[],
) {
  if (groups.filter((group) => group.groupId === newGroup.groupId).length) {
    return 'Group is already added in the sysytem.';
  }
  if (
    uploadedGroups.filter((group) => group.groupId === newGroup.groupId)
      .length > 1
  ) {
    return 'Duplicated group.';
  }
  return '';
}

export default function UploadedGroupsTable(props: UploadedGroupsTableProps) {
  const { groupRows, setGroupRows, setDuplicationError } = props;

  const context = useAppContext();
  const { groups } = context.state;

  const apiRef = useGridApiRef();

  const [newValue, setNewValue] = useState('');
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    const uploadedGroups = groupRows.map((groupRow) =>
      Converter.fromGroupRow(groupRow as GroupRow),
    );
    setDuplicationError(
      uploadedGroups
        .map((groupRow) =>
          Boolean(
            validateGroup(
              Converter.fromGroupRow(groupRow as GroupRow),
              groups,
              uploadedGroups,
            ),
          ),
        )
        .includes(true),
    );
  }, [groupRows, groups, setDuplicationError]);

  const handleEditStop = (params: GridCellEditStopParams) => {
    const { id, field, value } = params;

    if (!hasChanged) {
      setNewValue('');
      setHasChanged(false);
      return;
    }

    const editedGroupRow = groupRows.filter(
      (group) => group.id === (id as string),
    )[0] as GroupRow;

    if (field === 'requiredRetweets') {
      if (validateRequiredRetweets(newValue as string)) {
        apiRef.current.setEditCellValue({ id, field, value });
      } else {
        apiRef.current.setEditCellValue({ id, field, value: newValue });
        editedGroupRow.requiredRetweets = Number.parseInt(newValue, 10);
      }
    }

    setNewValue('');
    setHasChanged(false);
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setGroupRows((prevRows) => {
      const deleteRow = prevRows.filter((row) => row.id === id)[0];
      const newRows = prevRows.slice(0, deleteRow.index);
      for (let i = deleteRow.index + 1; i < prevRows.length; i += 1) {
        prevRows[i].index = i - 1;
        newRows.push(prevRows[i]);
      }
      return newRows;
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: '№',
      width: 80,
      renderCell(params) {
        return params.row.index + 1;
      },
      disableColumnMenu: true,
    },
    {
      field: 'groupId',
      headerName: 'Id',
      minWidth: 180,
      flex: 0.7,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        const error = validateGroup(
          Converter.fromGroupRow(params.row),
          groups,
          groupRows.map((groupRow) =>
            Converter.fromGroupRow(groupRow as GroupRow),
          ),
        );
        const errorIcon = error ? (
          <Tooltip title={error} placement="right" arrow>
            <ErrorIcon
              fontSize="small"
              color="error"
              sx={{ cursor: 'pointer' }}
            />
          </Tooltip>
        ) : null;
        return (
          <Box
            sx={{
              width: 1,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {params.value}
            {errorIcon}
          </Box>
        );
      },
    },
    {
      field: 'requiredRetweets',
      headerName: 'Required retweets',
      width: 120,
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
      renderEditCell: (params: GridRenderEditCellParams) => (
        <RequiredRetweetsEdit
          {...params}
          setNewValue={setNewValue}
          setHasChanged={setHasChanged}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 100,
      flex: 0.3,
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
      <DataGrid
        rows={groupRows}
        columns={columns}
        onCellEditStop={handleEditStop}
        apiRef={apiRef}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 15, 25, 50, 100]}
        autoHeight
        disableRowSelectionOnClick
        showCellVerticalBorder
        showColumnVerticalBorder
        slotProps={{
          baseTooltip: {
            placement: 'bottom',
            arrow: true,
            slotProps: {
              popper: {
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, -10],
                    },
                  },
                ],
              },
            },
          },
        }}
        sx={{
          height: 400,
          visibility: !groupRows.length ? 'hidden' : 'visible',
          '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within':
            {
              outline: 'none',
            },
        }}
      />
    </Box>
  );
}
