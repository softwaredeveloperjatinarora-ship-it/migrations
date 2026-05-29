
"use client";
import React, { useEffect, useState } from "react";
import { PaletteColor, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Alert, Button, Chip, Grid, Icon, InputAdornment } from "@mui/material";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import LinearProgress from "@mui/material/LinearProgress";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Tab from "@mui/material/Tab";
import { useDispatch, useSelector } from 'react-redux';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { setCenterNumber } from "@/store/CenterNumber/centerNumberSlice";
// Import icons from tabler and other sources
import {
  IconDotsVertical,
  IconCalendarEvent,
  IconFileCheck,
  IconAlertTriangle,
  IconClipboardCheck,
  IconReceipt,
  IconAlertCircle,
} from "@tabler/icons-react";
import FeedIcon from '@mui/icons-material/Feed';

// Using dynamic import for Chart component to avoid SSR issues
import dynamic from "next/dynamic";
import SheetConsumption from "../SheetConsumption/SheetConsumption";
// import DashboardCards from "../../Test";
import { Feed } from "@mui/icons-material";
import Link from "next/link";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// DashboardCard component for consistent card styling
interface DashboardCardProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, action, children }) => {
  const theme = useTheme();
  const borderColor = theme.palette.divider;

  return (
    <Card
      sx={{
        padding: 0,
        border: `1px solid ${borderColor}`,
        mb: 0,
      }}
      elevation={0}
      variant="outlined"
    >
      <Box p={2} display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">{title}</Typography>
        {action}
      </Box>
      <CardContent sx={{ p: "18px" }}>{children}</CardContent>
    </Card>
  );
};

// Detailed statistics card component
interface StatsCardProps {
  icon: React.ElementType;
  title: string;
  value: number | string;
  color: string;
  progress: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, title, value, color, progress }) => {
  const IconComponent = icon;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
          <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main` }}>
            <IconComponent stroke={1.5} size="24" />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Box>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: theme => (theme.palette[color as keyof typeof theme.palette] as PaletteColor).light,
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme => {
                const paletteColor = theme.palette[color as keyof typeof theme.palette];
                return typeof paletteColor === 'object' && 'main' in paletteColor ? paletteColor.main : undefined;
              }
            }
          }}
        />
      </CardContent>
    </Card>
  );
};

// Main ExaminationDashboard Component
const ExaminationDashboard = () => {
  const [centerNo, setCenterNo] = useState('')
  const centerNumber = useSelector((state: any) => state.center.centerNumber);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [tabValue, setTabValue] = React.useState("1");
  const [examTypeTab, setExamTypeTab] = React.useState("theory");

  // Menu handlers
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Tab change handler
  const handleTabChange = (event: any, newValue: React.SetStateAction<string>) => {
    setTabValue(newValue);
  };

  const handleExamTypeTabChange = (event: any, newValue: React.SetStateAction<string>) => {
    setExamTypeTab(newValue);
  };

  // Colors for charts
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const success = theme.palette.success.main;
  const warning = theme.palette.warning.main;
  const error = theme.palette.error.main;
  const info = theme.palette.info.main;

  // Static data for exams
  const examStats = {
    totalExams: 1248,
    completedExams: 876,
    pendingExams: 372,
    challanApproved: 846,
    sheetsConsumed: 3654,
    umcPunched: 78,
    discrepancies: 23
  };

  // Date-wise exam data for charts
  const examDates = ['01/04', '02/04', '03/04', '04/04', '05/04', '06/04', '07/04', '08/04', '09/04', '10/04'];
  const examCounts = [45, 52, 38, 65, 72, 56, 48, 63, 58, 69];
  const theoryExams = [30, 35, 25, 42, 50, 32, 28, 40, 38, 45];
  const practicalExams = [15, 17, 13, 23, 22, 24, 20, 23, 20, 24];
  const sheetCounts = [132, 145, 118, 189, 210, 175, 152, 190, 165, 196];
  const umcCounts = [5, 8, 3, 11, 9, 7, 6, 12, 8, 9];
  const discrepancyCounts = [2, 1, 3, 4, 2, 0, 5, 3, 2, 1];
  const challanCounts = [40, 48, 35, 58, 65, 50, 45, 60, 55, 65];

  // Common menu action for cards
  const menuAction = (
    <>
      <IconButton
        onClick={handleMenuClick}
        size="small"
        aria-controls="dashboard-menu"
        aria-haspopup="true"
      >
        <IconDotsVertical size={20} />
      </IconButton>
      <Menu
        id="dashboard-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Refresh</MenuItem>
        <MenuItem onClick={handleMenuClose}>Export Data</MenuItem>
        <MenuItem onClick={handleMenuClose}>Print</MenuItem>
      </Menu>
    </>
  );

  // Chart options for exam trend
  const examTrendOptions = {
    chart: {
      type: "line" as const,
      toolbar: {
        show: false,
      },
      fontFamily: theme.typography.fontFamily,
    },
    colors: [primary, secondary, success],
    stroke: {
      curve: "smooth" as const,
      width: 3,
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 3,
    },
    markers: {
      size: 4,
    },
    xaxis: {
      categories: examDates,
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode,
    },
    legend: {
      position: 'top' as const,
      horizontalAlign: 'right' as const,
      labels: {
        colors: theme.palette.text.primary,
      },
    },
  };



  const examTrendSeries = [
    {
      name: 'Total Exams',
      data: examCounts,
    },
    {
      name: 'Theory',
      data: theoryExams,
    },
    {
      name: 'Practical',
      data: practicalExams,
    },
  ];

  // Donut chart options for exam type distribution
  const examTypeDistributionOptions = {
    chart: {
      type: 'donut' as const,
      fontFamily: theme.typography.fontFamily,
    },
    colors: [primary, secondary],
    labels: ['Theory', 'Practical'],
    legend: {
      position: 'bottom' as const,
      labels: {
        colors: theme.palette.text.secondary,
      },
    },
    tooltip: {
      theme: theme.palette.mode, // still shows on hover
    },
    plotOptions: {
      pie: {
        donut: {
          size: '85%',
          labels: {
            show: false // this disables the center label inside the donut
          },
        },
      },
    },
    dataLabels: {
      enabled: false, // hides labels on the pie slices
    },
  };


  const examTypeDistributionSeries = [65, 35]; // 65% Theory, 35% Practical

  // Bar chart for UMC and discrepancies
  const anomalyOptions = {
    chart: {
      type: 'bar' as const,
      stacked: false,
      toolbar: {
        show: false,
      },
      fontFamily: theme.typography.fontFamily,
    },
    colors: [error, warning],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: examDates,
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      title: {
        text: 'Count',
        style: {
          color: theme.palette.text.secondary,
        },
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      theme: theme.palette.mode,
    },
    legend: {
      position: 'top' as const,
      horizontalAlign: 'right' as const,
      labels: {
        colors: theme.palette.text.primary,
      },
    },
  };

  const anomalySeries = [
    {
      name: 'UMC Cases',
      data: umcCounts,
    },
    {
      name: 'Discrepancies',
      data: discrepancyCounts,
    },
  ];

  // Initial setup activities
  const initialSetupActivities = [
    { activity: "Kit Receiving", completed: 100, color: "success" },
    { activity: "Adding Rooms", completed: 85, color: "primary" },
    { activity: "Adding Staff", completed: 70, color: "info" },
  ];

  // Daily activities progress data
  const theoryActivities = [
    { activity: "Sheet Consumption", completed: 90, color: "success" },
    { activity: "Seating Plan Generation", completed: 75, color: "primary" },
    { activity: "Staff Allocation", completed: 80, color: "info" },
    { activity: "Attendance Marking", completed: 95, color: "success" },
    { activity: "UMC Marking", completed: 60, color: "warning" },
    { activity: "Discrepancy Marking", completed: 55, color: "warning" },
    { activity: "Challan Generation", completed: 40, color: "error" },
  ];

  const practicalActivities = [
    { activity: "Sheet Consumption", completed: 85, color: "success" },
    { activity: "Seating Plan Generation", completed: 70, color: "primary" },
    { activity: "Attendance Marking", completed: 90, color: "success" },
    { activity: "UMC Marking", completed: 50, color: "warning" },
    { activity: "Discrepancy Marking", completed: 45, color: "warning" },
    { activity: "Challan Generation", completed: 35, color: "error" },
  ];

  // Pending activities from previous days
  const pendingActivities = [
    { date: "21 Apr", activity: "Challan Generation (Theory)", completion: 85 },
    { date: "20 Apr", activity: "UMC Marking (Practical)", completion: 70 },
    { date: "19 Apr", activity: "Discrepancy Resolution (Theory)", completion: 60 },
  ];

  // Date-wise statistics for tab view
  const dateWiseStats = {
    "1": {
      date: "Apr 15-21, 2025",
      exams: { theory: 154, practical: 100, total: 254 },
      students: { theory: 4250, practical: 1850, total: 6100 },
      challan: 213,
      umc: 12,
      discrepancies: 5
    },
    "2": {
      date: "Apr 8-14, 2025",
      exams: { theory: 112, practical: 75, total: 187 },
      students: { theory: 3100, practical: 1400, total: 4500 },
      challan: 165,
      umc: 9,
      discrepancies: 3
    },
    "3": {
      date: "Apr 1-7, 2025",
      exams: { theory: 130, practical: 71, total: 201 },
      students: { theory: 3650, practical: 1300, total: 4950 },
      challan: 183,
      umc: 15,
      discrepancies: 7
    }
  };

  const [initialTasks, setInitialTasks] = useState(0)
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  const handleNext = () => {
    setPage((prev) => prev + 1);
    // fetch or slice new data for next 10 items
  };

  const handlePrev = () => {
    setPage((prev) => Math.max(prev - 1, 0));
    // fetch or slice new data for previous 10 items
  };

  return (
    <Box p={0}>

      {/* Welcome Message  */}
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          width: '100%',
          textAlign: 'center',
          py: 0,
          px: 1,
          mt: 0,
          // backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#121212' : '#FFFFFF', 
          color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#000',
          fontSize: {
            xs: '1.1rem',
            sm: '1.4rem',
            md: '1rem',
            lg: '1.3rem',
            xl: '2rem',
          },
          borderRadius: "4px",
          fontWeight: 600,
        }}
      >
        Welcome to Examination Dashboard (Center No- {centerNumber} )
      </Typography>

      {/* Alert Message for Initial Tasks */}
      {initialTasks === 0 && (
        <Box
          sx={(theme) => ({
            backgroundColor: theme.palette.mode === "dark" ? "#111C2D" : "#fdecea",
            borderLeft: `6px solid ${theme.palette.error.main}`,
            p: { xs: 0, sm: 1 },
            borderRadius: "7px",
            mt: 2,
          })}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
              p: "6px"
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: (theme) => theme.palette.text.primary,
                fontWeight: 600,

              }}
            >
              Your Initial Tasks are Pending
            </Typography>

            <Link
              href="http://localhost:3000/dashboard/StartupActivity/KitReceiving"
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#FA896B",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#e8775f",
                  },
                  fontSize: { xs: "0.7rem", sm: "0.9rem" },
                  padding: "2px 8px",
                  minHeight: "auto",
                  minWidth: "auto",
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                }}
              >
                Click here
              </Button>

            </Link>
          </Box>
        </Box>
      )}
      <br />
      {/* Cards */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}   >
          <Card elevation={3} sx={{ padding: 0 }}>
            <CardContent sx={{ padding: 0 }}>

              <Box display="flex" alignItems="center" gap={1} px={2} pt={2}>
                <FeedIcon color="primary" fontSize="small" />
                <Typography variant="subtitle2" color="textSecondary">
                  Total Exams
                </Typography>
              </Box>


              <Typography variant="h5" fontWeight="bold" px={2} mt={1}>
                54 / 100
              </Typography>


              <Box px={2} pt={1} pb={2}>
                <LinearProgress
                  variant="determinate"
                  value={75}
                  color="primary"
                  sx={{ height: 8, borderRadius: 5 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>


        {/* Student Strength */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}   >
          <Card elevation={3} sx={{ padding: 0 }}>
            <CardContent sx={{ padding: 0 }}>

              <Box display="flex" alignItems="center" gap={1} px={2} pt={2}>
                <FeedIcon color="primary" fontSize="small" />
                <Typography variant="subtitle2" color="textSecondary">
                  Student Strength
                </Typography>
              </Box>


              <Typography variant="h5" fontWeight="bold" px={2} mt={1}>
                54 / 100
              </Typography>


              <Box px={2} pt={1} pb={2}>
                <LinearProgress
                  variant="determinate"
                  value={75}
                  color="info"
                  sx={{ height: 8, borderRadius: 5 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>






        <Grid size={{ xs: 12, sm: 6, lg: 3 }}   >
          <Card elevation={3} sx={{ padding: 0, borderRadius: 1 }} >
            <CardContent sx={{ padding: 0 }}>

              <Box display="flex" alignItems="center" gap={1} px={2} pt={2} >
                <FeedIcon color="primary" fontSize="small" />
                <Typography variant="subtitle2" color="textSecondary">
                  Sheets Consumed
                </Typography>
              </Box>


              <Typography variant="h5" fontWeight="bold" px={2} mt={1}>
                54 / 100
              </Typography>


              <Box px={2} pt={1} pb={2}>
                <LinearProgress
                  variant="determinate"
                  value={75}
                  color="warning"
                  sx={{ height: 8, borderRadius: 5 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Challan Card */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}   >
          <Card elevation={3} sx={{ padding: 0 }}>
            <CardContent sx={{ padding: 0 }}>

              <Box display="flex" alignItems="center" gap={1} px={2} pt={2}>
                <FeedIcon color="primary" fontSize="small" />
                <Typography variant="subtitle2" color="textSecondary">
                  Challan Approved
                </Typography>
              </Box>

              <Typography variant="h5" fontWeight="bold" px={2} mt={1}>
                54 / 100
              </Typography>


              <Box px={2} pt={1} pb={2}>
                <LinearProgress
                  variant="determinate"
                  value={75}
                  color="success"
                  sx={{ height: 8, borderRadius: 5 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Exam Type Distribution */}
        <Grid size={{ xs: 12, lg: 4, md: 4 }} >
          <DashboardCard
            title="Exam Type Distribution"
            action={menuAction}

          >
            <Box minHeight={"207px"} height="237px" width="100%" >
              <Chart
                options={examTypeDistributionOptions}
                series={examTypeDistributionSeries}
                type="donut"
                height={260}
              />
            </Box>
          </DashboardCard>
        </Grid>

        {/* Sheet Consumption  */}
        <Grid size={{ xs: 12, md: 4 }} >
          <DashboardCard
            title="Sheet Consumption"
            action={menuAction}

          >
            <Box sx={{ height: "237px", paddling: 0, backgroundColor: "transparent" }}>
              <SheetConsumption />
            </Box>
          </DashboardCard>
        </Grid>

        {/* Initial Setup Progress */}
        <Grid size={{ xs: 12, md: 4, lg: 4 }}>
          <DashboardCard title="Initial Setup Progress" action={menuAction}>
            <Box p={2} sx={{ height: "237px", overflowY: "auto" }}>
              {/* Kit Receiving */}
              <Box mb={3}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Typography variant="subtitle1">Kit Receiving</Typography>
                  <Chip label="Approved" color="success" size="small" />
                </Stack>
              </Box>

              <br />

              {/* Adding Rooms */}
              <Box mb={3}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Typography variant="subtitle1">Adding Rooms</Typography>
                  <Chip
                    label="85"
                    color="info"
                    size="small"
                    sx={{
                      minWidth: 70, // ⬅️ increase width
                      justifyContent: 'center', // ⬅️ center the label
                      fontWeight: 'bold',
                    }}
                  />
                </Stack>
              </Box>
              <br />
              <Box mb={3}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Typography variant="subtitle1">Adding Staff</Typography>
                  <Chip
                    label="185"
                    color="primary"
                    size="small"
                    sx={{
                      minWidth: 70,
                      justifyContent: 'center',
                      fontWeight: 'bold',
                    }}
                  />
                </Stack>
              </Box>


            </Box>
          </DashboardCard>
        </Grid>

        {/* UMC and Discrepancy Chart */}
        <Grid size={{ xs: 12, md: 8, lg: 8 }}>
          <DashboardCard
            title="UMC & Discrepancies"
            action={
              <Box display="flex" alignItems="center" gap={1}>
                {/* Your original action (e.g., a menu button) */}


                {/* Arrow buttons */}
                <IconButton onClick={handlePrev} size="small">
                  <KeyboardArrowLeftIcon />
                </IconButton>
                <IconButton onClick={handleNext} size="small">
                  <KeyboardArrowRightIcon />
                </IconButton>
                {menuAction}
              </Box>
            }

          >
            <Box height="369px" width="100%" position="relative">
              <Chart
                options={anomalyOptions}
                series={anomalySeries}
                type="bar"
                height={350}
              />

            </Box>
          </DashboardCard>
        </Grid>
        {/* Upcoming Exams */}
        <Grid size={{ xs: 12, md: 4, lg: 4 }}>
          <DashboardCard title="Upcoming Exams" action={menuAction}>
            <Box sx={{ px: 0, py: 2, mt: -5 }} height="407px" width="100%" >
              <Grid container spacing={2} >

                {/* Date Picker */}
                <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                  {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Select Exam Date"
                      disablePast
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                        },
                        }}
                    />
                  </LocalizationProvider> */}
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Select Exam Date"
                      disablePast
                      // open={isCalendarOpen}
                      // onOpen={() => setIsCalendarOpen(true)}
                      // onClose={() => setIsCalendarOpen(false)}
                      // value={selectedDate}
                      // onChange={(newValue) => {
                      //   if (newValue) {
                      //     setSelectedDate(newValue);
                      //   }
                      //   setIsCalendarOpen(false);
                      // }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                        },
                      }}

                    // slots={{
                    //   day: renderDay
                    // }}
                    // slotProps={{
                    //   textField: {
                    //     InputProps: {
                    //       endAdornment: (
                    //         <InputAdornment position="end">
                    //           <CalendarMonthIcon
                    //             onClick={() => setIsCalendarOpen(true)}
                    //             sx={{ cursor: 'pointer' }}
                    //           />
                    //         </InputAdornment>
                    //       )
                    //     },
                    //     fullWidth: true,
                    //     variant: 'outlined'
                    //   }
                    // }}
                    />
                  </LocalizationProvider>
                </Grid>

                {/* Date Display */}
                <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                  <Box
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      p: 1,
                      borderRadius: 1,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body2" noWrap>
                      23 April, Wednesday
                    </Typography>
                  </Box>
                </Grid>

                {/* Exam Cards */}
                {[
                  {
                    time: "09:00 AM",
                    examType: "Theory",
                    coursesCount: 4,
                    studentsCount: 230,
                    location: "Hall A, B, C"
                  },
                  {
                    time: "11:30 AM",
                    examType: "Practical",
                    coursesCount: 3,
                    studentsCount: 150,
                    location: "Lab 1, 2, 3"
                  },
                  {
                    time: "02:00 PM",
                    examType: "Theory",
                    coursesCount: 5,
                    studentsCount: 320,
                    location: "Hall D, E, F"
                  }
                ].map((exam, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 12 }} key={index}>
                    <Card
                      sx={{
                        p: 2,
                        borderLeft: `4px solid ${exam.examType === "Theory" ? '#1976d2' : '#FA896B'}`,
                      }}
                    >
                      <Typography variant="h6">{exam.examType}</Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Courses: {exam.coursesCount} | Students: {exam.studentsCount}
                      </Typography>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">{exam.time}</Typography>

                      </Stack>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </DashboardCard>
        </Grid>

        {/* Daily Activities Progress */}
        <Grid size={{ xs: 12, lg: 12 }} >
          <DashboardCard
            title="Daily Activities Progress"
            action={

              <Stack direction="row" spacing={2} alignItems="center">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Select Exam Date"
                    disablePast
                    // open={isCalendarOpen}
                    // onOpen={() => setIsCalendarOpen(true)}
                    // onClose={() => setIsCalendarOpen(false)}
                    // value={selectedDate}
                    // onChange={(newValue) => {
                    //   if (newValue) {
                    //     setSelectedDate(newValue);
                    //   }
                    //   setIsCalendarOpen(false);
                    // }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                      },
                    }}

                  // slots={{
                  //   day: renderDay
                  // }}
                  // slotProps={{
                  //   textField: {
                  //     InputProps: {
                  //       endAdornment: (
                  //         <InputAdornment position="start">
                  //           <CalendarMonthIcon
                  //             // onClick={() => setIsCalendarOpen(true)}
                  //             sx={{ cursor: 'pointer' }}
                  //           />
                  //         </InputAdornment>
                  //       )
                  //     },
                  //     fullWidth: true,
                  //     variant: 'outlined'
                  //   }
                  // }}
                  />
                </LocalizationProvider>
                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Pick a date"
                    disablePast
                    slotProps={{ textField: { size: 'small' } }}
                  />
                </LocalizationProvider> */}
                {menuAction}
              </Stack>
            }

          >
            {/* <Box sx={{ mt: -5 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker label="Basic date picker" disablePast />
              </DemoContainer>
            </LocalizationProvider>
          </Box> */}
            {/* <TabContext value={tabValue}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={handleTabChange}
                  aria-label="date-wise stats tabs"
                  // Remove the 'value' prop from TabList as it's not expected here
                  // The value is already set in the parent TabContext
                  sx={{
                    "& .MuiTab-root.Mui-selected": {
                      background: (theme) => theme.palette.primary.main,
                      color: "white",
                      borderRadius: "8px",
                    },
                    "& .MuiTabs-indicator": {
                      display: "none",
                    },
                  }}
                >
                  <Tab label="This Week" value="1" />
                  <Tab label="Last Week" value="2" />
                  <Tab label="Two Weeks Ago" value="3" />
                </TabList>
              </Box>
            </TabContext> */}
            <Box p={2}>
              {examTypeTab === "theory" ? (
                <>
                  {theoryActivities.map((activity, index) => (
                    <Box key={index} mb={3}>
                      <Stack direction="row" justifyContent="space-between" mb={1}>
                        <Typography variant="subtitle1">{activity.activity}</Typography>
                        <Typography variant="body2" color={`${activity.color}.main`}>
                          {activity.completed}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={activity.completed}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: theme => {
                            const paletteColor = theme.palette[activity.color as keyof typeof theme.palette];
                            return typeof paletteColor === 'object' && 'light' in paletteColor ? paletteColor.light : theme.palette.grey[200];
                          },
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: theme => {
                              const paletteColor = theme.palette[activity.color as keyof typeof theme.palette];
                              return typeof paletteColor === 'object' && 'main' in paletteColor ? paletteColor.main : theme.palette.grey[500];
                            }
                          }
                        }}
                      />
                    </Box>
                  ))}
                </>
              ) : (
                <>
                  {practicalActivities.map((activity, index) => (
                    <Box key={index} mb={3}>
                      <Stack direction="row" justifyContent="space-between" mb={1}>
                        <Typography variant="subtitle1">{activity.activity}</Typography>
                        <Typography variant="body2" color={`${activity.color}.main`}>
                          {activity.completed}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={activity.completed}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: theme => {
                            const paletteColor = theme.palette[activity.color as keyof typeof theme.palette];
                            return typeof paletteColor === 'object' && 'light' in paletteColor ? paletteColor.light : theme.palette.grey[200];
                          },
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: theme => {
                              const paletteColor = theme.palette[activity.color as keyof typeof theme.palette];
                              return typeof paletteColor === 'object' && 'main' in paletteColor ? paletteColor.main : theme.palette.grey[500];
                            }
                          }
                        }}
                      />
                    </Box>
                  ))}
                </>
              )}
            </Box>
          </DashboardCard>
        </Grid>









        {/* <Grid size={{ xs: 12, lg: 4, md: 4 }}>
          <DashboardCard
            title="Upcoming Exams"
            action={menuAction}
          >
            <Box height="367px" width="100%">
              <Grid container spacing={1} >
                <Grid size={{ xs: 12, md: 12, lg: 12 }} textAlign="center">
                  <Grid size={{ xs: 12, lg: 12, md: 12 }}>
                    <Box sx={{ mt: -5 }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                          <DatePicker label="Basic date picker" disablePast />
                        </DemoContainer>
                      </LocalizationProvider>
                    </Box></Grid>

                  <Grid size={{ xs: 12, lg: 12, md: 12 }}>
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: 500,
                        bgcolor: 'primary.main',
                        color: 'white',
                        p: 1,
                        borderRadius: 1,
                        my: 0,
                        mt: 2,
                        mx: "auto",
                      }}
                    >
                      <Typography variant="body2">23 April , Wednesday</Typography>
                    </Box>
                  </Grid>


                </Grid>
                <Grid container justifyContent="center" >
                  <Grid size={{ xs: 12, md: 10 }} >
                    <Grid
                      container
                      spacing={2}
                      direction="column"
                      alignItems="center"
                    >

                      {[
                        {
                          time: "09:00 AM",
                          examType: "Theory",
                          coursesCount: 4,
                          studentsCount: 230,
                          location: "Hall A, B, C"
                        },
                        {
                          time: "11:30 AM",
                          examType: "Practical",
                          coursesCount: 3,
                          studentsCount: 150,
                          location: "Lab 1, 2, 3"
                        },
                        {
                          time: "02:00 PM",
                          examType: "Theory",
                          coursesCount: 5,
                          studentsCount: 320,
                          location: "Hall D, E, F"
                        }
                      ].map((exam, index) => (
                        <Grid size={{ xs: 6, sm: 6, md: 12 }} key={index}>
                          <Card
                            sx={{
                              p: { xs: 1, sm: 2 },
                              ml: { xs: 0, sm: -2 },
                              width: { xs: '100%', sm: 240 },

                              borderLeft: {
                                xs: `4px solid ${exam.examType === "Theory" ? primary : secondary}`,
                                sm: `4px solid ${exam.examType === "Theory" ? primary : secondary}`,
                              },
                            }}
                          >

                            <Typography variant="h6">{exam.examType}</Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              Courses: {exam.coursesCount} | Students: {exam.studentsCount}
                            </Typography>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2">{exam.time}</Typography>
                            </Stack>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>

              </Grid>
            </Box>
          </DashboardCard>
        </Grid> */}
        {/* <Grid size={{ xs: 12, md: 6 }} >
          <DashboardCard
            title="Date-wise Examination Statistics"
            action={menuAction}
          >
            <TabContext value={tabValue}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={handleTabChange}
                  aria-label="date-wise stats tabs"
                  sx={{
                    "& .MuiTab-root.Mui-selected": {
                      background: (theme) => theme.palette.primary.main,
                      color: "white",
                      borderRadius: "8px",
                    },
                    "& .MuiTabs-indicator": {
                      display: "none",
                    },
                  }}
                >
                  <Tab label="This Week" value="1" />
                  <Tab label="Last Week" value="2" />
                  <Tab label="Two Weeks Ago" value="3" />
                </TabList>
              </Box>
              {(Object.keys(dateWiseStats) as Array<keyof typeof dateWiseStats>).map((key) => (
                <TabPanel value={key} key={key} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {dateWiseStats[key as keyof typeof dateWiseStats].date}
                  </Typography>
                  <Grid container spacing={3} mt={1}>
                    <Grid size={{ xs: 12, sm: 6 }} >
                      <Card sx={{ bgcolor: 'primary.light', color: 'primary.main', p: 2 }}>
                        <Typography variant="h5">
                          Theory: {dateWiseStats[key].exams.theory} / Practical: {dateWiseStats[key].exams.practical}
                        </Typography>
                        <Typography variant="body2">Exams Conducted: {dateWiseStats[key].exams.total}</Typography>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Card sx={{ bgcolor: 'info.light', color: 'info.main', p: 2 }}>
                        <Typography variant="h5">
                          Theory: {dateWiseStats[key].students.theory} / Practical: {dateWiseStats[key].students.practical}
                        </Typography>
                        <Typography variant="body2">Students Count: {dateWiseStats[key].students.total}</Typography>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Card sx={{ bgcolor: 'success.light', color: 'success.main', p: 2 }}>
                        <Typography variant="h4">{dateWiseStats[key].challan}</Typography>
                        <Typography variant="body2">Challan Approved</Typography>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Card sx={{ bgcolor: 'warning.light', color: 'warning.main', p: 2 }}>
                        <Typography variant="h4">{dateWiseStats[key].umc}</Typography>
                        <Typography variant="body2">UMC Cases</Typography>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Card sx={{ bgcolor: 'error.light', color: 'error.main', p: 2 }}>
                        <Typography variant="h4">{dateWiseStats[key].discrepancies}</Typography>
                        <Typography variant="body2">Discrepancies</Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </TabPanel>
              ))}
            </TabContext>
          </DashboardCard>
        </Grid> */}
        {/* <Grid size={{ xs: 12, md: 6 }} >
          <DashboardCard
            title="Date-wise Examination Statistics"
            action={menuAction}
          >
            <TabContext value={tabValue}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={handleTabChange}
                  aria-label="date-wise stats tabs"
                  sx={{
                    "& .MuiTab-root.Mui-selected": {
                      background: (theme) => theme.palette.primary.main,
                      color: "white",
                      borderRadius: "8px",
                    },
                    "& .MuiTabs-indicator": {
                      display: "none",
                    },
                  }}
                >
                  <Tab label="This Week" value="1" />
                  <Tab label="Last Week" value="2" />
                  <Tab label="Two Weeks Ago" value="3" />
                </TabList>
              </Box>
              {(Object.keys(dateWiseStats) as Array<keyof typeof dateWiseStats>).map((key) => (
                <TabPanel value={key} key={key} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {dateWiseStats[key as keyof typeof dateWiseStats].date}
                  </Typography>
                  <Grid container spacing={3} mt={1}>
                    <Grid size={{ xs: 12, sm: 6 }} >
                      <Card sx={{ bgcolor: 'primary.light', color: 'primary.main', p: 2 }}>
                        <Typography variant="h5">
                          Theory: {dateWiseStats[key].exams.theory} / Practical: {dateWiseStats[key].exams.practical}
                        </Typography>
                        <Typography variant="body2">Exams Conducted: {dateWiseStats[key].exams.total}</Typography>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Card sx={{ bgcolor: 'info.light', color: 'info.main', p: 2 }}>
                        <Typography variant="h5">
                          Theory: {dateWiseStats[key].students.theory} / Practical: {dateWiseStats[key].students.practical}
                        </Typography>
                        <Typography variant="body2">Students Count: {dateWiseStats[key].students.total}</Typography>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Card sx={{ bgcolor: 'success.light', color: 'success.main', p: 2 }}>
                        <Typography variant="h4">{dateWiseStats[key].challan}</Typography>
                        <Typography variant="body2">Challan Approved</Typography>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Card sx={{ bgcolor: 'warning.light', color: 'warning.main', p: 2 }}>
                        <Typography variant="h4">{dateWiseStats[key].umc}</Typography>
                        <Typography variant="body2">UMC Cases</Typography>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Card sx={{ bgcolor: 'error.light', color: 'error.main', p: 2 }}>
                        <Typography variant="h4">{dateWiseStats[key].discrepancies}</Typography>
                        <Typography variant="body2">Discrepancies</Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </TabPanel>
              ))}
            </TabContext>
          </DashboardCard>
        </Grid> */}

        {/* Initial Setup Progress */}
        {/* <Grid size={{ xs: 12, md: 6, lg: 6 }} sx={{ mt: 6 }} >
          <DashboardCard
            title="Initial Setup Progress"
            action={menuAction}
          >
            <Box p={2} sx={{ height: "107%" }}>
              {initialSetupActivities.map((activity, index) => (
                <Box key={index} mb={3}>
                  <Stack direction="row" justifyContent="space-between" mb={1}>
                    <Typography variant="subtitle1">{activity.activity}</Typography>
                    <Typography variant="body2" color={`${activity.color}.main`}>
                      {activity.completed}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={activity.completed}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: theme => {
                        const paletteColor = theme.palette[activity.color as keyof typeof theme.palette];
                        return typeof paletteColor === 'object' && 'light' in paletteColor ? paletteColor.light : theme.palette.grey[200];
                      },
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: theme => {
                          const paletteColor = theme.palette[activity.color as keyof typeof theme.palette];
                          return typeof paletteColor === 'object' && 'main' in paletteColor ? paletteColor.main : theme.palette.grey[500];
                        }
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
          </DashboardCard>
        </Grid> */}


        {/* <Grid size={{ xs: 12, sm: 6, lg: 3 }} sx={{ maxHeight: "100px" }}>
          <StatsCard
            icon={IconReceipt}
            title="Challan Approved"
            value={examStats.challanApproved}
            color="success"
            progress={70}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatsCard
            icon={IconAlertTriangle}
            title="UMC Punched"
            value={examStats.umcPunched}
            color="warning"
            progress={25}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatsCard
            icon={IconClipboardCheck}
            title="Sheets Consumed"
            value={examStats.sheetsConsumed}
            color="info"
            progress={85}
          />
        </Grid> */}


        {/* Exam Trend Chart */}
        {/* <Grid size={{ xs: 12, lg: 5 }} >
          <DashboardCard
            title="Examination Trend"
            action={menuAction}
          >
            <Box height="350px" width="100%">
              <Chart
                options={examTrendOptions}
                series={examTrendSeries}
                type="line"
                height={350}
              />
            </Box>
          </DashboardCard>
        </Grid> */}
        {/* <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <DashboardCard
            title="Pending Activities"
            action={menuAction}
          >
            <Box p={2} sx={{ height: "37%" }}>
              {pendingActivities.length > 0 ? (
                pendingActivities.map((activity, index) => (
                  <Alert
                    key={index}
                    severity="warning"
                    sx={{ mb: 2 }}
                    icon={<IconAlertCircle size={24} />}
                  >
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {activity.date}: {activity.activity}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                        <LinearProgress
                          variant="determinate"
                          value={activity.completion}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            flexGrow: 1,
                            backgroundColor: theme.palette.warning.light,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: theme.palette.warning.main
                            }
                          }}
                        />
                        <Typography variant="body2">{activity.completion}%</Typography>
                      </Stack>
                    </Box>
                  </Alert>
                ))
              ) : (
                <Typography variant="body1" color="textSecondary">
                  No pending activities from previous days.
                </Typography>
              )}
            </Box>
          </DashboardCard>
        </Grid> */}
        {/* Exam Type Distribution Donut */}


        {/* <Grid size={{ xs: 12, md: 6 ,lg: 4}} sx={{mt:6}} >
          <DashboardCard
            title="Initial Setup Progress"
            action={menuAction}
          >
            <Box p={2} sx={{height:"107%"}}>
            <Box key={index} mb={3}>
            {initialSetupActivities.map((activity, index) => (
                  <Stack direction="row" justifyContent="space-between" mb={1}>
                    <Typography variant="subtitle1">{activity.activity}</Typography>
                    <Typography variant="body2" color={`${activity.color}.main`}>
                      {activity.completed}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={activity.completed}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: theme => {
                        const paletteColor = theme.palette[activity.color as keyof typeof theme.palette];
                        return typeof paletteColor === 'object' && 'light' in paletteColor ? paletteColor.light : theme.palette.grey[200];
                      },
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: theme => {
                          const paletteColor = theme.palette[activity.color as keyof typeof theme.palette];
                          return typeof paletteColor === 'object' && 'main' in paletteColor ? paletteColor.main : theme.palette.grey[500];
                        }
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
          </DashboardCard>
        </Grid> */}


        {/* <Grid size={{ xs: 12, lg: 4, md: 4 }}>
          <DashboardCard
            title="Upcoming Exams"
            action={menuAction}
          >
            <Box height="367px" width="100%">
              <Grid container spacing={1} >
                <Grid size={{ xs: 12, md: 12, lg: 12 }} textAlign="center">
                  <Grid size={{ xs: 12, lg: 12, md: 12 }}>
                    <Box sx={{ mt: -5 }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                          <DatePicker label="Basic date picker" disablePast />
                        </DemoContainer>
                      </LocalizationProvider>
                    </Box></Grid>

                  <Grid size={{ xs: 12, lg: 12, md: 12 }}>
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: 500,
                        bgcolor: 'primary.main',
                        color: 'white',
                        p: 1,
                        borderRadius: 1,
                        my: 0,
                        mt: 2,
                        mx: "auto",
                      }}
                    >
                      <Typography variant="body2">23 April , Wednesday</Typography>
                    </Box>
                  </Grid>


                </Grid>
                <Grid container justifyContent="center" >
                  <Grid size={{ xs: 12, md: 10 }} >
                    <Grid
                      container
                      spacing={2}
                      direction="column"
                      alignItems="center"
                    >
                      
                      {[
                        {
                          time: "09:00 AM",
                          examType: "Theory",
                          coursesCount: 4,
                          studentsCount: 230,
                          location: "Hall A, B, C"
                        },
                        {
                          time: "11:30 AM",
                          examType: "Practical",
                          coursesCount: 3,
                          studentsCount: 150,
                          location: "Lab 1, 2, 3"
                        },
                        {
                          time: "02:00 PM",
                          examType: "Theory",
                          coursesCount: 5,
                          studentsCount: 320,
                          location: "Hall D, E, F"
                        }
                      ].map((exam, index) => (
                        <Grid size={{ xs: 6, sm: 6, md: 12 }} key={index}>
                          <Card
                            sx={{
                              p: { xs: 1, sm: 2 },
                              ml: { xs: 0, sm: -2 },
                              width: { xs: '100%', sm: 240 },

                              borderLeft: {
                                xs: `4px solid ${exam.examType === "Theory" ? primary : secondary}`,
                                sm: `4px solid ${exam.examType === "Theory" ? primary : secondary}`,
                              },
                            }}
                          >
                            
                            <Typography variant="h6">{exam.examType}</Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              Courses: {exam.coursesCount} | Students: {exam.studentsCount}
                            </Typography>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2">{exam.time}</Typography>
                            </Stack>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>

              </Grid>
            </Box>
          </DashboardCard>
        </Grid> */}

        {/* Pending Activities */}

        {/* Initial Setup Progress and Exam Type Distribution Donut */}
        {/* Date-wise Statistics with Tabs */}
        {/* <Grid size={{ xs: 12, md: 6 }} >
          <DashboardCard
            title="Date-wise Examination Statistics"
            action={menuAction}
          >
            <TabContext value={tabValue}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={handleTabChange}
                  aria-label="date-wise stats tabs"
                  sx={{
                    "& .MuiTab-root.Mui-selected": {
                      background: (theme) => theme.palette.primary.main,
                      color: "white",
                      borderRadius: "8px",
                    },
                    "& .MuiTabs-indicator": {
                      display: "none",
                    },
                  }}
                >
                  <Tab label="This Week" value="1" />
                  <Tab label="Last Week" value="2" />
                  <Tab label="Two Weeks Ago" value="3" />
                </TabList>
              </Box>
              {(Object.keys(dateWiseStats) as Array<keyof typeof dateWiseStats>).map((key) => (
                <TabPanel value={key} key={key} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {dateWiseStats[key as keyof typeof dateWiseStats].date}
                  </Typography>
                  <Grid container spacing={3} mt={1}>
                    <Grid size={{ xs: 12, sm: 6 }} >
                      <Card sx={{ bgcolor: 'primary.light', color: 'primary.main', p: 2 }}>
                        <Typography variant="h5">
                          Theory: {dateWiseStats[key].exams.theory} / Practical: {dateWiseStats[key].exams.practical}
                        </Typography>
                        <Typography variant="body2">Exams Conducted: {dateWiseStats[key].exams.total}</Typography>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Card sx={{ bgcolor: 'info.light', color: 'info.main', p: 2 }}>
                        <Typography variant="h5">
                          Theory: {dateWiseStats[key].students.theory} / Practical: {dateWiseStats[key].students.practical}
                        </Typography>
                        <Typography variant="body2">Students Count: {dateWiseStats[key].students.total}</Typography>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Card sx={{ bgcolor: 'success.light', color: 'success.main', p: 2 }}>
                        <Typography variant="h4">{dateWiseStats[key].challan}</Typography>
                        <Typography variant="body2">Challan Approved</Typography>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Card sx={{ bgcolor: 'warning.light', color: 'warning.main', p: 2 }}>
                        <Typography variant="h4">{dateWiseStats[key].umc}</Typography>
                        <Typography variant="body2">UMC Cases</Typography>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Card sx={{ bgcolor: 'error.light', color: 'error.main', p: 2 }}>
                        <Typography variant="h4">{dateWiseStats[key].discrepancies}</Typography>
                        <Typography variant="body2">Discrepancies</Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </TabPanel>
              ))}
            </TabContext>
          </DashboardCard>
        </Grid> */}

        {/* Upcoming Examinations Calendar */}
        {/* <Grid size={{ xs: 12, lg: 4, md: 4 }}>
          <DashboardCard
            title="Upcoming Exams"
            action={menuAction}
          >

            <Grid container spacing={1} >
              <Grid size={{ xs: 12, md: 12 }} textAlign="center">

            
                <Box sx={{ mt: -5 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker label="Basic date picker" disablePast />
                    </DemoContainer>
                  </LocalizationProvider>
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 500,
                    bgcolor: 'primary.main',
                    color: 'white',
                    p: 1,
                    borderRadius: 1,
                    my: 0,
                    mt: 2,
                    mx: "auto",
                  }}
                >
                  <Typography variant="body2">23 April , Wednesday</Typography>
                </Box>


                <br />
              </Grid>
              <Grid container justifyContent="center">
                <Grid size={{ xs: 12, md: 10 }}>
                  <Grid
                    container
                    spacing={2}
                    direction="column"
                    alignItems="center"
                  >
                    {[
                      {
                        time: "09:00 AM",
                        examType: "Theory",
                        coursesCount: 4,
                        studentsCount: 230,
                        location: "Hall A, B, C"
                      },
                      {
                        time: "11:30 AM",
                        examType: "Practical",
                        coursesCount: 3,
                        studentsCount: 150,
                        location: "Lab 1, 2, 3"
                      },
                      {
                        time: "02:00 PM",
                        examType: "Theory",
                        coursesCount: 5,
                        studentsCount: 320,
                        location: "Hall D, E, F"
                      }
                    ].map((exam, index) => (
                      <Grid size={{ xs: 6, sm: 6, md: 12 }} key={index}>
                        <Card
                          sx={{
                            p: { xs: 1, sm: 2 },
                            ml: { xs: 0, sm: -2 },
                            width: { xs: '100%', sm: 240 },
                            borderLeft: {
                              xs: `4px solid ${exam.examType === "Theory" ? primary : secondary}`,
                              sm: `4px solid ${exam.examType === "Theory" ? primary : secondary}`,
                            },
                          }}
                        >
                          <Typography variant="h6">{exam.examType}</Typography>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            Courses: {exam.coursesCount} | Students: {exam.studentsCount}
                          </Typography>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2">{exam.time}</Typography>
                          </Stack>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>

            </Grid>
          </DashboardCard>
        </Grid> */}
      </Grid>
    </Box >
  );
};

export default ExaminationDashboard;