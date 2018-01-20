import React from "react";
import { storiesOf } from "@storybook/react";

import Component from "../NodeAttribute";

export default () => {

  storiesOf("NodeAttribute", module)
    .addWithJSX("default", () => (
      <Component
        data={{
          nodeType: "test",
          nodeTitle: "Test",
          nodeIcon: "data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20120%20120%22%3E%3Cpath%20d%3D%22M103.19%20120H16.526V0H55.96v46.3h47.23z%22%2F%3E%3Cpath%20d%3D%22M64.476%200v38.717h38.714z%22%2F%3E%3C%2Fsvg%3E"
        }} />
    ));

};
