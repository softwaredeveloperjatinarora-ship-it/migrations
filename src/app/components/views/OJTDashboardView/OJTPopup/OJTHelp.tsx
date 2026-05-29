"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import { Icon } from "@iconify/react";

import Image from "next/image";
interface OJTAttendanceProps {
  isOpen: boolean;
  closeModal: (data?: boolean) => void;
}

const OJTHelp: React.FC<OJTAttendanceProps> = ({ isOpen, closeModal }) => {
  const handleClose = () => {
    closeModal(false);
  };

  return (
   <Dialog
  open={isOpen}
  onClose={handleClose}
  fullWidth
  maxWidth="sm"
  PaperProps={{
    sx: {
      width: { xs: "90%", md: "70%" },
      height: { md: "85%", xs: "80%" },
    },
  }}
>
 
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      px: 3,
      py: 2,
     
    }}
  >
    <Typography id="ojt-help-title" variant="h6">
      Help / Instructions
    </Typography>
    
<Icon icon="carbon:close-filled"  onClick={handleClose} height={20} />
   
  </Box>

  {/* Scrollable Content */}
  <Scrollbar
    sx={{ height: { xs: "300px", md: "550px" }, overflowX: "hidden" }}
  >
    <DialogContent dividers sx={{ overflow: "hidden" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Icon icon="uil:setting" height={25} />
        <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>
          Steps to Turn On Location in Windows:
        </Typography>
      </Box>

      <List>
        <ListItem>
          <ListItemText
            primary="1. Open Settings"
            secondary="Press Windows + I or click on Start and choose Settings (⚙️ icon)."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="2. Go to Privacy & Security"
            secondary="In the left sidebar, select 'Privacy & security'."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="3. Select Location"
            secondary="Scroll down and click on 'Location' under App permissions."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="4. Turn on Location Services"
            secondary="Toggle the switch ON under 'Location services'."
          />
        </ListItem>
        <Box display="flex" mt={2} mr={-1} justifyContent="center">
          <Image
            src="/images/ojtdashboard/help.jpg"
            width={800}
            height={200}
            alt="Location Help"
          />
        </Box>
        <ListItem>
          <ListItemText
            primary="5. Allow Apps to Access Location (Optional)"
            secondary="Scroll down and enable location access for specific apps like Maps or Weather."
          />
        </ListItem>

        <Typography
          sx={{ color: "#FF4D4D", fontSize: "15px", fontWeight: 600 }}
        >
          Note: These steps apply to Windows 10 and may differ in newer Windows
          versions.
        </Typography>
      </List>
    </DialogContent>
  </Scrollbar>

  <DialogActions>{/* optional footer */}</DialogActions>
</Dialog>

  );
};

export default OJTHelp;
