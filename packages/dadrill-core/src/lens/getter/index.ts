import * as Fn from "../../function";
import * as Fold from "../fold";

export type View<S, A> = (s: S) => A;

export type Getter<S, A> = Fold.Fold<S, A> & {
  view: View<S, A>;
};

export const getter = <S, A>(view: View<S, A>): Getter<S, A> => ({
  view,
  foldr: (fold, empty, s) => fold(view(s), empty),
});

export const of = <A>(): Getter<A, A> => getter((a) => a);

export const view =
  <S, A>(g: Getter<S, A>) =>
  (s: S): A =>
    g.view(s);

export const compose = <A, B, C>(
  g1: Getter<A, B>,
  g2: Getter<B, C>
): Getter<A, C> => getter(Fn.compose(g1.view, g2.view));
