import React from "react";
import { storiesOf } from "@storybook/react";

import Component from "../NodeAttribute";

export default () => {

  storiesOf("NodeAttribute", module)
    .addWithJSX("default", () => (
      <Component
        data={{
          type: "test",
          title: "Test"
        }} />
    ));

};
