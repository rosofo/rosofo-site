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
