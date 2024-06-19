import { Drill } from "dadrill-react";
import { exampleData } from "../support/example-data";

export const DashboardZeroConfig = () => {
  return (
    <div>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"
      />
      <p>
        With zero config dadrill will render the data as is with the default
        view.
      </p>
      <Drill
        data={exampleData}
        onChange={(json) => console.log("updated", json)}
      />
    </div>
  );
};
