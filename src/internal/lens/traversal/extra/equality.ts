import * as Traversal from "..";
import * as Setter from "../../setter";
import * as Fold from "../../fold";

export const only = <A>(a: A): Traversal.Traversal<A, A> =>
  Traversal.traversal(
    Fold.fold((fold, empty, s) => (s === a ? fold(s, empty) : empty)),
    Setter.setter(
      (g) => (s) => s === a ? g(s) : s,
      (x) => (s) => s === a ? x : s
    )
  );
