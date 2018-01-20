import React from "react";
import PropTypes from "prop-types";

import Attribute from "./Attribute";

const attributePropTypeShape = {
  children: PropTypes.node,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  data: PropTypes.any,
  draggable: PropTypes.bool,
  id: PropTypes.string.isRequired,
  input: PropTypes.bool,
  inputClassName: PropTypes.string,
  inputConnected: PropTypes.bool,
  inputStyle: PropTypes.object,
  isNodeAttribute: PropTypes.bool,
  output: PropTypes.bool,
  outputClassName: PropTypes.string,
  outputConnected: PropTypes.bool,
  outputStyle: PropTypes.object,
  render: PropTypes.func,
  single: PropTypes.bool,
  theme: PropTypes.any
};

export default class AttributeList extends React.PureComponent {

  static propTypes = {
    attributes: PropTypes.arrayOf(PropTypes.shape(attributePropTypeShape)),
    handleRefs: PropTypes.instanceOf(Map),
    onConnect: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    onConnectionStart: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    onHandleClick: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    theme: PropTypes.any
  }

  static defaultTheme = {
    ...Attribute.defaultTheme
  }

  static attributePropTypeShape = attributePropTypeShape

  handleEvent(propName, e, { a, i, type }) {
    if (this.props[propName]) {
      this.props[propName](e, { attribute: a, index: i, type });
    }
  }

  handleConnectionStart(...args) {
    this.handleEvent("onConnectionStart", ...args);
  }

  handleConnect(...args) {
    this.handleEvent("onConnect", ...args);
  }

  handleClick(...args) {
    this.handleEvent("onHandleClick", ...args);
  }

  setHandleRef(a, type, e) {
    const { handleRefs } = this.props;
    if (!handleRefs) return;

    if (!handleRefs.has(a.id)) {
      handleRefs.set(a.id, { input: null, output: null });
    }
    handleRefs.get(a.id)[type] = e;
  }

  render() {
    const {
      attributes,
      handleRefs,
      theme
    } = this.props;

    return (
      <React.Fragment>
        {attributes && attributes.map((a, i) => (
          <Attribute
            key={a.id}
            component={a.component}
            contentTheme={a.theme}
            data={a.data}
            draggable={a.draggable}
            input={a.input ? {
              className: a.inputClassName,
              connected: a.inputConnected,
              handleRef: handleRefs ? e => { this.setHandleRef(a, "input", e); } : undefined,
              onClick: e => this.handleClick(e, { type: "input", a, i }),
              onConnectionStart: e => this.handleConnectionStart(e, { type: "input", a, i }),
              onConnect: e => this.handleConnect(e, { type: "input", a, i }),
              style: a.inputStyle
            } : undefined}
            isNodeAttribute={a.isNodeAttribute}
            output={a.output ? {
              className: a.outputClassName,
              connected: a.outputConnected,
              handleRef: handleRefs ? e => { this.setHandleRef(a, "output", e); } : undefined,
              onClick: e => this.handleClick(e, { type: "output", a, i }),
              onConnect: e => this.handleConnect(e, { type: "output", a, i }),
              onConnectionStart: e => this.handleConnectionStart(e, { type: "output", a, i }),
              style: a.outputStyle
            } : undefined}
            render={a.render}
            single={a.single}
            theme={theme}>
            {a.children}
          </Attribute>
        ))}
      </React.Fragment>
    );
  }

}
