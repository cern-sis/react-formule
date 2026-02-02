import Form from "../../forms/Form";
import ObjectFieldTemplate from "../formComponents/ObjectFieldTemplate";
import ArrayFieldTemplate from "../formComponents/ArrayFieldTemplate";
import FieldTemplate from "../formComponents/FieldTemplate";
import { _validate } from "../utils";
import { useSelector } from "react-redux";
import CustomizationContext from "../../contexts/CustomizationContext";
import { useContext, useMemo } from "react";

const SchemaTree = () => {
  const schema = useSelector((state) => state.schemaWizard.current.schema);
  const uiSchema = useSelector((state) => state.schemaWizard.current.uiSchema);

  const customizationContext = useContext(CustomizationContext);

  // Memoize removeUiWidget function so it's not recreated on every render
  const removeUiWidget = useMemo(() => {
    return function removeUiWidgetRecursive(_obj) {
      // Handle null/undefined
      if (_obj == null) {
        return _obj;
      }

      // Handle arrays - recursively process each element
      if (Array.isArray(_obj)) {
        return _obj.map((item) => removeUiWidgetRecursive(item));
      }

      // Handle objects
      if (typeof _obj === "object") {
        const obj = {};
        for (const key in _obj) {
          // Skip the ui:widget property if its value is "table"
          if (key === "ui:widget" && _obj[key] === "table") {
            continue;
          }
          // Recursively process nested objects/arrays
          obj[key] = removeUiWidgetRecursive(_obj[key]);
        }
        return obj;
      }

      // Return primitive values as-is
      return _obj;
    };
  }, []);

  // Memoize transformed schema - only recompute when schema changes
  const transformedSchema = useMemo(
    () => customizationContext.transformSchema(schema),
    [customizationContext, schema]
  );

  // Memoize cleaned uiSchema - only recompute when uiSchema changes
  const cleanedUiSchema = useMemo(
    () => removeUiWidget(uiSchema),
    [removeUiWidget, uiSchema]
  );

  return (
    <Form
      schema={transformedSchema}
      uiSchema={cleanedUiSchema}
      formData={{}}
      ObjectFieldTemplate={ObjectFieldTemplate}
      ArrayFieldTemplate={ArrayFieldTemplate}
      FieldTemplate={FieldTemplate}
      onChange={() => {}}
      validate={_validate}
      liveValidate
      formContext={{ tree: true, schema: [], uiSchema: [] }}
      className="schemaTree"
    />
  );
};

export default SchemaTree;
