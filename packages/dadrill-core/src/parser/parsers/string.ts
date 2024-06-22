import * as P from "..";

export const string = P.Parsers.guard(
  (x): x is string => typeof x === "string",
  (x) => P.Error.typeMatchError(x, "string")
);

export const literal =
  <S extends string>(s: S): P.Parser<string, S> =>
  (input) =>
    input === s
      ? P.Parsed.Success(input as S)
      : P.Parsed.Failure(
          P.Error.parseError(
            `Input "${input}" is not equal to expected literal "${s}".`
          )
        );
