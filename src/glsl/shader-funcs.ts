export type Func<P extends A[], A> = {
  def: string;
  caller: (...args: P) => string;
};

export const func = <P extends A[], A>(
  def: string,
  caller: (...args: P) => string
): Func<P, A> => ({
  def,
  caller,
});

export const defineFuncs = <P extends A[], A>(funcs: Func<P, A>[]) => {
  return funcs.map((f) => f.def).join("\n");
};
