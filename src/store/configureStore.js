import schemaWizard, { initialState } from "./schemaWizard";
import form from "./form";
import { configureStore } from "@reduxjs/toolkit";

const preloadedState = () => {
  let parsedData;
  try {
    parsedData = JSON.parse(localStorage.getItem("formuleCurrent"));
  } catch (error) {
    console.error("Error parsing formuleCurrent from localStorage: ", error);
  }
  return {
    schemaWizard: {
      ...initialState,
      ...(parsedData?.schemaWizard || {}),
    },
  };
};

export const persistMiddleware = ({ getState }) => {
  return (next) => (action) => {
    const result = next(action);

    if (action.type.startsWith("form/")) {
      return result;
    }

    const state = getState();
    const persistedData = {
      schemaWizard: {
        current: state.schemaWizard.current,
        id: state.schemaWizard.id,
      },
    };
    localStorage.setItem("formuleCurrent", JSON.stringify(persistedData));
    return result;
  };
};

const store = configureStore({
  reducer: {
    schemaWizard,
    form,
  },
  preloadedState: preloadedState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistMiddleware),
});

export default store;
