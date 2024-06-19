import * as P from "..";

type Record<R> = {
  [K in keyof R]: R[K] extends P.Parser<any, infer A>
    ? P.Parser<any, A>
    : never;
};

type Output<R extends Record<R>> = {
  [K in keyof R]: R[K] extends P.Parser<any, infer A> ? A : never;
};

export const record =
  <R extends Record<R>>(record: R): P.Parser<object, Output<R>> =>
  (input) =>
    (Object.keys(record) as Array<keyof R>).reduce(
      (res, k) =>
        res
          .pipe(
            P.Parsed.map((o1: object) => (o2: object) => ({ ...o1, ...o2 }))
          )
          .pipe(
            P.Parsed.ap(
              record[k](input[k as unknown as keyof typeof input]).pipe(
                P.Parsed.bimap(
                  (e) =>
                    P.Error.withContext(
                      e,
                      P.Error.validationError(
                        `Failed to validate property "${String(k)}" in object.`,
                        k as string
                      )
                    ),
                  (x) => ({ [k]: x })
                )
              )
            )
          ),
      P.Parsed.Success<P.Error.ParseError, object>({})
    ) as P.Parsed.Parsed<P.Error.ParseError, Output<R>>;
