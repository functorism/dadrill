export type Piper<A> = { pipe: <B>(f: (a: A) => B) => Piper<B>; get: () => A };

export const piper = <A>(a: A): Piper<A> => ({
  pipe: (f) => piper(f(a)),
  get: () => a,
});
