import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 127;

function validatePassword(newPassword: string) {
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

interface PasswordInputProps {
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  passwordError: string;
  setPasswordError: Dispatch<SetStateAction<string>>;
}

export default function PasswordInput(props: PasswordInputProps) {
  const { password, setPassword, passwordError, setPasswordError } = props;

  const [isVisible, setIsVisible] = useState(false);

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (!newValue) {
      setPasswordError('');
    } else {
      setPasswordError(validatePassword(newValue));
    }
    setPassword(newValue);
  };

  return (
    <TextField
      required
      label="Password"
      value={password}
      onChange={handlePasswordChange}
      error={Boolean(passwordError)}
      helperText={passwordError}
      spellCheck="false"
      InputProps={{
        type: isVisible ? 'text' : 'password',
        autoComplete: 'on',
        endAdornment: (
          <InputAdornment
            position="end"
            sx={{ mr: 0.75, ml: 0.5 }}
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? (
              <VisibilityIcon sx={{ cursor: 'pointer' }} />
            ) : (
              <VisibilityOffIcon sx={{ cursor: 'pointer' }} />
            )}
          </InputAdornment>
        ),
      }}
    />
  );
}
