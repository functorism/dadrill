import * as Traversal from "../traversal";
import * as Review from "../review";
import * as Getter from "../getter";
import * as Setter from "../setter";
import * as Lens from "../lens";

export interface Prism<S, A>
  extends Traversal.Traversal<S, A>,
    Review.Review<S, A> {}

export const prism = <S, A>(
  t: Traversal.Traversal<S, A>,
  r: Review.Review<S, A>
): Prism<S, A> => ({
  ...t,
  ...r,
});

export const re = <S, A>(p: Prism<S, A>): Getter.Getter<A, S> =>
  Getter.getter(p.review);

export const outside = <S, A, B>(
  p: Prism<S, A>
): Lens.Lens<(s: S) => B, (a: A) => B> =>
  Lens.lens(
    Getter.getter((s) => (a: A) => s(p.review(a))),
    Setter.setter(
      (g) => (sb) => (s: S) =>
        p.foldr(
          g((a: A) => sb(p.review(a))),
          sb(s),
          s
        ),
      (g) => (sb) => (s: S) => p.foldr((a: A) => g(a), sb(s), s)
    )
  );
