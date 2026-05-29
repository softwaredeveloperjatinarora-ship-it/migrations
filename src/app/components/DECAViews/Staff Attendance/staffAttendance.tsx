"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  MenuItem,
  InputAdornment,
  Stack,
  Chip,
  Avatar,
  Checkbox,
  Rating,
  IconButton,
  useTheme,
  CircularProgress
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Alert from "@mui/material/Alert";
import AttendanceData from "./attendanceData";
import { FormData, FormErrors } from "@/app/api/interfaces/DistanceExamination/staffAttendance";
import theme from "@/utils/theme";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format, parse } from 'date-fns';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { encryptData, decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import { getStaffAttendance } from "@/app/actions/DECAActions/DistanceExamination/Staff Attendance/getStaffAttendance";
import { addStffAttendance } from "@/app/actions/DECAActions/DistanceExamination/Staff Attendance/addStffAttendance";

const StaffAttendance = () => {
  const { data: session } = useSession();
  const centerNumber = useSelector((state: any) => state.center.centerNumber);
  const router = useRouter();
  const theme = useTheme();

  interface ChipClickEvent {
    (item: string): void;
  }

  const handleChipClick: ChipClickEvent = (item) => {
    setFormData((prevData) => ({
      ...prevData,
      chooseType: item,
    }));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);

  // Form Data
  const [formData, setFormData] = useState<FormData>({
    examDate: format(new Date(), 'yyyy-MM-dd'),
    chooseType: "",
    employeeId: "",
    Timing: format(new Date(), 'HH:mm')
  });

  // Filter date for attendance records
  const [filterDate, setFilterDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Check if data is "No data present" response
  const isNoDataResponse = (data: any[]) => {
    if (!Array.isArray(data) || data.length === 0) return true;

    // Check if it's the "No data present" response
    return data.length === 1 &&
      data[0]?.employeeId === "No data present" &&
      data[0]?.dutyType === "No data present" &&
      data[0]?.date === null &&
      data[0]?.reportingTime === null;
  };

  // Fetch attendance data
  const fetchAttendanceData = useCallback(async (reportingDate: string) => {
    // Strict validation to prevent unnecessary calls
    if (!session?.user?.token|| !centerNumber || !reportingDate) {
      return;
    }

    try {
      setLoading(true);

      // Validate token format before splitting
      if (typeof session.user?.token !== 'string' || !session?.user?.token.includes("NEXT2121ANG")) {
        setAttendanceData([]);
        return;
      }

      const splitValue = session.user?.token.split("NEXT2121ANG");
      if (!splitValue[1]) {
        setAttendanceData([]);
        return;
      }

      const formfields = {
        CenterNo: centerNumber,
        ReportingDate: reportingDate,
        Type: "1"
      };

      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const response = await getStaffAttendance(Data);

      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
      const parsedData = JSON.parse(decryptedData);

      // Check if it's a "No data present" response
      if (isNoDataResponse(parsedData)) {
        setAttendanceData([]);
      } else {
        setAttendanceData(parsedData || []);
      }
    } catch (error) {
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.token, centerNumber]);

  const isDataFetched = useRef(false);

  // Fetch data on component mount and when filter date changes
  useEffect(() => {
    const fetchData = async () => {
      if (isDataFetched.current) return;

      if (centerNumber && session?.user?.token&& filterDate) {
        await fetchAttendanceData(filterDate);
      }

      isDataFetched.current = true;
    };

    fetchData();
  }, [fetchAttendanceData, filterDate]);

  // Handle Change
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const username = useSelector((state: any) => state.user?.username);
  // Handle Submit 
  const handleSubmit = async () => {
    // Clear previous errors
    setFormErrors({});

    const errors: FormErrors = {};
    if (!formData.examDate) errors.examDate = "Exam date is required.";
    if (!formData.chooseType) errors.chooseType = "Choose type is required.";
    if (!formData.employeeId) errors.employeeId = "Employee ID is required.";
    if (!formData.Timing) errors.Timing = "Time is required.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const confirmSubmit = window.confirm("Are you sure you want to submit?");
    if (!confirmSubmit) return;

    if (!session?.user?.token|| !centerNumber) {
      alert("Session or center information missing. Please refresh and try again.");
      return;
    }

    try {
      setSubmitLoading(true);
      const splitValue = session.user?.token.split("NEXT2121ANG");
      if (!splitValue[1]) {
        throw new Error("Invalid token format");
      }

      // Create the payload as an object (API expects object, responds with array)
      const attendanceRecord = {
        CenterNo: centerNumber,
        ReportingDate: formData.examDate,
        ReportingTime: formData.Timing,
        AttendanceForUid: formData.employeeId,
        DutyType: formData.chooseType,
        EntryBy: username,
        Type: "2"
      };

      const credentialsJson = JSON.stringify(attendanceRecord);
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const response = await addStffAttendance(Data);

      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);

      const parsedData = JSON.parse(decryptedData);

      // Handle the response as an array
      const responseObj = Array.isArray(parsedData) && parsedData.length > 0 ? parsedData[0] : parsedData;

      if (responseObj.Message === "Attendace Updated") {
        alert("Attendance submitted successfully!");
        handleReset();
        // Refresh the attendance data with current filter date
        if (filterDate) {
          await fetchAttendanceData(filterDate);
        }
      } else {
        const errorMsg = responseObj.Message || responseObj.message || responseObj.error || "Failed to submit attendance";
        alert(errorMsg);
      }
    } catch (error: any) {
      // More detailed error handling
      if (error.response) {
        alert(`Server error: ${error.response.data || 'Failed to submit attendance'}`);
      } else if (error.request) {
        alert("No response from server. Please check your connection.");
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle Reset
  const handleReset = () => {
    setFormData({
      examDate: format(new Date(), 'yyyy-MM-dd'),
      chooseType: "",
      employeeId: "",
      Timing: format(new Date(), 'HH:mm')
    });
    setFormErrors({});
  };

  return (
    <>
      <Box sx={{ p: 1 }}>
        {/* Form Section */}
        <Grid container spacing={3} justifyContent="center">
          <Grid size={{ xs: 12, md: 12, lg: 12 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 1 }}>
              <Grid container spacing={2} alignItems="center" sx={{ flexWrap: "wrap" }}>
                {/* Exam Date */}
                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }} sx={{ textAlign: { xs: "center", lg: "left" } }}>
                  <Typography sx={{ fontWeight: "bold", mb: 1 }}>Exam Date</Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                     onChange={(newValue) => {
  if (!newValue) return;
  const d = newValue instanceof Date ? newValue : newValue.toDate();   // NEW
  setFormData((prev) => ({
    ...prev,
    examDate: format(d, "yyyy-MM-dd"),
  }));
}}
                      value={formData.examDate ? parse(formData.examDate, "yyyy-MM-dd", new Date()) : null}
                      slotProps={{
                        textField: { size: "small", sx: { width: "100%", maxWidth: 170 } },
                      }}
                    />
                  </LocalizationProvider>
                  {formErrors.examDate && (
                    <Alert severity="error" sx={{ mt: 1, p: 0, pl: 2 }}>
                      {formErrors.examDate}
                    </Alert>
                  )}
                </Grid>

                {/* Attendance Time */}
                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }} sx={{ textAlign: { xs: "center", lg: "left" } }}>
                  <Typography sx={{ fontWeight: "bold", mb: 1 }}>Attendance Time</Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      value={formData.Timing ? parse(formData.Timing, "HH:mm", new Date()) : null}
                     onChange={(newValue) => {
  if (!newValue) return;
  const d = newValue instanceof Date ? newValue : newValue.toDate();   // NEW
  setFormData((prev) => ({
    ...prev,
    examDate: format(d, "yyyy-MM-dd"),
  }));
}}
                      slotProps={{
                        textField: { size: "small", sx: { width: "100%", maxWidth: 170 } },
                      }}
                    />
                  </LocalizationProvider>
                  {formErrors.Timing && (
                    <Alert severity="error" sx={{ mt: 1, p: 0, pl: 2 }}>
                      {formErrors.Timing}
                    </Alert>
                  )}
                </Grid>

                {/* Employee ID */}
                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 2 }} sx={{ textAlign: { xs: "center", lg: "left" } }}>
                  <Typography sx={{ fontWeight: "bold", mb: 1 }}>Employee ID</Typography>
                  <TextField
                    name="employeeId"
                    placeholder="Enter here"
                    value={formData.employeeId}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || (Number(val) >= 0 && /^\d*$/.test(val))) handleChange(e);
                    }}
                    size="small"
                    sx={{ width: "100%", maxWidth: 170 }}
                  />
                  {formErrors.employeeId && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ mt: 1, bgcolor: (theme) => theme.palette.error.light, borderRadius: 1, p: 1, justifyContent: { xs: "center", lg: "flex-start" } }}
                    >
                      <Avatar sx={{ bgcolor: "error.main", width: 24, height: 24, fontSize: 16 }}>!</Avatar>
                      <Typography color="error" variant="body2">{formErrors.employeeId}</Typography>
                    </Stack>
                  )}
                </Grid>

                {/* Choose Type */}
                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 3 }} sx={{ textAlign: { xs: "center", lg: "left" } }}>
                  <Typography sx={{ fontWeight: "bold", mb: 1 }}>Choose Type</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent={{ xs: "center", lg: "flex-start" }}>
                    {["Observer", "Neutral", "Flying"].map((item, index) => (
                      <Chip
                        key={index}
                        label={item}
                        clickable
                        color={formData.chooseType === item ? "primary" : "default"}
                        variant={formData.chooseType === item ? "filled" : "outlined"}
                        onClick={() => handleChipClick(item)}
                      />
                    ))}
                  </Stack>
                  {formErrors.chooseType && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ mt: 2, bgcolor: (theme) => theme.palette.error.light, borderRadius: 1, p: 1, justifyContent: { xs: "center", lg: "flex-start" } }}
                    >
                      <Avatar sx={{ bgcolor: "error.main", width: 24, height: 24, fontSize: 16 }}>!</Avatar>
                      <Typography color="error" variant="body2">{formErrors.chooseType}</Typography>
                    </Stack>
                  )}
                </Grid>

                {/* Submit Button */}
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 3 }} sx={{ display: "flex", justifyContent: { xs: "center", lg: "flex-end" }, mt: { xs: 2, sm: 0 } }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={!formData.employeeId || !formData.chooseType}
                    sx={{ minWidth: 120 }}
                  >
                    Punch
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* Attendance Records Section */}
        <Box
          sx={{
            bgcolor: theme.palette.mode === "dark" ? "#111C2D" : "white",
            p: 2,
            borderRadius: 1,
            boxShadow: 1,
            position: "relative",
            mt: 2,
          }}
        >
          {/* Header with Filter */}
          <Grid
            container
            alignItems="center"
            justifyContent={{ xs: "center", sm: "space-between" }}
            sx={{ mb: 0 }}
            spacing={2}
            textAlign={{ xs: "center", sm: "left" }}
          >
            <Grid>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", ml: { sm: 1 }, mb: { xs: 2, sm: 0 } }}
              >
                Attendance Records
              </Typography>
            </Grid>

            <Grid>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  onChange={(newValue  :any) => {
                    if (newValue) {
                      const newDate = format(newValue, "yyyy-MM-dd");
                      setFilterDate(newDate);
                      isDataFetched.current = false;
                    }
                  }}
                  name="filterDate"
                  label="Filter by Date"
                  value={filterDate ? parse(filterDate, "yyyy-MM-dd", new Date()) : null}
                  slotProps={{ textField: { size: "small" } }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

          {/* Table */}
          <Grid size={{ xs: 12, md: 12, lg: 12 }} sx={{ mt: 2 }}>
            <Box sx={{ maxHeight: "150vh", overflowY: "auto", borderRadius: 1, pr: 1 }}>
              <TableContainer
                component={Paper}
                sx={{
                  maxHeight: 330,
                  overflowY: "scroll",
                  "&::-webkit-scrollbar": { display: "none" },
                }}
              >
                <Table stickyHeader>
                  <TableHead sx={{ position: "sticky", top: 0, zIndex: 2, backgroundColor: "#f5f5f5" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Employee ID</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Employee Type</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Attendance Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : attendanceData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="textSecondary">
                            No attendance records found.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      attendanceData.map((entry: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{entry.empId || entry.EmployeeId || entry.employeeId || "-"}</TableCell>
                          <TableCell>{entry.emptype || entry.DutyType || entry.dutyType || "-"}</TableCell>
                          <TableCell>{entry.attendencetime || entry.ReportingTime || entry.reportingTime || "-"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        </Box>
      </Box>

    </>
  );
};

export default StaffAttendance;