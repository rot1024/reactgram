import themeable from "react-themeable";

const enhancedThemeable = (defaultStyleName, theme, className, style) => {
  const t = themeable(theme || {});
  let defkey = 1;

  return (key, ...sn) => {
    let styleNames = sn;
    let moreClassName;
    let moreStyle;

    if (typeof sn[0] === "object") {
      styleNames = sn[0].styleNames;
      moreClassName = sn[0].className;
      moreStyle = sn[0].style;
    }

    const k = typeof key === "string" || typeof key === "number" ? key : String(defkey++);
    const props = t(k, ...styleNames);

    if (className) {
      if (props.className) {
        props.className = `${props.className} ${className}`;
      } else {
        props.className = className;
      }
    }

    if (moreClassName) {
      props.className = `${props.className} ${moreClassName}`;
    }

    if (style) {
      if (props.style) {
        props.style = {
          ...props.style,
          ...style
        };
      } else {
        props.style = style;
      }
    }

    if (moreStyle) {
      props.style = {
        ...props.style,
        ...moreStyle
      };
    }

    return props;
  };
};

export default enhancedThemeable;
