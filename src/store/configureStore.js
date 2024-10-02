import schemaWizard, { initialState } from "./schemaWizard";
import { configureStore } from "@reduxjs/toolkit";

const preloadedState = () => {
  let parsedData;
  try {
    parsedData = JSON.parse(localStorage.getItem("formuleCurrent"));
  } catch (error) {
    console.error("Error parsing formuleCurrent from localStorage: ", error);
  }
  return parsedData || { schemaWizard: initialState };
};

export const persistMiddleware = ({ getState }) => {
  return (next) => (action) => {
    const result = next(action);
    localStorage.setItem("formuleCurrent", JSON.stringify(getState()));
    return result;
  };
};

const store = configureStore({
  reducer: {
    schemaWizard,
  },
  preloadedState: preloadedState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistMiddleware),
});

export default store;
