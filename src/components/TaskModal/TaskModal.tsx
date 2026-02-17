import React, { useEffect, useRef, useState, useCallback } from "react";
import type { TaskId, Priority } from "../../types";
import { useBoardContext } from "../../context/BoardContext";
import useTaskOperations from "../../hooks/useTaskOperations";
import "./TaskModal.css";

interface TaskModalProps {
  taskId: TaskId | null;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ taskId, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { state } = useBoardContext();
  const { addTask, updateTask } = useTaskOperations();

  const task = taskId ? state.tasks[taskId] : null;
  const isEditMode = taskId !== null;

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 2);
  const [titleError, setTitleError] = useState<string>("");

  useEffect(() => {
    dialogRef.current?.showModal();
    const dialog = dialogRef.current;
    if (!dialog) return;
  }, []);

  const handleClose = useCallback(() => {
    dialogRef.current?.close();
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!title.trim()) {
        setTitleError("Title is required");
        return;
      }

      if (title.length > 100) {
        setTitleError("Title must be 100 characters or less");
        return;
      }

      setTitleError("");

      if (isEditMode && taskId) {
        updateTask(taskId, {
          title: title.trim(),
          description: description.trim(),
          priority,
        });
      } else {
        addTask({
          title: title.trim(),
          description: description.trim(),
          priority,
        });
      }

      handleClose();
    },
    [
      title,
      description,
      priority,
      isEditMode,
      taskId,
      addTask,
      updateTask,
      handleClose,
    ]
  );

  return (
    <dialog
      ref={dialogRef}
      className={"modal__backdrop"}
      onClick={(e) => e.stopPropagation()}
    >
      <form onSubmit={handleSubmit} className={"modal__dialog"}>
        <div className={"modal__header"}>
          <h2 className={"modal__title"}>
            {isEditMode ? "Update Task" : "Create Task"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className={"modal__close-btn "}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className={"modal__body"}>
          <div className={"modal__field"}>
            <label htmlFor="title" className={"modal__label"}>
              Title{" "}
              <span style={{ color: "var(--md-sys-color-error, #ba1a1a)" }}>
                *
              </span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleError("");
              }}
              maxLength={100}
              className={titleError ? "modal__input--error" : "modal__input"}
              aria-invalid={!!titleError}
              aria-describedby={titleError ? "title-error" : undefined}
              autoFocus
            />
            {titleError && (
              <span
                id="title-error"
                className={"modal__error-msg"}
                role="alert"
              >
                {titleError}
              </span>
            )}
            <span>{title.length}/100</span>
          </div>

          <div className={"modal__field"}>
            <label htmlFor="description" className={"modal__label"}>
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={4}
              className={"modal__textarea"}
            />
            <span className={"model__label"}>{description.length}/500</span>
          </div>

          <div className={"modal__field"}>
            <fieldset className={"modal__priority-group"}>
              <legend className={"modal__label"}>Priority</legend>
              <div className={"modal__priority-option "}>
                <label>
                  <input
                    type="radio"
                    name="priority"
                    value="1"
                    checked={priority === 1}
                    onChange={() => setPriority(1)}
                  />
                  <span>Low</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="priority"
                    value="2"
                    checked={priority === 2}
                    onChange={() => setPriority(2)}
                  />
                  <span>Medium</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="priority"
                    value="3"
                    checked={priority === 3}
                    onChange={() => setPriority(3)}
                  />
                  <span>High</span>
                </label>
              </div>
            </fieldset>
          </div>
        </div>

        <div className={"modal__footer"}>
          <button
            type="button"
            onClick={handleClose}
            className={"modal__cancel-btn"}
          >
            Cancel
          </button>
          <button type="submit" className={"modal__submit-btn"}>
            {isEditMode ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default TaskModal;
