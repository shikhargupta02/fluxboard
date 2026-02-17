import React, { useContext, useEffect, useReducer } from "react";
import type { BoardContextValue } from "../types";
import reducer from "../store/reducer";
import { initialState } from "../store/initialState";
import { hydrate } from "../store/actions";
import {
  useDebouncedLocalStorage,
  readPersistedState,
} from "../hooks/useDebouncedLocalStorage";

const BoardContext = React.createContext<BoardContextValue | null>(null);

type Props = {
  children: React.ReactNode;
};

export function BoardProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const persisted = readPersistedState();
    dispatch(hydrate(persisted));
  }, []);
  useDebouncedLocalStorage(state);
  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoardContext(): BoardContextValue {
  const context = useContext(BoardContext);
  if (context === null) {
    throw new Error("useBoardContext failed");
  }
  return context;
}
