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
import {
  Save as SaveIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  message,
}: SuccessModalProps) {
  const theme = useTheme();

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.success.main,
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <SaveIcon />
        Success
      </DialogTitle>
      <DialogContent sx={{ mt: 2, textAlign: "center" }}>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ color: "success.main", fontWeight: "bold" }}
          >
            ✅ {message}
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
          color="success"
          startIcon={<SaveIcon />}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
