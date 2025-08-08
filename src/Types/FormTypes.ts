export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  passwordRule?: boolean;
}

export interface DerivedFieldConfig {
  parentFields: string[];
  formula: string; 
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  defaultValue?: string | number | boolean;
  validations?: ValidationRules;
  options?: string[];
  derived?: DerivedFieldConfig;
}

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string;
  fields: FormField[];
}
