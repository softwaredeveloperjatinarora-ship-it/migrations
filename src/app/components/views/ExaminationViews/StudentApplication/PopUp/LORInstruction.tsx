import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
  Paper,
  Stack,
} from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import { InstructionCard } from "../../AccCell/popup/RefundInstruction";

interface PopupProps {
  open: boolean;
  handleClose: () => void;
}



const LORInstruction: React.FC<PopupProps> = ({ open, handleClose }) => {
  const [isChecked, setIsChecked] = useState(false);
  const descriptionElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && descriptionElementRef.current) {
      descriptionElementRef.current.focus();
    }
  }, [open]);

  const handleConfirm = () => {
    if (isChecked) {
      handleClose();
    } else {
      alert("Please confirm you have read the information.");
    }
  };

  return (
    <Dialog open={open} onClose={(event, reason) => {
      if (reason === "backdropClick") {
        return; 
      }
      handleClose(); 
    }} maxWidth="lg" scroll="paper">
      <DialogTitle>Instructions for Application</DialogTitle>
      <DialogContent dividers ref={descriptionElementRef}>
      <InstructionCard
  icon={<SchoolIcon color="primary" />}
  title="1. Faculty Details"
  content="To apply for an LOR, students must select the faculty members from whom they wish to request the letter (minimum 1 and maximum 5)."
/>

<InstructionCard
  icon={<LocalShippingIcon color="secondary" />}
  title="2. Mode of Collection"
  content="Once the LOR is prepared, it can be collected as per your chosen mode. Choose the mode of collection as offline or online within this interface while applying for LOR. For offline collection, visit Block 32, Room No. 101, and Window No. 2. For online collection, download it from the link under the Application Status Tab."
/>

<InstructionCard
  icon={<NotificationsActiveIcon color="success" />}
  title="3. Updates"
  content="After submitting the LOR request, you will receive status updates via 'My Messages' on UMS."
/>

<InstructionCard
  icon={<HelpCenterIcon color="info" />}
  title="4. Queries"
  content="For any queries or issues related to the LOR, log a request on RMS using the following path:
         UMS Navigation --> Relationship Management System --> Log Request -->
         Master Category-----Records and Certificates
         Sub Category-------- Letter of Recommendation (LOR)"
/>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          mt={4}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                name="confirmRead"
              />
            }
            label="I have read this information"
          />
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={!isChecked}
          >
            Confirm
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LORInstruction;