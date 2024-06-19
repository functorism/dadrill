import * as P from "..";

export const array =
  <I, A>(g: P.Parser<I, A>): P.Parser<I[], A[]> =>
  (input) =>
    Array.isArray(input)
      ? input.reduce<P.Parsed.Parsed<P.Error.ParseError, A[]>>(
          (res, x, i) =>
            res
              .pipe(P.Parsed.map((as) => (a: A) => as.concat(a)))
              .pipe(
                P.Parsed.ap(
                  g(x).pipe(
                    P.Parsed.first((e) =>
                      P.Error.withContext(
                        e,
                        P.Error.validationError(
                          `Failed to validate element at index ${i} in array.`,
                          i
                        )
                      )
                    )
                  )
                )
              ),
          P.Parsed.Success([])
        )
      : P.Parsed.Failure(P.Error.typeMatchError(input, "array"));
