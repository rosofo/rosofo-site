export interface Func<P> {
  def: string;
  (...args: P[]): string;
}

export const func = <P>(
  def: string,
  caller: (...args: P[]) => string
): Func<P> => ({
  def,
  caller,
});

export const defineFuncs = (funcs: Func<any>[]) => {
  return funcs.map((f) => f.def).join("\n");
};
