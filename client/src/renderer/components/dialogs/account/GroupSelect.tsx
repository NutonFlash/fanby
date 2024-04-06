import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import InputAdornment from '@mui/material/InputAdornment';
import InfoIcon from '@mui/icons-material/Info';
import Group from '../../../models/Group';

interface GroupSelectProps {
  selectedGroups: string[];
  setSelectedGroups: Dispatch<SetStateAction<string[]>>;
  groups: Group[];
}

interface GroupSelectItemProps {
  group: Group;
  selectedGroups: string[];
  setSelectedGroups: Dispatch<SetStateAction<string[]>>;
  menuWidth: number;
}

function GroupSelectItem(props: GroupSelectItemProps) {
  const { group, selectedGroups, setSelectedGroups, menuWidth } = props;

  const { groupId } = group;

  const [showTooltip, setShowTooltip] = useState(false);

  const spanRef = useRef<HTMLSpanElement>(null);

  const handleClick = () => {
    setSelectedGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      const indexOfGroup = prevGroups.indexOf(groupId);
      if (indexOfGroup > -1) {
        newGroups.splice(indexOfGroup, 1);
      } else {
        newGroups.push(groupId);
      }
      return newGroups;
    });
  };

  useEffect(() => {
    if (spanRef.current) {
      setShowTooltip(spanRef.current.scrollWidth > spanRef.current.clientWidth);
    }
  }, [menuWidth]);

  return (
    <Tooltip
      title={showTooltip ? groupId : ''}
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
        selected={selectedGroups.indexOf(groupId) > -1}
      >
        <Checkbox checked={selectedGroups.indexOf(groupId) > -1} />
        <span ref={spanRef} style={{ marginRight: '15px', marginLeft: '5px' }}>
          {groupId}
        </span>

        <Chip
          label={
            group.usedBy.length !== 1
              ? `${group.usedBy.length} accounts `
              : `1 account`
          }
        />
      </MenuItem>
    </Tooltip>
  );
}

export default function GroupSelect(props: GroupSelectProps) {
  const { groups, selectedGroups, setSelectedGroups } = props;

  const selectButtonRef = useRef<HTMLSelectElement>(null);

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

  return (
    <div>
      <FormControl sx={{ width: 0.8, maxWidth: 450 }}>
        <InputLabel id="group-label">Groups</InputLabel>
        <Select
          labelId="group-label"
          multiple
          value={selectedGroups}
          ref={selectButtonRef}
          input={<OutlinedInput label="Groups" />}
          renderValue={(selected) => selected.join(', ')}
          disabled={!groups.length}
          endAdornment={
            !groups.length ? (
              <InputAdornment position="end">
                <Tooltip
                  title="You haven't added groups yet"
                  placement="top"
                  arrow
                >
                  <InfoIcon sx={{ cursor: 'pointer' }} />
                </Tooltip>
              </InputAdornment>
            ) : null
          }
          sx={{
            '& .MuiSelect-icon': {
              display: !groups.length ? 'none' : null,
            },
            '& fieldset.MuiOutlinedInput-notchedOutline': {
              borderWidth: !groups.length ? '2px' : null,
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
          {groups.map((group) => (
            <GroupSelectItem
              key={group.id}
              group={group}
              selectedGroups={selectedGroups}
              setSelectedGroups={setSelectedGroups}
              menuWidth={menuWidth}
            />
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
