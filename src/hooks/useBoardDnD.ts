import type { DragEvent } from "react";
import { useRef } from "react";
import { useBoardContext } from "../context/BoardContext";
import useTaskFilters from "./useTaskFilters";
import { moveTask as moveTaskAction } from "../store/actions";
import type { TaskId, ColumnId, DragState } from "../types";

export const TASK_CARD_HEIGHT = 120;

export interface BoardDnDHandlers {
  onDragStart: (
    e: DragEvent<HTMLDivElement>,
    taskId: TaskId,
    sourceColumn: ColumnId
  ) => void;
  onDragOver: (
    e: DragEvent<HTMLDivElement>,
    columnId: ColumnId,
    index: number
  ) => void;
  onDrop: (
    e: DragEvent<HTMLDivElement>,
    targetColumn: ColumnId,
    index: number
  ) => void;
  onDragEnd: (e: DragEvent<HTMLDivElement>) => void;
  registerDropIndicator: (columnId: ColumnId, el: HTMLElement | null) => void;
}

export default function useBoardDnD(): BoardDnDHandlers {
  const { dispatch } = useBoardContext();
  const { filteredOrder, masterIndexMap, hasActiveFilters } = useTaskFilters();

  const dragStateRef = useRef<DragState>(null);
  const dropIndicatorRefs = useRef<Partial<Record<ColumnId, HTMLElement>>>({});
  const onDragStart = (
    e: DragEvent<HTMLDivElement>,
    taskId: TaskId,
    sourceColumn: ColumnId
  ) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", taskId);
    dragStateRef.current = { taskId, sourceColumn };
  };

  const onDragOver = (
    e: DragEvent<HTMLDivElement>,
    columnId: ColumnId,
    index: number
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const indicator = dropIndicatorRefs.current[columnId];
    if (indicator) {
      indicator.style.top = `${index * TASK_CARD_HEIGHT}px`;
      indicator.style.opacity = "1";
    }
  };

  const onDrop = (
    e: DragEvent<HTMLDivElement>,
    targetColumn: ColumnId,
    index: number
  ) => {
    e.preventDefault();
    if (!dragStateRef.current) return;
    const { taskId, sourceColumn } = dragStateRef.current;

    const masterIndex = hasActiveFilters
      ? masterIndexMap[targetColumn].get(filteredOrder[targetColumn][index]) ??
        index
      : index;

    dispatch(
      moveTaskAction({
        taskId,
        sourceColumn,
        targetColumn,
        targetIndex: masterIndex,
      })
    );

    const indicator = dropIndicatorRefs.current[targetColumn];
    if (indicator) indicator.style.opacity = "0";
    dragStateRef.current = null;
  };

  const onDragEnd = (_e: DragEvent<HTMLDivElement>) => {
    dragStateRef.current = null;

    Object.values(dropIndicatorRefs.current).forEach((element) => {
      if (element) element.style.opacity = "0";
    });
  };

  const registerDropIndicator = (
    columnId: ColumnId,
    el: HTMLElement | null
  ) => {
    if (el === null) {
      delete dropIndicatorRefs.current[columnId];
    } else {
      dropIndicatorRefs.current[columnId] = el;
    }
  };

  return {
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
    registerDropIndicator,
  };
}
