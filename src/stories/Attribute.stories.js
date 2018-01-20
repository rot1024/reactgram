import React from "react";
import { storiesOf } from "@storybook/react";

import Component from "../Attribute";

export default () => {

  storiesOf("Attribute", module)
    .add("default", () => (
      <div>
        <div>
          <Component
            input={{
              onConnectionStart: () => console.log("connection start on input"),
              onConnect: () => console.log("connect to input")
            }}
            output={{
              onOutputConnectionStart: () => console.log("connection start on output"),
              onOutputConnect: () => console.log("connect to output")
            }}>
            Attribute
          </Component>
        </div>
        <div>
          <Component
            data={{ hoge: "hoge" }}
            input={{
              onConnectionStart: () => console.log("connection start on input"),
              onConnect: () => console.log("connect to input"),
              style: {
                backgroundColor: "red"
              }
            }}
            render={({ data }) => (
              <span style={{ color: "red" }}>
                {JSON.stringify(data)}
              </span>
            )} />
        </div>
      </div>
    ));

};
