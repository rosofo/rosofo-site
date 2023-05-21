export interface Func<P extends Array<A>, A> {
  definition: string;
  (...args: P): string;
}
export const defineFuncs = (funcs: Func<any[], any>[]): string => {
  return Object.values(funcs)
    .map((func) => func.definition)
    .join("\n");
};

export const func = <P extends Array<A>, A>(
  def: string,
  caller: (...args: P) => string
): Func<P, A> => {
  return caller.bind({ definition: def }) as any;
};
