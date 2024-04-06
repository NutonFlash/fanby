import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Dispatch, SetStateAction } from 'react';

interface SelectProxiesFormatProps {
  format: string;
  setFormat: Dispatch<SetStateAction<string>>;
  setPlaceholder: Dispatch<SetStateAction<string>>;
}

export default function SelectProxiesFormat(props: SelectProxiesFormatProps) {
  const { format, setFormat, setPlaceholder } = props;

  const handleSelectChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value as string;
    setFormat(newValue);
    setPlaceholder(`Enter proxies. Format: ${newValue}`);
  };

  return (
    <Select
      autoWidth
      value={format}
      onChange={handleSelectChange}
      sx={{ '& .MuiOutlinedInput-input': { p: 1 } }}
    >
      <MenuItem value="host:port:user:pass">host:port:user:pass</MenuItem>
      <MenuItem value="host:port@user:pass">host:port@user:pass</MenuItem>
      <MenuItem value="user:pass:host:port">user:pass:host:port</MenuItem>
      <MenuItem value="user:pass@host:port">user:pass@host:port</MenuItem>
    </Select>
  );
}
