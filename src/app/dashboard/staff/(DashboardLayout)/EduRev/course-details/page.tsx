"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  Container,
  Link,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  useTheme,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import { useSearchParams } from "next/navigation";

// Mock data for the table
const mockTableData = [
  {
    sno: 1,
    hodid: "12427:Harjeet Kaur",
    course: "CSE273:FOUNDATIONS OF MACHINE LEARNING",
    studentStrength: 784,
    nptelMoocsCertifications: 0,
    eduRevProjects: 2,
    eduRevUniqueStudentsRPL: 1,
    eduRevCompetitions: 0,
    eduRevRevenue: 2,
    eduRevAcademicSocialMedia: 1,
    communityService: 0,
    eduRevAcademicResearch: 0,
    coCurricularActivities: 7,
    other: 0,
    totalEnrolled: 13,
    percentageEnrollment: "1%",
    termSession: "25262",
  },
  {
    sno: 2,
    hodid: "12427:Harjeet Kaur",
    course: "CSE274:APPLIED MACHINE LEARNING",
    studentStrength: 784,
    nptelMoocsCertifications: 0,
    eduRevProjects: 6,
    eduRevUniqueStudentsRPL: 1,
    eduRevCompetitions: 0,
    eduRevRevenue: 0,
    eduRevAcademicSocialMedia: 1,
    communityService: 0,
    eduRevAcademicResearch: 0,
    coCurricularActivities: 2,
    other: 0,
    totalEnrolled: 10,
    percentageEnrollment: "1%",
    termSession: "25262",
  },
  {
    sno: 3,
    hodid: "12427:Harjeet Kaur",
    course: "CSE513:MACHINE LEARNING",
    studentStrength: 79,
    nptelMoocsCertifications: 0,
    eduRevProjects: 0,
    eduRevUniqueStudentsRPL: 3,
    eduRevCompetitions: 0,
    eduRevRevenue: 0,
    eduRevAcademicSocialMedia: 0,
    communityService: 0,
    eduRevAcademicResearch: 0,
    coCurricularActivities: 0,
    other: 0,
    totalEnrolled: 3,
    percentageEnrollment: "3%",
    termSession: "25262",
  },
];

const CourseDetailsPage = () => {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const schoolName = searchParams.get("school") || "School Details";

  const primaryColor = theme.palette.primary.main;
  const primaryLight = theme.palette.primary.light;
  const primaryContrast = theme.palette.primary.contrastText;

  // Summary calculations
  const totalCourses = mockTableData.length;
  const totalStudents = mockTableData.reduce((acc, row) => acc + row.studentStrength, 0);
  const totalEnrolled = mockTableData.reduce((acc, row) => acc + row.totalEnrolled, 0);
  const avgEnrollment = Math.round((totalEnrolled / totalStudents) * 100);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: theme.palette.grey[100], py: 2 }}>
      {/* Header - matching EduRev header style */}
      <Box
        sx={{
          bgcolor: primaryColor,
          color: primaryContrast,
          py: 3,
          px: 3,
          borderRadius: "0 0 30px 30px",
          boxShadow: "0 10px 40px rgba(102, 126, 234, 0.3)",
          mb: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", top: -30, left: -30, width: 120, height: 120, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.1)" }} />
        <Box sx={{ position: "absolute", bottom: -50, right: -50, width: 150, height: 150, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.08)" }} />
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          {/* Back Button */}
          <Link
            href="/dashboard/staff/EduRev/dashboard"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              cursor: "pointer",
              mb: 2,
              width: "fit-content",
              p: 1,
              borderRadius: 1,
              transition: "all 0.2s ease",
              color: "white",
              textDecoration: "none",
              "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
            }}
          >
            <ArrowBackIcon />
            <Typography variant="body2" fontWeight={600}>
              Back
            </Typography>
          </Link>

          {/* Title - Centered like EduRev */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 1 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SchoolIcon fontSize="large" />
            </Box>
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
              Course Details
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{ textAlign: "center", mt: 1, opacity: 0.9, fontWeight: 500 }}
          >
            {decodeURIComponent(schoolName)}
          </Typography>
        </Container>
      </Box>

      {/* Summary Cards - Below Header */}
      <Container maxWidth="xl" sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                borderLeft: `4px solid ${primaryColor}`,
              }}
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" color={theme.palette.text.secondary}>
                  Total Courses
                </Typography>
                <Typography variant="h4" fontWeight={800} color={primaryColor}>
                  {totalCourses}
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                borderLeft: `4px solid ${theme.palette.success.main}`,
              }}
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" color={theme.palette.text.secondary}>
                  Total Students
                </Typography>
                <Typography variant="h4" fontWeight={800} color={theme.palette.success.main}>
                  {totalStudents}
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                borderLeft: `4px solid ${theme.palette.warning.main}`,
              }}
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" color={theme.palette.text.secondary}>
                  Total Enrolled
                </Typography>
                <Typography variant="h4" fontWeight={800} color={theme.palette.warning.main}>
                  {totalEnrolled}
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                borderLeft: `4px solid ${theme.palette.info.main}`,
              }}
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" color={theme.palette.text.secondary}>
                  Avg Enrollment
                </Typography>
                <Typography variant="h4" fontWeight={800} color={theme.palette.info.main}>
                  {avgEnrollment}%
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Table Section */}
      <Container maxWidth={false} sx={{ px: 3 }}>
        <Card
          sx={{
            borderRadius: 2,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              bgcolor: theme.palette.grey[200],
              py: 1.5,
              px: 3,
              borderBottom: `2px solid ${primaryColor}`,
            }}
          >
            <Typography variant="subtitle1" fontWeight={700} color={theme.palette.text.primary}>
              Course-wise Metrics
            </Typography>
          </Box>
          <TableContainer component={Paper} sx={{ boxShadow: "none", maxHeight: "calc(100vh - 450px)" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: theme.palette.grey[200], fontWeight: 700, color: theme.palette.text.primary, minWidth: 60 }}>S.No</TableCell>
                  <TableCell sx={{ bgcolor: theme.palette.grey[200], fontWeight: 700, color: theme.palette.text.primary, minWidth: 150 }}>HODID</TableCell>
                  <TableCell sx={{ bgcolor: theme.palette.grey[200], fontWeight: 700, color: theme.palette.text.primary, minWidth: 280 }}>Course</TableCell>
                  <TableCell sx={{ bgcolor: theme.palette.grey[200], fontWeight: 700, color: theme.palette.text.primary, minWidth: 100 }}>StudentStrength</TableCell>
                  <TableCell sx={{ bgcolor: theme.palette.grey[200], fontWeight: 700, color: theme.palette.text.primary, minWidth: 150 }}>NPTEL/MOOCs/Certifications</TableCell>
                  <TableCell sx={{ bgcolor: theme.palette.grey[200], fontWeight: 700, color: theme.palette.text.primary, minWidth: 120 }}>Edu Rev - Projects</TableCell>
                  <TableCell sx={{ bgcolor: theme.palette.grey[200], fontWeight: 700, color: theme.palette.text.primary, minWidth: 130 }}>RPL Unique Students</TableCell>
                  <TableCell sx={{ bgcolor: theme.palette.grey[200], fontWeight: 700, color: theme.palette.text.primary, minWidth: 100 }}>Competitions</TableCell>
                  <TableCell sx={{ bgcolor: theme.palette.grey[200], fontWeight: 700, color: theme.palette.text.primary, minWidth: 80 }}>Revenue</TableCell>
                  <TableCell sx={{ bgcolor: theme.palette.grey[200], fontWeight: 700, color: theme.palette.text.primary, minWidth: 100 }}>Social Media</TableCell>
                  <TableCell sx={{ bgcolor: theme.palette.grey[200], fontWeight: 700, color: theme.palette.text.primary, minWidth: 120 }}>Community Service</TableCell>
                  <TableCell sx={{ bgcolor: theme.palette.grey[200], fontWeight: 700, color: theme.palette.text.primary, minWidth: 100 }}>Research</TableCell>
                  <TableCell sx={{ bgcolor: theme.palette.grey[200], fontWeight: 700, color: theme.palette.text.primary, minWidth: 130 }}>Co/Extra Activities</TableCell>
                  <TableCell sx={{ bgcolor: theme.palette.grey[200], fontWeight: 700, color: theme.palette.text.primary, minWidth: 60 }}>Other</TableCell>
                  <TableCell sx={{ bgcolor: theme.palette.grey[200], fontWeight: 700, color: theme.palette.text.primary, minWidth: 100 }}>Total Enrolled</TableCell>
                  <TableCell sx={{ bgcolor: theme.palette.grey[200], fontWeight: 700, color: theme.palette.text.primary, minWidth: 100 }}>% Enrollment</TableCell>
                  <TableCell sx={{ bgcolor: theme.palette.grey[200], fontWeight: 700, color: theme.palette.text.primary, minWidth: 100 }}>TermSession</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockTableData.map((row, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{row.sno}</TableCell>
                    <TableCell>{row.hodid}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {row.course}
                      </Typography>
                    </TableCell>
                    <TableCell>{row.studentStrength}</TableCell>
                    <TableCell>{row.nptelMoocsCertifications}</TableCell>
                    <TableCell>{row.eduRevProjects}</TableCell>
                    <TableCell>{row.eduRevUniqueStudentsRPL}</TableCell>
                    <TableCell>{row.eduRevCompetitions}</TableCell>
                    <TableCell>{row.eduRevRevenue}</TableCell>
                    <TableCell>{row.eduRevAcademicSocialMedia}</TableCell>
                    <TableCell>{row.communityService}</TableCell>
                    <TableCell>{row.eduRevAcademicResearch}</TableCell>
                    <TableCell>{row.coCurricularActivities}</TableCell>
                    <TableCell>{row.other}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.totalEnrolled}
                        size="small"
                        sx={{
                          bgcolor: primaryLight,
                          color: primaryContrast,
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.percentageEnrollment}
                        size="small"
                        sx={{
                          bgcolor:
                            parseInt(row.percentageEnrollment) > 2
                              ? theme.palette.success.light
                              : theme.palette.warning.light,
                          color:
                            parseInt(row.percentageEnrollment) > 2
                              ? theme.palette.success.dark
                              : theme.palette.warning.dark,
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>
                    <TableCell>{row.termSession}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Container>
    </Box>
  );
};

export default CourseDetailsPage;
