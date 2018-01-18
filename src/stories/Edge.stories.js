import React from "react";
import { storiesOf } from "@storybook/react";

import Component from "../Edge";

export default () => {

  storiesOf("Edge", module)
    .addWithJSX("default", () => (
      <div>
        <Component
          x1={0}
          y1={0}
          x2={100}
          y2={100} />
        <Component
          x1={100}
          y1={0}
          x2={0}
          y2={100}
          strokeColor="red"
          strokeWidth={5}
          shadowRadius={2} />
        <Component
          x1={0}
          y1={100}
          x2={100}
          y2={0}
          strokeColor="blue"
          strokeWidth={20} />
        <Component
          x1={100}
          y1={100}
          x2={0}
          y2={0}
          strokeColor="rgba(0,255,0,0.5)"
          strokeWidth={20} />
        <Component
          x1={200}
          y1={100}
          x2={0}
          y2={0}
          strokeColor="rgba(255,0,255,0.5)"
          strokeWidth={20} />
        <Component
          x1={0}
          y1={0}
          x2={200}
          y2={12}
          strokeColor="red"
          strokeWidth={3}
          debug />
      </div>
    ));

};
