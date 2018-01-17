import React from "react";
import PropTypes from "prop-types";

const venderPrefix = typeof navigator === "undefined" ? "" :
  (/webkit/i).test(navigator.appVersion) ? "-webkit-" :
  (/firefox/i).test(navigator.userAgent) ? "-moz-" :
  (/trident/i).test(navigator.userAgent) ? "-ms-" : "";

const lineGridStyle = ({
  backgroundColor = "rgba(0, 0, 0, 0)",
  gridColor = "rgba(255, 255, 255, .05)",
  gridSize = 80
}) => ({
  backgroundColor,
  backgroundRepeat: "repeat",
  backgroundSize: `${gridSize}px ${gridSize}px`,
  backgroundImage: `linear-gradient(0deg, transparent 24%,  25%, ${gridColor} 26%, transparent 27%, transparent 74%, ${gridColor} 75%, ${gridColor} 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, ${gridColor} 25%, ${gridColor} 26%, transparent 27%, transparent 74%, ${gridColor} 75%, ${gridColor} 76%, transparent 77%, transparent)`
});

const dotGridStyle = ({
  backgroundColor = "rgba(0, 0, 0, 0)",
  gridColor = "rgba(255, 255, 255, .2)",
  gridSize = 30
}) => ({
  backgroundColor,
  backgroundRepeat: "repeat",
  backgroundSize: `${gridSize}px ${gridSize}px`,
  backgroundImage: `${venderPrefix}repeating-radial-gradient(center center, ${gridColor}, ${gridColor} 1px, transparent 1px, transparent 100%)`
});

const styles = {
  line: lineGridStyle,
  dot: dotGridStyle
};

export default class Grid extends React.PureComponent {

  static propTypes = {
    backgroundColor: PropTypes.string,
    gridColor: PropTypes.string,
    gridRef: PropTypes.func,
    gridSize: PropTypes.number,
    gridType: PropTypes.oneOf(["line", "dot"]),
    style: PropTypes.object
  }

  render() {
    const {
      backgroundColor,
      gridColor,
      gridRef,
      gridSize,
      gridType,
      style,
      ...props
    } = this.props;
    return (
      <div
        style={{
          ...styles[gridType] ? styles[gridType]({ backgroundColor, gridColor, gridSize }) : {},
          ...style
        }}
        ref={gridRef}
        {...props} />
    );
  }

}
