"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Dialog,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Icon } from "@iconify/react";
import HappeningPopup from "./Popup/HappeningPopup/HappeningPopup";
interface happen {
  counterData: any[];
}

const Happening = ({ counterData }: happen) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // console.log("happening",counterData[0]?.CountHappen)

  return (
    <Card
      sx={{
        p: 0,
        height: "150px",
        // borderRadius: 4,
        boxShadow: theme.shadows[5],
        // background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        background: (theme) => theme.palette.primary.main,
        color: "white",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: theme.shadows[10],
        },
      }}
    >
      {/* Floating Glow Effect */}
      <Box
        sx={{
          position: "absolute",
          top: -40,
          left: -40,
          width: 120,
          height: 120,
          background: "rgba(255,255,255,0.15)",
          borderRadius: "50%",
          filter: "blur(40px)",
        }}
      />

      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
        }}
        onClick={handleOpen}
      >
        <Box
          sx={{
            transition: "color 0.3s ease",
            "&:hover": {
              color: "error.main",
            },
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Icon icon="tabler:news" style={{ fontSize: "25px" }} />
            Happening
          </Typography>

          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            ({counterData[0]?.CountHappen})
          </Typography>
        </Box>
      </CardContent>

      {/* Popup Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <HappeningPopup
          open={open}
          handleClose={handleClose}
          title="Happening"
        />
      </Dialog>
    </Card>
  );
};

export default Happening;
