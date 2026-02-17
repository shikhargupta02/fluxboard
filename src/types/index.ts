import type * as React from 'react';

// --- Primitives ---
export type TaskId = string;
export type ColumnId = 'todo' | 'inProgress' | 'done';
export type Priority = 1 | 2 | 3; // 1: Low, 2: Medium, 3: High

// --- Core Entity ---
export type Task = {
  id: TaskId;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: Priority;
  createdAt: number; // Unix timestamp ms
  updatedAt: number; // Unix timestamp ms
};

// --- Snapshot (what history stores — excludes history/future to avoid circular refs) ---
export type BoardSnapshot = {
  tasks: Record<TaskId, Task>;
  order: Record<ColumnId, TaskId[]>;
};

// --- Full Board State ---
export type BoardState = BoardSnapshot & {
  filters: {
    text: string;
    priority: Priority | null;
  };
  history: BoardSnapshot[]; // max 15
  future: BoardSnapshot[];
};

// --- Reducer Actions (discriminated union — no `any` payload) ---
export type Action =
  | { type: 'ADD_TASK'; payload: Task }
  | {
      type: 'UPDATE_TASK';
      payload: { id: TaskId; patch: Partial<Omit<Task, 'id' | 'createdAt'>>; updatedAt: number };
    }
  | { type: 'DELETE_TASK'; payload: { id: TaskId } }
  | {
      type: 'MOVE_TASK';
      payload: { taskId: TaskId; sourceColumn: ColumnId; targetColumn: ColumnId; targetIndex: number };
    }
  | { type: 'SET_FILTER'; payload: Partial<BoardState['filters']> }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'HYDRATE'; payload: unknown };

// --- DnD ---
export type DragState =
  | {
      taskId: TaskId;
      sourceColumn: ColumnId;
    }
  | null;

export type DropIndicator =
  | {
      columnId: ColumnId;
      index: number;
    }
  | null;

// --- Context shape ---
export type BoardContextValue = {
  state: BoardState;
  dispatch: React.Dispatch<Action>;
};

