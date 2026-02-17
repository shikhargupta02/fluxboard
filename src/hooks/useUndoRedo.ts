import { useCallback } from "react";
import { useBoardContext } from "../context/BoardContext";
import {
  undo as undoActionCreator,
  redo as redoActionCreator,
} from "../store/actions";

export interface UndoRedoControls {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  historySize: number;
}

export default function useUndoRedo(): UndoRedoControls {
  const { state, dispatch } = useBoardContext();

  const canUndo = state.history.length > 0;
  const canRedo = state.future.length > 0;
  const historySize = state.history.length;

  const undoAction = useCallback(() => {
    dispatch(undoActionCreator());
  }, [dispatch]);

  const redoAction = useCallback(() => {
    dispatch(redoActionCreator());
  }, [dispatch]);

  return {
    undo: undoAction,
    redo: redoAction,
    canUndo,
    canRedo,
    historySize,
  };
}
