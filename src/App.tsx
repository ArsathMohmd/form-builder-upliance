import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Box, Button, AppBar, Toolbar, Typography, Stack } from "@mui/material";
import CreateForm from "./Pages/CreateForm";
import PreviewForm from "./Pages/PreviewForm";
import MyForms from "./Pages/MyForms";
function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Upliance.ai Form Builder</Typography>
          <Stack direction="row" gap={2}>
            <Button color="inherit" component={Link} to="/create">Create</Button>
            <Button color="inherit" component={Link} to="/preview">Preview</Button>
            <Button color="inherit" component={Link} to="/myforms">My Forms</Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box>
        <Routes>
          <Route path="/create" element={<CreateForm />} />
          <Route path="/preview" element={<PreviewForm />} />
          <Route path="/myforms" element={<MyForms />} />
          <Route path="*" element={<CreateForm />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
