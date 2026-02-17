import React, { useCallback, useState } from "react";
import type { Task } from "../../types";
import LiveTimer from "./LiveTimer";
import "./TaskCard.css";
import { useBoardContext } from "@/context/BoardContext";
import { deleteTask } from "@/store/actions";

interface TaskCardProps {
  task: Task;
  onEdit: (id: string) => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDragStart }) => {
  const { dispatch } = useBoardContext();
  const [isDragging, setIsDragging] = useState(false);
  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("taskId", task.id);
      setIsDragging(true);
      if (onDragStart) {
        onDragStart(e);
      }
    },
    [task.id]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDelete = useCallback(() => {
    dispatch(deleteTask({ id: task.id }));
  }, [dispatch, task.id]);

  const priorityMap: { [key: string]: string } = {
    1: "card__priority-badge--low",
    2: "card__priority-badge--medium",
    3: "card__priority-badge--high",
  };
  const TASK_LABELS: Record<string, string> = {
    1: "Low Priority",
    2: "Medium Priority",
    3: "High Priority",
  };

  return (
    <div
      className={`card__root${isDragging ? " card__root--dragging" : ""}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="card__header">
        <h3 className="card__title">{task.title}</h3>
      </div>

      {task.description && (
        <p className="card__description">{task.description}</p>
      )}

      <div className="card__footer">
        <span className={`card__priority-badge ${priorityMap[task.priority]}`}>
          {TASK_LABELS[task.priority]}
        </span>
        <LiveTimer updatedAt={task.createdAt} />
      </div>

      <div className="card__actions">
        <button
          className="card__icon-btn"
          onClick={() => {
            onEdit(task.id);
          }}
          title="Edit"
        >
          ✏️
        </button>
        <button
          className="card__icon-btn card__icon-btn--delete"
          onClick={handleDelete}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
