import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import InfoIcon from '@mui/icons-material/Info';
import { SxProps, Theme } from '@mui/material';
import Proxy from '../../../models/Proxy';
import { useAppContext } from '../../../contexts/AppContext';

interface ProxySelectItemProps {
  selectedItem: string;
  proxyValue: string;
  setProxy: Dispatch<SetStateAction<string>>;
  setSelectSpanRef: Dispatch<
    SetStateAction<RefObject<HTMLSpanElement> | undefined>
  >;
  setIsProxySelectOpen: Dispatch<SetStateAction<boolean>>;
}

interface ProxySelectProps {
  proxy: string;
  setProxy: Dispatch<SetStateAction<string>>;
  sx?: SxProps<Theme>;
}

function ProxySelectItem(props: ProxySelectItemProps) {
  const {
    proxyValue,
    selectedItem,
    setProxy,
    setSelectSpanRef,
    setIsProxySelectOpen,
  } = props;

  const [showTooltip, setShowTooltip] = useState(false);

  const spanRef = useRef<HTMLSpanElement>(null);

  const handleClick = () => {
    setProxy(proxyValue);
    setSelectSpanRef(spanRef);
    setIsProxySelectOpen(false);
  };

  useEffect(() => {
    if (spanRef.current) {
      setShowTooltip(spanRef.current.scrollWidth > spanRef.current.clientWidth);
    }
  }, []);

  return (
    <Tooltip title={showTooltip ? proxyValue : ''} placement="left" arrow>
      <MenuItem onClick={handleClick} selected={selectedItem === proxyValue}>
        <span ref={spanRef}>{proxyValue}</span>
      </MenuItem>
    </Tooltip>
  );
}

export default function ProxySelect(props: ProxySelectProps) {
  const { proxy, setProxy, sx } = props;

  const context = useAppContext();

  const proxies = context.state.proxies || [];

  const [selectSpanRef, setSelectSpanRef] =
    useState<RefObject<HTMLSpanElement>>();

  const selectButtonRef = useRef<HTMLSelectElement>(null);

  const [isProxySelectOpen, setIsProxySelectOpen] = useState(false);

  const [showTooltip, setShowTooltip] = useState(false);

  const [menuWidth, setMenuWidth] = useState(0);

  useEffect(() => {
    if (selectSpanRef?.current) {
      setShowTooltip(
        selectSpanRef.current.scrollWidth > selectSpanRef.current.clientWidth,
      );
    }
  }, [selectSpanRef]);

  useEffect(() => {
    const handleResize = () => {
      if (selectButtonRef.current) {
        setMenuWidth(selectButtonRef.current.clientWidth);
      }
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Tooltip title={showTooltip ? proxy : ''} placement="left" arrow>
      <FormControl sx={sx}>
        <InputLabel id="proxy-label">Proxy</InputLabel>
        <Select
          labelId="proxy-label"
          label="Proxy"
          value={proxy}
          open={isProxySelectOpen}
          onClose={() => setIsProxySelectOpen(false)}
          onOpen={() => {
            setShowTooltip(false);
            setIsProxySelectOpen(true);
          }}
          ref={selectButtonRef}
          MenuProps={{
            anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
            transformOrigin: { vertical: 'top', horizontal: 'center' },
            sx: {
              maxHeight: 500,
              '& .MuiPopover-paper': {
                mt: 1,
              },
              '& .MuiMenuItem-root span': {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
            },
            PaperProps: {
              style: {
                width: menuWidth || 0.8,
              },
            },
            MenuListProps: {
              sx: {
                '& .MuiButtonBase-root.MuiMenuItem-root': {
                  height: 60,
                  paddingY: 1.5,
                },
              },
            },
          }}
          renderValue={(selected) => <span>{selected}</span>}
          sx={{
            '& .MuiSelect-icon': {
              display: !proxies.length ? 'none' : null,
            },
            '& fieldset.MuiOutlinedInput-notchedOutline': {
              borderWidth: !proxies.length ? '2px' : null,
            },
          }}
          disabled={!proxies.length}
          endAdornment={
            !proxies.length ? (
              <InputAdornment position="end">
                <Tooltip
                  title="You haven't added proxies yet"
                  placement="top"
                  arrow
                >
                  <InfoIcon sx={{ cursor: 'pointer' }} />
                </Tooltip>
              </InputAdornment>
            ) : null
          }
        >
          {proxies.map((proxyItem: Proxy) => (
            <ProxySelectItem
              key={proxyItem.id}
              proxyValue={proxyItem.toString()}
              setProxy={setProxy}
              setSelectSpanRef={setSelectSpanRef}
              selectedItem={proxy}
              setIsProxySelectOpen={setIsProxySelectOpen}
            />
          ))}
        </Select>
      </FormControl>
    </Tooltip>
  );
}

ProxySelect.defaultProps = {
  sx: {},
};
