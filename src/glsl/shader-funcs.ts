export interface Func<P extends Array<A>, A> {
  definition: string;
  (...args: P): string;
}
export const defineFuncs = (funcs: Func<unknown[], unknown>[]): string => {
  return Object.values(funcs)
    .map((func) => func.definition)
    .join("\n");
};

export const func = <P extends Array<A>, A>(
  def: string,
  caller: (...args: P) => string
): Func<P, A> => {
  const func: any = { ...caller };
  func.definition = def;
  return func;
};
