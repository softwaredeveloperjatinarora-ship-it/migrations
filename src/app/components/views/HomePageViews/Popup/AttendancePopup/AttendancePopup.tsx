"use client";
import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import { IconX } from "@tabler/icons-react";
import Attendance from "./attendance/attendencemain";


interface PopupProps {
  open: boolean;
  handleClose: () => void;
  title: string;
}

const AttendancePopup: React.FC<PopupProps> = ({
  open,
  handleClose,
  title,
}) => {
  const descriptionElementRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      PaperProps={{ sx: { width: "100%", height: "90%" } }}
      maxWidth="lg"
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {title}
        <IconButton onClick={handleClose} size="small" sx={{ ml: 2 }}>
          <IconX color="#FF8488" size={24} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Scrollbar sx={{ height: "100%" }}>
          {" "}
          <Attendance />
        </Scrollbar>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AttendancePopup;
