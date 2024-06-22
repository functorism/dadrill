import { constant, pipe } from "./function";
import * as L from "./lens";
import * as P from "./parser";

export { P, L, pipe };

// ---- JSON ----

export type JsonValue =
  | null
  | undefined
  | boolean
  | number
  | string
  | JsonObject
  | JsonArray;

export type JsonObject = { readonly [key: string]: JsonValue };
export type JsonArray = ReadonlyArray<JsonValue>;

// ---- Path ----

export type PathEntry =
  | Readonly<{ type: "Key"; key: string }>
  | Readonly<{ type: "Index"; index: number }>;

export type Path = ReadonlyArray<PathEntry>;

export const Key = (key: string): PathEntry => ({ type: "Key", key });
export const Index = (index: number): PathEntry => ({ type: "Index", index });

// ---- Drilled ----

export type Ann<S, A> = Readonly<{
  value: A;
  lens: L.Lens.Lens<S, A>;
  path: Path;
}>;

export type Drill<S, A> = Structured<Ann<S, A>>;

export const ann = <S, A>(args: {
  value: A;
  lens: L.Lens.Lens<S, A>;
  path: Path;
}): Ann<S, A> => args;

// ---- Structured ----

export type KeyedStructure<A> = { readonly [key: string]: Structured<A> };
export type IndexedStructure<A> = ReadonlyArray<Structured<A>>;

export type KeyedCase<A> = Readonly<{
  type: "Keyed";
  value: KeyedStructure<A>;
}>;

export type IndexedCase<A> = Readonly<{
  type: "Indexed";
  value: IndexedStructure<A>;
}>;

export type ValueCase<A> = Readonly<{ type: "Value"; value: A }>;

export type Structured<A> = KeyedCase<A> | IndexedCase<A> | ValueCase<A>;

export const Keyed = <A>(value: KeyedStructure<A>): Structured<A> => ({
  type: "Keyed",
  value,
});

export const Keyed$ = <A>(value: KeyedStructure<A>): KeyedCase<A> => ({
  type: "Keyed",
  value,
});

export const Indexed = <A>(value: IndexedStructure<A>): Structured<A> => ({
  type: "Indexed",
  value,
});

export const Indexed$ = <A>(value: IndexedStructure<A>): IndexedCase<A> => ({
  type: "Indexed",
  value,
});

export const Value = <A>(value: A): Structured<A> => ({ type: "Value", value });

export const Value$ = <A>(value: A): ValueCase<A> => ({ type: "Value", value });

export const isValue = <A>(s: Structured<A>): s is ValueCase<A> =>
  s.type === "Value";

export const isKeyed = <A>(s: Structured<A>): s is KeyedCase<A> =>
  s.type === "Keyed";

export const isIndexed = <A>(s: Structured<A>): s is IndexedCase<A> =>
  s.type === "Indexed";

export const _Value = <A>(): L.Traversal.Traversal<Structured<A>, A> =>
  L.Traversal.traversal(
    L.Fold.fold((fold, empty, s) => pipe(s, structureFold(fold, empty))),
    L.Setter.setter(
      (g) => (s) => pipe(s, structureMap(g)),
      (a) => (s) => pipe(s, structureMap(constant(a)))
    )
  );

export const _Keyed = <A>(): L.Traversal.Traversal<
  Structured<A>,
  KeyedStructure<A>
> =>
  L.Traversal.traversal(
    L.Fold.fold((fold, empty, s) =>
      pipe(
        s,
        matchStructured({
          Keyed: (value) =>
            Object.values(value).reduce(
              (acc, v) => _Keyed<A>().foldr(fold, acc, v),
              fold(value, empty)
            ),
          Indexed: (value) =>
            value.reduce((acc, v) => _Keyed<A>().foldr(fold, acc, v), empty),
          Value: () => empty,
        })
      )
    ),
    L.Setter.modify(
      (g) => (s) =>
        pipe(
          s,
          matchStructured({
            Keyed: (value) =>
              Keyed(
                g(
                  Object.fromEntries(
                    Object.entries(value).map(([k, v]) => [
                      k,
                      _Keyed<A>().modify(g)(v),
                    ])
                  )
                )
              ),
            Indexed: (value) => Indexed(value.map(_Keyed<A>().modify(g))),
            Value: () => s,
          })
        )
    )
  );

export const _Indexed = <A>(): L.Traversal.Traversal<
  Structured<A>,
  IndexedStructure<A>
> =>
  L.Traversal.traversal(
    L.Fold.fold((fold, empty, s) =>
      pipe(
        s,
        matchStructured({
          Keyed: (value) => _Indexed<A>().foldr(fold, empty, Keyed(value)),
          Indexed: (value) =>
            value.reduce(
              (acc, v) => _Indexed<A>().foldr(fold, acc, v),
              fold(value, empty)
            ),
          Value: () => empty,
        })
      )
    ),
    L.Setter.modify(
      (g) => (s) =>
        pipe(
          s,
          matchStructured({
            Keyed: (value) => pipe(Keyed(value), _Indexed<A>().modify(g)),
            Indexed: (value) => Indexed(g(value.map(_Indexed<A>().modify(g)))),
            Value: () => s,
          })
        )
    )
  );

export const matchStructured =
  <A, R>(match: {
    Keyed: (value: KeyedStructure<A>) => R;
    Indexed: (value: IndexedStructure<A>) => R;
    Value: (value: A) => R;
  }) =>
  (s: Structured<A>): R => {
    if (s.type === "Keyed") {
      return match.Keyed(s.value);
    } else if (s.type === "Indexed") {
      return match.Indexed(s.value);
    } else {
      return match.Value(s.value);
    }
  };

export const matchStructured_ = <A, R>(
  s: Structured<A>,
  match: {
    Keyed: (value: KeyedStructure<A>) => R;
    Indexed: (value: IndexedStructure<A>) => R;
    Value: (value: A) => R;
  }
): R => matchStructured(match)(s);

export const structureMap = <A, B>(
  f: (a: A) => B
): ((s: Structured<A>) => Structured<B>) =>
  matchStructured<A, Structured<B>>({
    Keyed: (value) => pipe(Keyed$(value), structureKeyedMap(f)),
    Indexed: (value) => pipe(Indexed$(value), structureIndexedMap(f)),
    Value: (value) => Value(f(value)),
  });

export const structureMap_ = <A, B>(
  s: Structured<A>,
  f: (a: A) => B
): Structured<B> => pipe(s, structureMap(f));

export const structureKeyedMap =
  <A, B>(f: (a: A) => B) =>
  (s: KeyedCase<A>): KeyedCase<B> =>
    Keyed$(
      Object.entries(s.value).reduce(
        (acc, [k, v]) => ({
          ...acc,
          [k]: structureMap(f)(v),
        }),
        {}
      )
    );

export const structureIndexedMap =
  <A, B>(f: (a: A) => B) =>
  (s: IndexedCase<A>): IndexedCase<B> =>
    Indexed$(s.value.map(structureMap(f)));

export const structureFold =
  <A, B>(f: (a: A, b: B) => B, b: B) =>
  (s: Structured<A>): B =>
    pipe(
      s,
      matchStructured({
        Keyed: (value) =>
          Object.values(value).reduce((acc, v) => structureFold(f, acc)(v), b),
        Indexed: (value) =>
          value.reduce((acc, v) => structureFold(f, acc)(v), b),
        Value: (value) => f(value, b),
      })
    );

export const structureFold_ = <A, B>(
  s: Structured<A>,
  f: (a: A, b: B) => B,
  b: B
): B => pipe(s, structureFold(f, b));

const isJsonObject = (json: JsonValue): json is JsonObject => {
  return (
    typeof json === "object" &&
    json !== null &&
    Object.prototype.toString.call(json) === "[object Object]"
  );
};

const isJsonArray = (json: JsonValue): json is JsonArray => Array.isArray(json);

const rewrite = <A>(
  from: (json: JsonValue) => A,
  to: (a: A) => JsonValue,
  json: A,
  lens: L.Lens.Lens<JsonValue, JsonValue>,
  path: Path
): Drill<JsonValue, A> =>
  Value({
    value: json,
    lens: L.Lens.compose(lens, L.Iso.iso<JsonValue, A>(from, to)),
    path,
  });

export type Parsed<A> = { ok: false } | { ok: true; value: A };

export type Rewrite<A> = {
  parse: (json: JsonValue) => Parsed<A>;
  fromJson: (a: A) => (json: JsonValue) => A;
  toJson: (a: A) => JsonValue;
};

export const Rewrite = <A>(args: {
  parse: (json: JsonValue) => Parsed<A>;
  fromJson: (a: A) => (json: JsonValue) => A;
  toJson: (a: A) => JsonValue;
}): Rewrite<A> => args;

export const emptyRewriters: Rewrite<any>[] = [];

export type DrillCache = WeakMap<
  JsonObject | JsonArray,
  Drill<JsonValue, JsonValue>
>;

export const drillFromJson = ({
  json,
  lens = L.Lens.id(),
  path = [],
  rewriters = [],
  cache = new WeakMap(),
}: {
  json: JsonValue;
  lens?: L.Lens.Lens<JsonValue, JsonValue>;
  path?: Path;
  rewriters?: Rewrite<any>[];
  cache?: DrillCache;
}): Drill<JsonValue, JsonValue> => {
  if (isJsonObject(json) || isJsonArray(json)) {
    if (cache.has(json)) {
      return cache.get(json)!;
    }

    for (const rewriter of rewriters) {
      const parsed = rewriter.parse(json);
      if (parsed.ok) {
        const rewritten = rewrite(
          rewriter.fromJson(parsed.value),
          rewriter.toJson,
          json,
          lens,
          path
        ) as Drill<JsonValue, JsonValue>;
        cache.set(json, rewritten);
        return rewritten;
      }
    }
  }

  if (isJsonObject(json)) {
    const keyed = Keyed(
      Object.entries(json).reduce(
        (acc, [k, v]) => ({
          ...acc,
          [k]: drillFromJson({
            json: v,
            lens: L.Lens.compose(
              lens as L.Lens.Lens<JsonValue, JsonObject>,
              L.Lens.prop(k)
            ),
            path: [...path, Key(k)],
            rewriters,
            cache,
          }),
        }),
        {} as KeyedStructure<Ann<JsonValue, JsonValue>>
      )
    );
    cache.set(json, keyed);
    return keyed;
  } else if (isJsonArray(json)) {
    const indexed = Indexed(
      json.map((v, i) =>
        drillFromJson({
          json: v,
          lens: L.Lens.compose(
            lens as L.Lens.Lens<JsonValue, ReadonlyArray<JsonValue>>,
            L.Lens.index(i)
          ),
          path: [...path, Index(i)],
          rewriters,
          cache,
        })
      )
    );
    cache.set(json, indexed);
    return indexed;
  } else {
    return Value({ value: json, lens, path });
  }
};

const keyedToRaw = <A, B>(
  s: KeyedStructure<A>,
  unwrap: (a: A) => B
): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(s).map(([k, v]) => [k, structureToRaw(v, unwrap)])
  );

const indexedToRaw = <A, B>(
  s: IndexedStructure<A>,
  unwrap: (a: A) => B
): unknown[] => s.map((v) => structureToRaw(v, unwrap));

const structureToRaw = <A, B>(s: Structured<A>, unwrap: (a: A) => B): unknown =>
  pipe(
    s,
    matchStructured<A, unknown>({
      Keyed: (value) => keyedToRaw(value, unwrap),
      Indexed: (value) => indexedToRaw(value, unwrap),
      Value: (value) => unwrap(value),
    })
  );
