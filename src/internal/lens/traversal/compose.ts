import * as Traversal from ".";
import * as Fold from "../fold";
import * as Setter from "../setter";

const compose_ = <S, A, B>(
  t1: Traversal.Traversal<S, A>,
  t2: Traversal.Traversal<A, B>
): Traversal.Traversal<S, B> =>
  Traversal.traversal(Fold.compose(t1, t2), Setter.compose(t1, t2));

export function compose<S, A, B>(
  t1: Traversal.Traversal<S, A>,
  t2: Traversal.Traversal<A, B>
): Traversal.Traversal<S, B>;

export function compose<S, A, B, C>(
  t1: Traversal.Traversal<S, A>,
  t2: Traversal.Traversal<A, B>,
  t3: Traversal.Traversal<B, C>
): Traversal.Traversal<S, C>;

export function compose<S, A, B, C, D>(
  t1: Traversal.Traversal<S, A>,
  t2: Traversal.Traversal<A, B>,
  t3: Traversal.Traversal<B, C>,
  t4: Traversal.Traversal<C, D>
): Traversal.Traversal<S, D>;

export function compose<S, A, B, C, D, E>(
  t1: Traversal.Traversal<S, A>,
  t2: Traversal.Traversal<A, B>,
  t3: Traversal.Traversal<B, C>,
  t4: Traversal.Traversal<C, D>,
  t5: Traversal.Traversal<D, E>
): Traversal.Traversal<S, E>;

export function compose<S, A, B, C, D, E, F>(
  t1: Traversal.Traversal<S, A>,
  t2: Traversal.Traversal<A, B>,
  t3: Traversal.Traversal<B, C>,
  t4: Traversal.Traversal<C, D>,
  t5: Traversal.Traversal<D, E>,
  t6: Traversal.Traversal<E, F>
): Traversal.Traversal<S, F>;

export function compose<S, A, B, C, D, E, F, G>(
  t1: Traversal.Traversal<S, A>,
  t2: Traversal.Traversal<A, B>,
  t3: Traversal.Traversal<B, C>,
  t4: Traversal.Traversal<C, D>,
  t5: Traversal.Traversal<D, E>,
  t6: Traversal.Traversal<E, F>,
  t7: Traversal.Traversal<F, G>
): Traversal.Traversal<S, G>;

export function compose<S, A, B, C, D, E, F, G, H>(
  t1: Traversal.Traversal<S, A>,
  t2: Traversal.Traversal<A, B>,
  t3: Traversal.Traversal<B, C>,
  t4: Traversal.Traversal<C, D>,
  t5: Traversal.Traversal<D, E>,
  t6: Traversal.Traversal<E, F>,
  t7: Traversal.Traversal<F, G>,
  t8: Traversal.Traversal<G, H>
): Traversal.Traversal<S, H>;

export function compose<S, A, B, C, D, E, F, G, H, I>(
  t1: Traversal.Traversal<S, A>,
  t2: Traversal.Traversal<A, B>,
  t3: Traversal.Traversal<B, C>,
  t4: Traversal.Traversal<C, D>,
  t5: Traversal.Traversal<D, E>,
  t6: Traversal.Traversal<E, F>,
  t7: Traversal.Traversal<F, G>,
  t8: Traversal.Traversal<G, H>,
  t9: Traversal.Traversal<H, I>
): Traversal.Traversal<S, I>;

export function compose<A>(
  t: Traversal.Traversal<A, A>,
  ...ts: Array<Traversal.Traversal<A, A>>
) {
  return ts.reduce((t1, t2) => compose_(t1, t2), t);
}
