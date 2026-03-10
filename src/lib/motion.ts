export function getMotionInitial<T extends Record<string, unknown>>(initial: T): T | false {
  return typeof window === "undefined" ? false : initial;
}
