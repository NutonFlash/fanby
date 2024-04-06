import { GridRenderEditCellParams } from '@mui/x-data-grid';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import ErrorIcon from '@mui/icons-material/Error';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import Tooltip from '@mui/material/Tooltip';
import Account from '../../../models/Account';
import { useAppContext } from '../../../contexts/AppContext';

const MIN_USERNAME_LENGTH = 5;
const MAX_USERNAME_LENGTH = 15;

export function validateUsername(newUsername: string, accounts: Account[]) {
  const match = newUsername.match(/[A-Za-z0-9_]+/);
  if (newUsername.length === 0) {
    return "Field can't be empty.";
  }
  if (newUsername.length < MIN_USERNAME_LENGTH) {
    return `Username must be at least ${MIN_USERNAME_LENGTH} characters.`;
  }
  if (newUsername.length > MAX_USERNAME_LENGTH) {
    return `Username must be shorter than ${MAX_USERNAME_LENGTH} characters.`;
  }
  if (!match || match[0].length !== newUsername.length) {
    return "Username can only contain letters, numbers and '_'";
  }
  if (newUsername.match(`[0-9]{${newUsername.length}}`)) {
    return 'Username must contain at least one non-number character.';
  }
  if (accounts.filter((account) => account.username === newUsername).length) {
    return 'This username is already added in the system.';
  }
  return '';
}

interface UsernameEditProps extends GridRenderEditCellParams {
  setNewValue: Dispatch<SetStateAction<any>>;
  setHasChanged: Dispatch<SetStateAction<boolean>>;
}

export default function UsernameEdit(props: UsernameEditProps) {
  const { id, value, hasFocus, setNewValue, setHasChanged } = props;

  const context = useAppContext();
  const { accounts } = context.state;

  const ref = useRef<HTMLInputElement>();

  const [username, setUsername] = useState(value);
  const [error, setError] = useState(
    validateUsername(
      value,
      accounts.filter((account) => account.id !== id),
    ),
  );

  const [characterCounter, setCharacterCounter] = useState(value.length);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setError(
      validateUsername(
        newValue,
        accounts.filter((account) => account.id !== id),
      ),
    );
    setCharacterCounter(newValue.length);
    setUsername(newValue);

    setNewValue(newValue);
    setHasChanged(true);
  };

  useLayoutEffect(() => {
    if (hasFocus && ref.current) {
      ref.current.focus();
    }
  }, [hasFocus, ref]);

  return (
    <Input
      value={username}
      onChange={handleChange}
      spellCheck="false"
      inputRef={ref}
      sx={{
        width: 1,
        '& .MuiInput-input': {
          pr: error ? 0 : 0.35,
        },
      }}
      inputProps={{
        maxLength: MAX_USERNAME_LENGTH,
        sx: {
          p: 1,
        },
      }}
      disableUnderline
      endAdornment={
        error ? (
          <Tooltip title={error} placement="right" arrow>
            <InputAdornment position="end" sx={{ mr: 0.75, ml: 0.5 }}>
              <ErrorIcon
                fontSize="small"
                color="error"
                sx={{ cursor: 'pointer' }}
              />
            </InputAdornment>
          </Tooltip>
        ) : (
          <InputAdornment position="end" sx={{ mr: 0.75, ml: 0.5 }}>
            {`${characterCounter}/${MAX_USERNAME_LENGTH}`}
          </InputAdornment>
        )
      }
    />
  );
}
