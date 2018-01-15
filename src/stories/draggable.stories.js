import React from "react";
import { storiesOf } from "@storybook/react";

import draggable from "../draggable";

export default () => {

  const stop = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  storiesOf("draggalbe", module)
    .addWithJSX("default", () => React.createElement(
      draggable()(ref => (
        <div
          style={{
            display: "inline-block",
            padding: "20px",
            backgroundColor: "#00f",
            color: "#fff"
          }}
          ref={ref}>
          Drag Me!
        </div>
      ))
    ))
    .addWithJSX("Handle element", () => React.createElement(
      draggable()((ref, handleRef) => (
        <div
          ref={ref}
          style={{
            display: "inline-block",
            padding: "20px",
            backgroundColor: "#00f",
            color: "#fff"
          }}>
          <div
            onMouseDown={stop}
            onTouchStart={stop}
            style={{
              backgroundColor: "#aaa",
              padding: "20px"
            }}
            ref={handleRef}>
            Drag me!
          </div>
        </div>
      ))
    ));

};
