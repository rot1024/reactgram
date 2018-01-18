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
    background: "#fff"
  }
};

export default class Node extends React.PureComponent {

  static propTypes = {
    attributes: AttributeList.propTypes.attributes,
    className: PropTypes.string,
    defaultPosition: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
    draggable: PropTypes.bool,
    handleRefs: PropTypes.object,
    handleTheme: PropTypes.any,
    input: PropTypes.bool,
    nodeAttributeChildren: PropTypes.node,
    nodeAttributeComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    nodeAttributeData: PropTypes.any,
    nodeAttributeRender: PropTypes.func,
    nodeAttributeTheme: PropTypes.any,
    onConnect: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    onConnectionStart: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    onDrag: PropTypes.func,
    onDragEnd: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    onHandleClick: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    output: PropTypes.bool,
    position: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
    style: PropTypes.object,
    theme: PropTypes.any
  }

  static defaultProps = {
    theme: defaultTheme
  }

  static defaultTheme = defaultTheme

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
      nodeAttributeChildren,
      nodeAttributeComponent,
      nodeAttributeData,
      nodeAttributeRender,
      nodeAttributeTheme,
      input,
      onDrag,
      onDragEnd,
      output,
      position,
      style,
      theme
    } = this.props;

    const t = themeable("node", theme, className, style);

    const dna =
      !nodeAttributeChildren || !nodeAttributeComponent || !nodeAttributeRender ?
        NodeAttribute : null;

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
          {...t("node")}>
          <AttributeList
            attributes={[
              {
                id: "",
                input,
                output,
                children: dna ? undefined : nodeAttributeChildren,
                component: dna || nodeAttributeComponent,
                data: nodeAttributeData,
                isNodeAttribute: true,
                render: dna ? undefined : nodeAttributeRender,
                single: !attributes || attributes.length === 0,
                theme: nodeAttributeTheme
              },
              ...attributes || []
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
