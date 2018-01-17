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

export default class ScrollBox extends React.PureComponent {

  static propTypes = {
    center: PropTypes.bool,
    children: PropTypes.any,
    className: PropTypes.string,
    component: PropTypes.any,
    height: PropTypes.number,
    id: PropTypes.string,
    initialX: PropTypes.number,
    initialY: PropTypes.number,
    onScroll: PropTypes.func,
    render: PropTypes.func,
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

  scroll(e, x, y) {
    if (!this.scrollElement) return;
    const lastX = this.scrollElement.scrollLeft;
    const lastY = this.scrollElement.scrollTop;
    this.scrollElement.scrollLeft = x;
    this.scrollElement.scrollTop = y;
    if (this.props.onScroll) {
      const deltaX = x - lastX;
      const deltaY = y - lastY;
      this.props.onScroll(e, { x, y, deltaX, deltaY, lastX, lastY });
    }
  }

  scrollDelta(e, dx, dy) {
    this.scroll(
      e,
      this.scrollElement.scrollLeft + dx,
      this.scrollElement.scrollTop + dy
    );
  }

  scrollToCenter() {
    const { width, height } = this.props;
    this.scroll(
      null,
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
      height,
      render,
      ...props
    } = this.props;

    const sty = {
      width: `${width}px`,
      height: `${height}px`
    };

    const ref = e => { this.workspaceElement = e; };

    const p = {
      children,
      ref,
      style: sty,
      ...props
    };

    const C = render ? render(p) : component ? React.createElement(component, p) : (
      <div ref={ref} style={sty}>{children}</div>
    );

    return (
      <div
        className={className}
        id={id}
        onWheel={e => {
          e.preventDefault();
          this.scrollDelta(e, e.deltaX, e.deltaY);
        }}
        ref={e => { this.scrollElement = e; }}
        style={{ ...editorStyle, ...style }}
        {...props}>
        {C}
      </div>
    );
  }

}
