import React, { useEffect } from "react";
import useUndoRedo from "../../hooks/useUndoRedo";
import "./UndoRedoControls.css";

const UndoRedoControls: React.FC = () => {
  const { undo, redo, canUndo, canRedo, historySize } = useUndoRedo();

  // Keyboard shortcuts: Ctrl+Z for undo, Ctrl+Shift+Z for redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.shiftKey && e.key === "Z") {
          e.preventDefault();
          if (canRedo) {
            redo();
          }
        } else if (e.key === "z" || e.key === "Z") {
          e.preventDefault();
          if (canUndo) {
            undo();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  return (
    <div className={"undo__root"}>
      <button
        onClick={undo}
        disabled={!canUndo}
        className={"undo__btn"}
        aria-label="Undo"
        title="Undo (Ctrl+Z)"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5 8C9.85 8 7.45 9 5.6 10.6L2 7V16H11L7.38 12.38C8.77 11.22 10.54 10.5 12.5 10.5C16.04 10.5 19.05 12.81 20.1 16L22.47 15.22C21.08 11.03 17.15 8 12.5 8Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className={"undo__btn"}
        aria-label="Redo"
        title="Redo (Ctrl+Shift+Z)"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.4 10.6C16.55 9 14.15 8 11.5 8C6.85 8 2.92 11.03 1.53 15.22L3.9 16C4.95 12.81 7.96 10.5 11.5 10.5C13.46 10.5 15.23 11.22 16.62 12.38L13 16H22V7L18.4 10.6Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <span className={"undo__history"}>History: {historySize}/15</span>
    </div>
  );
};

export default UndoRedoControls;
