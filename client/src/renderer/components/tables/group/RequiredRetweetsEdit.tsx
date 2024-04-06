import { GridRenderEditCellParams } from '@mui/x-data-grid';
import {
  useLayoutEffect,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from 'react';
import ErrorIcon from '@mui/icons-material/Error';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import Tooltip from '@mui/material/Tooltip';

const MAX_REQUIRED_RETWEETS = 10;

export function validateRequiredRetweets(requiredRetweets: string) {
  const regex = '\\d+';
  const match = requiredRetweets.match(regex);
  if (requiredRetweets.length === 0) {
    return "Field can't be empty.";
  }
  if (match && match[0] === requiredRetweets) {
    if (Number.parseInt(requiredRetweets, 10) > MAX_REQUIRED_RETWEETS) {
      return 'Usually the number of required retweets is no more than 10.';
    }
    return '';
  }

  return 'Value must be a number.';
}

interface RequiredRetweetsEditProps extends GridRenderEditCellParams {
  setNewValue: Dispatch<SetStateAction<any>>;
  setHasChanged: Dispatch<SetStateAction<boolean>>;
}

export default function RequiredRetweetsEdit(props: RequiredRetweetsEditProps) {
  const { value, hasFocus, setNewValue, setHasChanged } = props;

  const ref = useRef<HTMLInputElement>();

  const [requiredRetweets, setRequiredRetweets] = useState(value);
  const [error, setError] = useState(
    validateRequiredRetweets(value.toString()),
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setRequiredRetweets(newValue);
    setError(validateRequiredRetweets(newValue));

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
      value={requiredRetweets}
      onChange={handleChange}
      spellCheck="false"
      inputRef={ref}
      sx={{
        width: 1,
        '& .MuiInput-input': {
          ml: error ? 1 : 1,
          mr: error ? 0 : 1,
        },
      }}
      inputProps={{
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
        ) : null
      }
    />
  );
}
