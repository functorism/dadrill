import * as M from ".";
import { Prism, Fold } from "../lens";

export const _Just = <A>(): Prism.Prism<M.Maybe<A>, A> => ({
  foldr: (g, b, m) => m.pipe(M.fold(g, b)),
  modify: (g) => (m) => m.pipe(M.map(g)),
  set: (a) => () => M.Just(a),
  review: M.Just,
});

export const _Nothing = <A>(): Fold.Fold<M.Maybe<A>, A> => ({
  foldr: (g, b, m) => m.pipe(M.fold(g, b)),
});
