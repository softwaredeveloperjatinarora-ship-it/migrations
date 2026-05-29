"use client";
import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  useTheme,
} from "@mui/material";
import { Apartment } from "@mui/icons-material";

const BlockManagement = () => {
      const theme = useTheme();
  const blocks = [
    { name: "Block A", rooms: 25, capacity: 750, status: "Active" },
    { name: "Block B", rooms: 20, capacity: 600, status: "Active" },
    { name: "Block C", rooms: 18, capacity: 540, status: "Maintenance" },
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, mt:"5px",borderRadius: 3, mb: 4 }}>
      <Typography variant="body2" sx={{ mb: 2, color: "gray" }}>
        Dashboard / <b>Total Blocks</b>
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          background:theme.palette.primary.main,
          borderRadius: 2,
          p: 2,
          color: "white",
          mb: 2,
        }}
      >
        <Apartment sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight="bold">
          Block Management
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background:theme.palette.primary.main,
              }}
            >
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>BLOCK NAME</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>ROOMS</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>CAPACITY</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blocks.map((b, i) => (
              <TableRow key={i}>
                <TableCell>{b.name}</TableCell>
                <TableCell>{b.rooms}</TableCell>
                <TableCell>{b.capacity}</TableCell>
                <TableCell>
                  <Chip
                    label={b.status}
                    sx={{
                      backgroundColor: b.status === "Active" ? theme.palette.success.main : theme.palette.secondary.main,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Paper>
  );
};

export default BlockManagement;
