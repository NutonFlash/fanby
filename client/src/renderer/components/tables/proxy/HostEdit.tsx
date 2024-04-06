import { GridRenderEditCellParams } from '@mui/x-data-grid';
import {
  useLayoutEffect,
  useRef,
  useState,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from 'react';
import ErrorIcon from '@mui/icons-material/Error';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import Tooltip from '@mui/material/Tooltip';
import Proxy from '../../../models/Proxy';
import { useProxiesContext } from '../../../contexts/ProxiesContext';

const ipv4Regex =
  '(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';

const ipv6Regex =
  '([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^(([0-9a-fA-F]{1,4}:){6}|::([0-9a-fA-F]{1,4}:){0,5})[0-9a-fA-F]{1,4}$|^(([0-9a-fA-F]{1,4}:){5}(:[0-9a-fA-F]{1,4}){0,4}|::([0-9a-fA-F]{1,4}:){0,4}[0-9a-fA-F]{1,4})$|^(([0-9a-fA-F]{1,4}:){4}(:[0-9a-fA-F]{1,4}){0,5}|::([0-9a-fA-F]{1,4}:){0,3}[0-9a-fA-F]{1,4})$|^(([0-9a-fA-F]{1,4}:){3}(:[0-9a-fA-F]{1,4}){0,6}|::([0-9a-fA-F]{1,4}:){0,2}[0-9a-fA-F]{1,4})$|^(([0-9a-fA-F]{1,4}:){2}(:[0-9a-fA-F]{1,4}){0,7}|::[0-9a-fA-F]{1,4}|::)$|^([0-9a-fA-F]{1,4}:){1,7}:([0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}';

const hostnameRegex = '(?!-)[a-zA-Z0-9-]{1,63}(?<!-)(.[a-zA-Z0-9-]{1,63})*';

export function validateHost(
  host: string,
  newProxy: Proxy,
  addedProxies: Proxy[],
) {
  if (host.length === 0) {
    return "Field can't be empty.";
  }

  let error = 'Incorrect host format.';
  const hostRegexes = [ipv4Regex, ipv6Regex, hostnameRegex];
  hostRegexes.forEach((regex) => {
    const match = host.match(regex);
    if (match && match[0] === host) {
      error = '';
    }
  });

  if (!error) {
    newProxy.host = host;
    if (
      addedProxies
        .map((proxy) => proxy.toString())
        .includes(newProxy.toString())
    ) {
      error = 'That proxy is already added.';
    }
  }

  return error;
}

interface HostEditProps extends GridRenderEditCellParams {
  setNewValue: Dispatch<SetStateAction<string>>;
  setIsChanged: Dispatch<SetStateAction<boolean>>;
  addedProxies?: Proxy[];
}

export default function HostEdit(props: HostEditProps) {
  const { id, value, hasFocus, addedProxies, setNewValue, setIsChanged } =
    props;

  const proxiesContext = useProxiesContext();
  const { state } = proxiesContext;

  const ref = useRef<HTMLInputElement>();

  let allPorxies: Proxy[];
  let editedProxy: Proxy;

  if (addedProxies) {
    allPorxies = [
      ...addedProxies.filter((proxy) => proxy.id !== id),
      ...state.proxies,
    ];
    [editedProxy] = addedProxies.filter((proxy) => proxy.id === id);
  } else {
    allPorxies = state.proxies.filter((proxy) => proxy.id !== id);
    [editedProxy] = state.proxies.filter((proxy) => proxy.id === id);
  }

  const [host, setHost] = useState(value);
  const [error, setError] = useState(
    validateHost(value, editedProxy, allPorxies),
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setHost(newValue);
    setError(validateHost(newValue, editedProxy, allPorxies));
    setNewValue(newValue);
    setIsChanged(newValue !== value);
  };

  useLayoutEffect(() => {
    if (hasFocus && ref.current) {
      ref.current.focus();
    }
  }, [hasFocus, ref]);

  return (
    <Input
      value={host}
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
        spellCheck: false,
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

HostEdit.defaultProps = {
  addedProxies: null,
};
