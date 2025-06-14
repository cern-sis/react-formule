import { hiddenFields } from "./fieldTypes";

export const SIZE_OPTIONS = {
  xsmall: 8,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
};

let _addErrors = (errors, path) => {
  errors.addError({ schema: path.schema, uiSchema: path.uiSchema });

  Object.keys(errors).map((error) => {
    if (error != "__errors" && error != "addError") {
      _addErrors(errors[error], {
        schema: [...path.schema, "properties", error],
        uiSchema: [...path.uiSchema, error],
      });
    }
  });
  return errors;
};
export const _validate = function (formData, errors) {
  return _addErrors(errors, { schema: [], uiSchema: [] });
};

export const shoudDisplayGuideLinePopUp = (schema) => {
  return schema.properties && Object.keys(schema.properties).length === 0;
};

export const isItTheArrayField = (schema, uiSchema) => {
  return (
    schema.type === "array" && !uiSchema["ui:field"] && !uiSchema["ui:widget"]
  );
};

export const combineFieldTypes = (fieldTypes, customFieldTypes) => {
  if (!customFieldTypes) {
    return fieldTypes;
  }
  let combined = {};
  Object.entries(fieldTypes).map(([key, type]) => {
    combined[key] = type;
    combined[key]["fields"] = {
      ...type.fields,
      ...customFieldTypes[key],
    };
  });
  return combined;
};

export const timer = (ms) => new Promise((res) => setTimeout(res, ms));

export const getFieldSpec = (schema, uiSchema, fieldTypes) => {
  let type = "unknown";
  // in case we can not define the type of the element from the uiSchema,
  // extract the type from the schema
  if (
    !uiSchema ||
    (!uiSchema["ui:widget"] && !uiSchema["ui:field"] && !uiSchema["ui:object"])
  ) {
    if (schema.type === "string") {
      type = "text";
    } else if (schema.type === "array" && uiSchema?.["ui:array"]) {
      type = uiSchema["ui:array"];
    } else {
      type = schema.type;
    }
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

  const fieldTypesWithHidden = {
    ...fieldTypes,
    hidden: { fields: hiddenFields },
  };

  for (const category in fieldTypesWithHidden) {
    for (const [key, value] of Object.entries(
      fieldTypesWithHidden[category].fields,
    )) {
      if (key === type) {
        return value;
      }
    }
  }
};
