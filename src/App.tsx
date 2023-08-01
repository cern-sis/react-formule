import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import SchemaWizard from './admin/containers/SchemaWizard'
import { Provider } from 'react-redux'

import store, { history } from "./store/configureStore";
import { ConnectedRouter } from 'connected-react-router'
import AdminIndex from './admin/components/AdminIndex'
import { ConfigProvider } from 'antd'
import Admin from './admin/Admin'

const PRIMARY_COLOR = "#006996";

const App = () => {
  const [count, setCount] = useState(0)

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
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
          {/* <SchemaWizard /> */}
          <Admin />
    </ConnectedRouter>
    </ConfigProvider>
      </Provider>
  )
}

export default App
