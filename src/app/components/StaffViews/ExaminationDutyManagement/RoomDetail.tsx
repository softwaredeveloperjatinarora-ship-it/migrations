"use client";
import React from "react";
import { Box, Chip, Grid, Link, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import { MeetingRoom, Description } from "@mui/icons-material";

interface RoomSummaryItem {
  title: string;
  actual?: number;
  present?: number;
  umsCoordinator?: string;
  hoc?: string;
}

interface BottomStat {
  title: string;
  value?: number;
  color?: string;
  icon?: React.ReactNode;
}

interface RoomDetailsData {
  breadcrumb: string;
  headerTitle: string;
  summary: RoomSummaryItem[];
  bottomStats: BottomStat[];
}

const RoomDetails = () => {
    const theme = useTheme();
  // ✅ Single data object with multiple sections/records
  const roomDetailsData: RoomDetailsData = {
    
    breadcrumb: "Dashboard / Total Rooms",
    headerTitle: "Room Details & Management",
    summary: [
      { title: "Center Strength", actual: 2450, present: 2435 },
      { title: "Male Students", actual: 1380, present: 1375 },
      { title: "Female Students", actual: 1070, present: 1060 },
      { title: "Coordinators", umsCoordinator: "Dr. Sharma", hoc: "Prof. Patel" },
    ],
    bottomStats: [
      { title: "Total Rooms Count", value: 156, color: "primary" },
      { title: "Attendance Count", value: 152, color: "green" },
      { title: "File Details", icon: <Description sx={{ color: "primary.main", mb: 1 }} /> },
    ],
  };

   const dutyTypeDistribution = [
    { type: "Invigilator", duties: 85, reported: 82, link: "View Details" },
    { type: "SOC", duties: 12, reported: 12, link: "SOC Report" },
    { type: "DSOC", duties: 24, reported: 23, link: "DSOC Report" },
    { type: "Clerk", duties: 18, reported: 18, link: "Clerk Details" },
    { type: "AO", duties: 8, reported: 8, link: "AO Report" },
    { type: "Writer", duties: 15, reported: 14, link: "Writer Details" },
  ];

  const answerSheetDistribution = [
    { type: "All MCQ", code: 45, strength: 1250, rooms: 68, link: "MCQ Details" },
    { type: "All Subjects", code: 32, strength: 850, rooms: 52, link: "Subject Details" },
    { type: "MIX", code: 28, strength: 350, rooms: 36, link: "Mix Details" },
  ];

  return (
    <Paper elevation={3} sx={{ p: 3,  mt:1,borderRadius: 3 }}>
      {/* Breadcrumb */}
      <Typography variant="body2" sx={{ mb: 2, color: "gray" }}>
        {roomDetailsData.breadcrumb}
      </Typography>

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          background: theme.palette.primary.main,
          borderRadius: 2,
          p: 2,         
          color: "white",
          mb: 3,
        }}
      >
        <MeetingRoom sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight="bold">
          {roomDetailsData.headerTitle}
        </Typography>
      </Box>

      {/* Summary Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {roomDetailsData.summary.map((item, index) => (          
             <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Paper
              sx={{
                p: 2,
                borderRadius: 1,              
                 borderLeft: `6px solid ${theme.palette.primary.main
                }`,               
                minHeight: 90,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography fontWeight="bold">{item.title}</Typography>

              {/* Conditionally render based on type */}
              {item.umsCoordinator ? (
                <>
                  <Typography variant="body2">
                    UMS Coordinator: <b>{item.umsCoordinator}</b>
                  </Typography>
                  <Typography variant="body2">
                    HOC: <b>{item.hoc}</b>
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body2">
                    Actual: <b>{item.actual}</b>
                  </Typography>
                  <Typography variant="body2">
                    Present: <b>{item.present}</b>
                  </Typography>
                </>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Bottom Stats */}
      <Grid container spacing={2}>
        {roomDetailsData.bottomStats.map((stat, index) => (
             <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            {/* <Paper sx={{ textAlign: "center", p: 3, borderRadius: 2 }}> */}
           <Paper  sx={{
                p: 2,
                borderRadius: 1,              
                 borderLeft: `6px solid ${theme.palette.primary.main
                }`,         
                textAlign: "center",      
                minHeight: 90,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}>
              {stat.icon ? (
                <>
                  {stat.icon}
                  <Typography variant="body2" color="primary">
                    {stat.title}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color={stat.color === "green" ? "green" : "primary"}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2">{stat.title}</Typography>
                </>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
     {/* Duty Type Distribution Table */}
      <Typography variant="h6" sx={{ mb: 1 , mt:1}}>
        Duty Type Distribution
      </Typography>
      <Paper sx={{ mb: 4, borderRadius: 2, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background: theme.palette.primary.main,
              }}
            >
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>DUTY TYPE</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>NO. OF DUTIES</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>REPORTED</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>LINK FILE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dutyTypeDistribution.map((duty, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Chip
                    label={duty.type}
                    sx={{
                      background: theme.palette.primary.main,
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "8px",
                      px: 1,
                    }}
                  />
                </TableCell>
                <TableCell>{duty.duties}</TableCell>
                <TableCell>{duty.reported}</TableCell>
                <TableCell>
                  <Link href="#" underline="hover" sx={{ color: "#3b82f6", fontWeight: 500 }}>
                    {duty.link}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Answer Sheet Distribution Table */}
      <Typography variant="h6" sx={{ mb: 1 }}>
        Answer Sheet Distribution
      </Typography>
      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background: theme.palette.primary.main,
              }}
            >
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>ANSWER SHEET TYPE</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>TOTAL COURSE CODE</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>STRENGTH</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>TOTAL ROOMS</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>LINK FILE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {answerSheetDistribution.map((sheet, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Chip
                    label={sheet.type}
                    sx={{
                      background:
                        index === 0
                          ? theme.palette.primary.main
                          : index === 1
                          ? "#4caf50"
                          : "#ec407a",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "8px",
                      px: 1,
                    }}
                  />
                </TableCell>
                <TableCell>{sheet.code}</TableCell>
                <TableCell>{sheet.strength.toLocaleString()}</TableCell>
                <TableCell>{sheet.rooms}</TableCell>
                <TableCell>
                  <Link href="#" underline="hover" sx={{ color: "#3b82f6", fontWeight: 500 }}>
                    {sheet.link}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Paper>
  );
};

export default RoomDetails;
