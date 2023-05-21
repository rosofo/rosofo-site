export type Func = {
  definition: string;
  caller: (...args: any[]) => string;
};
export class ShaderFuncs {
  funcs: Record<string, Func>;
  defs: string;
  callers: Record<string, (...args: any[]) => string>;

  constructor(funcs: Record<string, Func>) {
    this.funcs = funcs;
    this.defs = Object.values(funcs)
      .map((func) => func.definition)
      .join("\n");
    this.callers = Object.fromEntries(
      Object.entries(funcs).map(([name, func]) => [name, func.caller])
    );
  }
}
