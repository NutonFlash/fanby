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
import Proxy from '../models/Proxy';
import { useAppContext } from './AppContext';

interface ProxiesState {
  proxies: Proxy[];
  isLoaded: boolean;
}

interface ProxiesAction {
  type: string;
  data: any;
}

const ProxiesContext = createContext<
  { state: ProxiesState; dispatch: Dispatch<ProxiesAction> } | undefined
>(undefined);

const proxiesReducer: Reducer<ProxiesState, ProxiesAction> = (
  state: ProxiesState,
  action: ProxiesAction,
) => {
  switch (action.type) {
    case 'set_proxies':
      return {
        ...state,
        proxies: action.data.map((obj: any) => Proxy.deserialize(obj)),
      };
    case 'add_proxies': {
      const oldProxies = [...state.proxies];
      const newProxies = action.data.map((obj: any) => Proxy.deserialize(obj));
      return { ...state, proxies: [...oldProxies, ...newProxies] };
    }
    case 'update_proxy': {
      const proxies = [...state.proxies].map((proxy) => {
        if (proxy.id === action.data.id) {
          return Proxy.deserialize(action.data);
        }
        return proxy;
      });
      return { ...state, proxies };
    }
    case 'delete_proxies': {
      const proxies = [...state.proxies].filter(
        (proxy) => !action.data.includes(proxy.id),
      );
      return { ...state, proxies };
    }
    case 'set_loaded': {
      return { ...state, isLoaded: action.data };
    }
    default:
      return state;
  }
};

interface ProxiesProviderProps {
  children: ReactNode;
}

export function ProxiesProvider(props: ProxiesProviderProps) {
  const { children } = props;

  const initialState: ProxiesState = {
    proxies: [],
    isLoaded: false,
  };

  const [state, dispatch] = useReducer(proxiesReducer, initialState);

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  const appContext = useAppContext();
  const { apiService } = appContext.state;

  useEffect(() => {
    (async () => {
      const result = await apiService.proxies.all();
      if (result.type === 'success') {
        dispatch({ type: 'set_proxies', data: result.data });
        dispatch({ type: 'set_loaded', data: true });
      }
    })();
  }, []);

  return (
    <ProxiesContext.Provider value={contextValue}>
      {children}
    </ProxiesContext.Provider>
  );
}

export const useProxiesContext = () => {
  const context = useContext(ProxiesContext);
  if (!context) {
    throw new Error('useProxiesContext must be used within a ProxiesProvider');
  }
  return context;
};
