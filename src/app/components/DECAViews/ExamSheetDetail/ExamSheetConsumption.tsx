"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Paper,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  TableContainer,
  CircularProgress,
  InputAdornment,
  useTheme,
  Chip,
  Stack,
  Button,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { format, isToday, min, max, parseISO, differenceInDays } from "date-fns";
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { getExamDates } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/sheetConsumption/getExamDates";
import { getExamSheetConsumption } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/challanProcessing/examSheetConsumption";

interface RecordData {
  CourseCode: string;
  ExamTiming: string;
  Appeared: number;
  Absent: number;
  UMC: number;
  UMCExtraSheet: number;
  NewStudent: number;
  TotalSheet: number;
  SheetConsumed: number;
  NoOfPacket: number;
  NoOfUMCPacket: number;
}

interface ExamDate {
  Date: string;
  Session: string;
  ExamType: number;
  [key: string]: any;
}

const ExamSheetConsumption = () => {
  const { data: session } = useSession();
  const centerNumber = useSelector((state: any) => state.center.centerNumber);
  const theme = useTheme();

  const [examDate, setExamDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [records, setRecords] = useState<RecordData[]>([]);
  const [loading, setLoading] = useState(false);
  const [examDates, setExamDates] = useState<ExamDate[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Fetch exam dates
  const fetchExamDates = useCallback(async () => {
    if (!session?.user?.token || !centerNumber) return;
    try {
      setLoading(true);
      const splitValue = session.user?.token.split("NEXT2121ANG");
      const formfields = { CenterNo: centerNumber };
      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const response = await getExamDates(Data);
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
      const parsedData = JSON.parse(decryptedData);
      setExamDates(parsedData || []);
    } catch (error) {
      console.error("Error fetching exam dates:", error);
      setExamDates([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.token, centerNumber]);

  // Compute normalized date set for disabling dates
  const normalizedDateSet = useMemo(() => {
    if (!examDates?.length) return new Set<string>();
    const dateSet = new Set<string>();
    examDates.forEach((item) => {
      try {
        let date: Date;
        if (item.Date.includes("T")) {
          date = new Date(item.Date);
        } else {
          date = new Date(item.Date + "T00:00:00");
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const normalizedDate = `${year}-${month}-${day}`;
        if (normalizedDate) {
          dateSet.add(normalizedDate);
        }
      } catch (error) {
        console.warn("Invalid date format:", item.Date);
      }
    });
    return dateSet;
  }, [examDates]);

  // Compute min and max dates
  const minMaxDates = useMemo(() => {
    if (!examDates.length) return { minDate: undefined, maxDate: undefined };
    const dates = examDates
      .map((e) => new Date(e.Date))
      .filter((date) => !isNaN(date.getTime()));
    return {
      minDate: dates.length ? min(dates) : undefined,
      maxDate: dates.length ? max(dates) : undefined,
    };
  }, [examDates]);

  // Parse session to minutes for sorting (9 AM to 5 PM)
  const parseSessionToMinutes = (session: string): number => {
    try {
      const startTime = session.split("-")[0]; // Get "09:30" or "14:30"
      let [hours, minutes] = startTime.split(":").map(Number);
      // Normalize hours to 24-hour format, assuming 9 AM to 5 PM range
      if (hours < 9) hours += 12; // Convert PM times (e.g., 2:30 PM to 14:30)
      return hours * 60 + minutes; // E.g., "09:30" → 9*60 + 30 = 570, "14:30" → 14*60 + 30 = 870
    } catch (error) {
      console.warn(`Invalid session format: ${session}`, error);
      return Infinity;
    }
  };

  // Filter sessions based on selected date
  const filteredSessions = useMemo(() => {
    if (!examDate || !examDates.length) return [];
    const selectedDateStr = examDate;
    const sessions = examDates
      .filter((item) => {
        try {
          let date: Date;
          if (item.Date.includes("T")) {
            date = new Date(item.Date);
          } else {
            date = new Date(item.Date + "T00:00:00");
          }
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const itemDate = `${year}-${month}-${day}`;
          return itemDate === selectedDateStr;
        } catch (error) {
          return false;
        }
      })
      .map((item) => item.Session);
    // Deduplicate and sort sessions by start time (9 AM to 5 PM)
    return [...new Set(sessions)].sort((a, b) => {
      const timeA = parseSessionToMinutes(a);
      const timeB = parseSessionToMinutes(b);
      return timeA - timeB; // Sort in ascending order
    });
  }, [examDates, examDate]);

  // Automatically select the earliest session when filteredSessions change
  useEffect(() => {
    if (filteredSessions.length > 0) {
      setSelectedTime(filteredSessions[0]);
    } else {
      setSelectedTime("");
    }
  }, [filteredSessions]);


  // Fetch exam dates on mount
  useEffect(() => {
    if (centerNumber && session?.user?.token) {
      fetchExamDates();
    }
  }, [centerNumber, session?.user?.token, fetchExamDates]);

  // Fetch exam sheet records when examDate and selectedTime are set
  const fetchExamSheetRecords = useCallback(async () => {
    if (!session?.user?.token || !examDate || !selectedTime) return;

    try {
      setLoading(true);
      const splitValue = session.user?.token.split("NEXT2121ANG");

      const formfields = {
        EDate: examDate,
        SheetType: "theory", // Hardcoded as sheet type dropdown is removed
        CenterNo: centerNumber,
        ETime: selectedTime.replace(/\s/g, ""),
      };

      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);

      const response = await getExamSheetConsumption(Data);
      console.log("response", response)
      if (!response?.status) return
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
      const parsedData = JSON.parse(decryptedData);
      setRecords(parsedData);
    } catch (error) {
      console.error("Error fetching exam sheet records:", error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.token, examDate, selectedTime, centerNumber]);

  // Pre-fetch records when examDate and selectedTime change
  useEffect(() => {
    if (examDate && selectedTime) (
      fetchExamSheetRecords()
    )
  }, [examDate, selectedTime, fetchExamSheetRecords]);

  // Find nearest allowed date
  const findNearestAllowedDate = useCallback(() => {
    const today = new Date();
    const todayStr = format(today, "yyyy-MM-dd");
    if (normalizedDateSet.has(todayStr)) {
      return todayStr;
    }
    const allowedDates: Date[] = Array.from(normalizedDateSet).map((d) => parseISO(d));
    if (allowedDates.length === 0) return null;
    allowedDates.sort(
      (a, b) =>
        Math.abs(differenceInDays(a, today)) - Math.abs(differenceInDays(b, today))
    );
    return format(allowedDates[0], "yyyy-MM-dd");
  }, [normalizedDateSet]);

  useEffect(() => {
    if (examDates.length > 0 && normalizedDateSet.size > 0 && !examDate) {
      const nearestDate = findNearestAllowedDate();
      if (nearestDate) {
        setExamDate(nearestDate);
      }
    }
  }, [examDates.length, normalizedDateSet, findNearestAllowedDate, examDate]);

  // Custom renderDay function for DatePicker
const renderDay = useCallback(
  (props: import('@mui/x-date-pickers').PickersDayProps) => {
    const { day, outsideCurrentMonth } = props;
    const realDay = day instanceof Date ? day : day.toDate();   // <-- NEW
    const dayStr = format(realDay, "yyyy-MM-dd");
    const isAllowed = normalizedDateSet.has(dayStr);
    const isSelected = examDate === dayStr;
    const isTodayDate = isToday(realDay);

    if (outsideCurrentMonth) return <Box sx={{ width: 40, height: 40 }} />;

    return (
      <Button
        sx={{
          minWidth: 40,
          width: 40,
          height: 40,
          m: 0.25,
          ...(isSelected
            ? { bgcolor: theme.palette.success.main + "!important", color: "#fff!important" }
            : isTodayDate
            ? { bgcolor: theme.palette.primary.main + "!important", color: "#fff!important" }
            : isAllowed
            ? { bgcolor: "rgba(0,123,255,0.2)", color: theme.palette.primary.main }
            : { color: theme.palette.text.disabled }),
          "&:disabled": { bgcolor: "transparent!important", color: theme.palette.text.disabled + "!important" },
        }}
        disabled={!isAllowed}
        onClick={() => {
          if (isAllowed) {
            setExamDate(dayStr);
            setIsCalendarOpen(false);
          }
        }}
      >
        {realDay.getDate()}
      </Button>
    );
  },
  [normalizedDateSet, examDate, theme.palette]
);

  // Handle session selection
  const handleSessionClick = (session: string) => {
    setSelectedTime(session);
  };

  /** --------- DOWNLOAD PDF -------- */
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Exam Sheet Records", 14, 22);
    doc.setFontSize(12);
    doc.text(`Total Records: ${records.length}`, 14, 30);
    doc.text(`Exam Date: ${examDate ? format(new Date(examDate), "dd MMM yyyy") : ""}`, 14, 38);
    doc.text(`Exam Time: ${selectedTime}`, 14, 46);

    const headers = [
      [
        "Course Code",
        "Exam Timing",
        "Appeared",
        "Absent",
        "UMC",
        "UMC Extra Sheet",
        "New Student",
        "Total Sheet",
        "Sheet Consumed",
        "No. of Packets",
        "No. of UMC Packets",
      ],
    ];
    const data = records
      .filter((item) => item.ExamTiming === selectedTime)
      .map((r) => [
        r.CourseCode,
        r.ExamTiming,
        r.Appeared,
        r.Absent,
        r.UMC,
        r.UMCExtraSheet,
        r.NewStudent,
        r.TotalSheet,
        r.SheetConsumed,
        r.NoOfPacket,
        r.NoOfUMCPacket,
      ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 54,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save("exam_sheet_records.pdf");
  };

  /** --------- DOWNLOAD EXCEL -------- */
  const handleDownloadExcel = async () => {
    if (!records || records.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Exam Sheet Records");

    worksheet.columns = [
      { header: "Course Code", key: "CourseCode", width: 20 },
      { header: "Exam Timing", key: "ExamTiming", width: 20 },
      { header: "Appeared", key: "Appeared", width: 15 },
      { header: "Absent", key: "Absent", width: 15 },
      { header: "UMC", key: "UMC", width: 10 },
      { header: "UMC Extra Sheet", key: "UMCExtraSheet", width: 20 },
      { header: "New Student", key: "NewStudent", width: 15 },
      { header: "Total Sheet", key: "TotalSheet", width: 15 },
      { header: "Sheet Consumed", key: "SheetConsumed", width: 20 },
      { header: "No. of Packets", key: "NoOfPacket", width: 20 },
      { header: "No. of UMC Packets", key: "NoOfUMCPacket", width: 25 },
    ];

    records
      .filter((item) => item.ExamTiming === selectedTime)
      .forEach((row) => worksheet.addRow(row));

    // Style header
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } };
      cell.alignment = { horizontal: "center" };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "exam_sheet_records.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };


  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      {/* Row 1 - Filters */}
      <Paper sx={{ p: 3, borderRadius: "16px", boxShadow: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center" >
          {/* Date Picker */}
          <Grid size={{ xs: 12, sm: 4, md: 4 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Exam Date"
                open={isCalendarOpen}
                onOpen={() => setIsCalendarOpen(true)}
                onClose={() => setIsCalendarOpen(false)}
                value={examDate ? new Date(examDate) : null}
                onChange={(newValue) => {
                  if (!newValue) return;
                  const d = newValue instanceof Date ? newValue : newValue.toDate();   // <-- NEW
                  const str = format(d, "yyyy-MM-dd");
                  if (normalizedDateSet.has(str)) {
                    setExamDate(str);
                  }
                  setIsCalendarOpen(false);
                }}
                minDate={minMaxDates.minDate}
                maxDate={minMaxDates.maxDate}
                shouldDisableDate={(date) => {
                  const d = date instanceof Date ? date : date.toDate();   // <-- NEW
                  return !normalizedDateSet.has(format(d, "yyyy-MM-dd"));
                }} slots={{ day: renderDay }}
                slotProps={{
                  textField: {
                    InputProps: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <CalendarMonthIcon
                            onClick={() => setIsCalendarOpen(true)}
                            sx={{ cursor: "pointer" }}
                          />
                        </InputAdornment>
                      ),
                    },
                    fullWidth: true,
                    variant: "outlined",
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Session Selector */}
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            {filteredSessions.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No sessions available for selected date
              </Typography>
            ) : (
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  overflowX: "auto",
                  paddingBottom: 1,
                  "&::-webkit-scrollbar": { display: "none" },
                }}
              >
                {filteredSessions.map((session) => (
                  <Chip
                    key={session}
                    label={session}
                    onClick={() => handleSessionClick(session)}
                    color={selectedTime === session ? "success" : "default"}
                    sx={{
                      minWidth: 120,
                      justifyContent: "center",
                      ...(selectedTime === session
                        ? {
                          backgroundColor: theme.palette.success.main,
                          color: theme.palette.common.white,
                          "&:hover": {
                            backgroundColor: theme.palette.success.dark,
                          },
                        }
                        : {}),
                    }}
                  />
                ))}
              </Stack>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Row 2 - Table */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : records.length > 0 ? (
        <Paper sx={{ p: 3, borderRadius: "16px", boxShadow: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Sheet Records</Typography>

            {/* Buttons on right */}
            <Box>
              <Button variant="outlined" size="small" sx={{ mr: 1 }} onClick={handleDownloadPDF}>
                Download PDF
              </Button>
              <Button variant="outlined" size="small" onClick={handleDownloadExcel}>
                Download Excel
              </Button>
            </Box>
          </Box>

          <TableContainer sx={{ overflowX: "auto", maxHeight: "350px", overflowY: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 120 }}>Course Code</TableCell>
                  <TableCell sx={{ minWidth: 140 }}>Exam Timing</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>Appeared</TableCell>
                  <TableCell sx={{ minWidth: 100 }}>Absent</TableCell>
                  <TableCell sx={{ minWidth: 80 }}>UMC</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>UMC Extra Sheet</TableCell>
                  <TableCell sx={{ minWidth: 130 }}>New Student</TableCell>
                  <TableCell sx={{ minWidth: 120 }}>Total Sheet</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>Sheet Consumed</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>No. of Packets</TableCell>
                  <TableCell sx={{ minWidth: 170 }}>No. of UMC Packets</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records
                  .filter((item) => item.ExamTiming === selectedTime)
                  .map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.CourseCode}</TableCell>
                      <TableCell>{row.ExamTiming}</TableCell>
                      <TableCell>{row.Appeared}</TableCell>
                      <TableCell>{row.Absent}</TableCell>
                      <TableCell>{row.UMC}</TableCell>
                      <TableCell>{row.UMCExtraSheet}</TableCell>
                      <TableCell>{row.NewStudent}</TableCell>
                      <TableCell>{row.TotalSheet}</TableCell>
                      <TableCell>{row.SheetConsumed}</TableCell>
                      <TableCell>{row.NoOfPacket}</TableCell>
                      <TableCell>{row.NoOfUMCPacket}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Typography variant="body2" sx={{ mt: 2, color: "text.secondary", textAlign: "center" }}>
          No records to display.
        </Typography>
      )}
    </Box>
  );
};

export default ExamSheetConsumption;