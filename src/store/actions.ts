import type { Action } from '../types';

export const addTask = (
  payload: Extract<Action, { type: 'ADD_TASK' }>['payload']
): Extract<Action, { type: 'ADD_TASK' }> => ({
  type: 'ADD_TASK',
  payload,
});

export const updateTask = (
  payload: Extract<Action, { type: 'UPDATE_TASK' }>['payload']
): Extract<Action, { type: 'UPDATE_TASK' }> => ({
  type: 'UPDATE_TASK',
  payload,
});

export const deleteTask = (
  payload: Extract<Action, { type: 'DELETE_TASK' }>['payload']
): Extract<Action, { type: 'DELETE_TASK' }> => ({
  type: 'DELETE_TASK',
  payload,
});

export const moveTask = (
  payload: Extract<Action, { type: 'MOVE_TASK' }>['payload']
): Extract<Action, { type: 'MOVE_TASK' }> => ({
  type: 'MOVE_TASK',
  payload,
});

export const setFilter = (
  payload: Extract<Action, { type: 'SET_FILTER' }>['payload']
): Extract<Action, { type: 'SET_FILTER' }> => ({
  type: 'SET_FILTER',
  payload,
});

export const undo = (): Extract<Action, { type: 'UNDO' }> => ({
  type: 'UNDO',
});

export const redo = (): Extract<Action, { type: 'REDO' }> => ({
  type: 'REDO',
});

export const hydrate = (
  payload: Extract<Action, { type: 'HYDRATE' }>['payload']
): Extract<Action, { type: 'HYDRATE' }> => ({
  type: 'HYDRATE',
  payload,
});
