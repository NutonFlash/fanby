import { GridRenderEditCellParams } from '@mui/x-data-grid';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import ErrorIcon from '@mui/icons-material/Error';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import Tooltip from '@mui/material/Tooltip';

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 127;

export function validatePassword(newPassword: string) {
  if (newPassword.length === 0) {
    return "Field can't be empty.";
  }
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (newPassword.length > MAX_PASSWORD_LENGTH) {
    return `Your password needs to be less than ${
      MAX_PASSWORD_LENGTH + 1
    } characters. Please enter a shorter one.`;
  }
  return '';
}

interface PasswordEditProps extends GridRenderEditCellParams {
  setNewValue: Dispatch<SetStateAction<any>>;
  setHasChanged: Dispatch<SetStateAction<boolean>>;
}

export default function PasswordEdit(props: PasswordEditProps) {
  const { value, hasFocus, setNewValue, setHasChanged } = props;

  const ref = useRef<HTMLInputElement>();

  const [password, setPassword] = useState(value);
  const [error, setError] = useState(validatePassword(value));

  const [characterCounter, setCharacterCounter] = useState(0);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setError(validatePassword(newValue));
    setPassword(newValue);

    setNewValue(newValue);
    setHasChanged(true);
  };

  useLayoutEffect(() => {
    if (hasFocus && ref.current) {
      ref.current.focus();
    }
  }, [hasFocus, ref]);

  useEffect(() => {
    setCharacterCounter(password.length);
  }, [password]);

  return (
    <Input
      value={password}
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
        maxLength: MAX_PASSWORD_LENGTH,
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
            {`${characterCounter}/${MAX_PASSWORD_LENGTH}`}
          </InputAdornment>
        )
      }
    />
  );
}
