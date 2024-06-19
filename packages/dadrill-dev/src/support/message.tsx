import * as DD from "dadrill-core";

export type Message = { type: string; content: string };

const messageParser = DD.pipe(
  DD.P.Parsers.record({
    type: DD.P.Parsers.string,
    content: DD.P.Parsers.string,
  }),
  DD.P.compose(DD.P.Parsers.object)
);

export const parseMessage = (a: DD.JsonValue): DD.Parsed<Message> =>
  messageParser(a).match<DD.Parsed<Message>>({
    Success: (a) => ({
      ok: true,
      value: { type: a.type, content: a.content },
    }),
    Failure: () => ({
      ok: false,
    }),
  });

export const messageFromJson =
  (m: Message) =>
  (a: DD.JsonValue): Message =>
    messageParser(a).match<Message>({
      Success: (a) => ({
        type: a.type,
        content: a.content,
      }),
      Failure: () => ({
        type: m.type,
        content: m.content,
      }),
    });

const messageTypes = ["ai", "user", "system"];

export const MessageView = (props: {
  message: Message;
  onChange: (a: Message) => void;
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
