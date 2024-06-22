type VPath = string | number;

type VError = {
  error: { message: string; path?: VPath };
  context?: ParseError;
};

export type ParseError = Array<VError>;

export const parseError = (message: string, path: VPath = ""): ParseError => [
  { error: { message, path } },
];

export const parseErrorContext = (
  message: string,
  path: VPath = "",
  context: ParseError = []
): VError => ({
  error: { message, path },
  context,
});

export const withContext = (err: ParseError, context: VError): ParseError => [
  {
    error: context.error,
    context: err,
  },
];

export const typeMatchError = (input: unknown, expected: string) =>
  parseError(
    `Input of type "${typeof input}" is not of expected type "${expected}".`
  );

const flattenErrorPath = (e: VError): VPath[] => [
  ...(e.error.path ? [e.error.path] : []),
  ...(e.context?.flatMap(flattenErrorPath) ?? []),
];

const flattenErrorMessage = (e: VError): string[] => [
  e.error.message,
  ...(e.context?.flatMap(flattenErrorMessage) ?? []),
];

const treeSymMid = "├";
const treeSymEnd = "└";

export const showParseError = (verr: ParseError) => {
  const e = verr.map((e, i) => {
    const msg = ` [${i}] ️⛔ ${e.error.message}`;

    const paths = flattenErrorPath(e);
    const atPath = `     🔎 At path: ${paths.join(".")}`;

    const traces = flattenErrorMessage(e);
    const trace = [
      "     🗒️ Validation Trace:",
      "      |",
      ...traces.map(
        (msg, i, xs) =>
          `      ${i === xs.length - 1 ? treeSymEnd : treeSymMid} 📍 ${msg}`
      ),
    ];

    return [
      msg,
      ...(paths.length > 0 ? [atPath] : []),
      ...(traces.length > 1 ? [trace.join("\n")] : []),
    ].join("\n\n");
  });
  return e.join("\n\n");
};
