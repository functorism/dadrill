import * as Fn from "../../function";

export type Modify<S, A> = (g: (a: A) => A) => (s: S) => S;

export type Set<S, A> = (a: A) => (s: S) => S;

export interface Setter<S, A> {
  modify: Modify<S, A>;
  set: Set<S, A>;
}

export const setter = <S, A>(
  modify: Modify<S, A>,
  set: Set<S, A>
): Setter<S, A> => ({
  modify,
  set,
});

export const modify = <S, A>(modify: Modify<S, A>): Setter<S, A> =>
  setter(modify, (a) => modify(() => a));

export const over =
  <S, A>(g: (a: A) => A) =>
  (s: Setter<S, A>): Setter<S, A> =>
    setter((h) => s.modify((x) => g(h(x))), s.set);

export const compose = <S, A, B>(
  s1: Setter<S, A>,
  s2: Setter<A, B>
): Setter<S, B> =>
  setter(Fn.compose(s2.modify, s1.modify), (b) => s1.modify(s2.set(b)));
