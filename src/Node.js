import React from "react";
import PropTypes from "prop-types";
import Draggable from "react-draggable";

import Handle from "./Handle";
import Attribute from "./Attribute";
import AttributeList from "./AttributeList";
import NodeAttribute from "./NodeAttribute";
import themeable from "./utils/themeable";

const defaultTheme = {
  ...Handle.defaultTheme,
  ...Attribute.defaultTheme,
  attribute: {
    ...Attribute.defaultTheme.attribute
  },
  nodeAttribute: {
    borderBottom: "1px solid #000"
  },
  singleAttribute: {
    borderBottom: "none"
  },
  node: {
    display: "inline-block",
    border: "1px solid #000",
    background: "#fff",
    WebkitTouchCallout: "none",
    WebkitUserSelect: "none",
    KhtmlUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none"
  }
};

export default class Node extends React.PureComponent {

  static propTypes = {
    attributes: AttributeList.propTypes.attributes,
    className: PropTypes.string,
    data: PropTypes.any,
    defaultPosition: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
    draggable: PropTypes.bool,
    handleRefs: PropTypes.object,
    handleTheme: PropTypes.any,
    nodeAttribute: PropTypes.shape({
      ...AttributeList.attributePropTypeShape,
      id: PropTypes.any
    }),
    onClick: PropTypes.func,
    onConnect: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    onConnectionStart: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    onDrag: PropTypes.func,
    onDragEnd: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    onHandleClick: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    position: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
    selected: PropTypes.bool,
    style: PropTypes.object,
    theme: PropTypes.any
  }

  static defaultProps = {
    theme: defaultTheme
  }

  static defaultTheme = defaultTheme

  moved = false

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

  handleStart() {
    this.moved = false;
  }

  handleDrag(e, { x, y, deltaX, deltaY, lastX, lastY }) {
    if (deltaX > 0 || deltaY > 0) {
      this.moved = true;
    }
    if (this.props.onDrag) {
      this.props.onDrag(e, { x, y, deltaX, deltaY, lastX, lastY });
    }
  }

  handleStop(e, { x, y, deltaX, deltaY, lastX, lastY }) {
    if (this.props.onDragEnd) {
      this.props.onDragEnd(e, { x, y, deltaX, deltaY, lastX, lastY });
    }
    if (!this.moved) {
      if (this.props.onClick) {
        this.props.onClick(e);
      }
    }
    this.moved = false;
  }

  render() {
    const {
      attributes,
      className,
      data,
      defaultPosition,
      draggable = true,
      handleRefs,
      nodeAttribute,
      position,
      selected,
      style,
      theme
    } = this.props;

    const t = themeable("node", theme, className, style);

    const dna = nodeAttribute && (
      !nodeAttribute.children || !nodeAttribute.component || !nodeAttribute.render
    ) ? NodeAttribute : undefined;

    return (
      <Draggable
        defaultPosition={defaultPosition}
        disabled={!draggable}
        onStart={() => this.handleStart()}
        onDrag={(e, d) => this.handleDrag(e, d)}
        onStop={(e, d) => this.handleStop(e, d)}
        position={position}>
        <div
          onClick={e => { e.stopPropagation(); }}
          {...t(null, {
            styleNames: ["node", ...selected ? ["selectedNode"] : []],
            style: {
              left: "0",
              position: "absolute",
              top: "0"
            }
          })}>
          <AttributeList
            attributes={[
              {
                ...nodeAttribute,
                id: "",
                ...dna ? {
                  component: dna,
                  draggable: true
                } : {},
                isNodeAttribute: true,
                single: !attributes || attributes.length === 0
              },
              ...attributes.map(a => ({ ...a, data })) || []
            ]}
            handleRefs={handleRefs}
            onConnectionStart={(e, d) => this.handleConnectionStart(e, d)}
            onConnect={(e, d) => this.handleConnect(e, d)}
            onHandleClick={(e, d) => this.handleHandleClick(e, d)}
            theme={theme} />
        </div>
      </Draggable>
    );
  }

}
