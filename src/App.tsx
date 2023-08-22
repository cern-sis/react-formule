import { Provider } from "react-redux";

import store, { history } from "./store/configureStore";
import { ConnectedRouter } from "connected-react-router";
import { ConfigProvider, Layout } from "antd";
import SchemaWizard from "./admin/containers/SchemaWizard";
import CustomizationContext from "./contexts/CustomizationContext";
import { customFieldTypes } from "./admin/utils/customFieldTypes";
import customFields from "./CustomFields";
import customWidgets from "./CustomWidgets";
import fieldTypes from "./admin/utils/fieldTypes";
import { combineFieldTypes } from "./admin/utils";

const PRIMARY_COLOR = "#006996";

const App = () => {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: PRIMARY_COLOR,
            colorLink: PRIMARY_COLOR,
            colorLinkHover: "#1a7fa3",
            borderRadius: 2,
            colorBgLayout: "#f0f2f5",
            fontFamily: "Titillium Web",
          },
        }}
      >
        <CustomizationContext.Provider value={{ allFieldTypes: combineFieldTypes(fieldTypes, customFieldTypes), customFields, customWidgets }}>
        <ConnectedRouter history={history}>
          <Layout className="__mainLayout__">
            <Layout.Content>
                <SchemaWizard />
            </Layout.Content>
          </Layout>
        </ConnectedRouter>
        </CustomizationContext.Provider>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
