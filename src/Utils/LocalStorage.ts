import { FormSchema } from "../Types/FormTypes";

export const loadForms = (): FormSchema[] => {
  const data = localStorage.getItem("forms");
  return data ? JSON.parse(data) : [];
};

export const saveForms = (forms: FormSchema[]) => {
  localStorage.setItem("forms", JSON.stringify(forms));
};