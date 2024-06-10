import * as Lens from "../lens";
import * as Traversal from "../traversal";

type LensesFromObject<A> = {
  [K in keyof A]: Lens.Lens<A, A[K]>;
};

export const lensesFromObject = <
  A extends Record<string, unknown>,
  K extends keyof A = keyof A,
  Lenses = LensesFromObject<A>,
>(
  a: A
): Lenses =>
  (Object.keys(a) as K[]).reduce(
    (lns, k) => ({
      ...lns,
      [k]: Lens.prop<A, K>(k),
    }),
    {} as Lenses
  );

export const lensesFromArray = <A>(xs: A[]) =>
  xs.map((_, i) => Traversal.Extra.Array._ix(i));
