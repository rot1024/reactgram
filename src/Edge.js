import React from "react";
import PropTypes from "prop-types";

import themeable from "./utils/themeable";

const Edge = ({
  className,
  debug,
  id,
  strokeColor,
  strokeWidth = 1,
  x,
  x1,
  x2,
  y,
  y1,
  y2,
  selected,
  shadowRadius = 0,
  style,
  svgPathProps = {},
  theme = Edge.defaultTheme,
  themePrefix
}) => {
  const isAbsolute = typeof x === "number" && typeof y === "number";

  const w = Math.abs(x1 - x2);
  const h = Math.abs(y1 - y2);
  const bx = Math.min(x1, x2);
  const by = Math.min(y1, y2);
  const d = strokeWidth;
  const ax = w / 2 + d;

  const t = themeable("edge", theme, className, style);
  const { style: svgStyle, className: svgClassName, ...svgProps } = svgPathProps;

  const themePrefix2 = themePrefix ? `${themePrefix[0].toUpperCase()}${themePrefix.slice(1)}` : null;

  return (
    <svg
      className={className}
      id={id}
      width={w + d * 2}
      height={h + d * 2}
      viewBox={`0 0 ${w + d * 2} ${h + d * 2}`}
      xmlns="http://www.w3.org/2000/svg"
      {...t(null, {
        styleNames: [
          "edge",
          ...themePrefix ? [`${themePrefix}Edge`] : [],
          ...selected ? ["selectedEdge"] : [""],
          ...selected && themePrefix2 ? [`selected${themePrefix2}Edge`] : [""]
        ],
        style: {
          display: "inline-block",
          overflow: "visible",
          ...debug ? {
            backgroundColor: "rgba(255, 0, 0, 0.5)"
          } : {},
          ...isAbsolute ? {
            position: "absolute",
            top: 0,
            left: 0,
            transform: `translate(${x - d}px, ${y - d}px)`
          } : {
            transform: `translate(${-d}px, -${-d}px)`
          }
        }
      })}>
      {shadowRadius > 0 && (
        <defs>
          <filter id="shadow" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feComponentTransfer in="SourceAlpha">
              <feFuncR type="discrete" tableValues="0" />
              <feFuncG type="discrete" tableValues="0" />
              <feFuncB type="discrete" tableValues="0" />
            </feComponentTransfer>
            <feGaussianBlur stdDeviation={2} result="r" />
            <feComposite in="SourceGraphic" in2="r" operator="over" />
          </filter>
        </defs>
      )}
      <path
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        filter={shadowRadius > 0 ? "url(#shadow)" : undefined}
        d={`M${x1 - bx + d} ${y1 - by + d} C${ax} ${y1 - by + d},${ax} ${y2 - by + d},${x2 - bx + d} ${y2 - by + d}`}
        {...svgProps}
        {...t(null, {
          styleNames: [
            "edgePath",
            ...themePrefix ? [`${themePrefix}EdgePath`] : [],
            ...selected ? ["selectedEdgePath"] : [""],
            ...selected && themePrefix2 ? [`selected${themePrefix2}EdgePath`] : [""]
          ],
          className: svgClassName,
          style: svgStyle
        })} />
      {debug && (
        <React.Fragment>
          <circle cx={x1 - bx + d} cy={y1 - by + d} r="3" fill="red" />
          <circle cx={ax} cy={y1 - by + d} r="3" fill="yellow" />
          <circle cx={ax} cy={y2 - by + d} r="3" fill="green" />
          <circle cx={x2 - bx + d} cy={y2 - by + d} r="3" fill="blue" />
        </React.Fragment>
      )}
    </svg>
  );
};

Edge.propTypes = {
  className: PropTypes.string,
  debug: PropTypes.bool,
  id: PropTypes.string,
  selected: PropTypes.bool,
  shadowRadius: PropTypes.number,
  strokeColor: PropTypes.string,
  strokeWidth: PropTypes.number,
  style: PropTypes.object,
  svgPathProps: PropTypes.object,
  theme: PropTypes.any,
  themePrefix: PropTypes.string,
  x: PropTypes.number,
  x1: PropTypes.number,
  x2: PropTypes.number,
  y: PropTypes.number,
  y1: PropTypes.number,
  y2: PropTypes.number
};

Edge.defaultTheme = {
  edge: {},
  edgePath: {
    stroke: "#000",
    strokeLinecap: "round"
  },
  selectedEdge: {},
  selectedEdgePath: {
    stroke: "red"
  }
};

export default Edge;
