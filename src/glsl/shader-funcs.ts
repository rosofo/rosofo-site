export type Func<P extends any[]> = {
  def: string;
  caller: (...args: P) => string;
};

export const func = <P extends any[]>(
  def: string,
  caller: (...args: P) => string
): Func<P> => ({
  def,
  caller,
});

export const defineFuncs = <P extends any[]>(...funcs: Func<P>[]) => {
  return funcs.map((f) => f.def).join("\n");
};
