import React from "react";
import PropTypes from "prop-types";
import Draggable from "react-draggable";

import AttributeList from "./AttributeList";

export default class Node extends React.PureComponent {

  static propTypes = {
    attributes: PropTypes.arrayOf(PropTypes.shape({
      children: PropTypes.any,
      id: PropTypes.string,
      input: PropTypes.bool,
      inputHandleData: PropTypes.any,
      output: PropTypes.bool,
      outputHandleData: PropTypes.any
    })),
    className: PropTypes.string,
    defaultPosition: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
    draggable: PropTypes.bool,
    // icon: PropTypes.any,
    handleRefs: PropTypes.object,
    id: PropTypes.string,
    input: PropTypes.bool,
    onConnect: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    onConnectionStart: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    onDrag: PropTypes.func,
    onDragEnd: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    onHandleClick: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    output: PropTypes.bool,
    position: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
    style: PropTypes.object,
    title: PropTypes.string
  }

  static defaultStyle = {
    display: "inline-block",
    border: "1px solid #000",
    background: "#fff"
  }

  handleEvent(propName, e, { attribute, index, type }) {
    if (this.props[propName]) {
      this.props[propName](e, {
        attribute: index > 0 ? attribute : null,
        index: index - 1,
        type,
        isNodeAttribute: index === 0
      });
    }
  }

  handleConnectionStart(e, ...args) {
    e.preventDefault();
    e.stopPropagation();
    this.handleEvent("onConnectionStart", e, ...args);
  }

  handleConnect(e, ...args) {
    e.preventDefault();
    e.stopPropagation();
    this.handleEvent("onConnect", e, ...args);
  }

  handleHandleClick(...args) {
    this.handleEvent("onHandleClick", ...args);
  }

  render() {
    const {
      attributes,
      className,
      defaultPosition,
      draggable = true,
      handleRefs,
      id,
      input,
      onDrag,
      onDragEnd,
      output,
      position,
      style,
      title
    } = this.props;

    return (
      <Draggable
        defaultPosition={defaultPosition}
        disabled={!draggable}
        onDrag={
          (e, {
            x,
            y,
            deltaX,
            deltaY,
            lastX,
            lastY
          }) => onDrag && onDrag({ x, y, deltaX, deltaY, lastX, lastY })
        }
        onStop={
          (e, {
            x,
            y,
            deltaX,
            deltaY,
            lastX,
            lastY
          }) => onDragEnd && onDragEnd({ x, y, deltaX, deltaY, lastX, lastY })
        }
        position={position}>
        <div
          className={className}
          id={id}
          style={{
            ...Node.defaultStyle,
            ...style
          }}>
          <AttributeList
            attributes={[
              {
                id: "",
                input,
                output,
                children: title,
                style: {
                  borderBottom: attributes && attributes.length > 0 ? "1px solid #000" : "none"
                }
              },
              ...attributes || []
            ]}
            handleRefs={handleRefs}
            onConnectionStart={(e, d) => this.handleConnectionStart(e, d)}
            onConnect={(e, d) => this.handleConnect(e, d)}
            onHandleClick={(e, d) => this.handleHandleClick(e, d)} />
        </div>
      </Draggable>
    );
  }

}
