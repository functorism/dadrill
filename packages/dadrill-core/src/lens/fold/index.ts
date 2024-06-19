import * as L from "list";
import * as M from "../../maybe";

export * from "./compose";
export * from "./extra/iterable";
export * from "./lift";

export type Foldr<S, A> = <B>(g: (a: A, b: B) => B, b: B, s: S) => B;

export interface Fold<S, A> {
  foldr: Foldr<S, A>;
}

export const fold = <S, A>(foldr: Foldr<S, A>): Fold<S, A> => ({
  foldr,
});

export const preview =
  <S, A>(f: Fold<S, A>) =>
  (s: S): M.Maybe<A> =>
    f.foldr(M.Just, M.Nothing(), s);

export const toList = <S, A>(s: S, f: Fold<S, A>): L.List<A> =>
  f.foldr((a, b) => L.concat(L.of(a), b), L.empty(), s);

export const map = <S, A, B>(g: (a: A) => B, f: Fold<S, A>): Fold<S, B> =>
  fold((fold, empty, s) => f.foldr((a, b) => fold(g(a), b), empty, s));

export const ap = <S, A, B>(
  f1: Fold<S, (a: A) => B>,
  f2: Fold<S, A>
): Fold<S, B> =>
  fold((fold, empty, s) =>
    L.foldr(fold, empty, L.ap(toList(s, f1), toList(s, f2)))
  );

export const concat = <S, A>(...fs: Array<Fold<S, A>>): Fold<S, A> =>
  fold((fold, empty, s) =>
    fs.reduce((b, f) => L.foldr(fold, b, toList(s, f)), empty)
  );

export const has = <S, A>(f: Fold<S, A>, a: A, s: S): boolean =>
  L.contains(a, toList(s, f));
