import { useEffect, useRef } from "react";
import type { BoardState, BoardSnapshot } from "../types";
import { debounce } from "../utils/debounce";
import { validateBoardState } from "../utils/validators";

export function readPersistedState(): BoardSnapshot | null {
  try {
    if (
      typeof window === "undefined" ||
      typeof window.localStorage === "undefined"
    ) {
      return null;
    }

    const raw = localStorage.getItem("fluxboard-state");
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const fullState = {
      ...parsed,
      filters: { text: "", priority: null },
      history: [],
      future: [],
    };

    if (!validateBoardState(fullState)) {
      localStorage.removeItem("fluxboard-state");
      return null;
    }

    return parsed as BoardSnapshot;
  } catch {
    localStorage.removeItem("fluxboard-state");
    return null;
  }
}

export function useDebouncedLocalStorage(state: BoardState): void {
  const mountedRef = useRef(true);

  const debouncedWriteRef = useRef(
    debounce((...args: unknown[]) => {
      if (!mountedRef.current) return;

      const [data] = args as [string];
      if (
        typeof window === "undefined" ||
        typeof window.localStorage === "undefined"
      ) {
        return;
      }

      try {
        localStorage.setItem("fluxboard-state", data);
      } catch {
        console.error("Failed to write to localStorage");
      }
    }, 800)
  );

  useEffect(() => {
    const dataToPersist = {
      tasks: state.tasks,
      order: state.order,
    };
    debouncedWriteRef.current(JSON.stringify(dataToPersist));
  }, [state.tasks, state.order]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);
}
