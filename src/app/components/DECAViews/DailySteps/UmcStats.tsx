import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from "@mui/material";
import { BarChart as BarChartIcon, Close as CloseIcon } from "@mui/icons-material";

interface UmcCase {
  id: number;
  regNo: string;
  examDate: string;
  examTime: string;
  examType: string;
  courseCode: string;
  termId: string;
  reason: string;
  studentName: string;
  fatherName: string;
  oldSheetNo: string;
  newSheet: boolean;
  newSheetNo: string;
  invigilator: string;
  caughtBy: string;
  caughtByFlyingSquad: boolean;
  studentStatement: string;
  invigilatorStatement: string;
  socStatement: string;
  seatingPlan: string;
  questionPaper: string;
  totalPages: string;
  remarks: string;
}

interface UmcStatsProps {
  open: boolean;
  onClose: () => void;
  umcCases: UmcCase[];
}

const UmcStats: React.FC<UmcStatsProps> = ({ open, onClose, umcCases }) => {
  // Compute statistics dynamically
  const totalCases = umcCases.length;
  const pendingCases = umcCases.filter((umc) => !umc.remarks).length;
  const resolvedCases = totalCases - pendingCases;
  const flyingSquadCases = umcCases.filter((umc) => umc.caughtByFlyingSquad).length;
  const nonFlyingSquadCases = totalCases - flyingSquadCases;

  // By exam type
  const byExamType = {
    theory: umcCases.filter((umc) => umc.examType.toLowerCase() === "theory").length,
    practical: umcCases.filter((umc) => umc.examType.toLowerCase() === "practical").length,
  };

  // By reason
  const byReason = umcCases.reduce((acc, umc) => {
    acc[umc.reason] = (acc[umc.reason] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Top UMC reason
  const topReason = Object.entries(byReason).reduce(
    (max, [reason, count]) => (count > max.count ? { reason, count } : max),
    { reason: "N/A", count: 0 }
  );

  // By course code
  const byCourseCode = umcCases.reduce((acc, umc) => {
    acc[umc.courseCode] = (acc[umc.courseCode] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // By date with additional stats
  const byDate = umcCases.reduce((acc, umc) => {
    const date = umc.examDate;
    if (!acc[date]) {
      acc[date] = {
        count: 0,
        faculty: new Set<string>(),
        flyingSquad: 0,
      };
    }
    acc[date].count += 1;
    [umc.invigilator, umc.caughtBy].filter(Boolean).forEach((faculty) => acc[date].faculty.add(faculty));
    if (umc.caughtByFlyingSquad) acc[date].flyingSquad += 1;
    return acc;
  }, {} as Record<string, { count: number; faculty: Set<string>; flyingSquad: number }>);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2,
        }}
      >
        <Box display="flex" alignItems="center">
          <BarChartIcon sx={{ mr: 1 }} />
          UMC Statistics
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ bgcolor: "#f5f5f5" }}>
        <Grid container spacing={2}>
          {/* Summary Cards */}
          <Grid size={{xs:12}}>
            <Typography variant="h6" color="primary" gutterBottom>
              Case Summary
            </Typography>
          </Grid>
          <Grid size={{xs:12,sm:3}}>
            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 2,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-2px)" },
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Total UMC Cases
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {totalCases}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({pendingCases} pending, {resolvedCases} resolved)
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{xs:12,sm:3}}>
            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 2,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-2px)" },
              }}
            >
              <Typography variant="body2" color="text.secondary">
                By Exam Type
              </Typography>
              <Box display="flex" justifyContent="center" gap={1} mt={1}>
                <Chip
                  label={`Theory: ${byExamType.theory}`}
                  color="primary"
                  size="small"
                />
                <Chip
                  label={`Practical: ${byExamType.practical}`}
                  color="secondary"
                  size="small"
                />
              </Box>
            </Paper>
          </Grid>
          <Grid  size={{xs:12,sm:3}}>
            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 2,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-2px)" },
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Flying Squad Involvement
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {flyingSquadCases}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({nonFlyingSquadCases} without squad)
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{xs:12,sm:3}}>
            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 2,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-2px)" },
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Top UMC Reason
              </Typography>
              <Typography
                variant="body1"
                color="primary"
                fontWeight="bold"
                sx={{ mt: 1 }}
              >
                {topReason.reason}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({topReason.count} cases)
              </Typography>
            </Paper>
          </Grid>

          {/* UMC Case Details Table */}
          <Grid size={{xs:12}}>
            <Typography variant="h6" color="primary" gutterBottom>
              UMC Case Details
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "primary.light" }}>
                    <TableCell>Date</TableCell>
                    <TableCell>UMC Caught Count</TableCell>
                    <TableCell>No. of Faculty Present</TableCell>
                    <TableCell>Flying Squad Present</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(byDate).length > 0 ? (
                    Object.entries(byDate).map(([date, stats], index) => (
                      <TableRow
                        key={date}
                        sx={{ bgcolor: index % 2 === 0 ? "#fafafa" : "white" }}
                      >
                        <TableCell>{date}</TableCell>
                        <TableCell>{stats.count}</TableCell>
                        <TableCell>{stats.faculty.size}</TableCell>
                        <TableCell>{stats.flyingSquad > 0 ? `Yes (${stats.flyingSquad})` : "No"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No cases available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* UMC by Reason Table */}
          <Grid size={{xs:12}}>
            <Typography variant="h6" color="primary" gutterBottom>
              UMC Cases by Reason
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "primary.light" }}>
                    <TableCell>Reason</TableCell>
                    <TableCell align="right">Count</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(byReason).length > 0 ? (
                    Object.entries(byReason).map(([reason, count], index) => (
                      <TableRow
                        key={reason}
                        sx={{ bgcolor: index % 2 === 0 ? "#fafafa" : "white" }}
                      >
                        <TableCell>{reason}</TableCell>
                        <TableCell align="right">{count}</TableCell>
                        <TableCell align="right">
                          {totalCases > 0 ? Math.round((count / totalCases) * 100) : 0}%
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No cases available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Cases by Course Code */}
          <Grid  size={{xs:12}}>
            <Paper sx={{ p: 2, borderRadius: 2, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Cases by Course Code
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "primary.light" }}>
                      <TableCell>Course Code</TableCell>
                      <TableCell align="right">Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(byCourseCode).length > 0 ? (
                      Object.entries(byCourseCode).map(([course, count], index) => (
                        <TableRow
                          key={course}
                          sx={{ bgcolor: index % 2 === 0 ? "#fafafa" : "white" }}
                        >
                          <TableCell>{course}</TableCell>
                          <TableCell align="right">{count}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center">
                          No cases available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained" sx={{ borderRadius: 1 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UmcStats;