import TextField from '@mui/material/TextField';
import { Dispatch, SetStateAction, ChangeEvent } from 'react';

interface RequiredRetweetsInputProps {
  requiredRetweets: string;
  setRequiredRetweets: Dispatch<SetStateAction<string>>;
  requiredRetweetsError: string;
  setRequiredRetweetsError: Dispatch<SetStateAction<string>>;
}

const MAX_REQUIRED_RETWEETS = 10;

function validateRequiredRetweets(requiredRetweets: string) {
  const regex = '\\d+';
  const match = requiredRetweets.match(regex);
  if (match && match[0] === requiredRetweets) {
    if (Number.parseInt(requiredRetweets, 10) > MAX_REQUIRED_RETWEETS) {
      return 'Usually the number of required retweets is no more than 10.';
    }
    return '';
  }

  return 'Value must be a number.';
}

export default function RequiredRetweetsInput(
  props: RequiredRetweetsInputProps,
) {
  const {
    requiredRetweets,
    setRequiredRetweets,
    requiredRetweetsError,
    setRequiredRetweetsError,
  } = props;

  const handleRequiredRetweetsChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = event.target.value;
    if (newValue.length === 0) {
      setRequiredRetweetsError('');
    } else {
      setRequiredRetweetsError(validateRequiredRetweets(newValue));
    }
    setRequiredRetweets(newValue);
  };

  return (
    <TextField
      required
      label="Required retweets"
      value={requiredRetweets}
      onChange={handleRequiredRetweetsChange}
      error={Boolean(requiredRetweetsError)}
      helperText={
        requiredRetweetsError ||
        'Look for the required retweets number in the group name.'
      }
      spellCheck="false"
      sx={{
        '& .MuiFormHelperText-root': {
          mt: '5px',
          lineHeight: 'normal',
        },
      }}
    />
  );
}
