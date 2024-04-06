import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import { useAppContext } from '../contexts/AppContext';

interface InfoPaperProps {
  title: string;
  info: number;
  loading: boolean;
}
function InfoPaper(props: InfoPaperProps) {
  const { title, info, loading } = props;

  return (
    <Paper elevation={3} sx={{ py: 1, px: 1.5, width: 175 }}>
      <Typography textAlign="left">{title}</Typography>
      <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.25)', my: 1 }} />
      <Typography textAlign="left" fontSize={17}>
        {loading ? <Skeleton /> : info}
      </Typography>
    </Paper>
  );
}

export default function CommonInfo() {
  const appContext = useAppContext();
  const { apiService } = appContext.state;

  const [loading, setLoading] = useState(false);

  const [activationsLeft, setActivationsLeft] = useState(0);
  const [retweetsToday, setRetweetsToday] = useState(0);
  const [retweetsTotal, setRetweetsTotal] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const result = await apiService.user.info();

      setLoading(false);

      if (result.type === 'success') {
        setActivationsLeft(result.data.activationsLeft);
        setRetweetsToday(result.data.retweetsToday);
        setRetweetsTotal(result.data.retweetsTotal);
      }
    })();
  }, []);

  return (
    <Box display="flex" alignItems="center" gap={4} pb={2}>
      <InfoPaper
        title="Activations left"
        info={activationsLeft}
        loading={loading}
      />
      <InfoPaper
        title="Retweets today"
        info={retweetsToday}
        loading={loading}
      />
      <InfoPaper
        title="Total retweets"
        info={retweetsTotal}
        loading={loading}
      />
    </Box>
  );
}
