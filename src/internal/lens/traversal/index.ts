import * as M from "../../maybe";
import * as Fold from "../fold";
import * as Setter from "../setter";
import { pipe } from "../../function";
import * as ExtraArray from "./extra/array";
import * as ExtraEquality from "./extra/equality";

export * from "./compose";

const Extra = { Array: ExtraArray, Equality: ExtraEquality };

export { Extra };

export interface Traversal<S, A> extends Fold.Fold<S, A>, Setter.Setter<S, A> {}

export const traversal = <S, A>(
  fold: Fold.Fold<S, A>,
  setter: Setter.Setter<S, A>
): Traversal<S, A> => ({
  ...fold,
  ...setter,
});

export const over = <S, A>(
  g: (a: A) => A,
  t: Traversal<S, A>
): Traversal<S, A> => traversal(t, pipe(t, Setter.over(g)));

export const reverse = <S, A, B>(
  t: Traversal<S, A>,
  a2b: (a: A) => B,
  b2a: (b: B) => A
): Traversal<S, B> =>
  traversal(
    Fold.fold((fold, empty, s) => t.foldr((a, b) => fold(a2b(a), b), empty, s)),
    Setter.modify((b2b) => t.modify((x) => b2a(b2b(a2b(x)))))
  );

export const _filtered = <A>(p: (a: A) => boolean): Traversal<A, A> =>
  traversal<A, A>(
    Fold.fold((fold, empty, s) => (p(s) ? fold(s, empty) : empty)),
    Setter.setter(
      (g) => (s) => (p(s) ? g(s) : s),
      (a) => (s) => (p(s) ? a : s)
    )
  );

export const _filteredOn = <A, B>(
  f: Fold.Fold<A, B>,
  p: (b: B) => boolean
): Traversal<A, A> =>
  traversal<A, A>(
    Fold.fold((fold, empty, s) =>
      pipe(s, Fold.preview(f)).pipe(M.fold(p, false)) ? fold(s, empty) : empty
    ),
    Setter.setter(
      (g) => (s) =>
        pipe(s, Fold.preview(f)).pipe(M.fold(p, false)) ? g(s) : s,
      (a) => (s) => (pipe(s, Fold.preview(f)).pipe(M.fold(p, false)) ? a : s)
    )
  );
