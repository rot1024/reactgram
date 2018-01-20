import React from "react";
import PropTypes from "prop-types";

import themeable from "./utils/themeable";

const NodeAttribute = ({
  className,
  data,
  style,
  theme = NodeAttribute.defaultTheme
}) => {
  const t = themeable("nodeAttributeContent", theme, className, style);
  return (
    <div {...t(null, "nodeAttributeContent")}>
      {data.nodeIcon && (
        <img
          src={data.nodeIcon}
          alt={data.nodeTitle || data.nodeType}
          width={16}
          height={16}
          {...t(null, "nodeAttributeContentImage")} />
      )}
      <span {...t(null, "nodeAttributeContentTitle")}>
        {data.nodeTitle || data.nodeType}
      </span>
    </div>
  );
};

NodeAttribute.propTypes = {
  className: PropTypes.string,
  data: PropTypes.any,
  style: PropTypes.object,
  theme: PropTypes.any
};

NodeAttribute.defaultTheme = {
  nodeAttributeContent: {
    display: "flex",
    alignItems: "center"
  },
  nodeAttributeContentImage: {
    width: "16px",
    height: "16px",
    marginRight: "10px"
  },
  nodeAttributeContentTitle: {
    flex: "auto"
  }
};

export default NodeAttribute;
