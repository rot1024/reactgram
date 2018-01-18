import React from "react";
import PropTypes from "prop-types";

import Handle from "./Handle";

const Attribute = ({
  children,
  component,
  data,
  input,
  inputHandleRef,
  onInputClick,
  onInputConnect,
  onInputConnectionStart,
  onOutputClick,
  onOutputConnect,
  onOutputConnectionStart,
  output,
  outputHandleRef,
  render,
  style
}) => (
  <div
    style={{
      padding: "5px 15px 5px",
      position: "relative",
      ...style
    }}>
    {input && (
      <Handle
        handleRef={inputHandleRef}
        onClick={onInputClick}
        onConnect={onInputConnect}
        onConnectionStart={onInputConnectionStart}
        style={{
          position: "absolute",
          left: "-9px",
          top: "50%",
          marginTop: "-8px"
        }} />
    )}
    <div
      style={{
        textAlign: !input && output ? "right" : "left"
      }}>
      {component ? React.createElement(component, { data }) : render ? render({ data }) : children}
    </div>
    {output && (
      <Handle
        handleRef={outputHandleRef}
        onClick={onOutputClick}
        onConnect={onOutputConnect}
        onConnectionStart={onOutputConnectionStart}
        style={{
          position: "absolute",
          right: "-9px",
          top: "50%",
          marginTop: "-8px"
        }} />
    )}
  </div>
);

Attribute.propTypes = {
  children: PropTypes.any,
  component: PropTypes.any,
  data: PropTypes.any,
  input: PropTypes.bool,
  inputHandleRef: PropTypes.func,
  onInputClick: PropTypes.func,
  onInputConnect: PropTypes.func,
  onInputConnectionStart: PropTypes.func,
  onOutputClick: PropTypes.func,
  onOutputConnect: PropTypes.func,
  onOutputConnectionStart: PropTypes.func,
  output: PropTypes.bool,
  outputHandleRef: PropTypes.func,
  render: PropTypes.func,
  style: PropTypes.object
};

export default Attribute;
