import * as Lens from ".";
import * as Getter from "../getter";
import * as Setter from "../setter";

export const compose_ = <S, A, B>(
  l1: Lens.Lens<S, A>,
  l2: Lens.Lens<A, B>
): Lens.Lens<S, B> =>
  Lens.lens(
    Getter.compose(
      l1,
      l2
    ),
    Setter.compose(
      l1,
      l2
    )
  );

export function compose<S, A, B>(
  t1: Lens.Lens<S, A>,
  t2: Lens.Lens<A, B>
): Lens.Lens<S, B>;

export function compose<S, A, B, C>(
  t1: Lens.Lens<S, A>,
  t2: Lens.Lens<A, B>,
  t3: Lens.Lens<B, C>
): Lens.Lens<S, C>;

export function compose<S, A, B, C, D>(
  t1: Lens.Lens<S, A>,
  t2: Lens.Lens<A, B>,
  t3: Lens.Lens<B, C>,
  t4: Lens.Lens<C, D>
): Lens.Lens<S, D>;

export function compose<S, A, B, C, D, E>(
  t1: Lens.Lens<S, A>,
  t2: Lens.Lens<A, B>,
  t3: Lens.Lens<B, C>,
  t4: Lens.Lens<C, D>,
  t5: Lens.Lens<D, E>
): Lens.Lens<S, E>;

export function compose<S, A, B, C, D, E, F>(
  t1: Lens.Lens<S, A>,
  t2: Lens.Lens<A, B>,
  t3: Lens.Lens<B, C>,
  t4: Lens.Lens<C, D>,
  t5: Lens.Lens<D, E>,
  t6: Lens.Lens<E, F>
): Lens.Lens<S, F>;

export function compose<S, A, B, C, D, E, F, G>(
  t1: Lens.Lens<S, A>,
  t2: Lens.Lens<A, B>,
  t3: Lens.Lens<B, C>,
  t4: Lens.Lens<C, D>,
  t5: Lens.Lens<D, E>,
  t6: Lens.Lens<E, F>,
  t7: Lens.Lens<F, G>
): Lens.Lens<S, G>;

export function compose<S, A, B, C, D, E, F, G, H>(
  t1: Lens.Lens<S, A>,
  t2: Lens.Lens<A, B>,
  t3: Lens.Lens<B, C>,
  t4: Lens.Lens<C, D>,
  t5: Lens.Lens<D, E>,
  t6: Lens.Lens<E, F>,
  t7: Lens.Lens<F, G>,
  t8: Lens.Lens<G, H>
): Lens.Lens<S, H>;

export function compose<S, A, B, C, D, E, F, G, H, I>(
  t1: Lens.Lens<S, A>,
  t2: Lens.Lens<A, B>,
  t3: Lens.Lens<B, C>,
  t4: Lens.Lens<C, D>,
  t5: Lens.Lens<D, E>,
  t6: Lens.Lens<E, F>,
  t7: Lens.Lens<F, G>,
  t8: Lens.Lens<G, H>,
  t9: Lens.Lens<H, I>
): Lens.Lens<S, I>;

export function compose<A>(f: Lens.Lens<A, A>, ...fs: Array<Lens.Lens<A, A>>) {
  return fs.reduce((f1, f2) => compose_(f1, f2), f);
}
