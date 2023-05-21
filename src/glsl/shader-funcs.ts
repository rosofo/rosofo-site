export type Func = {
  definition: string;
  caller: (...args: any[]) => string;
};
export const defineFuncs = (funcs: Record<string, Func>) => {
  const defs = Object.values(funcs)
    .map((func) => func.definition)
    .join("\n");
  const callers = Object.fromEntries(
    Object.entries(funcs).map(([name, func]) => [name, func.caller])
  );
  return { defs, callers };
};
