import React from "react";
import PropTypes from "prop-types";

import themeable from "./utils/themeable";

const Handle = ({
  children,
  className,
  handleRef,
  onClick,
  onConnect,
  onConnectionStart,
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
      {...t("handle")}>
      {children}
    </div>
  );
};

Handle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  handleRef: PropTypes.func,
  onClick: PropTypes.func,
  onConnect: PropTypes.func,
  onConnectionStart: PropTypes.func,
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
  }
};

export default Handle;
