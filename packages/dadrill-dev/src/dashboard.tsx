import { createRoot } from "react-dom/client";
import { useState } from "react";
import { DashboardZeroConfig } from "./showcase/1-zero-config";
import { DashboardDataControl as DashboardSetData } from "./showcase/2-set-data";
import { DashboardRewriters } from "./showcase/3-rewriters";
import { DashboardAnt } from "./showcase/4-ant";

const Examples = [
  ["Zero Config", DashboardZeroConfig],
  ["Setting Data", DashboardSetData],
  ["Rewriters", DashboardRewriters],
  ["Ant Design", DashboardAnt],
] as const;

const App = () => {
  const [example, setExample] = useState(
    Number(new URLSearchParams(window.location.search).get("example"))
  );

  const Example = Examples[example]?.[1] ?? Examples[0][1];

  return (
    <div>
      <h1>💾 Dashboard</h1>
      <div>
        <label>Example</label>
        <select
          value={example}
          onChange={(e) => {
            const ix = Number(e.target.value);
            window.history.replaceState(null, "", `?example=${ix}`);
            setExample(ix);
          }}
        >
          {Examples.map(([k], i) => (
            <option key={i} value={i}>
              {k}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Example />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
