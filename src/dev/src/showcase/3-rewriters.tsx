import { Rewriter, Rewriters, useDrill, Driller } from "../dadrill-react";
import { exampleData } from "../support/example-data";
import {
  Message,
  isMessage,
  messageFromJson,
  MessageView,
} from "../support/message";
import * as DD from "dadrill";

const msgRewriter = DD.Rewrite<Message>(
  isMessage,
  (a) => ({ type: a.type, content: a.content }),
  (b) => messageFromJson(b)
);

const messageRewriter: Rewriter<Message> = {
  rewriter: msgRewriter,
  view: ({ value, onChange }) => (
    <MessageView message={value} onChange={onChange} />
  ),
};

const rewriters: Rewriters<any> = [messageRewriter];

export const DashboardRewriters = () => {
  const ctx = useDrill({
    initData: { messages: exampleData.messages },
    onChange: (json) => console.log("updated", json),
    rewriters: rewriters,
  });

  return (
    <div>
      <p>
        Rewriters are used to transform the data before it is rendered, and will
        use provided custom components to do so.
      </p>
      <p>
        In this example we have a rewriter that renders messages using a
        MessageView component.
      </p>
      <Driller drillContext={ctx} />
    </div>
  );
};
