import classNames from "classnames";
import { isObject, isNumber } from "lodash-es";
import { canExpand } from "@rjsf/utils";
import { Button, Col, Row } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import TabField from "./Tabs/TabField";
import PropTypes from "prop-types";
import FieldHeader from "./Field/FieldHeader";
import StepsField from "./StepsField";

const ObjectFieldTemplate = ({
  description,
  disabled,
  formContext,
  formData,
  idSchema,
  onAddClick,
  prefixCls,
  properties,
  readonly,
  // required,
  schema,
  title,
  uiSchema,
}) => {
  const {
    colSpan = 24,
    labelAlign = "right",
    rowGutter = 24,
    hideAnchors,
  } = formContext;

  const labelClsBasic = `${prefixCls}-item-label`;
  const labelColClassName = classNames(
    labelClsBasic,
    labelAlign === "left" && `${labelClsBasic}-left`,
  );

  const findSchema = (element) => element.content.props.schema;

  const findSchemaType = (element) => findSchema(element).type;

  const findUiSchema = (element) => element.content.props.uiSchema || {};

  const findUiSchemaField = (element) => findUiSchema(element)["ui:field"];

  const findUiSchemaOptions = (element) => findUiSchema(element)["ui:options"];

  const findUiSchemaWidget = (element) => findUiSchema(element)["ui:widget"];

  const calculateColSpan = (element) => {
    const type = findSchemaType(element);
    const field = findUiSchemaField(element);
    const widget = findUiSchemaWidget(element);
    const options = findUiSchemaOptions(element);

    const span = options ? options["span"] : null;
    if (span) {
      return span;
    }

    const defaultColSpan =
      properties.length < 2 || // Single or no field in object.
      type === "object" ||
      type === "array" ||
      widget === "textarea"
        ? 24
        : 12;

    if (isObject(colSpan)) {
      return (
        colSpan[widget] || colSpan[field] || colSpan[type] || defaultColSpan
      );
    }
    if (isNumber(colSpan)) {
      return colSpan;
    }
    return defaultColSpan;
  };

  if (uiSchema["ui:object"] == "tabView")
    return (
      <TabField
        uiSchema={uiSchema}
        properties={properties}
        idSchema={idSchema}
      />
    );
  if (uiSchema["ui:object"] == "stepsView")
    return (
      <StepsField
        uiSchema={uiSchema}
        properties={properties}
        idSchema={idSchema}
      />
    );
  return (
    <fieldset
      style={
        "ui:padding" in uiSchema
          ? { padding: uiSchema["ui:padding"] }
          : undefined
      }
      id={idSchema.$id}
    >
      <Row gutter={rowGutter} style={{ margin: 0 }}>
        {(uiSchema["ui:label"] || title) && (
          <Col
            style={{
              padding: "0",
              marginBottom: "12px",
            }}
            className={labelColClassName}
            span={24}
          >
            <FieldHeader
              label={uiSchema["ui:title"] || title}
              isObject
              description={uiSchema["ui:description"] || description}
              uiSchema={uiSchema}
              idSchema={idSchema}
              hideAnchors={hideAnchors}
            />
          </Col>
        )}
        <Col
          span={24}
          className="nestedObject"
          style={
            "ui:padding" in uiSchema
              ? { padding: uiSchema["ui:padding"] }
              : undefined
          }
        >
          <Row gutter={10}>
            {properties
              .filter((e) => !e.hidden)
              .map((element) => (
                <Col
                  key={element.name}
                  span={calculateColSpan(element)}
                  data-cy="spanColWrapper"
                >
                  {element.content}
                </Col>
              ))}
          </Row>
        </Col>
      </Row>
      {canExpand(schema, uiSchema, formData) && !readonly && (
        <Col span={24}>
          <Row gutter={rowGutter} justify="end">
            <Col flex="192px">
              <Button
                block
                className="object-property-expand"
                disabled={disabled}
                onClick={onAddClick(schema)}
                type="primary"
              >
                <PlusCircleOutlined /> Add Item
              </Button>
            </Col>
          </Row>
        </Col>
      )}
    </fieldset>
  );
};

ObjectFieldTemplate.propTypes = {
  disabled: PropTypes.bool,
  formContext: PropTypes.object,
  onAddClick: PropTypes.func,
  description: PropTypes.string,
  readonly: PropTypes.bool,
  required: PropTypes.bool,
  schema: PropTypes.object,
  formData: PropTypes.object,
  idSchema: PropTypes.object,
  prefixCls: PropTypes.string,
  title: PropTypes.string,
  uiSchema: PropTypes.object,
  properties: PropTypes.object,
};

export default ObjectFieldTemplate;
