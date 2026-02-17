import type { BoardState, ColumnId } from "../types";

export function validateBoardState(raw: unknown): raw is BoardState {
  // Check 1: raw is a non-null object
  if (raw === null || typeof raw !== "object") {
    return false;
  }

  const obj = raw as Record<string, unknown>;

  // Check 2: raw.tasks is a non-null object
  if (
    obj.tasks === null ||
    typeof obj.tasks !== "object" ||
    Array.isArray(obj.tasks)
  ) {
    return false;
  }

  // Check 3: raw.order has exactly the keys 'todo', 'inProgress', 'done', each an Array
  if (
    obj.order === null ||
    typeof obj.order !== "object" ||
    Array.isArray(obj.order)
  ) {
    return false;
  }

  const order = obj.order as Record<string, unknown>;
  const requiredColumns: ColumnId[] = ["todo", "inProgress", "done"];

  for (const column of requiredColumns) {
    if (!(column in order) || !Array.isArray(order[column])) {
      return false;
    }
  }

  // Check for extra keys in order
  const orderKeys = Object.keys(order);
  if (orderKeys.length !== requiredColumns.length) {
    return false;
  }
  return true;
}
