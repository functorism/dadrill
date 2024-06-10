import { pipe } from "../function/pipe";
import { Maybe, map, ap } from ".";
import { flip } from "../function";
import { curry2, curry3, curry4 } from "../function/curry";

export const liftM2 = <A, B, C>(
  g: (a: A, b: B) => C,
  ma: Maybe<A>,
  mb: Maybe<B>
) => pipe(curry2(g), flip(map)(ma), flip(ap)(mb));

export const liftM3 = <A, B, C, D>(
  g: (a: A, b: B, c: C) => D,
  ma: Maybe<A>,
  mb: Maybe<B>,
  mc: Maybe<C>
) => pipe(curry3(g), flip(map)(ma), flip(ap)(mb), flip(ap)(mc));

export const liftM4 = <A, B, C, D, E>(
  g: (a: A, b: B, c: C, d: D) => E,
  ma: Maybe<A>,
  mb: Maybe<B>,
  mc: Maybe<C>,
  md: Maybe<D>
) => pipe(curry4(g), flip(map)(ma), flip(ap)(mb), flip(ap)(mc), flip(ap)(md));

export const liftA2 = <A, B, C>(
  g: (a: A) => (b: B) => C,
  ma: Maybe<A>,
  mb: Maybe<B>
) => pipe(g, flip(map)(ma), flip(ap)(mb));

export const liftA3 = <A, B, C, D>(
  g: (a: A) => (b: B) => (c: C) => D,
  ma: Maybe<A>,
  mb: Maybe<B>,
  mc: Maybe<C>
) => pipe(g, flip(map)(ma), flip(ap)(mb), flip(ap)(mc));

export const liftA4 = <A, B, C, D, E>(
  g: (a: A) => (b: B) => (c: C) => (d: D) => E,
  ma: Maybe<A>,
  mb: Maybe<B>,
  mc: Maybe<C>,
  md: Maybe<D>
) => pipe(g, flip(map)(ma), flip(ap)(mb), flip(ap)(mc), flip(ap)(md));
