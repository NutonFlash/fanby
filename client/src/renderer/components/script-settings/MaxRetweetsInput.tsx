import Tooltip from '@mui/material/Tooltip';
import InputAdornment from '@mui/material/InputAdornment';
import ErrorIcon from '@mui/icons-material/Error';
import { ChangeEvent, useState } from 'react';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const MAX_RETWEETS = 100;

function validateMaxRetweets(maxRetweets: string) {
  const regex = '\\d+';
  const match = maxRetweets.match(regex);
  if (match && match[0] === maxRetweets) {
    if (Number.parseInt(maxRetweets) > MAX_RETWEETS) {
      return `Value should be no more than ${MAX_RETWEETS}.`;
    }
    if (Number.parseInt(maxRetweets) === 0) {
      return 'Value shoud be more than 0.';
    }
    return '';
  }
  return 'Value should be a number.';
}

export default function MaxRetweetsInput() {
  const [maxRetweets, setMaxRetweets] = useState('');
  const [maxRetweetsError, setMaxRetweetsError] = useState('');

  const theme = useTheme();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      setMaxRetweetsError('');
    } else {
      setMaxRetweetsError(validateMaxRetweets(event.target.value));
    }
    setMaxRetweets(event.target.value);
  };

  return (
    <Box>
      <Box sx={{ mb: 0.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: theme.palette.common.black,
          }}
        >
          <Typography fontSize="15px">Max retweets:</Typography>
          <Tooltip
            title="Number of retweets for one account that will be made before cooldown."
            placement="top-end"
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [10, -7],
                    },
                  },
                ],
              },
            }}
            arrow
          >
            <HelpOutlineIcon
              fontSize="small"
              sx={{ ml: 1, cursor: 'pointer' }}
            />
          </Tooltip>
        </Box>
      </Box>
      <TextField
        value={maxRetweets}
        onChange={handleChange}
        placeholder="1-100"
        sx={{
          '& .MuiOutlinedInput-input': {
            pl: maxRetweetsError ? 1 : 1,
            pr: maxRetweetsError ? 0 : 1,
          },
        }}
        InputProps={{
          endAdornment: maxRetweetsError ? (
            <Tooltip
              title={maxRetweetsError}
              placement="bottom-end"
              arrow
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, 10],
                      },
                    },
                  ],
                },
              }}
            >
              <InputAdornment position="end" sx={{ mr: 0.75, ml: 0.5 }}>
                <ErrorIcon
                  fontSize="small"
                  color="error"
                  sx={{ cursor: 'pointer' }}
                />
              </InputAdornment>
            </Tooltip>
          ) : null,
        }}
      />
    </Box>
  );
}
