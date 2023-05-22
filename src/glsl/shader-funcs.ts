export type Func<P> = {
  def: string;
  caller: (...args: P[]) => string;
};

export const func = <P>(
  def: string,
  caller: (...args: P[]) => string
): Func<P> => ({
  def,
  caller,
});

export const defineFuncs = <P>(funcs: Func<P>[]) => {
  return funcs.map((f) => f.def).join("\n");
};
