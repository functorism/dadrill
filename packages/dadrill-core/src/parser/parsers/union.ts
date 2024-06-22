import * as P from "..";
import { isSuccess } from "../parsed";

export const union =
  <PS extends Array<P.Parser<unknown, unknown>>>(
    ...ps: PS
  ): P.Parser<unknown, P.InferParserOutput<PS[number]>> =>
  (input) => {
    type Output = P.InferParserOutput<PS[number]>;

    let errors = [] as P.Error.ParseError;

    for (const p of ps) {
      const parsed = p(input);
      parsed.match({
        Success: () => {},
        Failure: (e) => {
          errors = errors.concat(e);
        },
      });
      if (isSuccess(parsed)) {
        return parsed as P.Parsed.Parsed<
          P.Error.ParseError,
          P.InferParserOutput<PS[number]>
        >;
      }
    }

    return P.Parsed.Failure(
      errors.map((e) => ({
        error: { message: "Didn't match any union case" },
        context: [e, ...(e.context ?? [])],
      }))
    ) as P.Parsed.Parsed<P.Error.ParseError, Output>;
  };
