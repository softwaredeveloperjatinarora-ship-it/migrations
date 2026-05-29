"use client";
import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
  IconButton,
} from "@mui/material";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar"; // Import Scrollbar
import { IconX } from "@tabler/icons-react";
import ResultTabs from "../../../ExaminationViews/ResultView/ResultTabs";

interface PopupProps {
  open: boolean;
  handleClose: () => void;
  title: string;
}

const CgpaPopup: React.FC<PopupProps> = ({ open, handleClose, title }) => {
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
        <Scrollbar sx={{ height: "540px" }}>
          {" "}

          <ResultTabs bred={false} />
        </Scrollbar>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleClose}>
          Close
        </Button>
        {/* <Button onClick={handleClose}>OK</Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default CgpaPopup;
