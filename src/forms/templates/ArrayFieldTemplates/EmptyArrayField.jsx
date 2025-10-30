import PropTypes from "prop-types";
import { Button, Empty, Row, Space, Typography } from "antd";
import PlusCircleOutlined from "@ant-design/icons/PlusCircleOutlined";

const EmptyArrayField = ({
  canAdd,
  onAddClick,
  disabled,
  readonly,
  options,
  compact,
}) => {
  if (compact) {
    return (
      <Row
        justify="space-between"
        align="middle"
        style={{ width: "100%", padding: "8px 0" }}
      >
        <Space align="center">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            styles={{ image: { height: 20, margin: 0 } }}
            style={{ margin: 0 }}
            description={false}
          />
          <Typography.Text type="secondary">No items added</Typography.Text>
        </Space>
        {canAdd && !readonly && (
          <Button
            className="array-item-add"
            disabled={disabled}
            onClick={onAddClick}
            type="primary"
            icon={<PlusCircleOutlined />}
            data-cy="addItemButton"
            size="small"
          >
            Add {options && options.addLabel ? options.addLabel : `Item`}
          </Button>
        )}
      </Row>
    );
  } else {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        styles={{ image: { height: 30 } }}
        style={{ margin: "15px" }}
        description={"No items added"}
      >
        {canAdd && !readonly && (
          <Button
            className="array-item-add"
            disabled={disabled}
            onClick={onAddClick}
            type="primary"
            icon={<PlusCircleOutlined />}
            data-cy="addItemButton"
          >
            Add {options && options.addLabel ? options.addLabel : `Item`}
          </Button>
        )}
      </Empty>
    );
  }
};

EmptyArrayField.propTypes = {
  items: PropTypes.array,
  onAddClick: PropTypes.func,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  canAdd: PropTypes.bool,
  compact: PropTypes.bool,
};

export default EmptyArrayField;
