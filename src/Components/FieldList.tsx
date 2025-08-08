import React from "react";
import { List, ListItem, ListItemText, IconButton, Box, Chip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { FormField } from "../Types/FormTypes";

interface Props {
  fields: FormField[];
  onEdit: (field: FormField) => void;
  onDelete: (fieldId: string) => void;
  onMoveUp: (i: number) => void;
  onMoveDown: (i: number) => void;
}

export default function FieldList({ fields, onEdit, onDelete, onMoveUp, onMoveDown }: Props) {
  return (
    <List dense>
      {fields.map((field, idx) => (
        <ListItem
          key={field.id}
          secondaryAction={
            <Box>
              <IconButton onClick={() => onMoveUp(idx)} disabled={idx === 0}><ArrowUpwardIcon /></IconButton>
              <IconButton onClick={() => onMoveDown(idx)} disabled={idx === fields.length - 1}><ArrowDownwardIcon /></IconButton>
              <IconButton onClick={() => onEdit(field)}><EditIcon /></IconButton>
              <IconButton onClick={() => onDelete(field.id)}><DeleteIcon /></IconButton>
            </Box>
          }
        >
          <ListItemText
            primary={
              <span>
                {field.label}
                {field.derived && <Chip sx={{ ml: 1 }} size="small" label="derived" color="warning" />}
              </span>
            }
            secondary={field.type.charAt(0).toUpperCase() + field.type.slice(1)}
          />
        </ListItem>
      ))}
    </List>
  );
}
