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
    id: PropTypes.string,
    input: PropTypes.bool,
    onConnect: PropTypes.func,
    onConnectionStart: PropTypes.func,
    onDrag: PropTypes.func,
    onDragEnd: PropTypes.func,
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

  // componentDidMount() {
  //
  // }

  // componentDidUpdate() {
  //
  // }

  handleConnectionStart(e, { attribute, index, type }) {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.onConnectionStart) {
      this.props.onConnectionStart(e, {
        attribute: index > 0 ? attribute : null,
        index: index - 1,
        type,
        isNodeAttribute: index === 0
      });
    }
  }

  handleConnect(e, { attribute, index, type }) {
    if (this.props.onConnect) {
      this.props.onConnect(e, {
        attribute: index > 0 ? attribute : null,
        index: index - 1,
        type,
        isNodeAttribute: index === 0
      });
    }
  }

  render() {
    const {
      attributes,
      className,
      defaultPosition,
      draggable = true,
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
              ...attributes
            ]}
            onConnectionStart={(e, d) => this.handleConnectionStart(e, d)}
            onConnect={(e, d) => this.handleConnect(e, d)} />
        </div>
      </Draggable>
    );
  }

}
