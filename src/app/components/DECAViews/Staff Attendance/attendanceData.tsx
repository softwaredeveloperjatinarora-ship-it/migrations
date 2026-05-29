//^ date and time -from  where it will come ( data or user input)
import * as React from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { PropsInterface } from "@/app/api/interfaces/DistanceExamination/staffAttendance";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { TimePicker } from "@mui/x-date-pickers";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxHeight: "90vh",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  overflow: "hidden",
};

const examData = [
  {
    date: "2025-06-02",
    time: "09:30-11:30",
    courses: [
      {
        SrNo: 1,
        CourseCode: "DEENG512",
        "38-901": 15,
        "38-902": 10,
        "38-905": 15,
        Total: 40,
      },
      {
        SrNo: 2,
        CourseCode: "DEECC511",
        "38-901": 10,
        "38-902": 10,
        "38-905": 10,
        Total: 30,
      },
      {
        SrNo: 3,
        CourseCode: "DEPOL512",
        "38-901": 0,
        "38-902": 0,
        "38-905": 0,
        Total: 0,
      },
    ],
  },
  {
    date: "2025-06-03",
    time: "13:00-15:00",
    courses: [
      {
        SrNo: 1,
        CourseCode: "DEENG512",
        "38-901": 12,
        "38-902": 8,
        "38-905": 14,
        Total: 34,
      },
      {
        SrNo: 2,
        CourseCode: "DEECC511",
        "38-901": 9,
        "38-902": 11,
        "38-905": 12,
        Total: 32,
      },
      {
        SrNo: 3,
        CourseCode: "DEPOL512",
        "38-901": 2,
        "38-902": 1,
        "38-905": 3,
        Total: 6,
      },
    ],
  },
  {
    date: "2025-06-04",
    time: "15:30-17:30",
    courses: [
      {
        SrNo: 1,
        CourseCode: "DEENG512",
        "38-902": 18,
        "38-904": 12,
        "38-905": 16,
        Total: 46,
      },
      {
        SrNo: 2,
        CourseCode: "DEECC511",
        "38-901": 8,
        "38-904": 9,
        "38-905": 11,
        Total: 28,
      },
      {
        SrNo: 3,
        CourseCode: "DEPOL512",
        "38-901": 0,
        "38-904": 0,
        "38-905": 0,
        Total: 0,
      },
    ],
  },
];
export default function AttendanceData({ onClose, open }: PropsInterface) {

  const date = examData[0].date;
  const time = examData[0].time;
  const [selectedDate, setSelectedDate] = React.useState(date);
  const [selectedTime, setSelectedTime] = React.useState(time);

  // Merge all courses together
  const filteredCourses = examData
    .filter(
      (entry) => entry.date === selectedDate && entry.time === selectedTime
    )
    .flatMap((entry) => entry.courses as object[]);

  // Get table headers dynamically
  const tableHeaders = filteredCourses.length > 0 ? Object.keys(filteredCourses[0] as object) : [];

  const filteredData = examData.filter((entry) => {
    const dateMatch = entry.date === selectedDate;
    const timeMatch = entry.time === selectedTime;
    return dateMatch && timeMatch;
  });

  return (
    <div>
      <Modal open={open} onClose={onClose} >
        <Box sx={modalStyle}>
          {/* Close icon */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Attendance Summary</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
            <Box
            display="flex"
            gap={2}
            mb={3}
            flexWrap="wrap"
            alignItems="center"
          >
          {/* add here logic here ( onchange and state ) */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                // onChange={(newValue) => {
                //   if (newValue) {
                //     setFormData((prev) => ({
                //       ...prev,
                //       examDate: format(newValue, 'yyyy-MM-dd'),
                //     }));
                //   }
                // }}
                name="examDate"
                label="Select Exam Date"
                // value={formData.examDate ? parse(formData.examDate, 'yyyy-MM-dd', new Date()) : null}
                slotProps={{
                  textField: {
                    size: 'small',
                  },
                }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                // onChange={(newValue) => {
                //   if (newValue) {
                //     setFormData((prev) => ({
                //       ...prev,
                //       examDate: format(newValue, 'yyyy-MM-dd'),
                //     }));
                //   }
                // }}
                name="examDate"
                label="Select Exam Date"
                // value={formData.examDate ? parse(formData.examDate, 'yyyy-MM-dd', new Date()) : null}
                slotProps={{
                  textField: {
                    size: 'small',
                  },
                }}
              />
            </LocalizationProvider>
        
            {/* Date input */}

            {/* <TextField
              label="Select Date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              size="small"
              sx={{ minWidth: 150 }}
            /> */}

            {/* Time input */}
            {/* <TextField
              label="Time Range"
              placeholder="09:30-11:30"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              size="small"
              sx={{ minWidth: 150 }}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              type="time"
            /> */}
            <Button variant="contained">Show</Button>
          </Box>
          {filteredCourses.length > 0 ? (
            <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {tableHeaders.map((key) => (
                      <TableCell key={key}>
                        <strong>{key}</strong>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCourses.map((row, index) => (
                    <TableRow key={index}>
                      {tableHeaders.map((key) => (
                        <TableCell key={key}>
                          {(row as Record<string, any>)[key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No attendance data found.</Typography>
          )}
        </Box>
      </Modal>
    </div>
  );
}
