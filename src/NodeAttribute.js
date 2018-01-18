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
    <div {...t("nodeAttributeContent")}>
      {data.icon && (
        <img
          src={data.icon}
          alt={data.title || data.type}
          width={16}
          height={16}
          {...t("nodeAttributeContentImage")} />
      )}
      <span {...t("nodeAttributeContentTitle")}>
        {data.title || data.type}
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
