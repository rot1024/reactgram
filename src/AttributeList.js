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
    onConnect: PropTypes.func,
    onConnectionStart: PropTypes.func,
  }

  handleConnectionStart(e, { a, i, type }) {
    if (this.props.onConnectionStart) {
      this.props.onConnectionStart(e, { attribute: a, index: i, type });
    }
  }

  handleConnect(e, { a, i, type }) {
    if (this.props.onConnect) {
      this.props.onConnect(e, { attribute: a, index: i, type });
    }
  }

  render() {
    const {
      attributes
    } = this.props;

    return (
      <React.Fragment>
        {attributes && attributes.map((a, i) => (
          <Attribute
            key={a.id}
            component={a.component}
            data={a.data}
            input={a.input}
            onInputConnectionStart={e => this.handleConnectionStart(e, { type: "input", a, i })}
            onInputConnect={e => this.handleConnect(e, { type: "input", a, i })}
            onOutputConnectionStart={e => this.handleConnectionStart(e, { type: "output", a, i })}
            onOutputConnect={e => this.handleConnect(e, { type: "output", a, i })}
            output={a.output}
            render={a.render}
            style={a.style}>
            {a.children}
          </Attribute>
        ))}
      </React.Fragment>
    );
  }

}
