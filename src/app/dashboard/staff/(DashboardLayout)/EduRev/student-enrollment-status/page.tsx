"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import {
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
} from "@mui/icons-material";

// Mock data based on user's table
const enrollmentData = [
  {
    sno: 1,
    school: "E: School of Electronics and Electrical Engineering",
    regNo: "12524335",
    studentName: "Rhitwik Ghosh",
    program: "P135:B.Tech. (Electronics and Communication Engineering)",
    batchYear: "2025",
    term: "",
    course: "ECE213:DIGITAL ELECTRONICS",
    category: "NPTEL/MOOCs/Certifications",
    description: "",
    statusSchool: "",
    statusCommittee: "",
  },
  {
    sno: 2,
    school: "E: School of Electronics and Electrical Engineering",
    regNo: "12524335",
    studentName: "Rhitwik Ghosh",
    program: "P135:B.Tech. (Electronics and Communication Engineering)",
    batchYear: "2025",
    term: "4",
    course: "PEL125:UPPER INTERMEDIATE COMMUNICATION SKILLS-I",
    category: "EDU- REV Number of Unique Students applied for RPL (Recognition of Prior Learning)",
    description: "I have studied English(communication skills) as first language in my 12 th class with NCERT book as a reference textbook and have received above 90% in my final exam.",
    statusSchool: "Approved",
    statusCommittee: "Pending",
  },
  {
    sno: 3,
    school: "E: School of Electronics and Electrical Engineering",
    regNo: "12306750",
    studentName: "Nandana M M",
    program: "P13AF:B.Tech. (Robotics and Automation)",
    batchYear: "2023",
    term: "8",
    course: "ECE489:PLC AND SCADA",
    category: "EDU- REV Number of Unique Students applied for RPL (Recognition of Prior Learning)",
    description: "I have completed my skill development course AutomateX: Mastering PLCs for industrial automation",
    statusSchool: "Approved",
    statusCommittee: "Pending",
  },
  {
    sno: 4,
    school: "E: School of Electronics and Electrical Engineering",
    regNo: "12307539",
    studentName: "Shiv Subhankar Agasti",
    program: "P135:B.Tech. (Electronics and Communication Engineering)",
    batchYear: "2023",
    term: "",
    course: "ECE416:COMMUNICATION NETWORKS",
    category: "NPTEL/MOOCs/Certifications",
    description: "",
    statusSchool: "",
    statusCommittee: "",
  },
  {
    sno: 5,
    school: "E: School of Electronics and Electrical Engineering",
    regNo: "12314881",
    studentName: "Ajmeera Rishikeshwar Naik",
    program: "P135:B.Tech. (Electronics and Communication Engineering)",
    batchYear: "2023",
    term: "",
    course: "ECE416:COMMUNICATION NETWORKS",
    category: "NPTEL/MOOCs/Certifications",
    description: "",
    statusSchool: "",
    statusCommittee: "",
  },
  {
    sno: 6,
    school: "E: School of Electronics and Electrical Engineering",
    regNo: "12320822",
    studentName: "Abdul Quadir",
    program: "P13A:B.Tech. (Electrical and Electronics Engineering)",
    batchYear: "2023",
    term: "8",
    course: "ECE361:INDUSTRIAL AUTOMATION",
    category: "EDU- REV Number of Unique Students applied for RPL (Recognition of Prior Learning)",
    description: "I'm Abdul Quadir, Reg No: 12320822, I have completed this course in previous semester from Centre for Professional Enhancement(Lovely Professional University).",
    statusSchool: "Approved",
    statusCommittee: "Approved (Remarks:valid certificate uploded: AutomateX: Mastering PLCs for Industrial automation)",
  },
];

const getStatusChip = (status: string, icon: boolean = false) => {
  if (!status) return <Typography variant="caption" color="text.secondary">-</Typography>;
  
  let color: "success" | "warning" | "error" | "default" = "default";
  let bg = "#f1f5f9";
  let textColor = "#64748b";
  
  if (status.toLowerCase().includes("approved")) {
    color = "success";
    bg = "#dcfce7";
    textColor = "#16a34a";
  } else if (status.toLowerCase().includes("pending")) {
    color = "warning";
    bg = "#fef9c3";
    textColor = "#ca8a04";
  } else if (status.toLowerCase().includes("rejected")) {
    color = "error";
    bg = "#fee2e2";
    textColor = "#dc2626";
  }
  
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: bg,
        color: textColor,
        fontWeight: 600,
        fontSize: "0.7rem",
        maxWidth: 200,
      }}
    />
  );
};

const StudentEnrollmentStatusPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterSchool, setFilterSchool] = useState("");

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const filteredData = enrollmentData.filter(
    (item) =>
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uniqueSchools = [...new Set(enrollmentData.map((item) => item.school))];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: 2 }}>
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          color: "white",
          py: 3,
          px: 3,
          borderRadius: "0 0 30px 30px",
          boxShadow: "0 10px 40px rgba(102, 126, 234, 0.3)",
          mb: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -30,
            left: -30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.1)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -50,
            right: -50,
            width: 150,
            height: 150,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.08)",
          }}
        />
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              href="/dashboard/staff/EduRev/dashboard"
              startIcon={<ArrowBackIcon />}
              sx={{
                color: "white",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              Back
            </Button>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  textAlign: "center",
                  letterSpacing: "1px",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                  fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                Student Enrollment Status
              </Typography>
              <Typography
                variant="body1"
                sx={{ textAlign: "center", mt: 1, opacity: 0.9, fontWeight: 500 }}
              >
                View and manage student enrollment status
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl">
        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                bgcolor: "#dcfce7",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      bgcolor: "#16a34a",
                      color: "white",
                      display: "flex",
                    }}
                  >
                    <CheckCircleIcon />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={800} color="#16a34a">
                      {enrollmentData.filter((i) => i.statusSchool === "Approved").length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Approved
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                bgcolor: "#fef9c3",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      bgcolor: "#ca8a04",
                      color: "white",
                      display: "flex",
                    }}
                  >
                    <PendingIcon />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={800} color="#ca8a04">
                      {enrollmentData.filter((i) => i.statusSchool === "Approved" && i.statusCommittee === "Pending").length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Pending
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                bgcolor: "#fee2e2",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      bgcolor: "#dc2626",
                      color: "white",
                      display: "flex",
                    }}
                  >
                    <CancelIcon />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={800} color="#dc2626">
                      0
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Rejected
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                bgcolor: "#e0e7ff",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      bgcolor: "#4f46e5",
                      color: "white",
                      display: "flex",
                    }}
                  >
                    <SchoolIcon />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={800} color="#4f46e5">
                      {enrollmentData.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Records
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                mb: 2,
              }}
            >
              <TextField
                placeholder="Search by student name, reg no, or program..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: { xs: "100%", sm: 350 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Filter by School</InputLabel>
                  <Select
                    value={filterSchool}
                    label="Filter by School"
                    onChange={(e) => setFilterSchool(e.target.value)}
                  >
                    <MenuItem value="">All Schools</MenuItem>
                    {uniqueSchools.map((school, index) => (
                      <MenuItem key={index} value={school}>
                        {school.split(":")[0] || school}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  sx={{ borderColor: "#e2e8f0", color: "#64748b" }}
                >
                  Export
                </Button>
              </Box>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8fafc" }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>S.No</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>School</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>Reg No</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>Student Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>Program</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>Batch Year</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>Term</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>Course</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>Status Standing Committee (School)</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>Status Committee Incharge (DAA)</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((row, index) => (
                    <TableRow
                      key={row.sno}
                      sx={{
                        "&:hover": { bgcolor: "#f8fafc" },
                        bgcolor: index % 2 === 0 ? "white" : "#f8fafc",
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {row.sno}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.75rem", maxWidth: 150 }}>
                        <Typography variant="caption" sx={{ display: "block", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {row.school.split(":")[0] || row.school}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {row.regNo}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              bgcolor: "#667eea",
                              fontSize: "0.75rem",
                            }}
                          >
                            {row.studentName.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" fontWeight={500}>
                            {row.studentName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.7rem", maxWidth: 150 }}>
                        <Typography variant="caption" sx={{ display: "block", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {row.program}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{row.batchYear}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{row.term || "-"}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.7rem", maxWidth: 120 }}>
                        <Typography variant="caption" sx={{ display: "block", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {row.course}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.7rem", maxWidth: 130 }}>
                        <Typography variant="caption" sx={{ display: "block", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {row.category}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.7rem", maxWidth: 150 }}>
                        <Typography variant="caption" sx={{ display: "block", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {row.description || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>{getStatusChip(row.statusSchool)}</TableCell>
                      <TableCell>{getStatusChip(row.statusCommittee)}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={handleMenuClick}>
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: "#dc2626" }}>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default StudentEnrollmentStatusPage;
