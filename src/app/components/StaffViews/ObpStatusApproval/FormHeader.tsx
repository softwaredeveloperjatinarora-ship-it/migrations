"use client";

import React from "react";
import { Box, Typography, Paper, useTheme } from "@mui/material";

interface FormHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function FormHeader({
  title = "Project Details",
  subtitle = "Project Information Management Interface",
}: FormHeaderProps) {
  const theme = useTheme();

  return (
    <Paper
      elevation={6}
      sx={{
        borderRadius: 2,
        backgroundColor: "rgba(255, 255, 255, 0.98)",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          background: theme.palette.primary.main,
          borderRadius: 2,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          py: 3,
          mb: 4,
          color: "white",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="subtitle1">{subtitle}</Typography>
      </Box>
    </Paper>
  );
}
