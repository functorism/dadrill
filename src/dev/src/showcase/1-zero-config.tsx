import { Drill } from "../dadrill-react";
import { exampleData } from "../support/example-data";

export const DashboardZeroConfig = () => {
  return (
    <div>
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
