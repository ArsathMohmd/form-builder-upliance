import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Select, MenuItem, Checkbox, FormControlLabel, InputLabel, FormControl, Switch } from "@mui/material";
import { FieldType, FormField } from "../Types/FormTypes";
import { v4 as uuidv4 } from "uuid";

interface Props {
  field?: FormField;
  parentFields: FormField[];
  onSave: (field: FormField) => void;
  onCancel?: () => void;
}

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "textarea", label: "Textarea" },
  { value: "select", label: "Select" },
  { value: "radio", label: "Radio" },
  { value: "checkbox", label: "Checkbox" },
  { value: "date", label: "Date" },
];

const needsOptions = (type: FieldType) =>
  type === "select" || type === "radio" || type === "checkbox";

export default function FieldEditor({ field, parentFields, onSave, onCancel }: Props) {
  const [type, setType] = useState<FieldType>(field?.type || "text");
  const [label, setLabel] = useState<string>(field?.label || "");
  const [required, setRequired] = useState<boolean>(!!field?.validations?.required);
  const [defaultValue, setDefaultValue] = useState<string | number | boolean | undefined>(field?.defaultValue);
  const [minLength, setMinLength] = useState<number | undefined>(field?.validations?.minLength);
  const [maxLength, setMaxLength] = useState<number | undefined>(field?.validations?.maxLength);
  const [email, setEmail] = useState<boolean>(!!field?.validations?.email);
  const [passwordRule, setPasswordRule] = useState<boolean>(!!field?.validations?.passwordRule);
  const [options, setOptions] = useState<string>(field?.options?.join("\n") || "");

  // Derived field
  const [isDerived, setIsDerived] = useState<boolean>(!!field?.derived);
  const [parentFieldIDs, setParentFieldIDs] = useState<string[]>(field?.derived?.parentFields || []);
  const [formula, setFormula] = useState<string>(field?.derived?.formula || "");

  // For updating parent fields when adding new derived fields
  useEffect(() => {
    if (!isDerived) {
      setParentFieldIDs([]);
      setFormula("");
    }
  }, [isDerived]);

  const handleSave = () => {
    const newField: FormField = {
      id: field?.id || uuidv4(),
      type,
      label,
      defaultValue,
    };

    // Only add validations if they exist
    const validations: any = {};
    if (required) validations.required = true;
    if (minLength) validations.minLength = minLength;
    if (maxLength) validations.maxLength = maxLength;
    if (email) validations.email = true;
    if (passwordRule) validations.passwordRule = true;

    if (Object.keys(validations).length > 0) {
      newField.validations = validations;
    }

    if (needsOptions(type)) {
      newField.options = options.split("\n").map((o) => o.trim()).filter(Boolean);
    }

    if (isDerived) {
      newField.derived = {
        parentFields: parentFieldIDs,
        formula,
      };
    }

    onSave(newField);
  };


  return (
    <Box sx={{ border: "1px solid #eee", p: 2, mb: 2, borderRadius: 2, background: "#fcfcfc" }}>
      <FormControl fullWidth sx={{ mb: 1 }}>
        <InputLabel>Field Type</InputLabel>
        <Select value={type} onChange={(e) => setType(e.target.value as FieldType)} label="Field Type">
          {FIELD_TYPES.map((ft) => (
            <MenuItem key={ft.value} value={ft.value}>{ft.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField fullWidth sx={{ mb: 1 }} label="Field Label" value={label} onChange={(e) => setLabel(e.target.value)} />
      <FormControlLabel control={<Switch checked={required} onChange={(_, v) => setRequired(v)} />} label="Required" />

      {/* Default Value */}
      <TextField
        fullWidth sx={{ mb: 1 }}
        label="Default Value"
        value={defaultValue ?? ""}
        onChange={(e) => setDefaultValue(e.target.value)}
        type={type === "number" ? "number" : "text"}
      />

      {/* Validation Rules */}
      {type === "text" || type === "textarea" ? (
        <Box>
          <TextField
            sx={{ mr: 1, width: "30%" }}
            label="Min Length"
            type="number"
            value={minLength || ""}
            onChange={(e) => setMinLength(+e.target.value)}
          />
          <TextField
            sx={{ width: "30%" }}
            label="Max Length"
            type="number"
            value={maxLength || ""}
            onChange={(e) => setMaxLength(+e.target.value)}
          />
        </Box>
      ) : null}
      {type === "text" ?

        <Box>
          <FormControlLabel control={<Checkbox checked={email} onChange={(_, v) => setEmail(v)} />} label="Email" />
          <FormControlLabel control={<Checkbox checked={passwordRule} onChange={(_, v) => setPasswordRule(v)} />} label="Password Rule" />
        </Box>
        : null}

      {/* Options */}
      {needsOptions(type) && (
        <TextField
          fullWidth multiline minRows={2}
          label="Options (one per line)"
          value={options}
          onChange={(e) => setOptions(e.target.value)}
          sx={{ mb: 1 }}
        />
      )}

      {/* Derived Field Config */}
      <FormControlLabel control={<Checkbox checked={isDerived} onChange={(_, v) => setIsDerived(v)} />} label="Derived Field?" />
      {isDerived && (
        <Box sx={{ border: "1px dashed #bbb", p: 1, my: 1, borderRadius: 1 }}>
          <FormControl fullWidth sx={{ mb: 1 }}>
            <InputLabel>Parent Fields</InputLabel>
            <Select
              label="Parent Fields"
              multiple
              value={parentFieldIDs}
              onChange={(e) => setParentFieldIDs(e.target.value as string[])}
            >
              {parentFields.filter(f => !f.derived).map((parent) =>
                <MenuItem key={parent.id} value={parent.id}>{parent.label}</MenuItem>
              )}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Formula (e.g. 2025 - new Date(parentField1).getFullYear())"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
          />
        </Box>
      )}

      <Box mt={2} display="flex" gap={2}>
        <Button variant="contained" onClick={handleSave}>Save Field</Button>
        {onCancel && <Button variant="text" onClick={onCancel}>Cancel</Button>}
      </Box>
    </Box>
  );
}
