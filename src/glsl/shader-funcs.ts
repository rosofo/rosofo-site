export type Func<P extends Array<string>> = {
  definition: string;
  caller: (...args: P) => string;
};
export const defineFuncs = <
  F extends { [P in keyof S]: D },
  S extends string,
  D extends Func<P>,
  P extends Array<string>
>(
  funcs: F
): { defs: string } & { [P in keyof F]: F[P] } => {
  const defs = Object.values(funcs)
    .map((func) => func.definition)
    .join("\n");
  const callers: { [P in keyof F]: F[P] } = Object.fromEntries(
    Object.entries(funcs).map(([name, func]) => [name, func.caller])
  ) as any;
  return Object.assign(callers, { defs });
};
