import * as React from 'react';
import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import AccountProxy from '../../Classes/AccountProxy';

export default function ProxyEditComponent(props: GridRenderEditCellParams) {
  const { id, value, field, proxies } = props;
  const apiRef = useGridApiContext();

  const onProxyChange = (event: SelectChangeEvent) => {
    apiRef.current.setEditCellValue({ id, field, value: event.target.value });
  };

  return (
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={value}
      label="Age"
      onChange={onProxyChange}
    >
      {proxies.map((proxyItem: AccountProxy) => (
        <MenuItem key={proxyItem.id} value={proxyItem.toString()}>
          {proxyItem.toString()}
        </MenuItem>
      ))}
    </Select>
  );
}
