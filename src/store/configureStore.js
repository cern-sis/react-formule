import { createBrowserHistory } from "history";
import { connectRouter } from "connected-react-router";

import schemaWizard from "./schemaWizard";
import { configureStore } from "@reduxjs/toolkit";

export const history = createBrowserHistory();

const store = configureStore({
  reducer: {
    schemaWizard,
    router: connectRouter(history),
  },
});

export default store;
