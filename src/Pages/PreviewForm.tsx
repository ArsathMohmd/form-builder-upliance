import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
import { Typography, Box } from "@mui/material";
import FormRenderer from "../Components/FormRenderer";

export default function PreviewForm() {
  const currentForm = useSelector((s: RootState) => s.form.currentForm);

  if (!currentForm || !currentForm.fields.length) {
    return <Typography variant="body1" color="textSecondary">No form selected.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h5" mb={2}>Preview: {currentForm.name || "(Unsaved Form)"}</Typography>
      <FormRenderer form={currentForm} />
    </Box>
  );
}
