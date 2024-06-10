import * as DD from "dadrill";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const Details = memo((props: { children: React.ReactNode; title?: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <details open={open} onToggle={() => setOpen((o) => !o)}>
      <summary>{props.title ?? "Details"}</summary>
      {open ? props.children : null}
    </details>
  );
});

export const DefaultWrapArray = memo(
  (props: { items: Array<{ child: React.ReactNode; label: string }> }) => {
    const [page, setPage] = useState(0);

    const PAGINATE_SIZE = 10;
    const pages = Math.ceil(props.items.length / PAGINATE_SIZE);

    if (props.items.length === 0) {
      return <div>No items</div>;
    }

    return (
      <div style={{ paddingLeft: "1em" }}>
        {props.items.length > PAGINATE_SIZE && (
          <>
            <button onClick={() => setPage((p) => Math.max(0, p - 1))}>
              Previous
            </button>
            <span>
              Page {page + 1} of {pages}
            </span>
            <button onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}>
              Next
            </button>
          </>
        )}
        {props.items
          .slice(page * PAGINATE_SIZE, (page + 1) * PAGINATE_SIZE)
          .map((v, i) => (
            <div key={i}>
              <Details title={v.label}>{v.child}</Details>
            </div>
          ))}
      </div>
    );
  }
);

export const DefaultWrapObject = memo(
  (props: { items: Array<{ child: React.ReactNode; label: string }> }) => {
    return (
      <div style={{ paddingLeft: "1em" }}>
        {props.items.map((v, i) => (
          <div key={i}>
            <h2>{v.label}</h2>
            {v.child}
          </div>
        ))}
      </div>
    );
  }
);

export type DrillRenderer = {
  WrapArray: React.FC<{
    items: Array<{ child: React.ReactNode; label: string }>;
  }>;
  WrapObject: React.FC<{
    items: Array<{ child: React.ReactNode; label: string }>;
  }>;
  WrapValue: React.FC<ValueProps>;
};

export const JsonEditor: React.FC<ValueProps> = memo(({ onChange, value }) => {
  if (typeof value === "string") {
    return (
      <textarea
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    );
  }

  if (typeof value === "number") {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.valueAsNumber)}
      />
    );
  }

  if (typeof value === "boolean") {
    return (
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
    );
  }

  console.log("Unknown", value);
  return <BaseCase value={value} onChange={onChange} />;
});

const BaseCase = memo(
  ({
    value,
    onChange,
  }: {
    value: DD.JsonValue;
    onChange: (a: DD.JsonValue) => void;
  }) => {
    const ctx = useContext(DataContext);
    console.log("ctx", ctx);
    console.log("Unknown", value);
    for (const rewriter of ctx.rewriters) {
      if (rewriter.rewriter.match(value)) {
        console.log("Matched", value);
        return rewriter.view({ value, onChange });
      }
    }
    return (
      <div>
        <textarea
          value={JSON.stringify(value, null, 2)}
          onChange={(e) => {
            try {
              const v = JSON.parse(e.target.value);
              onChange(v);
            } catch (e) {}
          }}
        />
      </div>
    );
  }
);

export const defaultDrillRenderer: DrillRenderer = {
  WrapArray: DefaultWrapArray,
  WrapObject: DefaultWrapObject,
  WrapValue: JsonEditor,
};

export const DrillerRec = memo(
  ({
    drill,
    renderer = defaultDrillRenderer,
  }: {
    drill: DD.Drill<DD.JsonValue, DD.JsonValue>;
    renderer?: DrillRenderer;
  }) =>
    DD.matchStructured_(drill, {
      Keyed: (value) => (
        <renderer.WrapObject
          items={Object.entries(value).map(([k, v]) => ({
            child: <DrillerRec drill={v} renderer={renderer} />,
            label: k,
          }))}
        />
      ),
      Indexed: (value) => (
        <renderer.WrapArray
          items={value.map((v, i) => ({
            child: <DrillerRec drill={v} renderer={renderer} />,
            label: `[${i}]`,
          }))}
        />
      ),
      Value: (value) => (
        <div>
          <RenderValueComp Comp={renderer.WrapValue} ann={value} />
        </div>
      ),
    })
);

export const Driller = memo(
  (props: { drillContext: DataContext; renderer?: DrillRenderer }) => {
    return (
      <DataContext.Provider value={props.drillContext}>
        <DrillerRec
          drill={props.drillContext.drill}
          renderer={props.renderer ?? defaultDrillRenderer}
        />
      </DataContext.Provider>
    );
  }
);

export type ValueProps = {
  onChange: (a: DD.JsonValue) => void;
  value: DD.JsonValue;
};

export const RenderValueComp = memo(
  (props: {
    Comp: React.FC<ValueProps>;
    ann: DD.Ann<DD.JsonValue, DD.JsonValue>;
  }) => {
    const onChange = useDrillOnChange(props.ann);
    return <props.Comp onChange={onChange} value={props.ann.value} />;
  }
);

export const useDrillOnChange = (ann: DD.Ann<DD.JsonValue, DD.JsonValue>) => {
  const data = useContext(DataContext);
  return useCallback(
    (value: DD.JsonValue) => data.update(ann.lens.set(value)),
    [data.update, ann]
  );
};

export type Rewriter<A extends DD.JsonValue> = {
  rewriter: DD.Rewrite<A>;
  view: React.FC<{ value: A; onChange: (a: A) => void }>;
};

export type Rewriters<A extends DD.JsonValue> = ReadonlyArray<Rewriter<A>>;

const emptyRewriters: Rewriters<DD.JsonValue> = [];

export type DataContext = {
  data: DD.JsonValue;
  drill: DD.Drill<DD.JsonValue, DD.JsonValue>;
  update: (modify: (json: DD.JsonValue) => DD.JsonValue) => void;
  setData: (json: DD.JsonValue) => void;
  rewriters: Rewriters<DD.JsonValue>;
};

export const DataContext = createContext<DataContext>(
  null as unknown as DataContext
);

export const useDrill = ({
  initData,
  onChange,
  rewriters = emptyRewriters,
}: {
  initData: DD.JsonValue;
  rewriters?: undefined | Rewriters<DD.JsonValue>;
  onChange?: undefined | ((json: DD.JsonValue) => void);
}): DataContext => {
  const internalRewriters = useMemo(() => {
    return rewriters.map((r) => r.rewriter);
  }, [rewriters]);

  const [state, setState] = useState<{
    cache: DD.DrillCache;
    data: DD.JsonValue;
    drill: DD.Drill<DD.JsonValue, DD.JsonValue>;
    rewriters: Rewriters<DD.JsonValue>;
  }>(() => {
    const cache = new WeakMap();
    return {
      data: initData,
      cache,
      drill: DD.drillFromJson({
        json: initData,
        rewriters: internalRewriters,
        cache,
      }),
      rewriters,
    };
  });

  return {
    ...state,
    rewriters,
    setData: useCallback(
      (json) => {
        setState((s) => ({
          ...s,
          data: json,
          drill: DD.drillFromJson({
            json,
            rewriters: internalRewriters,
            cache: s.cache,
          }),
        }));
      },
      [setState]
    ),
    update: useCallback(
      (modify) =>
        setState((s) => {
          const data_ = modify(s.data);
          onChange?.(data_);
          const drill_ = DD.drillFromJson({
            json: data_,
            rewriters: internalRewriters,
            cache: s.cache,
          });
          return { ...s, data: data_, drill: drill_ };
        }),
      [onChange, rewriters]
    ),
  };
};

export const Drill = (props: {
  data: DD.JsonValue;
  rewriters?: undefined | Rewriters<DD.JsonValue>;
  onChange?: undefined | ((json: DD.JsonValue) => void);
}) => {
  const drill = useDrill({
    initData: props.data,
    onChange: props.onChange,
    rewriters: props.rewriters,
  });

  return (
    <DataContext.Provider value={drill}>
      <DrillerRec drill={drill.drill} />
    </DataContext.Provider>
  );
};
