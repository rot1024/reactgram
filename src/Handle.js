import React from "react";
import PropTypes from "prop-types";

const Handle = ({
  children,
  className,
  handleRef,
  id,
  onClick,
  onConnect,
  onConnectionStart,
  style,
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

  return (
    <div
      className={className}
      id={id}
      style={{
        ...Handle.defaultStyle,
        ...style
      }}
      onClick={onClick}
      onMouseDown={startConnect}
      onTouchStart={startConnect}
      onMouseUp={endConnect}
      onTouchEnd={endConnect}
      ref={handleRef}>
      {children}
    </div>
  );
};

Handle.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  handleRef: PropTypes.func,
  id: PropTypes.string,
  onClick: PropTypes.func,
  onConnect: PropTypes.func,
  onConnectionStart: PropTypes.func,
  style: PropTypes.object
};

Handle.defaultStyle = {
  display: "inline-block",
  width: "16px",
  height: "16px",
  borderRadius: "50%",
  border: "1px solid #000",
  background: "#fff"
};

export default Handle;
