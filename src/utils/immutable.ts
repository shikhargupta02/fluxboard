function isPlainObject(obj: unknown): obj is Record<string, unknown> {
  return (
    obj !== null &&
    typeof obj === "object" &&
    Object.prototype.toString.call(obj) === "[object Object]" &&
    Object.getPrototypeOf(obj) === Object.prototype
  );
}

export function deepFreeze<T>(obj: T): T {
  if (isPlainObject(obj)) {
    Object.freeze(obj);
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        deepFreeze(obj[key]);
      }
    }
  } else if (Array.isArray(obj)) {
    Object.freeze(obj);
    for (const item of obj) {
      deepFreeze(item);
    }
  }

  return obj;
}
