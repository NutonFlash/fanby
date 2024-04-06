import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import LoopIcon from '@mui/icons-material/Loop';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';

interface OpertionStateChipProps {
  label: string;
  type: 'success' | 'warning' | 'error' | 'disabled';
}
export default function OpertionStateChip(props: OpertionStateChipProps) {
  const { label, type } = props;
  const theme = useTheme();
  const icons = {
    success: <LoopIcon sx={{ color: 'white' }} />,
    warning: <WarningIcon sx={{ color: 'white' }} />,
    error: <ErrorIcon sx={{ color: 'white' }} />,
    disabled: null,
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor:
          type === 'disabled'
            ? theme.palette.grey[600]
            : theme.palette[type].main,
        px: 1.5,
        py: 0.5,
        gap: 1,
      }}
    >
      <span style={{ color: 'white' }}>{label}</span>
      {icons[type]}
    </Box>
  );
}
