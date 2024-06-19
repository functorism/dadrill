import * as P from "..";

export const guard =
  <I, A extends I>(
    p: (i: I) => i is A,
    show: (i: I) => P.Error.ParseError
  ): P.Parser<I, A> =>
  (input) =>
    p(input) ? P.Parsed.Success(input) : P.Parsed.Failure(show(input));
