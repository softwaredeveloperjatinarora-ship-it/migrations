"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { ErrorOutline as ErrorIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export default function ErrorModal({
  isOpen,
  onClose,
  message,
}: ErrorModalProps) {
  const theme = useTheme();

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.error.main,
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <ErrorIcon />
        Error
      </DialogTitle>
      <DialogContent sx={{ mt: 2, textAlign: "center" }}>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ color: "error.main", fontWeight: "bold" }}
          >
            ❌ {message}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          borderTop: "1px solid #e5e7eb",
          backgroundColor: "#f9fafb",
          p: 2,
          justifyContent: "center",
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          color="error"
          startIcon={<ErrorIcon />}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
