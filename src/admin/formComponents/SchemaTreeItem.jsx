import { useDispatch } from "react-redux";
import { PropTypes } from "prop-types";

import {
  DownOutlined,
  QuestionOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { Col, Row, Tag, Typography } from "antd";
import { isItTheArrayField } from "../utils";
import { useContext } from "react";
import CustomizationContext from "../../contexts/CustomizationContext";
import { selectProperty } from "../../store/schemaWizard";
import { hiddenFields } from "../utils/fieldTypes";

const SchemaTreeItem = ({
  path,
  uiSchema = {},
  schema,
  display,
  updateDisplay,
}) => {
  const customizationContext = useContext(CustomizationContext)

  const dispatch = useDispatch()

  // selects the item for the property editor
  const handleClick = () => {
    dispatch(selectProperty({path}));
  };

  const handleUpdateDisplay = e => {
    e.stopPropagation();
    updateDisplay();
  };

  const shouldBoxAcceptChildren = uiSchema => {
    return uiSchema["ui:field"] !== undefined;
  };

  const getIconByType = (uiSchema = {}, schema = {}) => {
    let type = "unknown";
    // in case we can not define the type of the element from the uiSchema,
    // extract the type from the schema
    if (
      !uiSchema ||
      (!uiSchema["ui:widget"] &&
        !uiSchema["ui:field"] &&
        !uiSchema["ui:object"])
    ) {
      type = schema.type === "string" ? "text" : schema.type;
    } else {
      if (uiSchema["ui:widget"]) {
        type = schema.format === "uri" ? schema.format : uiSchema["ui:widget"];
      }
      if (uiSchema["ui:field"]) {
        type = uiSchema["ui:field"];
      }
      if (uiSchema["ui:object"]) {
        type = uiSchema["ui:object"];
      }
    }

    const allFieldTypes = {...customizationContext.allFieldTypes, hidden: {fields: hiddenFields}}

    for (const category in allFieldTypes) {
      for (const [key, value] of Object.entries(allFieldTypes[category].fields)) {
        if (key === type) {
          return value.icon;
        }
      }
    }
    return <QuestionOutlined />
  };

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
      <Row gutter={8} onClick={handleClick} align="middle" wrap={false}>
        <Col flex="none">{getIconByType(uiSchema, schema)}</Col>
        <Col flex="auto">
          <Row
            style={{ width: "100%", marginTop: schema.title ? "-9px" : "0" }}
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
              style={{ width: "100%", marginTop: "-9px", marginBottom: "-9px" }}
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
            ((schema.type == "object" && !shouldBoxAcceptChildren(uiSchema)) ||
              isItTheArrayField(schema, uiSchema)) &&
            (display ? (
              <UpOutlined onClick={handleUpdateDisplay} />
            ) : (
              <DownOutlined onClick={handleUpdateDisplay} />
            ))}
        </Col>
      </Row>
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

export default SchemaTreeItem
