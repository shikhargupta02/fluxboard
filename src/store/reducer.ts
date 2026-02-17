import type { Action, BoardSnapshot, BoardState, ColumnId } from "../types";
import { deepClone } from "../utils/deepClone";
import { deepFreeze } from "../utils/immutable";
import { validateBoardState } from "../utils/validators";
import { initialState } from "./initialState";

const MAX_HISTORY = 15;

const columnIdToStatus: Record<ColumnId, "todo" | "in-progress" | "done"> = {
  todo: "todo",
  inProgress: "in-progress",
  done: "done",
};

function capStack<T>(stack: T[]): T[] {
  return stack.reverse().slice(0, MAX_HISTORY).reverse();
}

function snapshot(state: BoardState): BoardSnapshot {
  return deepClone({
    tasks: state.tasks,
    order: state.order,
  });
}

function pushHistory(state: BoardState): BoardState {
  const nextHistory = capStack([...state.history, snapshot(state)]);
  return {
    ...state,
    history: nextHistory,
    future: [],
  };
}

function clampIndex(index: number, length: number): number {
  if (index < 0) return 0;
  if (index > length) return length;
  return index;
}

export default function reducer(state: BoardState, action: Action): BoardState {
  switch (action.type) {
    case "ADD_TASK": {
      const base = pushHistory(state);

      const task = {
        ...action.payload,
        status: "todo" as const,
      };

      const next: BoardState = {
        ...base,
        tasks: {
          ...base.tasks,
          [task.id]: task,
        },
        order: {
          ...base.order,
          todo: [...base.order.todo, task.id],
        },
      };

      return deepFreeze(next);
    }

    case "UPDATE_TASK": {
      const { id, patch, updatedAt } = action.payload;
      const existing = state.tasks[id];
      if (!existing) return deepFreeze(state);

      const base = pushHistory(state);
      const nextTask = {
        ...existing,
        ...patch,
        updatedAt,
      };

      const next: BoardState = {
        ...base,
        tasks: {
          ...base.tasks,
          [id]: nextTask,
        },
      };

      return deepFreeze(next);
    }

    case "DELETE_TASK": {
      const { id } = action.payload;
      if (!state.tasks[id]) return deepFreeze(state);

      const base = pushHistory(state);
      const { [id]: _, ...rest } = base.tasks;

      const next: BoardState = {
        ...base,
        tasks: rest,
        order: {
          ...base.order,
          todo: base.order.todo.filter((tid) => tid !== id),
          inProgress: base.order.inProgress.filter((tid) => tid !== id),
          done: base.order.done.filter((tid) => tid !== id),
        },
      };

      return deepFreeze(next);
    }

    case "MOVE_TASK": {
      console.log("MOVE_TASK action received", action.payload);
      const { taskId, sourceColumn, targetColumn, targetIndex } =
        action.payload;
      const existing = state.tasks[taskId];
      if (!existing) return deepFreeze(state);

      const base = pushHistory(state);

      const sourceOrder = base.order[sourceColumn].filter(
        (tid) => tid !== taskId
      );

      const targetOrderBase =
        sourceColumn === targetColumn
          ? sourceOrder
          : [...base.order[targetColumn]];

      const insertAt = clampIndex(targetIndex, targetOrderBase.length);
      const targetOrder = [
        ...targetOrderBase.slice(0, insertAt),
        taskId,
        ...targetOrderBase.slice(insertAt),
      ];

      const nextTasks =
        sourceColumn === targetColumn
          ? base.tasks
          : {
              ...base.tasks,
              [taskId]: {
                ...existing,
                status: columnIdToStatus[targetColumn],
              },
            };

      const next: BoardState = {
        ...base,
        tasks: nextTasks,
        order: {
          ...base.order,
          [sourceColumn]: sourceOrder,
          [targetColumn]: targetOrder,
        },
      };

      return deepFreeze(next);
    }

    case "SET_FILTER": {
      const next: BoardState = {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
      return deepFreeze(next);
    }

    case "UNDO": {
      if (state.history.length === 0) return deepFreeze(state);

      const previous = state.history[state.history.length - 1];
      const nextHistory = state.history.slice(0, -1);
      const nextFuture = capStack([...state.future, snapshot(state)]);

      const next: BoardState = {
        ...state,
        tasks: previous.tasks,
        order: previous.order,
        history: nextHistory,
        future: nextFuture,
      };

      return deepFreeze(next);
    }

    case "REDO": {
      if (state.future.length === 0) return deepFreeze(state);

      const nextSnapshot = state.future[state.future.length - 1];
      const nextFuture = state.future.slice(0, -1);

      const nextHistory = capStack([...state.history, snapshot(state)]);

      const next: BoardState = {
        ...state,
        tasks: nextSnapshot.tasks,
        order: nextSnapshot.order,
        history: nextHistory,
        future: nextFuture,
      };

      return deepFreeze(next);
    }

    case "HYDRATE": {
      const payload = action.payload;
      if (!validateBoardState(payload)) return deepFreeze(initialState);

      const cloned = deepClone(payload as BoardState);
      const next: BoardState = {
        tasks: cloned.tasks,
        order: cloned.order,
        filters: {
          text: "",
          priority: null,
        },
        history: [],
        future: [],
      };

      return deepFreeze(next);
    }

    default: {
      return deepFreeze(state);
    }
  }
}
