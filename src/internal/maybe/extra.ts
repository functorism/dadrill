import * as M from ".";
import * as Fn from "../function";

export const fromMaybe =
  <A>(a: A) =>
  (f: M.Maybe<A>) =>
    f.pipe(M.fold(Fn.id, a));
