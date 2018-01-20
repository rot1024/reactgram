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
  draggable,
  handleClassName,
  input,
  inputConnected,
  inputHandleRef,
  isNodeAttribute,
  onInputClick,
  onInputConnect,
  onInputConnectionStart,
  onOutputClick,
  onOutputConnect,
  onOutputConnectionStart,
  output,
  outputConnected,
  outputHandleRef,
  render,
  single,
  style,
  theme = Attribute.defaultTheme
}) => {
  const t = themeable("attribute", theme, className, style);

  const dr = draggable === true || typeof children === "string";
  const stopPropagation = dr ? undefined : e => { e.stopPropagation(); };

  const sn = [
    "attribute",
    input && output ? "inputOutputAttribute" :
    input ? "inputAttribute" :
    output ? "outputAttribute" :
    "plainAttribute",
    ...isNodeAttribute ? ["nodeAttribute"] : [],
    ...single ? ["singleAttribute"] : []
  ];

  const contentProps = {
    className: contentClassName,
    data,
    style: contentStyle,
    theme: contentTheme
  };

  return (
    <div
      {...t(null, ...sn)}>
      {input && (
        <Handle
          className={handleClassName}
          connected={inputConnected}
          handleRef={inputHandleRef}
          onClick={onInputClick}
          onConnect={onInputConnect}
          onConnectionStart={onInputConnectionStart}
          input
          theme={theme} />
      )}
      <div
        onMouseDown={stopPropagation}
        onTouchStart={stopPropagation}>
        {
          component ?
            React.createElement(component, contentProps) : render ?
              render(contentProps) : children
        }
      </div>
      {output && (
        <Handle
          handleRef={outputHandleRef}
          onClick={onOutputClick}
          onConnect={onOutputConnect}
          onConnectionStart={onOutputConnectionStart}
          output
          connected={outputConnected}
          theme={theme} />
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
  draggable: PropTypes.bool,
  handleClassName: PropTypes.string,
  handleStyle: PropTypes.object,
  input: PropTypes.bool,
  inputConnected: PropTypes.bool,
  inputHandleRef: PropTypes.func,
  isNodeAttribute: PropTypes.bool,
  onInputClick: PropTypes.func,
  onInputConnect: PropTypes.func,
  onInputConnectionStart: PropTypes.func,
  onOutputClick: PropTypes.func,
  onOutputConnect: PropTypes.func,
  onOutputConnectionStart: PropTypes.func,
  output: PropTypes.bool,
  outputConnected: PropTypes.bool,
  outputHandleRef: PropTypes.func,
  render: PropTypes.func,
  single: PropTypes.bool,
  style: PropTypes.object,
  theme: PropTypes.any
};

Attribute.defaultTheme = {
  attribute: {
    padding: "10px 20px",
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
