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
import Account from '../models/Account';
import { useAppContext } from './AppContext';

interface AccountsState {
  accounts: Account[];
  isLoaded: boolean;
}

interface AccountsAction {
  type: string;
  data: any;
}

const AccountsContext = createContext<
  { state: AccountsState; dispatch: Dispatch<AccountsAction> } | undefined
>(undefined);

const accountsReducer: Reducer<AccountsState, AccountsAction> = (
  state: AccountsState,
  action: AccountsAction,
) => {
  switch (action.type) {
    case 'set_accounts':
      return {
        ...state,
        accounts: action.data.map((obj: any) => Account.deserialize(obj)),
      };
    case 'update_account': {
      const accounts = [...state.accounts].map((account) => {
        if (account.id === action.data.id) {
          return Account.deserialize(action.data);
        }
        return account;
      });
      return { ...state, accounts };
    }
    case 'add_account': {
      const accounts = [...state.accounts];
      accounts.push(Account.deserialize(action.data));
      return { ...state, accounts };
    }
    case 'delete_accounts': {
      const accounts = [...state.accounts].filter(
        (account) => !action.data.includes(account.id),
      );
      return { ...state, accounts };
    }
    case 'set_loaded': {
      return { ...state, isLoaded: action.data };
    }
    default:
      return state;
  }
};

interface AccountsProviderProps {
  children: ReactNode;
}

export function AccountsProvider(props: AccountsProviderProps) {
  const { children } = props;

  const initialState: AccountsState = {
    accounts: [],
    isLoaded: false,
  };

  const [state, dispatch] = useReducer(accountsReducer, initialState);

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  const appContext = useAppContext();
  const { apiService } = appContext.state;

  useEffect(() => {
    (async () => {
      const result = await apiService.accounts.all(true, false);
      if (result.type === 'success') {
        dispatch({
          type: 'set_accounts',
          data: result.data,
        });
        dispatch({ type: 'set_loaded', data: true });
      }
    })();
  }, []);

  return (
    <AccountsContext.Provider value={contextValue}>
      {children}
    </AccountsContext.Provider>
  );
}

export const useAccountsContext = () => {
  const context = useContext(AccountsContext);
  if (!context) {
    throw new Error(
      'useAccountsContext must be used within an AccountsProvider',
    );
  }
  return context;
};
