export class DeepCloneError extends Error {
  override name = 'DeepCloneError';
  cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.cause = cause;
  }
}

export function deepClone<T>(value: T): T {
  try {
    return structuredClone(value);
  } catch (structuredCloneError) {
    try {
      return JSON.parse(JSON.stringify(value)) as T;
    } catch (jsonCloneError) {
      throw new DeepCloneError(
        'Failed to deepClone(): structuredClone() and JSON clone both failed.',
        { structuredCloneError, jsonCloneError }
      );
    }
  }
}
