import * as Lens from "../lens";

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
