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
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  School as SchoolIcon,
} from "@mui/icons-material";

// Mock data for Tab 1 - Edu Rev Metrics
const metricData = [
  {
    sno: 1,
    school: "E: School of Electronics and Electrical Engineering",
    metricId: "9050",
    category: "Edu Rev - Revenue generation through different sources",
    integratedDetails: "View Integrated Details",
    totalStudents: 1095,
    enrolledStudents: 82,
    appliedStudents: 548,
    percentage: "14.96%",
  },
  {
    sno: 2,
    school: "E: School of Electronics and Electrical Engineering",
    metricId: "9044",
    category: "Edu Rev - Number of students having Projects",
    integratedDetails: "View Integrated Details",
    totalStudents: 1095,
    enrolledStudents: 64,
    appliedStudents: 548,
    percentage: "11.68%",
  },
  {
    sno: 3,
    school: "E: School of Electronics and Electrical Engineering",
    metricId: "9047",
    category: "Edu Rev - Academic Social Media Presence (Student registered for Linkedin/Portfolio/Youtube/Social media/Blog website)",
    integratedDetails: "View Integrated Details",
    totalStudents: 1095,
    enrolledStudents: 2,
    appliedStudents: 548,
    percentage: "0.36%",
  },
  {
    sno: 4,
    school: "E: School of Electronics and Electrical Engineering",
    metricId: "9045",
    category: "Edu Rev - Academic Research Initiative (Paper/Patent/Copyright/Book Chapter)",
    integratedDetails: "View Integrated Details",
    totalStudents: 1095,
    enrolledStudents: 83,
    appliedStudents: 548,
    percentage: "15.15%",
  },
  {
    sno: 5,
    school: "E: School of Electronics and Electrical Engineering",
    metricId: "9588",
    category: "EDU- REV Number of Unique Students applied for RPL (Recognition of Prior Learning)",
    integratedDetails: "View Integrated Details",
    totalStudents: 1095,
    enrolledStudents: 364,
    appliedStudents: 548,
    percentage: "66.42%",
  },
  {
    sno: 6,
    school: "E: School of Electronics and Electrical Engineering",
    metricId: "9046",
    category: "Edu Rev - Competitions (Student participating in various competitions) & competitive exams",
    integratedDetails: "View Integrated Details",
    totalStudents: 1095,
    enrolledStudents: 33,
    appliedStudents: 548,
    percentage: "6.02%",
  },
  {
    sno: 7,
    school: "E: School of Electronics and Electrical Engineering",
    metricId: "0",
    category: "NPTEL/MOOCs/Certifications",
    integratedDetails: "View Integrated Details",
    totalStudents: 1095,
    enrolledStudents: 419,
    appliedStudents: 548,
    percentage: "76.46%",
  },
  {
    sno: 8,
    school: "E: School of Electronics and Electrical Engineering",
    metricId: "0",
    category: "Co-curricular/Extra curricular activities",
    integratedDetails: "View Integrated Details",
    totalStudents: 1095,
    enrolledStudents: 0,
    appliedStudents: 548,
    percentage: "0.00%",
  },
  {
    sno: 9,
    school: "E: School of Electronics and Electrical Engineering",
    metricId: "0",
    category: "Community Service",
    integratedDetails: "View Integrated Details",
    totalStudents: 1095,
    enrolledStudents: 3,
    appliedStudents: 548,
    percentage: "0.55%",
  },
  {
    sno: 10,
    school: "E: School of Electronics and Electrical Engineering",
    metricId: "0",
    category: "Other",
    integratedDetails: "View Integrated Details",
    totalStudents: 1095,
    enrolledStudents: 13,
    appliedStudents: 548,
    percentage: "2.37%",
  },
];

// Mock data for Tab 2 - Student Nominations
const nominationData = [
  {
    sno: 1,
    school: "E: School of Electronics and Electrical Engineering",
    regNo: "12319071",
    studentName: "Sakshi Sharma",
    program: "P135:B.Tech. (Electronics and Communication Engineering)",
    batchYear: "2023",
    term: "8",
    course: "",
    category: "Edu Rev - Competitions (Student participating in various competitions) & competitive exams",
    description: "I have cgpa of 7.77 and preparing for cds.All supporting documents are attached so please grant 10 percent attendance relaxation.",
    statusSchool: "Approved",
    statusCommittee: "Pending",
  },
  {
    sno: 2,
    school: "E: School of Electronics and Electrical Engineering",
    regNo: "12321046",
    studentName: "Baisani Narasimha Sai Manas",
    program: "P135:B.Tech. (Electronics and Communication Engineering)",
    batchYear: "2023",
    term: "",
    course: "MTH401:DISCRETE MATHEMATICS",
    category: "NPTEL/MOOCs/Certifications",
    description: "",
    statusSchool: "",
    statusCommittee: "",
  },
  {
    sno: 3,
    school: "E: School of Electronics and Electrical Engineering",
    regNo: "12321046",
    studentName: "Baisani Narasimha Sai Manas",
    program: "P135:B.Tech. (Electronics and Communication Engineering)",
    batchYear: "2023",
    term: "8",
    course: "MTH401:DISCRETE MATHEMATICS",
    category: "EDU- REV Number of Unique Students applied for RPL (Recognition of Prior Learning)",
    description: "I have registered for the course",
    statusSchool: "DisApproved (Remarks:Not Recommended apply with valid proof)",
    statusCommittee: "DisApproved (Remarks:Auto disapprove as per Hos approval)",
  },
  {
    sno: 4,
    school: "E: School of Electronics and Electrical Engineering",
    regNo: "12321051",
    studentName: "Vithanala Saivanaja",
    program: "P135:B.Tech. (Electronics and Communication Engineering)",
    batchYear: "2023",
    term: "8",
    course: "CSE326:INTERNET PROGRAMMING LABORATORY",
    category: "EDU- REV Number of Unique Students applied for RPL (Recognition of Prior Learning)",
    description: "NA",
    statusSchool: "Approved",
    statusCommittee: "Approved (Remarks:Valid document uploded)",
  },
  {
    sno: 5,
    school: "E: School of Electronics and Electrical Engineering",
    regNo: "12321195",
    studentName: "Palli Manmohan",
    program: "P135:B.Tech. (Electronics and Communication Engineering)",
    batchYear: "2023",
    term: "8",
    course: "ECE342:EMBEDDED SYSTEM ARCHITECTURE AND PROGRAMMING",
    category: "Edu Rev - Number of students having Projects",
    description: "This live project focuses on the design and implementation of an intelligent thermal management and dual-battery switching system using tinyML-AI for electric bikes...",
    statusSchool: "Pending",
    statusCommittee: "Pending",
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`metric-tabpanel-${index}`}
      aria-labelledby={`metric-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
};

const getStatusChip = (status: string) => {
  if (!status) return <Typography variant="caption" color="text.secondary">-</Typography>;
  
  let bg = "#f1f5f9";
  let textColor = "#64748b";
  
  if (status.toLowerCase().includes("approved")) {
    bg = "#dcfce7";
    textColor = "#16a34a";
  } else if (status.toLowerCase().includes("pending")) {
    bg = "#fef9c3";
    textColor = "#ca8a04";
  } else if (status.toLowerCase().includes("disapproved") || status.toLowerCase().includes("reject")) {
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
        maxWidth: 250,
      }}
    />
  );
};

const MetricDetailsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const filteredMetricData = metricData.filter(
    (item) =>
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.metricId.includes(searchTerm)
  );

  const filteredNominationData = nominationData.filter(
    (item) =>
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.regNo.includes(searchTerm.toLowerCase()) ||
      item.program.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                Edu Rev Metric Details
              </Typography>
              <Typography
                variant="body1"
                sx={{ textAlign: "center", mt: 1, opacity: 0.9, fontWeight: 500 }}
              >
                View and manage Edu Rev metrics and student nominations
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl">
        {/* Tabs */}
        <Card sx={{ borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{
              "& .MuiTab-root": {
                fontWeight: 700,
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "1px",
                py: 1.5,
                px: 3,
              },
              "& .Mui-selected": { color: "#667eea", bgcolor: "#f5f3ff" },
              "& .MuiTabs-indicator": {
                bgcolor: "#667eea",
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
            }}
          >
            <Tab label="Edu Rev Metrics" />
            <Tab label="Student Nominations" />
          </Tabs>
        </Card>

        {/* Tab 1 - Edu Rev Metrics */}
        <TabPanel value={tabValue} index={0}>
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
                        {metricData.filter((i) => parseFloat(i.percentage) > 50).length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Above 50%
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
                        {metricData.filter((i) => parseFloat(i.percentage) > 10 && parseFloat(i.percentage) <= 50).length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        10-50%
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
                        {metricData.filter((i) => parseFloat(i.percentage) <= 10).length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Below 10%
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
                        {metricData.length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total Metrics
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Metrics Table */}
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
                  placeholder="Search by category or metric ID..."
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
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  sx={{ borderColor: "#e2e8f0", color: "#64748b" }}
                >
                  Export
                </Button>
              </Box>

              <TableContainer component={Paper} elevation={0} sx={{ overflowX: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f8fafc" }}>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>S.No</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>School</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>MetricId (Edu Rev)</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>Integrated Details</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>Total Students</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>Enrolled Students</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>Total Percentage</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }} align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredMetricData.map((row, index) => (
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
                        <TableCell sx={{ fontSize: "0.7rem", maxWidth: 120 }}>
                          <Typography variant="caption" sx={{ display: "block", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {row.school.split(":")[0] || row.school}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {row.metricId}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.7rem", maxWidth: 150 }}>
                          <Typography variant="caption" sx={{ display: "block", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {row.category}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.integratedDetails}
                            size="small"
                            icon={<VisibilityIcon />}
                            sx={{
                              bgcolor: "#e0e7ff",
                              color: "#4f46e5",
                              fontWeight: 600,
                              fontSize: "0.7rem",
                              "& .MuiChip-icon": { color: "#4f46e5" },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {row.totalStudents}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {row.enrolledStudents}/{row.appliedStudents}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            sx={{
                              color: parseFloat(row.percentage) > 50 ? "#16a34a" : parseFloat(row.percentage) > 10 ? "#ca8a04" : "#dc2626",
                            }}
                          >
                            {row.percentage}
                          </Typography>
                        </TableCell>
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
        </TabPanel>

        {/* Tab 2 - Student Nominations */}
        <TabPanel value={tabValue} index={1}>
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
                        {nominationData.filter((i) => i.statusSchool.toLowerCase().includes("approved")).length}
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
                        {nominationData.filter((i) => i.statusSchool.toLowerCase().includes("pending")).length}
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
                        {nominationData.filter((i) => i.statusSchool.toLowerCase().includes("disapproved") || i.statusSchool.toLowerCase().includes("reject")).length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Disapproved
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
                        {nominationData.length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total Nominations
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Nominations Table */}
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
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  sx={{ borderColor: "#e2e8f0", color: "#64748b" }}
                >
                  Export
                </Button>
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
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>Nomination Category</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>Status Standing Committee (School)</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }}>Status Committee Incharge (DAA)</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: "0.75rem", whiteSpace: "nowrap" }} align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredNominationData.map((row, index) => (
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
                        <TableCell sx={{ fontSize: "0.7rem", maxWidth: 100 }}>
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
                          <Typography variant="body2" fontWeight={500}>
                            {row.studentName}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.7rem", maxWidth: 120 }}>
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
                        <TableCell sx={{ fontSize: "0.7rem", maxWidth: 100 }}>
                          <Typography variant="caption" sx={{ display: "block", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {row.course || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.7rem", maxWidth: 130 }}>
                          <Typography variant="caption" sx={{ display: "block", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {row.category}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.7rem", maxWidth: 120 }}>
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
        </TabPanel>
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

export default MetricDetailsPage;
