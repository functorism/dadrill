import * as P from "..";

export const boolean = P.Parsers.guard(
  (x): x is boolean => typeof x === "boolean",
  (x) => P.Error.typeMatchError(x, "boolean")
);
