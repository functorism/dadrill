import * as P from "..";

export const number = P.Parsers.guard(
  (x): x is number => typeof x === "number",
  (x) => P.Error.typeMatchError(x, "number")
);
