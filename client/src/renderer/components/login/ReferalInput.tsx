import TextField from '@mui/material/TextField';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';

interface ReferalInputProps {
  referalCode: string;
  setReferalCode: Dispatch<SetStateAction<string>>;
  referalCodeError: string;
  setReferalCodeError: Dispatch<SetStateAction<string>>;
}

function validateReferalCode(newReferalCode: string) {
  return '';
}

export default function ReferalInput(props: ReferalInputProps) {
  const { referalCode, setReferalCode, referalCodeError, setReferalCodeError } =
    props;

  const handleReferalCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (!newValue) {
      setReferalCodeError('');
    } else {
      setReferalCodeError(validateReferalCode(newValue));
    }
    setReferalCode(newValue);
  };

  return (
    <TextField
      label="Referal code"
      value={referalCode}
      onChange={handleReferalCodeChange}
      error={Boolean(referalCodeError)}
      helperText={referalCodeError}
      spellCheck="false"
    />
  );
}
