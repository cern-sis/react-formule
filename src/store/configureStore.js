import schemaWizard, { initialState } from "./schemaWizard";
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

    // Skip formData updates for better performance since formData is not persisted
    if (action.type.includes("updateFormData")) {
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
  },
  preloadedState: preloadedState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistMiddleware),
});

export default store;
