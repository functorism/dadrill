import * as Lens from "..";
import * as Getter from "../../getter";
import * as Setter from "../../setter";

export const prop = <A, K extends keyof A>(k: K): Lens.Lens<A, A[K]> =>
  Lens.lens(
    Getter.getter((x) => x[k]),
    Setter.setter(
      (g) => (x) => ({ ...x, [k]: g(x[k]) }),
      (x) => (s) => ({ ...s, [k]: x })
    )
  );

export const index = <A>(i: number): Lens.Lens<ReadonlyArray<A>, A> =>
  Lens.lens(
    Getter.getter((xs) => xs[i] as A),
    Setter.setter(
      (g) => (xs) => [...xs.slice(0, i), g(xs[i] as A), ...xs.slice(i + 1)],
      (x) => (xs) => [...xs.slice(0, i), x, ...xs.slice(i + 1)]
    )
  );

export const key = <K extends keyof any, V>(k: K): Lens.Lens<Record<K, V>, V> =>
  prop(k);

type IndexByPath<A, K> = K extends { length: 0 }
  ? A
  : K extends [infer K1, ...infer KS]
    ? K1 extends keyof A
      ? IndexByPath<A[K1], KS>
      : never
    : never;

export const path = <A, K extends [string, ...string[]]>(
  ...ks: K
): Lens.Lens<A, IndexByPath<A, K>> => {
  const [k1, ...kns] = ks;
  return kns.reduce((l, k) => Lens.compose(l, prop(k)), prop<any, string>(k1));
};
