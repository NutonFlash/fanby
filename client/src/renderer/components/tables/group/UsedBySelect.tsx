import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import { useRef, useState, Dispatch, SetStateAction, useEffect } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InfoIcon from '@mui/icons-material/Info';
import { useAppContext } from '../../../contexts/AppContext';
import Account from '../../../models/Account';

interface UsedBySelectProps extends GridRenderEditCellParams {
  setNewValue: Dispatch<SetStateAction<any>>;
  setHasChanged: Dispatch<SetStateAction<boolean>>;
}
interface UsedBySelectItemProps {
  username: string;
  selectedAccounts: string[];
  setSelectedAccounts: Dispatch<SetStateAction<string[]>>;
  menuWidth: number;
}

function UsedBySelectItem(props: UsedBySelectItemProps) {
  const { username, selectedAccounts, setSelectedAccounts, menuWidth } = props;

  const [showTooltip, setShowTooltip] = useState(false);

  const spanRef = useRef<HTMLSpanElement>(null);

  const handleClick = () => {
    setSelectedAccounts((prevAccounts) => {
      const newAccounts = [...prevAccounts];
      const indexOfGroup = prevAccounts.indexOf(username);
      if (indexOfGroup > -1) {
        newAccounts.splice(indexOfGroup, 1);
      } else {
        newAccounts.push(username);
      }
      return newAccounts;
    });
  };

  useEffect(() => {
    if (spanRef.current) {
      setShowTooltip(spanRef.current.scrollWidth > spanRef.current.clientWidth);
    }
  }, [menuWidth]);

  return (
    <Tooltip
      title={showTooltip ? username : ''}
      placement="left"
      arrow
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -20],
              },
            },
          ],
        },
      }}
    >
      <MenuItem
        onClick={handleClick}
        selected={selectedAccounts.indexOf(username) > -1}
      >
        <Checkbox checked={selectedAccounts.indexOf(username) > -1} />
        <span ref={spanRef} style={{ marginRight: '15px', marginLeft: '5px' }}>
          {username}
        </span>
      </MenuItem>
    </Tooltip>
  );
}

export default function UsedBySelect(props: UsedBySelectProps) {
  const { id, value: usedBy, field, setNewValue, setHasChanged } = props;

  const apiRef = useGridApiContext();

  const context = useAppContext();

  const { state } = context;

  const addedAccounts = state.accounts;

  const selectButtonRef = useRef<HTMLSelectElement>(null);

  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(usedBy);

  const [menuWidth, setMenuWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (selectButtonRef.current) {
        setMenuWidth(selectButtonRef.current.clientWidth);
      }
    };

    // Attach resize event listener
    window.addEventListener('resize', handleResize);

    // Initial width calculation
    handleResize();

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setNewValue(selectedAccounts);
    setHasChanged(true);
  }, [selectedAccounts, apiRef, id, field, usedBy, setNewValue, setHasChanged]);

  return (
    <Select
      multiple
      defaultOpen={addedAccounts.length > 0}
      value={selectedAccounts}
      ref={selectButtonRef}
      displayEmpty
      renderValue={(selected) => {
        return addedAccounts.length ? selected.join(', ') : 'No added accounts';
      }}
      disabled={!addedAccounts.length}
      endAdornment={
        !addedAccounts.length ? (
          <InputAdornment position="end">
            <Tooltip
              title="You haven't added accounts yet"
              placement="top"
              arrow
            >
              <InfoIcon sx={{ cursor: 'pointer' }} />
            </Tooltip>
          </InputAdornment>
        ) : null
      }
      sx={{
        width: 1,
        '& .MuiSelect-icon': {
          display: !addedAccounts.length ? 'none' : null,
        },
        boxShadow: 'none',
        '.MuiOutlinedInput-notchedOutline': { border: 0 },
        '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
          border: 0,
        },
        '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
          {
            border: 0,
          },
      }}
      MenuProps={{
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        transformOrigin: { vertical: 'top', horizontal: 'center' },
        sx: {
          maxHeight: 450,
          '& .MuiMenuItem-root span': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
          '& .MuiPopover-paper': {
            mt: 1,
          },
        },
        PaperProps: {
          style: {
            width: menuWidth || 0.8,
            minWidth: 200,
          },
        },
      }}
    >
      {addedAccounts.map((account: Account) => (
        <UsedBySelectItem
          key={account.id}
          username={account.username}
          selectedAccounts={selectedAccounts}
          setSelectedAccounts={setSelectedAccounts}
          menuWidth={menuWidth}
        />
      ))}
    </Select>
  );
}
