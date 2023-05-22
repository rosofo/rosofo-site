export type Func<P extends any[]> = {
  def: string;
  caller: (...args: P) => string;
};
