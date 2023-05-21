export type Func = {
  definition: string;
  caller: (...args: any[]) => string;
};
export class ShaderFuncs {
  funcs: Record<string, Func[]>;
  defs: Record<string, string> = {};
  callers: Record<string, ((...args: any[]) => string)[]> = {};

  constructor(funcs: Record<string, Func[]>) {
    this.funcs = funcs;
    this.defs = Object.fromEntries(
      Object.entries(funcs).map(([name, funcs]) => [
        name,
        funcs.map((func) => func.definition).join("\n"),
      ])
    );
  }
}
