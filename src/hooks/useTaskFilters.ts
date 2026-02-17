import { useMemo } from 'react';
import { useBoardContext } from '../context/BoardContext';
import type { ColumnId, TaskId } from '../types';

export interface TaskFiltersResult {
  filteredOrder: Record<ColumnId, TaskId[]>;
  masterIndexMap: Record<ColumnId, Map<TaskId, number>>;
  hasActiveFilters: boolean;
}

export default function useTaskFilters(): TaskFiltersResult {
  const { state } = useBoardContext();

  const filteredOrder = useMemo(() => {
    const result: Record<ColumnId, TaskId[]> = {
      todo: [],
      inProgress: [],
      done: [],
    };
    const textFilter = state.filters.text.trim().toLowerCase();
    const priorityFilter = state.filters.priority;

    for (const columnId of ['todo', 'inProgress', 'done'] as ColumnId[]) {
      const columnTaskIds = state.order[columnId];
      result[columnId] = columnTaskIds.filter((taskId) => {
        const task = state.tasks[taskId];
        if (!task) return false;

        if (priorityFilter !== null && task.priority !== priorityFilter) {
          return false;
        }

        if (textFilter !== '') {
          const titleMatch = task.title.toLowerCase().includes(textFilter);
          const descriptionMatch = task.description.toLowerCase().includes(textFilter);
          if (!titleMatch && !descriptionMatch) {
            return false;
          }
        }

        return true;
      });
    }

    return result;
  }, [state.order, state.tasks, state.filters.text, state.filters.priority]);

  const masterIndexMap = useMemo(() => {
    const result: Record<ColumnId, Map<TaskId, number>> = {
      todo: new Map(),
      inProgress: new Map(),
      done: new Map(),
    };

    for (const columnId of ['todo', 'inProgress', 'done'] as ColumnId[]) {
      const columnTaskIds = state.order[columnId];
      columnTaskIds.forEach((taskId, index) => {
        result[columnId].set(taskId, index);
      });
    }

    return result;
  }, [state.order]);

  const hasActiveFilters = state.filters.text !== '' || state.filters.priority !== null;

  return {
    filteredOrder,
    masterIndexMap,
    hasActiveFilters,
  };
}
