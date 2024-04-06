import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { ReactElement } from 'react';

interface BarButtonProps {
  icon: ReactElement;
  hoverColor: string;
  onClick: () => void;
}

export default function BarButton(props: BarButtonProps) {
  const { icon, hoverColor, onClick } = props;

  const StyledButton = styled(Button)({
    color: 'white',
    fontSize: 'inherit',
    height: '100%',
    borderRadius: 0,
    minWidth: 50,
    padding: '8px 4px',
    '&:hover': {
      backgroundColor: hoverColor,
    },
  });

  return <StyledButton onClick={onClick}>{icon}</StyledButton>;
}
