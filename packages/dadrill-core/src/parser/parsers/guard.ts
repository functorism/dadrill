import * as P from "..";

export const guard =
  <I, A extends I>(
    pred: (i: I) => i is A,
    toParseError: (i: I) => P.Error.ParseError
  ): P.Parser<I, A> =>
  (input) =>
    pred(input)
      ? P.Parsed.Success(input)
      : P.Parsed.Failure(toParseError(input));
