import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import schemaWizard from "./schemaWizard";

const rootReducer = (history) =>
  combineReducers({
    schemaWizard,
    router: connectRouter(history),
  });

export default rootReducer;
