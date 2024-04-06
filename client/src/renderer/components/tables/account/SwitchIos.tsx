import { styled } from '@mui/material/styles';
import Switch, { switchClasses } from '@mui/material/Switch';

const pxToRem = (px: number, oneRemPx = 17) => `${px / oneRemPx}rem`;

const SwitchIos = styled(Switch)(({ theme }) => {
  const spacing = 8;
  const size = pxToRem(22);
  const width = pxToRem(60 + 2 * spacing);
  const borderWidth = 2;
  const height = `calc(${size} + ${borderWidth * 2}px + ${pxToRem(
    2 * spacing,
  )})`;
  return {
    width,
    height,
    padding: pxToRem(spacing),
    margin: 0,
    [`& .${switchClasses.switchBase}`]: {
      padding: borderWidth,
      top: pxToRem(spacing),
      left: pxToRem(spacing),
      [`&.${switchClasses.checked}`]: {
        color: (theme.vars || theme).palette.common.white,
        transform: `translateX(calc(${width} - ${size} - ${
          borderWidth * 2
        }px - ${pxToRem(2 * spacing)}))`,
        [`& + .${switchClasses.track}`]: {
          backgroundColor: '#52d869',
          opacity: 1,
          boxShadow: 'none',
        },
      },
    },
    [`& .${switchClasses.thumb}`]: {
      background: (theme.vars || theme).palette.common.white,
      width: size,
      height: size,
      boxShadow:
        '0 3px 8px 0 rgba(0,0,0,0.15), 0 1px 1px 0 rgba(0,0,0,0.16), 0 3px 1px 0 rgba(0,0,0,0.1)',
    },
    [`& .${switchClasses.track}`]: {
      borderRadius: 40,
      boxShadow: `inset 0 0 0 ${borderWidth}px ${(theme.vars || theme).palette.grey[300]}`,
      backgroundColor: (theme.vars || theme).palette.grey[50],
      transition: theme.transitions.create(['background-color', 'box-shadow']),
      opacity: 1,
    },
    [`& .${switchClasses.disabled}`]: {
      [`+ .${switchClasses.track}`]: {
        opacity: 0.45,
        backgroundColor: 'red',
        boxShadow: 'none',
      },
    },
  };
});

export default SwitchIos;
