import React, { useCallback, useRef } from "react";
import type { ColumnId, TaskId } from "../../types";
import useTaskFilters from "../../hooks/useTaskFilters";
import type { DragEvent } from "react";
import { TASK_CARD_HEIGHT } from "../../hooks/useBoardDnD";
import { useBoardContext } from "../../context/BoardContext";
import VirtualList from "./VirtualList";
import TaskCard from "../TaskCard/TaskCard";
import "./Column.css";

interface ColumnProps {
  columnId: ColumnId;
  onEditTask: (id: TaskId) => void;
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

const COLUMN_TITLES: Record<ColumnId, string> = {
  todo: "To Do",
  inProgress: "In Progress",
  done: "Done",
};

const Column: React.FC<ColumnProps> = ({
  columnId,
  onEditTask,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  registerDropIndicator,
}) => {
  const { state } = useBoardContext();

  const { filteredOrder, hasActiveFilters } = useTaskFilters();

  const dropIndicatorRef = useRef<HTMLDivElement | null>(null);

  const setDropIndicatorRef = useCallback(
    (el: HTMLDivElement | null) => {
      dropIndicatorRef.current = el;
      registerDropIndicator(columnId, el);
    },
    [columnId, registerDropIndicator]
  );

  const filteredCount = filteredOrder[columnId].length;
  const totalCount = state.order[columnId].length;

  const renderCard = useCallback(
    (id: TaskId) => {
      const task = state.tasks[id];
      if (!task) return null;
      return (
        <TaskCard
          key={id}
          task={task}
          onEdit={onEditTask}
          onDragStart={(e) => onDragStart(e, id, columnId)}
        />
      );
    },
    [columnId, state.tasks, onEditTask]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const listContainer = e.currentTarget;
      const virtualListContainer =
        listContainer.firstElementChild as HTMLElement;
      if (!virtualListContainer) return;

      const scrollTop = virtualListContainer.scrollTop;
      const containerRect = listContainer.getBoundingClientRect();
      const y = e.clientY - containerRect.top + scrollTop;
      const index = Math.max(0, Math.floor(y / TASK_CARD_HEIGHT));
      onDragOver(e, columnId, index);
    },
    [columnId, onDragOver]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const listContainer = e.currentTarget;
      const virtualListContainer =
        listContainer.firstElementChild as HTMLElement;
      console.log("handleDrop", {
        columnId,
        clientY: e.clientY,
        containerRect: listContainer.getBoundingClientRect(),
      });
      if (!virtualListContainer) return;

      const scrollTop = virtualListContainer.scrollTop;
      const containerRect = listContainer.getBoundingClientRect();
      const y = e.clientY - containerRect.top + scrollTop;
      const index = Math.max(0, Math.floor(y / TASK_CARD_HEIGHT));
      onDrop(e, columnId, index);
    },
    [columnId, onDrop]
  );

  return (
    <div className={"col__root"}>
      <div className={"col__header"}>
        <h2 className={"col__title"}>{COLUMN_TITLES[columnId]}</h2>
        <span className={"col__badge"}>
          {hasActiveFilters ? `${filteredCount} / ${totalCount}` : totalCount}
        </span>
      </div>

      <div ref={setDropIndicatorRef} className={"col__drop"} />

      <div
        className={"col__body"}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnd={onDragEnd}
      >
        <VirtualList
          itemIds={filteredOrder[columnId]}
          renderItem={renderCard}
          itemHeight={TASK_CARD_HEIGHT}
        />
      </div>
    </div>
  );
};

export default Column;
