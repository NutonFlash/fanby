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

export function validateUsername(
  username: string,
  newProxy: Proxy,
  addedProxies: Proxy[],
) {
  newProxy.username = username;
  const isDuplicated = addedProxies
    .map((proxy) => proxy.toString())
    .includes(newProxy.toString());
  if (isDuplicated) {
    return 'That proxy is already added.';
  }
  return '';
}

interface UsernameEditProps extends GridRenderEditCellParams {
  setNewValue: Dispatch<SetStateAction<string>>;
  setIsChanged: Dispatch<SetStateAction<boolean>>;
  addedProxies?: Proxy[];
}

export default function UsernameEdit(props: UsernameEditProps) {
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

  const [username, setUsername] = useState(value);
  const [error, setError] = useState(
    validateUsername(value, editedProxy, allPorxies),
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setUsername(newValue);
    setError(validateUsername(newValue, editedProxy, allPorxies));
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
      value={username}
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

UsernameEdit.defaultProps = {
  addedProxies: null,
};
