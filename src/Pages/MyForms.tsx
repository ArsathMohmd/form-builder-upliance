import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
import { setCurrentForm } from "../Redux/FormSlice";
import { useNavigate } from "react-router-dom";
import { Box, Typography, List, ListItem, ListItemButton, ListItemText } from "@mui/material";

export default function MyForms() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const forms = useSelector((s: RootState) => s.form.savedForms);

  const openForm = (formId: string) => {
    const form = forms.find(f => f.id === formId);
    if (form) {
      dispatch(setCurrentForm(form));
      navigate("/preview");
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h5" mb={2}>My Saved Forms</Typography>
      {forms.length === 0 && <Typography>No forms saved yet.</Typography>}
      <List>
        {forms.map(f => (
          <ListItem key={f.id} disablePadding>
            <ListItemButton onClick={() => openForm(f.id)}>
              <ListItemText primary={f.name} secondary={new Date(f.createdAt).toLocaleString()} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
