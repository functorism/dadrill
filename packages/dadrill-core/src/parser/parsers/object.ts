import * as P from "..";

export const object = P.Parsers.guard(
  (x): x is object => typeof x === "object" && x !== null,
  (x) => P.Error.typeMatchError(x, "object")
);

// http://xahlee.info/js/js_Object.prototype.toString.html
export const plainObject = P.Parsers.guard(
  (x): x is object => Object.prototype.toString.call(x) === "[object Object]",
  (x) => P.Error.typeMatchError(x, "plain object")
);
