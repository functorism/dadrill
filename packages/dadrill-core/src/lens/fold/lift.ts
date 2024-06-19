import { ap, Fold, map } from ".";

export const liftA2 = <S, A, B, C>(
  g: (a: A) => (b: B) => C,
  ca: Fold<S, A>,
  cb: Fold<S, B>
) => ap(map(g, ca), cb);

export const liftA3 = <S, A, B, C, D>(
  g: (a: A) => (b: B) => (c: C) => D,
  ca: Fold<S, A>,
  cb: Fold<S, B>,
  cc: Fold<S, C>
) => ap(ap(map(g, ca), cb), cc);

export const liftA4 = <S, A, B, C, D, E>(
  g: (a: A) => (b: B) => (c: C) => (d: D) => E,
  ca: Fold<S, A>,
  cb: Fold<S, B>,
  cc: Fold<S, C>,
  cd: Fold<S, D>
) => ap(ap(ap(map(g, ca), cb), cc), cd);
