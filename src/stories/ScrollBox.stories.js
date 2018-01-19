import React from "react";
import { storiesOf } from "@storybook/react";

import Component from "../ScrollBox";
import Grid from "../Grid";

export default () => {

  storiesOf("ScrollBox", module)
    .add("default", () => (
      <Component
        center
        width={2000}
        height={2000}
        onScroll={(e, d) => console.log("onScroll", d)}
        render={props => (
          <Grid
            backgroundColor="#434343"
            gridType="line"
            {...props} />
        )} />
    ))
    .add("ScrollPos", () => (
      <Component
        width={2000}
        height={2000}
        scrollX={1000}
        scrollY={500}
        onScroll={(e, d) => console.log("onScroll", d)}
        render={props => (
          <Grid
            backgroundColor="#434343"
            gridType="dot"
            {...props} />
        )} />
    ));

};
