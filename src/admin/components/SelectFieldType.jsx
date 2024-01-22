import { Button, Col, Collapse, Row, Space, Typography } from "antd";
import Draggable from "./Draggable";
import { useContext } from "react";
import CustomizationContext from "../../contexts/CustomizationContext";
import PlusOutlined from "@ant-design/icons/PlusOutlined";
import { useDispatch } from "react-redux";
import { addByPath } from "../../store/schemaWizard";

const SelectFieldType = ({ insertInPath }) => {
  const dispatch = useDispatch();

  const customizationContext = useContext(CustomizationContext);

  const DraggableOrNot = ({ index, type, objectKey, children }) => {
    if (customizationContext.dnd && !insertInPath) {
      return (
        <Draggable key={index} data={type} type={objectKey}>
          {children}
        </Draggable>
      );
    } else {
      return (
        <Row>
          <Col flex="auto">{children}</Col>
          <Col>
            <Button
              icon={<PlusOutlined style={{ fontSize: "14px" }} />}
              onClick={() =>
                dispatch(
                  addByPath({
                    path: insertInPath || { schema: [], uiSchema: [] },
                    value: type.default,
                  }),
                )
              }
              type="link"
              size="small"
            />
          </Col>
        </Row>
      );
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <Typography.Title
        level={4}
        style={{ textAlign: "center", margin: "15px 0" }}
      >
        Field types
      </Typography.Title>
      <Collapse
        defaultActiveKey={["simple", "collections"]}
        ghost
        items={Object.entries(customizationContext.allFieldTypes).map(
          ([key, type]) => ({
            key: key,
            label: type.title,
            children: (
              <Row gutter={[16, 8]}>
                {Object.entries(type.fields).map(([key, type], index) => (
                  <Col xs={22} xl={12} key={key} style={{ width: "100%" }}>
                    <DraggableOrNot index={index} type={type} objectKey={key}>
                      <Space style={{ padding: "2px 5px" }}>
                        {type.icon}
                        {type.title}
                      </Space>
                    </DraggableOrNot>
                  </Col>
                ))}
              </Row>
            ),
            className: type.className,
          }),
        )}
      />
    </div>
  );
};

SelectFieldType.propTypes = {};

export default SelectFieldType;
