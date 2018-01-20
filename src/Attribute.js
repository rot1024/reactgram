import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

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
  isNodeAttribute,
  output,
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
          className={classNames(handleClassName, input && input.className)}
          connected={input && input.connected}
          handleRef={input ? input.handleRef : undefined}
          onClick={input ? input.onClick : undefined}
          onConnect={input ? input.onConnect : undefined}
          onConnectionStart={input ? input.onConnectionStart : undefined}
          input
          style={input ? input.style : undefined}
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
          className={classNames(handleClassName, output && output.className)}
          connected={output && output.connected}
          handleRef={output ? output.handleRef : undefined}
          onClick={output ? output.onClick : undefined}
          onConnect={output ? output.onConnect : undefined}
          onConnectionStart={output ? output.onConnectionStart : undefined}
          output
          style={output ? output.style : undefined}
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
  input: PropTypes.shape({
    className: PropTypes.string,
    connected: PropTypes.bool,
    handleRef: PropTypes.func,
    onClick: PropTypes.func,
    onConnect: PropTypes.func,
    onConnectionStart: PropTypes.func,
    style: PropTypes.object
  }),
  isNodeAttribute: PropTypes.bool,
  output: PropTypes.shape({
    className: PropTypes.string,
    connected: PropTypes.bool,
    handleRef: PropTypes.func,
    onClick: PropTypes.func,
    onConnect: PropTypes.func,
    onConnectionStart: PropTypes.func,
    style: PropTypes.object
  }),
  render: PropTypes.func,
  single: PropTypes.bool,
  style: PropTypes.object,
  theme: PropTypes.any
};

Attribute.defaultTheme = {
  ...Handle.defaultTheme,
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
