export interface ParsedCata<E, A, R> {
  Failure: (e: E) => R;
  Success: (a: A) => R;
}

export interface Parsed<E, A> {
  datatype: "Parsed";
  match: <R>(cata: ParsedCata<E, A, R>) => R;
  pipe: <R>(fn: (f: Parsed<E, A>) => R) => R;
}

export const Failure = <E, A>(e: E): Parsed<E, A> => {
  const self: Parsed<E, A> = {
    datatype: "Parsed",
    match: (cata) => cata.Failure(e),
    pipe: (f) => f(self),
  };
  return self;
};

export const Success = <E, A>(a: A): Parsed<E, A> => {
  const self: Parsed<E, A> = {
    datatype: "Parsed",
    match: (cata) => cata.Success(a),
    pipe: (f) => f(self),
  };
  return self;
};

export const is = (f: any): f is Parsed<unknown, unknown> =>
  f?.datatype === "Parsed";

export const isFailure = <E, A>(f: Parsed<E, A>): boolean =>
  f.match({ Failure: () => true, Success: () => false });

export const isSuccess = <E, A>(f: Parsed<E, A>): boolean =>
  f.match({ Failure: () => false, Success: () => true });

export const fold1 =
  <E, A, B>(g: (e: E, b: B) => B, b: B) =>
  (f: Parsed<E, A>): B =>
    f.match({ Failure: (e) => g(e, b), Success: () => b });

export const fold_1 =
  <E, A, B>(g: (e: E, b: B) => B) =>
  (f: Parsed<E, A>, b: B) =>
    fold1(g, b)(f);

export const fold2 =
  <E, A, B>(g: (a: A, b: B) => B, b: B) =>
  (f: Parsed<E, A>): B =>
    f.match({ Failure: () => b, Success: (a) => g(a, b) });

export const fold_2 =
  <E, A, B>(g: (a: A, b: B) => B) =>
  (f: Parsed<E, A>, b: B) =>
    fold2(g, b)(f);

export const fold = fold2;
export const fold_ = fold_2;

export const map =
  <E, A, B>(g: (a: A) => B) =>
  (f: Parsed<E, A>): Parsed<E, B> =>
    f.match({ Failure: (e) => Failure(e), Success: (a) => Success(g(a)) });

export const first =
  <E, A, B>(g: (e: E) => B) =>
  (f: Parsed<E, A>): Parsed<B, A> =>
    f.match({ Failure: (e) => Failure(g(e)), Success: (a) => Success(a) });

export const second = map;

export const bimap =
  <A, B, C, D>(g: (a: A) => B, h: (c: C) => D) =>
  (f: Parsed<A, C>): Parsed<B, D> =>
    f.match({
      Success: (c) => Success(h(c)),
      Failure: (a) => Failure(g(a)),
    });

export const chain =
  <E, A, B>(g: (a: A) => Parsed<E, B>) =>
  (v: Parsed<E, A>): Parsed<E, B> =>
    v.match<Parsed<E, B>>({
      Success: g,
      Failure: Failure,
    });

export const and =
  <E1, E2, A, B, C>(g: (a: A) => Parsed<E1, B>) =>
  (h: (b: B) => Parsed<E2, C>): ((A: A) => Parsed<E1 | E2, C>) =>
  (a: A) =>
    g(a).pipe(chain<E1 | E2, B, C>((a) => h(a)));

export const ap =
  <E, A, B>(fa: Parsed<E[], A>) =>
  (fg: Parsed<E[], (a: A) => B>): Parsed<E[], B> =>
    fg.match({
      Success: (g) => fa.pipe(map(g)),
      Failure: (es1) =>
        fa.match({
          Success: () => Failure(es1),
          Failure: (es2) => Failure(es1.concat(es2)),
        }),
    });

export const alt =
  <E, A>(f1: Parsed<E[], A>) =>
  (f2: Parsed<E[], A>): Parsed<E[], A> =>
    f2.match({
      Success: (a) =>
        f1.match({
          Success: () => Success(a),
          Failure: (es2) => Failure(es2),
        }),
      Failure: (es1) =>
        f1.match({
          Success: () => Failure(es1),
          Failure: (es2) => Failure(es1.concat(es2)),
        }),
    });
