import { useDrop } from "react-dnd";
import PropTypes from "prop-types";

import { theme } from "antd"

const getStyle = (isOverCurrent, token) => {
  const style = {
    textAlign: "center",
    height: "100%",
  };

  return isOverCurrent
    ? {
        outline: `1px solid ${token.colorPrimary}`,
        outlineOffset: "-1px",
        ...style,
      }
    : style;
}

const HoverBox = ({
  path,
  propKey,
  addProperty,
  children,
  shouldHideChildren,
}) => {

  const {token} = theme.useToken()

  const [{ isOverCurrent }, drop] = useDrop({
    accept: "FIELD_TYPE",
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();

      if (!didDrop && !shouldHideChildren) {
        addProperty(path, item.data.default);
        return { item, path, propKey };
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  return (
    <div ref={drop} style={getStyle(isOverCurrent, token)} data-cy="hoverBox">
      {children}
    </div>
  );
}

HoverBox.propTypes = {
  children: PropTypes.element,
  path: PropTypes.array,
  addProperty: PropTypes.func,
  propKey: PropTypes.string,
  shouldHideChildren: PropTypes.bool,
};


export default HoverBox
