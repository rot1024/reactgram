import React from "react";
import PropTypes from "prop-types";

import Handle from "./Handle";
import themeable from "./utils/themeable";

const Attribute = ({
  children,
  component,
  contentClassName,
  contentStyle,
  contentTheme,
  className,
  data,
  handleClassName,
  handleStyle,
  handleTheme,
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
  style,
  theme = Attribute.defaultTheme
}) => {
  const t = themeable("attribute", theme, className, style);

  const sn = input && output ? "inputOutputAttribute" :
    input ? "inputAttribute" :
    output ? "outputAttribute" :
    "plainAttribute";

  const contentProps = {
    className: contentClassName,
    data,
    style: contentStyle,
    theme: contentTheme
  };

  return (
    <div
      {...t("attribute", ...sn)}>
      {input && (
        <Handle
          className={handleClassName}
          handleRef={inputHandleRef}
          onClick={onInputClick}
          onConnect={onInputConnect}
          onConnectionStart={onInputConnectionStart}
          style={{
            position: "absolute",
            left: "-9px",
            top: "50%",
            marginTop: "-8px",
            ...handleStyle
          }}
          theme={handleTheme} />
      )}
      {
        component ?
          React.createElement(component, contentProps) : render ?
            render(contentProps) : children
      }
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
          }}
          theme={handleTheme} />
      )}
    </div>
  );
};

Attribute.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  contentClassName: PropTypes.string,
  contentStyle: PropTypes.object,
  contentTheme: PropTypes.any,
  data: PropTypes.any,
  handleClassName: PropTypes.string,
  handleStyle: PropTypes.object,
  handleTheme: PropTypes.any,
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
  style: PropTypes.object,
  theme: PropTypes.any
};

Attribute.defaultTheme = {
  attribute: {
    padding: "5px 15px 5px",
    position: "relative"
  },
  plainAttribute: {},
  inputAttribute: {},
  outputAttribute: {
    textAlign: "right"
  },
  inputOutputAttribute: {}
};

export default Attribute;
