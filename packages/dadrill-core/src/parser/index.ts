import * as Parsers from "./parsers";
import * as Parsed from "./parsed";
import * as Error from "./error";

export { Parsed, Error, Parsers };

export interface Parser<I, O> {
  (i: I): Parsed.Parsed<Error.ParseError, O>;
}

export type InferParserOutput<P extends Parser<unknown, unknown>> =
  P extends Parser<unknown, infer O> ? O : never;

export type InferParserInput<P extends Parser<unknown, unknown>> =
  P extends Parser<infer I, unknown> ? I : never;

export const map =
  <A, B>(g: (a: A) => B) =>
  <I>(p: Parser<I, A>): Parser<I, B> =>
  (i) =>
    p(i).pipe(Parsed.map(g));

export const compose =
  <A, B>(v1: Parser<A, B>) =>
  <C>(v2: Parser<B, C>): Parser<A, C> =>
  (i) =>
    v1(i).pipe(Parsed.chain((b) => v2(b)));

export const pipe =
  <A, B, C>(v1: Parser<A, B>, v2: Parser<B, C>): Parser<A, C> =>
  (i) =>
    v1(i).pipe(Parsed.chain((b) => v2(b)));
