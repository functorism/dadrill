import * as DD from "dadrill-core";
import { Driller, Rewriter, Rewriters, useDrill } from "dadrill-react";
import { useState } from "react";
import { exampleData } from "../support/example-data";
import {
  Message,
  MessageView,
  messageFromJson,
  parseMessage,
} from "../support/message";

const msgRewriter = DD.Rewrite<Message>({
  parse: parseMessage,
  fromJson: messageFromJson,
  toJson: (a) => ({
    type: a.type,
    content: a.content,
  }),
});

const messageRewriter: Rewriter<Message> = {
  rewriter: msgRewriter,
  view: ({ value, onChange }) => (
    <MessageView message={value} onChange={onChange} />
  ),
};

const rewriters: Rewriters<any> = [messageRewriter];

export const DashboardRewriters = () => {
  const [data, setData] = useState<DD.JsonValue>({
    messages: exampleData.messages,
  });

  const ctx = useDrill({
    initData: { messages: exampleData.messages },
    onChange: (json) => setData(json),
    rewriters: rewriters,
  });

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"
      />
      <p>
        Rewriters are used to transform the data before it is rendered, and will
        use provided custom components to do so.
      </p>
      <p>
        In this example we have a rewriter that renders messages using a
        MessageView component.
      </p>
      <div>
        <h2>Driller</h2>
        <Driller drillContext={ctx} />
      </div>
      <div>
        <h3>Result JSON</h3>
        <pre>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
};
