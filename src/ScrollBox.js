import React from "react";
import PropTypes from "prop-types";
import ResizeDetector from "react-resize-detector";

import themeable from "./utils/themeable";

const workspaceStyle = {
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
    children: PropTypes.node,
    className: PropTypes.string,
    component: PropTypes.any,
    height: PropTypes.number,
    id: PropTypes.string,
    onResize: PropTypes.func,
    onScroll: PropTypes.func,
    render: PropTypes.func,
    rerenderOnResize: PropTypes.bool,
    scrollRef: PropTypes.func,
    scrollX: PropTypes.number,
    scrollY: PropTypes.number,
    style: PropTypes.object,
    theme: PropTypes.any,
    width: PropTypes.number
  }

  componentWillMount() {
    if (typeof this.props.scrollX === "number" || typeof this.props.scrollY === "number") {
      this.updateScrollPos = true;
    }
    if (this.props.center) {
      this.updateScrollCenter = true;
    }
  }

  componentDidMount() {
    this.updateScroll();
  }

  componentWillReceiveProps(prev) {
    if (
      (typeof this.props.scrollX === "number" || typeof this.props.scrollY === "number") &&
      (prev.scrollX !== this.props.scrollX || prev.scrollY !== this.props.scrollY)
    ) {
      this.updateScrollPos = true;
    }
    if (this.props.center && !prev.center) {
      this.updateScrollCenter = true;
    }
  }

  componentDidUpdate() {
    this.updateScroll();
  }

  updateScroll() {
    if (!this.updateScrollCenter) {
      if (this.updateScrollPos) {
        this.scroll(
          null,
          typeof this.props.scrollX === "number" ? this.props.scrollX : NaN,
          typeof this.props.scrollY === "number" ? this.props.scrollY : NaN
        );
      }
    } else {
      this.scrollToCenter();
    }
    this.updateScrollPos = false;
    this.updateScrollCenter = false;
  }

  scroll(e, x, y) {
    if (!this.scrollElement) return;
    const lastX = this.scrollElement.scrollLeft;
    const lastY = this.scrollElement.scrollTop;
    if (!isNaN(x)) {
      this.scrollElement.scrollLeft = x;
    }
    if (!isNaN(y)) {
      this.scrollElement.scrollTop = y;
    }
    if (this.props.onScroll && (!isNaN(x) || !isNaN(y))) {
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

  handleResize(w, h) {
    if (this.props.rerenderOnResize) {
      this.forceUpdate();
    }
    if (this.props.onResize) {
      this.props.onResize(w, h);
    }
  }

  scrollElement = null

  workspaceElement = null

  trackPointer = null

  values = null

  updateScrollPos = false

  updateScrollCenter = false

  render() {
    const {
      center, // eslint-disable-line no-unused-vars
      children,
      className,
      component,
      id,
      onResize, // eslint-disable-line no-unused-vars
      scrollRef,
      scrollX, // eslint-disable-line no-unused-vars
      scrollY, // eslint-disable-line no-unused-vars
      style,
      theme,
      width,
      height,
      render,
      rerenderOnResize, // eslint-disable-line no-unused-vars
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

    const t = themeable("scrollBox", theme, className, style);

    return (
      <div
        id={id}
        onWheel={e => {
          e.preventDefault();
          this.scrollDelta(e, e.deltaX, e.deltaY);
        }}
        ref={e => {
          this.scrollElement = e;
          if (scrollRef) {
            scrollRef(e);
          }
        }}
        {...t(null, {
          styleNames: ["scrollBox"],
          style: workspaceStyle
        })}
        {...props}>
        <ResizeDetector handleWidth handleHeight onResize={this.handleResize.bind(this)} />
        {C}
      </div>
    );
  }

}
