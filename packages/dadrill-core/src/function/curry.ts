export const curry2 =
  <A, B, C>(g: (a: A, b: B) => C) =>
  (a: A) =>
  (b: B) =>
    g(a, b);

export const curry3 =
  <A, B, C, D>(g: (a: A, b: B, c: C) => D) =>
  (a: A) =>
  (b: B) =>
  (c: C) =>
    g(a, b, c);

export const curry4 =
  <A, B, C, D, E>(g: (a: A, b: B, c: C, d: D) => E) =>
  (a: A) =>
  (b: B) =>
  (c: C) =>
  (d: D) =>
    g(a, b, c, d);

export const uncurry2 =
  <A, B, C>(g: (a: A) => (b: B) => C) =>
  (a: A, b: B) =>
    g(a)(b);

export const uncurry3 =
  <A, B, C, D>(g: (a: A) => (b: B) => (c: C) => D) =>
  (a: A, b: B, c: C) =>
    g(a)(b)(c);

export const uncurry4 =
  <A, B, C, D, E>(g: (a: A) => (b: B) => (c: C) => (d: D) => E) =>
  (a: A, b: B, c: C, d: D) =>
    g(a)(b)(c)(d);
