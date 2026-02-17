import React, { useState, Suspense, lazy, useCallback } from "react";
import type { TaskId } from "../../types";
import Column from "../Column/Column";
import UndoRedoControls from "../UndoRedoControls/UndoRedoControls";
import FilterBar from "../FilterBar/FilterBar";
import "./Board.css";
import useBoardDnD from "@/hooks/useBoardDnD";

const TaskModal = lazy(() => import("../TaskModal/TaskModal"));

interface ModalState {
  open: boolean;
  taskId: TaskId | null;
}

const Board: React.FC = () => {
  const [modalState, setModalState] = useState<ModalState>({
    open: false,
    taskId: null,
  });
  const { onDragOver, onDrop, onDragEnd, registerDropIndicator, onDragStart } =
    useBoardDnD();
  const handleAddTask = useCallback(() => {
    setModalState({ open: true, taskId: null });
  }, []);

  const handleEditTask = useCallback((taskId: TaskId) => {
    setModalState({ open: true, taskId });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalState({ open: false, taskId: null });
  }, []);

  return (
    <div className={"board__root"}>
      <header className={"board__header"}>
        <h1 className={"board__title"}>FluxBoard</h1>
        <div className={"board__header-actions"}>
          <UndoRedoControls />
          <button onClick={handleAddTask} className={"board__add-btn"}>
            Add Task
          </button>
        </div>
      </header>

      <FilterBar />

      <div className={"board__grid"}>
        <Column
          columnId="todo"
          onEditTask={handleEditTask}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          registerDropIndicator={registerDropIndicator}
          onDragStart={onDragStart}
        />
        <Column
          columnId="inProgress"
          onEditTask={handleEditTask}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          registerDropIndicator={registerDropIndicator}
          onDragStart={onDragStart}
        />
        <Column
          columnId="done"
          onEditTask={handleEditTask}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          registerDropIndicator={registerDropIndicator}
          onDragStart={onDragStart}
        />
      </div>

      {modalState.open && (
        <Suspense fallback={<div>Loading modal...</div>}>
          <TaskModal taskId={modalState.taskId} onClose={handleCloseModal} />
        </Suspense>
      )}
    </div>
  );
};

export default Board;
