import { renderer } from "dadrill-react-ant";

import { Drill } from "dadrill-react";
import { exampleData } from "../support/example-data";

export const DashboardAnt = () => {
  return (
    <div>
      <p>Ant</p>
      <Drill
        data={exampleData}
        renderer={renderer}
        onChange={(json) => console.log("updated", json)}
      />
    </div>
  );
};
