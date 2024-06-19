import { Driller, useDrill } from "dadrill-react";
import { useState } from "react";
import { exampleData } from "../support/example-data";

export const DashboardDataControl = () => {
  const [rawJson, setRawJson] = useState(() =>
    JSON.stringify(exampleData, null, 2)
  );

  const ctx = useDrill({
    initData: exampleData,
    onChange: (json) => setRawJson(JSON.stringify(json, null, 2)),
  });

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"
      />
      <p>
        Set new json data in the textarea below and dadrill will render and
        update it accordingly.
      </p>
      <div>
        <h2>Raw JSON</h2>
        <textarea
          value={rawJson}
          onChange={(ev) => {
            setRawJson(ev.target.value);
            try {
              const json = JSON.parse(ev.target.value);
              ctx.setData(json);
            } catch (e) {}
          }}
        ></textarea>
      </div>
      <div>
        <h2>Driller</h2>
        <Driller drillContext={ctx} />
      </div>
    </div>
  );
};
