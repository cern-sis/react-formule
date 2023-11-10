import { createSlice } from "@reduxjs/toolkit";
import { notification } from "antd";
import { set, get } from "lodash-es";
import { findParentPath } from "../utils";
import type { PayloadAction } from '@reduxjs/toolkit'


const initialState = {
  current: {
    schema: {},
    uiSchema: {},
  },
  initial: {
    schema: {},
    uiSchema: {},
  },
  initialConfig: {},
  config: {},
  field: null,
  formData: {},
  propKeyEditor: null,
  error: null,
  loader: false,
  version: null,
};

const _enableCreateMode = (state) => {
  state["field"] = null;
};

const _selectProperty = (state, action) => {
  const { path } = action.payload;
  state["field"] = {
    path: path.schema,
    uiPath: path.uiSchema,
  };
};

const _updateSchemaByPath = (state, action) => {
  const { path = [], value } = action.payload;
  set(state, ["current", "schema", ...path], value);
};

const _updateByPath = (state, action) => {
  const { path, value } = action.payload;
  set(state, ["current", "schema", ...path.schema], value.schema);
  set(state, ["current", "uiSchema", ...path.uiSchema], value.uiSchema);
};

const _updateRequired = (state, action) => {
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

  _updateSchemaByPath(state, {
    payload: { path: parentPath, value: updatedSchema },
  });
};

const createReducers = () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schemaInit(state, action: PayloadAction<any>) {
    const { data, configs } = action.payload;
    state["current"] = data;
    state["initial"] = data;
    state["config"] = configs;
    state["version"] = configs.version;
    state["initialConfig"] = configs;
    state["loader"] = false;
  },
  enableCreateMode: _enableCreateMode,
  selectProperty: _selectProperty,
  updateSchemaByPath: _updateSchemaByPath,
  updateUiSchemaByPath: (state, action) => {
    const { path = [], value } = action.payload;
    set(state, ["current", "uiSchema", ...path], value);
  },
  updateByPath: _updateByPath,
  addProperty(state, action) {
    set(
      state,
      ["current", "schema", ...action.path, "properties", action.key],
      {}
    );
    state["propKeyEditor"] = null;
  },
  addByPath(state, action) {
    const { path, value } = action.payload;
    const { schema: schemaPath, uiSchema: uiSchemaPath } = path;
    const schema = get(state, ["current", "schema", ...schemaPath]);

    let _path = schemaPath;
    let _uiPath = uiSchemaPath;

    const random_name = `item_${Math.random().toString(36).substring(2, 8)}`;

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

    _updateByPath(state, {
      payload: {
        path: { schema: _path, uiSchema: _uiPath },
        value,
      },
    });
  },
  deleteByPath(state, action) {
    const { path } = action.payload;
    const { path: schemaPath, uiPath: uiSchemaPath } = path;

    _updateRequired(state, {
      payload: { path: schemaPath, isRequired: false },
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
    _updateByPath(state, {
      payload: {
        path: { schema: newSchemaPath, uiSchema: newUiSchemaPath },
        value: { schema: updatedSchema, uiSchema: updatedUiSchema },
      },
    });
    _enableCreateMode(state);
  },
  renameIdByPath(state, action) {
    const { path, newName } = action.payload;
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
        message: "Make sure that the new id is different and not empty",
      });
      return;
    }

    if (newName.indexOf(" ") >= 0) {
      notification.warning({ message: "An id cannot contain spaces" });
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
      notification.error({
        message: "The id should be unique, this name already exists",
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

    _updateByPath(state, {
      payload: {
        path: { schema: newSchemaPath, uiSchema: newUiSchemaPath },
        value: { schema: updatedSchema, uiSchema: updatedUiSchema },
      },
    });

    _selectProperty(state, {
      payload: {
        path: {
          schema: [...newSchemaPath, newName],
          uiSchema: [...newUiSchemaPath, newName],
        },
      },
    });
  },
  updateRequired: _updateRequired,
  updateFormData(state, action) {
    const { value } = action.payload;
    state["formData"] = value;
  },
});

const reducers = createReducers();

const schemaWizard = createSlice({
  name: "schemaWizard",
  initialState,
  reducers: reducers,
});

export const {
  schemaInit,
  enableCreateMode,
  selectProperty,
  updateSchemaByPath,
  updateUiSchemaByPath,
  addProperty,
  addByPath,
  deleteByPath,
  renameIdByPath,
  updateRequired,
  updateFormData,
} = schemaWizard.actions;

export default schemaWizard.reducer;
