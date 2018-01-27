import React from "react";
import PropTypes from "prop-types";

import ScrollBox from "./ScrollBox";
import Grid from "./Grid";
import Node from "./Node";
import Edge from "./Edge";
import themeable from "./utils/themeable";

export default class Editor extends React.PureComponent {

  static propTypes = {
    appearance: PropTypes.shape({
      edgeShadowRadius: PropTypes.number,
      edgeStrokeColor: PropTypes.string,
      edgeStrokeWidth: PropTypes.number,
      gridBackgroundColor: Grid.propTypes.backgroundColor,
      gridColor: Grid.propTypes.gridColor,
      gridSize: Grid.propTypes.gridSize,
      gridType: Grid.propTypes.gridType
    }),
    className: PropTypes.string,
    data: PropTypes.shape({
      edges: PropTypes.array,
      nodes: PropTypes.array
    }),
    edgeSelectable: PropTypes.bool,
    id: PropTypes.string,
    nodeAttribute: PropTypes.shape({
      children: PropTypes.node,
      className: PropTypes.string,
      component: PropTypes.oneOf([PropTypes.element, PropTypes.func]),
      draggable: PropTypes.bool,
      render: PropTypes.func,
      theme: PropTypes.any,
      style: PropTypes.object
    }),
    nodeSelectable: PropTypes.bool,
    nodeTypes: PropTypes.object,
    onConnect: PropTypes.func,
    onEdgeClick: PropTypes.func,
    onHandleClick: PropTypes.func,
    onNodeClick: PropTypes.func,
    onNodeData: PropTypes.func,
    onNodeDrag: PropTypes.func,
    onNodeDragEnd: PropTypes.func,
    onSelect: PropTypes.func,
    onWorkspaceScroll: PropTypes.func,
    selectedEdgeIndex: PropTypes.number,
    selectedNodeIndex: PropTypes.number,
    style: PropTypes.object,
    theme: PropTypes.any,
    workspaceCenter: PropTypes.bool,
    workspaceHeight: PropTypes.number,
    workspaceScrollX: PropTypes.number,
    workspaceScrollY: PropTypes.number,
    workspaceWidth: PropTypes.number,
  }

  static defaultProps = {
    appearance: {
      edgeStrokeColor: "#fff",
      edgeStrokeWidth: 3,
      gridType: "line"
    },
    nodeAttribute: {},
    selectedEdgeIndex: -1,
    selectedNodeIndex: -1,
    workspaceHeight: 2000,
    workspaceWidth: 2000
  }

  state = {
    connecting: null,
    connectingEdge: null,
    rendered: false
  }

  componentDidMount() {
    if (!this.state.rendered) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        rendered: true
      });
    }
  }

  componentWillReceiveProps() {
    this.handleRefs = new Map();
    this.setState({ rendered: false });
  }

  componentDidUpdate() {
    if (!this.state.rendered) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        rendered: true
      });
    }
  }

  scrollElement = null

  workspaceElement = null

  handleRefs = new Map()

  handleMouseMove(e) {
    if (this.state.connectingEdge) {
      const rect = this.scrollElement.getBoundingClientRect();
      this.setState({
        connectingEdge: {
          ...this.state.connectingEdge,
          x2: e.clientX + this.scrollElement.scrollLeft -
            this.workspaceElement.offsetLeft - rect.left,
          y2: e.clientY + this.scrollElement.scrollTop -
            this.workspaceElement.offsetTop - rect.top
        }
      });
    }
  }

  handleTouchMove(e) {
    if (this.state.connectingEdge) {
      const ev = e.changedTouches && e.changedTouches[0] || e;
      const rect = this.scrollElement.getBoundingClientRect();
      this.setState({
        connectingEdge: {
          ...this.state.connectingEdge,
          x2: ev.clientX + this.scrollElement.scrollLeft -
            this.workspaceElement.offsetLeft - rect.left,
          y2: ev.clientY + this.scrollElement.scrollTop -
            this.workspaceElement.offsetTop - rect.top
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

  handleConnect(e, { attribute, type }, node) {
    const { connecting } = this.state;
    if (!connecting) return;

    const data = { attribute, type, node };

    if (e.changedTouches && e.changedTouches[0] && this.handleRefs) {
      const elem = document.elementFromPoint(
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY
      );
      if (elem) {
        const s = this.searchHandleByElement(elem);
        if (s) {
          data.type = s.type;
          data.node = this.props.data.nodes.find(n => n.id === s.node);
          if (s.attribute === "") {
            data.attribute = null;
          } else {
            const nodeType = this.props.nodeTypes[data.node.type];
            data.attribute = !nodeType ? null : nodeType.attributes.find(a => a.id === s.attribute);
          }
        }
      }
    }

    if (
      data.type !== connecting.type &&
      (
        connecting.node !== data.node ||
        connecting.attribute !== data.attribute
      )
    ) {

      const from = data.type === "output" ? {
        node: data.node.id,
        attribute: data.attribute ? data.attribute.id : ""
      } : {
        node: connecting.node.id,
        attribute: connecting.attribute ? connecting.attribute.id : ""
      };

      const to = data.type === "input" ? {
        node: data.node.id,
        attribute: data.attribute ? data.attribute.id : ""
      } : {
        node: connecting.node.id,
        attribute: connecting.attribute ? connecting.attribute.id : ""
      };

      if (this.props.onConnect) {
        this.props.onConnect({
          from,
          to
        });
      }
    }

    this.stopDragging();
  }

  handleHandleClick(e, a, n, i) {
    if (this.props.onHandleClick) {
      this.props.onHandleClick(e, {
        node: n,
        nodeIndex: i,
        attribute: a.attribute,
        attributeIndex: a.index,
        type: a.type,
        isNodeAttribute: a.isNodeAttribute
      });
    }
  }

  handleNodeClick(e, n, i) {
    if (!this.props.onSelect) return;
    if (this.props.nodeSelectable && this.props.selectedNodeIndex !== i) {
      this.props.onSelect(e, { node: n, edge: null, index: i });
    }
    if (this.props.onNodeClick) {
      this.props.onNodeClick(e, { node: n, index: i });
    }
  }

  handleWorkspaceClick(e) {
    if (!this.props.onSelect) return;
    if (this.props.selectedNodeIndex !== -1 || this.props.selectedEdgeIndex !== -1) {
      this.props.onSelect(e, { node: null, edge: null, index: -1 });
    }
  }

  handleEdgeClick(ev, e, i) {
    ev.stopPropagation();
    if (this.props.edgeSelectable && this.props.onSelect && this.props.selectedEdgeIndex !== i) {
      this.props.onSelect(ev, { node: null, edge: e, index: i });
    }
    if (this.props.onEdgeClick) {
      this.props.onEdgeClick(ev, { edge: e, index: i });
    }
  }

  getHandleElement(edge) {
    if (!this.handleRefs || !this.state.rendered) return null;

    const fa = this.handleRefs.get(edge.from.node);
    const ta = this.handleRefs.get(edge.to.node);

    if (!fa || !ta) return null;

    const fh = fa.get(edge.from.attribute);
    const th = ta.get(edge.to.attribute);

    if (!fh || !th || !fh.output || !th.input) return null;

    return {
      from: fh.output,
      to: th.input
    };
  }

  searchHandleByElement(element) {
    if (!this.handleRefs) return null;
    for (const [node, m] of this.handleRefs) {
      for (const [attribute, o] of m) {
        if (o.input === element) {
          return { node, attribute, type: "input" };
        } else if (o.output === element) {
          return { node, attribute, type: "output" };
        }
      }
    }
    return null;
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
      appearance: {
        edgeShadowRadius,
        edgeStrokeColor,
        edgeStrokeWidth,
        gridBackgroundColor,
        gridColor,
        gridSize,
        gridType
      },
      className,
      data,
      id,
      nodeAttribute: {
        children: nodeAttributeChildren,
        className: nodeAttributeClassName,
        component: nodeAttributeComponent,
        draggable: nodeAttributeDraggable,
        render: nodeAttributeRender,
        theme: nodeAttributeTheme,
        style: nodeAttributeStyle
      },
      nodeTypes,
      onNodeData,
      onNodeDrag,
      onNodeDragEnd,
      onWorkspaceScroll,
      selectedEdgeIndex,
      selectedNodeIndex,
      style,
      theme,
      workspaceCenter,
      workspaceHeight,
      workspaceWidth,
      workspaceScrollX,
      workspaceScrollY
    } = this.props;

    const {
      connectingEdge: ce
    } = this.state;

    const t = themeable("editor", theme, className, style);

    const workspaceRect = this.workspaceElement ?
      this.workspaceElement.getBoundingClientRect() : null;

    return (
      <ScrollBox
        center={workspaceCenter}
        width={workspaceWidth}
        height={workspaceHeight}
        id={id}
        onMouseMove={e => this.handleMouseMove(e)}
        onTouchMove={e => this.handleTouchMove(e)}
        onMouseUp={this.stopDragging} // eslint-disable-line react/jsx-handler-names
        onTouchEnd={this.stopDragging} // eslint-disable-line react/jsx-handler-names
        onTouchCancel={this.stopDragging} // eslint-disable-line react/jsx-handler-names
        onScroll={onWorkspaceScroll}
        render={({ style: s, ...props }) => (
          <Grid
            backgroundColor={gridBackgroundColor}
            gridColor={gridColor}
            gridSize={gridSize}
            gridType={gridType}
            gridRef={e => { this.workspaceElement = e; }}
            onClick={e => this.handleWorkspaceClick(e)}
            {...props}
            {...t(null, {
              styleNames: ["grid"],
              style: s
            })} />
        )}
        scrollRef={e => { this.scrollElement = e; }}
        scrollX={workspaceScrollX}
        scrollY={workspaceScrollY}
        theme={theme}>
        {data && data.edges && data.edges.map((e, i) => {

          const elem = this.getHandleElement(e);

          if (!elem) return null;

          const fromRect = elem.from.getBoundingClientRect();
          const toRect = elem.to.getBoundingClientRect();

          const x1 = fromRect.left - workspaceRect.left + fromRect.width / 2;
          const y1 = fromRect.top - workspaceRect.top + fromRect.height / 2;
          const x2 = toRect.left - workspaceRect.left + toRect.width / 2;
          const y2 = toRect.top - workspaceRect.top + toRect.height / 2;

          const key = `${e.from.node}_${e.from.attribute}_${e.to.node}_${e.to.attribute}`;

          return (
            <Edge
              key={key}
              x={x1 < x2 ? x1 : x2}
              y={y1 < y2 ? y1 : y2}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              selected={selectedEdgeIndex === i}
              shadowRadius={edgeShadowRadius}
              strokeColor={edgeStrokeColor}
              strokeWidth={edgeStrokeWidth}
              svgPathProps={{
                onClick: ev => this.handleEdgeClick(ev, e, i)
              }}
              theme={theme} />
          );
        })}
        {data && data.nodes && data.nodes.map((n, i) => {
          const nt = nodeTypes && n.type && nodeTypes[n.type];
          if (!nt) return null;

          if (!this.handleRefs.has(n.id)) {
            this.handleRefs.set(n.id, new Map());
          }

          const nodeData = {
            ...nt.data,
            ...n.data,
            ...onNodeData ? onNodeData({ node: n, nodeIndex: i, nodeType: nt }) : {}
          };

          return (
            <Node
              attributes={(n.attributes || nt.attributes).map(a => ({
                ...a,
                inputConnected: data.edges && data.edges.some(
                  e => e.to.node === n.id && e.to.attribute === a.id
                ),
                outputConnected: data.edges && data.edges.some(
                  e => e.from.node === n.id && e.from.attribute === a.id
                )
              }))}
              className={nt.className}
              data={nodeData}
              handleRefs={this.handleRefs.get(n.id)}
              key={n.id}
              nodeAttribute={{
                children: nodeAttributeChildren,
                className: nodeAttributeClassName,
                component: nodeAttributeComponent,
                draggable: nodeAttributeDraggable,
                input: typeof n.input === "boolean" ? n.input : nt.input,
                inputConnected: data.edges && data.edges.some(
                  e => e.to.node === n.id && e.to.attribute === ""
                ),
                output: typeof n.output === "boolean" ? n.output : nt.output,
                outputConnected: data.edges && data.edges.some(
                  e => e.from.node === n.id && e.from.attribute === ""
                ),
                render: nodeAttributeRender,
                theme: nodeAttributeTheme,
                style: nodeAttributeStyle
              }}
              nodeId={n.id}
              onConnectionStart={(e, d) => this.handleConnectionStart(e, d, n)}
              onConnect={(e, d) => this.handleConnect(e, d, n)}
              onClick={e => this.handleNodeClick(e, n, i)}
              onDrag={
                (e, { x, y }) => onNodeDrag && onNodeDrag(e, {
                  node: n,
                  index: i,
                  x,
                  y
                })
              }
              onDragEnd={
                (e, { x, y }) => onNodeDragEnd && onNodeDragEnd(e, {
                  node: n,
                  index: i,
                  x,
                  y
                })
              }
              onHandleClick={(e, a) => this.handleHandleClick(e, a, n, i)}
              position={{ x: n.x, y: n.y }}
              selected={selectedNodeIndex === i}
              style={nt.style}
              theme={theme} />
          );
        })}
        {ce && (
          <Edge
            x={ce.x1 < ce.x2 ? ce.x1 : ce.x2}
            y={ce.y1 < ce.y2 ? ce.y1 : ce.y2}
            x1={ce.x1}
            y1={ce.y1}
            x2={ce.x2}
            y2={ce.y2}
            shadowRadius={edgeShadowRadius}
            strokeColor={edgeStrokeColor}
            strokeWidth={edgeStrokeWidth}
            theme={theme}
            themePrefix="connecting"
            style={{
              pointerEvents: "none"
            }} />
        )}
      </ScrollBox>
    );
  }

}
