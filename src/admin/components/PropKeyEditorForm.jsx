import PropTypes from "prop-types";
import Form from "../../forms/Form";
import { hiddenFields } from "../utils/fieldTypes";
import widgets from "../formComponents/widgets";
import { useContext } from "react";
import CustomizationContext from "../../contexts/CustomizationContext";

const PropertyKeyEditorForm = ({
  uiSchema = {},
  schema = {},
  formData = {},
  onChange = null,
  optionsSchemaObject,
  optionsUiSchemaObject,
}) => {
  const customizationContext = useContext(CustomizationContext);

  let type;

  const cleanupSelect = () =>
    schema.type === "array" ? delete formData.enum : delete formData.items;

  // in case we can not define the type of the element from the uiSchema,
  // extract the type from the schema
  if (
    !uiSchema ||
    (!uiSchema["ui:widget"] && !uiSchema["ui:field"] && !uiSchema["ui:object"])
  ) {
    type = schema.type === "string" ? "text" : schema.type;
  } else {
    if (uiSchema["ui:widget"]) {
      type = uiSchema["ui:widget"];
      if (uiSchema["ui:widget"] === "select") {
        cleanupSelect();
      }
    }
    if (uiSchema["ui:field"]) {
      type = uiSchema["ui:field"];
    }
    if (uiSchema["ui:object"]) {
      type = uiSchema["ui:object"];
    }
  }

  // if there is no type then there is nothing to return
  if (!type) return;
  const objs = {
    ...customizationContext.allFieldTypes.collections.fields,
    ...customizationContext.allFieldTypes.simple.fields,
    ...customizationContext.allFieldTypes.advanced.fields,
    ...hiddenFields,
  };

  return (
    <Form
      schema={objs[type][`${optionsSchemaObject}`] || {}}
      uiSchema={objs[type][`${optionsUiSchemaObject}`] || {}}
      widgets={widgets}
      formData={formData}
      onChange={onChange}
      liveValidate
    />
  );
};

PropertyKeyEditorForm.propTypes = {
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  formData: PropTypes.object,
  onChange: PropTypes.func,
  optionsSchemaObject: PropTypes.object,
  optionsUiSchemaObject: PropTypes.object,
};

export default PropertyKeyEditorForm;
