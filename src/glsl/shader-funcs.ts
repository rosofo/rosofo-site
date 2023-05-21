export type Func = {
  definition: string;
  caller: (...args: any[]) => string;
};
export const defineFuncs = <
  F extends { [P in keyof S]: D },
  S extends string,
  D extends Func
>(
  funcs: F
): { defs: string } & { [P in keyof S]: F[P] } => {
  const defs = Object.values(funcs)
    .map((func) => func.definition)
    .join("\n");
  const callers = Object.fromEntries(
    Object.entries(funcs).map(([name, func]) => [name, func.caller])
  );
  return { defs, ...callers };
};
