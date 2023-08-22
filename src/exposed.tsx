import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { schemaInit } from "./actions/schemaWizard";
import {
  _initSchemaStructure,
  combineFieldTypes,
  slugify,
} from "./admin/utils";
import CustomizationContext from "./contexts/CustomizationContext";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import store from "./store/configureStore";
import fieldTypes from "./admin/utils/fieldTypes";

export const MosesContext = ({
  children,
  customFieldTypes,
  customFields,
  customWidgets,
  theme,
  customStore
}) => {
  return (
    <Provider store={customStore || store}>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <DndProvider backend={HTML5Backend} context={window}>
        <ConfigProvider theme={theme}>
          <CustomizationContext.Provider
            value={{
              allFieldTypes: combineFieldTypes(fieldTypes, customFieldTypes),
              customFields,
              customWidgets,
            }}
          >
            {children}
          </CustomizationContext.Provider>
        </ConfigProvider>
      </DndProvider>
    </Provider>
  );
};

export const initMosesSchema = (schema) => {
  if (schema) {
    const { id, deposit_schema, deposit_options, ...configs } = schema;
    store.dispatch(
      schemaInit(
        id || "Schema Name",
        { schema: deposit_schema, uiSchema: deposit_options },
        configs
      )
    );
  } else {
    store.dispatch(
      schemaInit(
        slugify(Math.random().toString() + "_" + "name"),
        _initSchemaStructure(),
        {
          fullname: name,
        }
      )
    );
  }
};

export const getMosesState = () => {
  return store.getState().schemaWizard;
};
