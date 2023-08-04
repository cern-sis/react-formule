import { Provider } from "react-redux";

import store, { history } from "./store/configureStore";
import { ConnectedRouter } from "connected-react-router";
import { ConfigProvider, Layout } from "antd";
import Loading from "./routes/Loading/Loading";
import { Suspense } from "react";
import AdminPanel from "./admin/containers/AdminPanel";

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
              <Suspense fallback={<Loading pastDelay />}>
                <AdminPanel />
              </Suspense>
            </Layout.Content>
          </Layout>
        </ConnectedRouter>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
