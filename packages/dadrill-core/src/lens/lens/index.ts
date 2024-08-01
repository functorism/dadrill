import * as Getter from "../getter";
import * as Setter from "../setter";

export * from "./compose";
export * from "./extra/object";

export type Lens<S, A> = Setter.Setter<S, A> & Getter.Getter<S, A>;

export const lens = <S, A>(
  getter: Getter.Getter<S, A>,
  setter: Setter.Setter<S, A>
): Lens<S, A> => ({
  ...getter,
  ...setter,
});

export const id = <A>(): Lens<A, A> =>
  lens(
    Getter.getter((a) => a),
    Setter.setter(
      (g) => (x) => g(x),
      (x) => () => x
    )
  );
