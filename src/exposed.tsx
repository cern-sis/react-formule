import { DndProvider } from "react-dnd";
import { MultiBackend } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { initSchemaStructure, combineFieldTypes } from "./admin/utils";
import CustomizationContext from "./contexts/CustomizationContext";
import { ConfigProvider, ThemeConfig } from "antd";
import { Provider } from "react-redux";
import store from "./store/configureStore";
import fieldTypes from "./admin/utils/fieldTypes";
import { ReactNode } from "react";
import { RJSFSchema } from "@rjsf/utils";
import { SchemaWizardState, schemaInit } from "./store/schemaWizard";
import StateSynchronizer from "./StateSynchronizer";

type FormuleContextProps = {
  children: ReactNode;
  customFieldTypes?: object;
  customFields?: object;
  customWidgets?: object;
  customPublishedFields?: object;
  customPublishedWidgets?: object;
  theme?: ThemeConfig;
  separator?: string;
  synchronizeState?: (state: SchemaWizardState) => void;
  transformSchema?: (schema: object) => object;
};

export const FormuleContext = ({
  children,
  customFieldTypes,
  customFields,
  customWidgets,
  customPublishedFields,
  customPublishedWidgets,
  theme,
  separator = "::",
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
              transformSchema,
              separator,
            }}
          >
            {content}
          </CustomizationContext.Provider>
        </ConfigProvider>
      </DndProvider>
    </Provider>
  );
};

// TODO: Review typing (here and in the actions file)
export const initFormuleSchema = (
  data?: RJSFSchema,
  name?: string,
  description?: string,
) => {
  const { deposit_schema, deposit_options, ...configs } = data || {};
  store.dispatch(
    schemaInit({
      data:
        deposit_schema && deposit_options
          ? { schema: deposit_schema, uiSchema: deposit_options }
          : initSchemaStructure(name, description),
      configs: configs || { fullname: name },
    }),
  );
};

export const getFormuleState = () => {
  return store.getState().schemaWizard;
};
