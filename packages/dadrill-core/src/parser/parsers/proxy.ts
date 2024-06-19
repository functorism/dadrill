import * as P from "..";

export const proxy =
  <A, E, B>(g: () => (a: A) => P.Parsed.Parsed<E, B>) =>
  (a: A) =>
    g()(a);
