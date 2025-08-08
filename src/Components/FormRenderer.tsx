import React, { useState, useEffect, useCallback } from "react";
import {
  Box, TextField, Checkbox, FormControlLabel, RadioGroup, Radio, MenuItem, Select, Button, Typography
} from "@mui/material";
import { FormSchema, FormField } from "../Types/FormTypes";

// Utility: "safe eval" for derived formula
function safeEval(formula: string, values: Record<string, any>) {
  try {
    //eslint-disable-next-line
    return new Function(...Object.keys(values), `return ${formula}`)(...Object.values(values));
  } catch {
    return "";
  }
}

function validateValue(val: any, field: FormField) {
  const rules = field.validations;
  if (!rules) return "";

  // Check required
  if (rules.required && (!val || val.toString().trim() === "")) return "Field is required";

  if (typeof val === "string") {
    if (rules.minLength && val.length < rules.minLength) return `Min ${rules.minLength} characters`;
    if (rules.maxLength && val.length > rules.maxLength) return `Max ${rules.maxLength} characters`;
    if (rules.email && !val.match(/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i)) return "Invalid email";
    if (rules.passwordRule && !val.match(/^(?=.*\d).{8,}$/))
      return "Password must be ≥8 chars, contain a number";
  }
  return "";
}

interface Props {
  form: FormSchema;
}

export default function FormRenderer({ form }: Props) {
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate derived fields function
  const calculateDerivedFields = useCallback((currentValues: Record<string, any>) => {
    const newValues = { ...currentValues };
    form.fields.forEach((f) => {
      if (f.derived && f.derived.parentFields.length) {
        const inputMap: Record<string, any> = {};
        f.derived.parentFields.forEach(pid => {
          inputMap[pid] = newValues[pid];
        });
        newValues[f.id] = safeEval(f.derived.formula, inputMap);
      }
    });
    return newValues;
  }, [form.fields]);

  useEffect(() => {
    setValues(prevValues => {
      const newValues = { ...prevValues };
      form.fields.forEach((f) => {
        if (f.derived && f.derived.parentFields.length) {
          const inputMap: Record<string, any> = {};
          f.derived.parentFields.forEach(pid => {
            inputMap[pid] = newValues[pid]; // use current values
          });
          newValues[f.id] = safeEval(f.derived.formula, inputMap);
        }
      });
      return newValues;
    });
  }, [form]);


  const handleChange = (field: FormField, value: any) => {
    const updated = { ...values, [field.id]: value };
    const updatedWithDerived = calculateDerivedFields(updated);
    setValues(updatedWithDerived);

    // Validate the changed field
    const err = validateValue(value, field);
    setErrors((errs) => ({ ...errs, [field.id]: err }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    const allErrors: Record<string, string> = {};

    form.fields.forEach(f => {
      if (!f.derived) {
        console.log(`Field "${f.label}":`, {
          value: values[f.id],
          validations: f.validations,
          hasValidations: !!f.validations
        });

        const err = validateValue(values[f.id], f);
        console.log(`Validation result for "${f.label}": "${err}"`);
        console.log(`Error is truthy: ${!!err}`);

        if (err) {
          hasError = true;
          console.log(` Error found for field "${f.label}": "${err}"`);
        } else {
          console.log(` No error for field "${f.label}"`);
        }
        allErrors[f.id] = err;
      }
    });

    console.log("hasError before final check:", hasError);
    console.log("allErrors:", allErrors);

    setErrors(allErrors);

    console.log("Final validation state:", { hasError, allErrors });

    if (!hasError) {
      console.log("SUCCESS: No errors found, showing success alert");
      alert("Form data is valid!");
    } else {
      console.log("ERRORS FOUND: Not showing success alert");
      console.log("Validation errors:", allErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2}>
        {form.fields.map(field => {
          // If derived, disable
          if (field.derived) {
            return (
              <TextField
                key={field.id}
                label={field.label}
                value={values[field.id] !== undefined ? values[field.id] : ""}
                InputProps={{ readOnly: true }}
                helperText="Derived field"
              />
            );
          }

          switch (field.type) {
            case "text":
            case "number":
            case "date":
              return (
                <TextField
                  key={field.id}
                  type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                  label={field.label}
                  value={values[field.id] ?? ""}
                  required={!!field.validations?.required}
                  error={!!errors[field.id]}
                  helperText={errors[field.id]}
                  onChange={e => handleChange(field, e.target.value)}
                  InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
                />
              );
            case "textarea":
              return (
                <TextField
                  key={field.id}
                  label={field.label}
                  multiline
                  minRows={3}
                  value={values[field.id] ?? ""}
                  error={!!errors[field.id]}
                  helperText={errors[field.id]}
                  onChange={e => handleChange(field, e.target.value)}
                />
              );
            case "select":
              return (
                <Select
                  fullWidth
                  key={field.id}
                  value={values[field.id] ?? ""}
                  displayEmpty
                  onChange={e => handleChange(field, e.target.value)}
                >
                  <MenuItem value="">Select...</MenuItem>
                  {field.options?.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                </Select>
              );
            case "radio":
              return (
                <RadioGroup
                  key={field.id}
                  value={values[field.id] ?? ""}
                  onChange={e => handleChange(field, e.target.value)}
                >
                  <Typography>{field.label}</Typography>
                  {field.options?.map(opt => (
                    <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
                  ))}
                </RadioGroup>
              );
            case "checkbox":
              return (
                <FormControlLabel
                  key={field.id}
                  control={
                    <Checkbox
                      checked={!!values[field.id]}
                      onChange={(_, checked) => handleChange(field, checked)}
                    />
                  }
                  label={field.label}
                />
              );
            default:
              return null;
          }
        })}

        <Button type="submit" variant="contained">Submit</Button>
      </Box>
    </form>
  );
}