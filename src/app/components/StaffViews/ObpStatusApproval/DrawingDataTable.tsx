"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Button,
  Paper,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Replay as ReplayIcon,
  Schedule as ScheduleIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Inventory2 as Inventory2Icon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export interface DrawingTableRow {
  id: number;
  projectId: string;
  fileName: string;
  uploadDate: string;
  remarks: string;
  status: "Approved" | "Revision" | "New" | "Awaited";
  employeeName?: string;
  folderName?: string;
}

interface DrawingDataTableProps {
  title: string;
  data: DrawingTableRow[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  sortValue: string;
  onSortChange: (value: string) => void;
  page: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  totalEntries: number;
  pageSize?: number;
  onViewFile?: (fileName: string, folderName?: string) => void;
  onDownloadFile?: (fileName: string, folderName?: string) => void;
  onUploadNew?: (projectId?: string) => void;
  showUploadButton?: boolean;
  icon?: React.ReactNode;
  searchPlaceholder?: string;
}

export default function DrawingDataTable({
  title,
  data,
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
  page,
  onPageChange,
  totalPages,
  totalEntries,
  pageSize = 20,
  onViewFile,
  onDownloadFile,
  onUploadNew,
  showUploadButton = false,
  icon,
  searchPlaceholder = "Search...",
}: DrawingDataTableProps) {
  const theme = useTheme();

  // Filter and search data
  const filteredData = useMemo(() => {
    // Safety check: ensure data is an array
    if (!Array.isArray(data)) {
      return [];
    }

    // First, deduplicate by id and projectId - keep only the latest entry for each project
    const seen = new Map();
    const deduplicated = data.filter((item) => {
      const key = `${item.id}-${item.projectId}`;
      if (seen.has(key)) {
        return false;
      }
      seen.set(key, true);
      return true;
    });

    let result = [...deduplicated];

    // Apply status filter - case-insensitive comparison
    if (sortValue && sortValue.trim() !== "") {
      const filterValue = sortValue.toLowerCase().trim();
      result = result.filter((item) => {
        const itemStatus = String(item.status || "").toLowerCase();
        return itemStatus === filterValue;
      });
    }

    // Apply search filter
    if (searchValue && searchValue.trim() !== "") {
      const search = searchValue.toLowerCase().trim();
      result = result.filter(
        (item) =>
          String(item.projectId || "").toLowerCase().includes(search) ||
          String(item.fileName || "").toLowerCase().includes(search) ||
          String(item.status || "").toLowerCase().includes(search) ||
          String(item.employeeName || "").toLowerCase().includes(search) ||
          String(item.remarks || "").toLowerCase().includes(search)
      );
    }

    // Sort by uploadDate (newest first)
    return result.sort((a, b) => {
      const dateA = a.uploadDate ? new Date(a.uploadDate).getTime() : 0;
      const dateB = b.uploadDate ? new Date(b.uploadDate).getTime() : 0;
      return dateB - dateA;
    });
  }, [data, searchValue, sortValue]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const start = page * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // Calculate pagination values based on FILTERED data, not original props
  const actualTotalEntries = filteredData.length;
  const actualTotalPages = Math.ceil(actualTotalEntries / pageSize);
  const visibleEntryCount = (page + 1) * pageSize;
  const hasMoreEntries = page < actualTotalPages - 1;
  const currentPage = page + 1;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Revision":
        return theme.palette.error.main;
      case "Awaited":
        return theme.palette.warning.main;
      case "Approved":
        return theme.palette.success.main;
      default:
        return theme.palette.warning.main;
    }
  };

  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case "Revision":
        return "rgba(244, 67, 54, 0.08)";
      case "Awaited":
        return "rgba(255, 152, 0, 0.08)";
      case "Approved":
        return "rgba(76, 175, 80, 0.08)";
      default:
        return "rgba(255, 152, 0, 0.08)";
    }
  };

  return (
    <Card
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          {icon}
          <Typography variant="subtitle1" fontWeight="bold" color="white">
            {title}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Search Input */}
          <TextField
            size="small"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{
              width: 200,
              "& .MuiOutlinedInput-root": {
                color: "white",
                backgroundColor: "rgba(255,255,255,0.1)",
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
              "& .MuiInputBase-input::placeholder": {
                color: "rgba(255,255,255,0.7)",
                opacity: 1,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "white", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Sort Dropdown */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={sortValue}
              onChange={(e) => onSortChange(e.target.value as string)}
              displayEmpty
              renderValue={(value) => {
                if (value === "" || value === undefined) {
                  return <span style={{ color: "rgba(255,255,255,0.7)" }}>All</span>;
                }
                const selectedItem = ["", "revision", "approved", "new"].find(
                  (item) => item === value
                );
                if (!selectedItem || selectedItem === "") {
                  return "All";
                }
                return selectedItem.charAt(0).toUpperCase() + selectedItem.slice(1);
              }}
              sx={{
                color: "white",
                backgroundColor: "rgba(255,255,255,0.1)",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.3)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
                ".MuiSelect-icon": {
                  color: "white",
                },
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="revision">Revision</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="new">New</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#f8f9fa",
                "& th": {
                  fontWeight: 700,
                  color: "#495057",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: "0.5px",
                  borderBottom: "2px solid #e9ecef",
                },
              }}
            >
              <TableCell sx={{ py: 1.5 }}>#</TableCell>
              <TableCell sx={{ py: 1.5 }}>Project</TableCell>
              <TableCell sx={{ py: 1.5 }}>File Name</TableCell>
              <TableCell sx={{ py: 1.5 }}>Upload Date</TableCell>
              <TableCell sx={{ py: 1.5 }}>Remarks</TableCell>
              <TableCell sx={{ py: 1.5 }}>Status</TableCell>
              <TableCell sx={{ py: 1.5 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow
                  key={row.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8f9fa",
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                      backgroundColor: getStatusBackgroundColor(row.status),
                    },
                    "& td": {
                      borderBottom: "1px solid #e9ecef",
                      py: 1.5,
                    },
                  }}
                >
                  <TableCell>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        backgroundColor: getStatusColor(row.status),
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {index + 1}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} color="primary.main">
                      {row.projectId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      {/* Show file icon only if there's an actual file */}
                      {row.fileName && row.fileName !== "N/A" ? (
                        <>
                          <PictureAsPdfIcon sx={{ fontSize: 18, color: "#dc3545" }} />
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 150,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {row.fileName}
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                          No file
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {row.uploadDate}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={row.remarks || "No remarks"} arrow>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 180,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                        }}
                      >
                        {row.remarks || "N/A"}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={
                        row.status === "Approved" ? (
                          <CheckCircleIcon sx={{ fontSize: 16 }} />
                        ) : row.status === "Revision" ? (
                          <ReplayIcon sx={{ fontSize: 16 }} />
                        ) : (
                          <ScheduleIcon sx={{ fontSize: 16 }} />
                        )
                      }
                      label={row.status}
                      color={
                        row.status === "Revision"
                          ? "error"
                          : row.status === "Approved"
                          ? "success"
                          : "warning"
                      }
                      size="small"
                      sx={{
                        color: "white",
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        "& .MuiChip-icon": {
                          color: "white",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      {/* Show View button only if there's an actual file */}
                      {onViewFile && row.fileName && row.fileName !== "N/A" && (
                        <Tooltip title="View File" arrow>
                          <IconButton
                            size="small"
                            onClick={() => onViewFile(row.fileName, row.folderName)}
                            sx={{
                              color: getStatusColor(row.status),
                              backgroundColor: getStatusBackgroundColor(row.status),
                              "&:hover": {
                                backgroundColor:
                                  row.status === "Revision"
                                    ? "rgba(244, 67, 54, 0.15)"
                                    : row.status === "Awaited"
                                    ? "rgba(255, 152, 0, 0.15)"
                                    : "rgba(76, 175, 80, 0.15)",
                              },
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {/* Show Download button only if there's an actual file */}
                      {onDownloadFile && row.fileName && row.fileName !== "N/A" && (
                        <Tooltip title="Download File" arrow>
                          <IconButton
                            size="small"
                            onClick={() => onDownloadFile(row.fileName, row.folderName)}
                            sx={{
                              color: getStatusColor(row.status),
                              backgroundColor: getStatusBackgroundColor(row.status),
                              "&:hover": {
                                backgroundColor:
                                  row.status === "Revision"
                                    ? "rgba(244, 67, 54, 0.15)"
                                    : row.status === "Awaited"
                                    ? "rgba(255, 152, 0, 0.15)"
                                    : "rgba(76, 175, 80, 0.15)",
                              },
                            }}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {/* Show Upload button only if there's an existing file to replace */}
                      {showUploadButton && onUploadNew && row.fileName && row.fileName !== "N/A" && (
                        <Tooltip title="Upload New Version" arrow>
                          <IconButton
                            size="small"
                            onClick={() => onUploadNew(row.projectId)}
                            sx={{
                              color: theme.palette.success.main,
                              "&:hover": {
                                backgroundColor: "rgba(76, 175, 80, 0.08)",
                              },
                            }}
                          >
                            <CloudUploadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Inventory2Icon
                      sx={{
                        fontSize: 48,
                        color: "#adb5bd",
                      }}
                    />
                    <Typography variant="body1" color="text.secondary">
                      No records found
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing {Math.max(1, visibleEntryCount - pageSize + 1)} -{" "}
          {Math.min(visibleEntryCount, actualTotalEntries)} of {actualTotalEntries} records
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            disabled={page === 0}
            onClick={() => onPageChange(0)}
          >
            First
          </Button>
          <Button
            size="small"
            variant="outlined"
            disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <Typography sx={{ display: "flex", alignItems: "center", px: 2 }}>
            Page {currentPage} of {actualTotalPages || 1}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            disabled={!hasMoreEntries}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
          <Button
            size="small"
            variant="outlined"
            disabled={!hasMoreEntries}
            onClick={() => onPageChange(actualTotalPages - 1)}
          >
            Last
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
