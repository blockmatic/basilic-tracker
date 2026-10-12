"use client";

import { createContext, useContext } from "react";

const BoardRenderStateContext = createContext<Record<string, unknown>>({});

export function BoardRenderStateProvider({
  state,
  children,
}: {
  state: Record<string, unknown>;
  children: React.ReactNode;
}) {
  return (
    <BoardRenderStateContext.Provider value={state}>
      {children}
    </BoardRenderStateContext.Provider>
  );
}

export function useBoardRenderState() {
  return useContext(BoardRenderStateContext);
}
