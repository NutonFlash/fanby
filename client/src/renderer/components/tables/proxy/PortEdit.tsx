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

export function validatePort(
  port: string,
  newProxy: Proxy,
  addedProxies: Proxy[],
) {
  if (port.length === 0) {
    return "Field can't be empty.";
  }
  const match = port.match('\\d{1,5}');
  if (match && match[0] === port) {
    if (Number.parseInt(port, 10) <= 65535) {
      newProxy.port = Number.parseInt(port, 10);
      const isDuplicated = addedProxies
        .map((proxy) => proxy.toString())
        .includes(newProxy.toString());
      if (isDuplicated) {
        return 'That proxy is already added.';
      }
      return '';
    }
  }

  return 'Port should be a number in range of 0-65535.';
}

interface PortEditProps extends GridRenderEditCellParams {
  setNewValue: Dispatch<SetStateAction<string>>;
  setIsChanged: Dispatch<SetStateAction<boolean>>;
  addedProxies?: Proxy[];
}

export default function PortEdit(props: PortEditProps) {
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

  const [port, setPort] = useState(value);
  const [error, setError] = useState(
    validatePort(value.toString(), editedProxy, allPorxies),
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setPort(newValue);
    setError(validatePort(newValue.toString(), editedProxy, allPorxies));
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
      value={port}
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
        maxLength: 5,
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

PortEdit.defaultProps = {
  addedProxies: null,
};
