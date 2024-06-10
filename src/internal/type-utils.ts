export type DeepReveal<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: DeepReveal<O[K]> }
    : never
  : T;

export type TODO = any;
export const TODO: any = null as any;
export const hole = <A>(): A => TODO;
