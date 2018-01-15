import React from "react";
import { pointer, listen, value } from "popmotion";
import styler from "stylefire";

const draggable = ({
  initialX = 0,
  initialY = 0,
  onDrag,
  onDragEnd,
  onDragStart,
  x = true,
  y = true
} = {
    initialX: 0,
    initialY: 0,
    x: true,
    y: true
  }) => fn => class DraggableComponent extends React.PureComponent {

  componentDidMount() {
    this.init();
  }

  componentDidUpdate() {
    if (!this.element) {
      this.stop();
    } else if (!this.trackPointer) {
      this.init();
    }
  }

  componentWillUnmount() {
    this.stop();
  }

  setRef = e => {
    // eslint-disable-next-line no-invalid-this
    this.element = e;
  }

  setHandleRef = e => {
    // eslint-disable-next-line no-invalid-this
    this.handleElement = e;
  }

  init() {
    if (this.trackPointer) return;

    const nodeStyler = styler(this.element);
    this.values = {
      x: value(initialX, nodeStyler.set("x")),
      y: value(initialY, nodeStyler.set("y"))
    };
    listen(this.handleElement || this.element, "mousedown touchstart").start(() => this.start());
    listen(document, "mouseup touchend").start(() => this.stop());
  }

  start() {
    if (this.trackPointer) return;

    this.trackPointer = pointer({
      x: x ? this.values.x.get() : 0,
      y: y ? this.values.y.get() : 0
    }).start(v => {
      if (x) this.values.x.update(v.x);
      if (y) this.values.y.update(v.y);
      if (onDrag) {
        onDrag(this.values);
      }
    });

    if (onDragStart) {
      onDragStart(this.values);
    }
  }

  stop() {
    if (!this.trackPointer) return;

    this.trackPointer.stop();

    if (onDragEnd) {
      onDragEnd(this.values);
    }

    this.trackPointer = null;
  }

  element = null

  handleElement = null

  trackPointer = null

  values = null

  render() {
    return fn(this.setRef, this.setHandleRef);
  }

};

export default draggable;
