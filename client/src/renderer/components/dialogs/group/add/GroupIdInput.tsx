import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { Dispatch, SetStateAction, ChangeEvent, useState } from 'react';
import Group from '../../../../models/Group';
import { useAppContext } from '../../../../contexts/AppContext';

interface GroupIdInputProps {
  groupId: string;
  setGroupId: Dispatch<SetStateAction<string>>;
  groupIdError: string;
  setGroupIdError: Dispatch<SetStateAction<string>>;
}

const GROUP_ID_LENGTH = 19;

function validateGroupId(groupId: string, groups: Group[]) {
  const regex = `\\d{${GROUP_ID_LENGTH}}`;
  const match = groupId.match(regex);
  if (!match || match[0] !== groupId) {
    return 'Group ID must be a 19-digit number.';
  }
  if (groups.filter((group) => group.groupId === groupId).length) {
    return 'This group is already added in the system.';
  }
  return '';
}

export default function GroupIdInput(props: GroupIdInputProps) {
  const { groupId, setGroupId, groupIdError, setGroupIdError } = props;

  const context = useAppContext();
  const { groups } = context.state;

  const [characterCounter, setCharacterCounter] = useState(0);

  const handleGropIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (newValue.length === 0) {
      setGroupIdError('');
    } else {
      setGroupIdError(validateGroupId(newValue, groups));
    }
    setGroupId(newValue);
    setCharacterCounter(newValue.length);
  };

  return (
    <TextField
      required
      label="Group Id"
      value={groupId}
      onChange={handleGropIdChange}
      error={Boolean(groupIdError)}
      helperText={
        groupIdError ||
        `Last ${GROUP_ID_LENGTH} numbers in address bar of the opened group.`
      }
      spellCheck="false"
      InputProps={{
        inputProps: {
          maxLength: GROUP_ID_LENGTH,
        },
        endAdornment: (
          <InputAdornment position="end" sx={{ mr: 0.75, ml: 0.5 }}>
            {`${characterCounter}/${GROUP_ID_LENGTH}`}
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiFormHelperText-root': {
          mt: '5px',
          lineHeight: 'normal',
        },
      }}
    />
  );
}
