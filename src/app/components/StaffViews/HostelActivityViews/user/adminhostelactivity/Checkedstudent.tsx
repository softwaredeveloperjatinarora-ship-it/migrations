


// "use client";
// import React, { useMemo, useState } from "react";
// import {
//   Accordion,
//   AccordionDetails,
//   AccordionSummary,
//   Alert,
//   Box,
//   Button,
//   CardContent,
//   Grid,
//   LinearProgress,
//   Menu,
//   MenuItem,
//   Snackbar,
//   Stack,
//   Typography,
//   useTheme,
//   useMediaQuery,
//   IconButton,
//   Switch
// } from "@mui/material";
// import { IconBuildings, IconDownload } from "@tabler/icons-react";
// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import ExcelJS from "exceljs";
// import { ApexOptions } from "apexcharts";
// import dynamic from "next/dynamic";
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
// import CustomSwitch from "@/app/components/forms/theme-elements/CustomSwitch";

// const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// interface CheckedstudentProps {
//   checkedStudents: any[];
//   onUpdateStudents: (students: any[]) => void;
// }

// const Checkedstudent = ({ checkedStudents, onUpdateStudents }: CheckedstudentProps) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const [uploadSuccess, setUploadSuccess] = useState(false);
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [expandedAccordions, setExpandedAccordions] = useState<Record<string, boolean>>({});
//   const open = Boolean(anchorEl);
//   const [submitSuccess, setSubmitSuccess] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const primary = theme.palette.primary.main;
//   const primarylight = theme.palette.primary.light;

//   const groupedByHostel = useMemo(() => {
//     const map: Record<string, any[]> = {};
//     checkedStudents.forEach((student) => {
//       const hostel = student?.hostel?.trim() || "Unknown";
//       if (!map[hostel]) map[hostel] = [];
//       map[hostel].push(student);
//     });
//     return map;
//   }, [checkedStudents]);

//   const hostelAverages = useMemo(() => {
//     const averages: Record<string, number> = {};
//     Object.keys(groupedByHostel).forEach(hostel => {
//       const students = groupedByHostel[hostel];
//       const total = students.reduce((sum, student) => sum + (Number(student.att) || 0), 0);
//       averages[hostel] = Math.round(total / (students.length || 1));
//     });
//     return averages;
//   }, [groupedByHostel]);

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(18);
//     doc.text('Checked Students Report', 14, 22);
//     doc.setFontSize(12);
//     doc.text(`Total Students: ${checkedStudents.length}`, 14, 30);

//     const headers = [['Name', 'Registration', 'Hostel', 'Attendance (%)','MeetingdDate','AuthorizePerson']];
//     const data = checkedStudents.map(student => [
//       student.name,
//       student.regd,
//       student.hostel,
//       `${student.att}%`,
//       student.selectedDate,
//       student.selectedPerson,

//     ]);

//     autoTable(doc, {
//       head: headers,
//       body: data,
//       startY: 35,
//       theme: 'grid',
//       headStyles: {
//         fillColor: [41, 128, 185],
//         textColor: 255,
//         fontStyle: 'bold'
//       },
//       alternateRowStyles: {
//         fillColor: [245, 245, 245]
//       },
//       margin: { top: 30 }
//     });

//     doc.save('checked_students.pdf');
//     setUploadSuccess(true);
//     setAnchorEl(null);
//   };

//   const handleDownloadExcel = async () => {
//     if (!checkedStudents || checkedStudents.length === 0) return;

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("Checked Students");

//     worksheet.columns = [
//       { header: "Name", key: "name", width: 30 },
//       { header: "Registration", key: "regd", width: 15 },
//       { header: "Hostel", key: "hostel", width: 20 },
//       { header: "Attendance (%)", key: "att", width: 15 },
//       { header: "MeetingdDate", key: "selectedDate", width: 15 },
//       { header: "AuthorizePerson", key: "selectedPerson", width: 30 },

//     ];

//     checkedStudents.forEach(student => {
//       worksheet.addRow({
//         name: student.name,
//         regd: student.regd,
//         hostel: student.hostel,
//         att: student.att,
//         selectedPerson:student.selectedPerson,
//         selectedDate: student.selectedDate,

//       });
//     });

//     // Style header row
//     worksheet.getRow(1).eachCell(cell => {
//       cell.font = { bold: true };
//       cell.fill = {
//         type: 'pattern',
//         pattern: 'solid',
//         fgColor: { argb: '808080' }
//       };
//       cell.alignment = { horizontal: 'center' };
//     });

//     const buffer = await workbook.xlsx.writeBuffer();
//     const blob = new Blob([buffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "checked_students.xlsx";
//     a.click();
//     window.URL.revokeObjectURL(url);

//     setUploadSuccess(true);
//     setAnchorEl(null);
//   };

//   const handleRemoveStudent = (regd: string) => {
//     onUpdateStudents(checkedStudents.filter(s => s.regd !== regd));
//   };

//   const getChartOptions = (attendance: number): ApexOptions => {
//     let mainColor;
//     if (attendance > 80) {
//       mainColor = theme.palette.success.main;
//     } else if (attendance >= 50) {
//       mainColor = theme.palette.warning.main;
//     } else {
//       mainColor = "#FF4D4D";
//     }

//     return {
//       chart: {
//         type: "donut",
//         fontFamily: "'Plus Jakarta Sans', sans-serif;",
//         toolbar: { show: false },
//         height: 100,
//       },
//       labels: ["Attend", "Non-Attend"],
//       colors: [mainColor, primarylight, "#F9F9FD"],
//       plotOptions: {
//         pie: {
//           donut: {
//             size: "83%",
//             background: "transparent",
//             labels: {
//               show: true,
//               name: { show: true, offsetY: 7 },
//               value: { show: false },
//               total: {
//                 show: true,
//                 color: theme.palette.mode === "dark" ? "white" : "black",
//                 fontSize: "8px",
//                 fontWeight: "600",
//                 label: `${attendance}%`,
//               },
//             },
//           },
//         },
//       },
//       dataLabels: { enabled: false },
//       stroke: { show: false },
//       legend: { show: false },
//       tooltip: {
//         theme: theme.palette.mode === "dark" ? "dark" : "light",
//         fillSeriesColor: false,
//       },
//     };
//   };

//   const getChartSeries = (attendance: number) => {
//     return [attendance ?? 0, 100 - (attendance ?? 0)];
//   };

//   const handleSubmit = async () => {
//     if (checkedStudents.length === 0) return;

//     setIsSubmitting(true);
//     try {
//       // Here you would typically make an API call to submit the data
//       // For example:
//       // const response = await fetch('/api/submit-attendance', {
//       //   method: 'POST',
//       //   headers: {
//       //     'Content-Type': 'application/json',
//       //   },
//       //   body: JSON.stringify({ students: checkedStudents }),
//       // });

//       // Simulate API call with timeout
//       await new Promise(resolve => setTimeout(resolve, 1500));

//       // If using real API:
//       // if (!response.ok) throw new Error('Submission failed');

//       setSubmitSuccess(true);
//       console.log('Submitted students:', checkedStudents

//       );
//     } catch (error) {
//       console.error('Error submitting data:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };


//   return (
//     <Box>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//         <Typography variant="h6" gutterBottom>
//           Checked Students ({checkedStudents.length})
//         </Typography>

//         {checkedStudents.length > 0 && (
//           <>
//             <IconButton 
//               color="primary"
//               sx={{
//                 py: 0.5,
//                 fontSize: "0.75rem",
//                 whiteSpace: "nowrap",
//                 marginBottom: 2,
//               }}
//               onClick={(e) => setAnchorEl(e.currentTarget)}
//             >
//               <IconDownload width={22} />
//             </IconButton>

//             <Menu
//               anchorEl={anchorEl}
//               open={open}
//               onClose={() => setAnchorEl(null)}
//               anchorOrigin={{
//                 vertical: "bottom",
//                 horizontal: "right",
//               }}
//               transformOrigin={{
//                 vertical: "top",
//                 horizontal: "right",
//               }}
//             >
//               <MenuItem onClick={handleDownloadPDF}>Download PDF</MenuItem>
//               <MenuItem onClick={handleDownloadExcel}>Download Excel</MenuItem>
//             </Menu>
//           </>
//         )}
//       </Box>

//       {checkedStudents.length === 0 ? (
//         <Box sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           height: "100%",
//           textAlign: "center",
//           py: 4,
//           px: 2,
//         }}>
//           <AccountCircleIcon sx={{ fontSize: 60, color: "#9e9e9e", mb: 2 }} />
//           <Typography variant="h6" color="textSecondary" fontWeight="bold">
//             No Student Found
//           </Typography>
//           <Typography variant="body2" color="text.secondary" mt={1}>
//             You currently don't have any student checked.
//           </Typography>
//         </Box>
//       ) : (
//         <Scrollbar sx={{ height: "calc(100vh - 180px)" }}>
//           {Object.entries(groupedByHostel).map(([hostel, students]) => (
//             <Accordion 
//               key={hostel} 
//               sx={{ mb: 2 }}
//               expanded={expandedAccordions[hostel] || false}
//               onChange={(_, isExpanded) => setExpandedAccordions(prev => ({
//                 ...prev,
//                 [hostel]: isExpanded
//               }))}
//             >
//               <AccordionSummary>
//                 <Box sx={{
//                   width: "100%",
//                   display: "flex",
//                   flexDirection: isMobile ? "column" : "row",
//                   justifyContent: "space-between",
//                   alignItems: isMobile ? "flex-start" : "center",
//                   px: 2,
//                   gap: isMobile ? 1 : 0
//                 }}>
//                   <Typography variant="h6" sx={{ 
//                     display: "flex", 
//                     alignItems: "center", 
//                     fontSize: isMobile ? "0.875rem" : "0.9375rem",
//                     mb: isMobile ? 1 : 0
//                   }}>
//                     <IconBuildings size={16} style={{ marginRight: 6 }} />
//                     {hostel.toUpperCase()} ({students.length})
//                   </Typography>

//                   <Box sx={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     flexGrow: isMobile ? 0 : 1,
//                     width: isMobile ? "100%" : "auto",
//                     maxWidth: isMobile ? "100%" : 300,
//                     gap: 1,
//                     mx: isMobile ? 0 : 2,
//                   }}>
//                     <LinearProgress 
//                       variant="determinate"
//                       value={hostelAverages[hostel]}
//                       color={
//                         hostelAverages[hostel] > 80 ? "success" :
//                         hostelAverages[hostel] > 50 ? "warning" : "error"
//                       }
//                       sx={{
//                         height: 6,
//                         width: '100%',
//                         borderRadius: 3,
//                         backgroundColor: theme.palette.grey[200],
//                       }}
//                     />
//                     <Typography variant="caption" sx={{ 
//                       minWidth: 40,
//                       textAlign: isMobile ? "right" : "left"
//                     }}>
//                       {hostelAverages[hostel]}%
//                     </Typography>
//                   </Box>
//                 </Box>
//               </AccordionSummary>

//               <AccordionDetails>
//                 <Grid container spacing={2}>
//                   {students.map((student) => (
//                     <Grid size={{xs:12,sm:6,md:4,lg:3}} key={`${student.hostel}-${student.regd}`}>
//                       <Box sx={{
//                         transition: "all 0.2s ease-in-out",
//                         "&:hover": {
//                           transform: "scale(1.01)",
//                           boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
//                         },
//                       }}>
//                         <CardContent>
//                           <Stack direction="row" spacing={2} alignItems="center">
//                             <Box width="100%">
//                               <Box display="flex" justifyContent="space-between">
//                                 <Typography variant="h6" noWrap>
//                                   {student.name}
//                                 </Typography>

//                               </Box>
//                               <br />
//                               <Box display="flex" justifyContent="space-between" alignItems="center">
//                                 <Typography variant="caption">RegNo: {student.regd}</Typography>
//                                 <Box sx={{ width: 80 }}>
//                                   <Chart
//                                     options={getChartOptions(student.att)}
//                                     series={getChartSeries(student.att)}
//                                     type="donut"
//                                     width="60%"
//                                     height={60}
//                                   />
//                                 </Box>



//                               </Box>
//                             </Box>
//                           </Stack>
//                         </CardContent>
//                       </Box>
//                     </Grid>
//                   ))}
//                 </Grid>
//               </AccordionDetails>
//             </Accordion>
//           ))}
//         </Scrollbar>
//       )}
//   {checkedStudents.length > 0 && (
//         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSubmit}
//                 disabled={isSubmitting}
//                 sx={{ minWidth: 120 }}
//               >
//                 {isSubmitting ? 'Submitting...' : 'Submit'}
//               </Button>
//             </Box>
//   )}
//             <Snackbar
//               open={submitSuccess}
//               autoHideDuration={3000}
//               onClose={() => setSubmitSuccess(false)}
//               anchorOrigin={{ vertical: "top", horizontal: "center" }}
//             >
//               <Alert severity="success" sx={{ width: "100%" }}>
//                 submitted successfully!
//               </Alert>
//             </Snackbar>

//       <Snackbar
//         open={uploadSuccess}
//         autoHideDuration={3000}
//         onClose={() => setUploadSuccess(false)}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert severity="success" sx={{ width: "100%" }}>
//           Report downloaded successfully!
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default Checkedstudent;





"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Badge,
  Box,
  Chip,
  Grid,
  TextField,
  InputAdornment,
  Checkbox,
  CircularProgress,
  Stack,
  Typography,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  useTheme,
  LinearProgress,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  styled,
  FormHelperText,
  Tooltip,
  Snackbar,
  Alert,
  SelectChangeEvent,
  OutlinedInput,
  ListItemText,
  Menu,
  IconButton,
} from "@mui/material";

import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { IconBuildings, IconChevronDown, IconDownload } from "@tabler/icons-react";

import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import { useSession } from "next-auth/react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, isValid, parse } from "date-fns";
import * as yup from "yup";
import SearchIcon from "@mui/icons-material/Search";

import ExcelJS from "exceljs";
import { Theme } from '@mui/material/styles';

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { gethostelactivityadmincheckedAction } from "@/app/actions/StaffActions/hostalActivityAction/admin/getadmincheckedAction";
interface Student {
  id: number;
  regd
  : string;
  name: string;
  att: string;
  hostelAttendance: string;

  deliveredLecture: string;
  attendace: "Present" | "Absent";
  attendaceOn: string;
  isConnectedWithParents: "yes" | "no";
  connectedWith: string | null;
  mobileNumber: string | null;
  discussionWithParents: string | null;
  finalFeedBack: string | null;
  absentReason: string | null;
  isCounsellingRequired: "yes" | "no";
  hostel?: string;
}


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


const muiColors = ["primary", "secondary", "success", "warning", "error", "info"] as const;
const BATCH_SIZE = 10;

// Validation schema
const validationSchema = yup.object().shape({
  selectedDate: yup
    .date()
    .required("Date is required")
    .typeError("Please enter a valid date in DD/MM/YYYY format"),
  selectedPerson: yup
    .array()
    .of(yup.string().required())
    .min(1, 'Please select at least one person')
    .required('Person selection is required'),
});

interface HostelActivityDetailsProps {
  onDataFetched: (data: any[]) => void;
  onCheckedStudentsUpdate: (students: any[]) => void;
  initialCheckedStudents: any[];
}

interface FormErrors {
  selectedDate?: string;
  selectedPerson?: string;
}

const Checkedstudent = ({ onDataFetched }: any) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [filtering, setFiltering] = useState(false);
  const [checkedStudents, setCheckedStudents] = useState<any[]>([]);
  const [hostelChecked, setHostelChecked] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [profiles, setHostel] = useState<any[]>([]);
  const [authority, setauthority] = useState<any[]>([]);
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});
  const isDataFetched = useRef(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession();
  const [expandedAccordions, setExpandedAccordions] = useState<Record<string, boolean>>({});
  const [fullDataHostels, setFullDataHostels] = useState<Record<string, boolean>>({});
  const [attendanceFilter, setAttendanceFilter] = useState<string | null>(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [isRotating, setIsRotating] = React.useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedPerson, setSelectedPerson] = React.useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [dateInputValue, setDateInputValue] = useState<string>("");
  const [validationSuccess, setValidationSuccess] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      if (isDataFetched.current) return;
      setLoading(true);
      try {
        const response = await gethostelactivityadmincheckedAction();
        // const reposeauthrity = await gethostelauthorityAction();
        const token = String(session?.user?.token).split("NEXT2121ANG")[1];
        if (response.status === "success") {
          const decrypted = decryptDataforResponse(response.ApiData, token);
          // const decryptedauthority = decryptDataforResponse(reposeauthrity.ApiData, token);
          // const parsed1 = JSON.parse(decryptedauthority);
          // console.log("Fetched Authority Data:", parsed1);
          // setauthority(parsed1);
          const parsed = JSON.parse(decrypted);
          console.log(" adminchecked:", parsed);
          setHostel(parsed);
          onDataFetched?.(parsed);
          const total = parsed.reduce((sum: number, hostel: any) => {
            return sum + (hostel.students?.length || 0);
          }, 0);
          setTotalStudents(total);
          const initialCounts: Record<string, number> = {};
          parsed.forEach((profile: any) => {
            initialCounts[profile.hostel] = BATCH_SIZE;
          });
          setVisibleCounts(initialCounts);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
        isDataFetched.current = true;
      }
    };
    fetchData();
  }, [onDataFetched, session]);


  // Validate form when selectedDate or selectedPerson changes
  useEffect(() => {
    validateForm();
  }, [selectedDate, selectedPerson]);

  // Update checked students when selectedDate or selectedPerson changes
  useEffect(() => {
    if (checkedStudents.length > 0) {
      const updatedStudents = checkedStudents.map((student) => ({
        ...student,
        selectedDate: dateInputValue,
        selectedPerson: selectedPerson,
        // Update attendance status based on toggle

      }));
      setCheckedStudents(updatedStudents);
    }
  }, [selectedDate, selectedPerson]);

  const validateForm = async () => {
    try {
      await validationSchema.validate(
        {
          selectedDate,
          selectedPerson,
        },
        { abortEarly: false }
      );
      setFormErrors({});
      setValidationSuccess(true);
      return true;
    } catch (err: any) {
      const errors: FormErrors = {};
      err.inner.forEach((error: yup.ValidationError) => {
        errors[error.path as keyof FormErrors] = error.message;
      });
      setFormErrors(errors);
      setValidationSuccess(false);
      return false;
    }
  };

  const dynamicColors = useMemo(() => {
    const map: Record<string, (typeof muiColors)[number]> = {};
    profiles.forEach((profile, index) => {
      map[profile.hostel] = muiColors[index % muiColors.length];
    });
    return map;
  }, [profiles]);

  // const handleChipClick = (category: string) => {
  //   setSelectedCategory((prev) => (prev === category ? null : category));
  //   setSearch("");
  //   setFiltering(true);
  //   setExpandedAccordions((prev) => ({ ...prev, [category]: true }));
  //   setFullDataHostels((prev) => ({ ...prev, [category]: true }));
  //   setTimeout(() => {
  //     resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  //     setFiltering(false);
  //   }, 300);
  // };


  const getUniqueHostelId = (hostel: string, dutyperson: string, sessionOn: string) => {
    return `${hostel}-${dutyperson}-${sessionOn}`;
  };

  const handleChipClick = (uniqueHostelId: string) => {
    setSelectedCategory((prev) => (prev === uniqueHostelId ? null : uniqueHostelId));
    setSearch("");
    setFiltering(true);
    setExpandedAccordions((prev) => ({ ...prev, [uniqueHostelId]: true }));
    setFullDataHostels((prev) => ({ ...prev, [uniqueHostelId]: true }));
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setFiltering(false);
    }, 300);
  };

  const handleAccordionChange = (uniqueHostelId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordions((prev) => ({ ...prev, [uniqueHostelId]: isExpanded }));
  };


  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const searchValue = e.target.value;
  //   setSearch(searchValue);
  //   setFiltering(true);
  //   // Expand accordions that have matching results
  //   if (searchValue.trim()) {
  //     const matchingHostels: Record<string, boolean> = {};
  //     profiles.forEach((profile) => {
  //       const hasMatch = profile.students.some((s: any) => {
  //         const nameMatch = s.name?.toLowerCase().includes(searchValue.toLowerCase());
  //         const regdMatch = String(s.regd || "").includes(searchValue);
  //         return nameMatch || regdMatch;
  //       });
  //       if (hasMatch) matchingHostels[profile.hostel] = true;
  //     });
  //     setExpandedAccordions(matchingHostels);
  //   } else {
  //     // If search is empty, close all accordions or keep some open as per your preference
  //     setExpandedAccordions({});
  //   }
  //   setTimeout(() => {
  //     resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  //     setFiltering(false);
  //   }, 300);
  // };
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const searchValue = e.target.value;
  setSearch(searchValue);
  setFiltering(true);

  if (searchValue.trim()) {
    const matchingHostels: Record<string, boolean> = {};
    profiles.forEach((profile) => {
      const uniqueHostelId = getUniqueHostelId(profile.hostel, profile.dutyperson, profile.sessionOn);
      
      const hasMatch = profile.students.some((s: any) => {
        const nameMatch = s.name?.toLowerCase().includes(searchValue.toLowerCase());
        const regdMatch = String(s.regd || "").includes(searchValue);
        return nameMatch || regdMatch;
      });
      
      if (hasMatch) matchingHostels[uniqueHostelId] = true; // Use unique ID here
    });
    setExpandedAccordions(matchingHostels);
  } else {
    setExpandedAccordions({});
  }
  
  setTimeout(() => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setFiltering(false);
  }, 300);
};

  const filteredProfiles = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();
    return profiles
      .filter((profile) => {
        if (!selectedCategory) return true;
        const uniqueId = getUniqueHostelId(profile.hostel, profile.dutyperson, profile.sessionOn);
        return uniqueId === selectedCategory;
      })
      .map((profile) => {
        const uniqueId = getUniqueHostelId(profile.hostel, profile.dutyperson, profile.sessionOn);
        const hostelMatch = profile.hostel?.toLowerCase().includes(lowerSearch);
        const filteredStudents = profile.students?.filter((s: any) => {
          const nameMatch = s.name?.toLowerCase().includes(lowerSearch);
          const regdMatch = String(s.regd || "").toLowerCase().includes(lowerSearch);
          const attendance = Number(s.current_Attendance) || 0;
          let attendanceMatch = true;
          if (attendanceFilter === "lt20") attendanceMatch = attendance < 20;
          else if (attendanceFilter === "lt30") attendanceMatch = attendance < 30;
          else if (attendanceFilter === "gt40") attendanceMatch = attendance > 40;
          return (nameMatch || regdMatch || hostelMatch) && attendanceMatch;
        });
        return { ...profile, uniqueId, students: filteredStudents };
      })
      .filter((p) => p.students && p.students.length > 0);
  }, [search, profiles, selectedCategory, attendanceFilter]);

  const handleAttendanceFilter = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: string | null
  ) => {
    setAttendanceFilter(newFilter);
    setFiltering(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setFiltering(false);
    }, 300);
  };

  const chipCounts = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();
    return profiles.reduce((acc, profile) => {
      // Create unique key combining hostel, dutyperson, and sessionOn
      const uniqueKey = `${profile.hostel}-${profile.dutyperson}-${profile.sessionOn}`;

      const count = profile.students.filter((s: any) => {
        const nameMatch = s.name?.toLowerCase().includes(lowerSearch);
        const regdMatch = String(s.registerationNumber || "").toLowerCase().includes(lowerSearch);
        const hostelMatch = profile.hostel?.toLowerCase().includes(lowerSearch);
        return nameMatch || regdMatch || hostelMatch;
      }).length;

      acc[uniqueKey] = count;
      return acc;
    }, {} as Record<string, number>);
  }, [profiles, search]);


  // const filteredProfiles = useMemo(() => {
  //   const lowerSearch = search.trim().toLowerCase();
  //   return profiles
  //     .filter((profile) => !selectedCategory || profile.hostel === selectedCategory)
  //     .map((profile) => {
  //       const hostelMatch = profile.hostel?.toLowerCase().includes(lowerSearch);
  //       const filteredStudents = profile.students?.filter((s: any) => {
  //         const nameMatch = s.name?.toLowerCase().includes(lowerSearch);
  //         const regdMatch = String(s.regd || "").toLowerCase().includes(lowerSearch);
  //         const attendance = Number(s.att) || 0;
  //         // Apply attendance filter if selected
  //         let attendanceMatch = true;
  //         if (attendanceFilter === "lt20") attendanceMatch = attendance < 20;
  //         else if (attendanceFilter === "lt30") attendanceMatch = attendance < 30;
  //         else if (attendanceFilter === "gt40") attendanceMatch = attendance > 40;
  //         return (nameMatch || regdMatch || hostelMatch) && attendanceMatch;
  //       });
  //       return { ...profile, students: filteredStudents };
  //     })
  //     .filter((p) => p.students && p.students.length > 0);
  // }, [search, profiles, selectedCategory, attendanceFilter]);


  // const chipCounts = useMemo(() => {
  //   const lowerSearch = search.trim().toLowerCase();
  //   return profiles.reduce((acc, profile) => {
  //     const count = profile.students.filter((s: any) => {
  //       const nameMatch = s.name?.toLowerCase().includes(lowerSearch);
  //       const regdMatch = String(s.regd || "").toLowerCase().includes(lowerSearch);
  //       const hostelMatch = profile.hostel?.toLowerCase().includes(lowerSearch);
  //       return nameMatch || regdMatch || hostelMatch;
  //     }).length;
  //     acc[profile.hostel] = count;
  //     return acc;
  //   }, {} as Record<string, number>);
  // }, [profiles, search]);

  // const handleAccordionChange = (hostel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
  //   setExpandedAccordions((prev) => ({ ...prev, [hostel]: isExpanded }));
  // };


  const handleDateChange = (newValue: Date | null, context?: any) => {
    setSelectedDate(newValue);
    setDateInputValue(newValue ? format(newValue, "dd/MM/yyyy") : "");
  };



  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;




  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };


  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownloadPDF = () => {
    handleClose();
    downloadPDF();
  };

  const handleDownloadExcel = () => {
    handleClose();
    handleExport();
  };

  const flattenStudentsData = (profiles: any[]) => {
    if (!profiles || profiles.length === 0) return [];

    return profiles.flatMap(profile =>
      profile.students?.map((student: Student) => ({
        'Registration Number': student.regd || 'N/A',
        'Student Name': student.name || 'N/A',
        'Hostel': profile.hostel || 'N/A',
        'Current Attendance (%)': student.att || '0',
        'Hostel Attendance (%)': student.hostelAttendance || '0',
        'Delivered Lectures': student.
          deliveredLecture || '0',
        'Attendance Status': student.attendace || 'N/A',
        'Attendance Date': formatDate(student.attendaceOn),
        'Absent Reason': student.absentReason || 'N/A',
        'Connected with Parents': student.isConnectedWithParents || 'N/A',
        'Connected With': student.connectedWith || 'N/A',
        'Mobile Number': student.mobileNumber || 'N/A',
        'Discussion with Parents': student.discussionWithParents || 'N/A',
        'Final Feedback': student.finalFeedBack || 'N/A',
        'Counselling Required': student.isCounsellingRequired || 'N/A',
        'Session Date': formatDate(profile.sessionOn),
        'Duty Person': profile.dutyperson || 'N/A'
      })) || []
    );
  };

  const downloadPDF = () => {
    if (!profiles || profiles.length === 0) return;

    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();

    doc.setFontSize(16);
    doc.text("Student Session Allocated Report", 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${currentDate} | Total Students: ${totalStudents}`, 14, 30);

    const flattenedData = flattenStudentsData(profiles);

    const headers = [
      'Reg No', 'Name', 'Hostel',
      'Current Att(%)', 'Hostel Att(%)', 'Lectures',
      'Session Date', 'Duty Person'
    ];

    const data = flattenedData.map(student => [
      student['Registration Number'],
      student['Student Name'],
      student['Hostel'],

      student['Current Attendance (%)'],
      student['Hostel Attendance (%)'],
      student['Delivered Lectures'],

      student['Session Date'],
      student['Duty Person']
    ]);

    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 8 }
    });

    doc.save(`Student Session Allocated Report-${currentDate.replace(/\//g, '-')}.pdf`);
    setUploadSuccess(true);
    setAnchorEl(null);
  };

  const handleExport = async () => {
    if (!profiles || profiles.length === 0) return;

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Student Session Allocated Report");

      const headers = [
        'Registration Number', 'Student Name', 'Hostel', 'Current Attendance (%)',
        'Hostel Attendance (%)', 'Delivered Lectures',
        'Session Date', 'Duty Person'
      ];

      worksheet.addRow(headers);

      // Style header
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
      headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2B78E4' } };

      // Add data
      const flattenedData = flattenStudentsData(profiles);
      flattenedData.forEach(student => {
        worksheet.addRow(headers.map(header => student[header]));
      });

      // Auto-fit columns
      worksheet.columns.forEach(column => {
        column.width = 15;
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Student Session Allocated Report-${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);

      setUploadSuccess(true);
      setAnchorEl(null);
    } catch (error) {
      console.error('Error generating Excel file:', error);
      setSnackbarMessage('Error generating Excel file');
      setSnackbarOpen(true);
    }
  };





  return (
    <Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {/* Hostel Chips */}
          <Box p={2}>
            <Grid container spacing={2}>
              {
                profiles.map(({ hostel, dutyperson, sessionOn }) => {
                  const uniquehostelId = `${hostel}-${dutyperson}-${sessionOn}`;
                  const count = chipCounts[uniquehostelId] || 0;
                  return (
                    <Grid key={uniquehostelId}>
                      {/* <Badge
                      badgeContent={count}
                      max={100000}
                      color={dynamicColors[hostel] || "default"}
                    >
                      <Chip
                        icon={<IconBuildings size={16} />}
                        label={hostel.toUpperCase()}
                        onClick={() => {
                          handleChipClick(hostel);
                          setFullDataHostels((prev) => ({ ...prev, [hostel]: true }));
                        }}
                        sx={{
                          minWidth: 100,
                          height: 35,
                          backgroundColor:
                            selectedCategory === hostel
                              ? `${dynamicColors[hostel]}.main`
                              : `${dynamicColors[hostel]}.light`,
                          color: selectedCategory === hostel ? "white" : "",
                          fontWeight: "bold",
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: `${dynamicColors[hostel]}.dark`,
                            color: "white",
                          },
                        }}
                      />
                    </Badge> */}

                      <Badge
                        badgeContent={count}
                        max={100000}
                        color={dynamicColors[hostel] || "default"}
                      >
                        <Tooltip title={`Duty: ${dutyperson} | Session: ${formatDate(sessionOn)}`}>
                          <Chip
                            icon={<IconBuildings size={16} />}
                            label={hostel.toUpperCase()}
                            onClick={() => handleChipClick(uniquehostelId)}
                            sx={{
                              minWidth: 100,
                              height: 35,
                              backgroundColor:
                                selectedCategory === uniquehostelId
                                  ? `${dynamicColors[hostel]}.main`
                                  : `${dynamicColors[hostel]}.light`,
                              color: selectedCategory === uniquehostelId ? "white" : "",
                              fontWeight: "bold",
                              cursor: "pointer",
                              "&:hover": {
                                backgroundColor: `${dynamicColors[hostel]}.dark`,
                                color: "white",
                              },
                            }}
                          />
                        </Tooltip>
                      </Badge>
                    </Grid>
                  );
                })}
            </Grid>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex">
              <Typography variant="h6" sx={{ p: 2, fontWeight: "bold", fontSize: 12 }}>
                Total Students :{totalStudents}
              </Typography>
              <Typography variant="h6" sx={{ p: 2, fontWeight: "bold", fontSize: 12 }}>
                Total Hostel :{profiles.length}
              </Typography>
            </Box>
            <Box  >
              {profiles.length > 0 && (
                <>
                  <IconButton
                    color="primary"
                    sx={{ py: 0.5, fontSize: "0.75rem", mb: 2 }}
                    onClick={handleClick}
                  >
                    <IconDownload width={22} />
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem onClick={downloadPDF}>  {/* Changed from handleDownloadPDF */}
                      Download PDF
                    </MenuItem>
                    <MenuItem onClick={handleExport}>  {/* Changed from handleDownloadExcel */}
                      Download Excel
                    </MenuItem>
                  </Menu>

                  <Snackbar
                    open={uploadSuccess}
                    autoHideDuration={3000}
                    onClose={() => setUploadSuccess(false)}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                  >
                    <Alert severity="success" sx={{ width: "100%" }}>
                      Report downloaded successfully!
                    </Alert>
                  </Snackbar>
                </>
              )}
            </Box>
          </Box>

          {/* Search & Reset */}
          <Grid container justifyContent="flex-end" spacing={1} sx={{ p: 2 }}>
            <Grid>
              <TextField
                label="Search by hostel, name or reg. no."
                variant="outlined"
                size="small"
                sx={{ width: 250 }}
                value={search}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid>
              <Chip
                icon={
                  <RestartAltIcon
                    sx={{
                      animation: isRotating ? "spin 1s linear infinite" : "none",
                      "@keyframes spin": {
                        "0%": {
                          transform: "rotate(0deg)",
                        },
                        "100%": {
                          transform: "rotate(360deg)",
                        },
                      },
                    }}
                  />
                }

                color="error"
                clickable
                onClick={() => {
                  setIsRotating(true);
                  setSearch("");
                  setAttendanceFilter(null);
                  setSelectedCategory(null);
                  setCheckedStudents([]);
                  setHostelChecked({});
                  setSelectedDate(null);
                  setSelectedPerson([]);
                  setDateInputValue("");
                  setFormErrors({});
                  setShowFieldErrors(false);
                  setExpandedAccordions({});
                  // When all operations are done (you might need to adjust timing)
                  setTimeout(() => {
                    resultsRef.current?.scrollIntoView({ behavior: "smooth" });
                    setIsRotating(false); // Stop rotation
                  }, 1000); // Adjust this duration as needed
                }}
              />
            </Grid>
          </Grid>

          {/* Accordion Display */}




          {filtering ? (
            <Box display="flex" justifyContent="center" alignContent="center">
              <CircularProgress />
            </Box>
          ) : (
            <div ref={resultsRef}>
              {filteredProfiles.length === 0 ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  minHeight="200px"
                  flexDirection="column"
                  sx={{ p: 3 }}
                >
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    No data found
                  </Typography>
                  <Typography variant="body2" color="textSecondary" textAlign="center">
                    {search.trim() ?
                      `No students match your search for "${search}"` :
                      'No students available for the selected criteria'
                    }
                  </Typography>
                </Box>
              ) : (
                <div ref={resultsRef}>
                  <Scrollbar sx={{ height: "440px" }}>
                    {filteredProfiles.map(({ hostel, students, hostelId, dutyperson, sessionOn, uniqueId }) => (
                      <Accordion
                        key={uniqueId}
                        sx={{
                          transition: "all 0.2s ease-in-out",
                          boxShadow: "0 2px 10px rgba(122, 112, 112, 0.08)",
                          "&:hover": {
                            transform: "scale(1.01)",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                          },
                        }}
                        disableGutters
                        expanded={expandedAccordions[uniqueId] || false}
                        onChange={handleAccordionChange(uniqueId)}
                      >
                        <AccordionSummary expandIcon={<IconChevronDown />}>
                          <Box
                            sx={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{ display: "flex", alignItems: "center", fontSize: "12px" }}
                            >
                              <IconBuildings size={16} style={{ marginRight: 6 }} />
                              {hostel.toUpperCase()}
                            </Typography>
                            <Typography variant="caption" sx={{ display: "block", fontWeight: "bold" }}>
                              Session: {formatDate(sessionOn)} | Duty Person: {dutyperson || "N/A"}
                            </Typography>



                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            {students
                              .slice(
                                0,
                                fullDataHostels[hostel]
                                  ? students.length
                                  : visibleCounts[hostel] || BATCH_SIZE
                              )
                              .map((student: any, index: number) => {
                                // Dynamic chart configuration for each student
                                const studentAttendance = Number(student.att) || 0;
                                const hostelAttendance = Number(student.hostelAttendance) || 0;
                                const mainColor =
                                  studentAttendance > 80
                                    ? theme.palette.success.main
                                    : studentAttendance >= 50
                                      ? theme.palette.warning.main
                                      : "#FF4D4D";
                                const hostelattenColor =
                                  hostelAttendance > 80
                                    ? theme.palette.success.main
                                    : hostelAttendance >= 50
                                      ? theme.palette.warning.main
                                      : "#FF4D4D";


                                const uniqueId = `${hostel}-${student.regd}-${index}-${hostel.dutyperson}-${hostel.sessionOn}`;
                                const isChecked = checkedStudents.some((s) => s.regd === student.regd);

                                const optionscolumnchart: ApexOptions = {
                                  chart: {
                                    type: "donut",
                                    fontFamily: "'Plus Jakarta Sans', sans-serif;",
                                    toolbar: {
                                      show: false,
                                    },
                                    height: 100,
                                  },
                                  labels: ["Attend", "Non-Attend"],
                                  colors: [mainColor, theme.palette.primary.light, "#F9F9FD"],
                                  plotOptions: {
                                    pie: {
                                      donut: {
                                        size: "83%",
                                        background: "transparent",
                                        labels: {
                                          show: true,
                                          name: {
                                            show: true,
                                            offsetY: 7,
                                          },
                                          value: {
                                            show: false,
                                          },
                                          total: {
                                            show: true,
                                            color: theme.palette.mode === "dark" ? "white" : "black",
                                            fontSize: "8px",
                                            fontWeight: "600",
                                            label: `${studentAttendance}%`,
                                          },
                                        },
                                      },
                                    },
                                  },
                                  dataLabels: {
                                    enabled: false,
                                  },
                                  stroke: {
                                    show: false,
                                  },
                                  legend: {
                                    show: false,
                                  },
                                  tooltip: {
                                    theme: theme.palette.mode === "dark" ? "dark" : "light",
                                    fillSeriesColor: false,
                                  },
                                };

                                const seriescolumnchart = [studentAttendance, 100 - studentAttendance];


                                const optionscolumncharthostel: ApexOptions = {
                                  chart: {
                                    type: "donut",
                                    fontFamily: "'Plus Jakarta Sans', sans-serif;",
                                    toolbar: {
                                      show: false,
                                    },
                                    height: 100,
                                  },
                                  labels: ["Attend", "Non-Attend"],
                                  colors: [hostelattenColor, theme.palette.primary.light, "#F9F9FD"],
                                  plotOptions: {
                                    pie: {
                                      donut: {
                                        size: "83%",
                                        background: "transparent",
                                        labels: {
                                          show: true,
                                          name: {
                                            show: true,
                                            offsetY: 7,
                                          },
                                          value: {
                                            show: false,
                                          },
                                          total: {
                                            show: true,
                                            color: theme.palette.mode === "dark" ? "white" : "black",
                                            fontSize: "8px",
                                            fontWeight: "600",
                                            label: `${hostelAttendance}%`,
                                          },
                                        },
                                      },
                                    },
                                  },
                                  dataLabels: {
                                    enabled: false,
                                  },
                                  stroke: {
                                    show: false,
                                  },
                                  legend: {
                                    show: false,
                                  },
                                  tooltip: {
                                    theme: theme.palette.mode === "dark" ? "dark" : "light",
                                    fillSeriesColor: false,
                                  },
                                };
                                const seriescolumncharthostel = [hostelAttendance, 100 - hostelAttendance];
                                return (
                                  <Grid key={uniqueId} size={{ xs: 12, md: 3 }}>
                                    <CardContent
                                      sx={{
                                        transition: "all 0.2s ease-in-out",
                                        boxShadow: "0 2px 10px rgba(122, 112, 112, 0.08)",
                                        "&:hover": {
                                          transform: "scale(1.01)",
                                          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                                        },
                                      }}
                                    >
                                      <Stack direction="row" spacing={2} alignItems="center">
                                        <Box width="100%">
                                          {/* First Row - Two Columns */}
                                          <Box display="flex" justifyContent="space-between" alignItems="center">
                                            {/* Column 1 - Name */}
                                            <Box width="50%">
                                              <Tooltip title={student.name}>
                                                <Typography variant="h6" noWrap>
                                                  {student.regd}
                                                </Typography>
                                              </Tooltip>
                                            </Box>
                                            {/* Column 2 - Checkbox */}
                                            <Box width="50%" display="flex" justifyContent="flex-end">

                                            </Box>
                                          </Box>
                                          {/* Second Row - Two Columns */}
                                          <Box display="flex" justifyContent="space-between">
                                            {/* Column 1 - Registration Number */}
                                            <Box>
                                              <Typography variant="caption">
                                                {student.name}
                                              </Typography>
                                            </Box>
                                            {/* Column 2 - Chart */}
                                            <Box alignItems="revert">
                                              <Typography variant="caption">
                                                D-Lecture: {student.deliveredLecture}
                                              </Typography>
                                            </Box>
                                          </Box>

                                          <Box display="flex" justifyContent="center" alignContent={"center"} >
                                            {/* Column 1 - Registration Number */}
                                            <Box>
                                              <Chart
                                                options={optionscolumnchart}
                                                series={seriescolumnchart}
                                                type="donut"
                                                width={"60%"}
                                                height={60}
                                              />
                                              <Typography variant="caption" marginLeft={8} >
                                                Atten
                                              </Typography>
                                            </Box>
                                            {/* Column 2 - Chart */}
                                            <Box alignItems="revert">
                                              <Chart
                                                options={optionscolumncharthostel}
                                                series={seriescolumncharthostel}
                                                type="donut"
                                                width={"60%"}
                                                height={60}
                                              />
                                              <Typography variant="caption" marginLeft={8}>
                                                H-Atten
                                              </Typography>
                                            </Box>
                                          </Box>

                                        </Box>
                                      </Stack>
                                    </CardContent>
                                  </Grid>
                                );
                              })}
                            {!fullDataHostels[hostel] &&
                              students.length > (visibleCounts[hostel] || BATCH_SIZE) && (
                                <Grid size={{ xs: 12 }}>
                                  <Box display="flex" justifyContent="center">
                                    <Button
                                      variant="outlined"
                                      onClick={() =>
                                        setVisibleCounts((prev) => ({
                                          ...prev,
                                          [hostel]: (prev[hostel] || BATCH_SIZE) + BATCH_SIZE,
                                        }))
                                      }
                                    >
                                      Load More
                                    </Button>
                                  </Box>
                                </Grid>
                              )}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Scrollbar>
                </div>
              )}
            </div>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Checkedstudent;