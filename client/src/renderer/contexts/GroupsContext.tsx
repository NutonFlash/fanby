import {
  createContext,
  useReducer,
  useContext,
  Dispatch,
  Reducer,
  ReactNode,
  useMemo,
} from 'react';
import Group from '../models/Group';

interface GroupsState {
  groups: Group[];
}

interface GroupsAction {
  type: string;
  data: any;
}

const GroupsContext = createContext<
  { state: GroupsState; dispatch: Dispatch<GroupsAction> } | undefined
>(undefined);

const groupsReducer: Reducer<GroupsState, GroupsAction> = (
  state: GroupsState,
  action: GroupsAction,
) => {
  switch (action.type) {
    case 'set_groups':
      return { ...state, groups: action.data };
    case 'set_group': {
      const groups = [...state.groups].map((group) => {
        if (group.id === action.data.id) {
          return action.data;
        }
        return group;
      });
      return { ...state, groups };
    }
    case 'add_group': {
      const groups = [...state.groups];
      groups.push(action.data as Group);
      return { ...state, groups };
    }
    case 'delete_group': {
      const groups = [...state.groups].filter(
        (group) => group.id !== action.data.id,
      );
      return { ...state, groups };
    }
    default:
      return state;
  }
};

interface GroupsProviderProps {
  children: ReactNode;
}

export function GroupsProvider(props: GroupsProviderProps) {
  const { children } = props;

  const initialState: GroupsState = {
    groups: [],
  };

  const [state, dispatch] = useReducer(groupsReducer, initialState);

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <GroupsContext.Provider value={contextValue}>
      {children}
    </GroupsContext.Provider>
  );
}

export const useGroupsContext = () => {
  const context = useContext(GroupsContext);
  if (!context) {
    throw new Error('useGroupsContext must be used within a GroupsProvider');
  }
  return context;
};
