export * from "./compose";
export * from "./curry";
export * from "./pipe";

export const id = <A>(a: A): A => a;

export const constant =
  <A>(a: A) =>
  () =>
    a;

export const not =
  <A>(g: (a: A) => boolean) =>
  (a: A) =>
    !g(a);

type ReverseTuple<T> = T extends { length: 0 }
  ? []
  : T extends [infer T1, ...infer TS]
    ? [...ReverseTuple<TS>, T1]
    : never;

export const flipArgs =
  <A extends [...unknown[]], B>(g: (...args: A) => B) =>
  (...args: ReverseTuple<A>) =>
    g(...(args.reverse() as unknown as A));

export const flip =
  <A, B, C>(g: (a: A) => (b: B) => C) =>
  (b: B) =>
  (a: A) =>
    g(a)(b);

export const emptyArray = <A>(): A[] => [];
