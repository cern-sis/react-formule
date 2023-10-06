import schemaWizard from "./schemaWizard";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    schemaWizard,
  },
});

export default store;
