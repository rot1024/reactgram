import React from "react";
import { storiesOf } from "@storybook/react";

import Component from "../Grid";

export default () => {

  const style = {
    position: "absolute",
    top: "0",
    left: "0",
    bottom: "0",
    right: "0",
    backgroundColor: "#434343"
  };

  storiesOf("Grid", module)
    .addWithJSX("None", () => (
      <Component
        style={style} />
    ))
    .addWithJSX("Line", () => (
      <Component
        gridType="line"
        style={style} />
    ))
    .addWithJSX("Dot", () => (
      <Component
        gridType="dot"
        style={style} />
    ));

};
