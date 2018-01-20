import React from "react";
import PropTypes from "prop-types";

import themeable from "./utils/themeable";

const Handle = ({
  children,
  className,
  connected,
  handleRef,
  input,
  onClick,
  onConnect,
  onConnectionStart,
  output,
  style,
  theme = Handle.defaultTheme
}) => {
  const startConnect = e => {
    if (onConnectionStart) {
      onConnectionStart(e);
    }
  };

  const endConnect = e => {
    if (onConnect) {
      onConnect(e);
    }
  };

  const t = themeable("handle", theme, className, style);

  return (
    <div
      onClick={onClick}
      onMouseDown={startConnect}
      onTouchStart={startConnect}
      onMouseUp={endConnect}
      onTouchEnd={endConnect}
      ref={handleRef}
      {...t(
        null,
        "handle",
        ...input ? ["inputHandle"] : [],
        ...output ? ["outputHandle"] : [],
        ...connected ? ["connectedHandle"] : []
      )}>
      {children}
    </div>
  );
};

Handle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  connected: PropTypes.bool,
  handleRef: PropTypes.func,
  input: PropTypes.bool,
  onClick: PropTypes.func,
  onConnect: PropTypes.func,
  onConnectionStart: PropTypes.func,
  output: PropTypes.bool,
  style: PropTypes.object,
  theme: PropTypes.any
};

Handle.defaultTheme = {
  handle: {
    display: "inline-block",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    border: "1px solid #000",
    background: "#fff"
  },
  inputHandle: {
    position: "absolute",
    left: "-9px",
    top: "50%",
    marginTop: "-8px"
  },
  outputHandle: {
    position: "absolute",
    right: "-9px",
    top: "50%",
    marginTop: "-8px"
  },
  connectedHandle: {}
};

export default Handle;
