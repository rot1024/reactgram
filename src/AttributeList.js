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
  inputConnected: PropTypes.bool,
  isNodeAttribute: PropTypes.bool,
  output: PropTypes.bool,
  outputConnected: PropTypes.bool,
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
            input={a.input}
            inputConnected={a.inputConnected}
            inputHandleRef={handleRefs ? e => { this.setHandleRef(a, "input", e); } : undefined}
            isNodeAttribute={a.isNodeAttribute}
            onInputClick={e => this.handleClick(e, { type: "input", a, i })}
            onInputConnectionStart={e => this.handleConnectionStart(e, { type: "input", a, i })}
            onInputConnect={e => this.handleConnect(e, { type: "input", a, i })}
            onOutputClick={e => this.handleClick(e, { type: "output", a, i })}
            onOutputConnectionStart={e => this.handleConnectionStart(e, { type: "output", a, i })}
            onOutputConnect={e => this.handleConnect(e, { type: "output", a, i })}
            output={a.output}
            outputConnected={a.outputConnected}
            outputHandleRef={handleRefs ? e => { this.setHandleRef(a, "output", e); } : undefined}
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
