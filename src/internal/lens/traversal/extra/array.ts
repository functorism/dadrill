import * as Traversal from "..";
import { Fold, Setter } from "../..";

export const _each = <A>(): Traversal.Traversal<Array<A>, A> =>
  Traversal.traversal(
    Fold.fold((fold, empty, s) => s.reduce((b, a) => fold(a, b), empty)),
    Setter.setter(
      (g) => (s) => s.map((a) => g(a)),
      (a) => (s) => s.map(() => a)
    )
  );

export const _ix = <A>(n: number): Traversal.Traversal<Array<A>, A> =>
  Traversal.traversal(
    Fold.fold((fold, empty, s) => {
      const x = s[n];
      return x === undefined ? empty : fold(x, empty);
      return empty;
    }),
    Setter.setter(
      (g) => (s) => s.map((a, i) => (i === n ? g(a) : a)),
      (a) => (s) => s.map((a_, i) => (i === n ? a : a_))
    )
  );

export const _head = <A>(): Traversal.Traversal<Array<A>, A> =>
  Traversal.traversal(
    Fold.fold((fold, empty, s) => {
      const x = s[0];
      return x === undefined ? empty : fold(x, empty);
      return empty;
    }),
    Setter.setter(
      (g) => (s) => s.map((a) => g(a)),
      (a) =>
        (s): A[] => [a, ...s.slice(1)]
    )
  );

export const _filtered = <A>(
  p: (a: A) => boolean
): Traversal.Traversal<Array<A>, A> =>
  Traversal.traversal(
    Fold.fold((fold, empty, s) =>
      s.reduce((b, a) => (p(a) ? fold(a, b) : b), empty)
    ),
    Setter.setter(
      (g) => (s) => s.map((a) => (p(a) ? g(a) : a)),
      (a) => (s) => s.map((a_) => (p(a_) ? a : a_))
    )
  );
