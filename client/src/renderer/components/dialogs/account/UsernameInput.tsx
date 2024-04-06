import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { SxProps, Theme } from '@mui/material';
import Account from '../../../models/Account';
import { useAppContext } from '../../../contexts/AppContext';

interface UsernameInputProps {
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
  usernameError: string;
  setUsernameError: Dispatch<SetStateAction<string>>;
  editAccount?: Account | null;
  sx?: SxProps<Theme>;
}

const MIN_USERNAME_LENGTH = 5;
const MAX_USERNAME_LENGTH = 15;

function validateUsername(newUsername: string) {
  const match = newUsername.match(/[A-Za-z0-9_]+/);
  if (newUsername.length < MIN_USERNAME_LENGTH) {
    return `Username must be at least ${MIN_USERNAME_LENGTH} characters.`;
  }
  if (newUsername.length > MAX_USERNAME_LENGTH) {
    return `Username must be shorter than ${MAX_USERNAME_LENGTH} characters.`;
  }
  if (!match || match[0] !== newUsername) {
    return "Username can only contain letters, numbers and '_'";
  }
  if (newUsername.match(`[0-9]{${newUsername.length}}`)) {
    return 'Username must contain at least one non-number character.';
  }
  return '';
}

export default function UsernameInput(props: UsernameInputProps) {
  const {
    username,
    setUsername,
    usernameError,
    setUsernameError,
    editAccount,
    sx,
  } = props;

  const [characterCounter, setCharacterCounter] = useState(username.length);

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (!newValue) {
      setUsernameError('');
    } else {
      setUsernameError(validateUsername(newValue));
    }
    setUsername(newValue);
  };

  useEffect(() => {
    setCharacterCounter(username.length);
  }, [username]);

  return (
    <TextField
      required
      label="Username"
      value={username}
      onChange={handleUsernameChange}
      error={Boolean(usernameError)}
      helperText={usernameError}
      spellCheck="false"
      InputProps={{
        inputProps: {
          maxLength: MAX_USERNAME_LENGTH,
        },
        startAdornment: <InputAdornment position="start">@</InputAdornment>,
        endAdornment: (
          <InputAdornment position="end" sx={{ mr: 0.75, ml: 0.5 }}>
            {`${characterCounter}/${MAX_USERNAME_LENGTH}`}
          </InputAdornment>
        ),
      }}
      sx={sx}
    />
  );
}

UsernameInput.defaultProps = {
  editAccount: null,
  sx: {},
};
