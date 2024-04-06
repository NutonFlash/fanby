import {
  createContext,
  useReducer,
  useContext,
  Dispatch,
  Reducer,
  ReactNode,
  useMemo,
  useEffect,
} from 'react';
import Invoice from '../models/Invoice';
import { useAppContext } from './AppContext';

interface InvoicesState {
  invoices: Invoice[];
  isLoaded: boolean;
}

interface InvoicesAction {
  type: string;
  data: any;
}

const InvoicesContext = createContext<
  { state: InvoicesState; dispatch: Dispatch<InvoicesAction> } | undefined
>(undefined);

const invoicesReducer: Reducer<InvoicesState, InvoicesAction> = (
  state: InvoicesState,
  action: InvoicesAction,
) => {
  switch (action.type) {
    case 'set_invoices':
      return {
        ...state,
        invoices: action.data.map((obj: any) => Invoice.deserialize(obj)),
      };
    case 'add_invoice': {
      const oldInvoices = [...state.invoices];
      const newInvoice = Invoice.deserialize(action.data);
      return { ...state, invoices: [newInvoice, ...oldInvoices] };
    }
    case 'update_invoice': {
      const invoices = [...state.invoices].map((invoice) => {
        if (invoice.id === action.data.id) {
          return Invoice.deserialize(action.data);
        }
        return invoice;
      });
      return { ...state, invoices };
    }
    case 'delete_invoice': {
      const invoices = [...state.invoices].filter(
        (invoice) => !action.data.includes(invoice.id),
      );
      return { ...state, invoices };
    }
    case 'set_loaded': {
      return { ...state, isLoaded: action.data };
    }
    default:
      return state;
  }
};

interface InvoicesProviderProps {
  children: ReactNode;
}

export function InvoicesProvider(props: InvoicesProviderProps) {
  const { children } = props;

  const initialState: InvoicesState = {
    invoices: [],
    isLoaded: false,
  };

  const [state, dispatch] = useReducer(invoicesReducer, initialState);

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  const appContext = useAppContext();
  const { apiService } = appContext.state;

  useEffect(() => {
    (async () => {
      const result = await apiService.invoices.all();
      if (result.type === 'success') {
        dispatch({ type: 'set_invoices', data: result.data });
        dispatch({ type: 'set_loaded', data: true });
      }
    })();
  }, []);

  return (
    <InvoicesContext.Provider value={contextValue}>
      {children}
    </InvoicesContext.Provider>
  );
}

export const useInvoicesContext = () => {
  const context = useContext(InvoicesContext);
  if (!context) {
    throw new Error(
      'useInvoicesContext must be used within an InvoicesProvider',
    );
  }
  return context;
};
