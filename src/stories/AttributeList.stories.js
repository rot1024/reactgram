import React from "react";
import { storiesOf } from "@storybook/react";

import Component from "../AttributeList";

export default () => {

  storiesOf("AttributeList", module)
    .add("default", () => (
      <Component
        attributes={[
          {
            id: "in1",
            input: true,
            children: "in1"
          },
          {
            id: "out1",
            output: true,
            children: "out1"
          },
          {
            id: "attr",
            children: "attr"
          },
          {
            id: "in+out",
            input: true,
            output: true,
            children: "in+out"
          }
        ]}
        onConnectionStart={(e, d) => console.log("onConnectionStart", d)}
        onConnect={(e, d) => console.log("onConnect", d)} />
    ));

};
