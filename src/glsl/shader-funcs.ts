export type Func<T, U = unknown, V = unknown> = {
  def: string;
} & F<T, U, V>;

type F<T, U = unknown, V = unknown> =
  | {
      (a: T): string;
    }
  | { (a: T, b: U): string }
  | { (a: T, b: U, c: V): string };

export const func = <T, U = unknown, V = unknown>(
  def: string,
  caller: F<T, U, V>
): Func<T, U, V> => {
  const f = caller.bind({ def });
  return f as Func<T, U, V>;
};
export const defineFuncs = (funcs: Func<any>[]) => {
  return funcs.map((f) => f.def).join("\n");
};
