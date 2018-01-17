import React from "react";
import PropTypes from "prop-types";

const editorStyle = {
  position: "absolute",
  top: "0",
  left: "0",
  bottom: "0",
  right: "0",
  overflow: "auto"
};

const workspaceStyle = {
  width: "2000px",
  height: "2000px",
  backgroundColor: "gray"
};

export default class ScrollBox extends React.PureComponent {

  static propTypes = {
    center: PropTypes.bool,
    children: PropTypes.any,
    className: PropTypes.string,
    component: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.element,
      PropTypes.string
    ]),
    height: PropTypes.number,
    id: PropTypes.string,
    initialX: PropTypes.number,
    initialY: PropTypes.number,
    style: PropTypes.object,
    width: PropTypes.number
  }

  componentDidMount() {
    if (this.props.initialX) {
      this.scrollElement.scrollLeft = this.props.initialX;
    }
    if (this.props.initialY) {
      this.scrollElement.scrollTop = this.props.initialY;
    }
    if (this.props.center) {
      this.scrollToCenter();
    }
  }

  scroll(x, y) {
    if (!this.scrollElement) return;
    this.scrollElement.scrollLeft = x;
    this.scrollElement.scrollTop = y;
  }

  scrollDelta(dx, dy) {
    this.scroll(
      this.scrollElement.scrollLeft + dx,
      this.scrollElement.scrollTop + dy
    );
  }

  scrollToCenter() {
    const { width, height } = this.props;
    this.scroll(
      (width - this.scrollElement.clientWidth) / 2,
      (height - this.scrollElement.clientHeight) / 2
    );
  }

  scrollElement = null

  workspaceElement = null

  trackPointer = null

  values = null

  render() {
    const {
      children,
      className,
      component,
      id,
      style,
      width,
      height
    } = this.props;

    const sty = {
      ...workspaceStyle,
      width: `${width}px`,
      height: `${height}px`
    };

    const ref = e => { this.workspaceElement = e; };

    const C = component ? component({
      ref,
      style: sty
    }, children) : (
      <div ref={ref} style={sty}>{children}</div>
    );

    return (
      <div
        className={className}
        id={id}
        onWheel={e => {
          e.preventDefault();
          this.scrollDelta(e.deltaX, e.deltaY);
        }}
        ref={e => { this.scrollElement = e; }}
        style={{ ...editorStyle, ...style }}>
        {C}
      </div>
    );
  }

}
