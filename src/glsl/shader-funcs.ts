export type Func<T, U = unknown, V = unknown> = {
  def: string;
} & (
  | {
      (a: T): string;
    }
  | { (a: T, b: U): string }
  | { (a: T, b: U, c: V): string }
);

export const func = <P>(
  def: string,
  caller: (...args: P[]) => string
): Func<P> => {
  const f = (...args: P[]) => caller(...args);
  f.def = def;
  return f;
};
export const defineFuncs = (funcs: Func<any>[]) => {
  return funcs.map((f) => f.def).join("\n");
};
