"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import {
  Edit as EditIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

interface RemarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  value: string;
  onChange: (value: string) => void;
}

export default function RemarksModal({
  isOpen,
  onClose,
  title,
  value,
  onChange,
}: RemarksModalProps) {
  const theme = useTheme();
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSave = () => {
    onChange(localValue);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <EditIcon />
        {title}
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <TextField
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder="Enter your remarks here..."
          multiline
          rows={4}
          fullWidth
          variant="outlined"
        />
      </DialogContent>
      <DialogActions
        sx={{
          borderTop: "1px solid #e5e7eb",
          backgroundColor: "#f9fafb",
          p: 2,
        }}
      >
        <Button onClick={onClose} startIcon={<CancelIcon />}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
