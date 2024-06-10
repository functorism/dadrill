import { createRoot } from "react-dom/client";
import { useState } from "react";
import { DashboardZeroConfig } from "./showcase/1-zero-config";
import { DashboardDataControl as DashboardSetData } from "./showcase/2-set-data";
import { DashboardRewriters } from "./showcase/3-rewriters";

const Examples = [
  ["Rewriters", DashboardRewriters],
  ["Zero Config", DashboardZeroConfig],
  ["Setting Data", DashboardSetData],
] as const;

const App = () => {
  const [example, setExample] = useState(0);
  const Example = Examples[example]![1]!;

  return (
    <div>
      <h1>💾 Dashboard</h1>
      <select
        value={example}
        onChange={(e) => setExample(Number(e.target.value))}
      >
        {Examples.map(([k], i) => (
          <option key={i} value={i}>
            {k}
          </option>
        ))}
      </select>
      <div>
        <Example />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
