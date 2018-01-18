import React from "react";
import PropTypes from "prop-types";

import Attribute from "./Attribute";

export default class AttributeList extends React.PureComponent {

  static propTypes = {
    attributes: PropTypes.arrayOf(PropTypes.shape({
      children: PropTypes.any,
      id: PropTypes.string,
      input: PropTypes.bool,
      output: PropTypes.bool,
      style: PropTypes.object
    })),
    handleRefs: PropTypes.instanceOf(Map),
    onConnect: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    onConnectionStart: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    onHandleClick: PropTypes.func // eslint-disable-line react/no-unused-prop-types
  }

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
      handleRefs
    } = this.props;

    return (
      <React.Fragment>
        {attributes && attributes.map((a, i) => (
          <Attribute
            key={a.id}
            component={a.component}
            data={a.data}
            input={a.input}
            inputHandleRef={handleRefs ? e => { this.setHandleRef(a, "input", e); } : undefined}
            onInputClick={e => this.handleClick(e, { type: "input", a, i })}
            onInputConnectionStart={e => this.handleConnectionStart(e, { type: "input", a, i })}
            onInputConnect={e => this.handleConnect(e, { type: "input", a, i })}
            onOutputClick={e => this.handleClick(e, { type: "output", a, i })}
            onOutputConnectionStart={e => this.handleConnectionStart(e, { type: "output", a, i })}
            onOutputConnect={e => this.handleConnect(e, { type: "output", a, i })}
            output={a.output}
            outputHandleRef={handleRefs ? e => { this.setHandleRef(a, "output", e); } : undefined}
            render={a.render}
            style={a.style}>
            {a.children}
          </Attribute>
        ))}
      </React.Fragment>
    );
  }

}
