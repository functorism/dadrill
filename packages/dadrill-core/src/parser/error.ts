type VPath = string | number;

type VError = { message: string; path?: VPath };

export interface ParseError extends Array<VError> {}

export const validationError = (
  message: string,
  path: VPath = ""
): ParseError => [{ message, path }];

export const withContext = (err: ParseError, context: ParseError): ParseError =>
  err.concat(context);

export const typeMatchError = (input: unknown, expected: string) =>
  validationError(
    `Input of type "${typeof input}" is not of expected type "${expected}".`
  );

export const readParseError = (verr: ParseError) => {
  const path = verr.reduceRight(
    (s, x) =>
      x.path !== undefined
        ? typeof x.path === "number"
          ? `${s}[${x.path}]`
          : `${s}.${x.path}`
        : s,
    "input"
  );

  return {
    error: {
      message: verr[0]?.message,
      path,
    },
    trace: verr,
  };
};

export const showParseError = (verr: ParseError) => {
  const { error, trace } = readParseError(verr);
  return [
    "",
    "  ⚠️  " + error.message,
    "",
    `  🔎 At path: ${error.path}`,
    "",
    "  🗒️  Validation Trace:",
    "",
    trace.map((x) => "   📍 " + x.message).join("\n"),
    "",
  ].join("\n");
};
