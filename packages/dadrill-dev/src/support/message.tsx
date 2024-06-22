import * as DD from "dadrill-core";

// ---- Internal ----

// This is the internal representation of a message that we use for our components.
// It is our common denominator for all messages.
// Since we want to support multiple sources of messages, we need to be able to
// parse them and transform our internal message back to the original source.

export type InternalMessage = {
  // These are the data points we care about for our internal representation.
  type: string;
  content: string;

  // This complement function has the job of transforming our internal message
  // back to the original source.
  complement: (m: InternalMessage) => DD.JsonValue;
};

// We define a parser that parses arbitrary JSON objects matching our expected
// internal message format.
// There is no need to define this parser if we never expect to receive our internal
// message format from the outside world, but here we assume that we might.
const internalMessageParser = DD.pipe(
  // Definition of parser rules,
  DD.P.pipe(
    DD.P.Parsers.object,
    DD.P.Parsers.record({
      type: DD.P.Parsers.string,
      content: DD.P.Parsers.string,
      // When receiving JSON, there will be no complement function, so no parsing of it; only data.
    })
  ),
  // For successful parses, we map the parsed result and define our complement function.
  DD.P.map(({ type, content }) => ({
    type,
    content,
    // The complement function is simple for our internal message format, we simply elide the
    // complement function and return the original message data.
    complement: (m: InternalMessage) => ({
      type: m.type,
      content: m.content,
    }),
  }))
);

// ---- External ----

// For demonstration purposes, we define a parser that parses OpenAI-style messages.
// We go about it much the same way as we did for our internal message format.

const openAIMessageParser = DD.pipe(
  DD.P.pipe(
    DD.P.Parsers.object,
    DD.P.Parsers.record({
      role: DD.P.Parsers.string,
      content: DD.P.Parsers.string,
    })
  ),
  DD.P.map(({ role, content }) => ({
    type: role,
    content,
    // The complement function now has an important job: to transform our internal message
    // back to the original OpenAI format.
    // Which in this simple case means renaming the type field to role.
    complement: (m: InternalMessage) => ({
      role: m.type,
      content: m.content,
    }),
  }))
);

// ---- Combine ----

// We combine our internal and OpenAI message parsers using the union combinator.
const messageParser = DD.P.Parsers.union(
  internalMessageParser,
  openAIMessageParser
);

// ---- Rewriter ----

// To define our rewriter we'll wire up three key functions: parse, fromJson, and toJson.

// For the parse function, we define a parse function which returns a simple parse result format,
// this expection is to make it as easy as possible to use any data validation or parsing solution.
export const parseMessage = (a: DD.JsonValue): DD.Parsed<InternalMessage> =>
  messageParser(a).match<DD.Parsed<InternalMessage>>({
    Success: (a) => ({ ok: true, value: a }),
    Failure: () => ({ ok: false }),
  });

// The fromJson function is responsible for converting JSON values into our internal message format,
// but since this operation is used in the rewriter after we have already successfully parsed our message,
// we're free to leverage the parse result to aid in this conversion.
export const messageFromJson =
  (m: InternalMessage) =>
  (a: DD.JsonValue): InternalMessage =>
    // Due to our parsing strategy, we can parse again with a fallback to previously parsed data.
    messageParser(a).match<InternalMessage>({
      Success: (a) => a,
      Failure: () => m,
    });

// We can now define our rewriter, and here we see that the toJson function is trivially implemented by
// using the complement function we've already produced in the parsing step.
export const messageRewriter = DD.Rewrite<InternalMessage>({
  parse: parseMessage,
  fromJson: messageFromJson,
  toJson: (a) => a.complement(a),
});

// ---- Component ----

// We're now free to write components on top of our internal message representation
// and any source data that we might receive will be read and updated by our rewriter.

const messageTypes = ["ai", "user", "system"];

export const MessageView = (props: {
  message: InternalMessage;
  onChange: (a: InternalMessage) => void;
}) => {
  return (
    <div>
      <select
        value={props.message.type}
        onChange={(e) =>
          props.onChange({ ...props.message, type: e.target.value })
        }
      >
        {messageTypes.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
      <textarea
        value={props.message.content}
        onChange={(e) =>
          props.onChange({ ...props.message, content: e.target.value })
        }
      />
    </div>
  );
};
