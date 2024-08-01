import * as Fn from "../../function";
import * as M from "../../maybe";
import * as Getter from "../getter";
import * as Lens from "../lens";
import * as Prism from "../prism";
import * as Review from "../review";
import * as Setter from "../setter";

export type Iso<S, A> = Lens.Lens<S, A> & Prism.Prism<S, A>;

export const iso = <S, A>(
  view: (s: S) => A,
  review: (a: A) => S
): Iso<S, A> => ({
  ...Getter.getter(view),
  ...Review.review(review),
  ...Setter.setter<S, A>(
    (g) => (s) => review(g(view(s))),
    (a) => () => review(a)
  ),
});

export const reverseLens = <S, A>(
  f: (a: A) => S,
  l: Lens.Lens<S, A>
): Iso<S, A> =>
  iso<S, A>(
    (s) => l.view(s),
    (a) => f(a)
  );

export const review = <S, A>(iso: Iso<S, A>, a: A): S => from(iso).view(a);

export const from = <S, A>(i: Iso<S, A>): Iso<A, S> =>
  iso<A, S>(i.review, i.view);

export const re = <S, A>(i: Iso<S, A>): Getter.Getter<A, S> =>
  Getter.getter(i.review);

export const non = <A>(a: A): Iso<M.Maybe<A>, A> =>
  iso((m) => m.pipe(M.fromMaybe(a)), M.Just);

export const compose = <A, B, C>(i1: Iso<A, B>, i2: Iso<B, C>): Iso<A, C> =>
  iso(Fn.compose(i1.view, i2.view), Fn.compose(i2.review, i1.review));
