import React from "react";
import PropTypes from "prop-types";

const Edge = ({
  className,
  id,
  strokeColor = "#000",
  strokeWidth = 1,
  x1,
  x2,
  y1,
  y2,
  shadowRadius = 0,
  style
}) => {
  const w = Math.abs(x1 - x2);
  const h = Math.abs(y1 - y2);
  const bx = Math.min(x1, x2);
  const by = Math.min(y1, y2);
  const d = strokeWidth;
  const ax = w / 2 + d;

  return (
    <div
      className={className}
      id={id}
      style={{
        display: "inline-block",
        width: `${w}px`,
        height: `${h}px`,
        overflow: "visible",
        ...style
      }}>
      <svg
        style={{ margin: `${-d}px 0 0 ${-d}px` }}
        width={w + d * 2}
        height={h + d * 2}
        xmlns="http://www.w3.org/2000/svg">
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
          strokeLinecap="round"
          filter={shadowRadius > 0 ? "url(#shadow)" : undefined}
          d={`M${x1 - bx + d} ${y1 - by + d} C${ax} ${y1 - by + d},${ax} ${y2 - by + d},${x2 - bx + d} ${y2 - by + d}`} />
      </svg>
    </div>
  );
};

Edge.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  shadowRadius: PropTypes.number,
  strokeColor: PropTypes.string,
  strokeWidth: PropTypes.number,
  style: PropTypes.object,
  x1: PropTypes.number,
  x2: PropTypes.number,
  y1: PropTypes.number,
  y2: PropTypes.number,
};

export default Edge;
