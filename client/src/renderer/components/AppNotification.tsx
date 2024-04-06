import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

interface AppNotificationProps {
  snackbarOpen: boolean;
  setSnackbarOpen: Dispatch<SetStateAction<boolean>>;
  snackbarSeverity: 'success' | 'error' | 'warning' | 'info';
  snackbarContent: string;
}

export default function AppNotification(props: AppNotificationProps) {
  const { snackbarOpen, setSnackbarOpen, snackbarSeverity, snackbarContent } =
    props;

  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    if (snackbarOpen) {
      timeoutId.current = setTimeout(() => {
        setSnackbarOpen(false);
      }, 6000);
    }

    return () => {
      clearTimeout(timeoutId.current || undefined);
    };
  }, [snackbarOpen, setSnackbarOpen, snackbarContent]);

  return (
    <Snackbar
      open={snackbarOpen}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Alert
        onClose={() => setSnackbarOpen(false)}
        severity={snackbarSeverity}
        sx={{ maxWidth: 450 }}
      >
        {snackbarContent}
      </Alert>
    </Snackbar>
  );
}
