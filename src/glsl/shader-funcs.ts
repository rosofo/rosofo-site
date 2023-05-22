export type Func<T, U = unknown, V = unknown> = {
  def: string;
} & (
  | {
      (a: T): string;
    }
  | { (a: T, b: U): string }
  | { (a: T, b: U, c: V): string }
);

export const func = <T, U = unknown, V = unknown>(
  def: string,
  caller: Omit<Func<T, U, V>, "def">
): Func<T, U, V> => {
  const f: Func<T, U, V> = (...args) => caller(...args);
  f.def = def;
  return f;
};
export const defineFuncs = (funcs: Func<any>[]) => {
  return funcs.map((f) => f.def).join("\n");
};
