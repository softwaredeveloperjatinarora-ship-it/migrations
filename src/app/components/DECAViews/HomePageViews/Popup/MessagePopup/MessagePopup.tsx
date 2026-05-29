
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { IconX } from "@tabler/icons-react";
import MyMessages from "./MyMessages";
import AllMessageClient from "./AllMessage";

interface PopupProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  count: any; 
}

const MessagePopup: React.FC<PopupProps> = ({ open, handleClose, title, count }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [childValue, setChildValue] = useState<any>(null);

  const dynamicTitle = tabIndex === 0 ? "My Messages" : "All Messages";

  const handleChildValue = (value: any) => {
    setChildValue(value);
  };

  const displayCount = tabIndex === 0 ? count : childValue ?? "Loading...";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { width: "100%", height: "90%" } }}
      maxWidth="lg"
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {dynamicTitle}
        <IconButton onClick={handleClose} size="small">
          <IconX size={24} />
        </IconButton>
      </DialogTitle>

      <Divider />

      <Box
        sx={{
          display: { lg: "flex" },
          justifyContent: { lg: "space-between" },
          alignItems: "center",
          px: 2,
          pt: 2,
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={(_, newIndex) => setTabIndex(newIndex)}
          TabIndicatorProps={{ sx: { height: 3 } }}
          sx={{ "& .MuiTab-root": { fontWeight: "bold", ml: 1 } }}
        >
          <Tab label="My Messages" />
          <Tab label="All Messages" />
        </Tabs>

        <Box
          sx={{
            display: "flex",
            justifyContent: { lg: "left", xs: "center" },
            mr: { lg: 2 },
            mt: { xs: 2 },
            mb: { xs: 1, lg: 0 },
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: "15px", ml: { lg: 3 }, display: "flex" }}
          >
            Total Messages:
            <Typography
              variant="body1"
              sx={{ ml: 1, color: "secondary.main" }}
            >
              {displayCount}
            </Typography>
          </Typography>
        </Box>
      </Box>

      <DialogContent sx={{ padding: 2 }}>
        {tabIndex === 0 ? (
          <MyMessages />
        ) : (
          <AllMessageClient onData={handleChildValue} />
        )}
      </DialogContent>

      <Divider />

      <DialogActions>
        <Button color="primary" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessagePopup;
