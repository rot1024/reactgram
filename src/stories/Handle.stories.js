import React from "react";
import { storiesOf } from "@storybook/react";

import Component from "../Handle";

export default () => {

  storiesOf("Handle", module)
    .add("default", () => (
      <div>
        <Component
          onConnectionStart={() => console.log("connection start 1")}
          onConnect={() => console.log("connect 1")} />
        <Component
          onConnectionStart={() => console.log("connection start 2")}
          onConnect={() => console.log("connect 2")} />
      </div>
    ));

};
