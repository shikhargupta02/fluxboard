import { useCallback } from "react";
import { useBoardContext } from "../context/BoardContext";
import {
  addTask as addTaskAction,
  updateTask as updateTaskAction,
} from "../store/actions";
import type { Priority, TaskId, Task } from "../types";

export interface TaskOperations {
  addTask: (fields: {
    title: string;
    description: string;
    priority: Priority;
  }) => void;
  updateTask: (
    id: TaskId,
    patch: Partial<Omit<Task, "id" | "createdAt">>
  ) => void;
}

export default function useTaskOperations(): TaskOperations {
  const { dispatch } = useBoardContext();

  const addTask = useCallback(
    (fields: { title: string; description: string; priority: Priority }) => {
      const now = Date.now();
      const task: Task = {
        id: crypto.randomUUID(),
        title: fields.title,
        description: fields.description,
        priority: fields.priority,
        status: "todo",
        createdAt: now,
        updatedAt: now,
      };
      dispatch(addTaskAction(task));
    },
    [dispatch]
  );

  const updateTask = useCallback(
    (id: TaskId, patch: Partial<Omit<Task, "id" | "createdAt">>) => {
      dispatch(updateTaskAction({ id, patch, updatedAt: Date.now() }));
    },
    [dispatch]
  );

  return {
    addTask,
    updateTask,
  };
}
