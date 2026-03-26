export function prettyPrintJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export function cloneValues<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

