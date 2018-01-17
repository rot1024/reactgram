import React from "react";
import PropTypes from "prop-types";

import ScrollBox from "./ScrollBox";
import Grid from "./Grid";
import Node from "./Node";
import Edge from "./Edge";

export default class Editor extends React.PureComponent {

  static propTypes = {
    className: PropTypes.string,
    data: PropTypes.object,
    id: PropTypes.string,
    nodeTypes: PropTypes.object,
    onConnect: PropTypes.func,
    onNodeDrag: PropTypes.func,
    onNodeDragEnd: PropTypes.func,
    style: PropTypes.object
  }

  state = {
    connecting: null,
    connectingEdge: null
  }

  scrollElement = null

  workspaceElement = null

  handleMouseMove(e) {
    if (this.state.connectingEdge) {
      this.setState({
        connectingEdge: {
          // eslint-disable-next-line react/no-access-state-in-setstate
          ...this.state.connectingEdge,
          x2: e.clientX + this.scrollElement.scrollLeft,
          y2: e.clientY + this.scrollElement.scrollTop
        }
      });
    }
  }

  handleConnectionStart(e, { attribute, type }, n) {
    if (this.state.connecting) return;

    const tr = e.target.getBoundingClientRect();
    const pr = this.workspaceElement.getBoundingClientRect();

    const x = tr.left - pr.left + tr.width / 2;
    const y = tr.top - pr.top + tr.height / 2;

    this.setState({
      connecting: {
        node: n,
        attribute,
        type
      },
      connectingEdge: {
        x1: x,
        y1: y,
        x2: x,
        y2: y
      }
    });
  }

  handleConnect({ attribute, type }, n) {
    const { connecting } = this.state;
    if (!connecting) return;

    if (
      type !== connecting.type &&
      (
        connecting.node !== n ||
        connecting.attribute !== attribute ||
        connecting.type !== type
      )
    ) {
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
    }

    this.stopDragging();
  }

  stopDragging = () => {
    // eslint-disable-next-line no-invalid-this
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
      onNodeDrag,
      onNodeDragEnd,
      style
    } = this.props;

    const {
      connectingEdge: ce
    } = this.state;

    return (
      <div
        className={className}
        id={id}
        style={style}>
        <ScrollBox
          width={2000}
          height={2000}
          scrollRef={e => { this.scrollElement = e; }}
          onMouseMove={e => this.handleMouseMove(e)}
          onTouchMove={e => this.handleMouseMove(e)}
          onMouseUp={this.stopDragging} // eslint-disable-line react/jsx-handler-names
          onTouchEnd={this.stopDragging} // eslint-disable-line react/jsx-handler-names
          onTouchCancel={this.stopDragging} // eslint-disable-line react/jsx-handler-names
          render={({ style: s, ...props }) => (
            <Grid
              backgroundColor="#434343"
              gridType="line"
              gridRef={e => { this.workspaceElement = e; }}
              style={{
                ...s,
                position: "relative"
              }}
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
                onConnectionStart={(e, d) => this.handleConnectionStart(e, d, n)}
                onConnect={(e, d) => this.handleConnect(d, n)}
                onDrag={
                  ({ x, y }) => onNodeDrag && onNodeDrag({
                    node: n,
                    index: i,
                    x,
                    y
                  })
                }
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
          {ce && (
            <Edge
              x1={ce.x1}
              y1={ce.y1}
              x2={ce.x2}
              y2={ce.y2}
              strokeColor="#fff"
              strokeWidth={3}
              style={{
                position: "absolute",
                left: `${ce.x1 < ce.x2 ? ce.x1 : ce.x2}px`,
                top: `${ce.y1 < ce.y2 ? ce.y1 : ce.y2}px`,
                pointerEvents: "none"
              }} />
          )}
        </ScrollBox>
      </div>
    );
  }

}
