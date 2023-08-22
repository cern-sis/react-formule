import { push } from "connected-react-router";
import { notification } from "antd";
import { CMS } from "../routes";

export const ADD_PROPERTY = "ADD_PROPERTY";

export const CREATE_MODE_ENABLE = "CREATE_MODE_ENABLE";

export const PROPERTY_SELECT = "PROPERTY_SELECT";

export const SCHEMA_INIT_REQUEST = "SCHEMA_INIT_REQUEST";
export const SCHEMA_INIT = "SCHEMA_INIT";

export const CURRENT_UPDATE_PATH = "CURRENT_UPDATE_PATH";
export const CURRENT_UPDATE_SCHEMA_PATH = "CURRENT_UPDATE_SCHEMA_PATH";
export const CURRENT_UPDATE_UI_SCHEMA_PATH = "CURRENT_UPDATE_UI_SCHEMA_PATH";

export function schemaInitRequest() {
  return {
    type: SCHEMA_INIT_REQUEST,
  };
}

export function schemaInit(id, data, configs = {}) {
  return {
    type: SCHEMA_INIT,
    id,
    data,
    configs,
  };
}

export function enableCreateMode() {
  return { type: CREATE_MODE_ENABLE };
}

export function selectProperty(path) {
  return {
    type: PROPERTY_SELECT,
    path,
  };
}

const findParentPath = (schemaPath) => {
  // Objects have to be required always for validation to work inside
  let isObj;
  for (let i = schemaPath.length - 1; i >= 0; i--) {
    // If we find a properties, it means we're inside an object (and not an array)
    if (schemaPath[i] === "properties") {
      isObj = true;
    } else if (isObj) {
      return schemaPath.splice(0, i + 1);
    } else {
      isObj = false;
    }
  }
  return [];
};

export function updateRequired(schemaPath, checked) {
  return function (dispatch) {
    if (schemaPath.length) {
      const parentPath = findParentPath(schemaPath);
      const fieldName = schemaPath[schemaPath.length - 1];
      dispatch(updateRequiredByPath(parentPath, fieldName, checked));
      dispatch(updateRequired(parentPath, checked));
    }
  };
}

export function updateRequiredByPath(path, fieldName, isRequired) {
  return function (dispatch, getState) {
    let schema = getState()
      .schemaWizard.getIn(["current", "schema", ...path])
      .toJS();

    let required = schema.required || [];

    if (isRequired) {
      if (!required.includes(fieldName)) {
        required.push(fieldName);
      }
    } else {
      required = required.filter((e) => e !== fieldName);
    }

    let updatedSchema = { ...schema, required: required };

    if (!required.length) {
      delete updatedSchema.required;
    }

    dispatch(updateSchemaByPath(path, updatedSchema));
  };
}

export function selectContentType(id) {
  return function (dispatch) {
    dispatch(push(`${CMS}/${id}`));
  };
}

export function selectFieldType(path, change) {
  return function (dispatch) {
    dispatch(updateByPath(path, change));
  };
}

export function updateSchemaByPath(path, value) {
  return {
    type: CURRENT_UPDATE_SCHEMA_PATH,
    path,
    value,
  };
}

export function updateUiSchemaByPath(path, value) {
  return {
    type: CURRENT_UPDATE_UI_SCHEMA_PATH,
    path,
    value,
  };
}

export function updateByPath(path, value) {
  return {
    type: CURRENT_UPDATE_PATH,
    path,
    value,
  };
}

export function addByPath({ schema: path, uiSchema: uiPath }, data) {
  return function (dispatch, getState) {
    let schema = getState()
      .schemaWizard.getIn(["current", "schema", ...path])
      .toJS();

    let _path = path;
    let _uiPath = uiPath;

    let random_name = `item_${Math.random().toString(36).substring(2, 8)}`;

    if (schema.type) {
      if (schema.type == "object") {
        if (!schema.properties) schema.properties = {};
        _path = [...path, "properties", random_name];
        _uiPath = [...uiPath, random_name];
      } else if (schema.type == "array") {
        if (!schema.items) schema.items = {};
        _path = [...path, "items"];
        _uiPath = [...uiPath, "items"];
      }

      dispatch(updateByPath({ schema: _path, uiSchema: _uiPath }, data));
    }
  };
}

export function addProperty(path, key) {
  return {
    type: ADD_PROPERTY,
    path,
    key,
  };
}

// delete item from schema and uiSchema
export function deleteByPath(item) {
  return function (dispatch, getState) {
    const { path, uiPath } = item;
    const uiItemToDelete = uiPath.pop();

    dispatch(updateRequired(path, false));

    // ********* schema **********
    let itemToDelete = path.pop();
    // if the last item is items then pop again since it is an array, in order to fetch the proper id
    itemToDelete = itemToDelete === "items" ? path.pop() : itemToDelete;

    let schema = getState()
      .schemaWizard.getIn(["current", "schema", ...path])
      .toJS();

    delete schema[itemToDelete];

    // ********* uiSchema **********
    let uiSchema = getState()
      .schemaWizard.getIn(["current", "uiSchema", ...uiPath])
      .toJS();

    delete uiSchema[uiItemToDelete];

    if (uiSchema["ui:order"]) {
      // remove the itemToDelete from the ui:order
      uiSchema["ui:order"] = uiSchema["ui:order"].filter(
        (item) => item !== uiItemToDelete
      );
    }

    // ********* update changes **********
    dispatch(
      updateByPath({ schema: path, uiSchema: uiPath }, { schema, uiSchema })
    );
    dispatch(enableCreateMode());
  };
}

// update the id field of a property
export function renameIdByPath(item, newName) {
  return function (dispatch, getState) {
    const path = item.path;
    const uiPath = item.uiPath;

    let itemToDelete = path.pop();
    // if the last item is items then pop again since it is an array, in order to fetch the proper id
    itemToDelete = itemToDelete === "items" ? path.pop() : itemToDelete;

    const uiItemToDelete = uiPath.pop();

    // check if the new id is empty or exact same with the current id
    if (newName === itemToDelete || newName === "") {
      notification.warning({
        description: "Make sure that the new id is different and not empty",
      });
      return;
    }

    if (newName.indexOf(" ") >= 0) {
      notification.warning({ description: "An id cannot contain spaces" });
      return;
    }

    // navigate to the correct path
    let schema = getState()
      .schemaWizard.getIn(["current", "schema", ...path])
      .toJS();
    let uiSchema = getState()
      .schemaWizard.getIn(["current", "uiSchema", ...uiPath])
      .toJS();

    // ********* schema **********
    let keys = Object.keys(schema);
    // make sure that the new name is unique among sibling widgets
    if (keys.includes(newName)) {
      notification.error({
        description: "The id should be unique, this name already exists",
      });
      return;
    }

    // create new obj with the information and then delete the old one
    schema[newName] = schema[itemToDelete];
    delete schema[itemToDelete];

    // ********* uiSchema **********
    if (!uiSchema["ui:order"]) {
      uiSchema["ui:order"] = [];
    }
    // update the uiOrder array
    let pos = uiSchema["ui:order"].indexOf(uiItemToDelete);
    if (pos > -1) {
      uiSchema["ui:order"][pos] = newName;
    }

    if (uiSchema[uiItemToDelete]) {
      uiSchema[newName] = uiSchema[uiItemToDelete];
    }
    // remove from the uiSchema
    delete uiSchema[uiItemToDelete];

    // ********* update changes **********
    dispatch(
      updateByPath({ schema: path, uiSchema: uiPath }, { schema, uiSchema })
    );

    dispatch(
      selectProperty({
        schema: [...path, newName],
        uiSchema: [...uiPath, newName],
      })
    );
  };
}
