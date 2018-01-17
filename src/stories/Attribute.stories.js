import React from "react";
import { storiesOf } from "@storybook/react";

import Component from "../Attribute";

export default () => {

  storiesOf("Attribute", module)
    .add("default", () => (
      <div>
        <div>
          <Component
            input
            output
            onInputConnectionStart={() => console.log("connection start on input")}
            onInputConnect={() => console.log("connect to input")}
            onOutputConnectionStart={() => console.log("connection start on output")}
            onOutputConnect={() => console.log("connect to output")}>
            Attribute
          </Component>
        </div>
        <div>
          <Component
            data={{ hoge: "hoge" }}
            input
            onInputConnectionStart={() => console.log("connection start on input")}
            onInputConnect={() => console.log("connect to input")}
            onOutputConnectionStart={() => console.log("connection start on output")}
            onOutputConnect={() => console.log("connect to output")}
            render={({ data }) => (
              <span style={{ color: "red" }}>
                {JSON.stringify(data)}
              </span>
            )} />
        </div>
      </div>
    ));

};
