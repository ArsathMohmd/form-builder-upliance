import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormSchema, FormField } from "../Types/FormTypes";

interface FormState {
  currentForm: FormSchema | null;
  savedForms: FormSchema[];
}

const initialState: FormState = {
  currentForm: { id: '', name: '', createdAt: '', fields: [] },
  savedForms: JSON.parse(localStorage.getItem("forms") || "[]")
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setCurrentForm(state, action: PayloadAction<FormSchema>) {
      state.currentForm = action.payload;
    },
    addField(state, action: PayloadAction<FormField>) {
      state.currentForm?.fields.push(action.payload);
    },
    updateField(state, action: PayloadAction<FormField>) {
      if (!state.currentForm) return;
      const index = state.currentForm.fields.findIndex(f => f.id === action.payload.id);
      if (index !== -1) state.currentForm.fields[index] = action.payload;
    },
    deleteField(state, action: PayloadAction<string>) {
      if (!state.currentForm) return;
      state.currentForm.fields = state.currentForm.fields.filter(f => f.id !== action.payload);
    },
    saveForm(state, action: PayloadAction<string>) {
      if (!state.currentForm) return;
      state.currentForm.id = crypto.randomUUID();
      state.currentForm.name = action.payload;
      state.currentForm.createdAt = new Date().toISOString();
      state.savedForms.push(state.currentForm);

      localStorage.setItem("forms", JSON.stringify(state.savedForms));
    }
  }
});

export const { setCurrentForm, addField, updateField, deleteField, saveForm } = formSlice.actions;
export default formSlice.reducer;
