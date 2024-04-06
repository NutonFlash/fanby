import Tooltip from '@mui/material/Tooltip';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useEffect, useRef, useState } from 'react';

export default function CustomCell(params: GridRenderCellParams) {
  const { value } = params;
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const spanElement = spanRef.current;
    if (spanElement) {
      setIsTruncated(spanElement.scrollWidth > spanElement.offsetWidth);
    }
  }, [value]);
  return (
    <Tooltip
      title={value}
      placement="bottom"
      arrow
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -5],
              },
            },
          ],
        },
      }}
      disableHoverListener={!isTruncated}
    >
      <span
        ref={spanRef}
        style={{
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          textWrap: 'nowrap',
        }}
      >
        {value}
      </span>
    </Tooltip>
  );
}
