import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Redux/Store";
import { addField, updateField, deleteField, saveForm, setCurrentForm } from "../Redux/FormSlice";
import FieldEditor from "../Components/FieldEditor";
import FieldList from "../Components/FieldList";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";
import { FormField } from "../Types/FormTypes";

export default function CreateForm() {
  const dispatch = useDispatch();
  const currentForm = useSelector((s: RootState) => s.form.currentForm);
  const [editField, setEditField] = useState<FormField | undefined>(undefined);
  const [showSave, setShowSave] = useState(false);
  const [formName, setFormName] = useState("");

  const handleMove = (fromIdx: number, toIdx: number) => {
    if (!currentForm) return;
    const fields = [...currentForm.fields];
    const [moved] = fields.splice(fromIdx, 1);
    fields.splice(toIdx, 0, moved);
    dispatch(setCurrentForm({ ...currentForm, fields }));
  };

  const handleFieldSave = (field: FormField) => {
    if (editField) {
      dispatch(updateField(field));
      setEditField(undefined);
    } else {
      dispatch(addField(field));
    }
  };

  const handleDelete = (fieldId: string) => { dispatch(deleteField(fieldId)); };
  const handleEdit = (field: FormField) => setEditField(field);

  const handleFormSave = () => {
    dispatch(saveForm(formName));
    setShowSave(false);
    setFormName("");
  };

  if (!currentForm) return <div>Loading...</div>;

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h5" mb={2}>Create Form</Typography>

      <FieldEditor
        key={editField?.id || "new"}
        field={editField}
        parentFields={currentForm.fields}
        onSave={handleFieldSave}
        onCancel={() => setEditField(undefined)}
      />

      <Typography variant="subtitle1" mt={2}>Form Fields:</Typography>
      <FieldList
        fields={currentForm.fields}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onMoveUp={(i) => i > 0 && handleMove(i, i - 1)}
        onMoveDown={(i) => i < currentForm.fields.length - 1 && handleMove(i, i + 1)}
      />

      <Box my={3}>
        <Button variant="contained" onClick={() => setShowSave(true)} disabled={currentForm.fields.length === 0}>
          Save Form
        </Button>
      </Box>

      <Dialog open={showSave} onClose={() => setShowSave(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <TextField autoFocus label="Form Name" value={formName} onChange={e => setFormName(e.target.value)} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSave(false)}>Cancel</Button>
          <Button onClick={handleFormSave} disabled={!formName}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
