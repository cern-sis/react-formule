import { Provider } from "react-redux";

import store, { history } from "./store/configureStore";
import { ConnectedRouter } from "connected-react-router";
import { ConfigProvider, Layout } from "antd";
import SchemaWizard from "./admin/containers/SchemaWizard";

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
        <ConnectedRouter history={history}>
          <Layout className="__mainLayout__">
            <Layout.Content>
                <SchemaWizard />
            </Layout.Content>
          </Layout>
        </ConnectedRouter>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
