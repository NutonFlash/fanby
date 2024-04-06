import Tooltip from '@mui/material/Tooltip';
import InputAdornment from '@mui/material/InputAdornment';
import ErrorIcon from '@mui/icons-material/Error';
import { ChangeEvent, useState } from 'react';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const MAX_RETWEETS_MY = 10;

function validateRetweetsMy(retweetsMy: string) {
  const regex = '\\d+';
  const match = retweetsMy.match(regex);
  if (match && match[0] === retweetsMy) {
    if (Number.parseInt(retweetsMy) > MAX_RETWEETS_MY) {
      return `Value should be no more than ${MAX_RETWEETS_MY}.`;
    }
    if (Number.parseInt(retweetsMy) === 0) {
      return 'Value shoud be more than 0.';
    }
    return '';
  }
  return 'Value should be a number.';
}

export default function RetweetsMyInput() {
  const [retweetsMy, setRetweetsMy] = useState('');
  const [retweetsMyError, setRetweetsMyError] = useState('');

  const theme = useTheme();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      setRetweetsMyError('');
    } else {
      setRetweetsMyError(validateRetweetsMy(event.target.value));
    }
    setRetweetsMy(event.target.value);
  };

  return (
    <Box>
      <InputLabel sx={{ mb: 0.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: theme.palette.common.black,
          }}
        >
          <Typography fontSize="15px">Retweets my:</Typography>
          <Tooltip
            title="Number of retweets of the account's last posts that will be made before cooldown."
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
      </InputLabel>
      <TextField
        value={retweetsMy}
        onChange={handleChange}
        placeholder="1-10"
        sx={{
          '& .MuiOutlinedInput-input': {
            pl: retweetsMyError ? 1 : 1,
            pr: retweetsMyError ? 0 : 1,
          },
        }}
        InputProps={{
          endAdornment: retweetsMyError ? (
            <Tooltip
              title={retweetsMyError}
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
