import { createSlice } from "@reduxjs/toolkit";
import { notification } from "antd";
import { set, get } from "lodash-es";
import { findParentPath, itemIdGenerator } from "../utils";
import type { PayloadAction } from "@reduxjs/toolkit";

export const initialState = {
  current: {
    schema: {
      title: "New schema",
      description: "",
      type: "object",
      properties: {},
    },
    uiSchema: {},
  },
  initial: {
    schema: {},
    uiSchema: {},
  },
  id: itemIdGenerator(),
  field: {},
  formData: {},
};

export type SchemaWizardState = typeof initialState;

const schemaWizard = createSlice({
  name: "schemaWizard",
  initialState,
  reducers: {
    schemaInit(state, action: PayloadAction<{ data; id }>) {
      const { data, id } = action.payload;
      Object.assign(state, initialState);
      state["current"] = data;
      state["initial"] = data;
      state["id"] = id;
    },
    enableCreateMode(state) {
      state["field"] = {};
    },
    selectProperty(state, action) {
      const { path } = action.payload;
      state["field"] = {
        path: path.schema,
        uiPath: path.uiSchema,
      };
    },
    updateSchemaByPath(state, action) {
      const { path = [], value } = action.payload;
      set(state, ["current", "schema", ...path], value);
    },
    updateUiSchemaByPath: (state, action) => {
      const { path = [], value } = action.payload;
      set(state, ["current", "uiSchema", ...path], value);
    },
    updateByPath(state, action) {
      const { path, value } = action.payload;
      set(state, ["current", "schema", ...path.schema], value.schema);
      set(state, ["current", "uiSchema", ...path.uiSchema], value.uiSchema);
    },
    addByPath(state, action) {
      const { path, value } = action.payload;
      const { schema: schemaPath, uiSchema: uiSchemaPath } = path;
      const schema = get(state, ["current", "schema", ...schemaPath]);

      let _path = schemaPath;
      let _uiPath = uiSchemaPath;

      const random_name = `item_${itemIdGenerator()}`;

      if (schema.type) {
        if (schema.type == "object") {
          if (!schema.properties) schema.properties = {};
          _path = [...schemaPath, "properties", random_name];
          _uiPath = [...uiSchemaPath, random_name];
        } else if (schema.type == "array") {
          if (!schema.items) schema.items = {};
          _path = [...schemaPath, "items"];
          _uiPath = [...uiSchemaPath, "items"];
        }
      }

      schemaWizard.caseReducers.updateByPath(state, {
        payload: {
          path: { schema: _path, uiSchema: _uiPath },
          value,
        },
        type: "schemaWizard/updateByPath",
      });
    },
    deleteByPath(state, action) {
      const { path } = action.payload;
      const { path: schemaPath, uiPath: uiSchemaPath } = path;

      schemaWizard.caseReducers.updateRequired(state, {
        payload: { path: schemaPath, isRequired: false },
        type: "schemaWizard/updateRequired",
      });

      // Schema:
      const newSchemaPath = [...schemaPath];
      let itemToDelete = newSchemaPath.pop();
      // if the last item is items then pop again since it is an array, in order to fetch the proper id
      itemToDelete =
        itemToDelete === "items" ? newSchemaPath.pop() : itemToDelete;

      const schema = get(state, ["current", "schema", ...newSchemaPath]);
      const updatedSchema = { ...schema };
      delete updatedSchema[itemToDelete];

      // uiSchema:
      const newUiSchemaPath = [...uiSchemaPath];
      const uiItemToDelete = newUiSchemaPath.pop();

      const uiSchema = get(state, ["current", "uiSchema", ...newUiSchemaPath]);
      const updatedUiSchema = { ...uiSchema };
      delete updatedUiSchema[uiItemToDelete];

      // Update changes:
      schemaWizard.caseReducers.updateByPath(state, {
        payload: {
          path: { schema: newSchemaPath, uiSchema: newUiSchemaPath },
          value: { schema: updatedSchema, uiSchema: updatedUiSchema },
        },
        type: "schemaWizard/updateByPath",
      });
      schemaWizard.caseReducers.enableCreateMode(state);
    },
    renameIdByPath(state, action) {
      const { path, newName, separator } = action.payload;
      const { path: schemaPath, uiPath: uiSchemaPath } = path;

      const newSchemaPath = [...schemaPath];
      let itemToDelete = newSchemaPath.pop();
      // if the last item is items then pop again since it is an array, in order to fetch the proper id
      itemToDelete =
        itemToDelete === "items" ? newSchemaPath.pop() : itemToDelete;

      const newUiSchemaPath = [...uiSchemaPath];
      const uiItemToDelete = newUiSchemaPath.pop();
      // check if the new id is empty or exact same with the current id
      if (newName === itemToDelete || newName === "") {
        notification.warning({
          message: "Invalid format",
          description: "Make sure that the new ID is different and not empty",
        });
        return;
      }

      if ([" ", ...separator].some((c) => newName.includes(c))) {
        notification.warning({
          message: "Invalid format",
          description: `An ID can't contain spaces or \`${Array.from(
            new Set(separator),
          ).join(" ")}\` characters`,
        });
        return;
      }

      // navigate to the correct path
      const schema = get(state, ["current", "schema", ...newSchemaPath]);
      const uiSchema = get(state, ["current", "uiSchema", ...newUiSchemaPath]);

      const updatedSchema = { ...schema };
      const updatedUiSchema = { ...uiSchema };

      // Schema:
      const keys = Object.keys(schema);
      // make sure that the new name is unique among sibling widgets
      if (keys.includes(newName)) {
        notification.warning({
          message: "Duplicate ID",
          description: "The ID should be unique",
        });
        return;
      }

      // create new obj with the information and then delete the old one
      updatedSchema[newName] = updatedSchema[itemToDelete];
      delete updatedSchema[itemToDelete];

      if (updatedUiSchema[uiItemToDelete]) {
        updatedUiSchema[newName] = updatedUiSchema[uiItemToDelete];
      }
      // remove from the uiSchema
      delete updatedUiSchema[uiItemToDelete];

      // update ui:order if it exists
      if (updatedUiSchema["ui:order"]) {
        const orderIndex = updatedUiSchema["ui:order"].indexOf(itemToDelete);
        if (orderIndex !== -1) {
          updatedUiSchema["ui:order"][orderIndex] = newName;
        }
      }

      schemaWizard.caseReducers.updateByPath(state, {
        payload: {
          path: { schema: newSchemaPath, uiSchema: newUiSchemaPath },
          value: { schema: updatedSchema, uiSchema: updatedUiSchema },
        },
        type: "schemaWizard/updateByPath",
      });

      schemaWizard.caseReducers.selectProperty(state, {
        payload: {
          path: {
            schema: [...newSchemaPath, newName],
            uiSchema: [...newUiSchemaPath, newName],
          },
        },
        type: "schemaWizard/selectProperty",
      });
    },
    updateRequired(state, action) {
      const { path, isRequired } = action.payload;

      const parentPath = findParentPath(path);
      const fieldName = path[path.length - 1];

      const schema = get(state, ["current", "schema", ...parentPath]);

      let required = schema.required || [];

      if (isRequired) {
        if (!required.includes(fieldName)) {
          required.push(fieldName);
        }
      } else {
        required = required.filter((e) => e !== fieldName);
      }

      const updatedSchema = { ...schema, required: required };

      if (!required.length) {
        delete updatedSchema.required;
      }

      schemaWizard.caseReducers.updateSchemaByPath(state, {
        payload: { path: parentPath, value: updatedSchema },
        type: "schemaWizard/updateSchemaByPath",
      });
    },
    updateFormData(state, action) {
      const { value } = action.payload;
      state["formData"] = value;
    },
  },
});

export const {
  schemaInit,
  enableCreateMode,
  selectProperty,
  updateSchemaByPath,
  updateUiSchemaByPath,
  addByPath,
  deleteByPath,
  renameIdByPath,
  updateRequired,
  updateFormData,
} = schemaWizard.actions;

export default schemaWizard.reducer;
