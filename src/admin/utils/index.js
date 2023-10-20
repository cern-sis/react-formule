export const SIZE_OPTIONS = {
  xsmall: 8,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
};

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

export const initSchemaStructure = (name = "New schema", description = "") => ({
  schema: {
    title: name,
    description: description,
    type: "object",
    properties: {},
  },
  uiSchema: {},
});

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
  return schema.properties && schema.properties.size === 0;
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
