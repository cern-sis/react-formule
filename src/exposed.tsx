import { DndProvider } from "react-dnd";
import { MultiBackend } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { combineFieldTypes } from "./admin/utils";
import CustomizationContext from "./contexts/CustomizationContext";
import { ConfigProvider } from "antd";
import { Provider, useDispatch } from "react-redux";
import store from "./store/configureStore";
import fieldTypes from "./admin/utils/fieldTypes";
import { SetStateAction } from "react";
import { RJSFSchema } from "@rjsf/utils";
import { initialState, schemaInit, updateFormData } from "./store/schemaWizard";
import StateSynchronizer from "./StateSynchronizer";
import { isEqual, pick } from "lodash-es";
import { itemIdGenerator } from "./utils";
import { FormuleContextProps } from "./types";
import RJSFForm from "./forms";

const LOCAL_STORAGE_KEY = "formuleForm_";

export const FormuleContext = ({
  children,
  customFieldTypes,
  customFields,
  customWidgets,
  customPublishedFields,
  customPublishedWidgets,
  customFunctions,
  theme,
  separator = "::",
  errorBoundary,
  synchronizeState,
  transformSchema = (schema) => schema,
}: FormuleContextProps) => {
  const content = synchronizeState ? (
    <StateSynchronizer synchronizeState={synchronizeState}>
      {children}
    </StateSynchronizer>
  ) : (
    children
  );
  return (
    <Provider store={store}>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <DndProvider
        backend={MultiBackend}
        options={HTML5toTouch}
        context={window}
      >
        <ConfigProvider theme={theme}>
          <CustomizationContext.Provider
            value={{
              allFieldTypes: combineFieldTypes(fieldTypes, customFieldTypes),
              customFields,
              customWidgets,
              customPublishedFields,
              customPublishedWidgets,
              customFunctions,
              separator,
              errorBoundary,
              transformSchema,
            }}
          >
            {content}
          </CustomizationContext.Provider>
        </ConfigProvider>
      </DndProvider>
    </Provider>
  );
};

export const FormuleForm = (props) => {
  const dispatch = useDispatch();

  return (
    <RJSFForm
      {...props}
      onChange={(change) =>
        dispatch(updateFormData({ value: change.formData }))
      }
    />
  );
};

export const initFormuleSchema = (
  data?: RJSFSchema,
  title?: string,
  description?: string
) => {
  const { schema, uiSchema, id } = data || {};
  store.dispatch(
    schemaInit({
      data: {
        schema: schema || {
          ...initialState.current.schema,
          ...(title && { title }),
          ...(description && { description }),
        },
        uiSchema: uiSchema || initialState.current.uiSchema,
      },
      id: id || itemIdGenerator(),
    })
  );
};

export const getFormuleState = () => {
  return store.getState().schemaWizard;
};

export const getAllFromLocalStorage = () => {
  return Object.entries(localStorage)
    .filter(([k, v]) => {
      if (k.startsWith(LOCAL_STORAGE_KEY)) {
        try {
          JSON.parse(v);
          return true;
        } catch (error) {
          console.error("Error parsing formuleForm JSON: ", error);
          return false;
        }
      }
      return false;
    })
    .map(([k, v]) => ({ id: k.split("_")[1], value: JSON.parse(v) }));
};

const handleStorageEvent = (resolve) => {
  resolve(getAllFromLocalStorage());
  window.removeEventListener("storage", handleStorageEvent);
};

const storagePromise = (func) => {
  return new Promise<SetStateAction<{ id: string; value: object }[]>>(
    (resolve) => {
      window.addEventListener("storage", () => handleStorageEvent(resolve));
      func();
      window.dispatchEvent(new Event("storage"));
    }
  );
};

export const saveToLocalStorage = () => {
  return storagePromise(() => {
    const formuleState = store.getState().schemaWizard;
    const localStorageKey = `${LOCAL_STORAGE_KEY}${formuleState.id}`;
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({ ...formuleState.current, id: formuleState.id })
    );
  });
};

export const deleteFromLocalStorage = (id: string) => {
  return storagePromise(() =>
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}${id}`)
  );
};

export const loadFromLocalStorage = (id: string) => {
  const localState = JSON.parse(
    localStorage.getItem(`${LOCAL_STORAGE_KEY}${id}`) || "{}"
  );
  initFormuleSchema(localState);
};

export const isUnsaved = () => {
  const formuleState = store.getState().schemaWizard;
  const localState = JSON.parse(
    localStorage.getItem(`${LOCAL_STORAGE_KEY}${formuleState.id}`) ?? "{}"
  );
  return !isEqual(
    formuleState.current,
    pick(localState, ["schema", "uiSchema"])
  );
};
