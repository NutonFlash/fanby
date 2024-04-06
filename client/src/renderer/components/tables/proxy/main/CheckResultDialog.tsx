import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import { Dispatch, SetStateAction, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

export interface CheckResult {
  fastProxies: {
    label: string;
    ids: string[];
  };
  mediumProxies: {
    label: string;
    ids: string[];
  };
  slowProxies: {
    label: string;
    ids: string[];
  };
  notWorkingPorxies: {
    label: string;
    ids: string[];
  };
}

export const initCheckResult: CheckResult = {
  fastProxies: {
    label: 'High speed proxies',
    ids: [],
  },
  mediumProxies: {
    label: 'Medium speed proxies',
    ids: [],
  },
  slowProxies: {
    label: 'Low speed proxies',
    ids: [],
  },
  notWorkingPorxies: {
    label: 'Not working proxies',
    ids: [],
  },
};

type SelectValue = 'None' | 'Recheck' | 'Delete';
const selectValues: SelectValue[] = ['None', 'Recheck', 'Delete'];

interface ResultRowProps {
  label: string;
  count: number;
  value: SelectValue;
  onChange: (event: SelectChangeEvent) => void;
}

function ResultRow(props: ResultRowProps) {
  const { label, count, value, onChange } = props;
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-evenly"
      width={1}
    >
      <Box width={200}>
        <Typography fontSize={18}>{label}</Typography>
      </Box>
      <Box width={35} display="flex" justifyContent="center" sx={{ px: 2 }}>
        <Typography fontSize={18}>{count}</Typography>
      </Box>
      <Box width={170}>
        <Select
          value={value}
          onChange={onChange}
          disabled={count === 0}
          sx={{ height: 35, width: 145 }}
        >
          {selectValues.map((_value) => (
            <MenuItem key={_value} value={_value}>
              {_value}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
}

interface CheckResultDialogProps {
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  checkResult: CheckResult;
  handleCheck: (ids: string[]) => void;
  handleDelete: (ids: string[]) => void;
}

export default function CheckResultDialog(props: CheckResultDialogProps) {
  const { dialogOpen, setDialogOpen, checkResult, handleCheck, handleDelete } =
    props;

  const [selectValueStates, setSelectValueStates] = useState<SelectValue[]>(
    Object.keys(checkResult).map(() => selectValues[0]),
  );

  const handleSelectChange = (index: number, value: SelectValue) => {
    setSelectValueStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = value;
      return newStates;
    });
  };

  const handleContineClick = () => {
    let deleteIds: string[] = [];
    let recheckIds: string[] = [];

    selectValueStates.forEach((value, index) => {
      const { ids } =
        checkResult[Object.keys(checkResult)[index] as keyof CheckResult];
      if (value === 'Recheck') {
        recheckIds = [...recheckIds, ...ids];
      } else if (value === 'Delete') {
        deleteIds = [...recheckIds, ...ids];
      }
    });

    if (recheckIds.length > 0) {
      handleCheck(recheckIds);
    }
    if (deleteIds.length > 0) {
      handleDelete(deleteIds);
    }

    setDialogOpen(false);
  };

  const clearFields = () => {
    setSelectValueStates(Object.keys(checkResult).map(() => selectValues[0]));
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      onTransitionExited={clearFields}
      fullWidth
      maxWidth="sm"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" width={1} sx={{ px: 4, py: 2 }}>
          Check results
        </Typography>
        <IconButton
          onClick={() => setDialogOpen(false)}
          sx={{
            mx: 2,
            color: (theme) => theme.palette.grey[700],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box
        sx={{
          py: 2,
          px: 4,
        }}
      >
        <Alert severity="warning" sx={{ width: 'fit-content', fontSize: 16 }}>
          Warning: Using a <b>slow proxies</b> can reduce application
          performance.
        </Alert>
        <Box
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          rowGap={3}
          sx={{ py: 3 }}
        >
          {Object.keys(checkResult).map((key, index) => (
            <ResultRow
              key={key}
              label={checkResult[key as keyof CheckResult].label}
              count={checkResult[key as keyof CheckResult].ids.length}
              value={selectValueStates[index]}
              onChange={(event: SelectChangeEvent) =>
                handleSelectChange(index, event.target.value as SelectValue)
              }
            />
          ))}
        </Box>
        <Box display="flex" justifyContent="center" sx={{ pb: 2 }}>
          <Button
            variant="contained"
            sx={{ fontSize: 16 }}
            onClick={handleContineClick}
          >
            Continue
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
