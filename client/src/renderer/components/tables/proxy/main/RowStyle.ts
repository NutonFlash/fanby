import { Theme, lighten } from '@mui/material/styles';
import { yellow } from '@mui/material/colors';

const getBackgroundColor = (color: string) => lighten(color, 0.7);

const getHoverBackgroundColor = (color: string) => lighten(color, 0.6);

const getSelectedBackgroundColor = (color: string) => lighten(color, 0.5);

const getSelectedHoverBackgroundColor = (color: string) => lighten(color, 0.4);

const RowStyle = (theme: Theme) => {
  return {
    height: 400,
    '& .super-app-theme--fast': {
      backgroundColor: getBackgroundColor(theme.palette.success.main),
      '&:hover': {
        backgroundColor: getHoverBackgroundColor(theme.palette.success.main),
      },
      '&.Mui-selected': {
        backgroundColor: getSelectedBackgroundColor(theme.palette.success.main),
        '&:hover': {
          backgroundColor: getSelectedHoverBackgroundColor(
            theme.palette.success.main,
          ),
        },
      },
    },
    '& .super-app-theme--medium': {
      backgroundColor: getBackgroundColor(yellow[200]),
      '&:hover': {
        backgroundColor: getHoverBackgroundColor(yellow[200]),
      },
      '&.Mui-selected': {
        backgroundColor: getSelectedBackgroundColor(yellow[200]),
        '&:hover': {
          backgroundColor: getSelectedHoverBackgroundColor(yellow[200]),
        },
      },
    },
    '& .super-app-theme--slow': {
      backgroundColor: getBackgroundColor(theme.palette.error.main),
      '&:hover': {
        backgroundColor: getHoverBackgroundColor(theme.palette.error.main),
      },
      '&.Mui-selected': {
        backgroundColor: getSelectedBackgroundColor(theme.palette.error.main),
        '&:hover': {
          backgroundColor: getSelectedHoverBackgroundColor(
            theme.palette.error.main,
          ),
        },
      },
    },
    '& .super-app-theme--invalid': {
      backgroundColor: getBackgroundColor(theme.palette.grey[500]),
      '&:hover': {
        backgroundColor: getHoverBackgroundColor(theme.palette.grey[500]),
      },
      '&.Mui-selected': {
        backgroundColor: getSelectedBackgroundColor(theme.palette.grey[500]),
        '&:hover': {
          backgroundColor: getSelectedHoverBackgroundColor(
            theme.palette.grey[500],
          ),
        },
      },
    },
  };
};

export default RowStyle;
