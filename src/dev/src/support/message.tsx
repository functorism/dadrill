import * as DD from "dadrill";

export type Message = { type: string; content: string };

export const isMessage = (s: unknown): s is Message =>
  typeof s === "object" &&
  s !== null &&
  "type" in s &&
  typeof s["type"] === "string" &&
  "content" in s &&
  typeof s["content"] === "string";

export const messageFromJson =
  (json: Message) =>
  (a: DD.JsonValue): Message => {
    // @ts-ignore
    return { type: a["type"], content: a["content"] };
  };

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
