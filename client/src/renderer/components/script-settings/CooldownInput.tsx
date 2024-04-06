import Tooltip from '@mui/material/Tooltip';
import InputAdornment from '@mui/material/InputAdornment';
import ErrorIcon from '@mui/icons-material/Error';
import { ChangeEvent, useState } from 'react';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const MAX_COOLDOWN = 1440;

function validateCooldown(cooldown: string) {
  const regex = '\\d+';
  const match = cooldown.match(regex);
  if (match && match[0] === cooldown) {
    if (Number.parseInt(cooldown) > MAX_COOLDOWN) {
      return `Value should be no more than ${MAX_COOLDOWN}.`;
    }
    if (Number.parseInt(cooldown) === 0) {
      return 'Value shoud be more than 0.';
    }
    return '';
  }
  return 'Value should be a number.';
}

export default function CooldownInput() {
  const [cooldown, setCooldown] = useState('');
  const [cooldownError, setCooldownError] = useState('');

  const theme = useTheme();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      setCooldownError('');
    } else {
      setCooldownError(validateCooldown(event.target.value));
    }
    setCooldown(event.target.value);
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
          <Typography fontSize="15px">Cooldown:</Typography>
          <Tooltip
            title="Time to wait after completing the required number of retweets."
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
        value={cooldown}
        onChange={handleChange}
        placeholder="1-1440"
        sx={{
          '& .MuiOutlinedInput-input': {
            pl: cooldownError ? 1 : 1,
            pr: cooldownError ? 0 : 1,
          },
        }}
        InputProps={{
          endAdornment: cooldownError ? (
            <Tooltip
              title={cooldownError}
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
