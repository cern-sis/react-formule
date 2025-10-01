import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export const initialState = {
  formData: {} as Record<string, unknown>,
};

export type FormState = typeof initialState;

const form = createSlice({
  name: "form",
  initialState,
  reducers: {
    updateFormData(
      state,
      action: PayloadAction<{ value: Record<string, unknown> }>,
    ) {
      const { value } = action.payload;
      state.formData = value;
    },
  },
});

export const { updateFormData } = form.actions;

export default form.reducer;
