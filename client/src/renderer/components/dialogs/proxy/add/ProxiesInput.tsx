import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { AlertColor } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import Proxy from '../../../../models/Proxy';
import { validateProxies, proxyFormats, ProxyFormats } from './proxyValidation';
import { useProxiesContext } from '../../../../contexts/ProxiesContext';
import { getUserIdFromToken } from '../../../../services/tokens';

interface ProxiesInputProps {
  addedProxyRows: Proxy[];
  setAddedProxyRows: Dispatch<SetStateAction<Proxy[]>>;
  setSnackbarOpen: Dispatch<SetStateAction<boolean>>;
  setSnackbarContent: Dispatch<SetStateAction<string>>;
  setSnackbarSeverity: Dispatch<SetStateAction<AlertColor>>;
}

export default function ProxiesInput(props: ProxiesInputProps) {
  const {
    addedProxyRows,
    setAddedProxyRows,
    setSnackbarOpen,
    setSnackbarContent,
    setSnackbarSeverity,
  } = props;

  const proxiesContext = useProxiesContext();
  const { proxies } = proxiesContext.state;

  const [proxiesInput, setProxiesInput] = useState('');

  const [format, setFormat] = useState<keyof ProxyFormats>(
    'host:port:user:pass',
  );

  const [hasError, setHasError] = useState(false);

  const onProxiesChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProxiesInput(event.target.value);
    setHasError(false);
  };

  const onAddProxiesClick = () => {
    const error = validateProxies(
      proxiesInput,
      format,
      addedProxyRows,
      proxies,
    );
    if (error) {
      setSnackbarOpen(true);
      setSnackbarContent(error);
      setSnackbarSeverity('error');
      setHasError(true);
    } else {
      const { regex } = proxyFormats[format];

      const groups: string[] = [];
      format.split(/(:|@)/).forEach((prop) => {
        if (prop !== ':' && prop !== '@') {
          groups.push(prop);
        }
      });

      const proxiesStr = proxiesInput.split('\n');

      proxiesStr.forEach((proxy) => {
        const match = proxy.match(regex);
        if (match) {
          const host = match[groups.indexOf('host') + 1];
          const port = match[groups.indexOf('port') + 1];

          let username = '';
          let password = '';

          if (groups.indexOf('user') !== -1) {
            username = match[groups.indexOf('user') + 1];
          }
          if (groups.indexOf('pass') !== -1) {
            password = match[groups.indexOf('pass') + 1];
          }

          const userId = getUserIdFromToken(
            window.electron.store.get('accessToken', ''),
          );

          const newProxy = new Proxy(
            uuidv4(),
            userId,
            host,
            Number.parseInt(port, 10),
            username,
            password,
          );

          setAddedProxyRows((prevRows) => {
            return [...prevRows, newProxy];
          });
        }
      });
      setProxiesInput('');
    }
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value as keyof ProxyFormats;
    setFormat(newValue);
  };

  return (
    <Box>
      <Grid container justifyContent="space-between">
        <Grid display="flex">
          <Typography variant="subtitle1" mt="auto">
            Proxies:
          </Typography>
        </Grid>
        <Grid container columnSpacing={1}>
          <Grid display="flex" alignContent="center">
            <Typography variant="subtitle1" my="auto">
              Format:
            </Typography>
          </Grid>
          <Grid>
            <Select
              autoWidth
              value={format}
              onChange={handleSelectChange}
              sx={{ '& .MuiOutlinedInput-input': { p: 1 } }}
            >
              {Object.keys(proxyFormats).map((proxyFormat) => (
                <MenuItem key={proxyFormat} value={proxyFormat}>
                  {proxyFormat}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </Grid>
      <TextField
        variant="outlined"
        value={proxiesInput}
        onChange={onProxiesChange}
        multiline
        error={hasError}
        placeholder={`Enter each proxy on new line. Format: ${format}`}
        minRows={5}
        maxRows={10}
        spellCheck={false}
        sx={{ my: 1, width: 1, typography: 'body2' }}
      />
      <Button
        variant="contained"
        startIcon={<AddCircleIcon />}
        sx={{ mt: 1 }}
        onClick={onAddProxiesClick}
      >
        Add proxies
      </Button>
    </Box>
  );
}
