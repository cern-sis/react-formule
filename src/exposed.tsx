import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  _initSchemaStructure,
  combineFieldTypes,
  slugify,
} from "./admin/utils";
import CustomizationContext from "./contexts/CustomizationContext";
import { ConfigProvider, ThemeConfig } from "antd";
import { Provider } from "react-redux";
import store from "./store/configureStore";
import fieldTypes from "./admin/utils/fieldTypes";
import { Store } from "redux";
import { FC, ReactNode } from "react";
import { RJSFSchema } from "@rjsf/utils";
import { schemaInit } from "./store/schemaWizard";

type MosesContextProps = {
  children: ReactNode,
  customFieldTypes?: object,
  customFields?: object,
  customWidgets?: object,
  theme?: ThemeConfig,
  customStore?: Store
}

export const MosesContext: FC<MosesContextProps> = ({
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

export const initMosesSchema = (schema?: RJSFSchema) => {
  if (schema) {
    const { id, deposit_schema, deposit_options, ...configs } = schema;
    store.dispatch(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      schemaInit({
        id: id || "Schema Name",
        data: { schema: deposit_schema, uiSchema: deposit_options },
        configs: configs,
      })
    );
  } else {
    store.dispatch(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      schemaInit({
        id: slugify(Math.random().toString() + "_" + "name"),
        data: _initSchemaStructure(),
        configs: {
          fullname: name,
        },
      })
    );
  }
};

export const getMosesState = () => {
  return store.getState().schemaWizard;
};
