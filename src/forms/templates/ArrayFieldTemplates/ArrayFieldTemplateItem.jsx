import { Row, Col } from "antd";
import PropTypes from "prop-types";
import ArrayUtils from "./ArrayUtils";

const ArrayFieldTemplateItem = ({
  children,
  disabled,
  hasMoveDown,
  hasMoveUp,
  hasRemove,
  hasToolbar,
  index,
  onDropIndexClick,
  onReorderClick,
  readonly,
  uiSchema,
}) => {
  return (
    <Row
      align={uiSchema && uiSchema["ui:label"] === false ? "top" : "middle"}
      key={`array-item-${index}`}
      style={{ margin: "10px 0px" }}
      className="arrayFieldRow"
    >
      <Col
        flex="1"
        style={{
          marginRight: "5px",
        }}
      >
        {children}
      </Col>
      {hasToolbar && (
        <ArrayUtils
          hasMoveDown={hasMoveDown}
          hasMoveUp={hasMoveUp}
          disabled={disabled}
          readonly={readonly}
          onReorderClick={onReorderClick}
          index={index}
          hasRemove={hasRemove}
          onDropIndexClick={onDropIndexClick}
        />
      )}
    </Row>
  );
};

ArrayFieldTemplateItem.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  hasMoveDown: PropTypes.bool,
  hasMoveUp: PropTypes.bool,
  hasRemove: PropTypes.bool,
  hasToolbar: PropTypes.bool,
  index: PropTypes.string,
  onDropIndexClick: PropTypes.func,
  onReorderClick: PropTypes.func,
  readonly: PropTypes.bool,
};

export default ArrayFieldTemplateItem;
