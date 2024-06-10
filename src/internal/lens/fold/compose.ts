import * as L from "list";
import * as Fold from ".";

const compose_ = <A, B, C>(
  f1: Fold.Fold<A, B>,
  f2: Fold.Fold<B, C>
): Fold.Fold<A, C> =>
  Fold.fold(<R>(fold: (c: C, r: R) => R, empty: R, a: A) =>
    L.foldr(
      fold,
      empty,
      L.chain((b) => Fold.toList(b, f2), Fold.toList(a, f1))
    )
  );

export function compose<S, A, B>(
  t1: Fold.Fold<S, A>,
  t2: Fold.Fold<A, B>
): Fold.Fold<S, B>;

export function compose<S, A, B, C>(
  t1: Fold.Fold<S, A>,
  t2: Fold.Fold<A, B>,
  t3: Fold.Fold<B, C>
): Fold.Fold<S, C>;

export function compose<S, A, B, C, D>(
  t1: Fold.Fold<S, A>,
  t2: Fold.Fold<A, B>,
  t3: Fold.Fold<B, C>,
  t4: Fold.Fold<C, D>
): Fold.Fold<S, D>;

export function compose<S, A, B, C, D, E>(
  t1: Fold.Fold<S, A>,
  t2: Fold.Fold<A, B>,
  t3: Fold.Fold<B, C>,
  t4: Fold.Fold<C, D>,
  t5: Fold.Fold<D, E>
): Fold.Fold<S, E>;

export function compose<S, A, B, C, D, E, F>(
  t1: Fold.Fold<S, A>,
  t2: Fold.Fold<A, B>,
  t3: Fold.Fold<B, C>,
  t4: Fold.Fold<C, D>,
  t5: Fold.Fold<D, E>,
  t6: Fold.Fold<E, F>
): Fold.Fold<S, F>;

export function compose<S, A, B, C, D, E, F, G>(
  t1: Fold.Fold<S, A>,
  t2: Fold.Fold<A, B>,
  t3: Fold.Fold<B, C>,
  t4: Fold.Fold<C, D>,
  t5: Fold.Fold<D, E>,
  t6: Fold.Fold<E, F>,
  t7: Fold.Fold<F, G>
): Fold.Fold<S, G>;

export function compose<S, A, B, C, D, E, F, G, H>(
  t1: Fold.Fold<S, A>,
  t2: Fold.Fold<A, B>,
  t3: Fold.Fold<B, C>,
  t4: Fold.Fold<C, D>,
  t5: Fold.Fold<D, E>,
  t6: Fold.Fold<E, F>,
  t7: Fold.Fold<F, G>,
  t8: Fold.Fold<G, H>
): Fold.Fold<S, H>;

export function compose<S, A, B, C, D, E, F, G, H, I>(
  t1: Fold.Fold<S, A>,
  t2: Fold.Fold<A, B>,
  t3: Fold.Fold<B, C>,
  t4: Fold.Fold<C, D>,
  t5: Fold.Fold<D, E>,
  t6: Fold.Fold<E, F>,
  t7: Fold.Fold<F, G>,
  t8: Fold.Fold<G, H>,
  t9: Fold.Fold<H, I>
): Fold.Fold<S, I>;

export function compose<A>(f: Fold.Fold<A, A>, ...fs: Array<Fold.Fold<A, A>>) {
  return fs.reduce((f1, f2) => compose_(f1, f2), f);
}
