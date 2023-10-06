import PropTypes from "prop-types";
import { useDrag } from "react-dnd";

const style = {
  border: "1px dashed gray",
  backgroundColor: "white",
  padding: "0.1rem",
  cursor: "move",
};
const Draggable = ({ data, type, children }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { data },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
    type: "FIELD_TYPE"
  });
  const opacity = isDragging ? 0.4 : 1;

  return (
    <div ref={drag} style={{ ...style, opacity }} className={data.className} data-cy={`field-${type}`}>
      {children}
    </div>
  );
};

Draggable.propTypes = {
  children: PropTypes.node,
  data: PropTypes.object,
  type: PropTypes.string,
};

export default Draggable;
