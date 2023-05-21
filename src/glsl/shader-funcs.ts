export interface Func<P extends Array<string>> {
  definition: string;
  (...args: P): string;
}
export const defineFuncs = <P extends Array<string>>(
  funcs: Func<P>[]
): string => {
  return Object.values(funcs)
    .map((func) => func.definition)
    .join("\n");
};

export const func = <P extends Array<string>>(
  def: string,
  caller: (...args: P) => string
): Func<P> => {
  const func: any = { ...caller };
  func.definition = def;
  return func;
};
