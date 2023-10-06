import { Provider } from "react-redux";

import store from "./store/configureStore";
import { ConfigProvider, Layout } from "antd";
import SchemaWizard from "./admin/components/SchemaWizard";
import CustomizationContext from "./contexts/CustomizationContext";
import fieldTypes from "./admin/utils/fieldTypes";

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
        <CustomizationContext.Provider value={{ allFieldTypes: fieldTypes}}>
          <Layout className="__mainLayout__">
            <Layout.Content>
                <SchemaWizard />
            </Layout.Content>
          </Layout>
        </CustomizationContext.Provider>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
