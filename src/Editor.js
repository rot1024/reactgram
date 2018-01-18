import React from "react";
import PropTypes from "prop-types";

import ScrollBox from "./ScrollBox";
import Grid from "./Grid";
import Node from "./Node";
import Edge from "./Edge";
import themeable from "./utils/themeable";

const defaultTheme = {
  editor: {},
  grid: {},
  edge: {},
  edgePath: {},
  connectingEdge: {},
  connectingEdgePath: {}
};

export default class Editor extends React.PureComponent {

  static propTypes = {
    className: PropTypes.string,
    data: PropTypes.object,
    gridBackgroundColor: Grid.propTypes.backgroundColor,
    gridColor: Grid.propTypes.gridColor,
    gridSize: Grid.propTypes.gridSize,
    gridType: Grid.propTypes.gridType,
    id: PropTypes.string,
    nodeAttributeChildren: PropTypes.node,
    nodeAttributeComponent: PropTypes.oneOf([PropTypes.element, PropTypes.func]),
    nodeAttributeContentTheme: PropTypes.any,
    nodeAttributeRender: PropTypes.func,
    nodeTheme: PropTypes.any,
    nodeTypes: PropTypes.object,
    onConnect: PropTypes.func,
    onEdgeClick: PropTypes.func,
    onHandleClick: PropTypes.func,
    onNodeDrag: PropTypes.func,
    onNodeDragEnd: PropTypes.func,
    style: PropTypes.object,
    theme: PropTypes.any,
    workspaceHeight: PropTypes.number,
    workspaceWidth: PropTypes.number
  }

  static defaultProps = {
    theme: defaultTheme,
    workspaceHeight: 2000,
    workspaceWidth: 2000
  }

  static defaultTheme = defaultTheme

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

  handleConnect({ attribute, type }, node) {
    const { connecting } = this.state;
    if (!connecting) return;

    if (
      type !== connecting.type &&
      (
        connecting.node !== node ||
        connecting.attribute !== attribute ||
        connecting.type !== type
      )
    ) {
      const from = type === "output" ? {
        node: node.id,
        attribute: attribute ? attribute.id : ""
      } : {
        node: connecting.node.id,
        attribute: connecting.attribute ? connecting.attribute.id : ""
      };

      const to = type === "input" ? {
        node: node.id,
        attribute: attribute ? attribute.id : ""
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

  getHandleElement(edge) {
    if (!this.handleRefs || !this.state.rendered) return null;

    const fa = this.handleRefs.get(edge.from.node);
    const ta = this.handleRefs.get(edge.to.node);

    if (!fa || !ta) return null;

    const fh = fa.get(edge.from.attribute);
    const th = ta.get(edge.to.attribute);

    if (!fh || !th) return null;

    return {
      from: fh.output,
      to: th.input
    };
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
      gridBackgroundColor,
      gridColor,
      gridSize,
      gridType,
      id,
      nodeAttributeChildren,
      nodeAttributeComponent,
      nodeAttributeContentTheme,
      nodeAttributeRender,
      nodeTheme,
      nodeTypes,
      onEdgeClick,
      onNodeDrag,
      onNodeDragEnd,
      style,
      theme,
      workspaceHeight,
      workspaceWidth
    } = this.props;

    const {
      connectingEdge: ce
    } = this.state;

    const t = themeable("editor", theme, className, style);

    const workspaceRect = this.workspaceElement ?
      this.workspaceElement.getBoundingClientRect() : null;

    return (
      <div
        id={id}
        {...t("editor")}>
        <ScrollBox
          width={workspaceWidth}
          height={workspaceHeight}
          scrollRef={e => { this.scrollElement = e; }}
          onMouseMove={e => this.handleMouseMove(e)}
          onTouchMove={e => this.handleMouseMove(e)}
          onMouseUp={this.stopDragging} // eslint-disable-line react/jsx-handler-names
          onTouchEnd={this.stopDragging} // eslint-disable-line react/jsx-handler-names
          onTouchCancel={this.stopDragging} // eslint-disable-line react/jsx-handler-names
          render={({ style: s, ...props }) => (
            <Grid
              backgroundColor={gridBackgroundColor}
              gridColor={gridColor}
              gridSize={gridSize}
              gridType={gridType}
              gridRef={e => { this.workspaceElement = e; }}
              {...props}
              {...t({
                styleNames: ["grid"],
                style: s
              })} />
          )}>
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
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                strokeColor="#fff"
                strokeWidth={3}
                svgPathProps={{
                  onClick: evt => onEdgeClick && onEdgeClick(evt, {
                    edge: e,
                    index: i
                  }),
                  ...t("edgePath")
                }}
                {...t({
                  styleNames: ["edge"],
                  style: {
                    position: "absolute",
                    left: `${x1 < x2 ? x1 : x2}px`,
                    top: `${y1 < y2 ? y1 : y2}px`
                  }
                })} />
            );
          })}
          {data && data.nodes && data.nodes.map((n, i) => {
            const nt = nodeTypes && n.type && nodeTypes[n.type];
            if (!nt) return null;

            if (!this.handleRefs.has(n.id)) {
              this.handleRefs.set(n.id, new Map());
            }

            return (
              <Node
                attributes={nt.attributes}
                nodeId={n.id}
                key={n.id}
                data={n.data}
                // eslint-disable-next-line react/jsx-handler-names
                handleRefs={this.handleRefs.get(n.id)}
                nodeAttributeChildren={nodeAttributeChildren}
                nodeAttributeComponent={nodeAttributeComponent}
                nodeAttributeContentTheme={nodeAttributeContentTheme}
                nodeAttributeData={{ type: n.type, ...nt.data }}
                nodeAttributeRender={nodeAttributeRender}
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
                onHandleClick={(e, a) => this.handleHandleClick(e, a, n, i)}
                position={{ x: n.x, y: n.y }}
                theme={nodeTheme} />
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
              svgPathProps={t("edgePath", "connectingEdgePath")}
              {...t({
                styleNames: ["edge", "connectingEdge"],
                style: {
                  position: "absolute",
                  left: `${ce.x1 < ce.x2 ? ce.x1 : ce.x2}px`,
                  top: `${ce.y1 < ce.y2 ? ce.y1 : ce.y2}px`,
                  pointerEvents: "none"
                }
              })} />
          )}
        </ScrollBox>
      </div>
    );
  }

}
