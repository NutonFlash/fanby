import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import InfoIcon from '@mui/icons-material/Info';
import InputBase from '@mui/material/InputBase';
import CircularProgress from '@mui/material/CircularProgress';
import { AlertColor } from '@mui/material';
import { calculateOrderPrice, calculateDiscount } from './PriceList';
import { useAppContext } from '../../contexts/AppContext';
import { useInvoicesContext } from '../../contexts/InvoicesContext';
import Invoice from '../../models/Invoice';

const QuantityButton = styled(Button)({
  minWidth: 20,
  width: '25%',
  height: 30,
  minHeight: 30,
  color: 'grey',
});

const MAX_ACTIVATIONS_QUANTITY = 1000;

interface InvoiceFormProps {
  setSnackbarOpen: Dispatch<SetStateAction<boolean>>;
  setSnackbarContent: Dispatch<SetStateAction<string>>;
  setSnackbarSeverity: Dispatch<SetStateAction<AlertColor>>;
}

export default function InvoiceForm(props: InvoiceFormProps) {
  const { setSnackbarOpen, setSnackbarContent, setSnackbarSeverity } = props;

  const [quantity, setQuantity] = useState('0');
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const appContext = useAppContext();
  const invoicesContext = useInvoicesContext();

  const { apiService } = appContext.state;
  const { dispatch } = invoicesContext;

  const handleQuantityIncrease = () => {
    setQuantity((prevValue) => {
      const prevValNum = Number.parseInt(prevValue, 10);
      if (prevValNum + 1 <= MAX_ACTIVATIONS_QUANTITY)
        return (prevValNum + 1).toString(10);
      return prevValNum.toString(10);
    });
  };

  const handleQuantityDecrease = () => {
    setQuantity((prevValue) => {
      const prevValNum = Number.parseInt(prevValue, 10);
      return (prevValNum - 1).toString(10);
    });
  };

  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '') {
      setQuantity('0');
    } else {
      const newValue = event.target.value.replace(/^0+(?!\.|$)/, '');
      const newValueNum = Number.parseInt(newValue, 10);
      if (newValueNum <= MAX_ACTIVATIONS_QUANTITY) setQuantity(newValue);
    }
  };

  const handleCreateInvoiceClick = async () => {
    setLoading(true);

    const result = await apiService.invoices.create(
      1.5,
      `Account Activation x ${quantity}`,
    );

    setLoading(false);

    if (result.type === 'success') {
      const invoice: Invoice = result.data;

      dispatch({ type: 'add_invoice', data: invoice });

      setSnackbarOpen(true);
      setSnackbarContent('Invoice has been created');
      setSnackbarSeverity('success');
    } else {
      const { message } = result;
      setSnackbarOpen(true);
      setSnackbarContent(message);
      setSnackbarSeverity('error');
    }
  };

  useEffect(() => {
    const quantityNum = Number.parseInt(quantity, 10);
    setDiscount(calculateDiscount(quantityNum));
    setTotal(calculateOrderPrice(quantityNum));
  }, [quantity]);

  return (
    <Paper elevation={3}>
      <Box p={1} sx={{ fontSize: 15 }}>
        <Typography fontWeight={600} pb={1}>
          Purchase Account Activations
        </Typography>
        <Divider sx={{ opacity: 1, borderColor: 'rgba(0, 0, 0, 0.35)' }} />
        <Box pt={1} display="flex" flexDirection="column" rowGap={1.5}>
          <Box display="flex" alignItems="center">
            <Typography display="inline">Quantity: </Typography>
            <Box
              border="1px solid grey"
              borderRadius={1}
              display="inline-flex"
              alignItems="center"
              ml={2}
              minWidth={45}
              width={1 / 2}
              maxWidth={100}
            >
              <QuantityButton
                onClick={handleQuantityDecrease}
                disabled={Number.parseInt(quantity, 10) === 0}
              >
                <RemoveIcon fontSize="small" />
              </QuantityButton>
              <InputBase
                value={quantity}
                onChange={handleQuantityChange}
                type="number"
                slotProps={{
                  input: {
                    min: 0,
                    max: MAX_ACTIVATIONS_QUANTITY,
                    sx: {
                      textAlign: 'center',
                      '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button':
                        {
                          WebkitAppearance: 'none',
                          margin: 0,
                        },
                    },
                  },
                }}
                sx={{ width: 1 / 2 }}
              />
              <QuantityButton onClick={handleQuantityIncrease}>
                <AddIcon fontSize="small" />
              </QuantityButton>
            </Box>
          </Box>
          <Typography>Discount: {discount}$</Typography>
          <Typography>Total: {total}$</Typography>
          <Button
            variant="contained"
            sx={{ width: 130 }}
            onClick={handleCreateInvoiceClick}
            disabled={Number.parseInt(quantity, 10) === 0}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Create invoice'
            )}
          </Button>
          <Box display="flex" alignItems="center">
            <InfoIcon sx={{ width: 20, height: 20, mr: 0.25 }} />
            <span>We only accept cryptocurrency</span>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
