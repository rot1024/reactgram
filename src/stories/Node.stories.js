import React from "react";
import { storiesOf } from "@storybook/react";

import Node from "../Node";

export default () => {

  storiesOf("Node", module)
    .add("default", () => (
      <div>
        <Node
          attributes={[
            { id: "1", input: true, children: "in" },
            { id: "2", output: true, children: "out" },
            { id: "3", children: "attr" },
            { id: "4", input: true, output: true, children: "in+out" }
          ]}
          nodeAttributeData={{ title: "Test" }}
          style={{ marginRight: "20px" }}
          onConnectionStart={(e, d) => console.log("connection start", d)}
          onConnect={(e, d) => console.log("connect", d)} />
        <Node
          nodeAttributeData={{ title: "Test2" }}
          input
          output
          onConnectionStart={(e, d) => console.log("connection start", d)}
          onConnect={(e, d) => console.log("connect", d)} />
      </div>
    ));

};
