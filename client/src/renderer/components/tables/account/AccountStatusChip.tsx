import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import DoneIcon from '@mui/icons-material/Done';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface AccountStatusProps {
  label: string;
  type: 'info' | 'warning' | 'error';
}
export default function AccountStatusChip(props: AccountStatusProps) {
  const { label, type } = props;
  const theme = useTheme();
  const icons = {
    info: <DoneIcon sx={{ color: 'white' }} />,
    warning: <AccessTimeIcon sx={{ color: 'white' }} />,
    error: null,
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: theme.palette[type].main,
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
