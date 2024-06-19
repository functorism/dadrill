import * as Parsers from "./parsers";
import * as Parsed from "./parsed";
import * as Error from "./error";

export { Parsed, Error, Parsers };

export interface Parser<I, O> {
  (i: I): Parsed.Parsed<Error.ParseError, O>;
}

export const compose =
  <A, B>(v1: Parser<A, B>) =>
  <C>(v2: Parser<B, C>): Parser<A, C> =>
  (i) =>
    v1(i).pipe(Parsed.chain((b) => v2(b)));
