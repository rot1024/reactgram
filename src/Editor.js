import React from "react";
import PropTypes from "prop-types";

import ScrollBox from "./ScrollBox";
import Grid from "./Grid";
import Node from "./Node";

export default class Editor extends React.PureComponent {

  static propTypes = {
    className: PropTypes.string,
    data: PropTypes.object,
    id: PropTypes.string,
    nodeTypes: PropTypes.object,
    onConnect: PropTypes.func,
    onNodeDragEnd: PropTypes.func,
    style: PropTypes.object
  }

  // componentDidMount() {
  //
  // }
  //
  // componentDidUpdate() {
  //
  // }
  //
  // _calcEdgePositions() {
  //
  // }

  state = {
    connecting: null,
    connectingEdge: null
  }

  handleConnectionStart({ attribute, type }, n) {
    if (this.state.connecting) return;

    this.setState({
      connecting: {
        node: n,
        attribute,
        type
      },
      connectingEdge: {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
      }
    });
  }

  handleConnect({ attribute, type }, n) {
    const { connecting } = this.state;
    if (!connecting) return;

    if (type === connecting.type) return;

    if (
      connecting.node === n &&
      connecting.attribute === attribute &&
      connecting.type === type
    ) return;

    const input = type === "input" ? {
      node: n,
      attribute
    } : {
      node: connecting.node,
      attribute: connecting.attribute
    };

    const output = type === "output" ? {
      node: n,
      attribute
    } : {
      node: connecting.node,
      attribute: connecting.attribute
    };

    if (this.props.onConnect) {
      this.props.onConnect({
        input,
        output
      });
    }

    this.setState({
      connecting: null,
      connectingEdge: null
    });
  }

  render() {
    const {
      className,
      data,
      id,
      nodeTypes,
      onNodeDragEnd,
      style
    } = this.props;

    return (
      <div
        className={className}
        id={id}
        style={style}>
        <ScrollBox
          width={2000}
          height={2000}
          component={props => (
            <Grid
              backgroundColor="#434343"
              gridType="line"
              {...props} />
          )}>
          {data && data.nodes && data.nodes.map((n, i) => {
            const nt = nodeTypes && n.type && nodeTypes[n.type];
            if (!nt) return null;
            return (
              <Node
                attributes={nt.attributes}
                nodeId={n.id}
                key={n.id}
                data={n.data}
                title={nt.title || n.type}
                input={nt.input}
                output={nt.output}
                onConnectionStart={(e, d) => this.handleConnectionStart(d, n)}
                onConnect={(e, d) => this.handleConnect(d, n)}
                onDragEnd={
                  ({ x, y }) => onNodeDragEnd && onNodeDragEnd({
                    node: n,
                    index: i,
                    x,
                    y
                  })
                }
                position={{ x: n.x, y: n.y }} />
            );
          })}
        </ScrollBox>
      </div>
    );
  }

}
