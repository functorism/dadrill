export * from "./extra";
export * from "./optics";

export interface MaybeCata<A, R> {
  Just: (a: A) => R;
  Nothing: () => R;
}

export interface Maybe<A> {
  datatype: "Maybe";
  match: <R>(cata: MaybeCata<A, R>) => R;
  pipe: <R>(fn: (f: Maybe<A>) => R) => R;
}

export const Just = <A>(a: A): Maybe<A> => {
  const self: Maybe<A> = {
    datatype: "Maybe",
    match: (cata) => cata.Just(a),
    pipe: (f) => f(self),
  };
  return self;
};

export const Nothing = <A>(): Maybe<A> => {
  const self: Maybe<A> = {
    datatype: "Maybe",
    match: (cata) => cata.Nothing(),
    pipe: (f) => f(self),
  };
  return self;
};

export const is = (f: any): f is Maybe<unknown> => f?.datatype === "Maybe";

export const isJust = <A>(f: Maybe<A>): boolean =>
  f.match({ Just: () => true, Nothing: () => false });

export const isNothing = <A>(f: Maybe<A>): boolean =>
  f.match({ Just: () => false, Nothing: () => true });

export const fold =
  <A, B>(g: (a: A, b: B) => B, b: B) =>
  (f: Maybe<A>): B =>
    f.match({ Just: (a) => g(a, b), Nothing: () => b });

export const map =
  <A, B>(g: (a: A) => B) =>
  (f: Maybe<A>): Maybe<B> =>
    f.match({ Just: (a) => Just(g(a)), Nothing: () => Nothing() });

export const chain =
  <A, B>(g: (a: A) => Maybe<B>) =>
  (f: Maybe<A>): Maybe<B> =>
    f.match<Maybe<B>>({ Just: g, Nothing });

export const ap =
  <A, B>(fg: Maybe<(a: A) => B>) =>
  (fa: Maybe<A>): Maybe<B> =>
    fg.pipe(chain((g) => fa.pipe(map(g))));
