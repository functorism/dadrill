import * as Fold from "..";

export const _each = <A>(): Fold.Fold<Iterable<A>, A> =>
  Fold.fold((fold, empty, s) => {
    let b = empty;
    for (const a of s) b = fold(a, b);
    return b;
  });

export const _ix = <A>(n: number): Fold.Fold<Iterable<A>, A> =>
  Fold.fold((fold, empty, s) => {
    let i = 0;
    for (const a of s) if (i++ === n) return fold(a, empty);
    return empty;
  });

export const _head = <A>(): Fold.Fold<Iterable<A>, A> =>
  Fold.fold((fold, empty, s) => {
    for (const a of s) return fold(a, empty);
    return empty;
  });
