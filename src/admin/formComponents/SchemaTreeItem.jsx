import { useDispatch } from "react-redux";
import { PropTypes } from "prop-types";

import { DownOutlined, UpOutlined, CopyOutlined } from "@ant-design/icons";
import { Col, Dropdown, Row, Tag, Typography } from "antd";
import { getIconByType, isItTheArrayField } from "../utils";
import { useContext } from "react";
import CustomizationContext from "../../contexts/CustomizationContext";
import { selectProperty } from "../../store/schemaWizard";

const SchemaTreeItem = ({
  path,
  uiSchema = {},
  schema,
  display,
  updateDisplay,
}) => {
  const customizationContext = useContext(CustomizationContext);

  const dispatch = useDispatch();

  // selects the item for the property editor
  const handleClick = () => {
    dispatch(selectProperty({ path }));
  };

  const handleUpdateDisplay = (e) => {
    e.stopPropagation();
    updateDisplay();
  };

  const handleDropdownClick = (e) => {
    if (e.key === "copy") {
      navigator.clipboard.writeText(path.schema[path.schema.length - 1]);
    }
  };

  const shouldBoxAcceptChildren = (uiSchema) => {
    return uiSchema["ui:field"] !== undefined;
  };

  const dropdownItems = [
    {
      key: "copy",
      label: "Copy ID",
      icon: <CopyOutlined />,
    },
  ];

  return (
    <Tag
      style={{
        width: "100%",
        marginTop: "1px",
        marginBottom: "1px",
        padding: "5px 10px",
        opacity:
          uiSchema &&
          uiSchema["ui:options"] &&
          uiSchema["ui:options"].hidden &&
          0.5,
        backgroundColor: "white",
      }}
      data-cy="treeItem"
    >
      <Dropdown
        menu={{ items: dropdownItems, onClick: handleDropdownClick }}
        trigger={["contextMenu"]}
      >
        <Row gutter={8} onClick={handleClick} align="middle" wrap={false}>
          <Col flex="none">
            {getIconByType(
              schema,
              uiSchema,
              customizationContext.allFieldTypes,
            )}
          </Col>
          <Col flex="auto">
            <Row
              style={{
                width: "100%",
                marginTop: schema.title ? "-6px" : "0",
              }}
              justify="space-between"
              wrap={false}
              gutter={8}
            >
              <Col>
                <Typography.Text style={{ fontSize: "14px" }} ellipsis>
                  {path.schema[path.schema.length - 1]}
                </Typography.Text>
              </Col>
            </Row>
            {schema.title && (
              <Row
                style={{
                  width: "100%",
                  marginTop: "-9px",
                  marginBottom: "-5px",
                }}
              >
                <Col>
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: "12px" }}
                    ellipsis
                  >
                    {schema.title}
                  </Typography.Text>
                </Col>
              </Row>
            )}
          </Col>
          <Col>
            {schema &&
              ((schema.type == "object" &&
                !shouldBoxAcceptChildren(uiSchema)) ||
                isItTheArrayField(schema, uiSchema)) &&
              (display ? (
                <UpOutlined onClick={handleUpdateDisplay} />
              ) : (
                <DownOutlined onClick={handleUpdateDisplay} />
              ))}
          </Col>
        </Row>
      </Dropdown>
    </Tag>
  );
};

SchemaTreeItem.propTypes = {
  schema: PropTypes.object,
  id: PropTypes.string,
  path: PropTypes.array,
  addProperty: PropTypes.func,
  addItem: PropTypes.func,
  type: PropTypes.string,
  colorIndex: PropTypes.string,
  display: PropTypes.bool,
  updateDisplay: PropTypes.func,
  uiSchema: PropTypes.object,
};

export default SchemaTreeItem;
