import React from "react";
import PropTypes from "prop-types";

import Attribute from "./Attribute";

export default class AttributeList extends React.PureComponent {

  static propTypes = {
    attributes: PropTypes.arrayOf(PropTypes.shape({
      children: PropTypes.node,
      component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
      contentClassName: PropTypes.string,
      contentStyle: PropTypes.object,
      contentTheme: PropTypes.any,
      data: PropTypes.any,
      id: PropTypes.string.isRequired,
      input: PropTypes.bool,
      output: PropTypes.bool,
      render: PropTypes.func,
      single: PropTypes.bool,
      style: PropTypes.object,
      theme: PropTypes.any
    })),
    handleClassName: PropTypes.string,
    handleRefs: PropTypes.instanceOf(Map),
    handleStyle: PropTypes.object,
    handleTheme: PropTypes.any,
    onConnect: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    onConnectionStart: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    onHandleClick: PropTypes.func // eslint-disable-line react/no-unused-prop-types
  }

  static defaultTheme = {
    ...Attribute.defaultTheme
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
      handleClassName,
      handleRefs,
      handleStyle,
      handleTheme
    } = this.props;

    return (
      <React.Fragment>
        {attributes && attributes.map((a, i) => (
          <Attribute
            key={a.id}
            className={a.className}
            component={a.component}
            contentClassName={a.contentClassName}
            contentStyle={a.contentStyle}
            contentTheme={a.contentTheme}
            data={a.data}
            handleClassName={handleClassName}
            handleStyle={handleStyle}
            handleTheme={handleTheme}
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
            single={a.single}
            style={a.style}
            theme={a.theme}>
            {a.children}
          </Attribute>
        ))}
      </React.Fragment>
    );
  }

}
