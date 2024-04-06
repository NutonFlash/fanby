import TextField from '@mui/material/TextField';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';

interface EmailInputProps {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  emailError: string;
  setEmailError: Dispatch<SetStateAction<string>>;
}

function validateEmail(newEmail: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const match = newEmail.match(regex);
  if (!match || match[0] !== newEmail) {
    return 'Please enter a valid email.';
  }
  return '';
}

export default function EmailInput(props: EmailInputProps) {
  const { email, setEmail, emailError, setEmailError } = props;

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (!newValue) {
      setEmailError('');
    } else {
      setEmailError(validateEmail(newValue));
    }
    setEmail(newValue);
  };

  return (
    <TextField
      required
      label="Email"
      value={email}
      onChange={handleEmailChange}
      error={Boolean(emailError)}
      helperText={emailError}
      spellCheck="false"
      inputProps={{
        autoComplete: 'on',
      }}
    />
  );
}
