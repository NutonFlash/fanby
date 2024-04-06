import {
  Dispatch,
  ReactNode,
  Reducer,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import WebSocketService from '../services/websocket';
import ApiService from '../services/api';
import { checkAndRefreshTokens } from '../services/tokens';

interface AppState {
  apiService: ApiService;
  socketService: WebSocketService;
}

interface AppAction {
  type: string;
  data: any;
}

const AppContext = createContext<
  { state: AppState; dispatch: Dispatch<AppAction> } | undefined
>(undefined);

const appReducer: Reducer<AppState, AppAction> = (
  state: AppState,
  action: AppAction,
) => {
  switch (action.type) {
    default:
      return state;
  }
};

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider(props: AppProviderProps) {
  const { children } = props;

  const apiService = new ApiService();
  const socketService = new WebSocketService();

  const initialState: AppState = {
    apiService,
    socketService,
  };

  const [state, dispatch] = useReducer(appReducer, initialState);

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  useEffect(() => {
    (async () => {
      const result = await checkAndRefreshTokens();
      if (result.type === 'success') {
        socketService.connect(window.electron.env.get('WSS_URL'));
      }
    })();
  }, []);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
