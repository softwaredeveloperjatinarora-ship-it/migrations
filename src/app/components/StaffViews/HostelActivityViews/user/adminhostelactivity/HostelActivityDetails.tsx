


// "use client";
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   Badge,
//   Box,
//   Chip,
//   Grid,
//   TextField,
//   InputAdornment,
//   Checkbox,
//   CircularProgress,
//   Stack,
//   Typography,
//   CardContent,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Button,
//   useTheme,
//   LinearProgress,
//   ToggleButtonGroup,
//   ToggleButton,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   Switch,
//   styled,
//   FormHelperText,
//   Tooltip,
//   Snackbar,
//   Alert,
// } from "@mui/material";

// import RestartAltIcon from "@mui/icons-material/RestartAlt";
// import { IconBuildings } from "@tabler/icons-react";
// import { gethostelactivityAction } from "@/app/actions/hostalActivityAction/gethostelactivity";
// import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
// import { useSession } from "next-auth/react";
// import Chart from "react-apexcharts";
// import { ApexOptions } from "apexcharts";
// import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { format, isValid, parse } from "date-fns";
// import * as yup from "yup";
// import SearchIcon from "@mui/icons-material/Search";
// const muiColors = ["primary", "secondary", "success", "warning", "error", "info"] as const;
// const BATCH_SIZE = 10;

// // Validation schema
// const validationSchema = yup.object().shape({
//   selectedDate: yup
//     .date()
//     .required("Date is required")
//     .typeError("Please enter a valid date in DD/MM/YYYY format"),
//   selectedPerson: yup.string().required("Authority is required"),
// });

// interface HostelActivityDetailsProps {
//   onDataFetched: (data: any[]) => void;
//   onCheckedStudentsUpdate: (students: any[]) => void;
//   initialCheckedStudents: any[];
// }

// interface FormErrors {
//   selectedDate?: string;
//   selectedPerson?: string;
// }

// const HostelActivityDetails = ({
//   onDataFetched,
//   onCheckedStudentsUpdate,
//   initialCheckedStudents,
// }: HostelActivityDetailsProps) => {
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState<boolean>(true);
//   const [filtering, setFiltering] = useState(false);
//   const [checkedStudents, setCheckedStudents] = useState<any[]>(initialCheckedStudents || []);
//   const [hostelChecked, setHostelChecked] = useState<Record<string, boolean>>({});
//   const [error, setError] = useState<string | null>(null);
//   const [profiles, setHostel] = useState<any[]>([]);
//   const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});
//   const isDataFetched = useRef(false);
//   const resultsRef = useRef<HTMLDivElement | null>(null);
//   const { data: session } = useSession();
//   const [expandedAccordions, setExpandedAccordions] = useState<Record<string, boolean>>({});
//   const [fullDataHostels, setFullDataHostels] = useState<Record<string, boolean>>({});
//   const [attendanceFilter, setAttendanceFilter] = useState<string | null>(null);
//   const [totalStudents, setTotalStudents] = useState(0);
//   const [isRotating, setIsRotating] = React.useState(false);
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
//   const [selectedPerson, setSelectedPerson] = useState("");
//   const [formErrors, setFormErrors] = useState<FormErrors>({});
//   const [dateInputValue, setDateInputValue] = useState<string>("");
//   const [validationSuccess, setValidationSuccess] = useState(false);
//   const [showValidationAlert, setShowValidationAlert] = useState(false);
//   const [showFieldErrors, setShowFieldErrors] = useState(false);

//   useEffect(() => {
//     if (typeof onCheckedStudentsUpdate === "function") {
//       onCheckedStudentsUpdate(checkedStudents);
//     }
//   }, [checkedStudents, onCheckedStudentsUpdate]);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (isDataFetched.current) return;
//       setLoading(true);
//       try {
//         const response = await gethostelactivityAction();
//         const token = String(session?.user?.token).split("NEXT2121ANG")[1];
//         if (response.status === "success") {
//           const decrypted = decryptDataforResponse(response.ApiData, token);
//           const parsed = JSON.parse(decrypted);
//           setHostel(parsed);
//           onDataFetched?.(parsed);
//           const total = parsed.reduce((sum: number, hostel: any) => {
//             return sum + (hostel.students?.length || 0);
//           }, 0);
//           setTotalStudents(total);
//           const initialCounts: Record<string, number> = {};
//           parsed.forEach((profile: any) => {
//             initialCounts[profile.hostel] = BATCH_SIZE;
//           });
//           setVisibleCounts(initialCounts);
//         } else {
//           setError(response.message);
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Unknown error");
//       } finally {
//         setLoading(false);
//         isDataFetched.current = true;
//       }
//     };
//     fetchData();
//   }, [onDataFetched, session]);

//   // Validate form when selectedDate or selectedPerson changes
//   useEffect(() => {
//     validateForm();
//   }, [selectedDate, selectedPerson]);

//   // Update checked students when selectedDate or selectedPerson changes
//   useEffect(() => {
//     if (checkedStudents.length > 0) {
//       const updatedStudents = checkedStudents.map((student) => ({
//         ...student,
//         selectedDate: dateInputValue,
//         selectedPerson: selectedPerson,
//         // Update attendance status based on toggle

//       }));
//       setCheckedStudents(updatedStudents);
//     }
//   }, [selectedDate, selectedPerson]);

//   const validateForm = async () => {
//     try {
//       await validationSchema.validate(
//         {
//           selectedDate,
//           selectedPerson,
//         },
//         { abortEarly: false }
//       );
//       setFormErrors({});
//       setValidationSuccess(true);
//       return true;
//     } catch (err: any) {
//       const errors: FormErrors = {};
//       err.inner.forEach((error: yup.ValidationError) => {
//         errors[error.path as keyof FormErrors] = error.message;
//       });
//       setFormErrors(errors);
//       setValidationSuccess(false);
//       return false;
//     }
//   };

//   const dynamicColors = useMemo(() => {
//     const map: Record<string, (typeof muiColors)[number]> = {};
//     profiles.forEach((profile, index) => {
//       map[profile.hostel] = muiColors[index % muiColors.length];
//     });
//     return map;
//   }, [profiles]);

//   const handleChipClick = (category: string) => {
//     setSelectedCategory((prev) => (prev === category ? null : category));
//     setSearch("");
//     setFiltering(true);
//     setExpandedAccordions((prev) => ({ ...prev, [category]: true }));
//     setFullDataHostels((prev) => ({ ...prev, [category]: true }));
//     setTimeout(() => {
//       resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//       setFiltering(false);
//     }, 300);
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const searchValue = e.target.value;
//     setSearch(searchValue);
//     setFiltering(true);
//     // Expand accordions that have matching results
//     if (searchValue.trim()) {
//       const matchingHostels: Record<string, boolean> = {};
//       profiles.forEach((profile) => {
//         const hasMatch = profile.students.some((s: any) => {
//           const nameMatch = s.name?.toLowerCase().includes(searchValue.toLowerCase());
//           const regdMatch = String(s.regd || "").includes(searchValue);
//           return nameMatch || regdMatch;
//         });
//         if (hasMatch) matchingHostels[profile.hostel] = true;
//       });
//       setExpandedAccordions(matchingHostels);
//     } else {
//       // If search is empty, close all accordions or keep some open as per your preference
//       setExpandedAccordions({});
//     }
//     setTimeout(() => {
//       resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//       setFiltering(false);
//     }, 300);
//   };

//   const handleCheckboxChange = async (checked: boolean, student: any, hostel: string) => {
//     // Validate form before allowing checkbox selection
//     const isValid = await validateForm();
//     if (!isValid) {
//       setShowValidationAlert(true);
//       setShowFieldErrors(true);
//       return;
//     }

//     const studentWithHostel = {
//       ...student,
//       hostel,
//       selectedDate: dateInputValue,
//       selectedPerson: selectedPerson,

//     };
//     setCheckedStudents((prev) =>
//       checked
//         ? [...prev, studentWithHostel]
//         : prev.filter((s) => s.regd !== student.regd)
//     );
//   };

//   const handleHostelCheckboxChange = async (hostel: string, isChecked: boolean, students: any[]) => {
//     // Validate form before allowing checkbox selection
//     const isValid = await validateForm();
//     if (!isValid) {
//       setShowValidationAlert(true);
//       setShowFieldErrors(true);
//       return;
//     }

//     setHostelChecked((prev) => ({ ...prev, [hostel]: isChecked }));
//     setCheckedStudents((prev) => {
//       const regdList = students.map((s) => s.regd);
//       if (isChecked) {
//         const newChecked = students
//           .filter((s) => !prev.some((p) => p.regd === s.regd))
//           .map((s) => ({
//             ...s,
//             hostel,
//             selectedDate: dateInputValue,
//             selectedPerson: selectedPerson,

//           }));
//         return [...prev, ...newChecked];
//       } else {
//         return prev.filter((s) => !regdList.includes(s.regd));
//       }
//     });
//   };

//   // const handleAttendanceToggleChange = (studentregd: string, newStatus: "present" | "absent") => {
//   //   setCheckedStudents((prev) =>
//   //     prev.map((student) =>
//   //       student.regd === studentregd
//   //         ? { ...student, attendanceStatus: newStatus }
//   //         : student
//   //     )
//   //   );
//   // };

//   const filteredProfiles = useMemo(() => {
//     const lowerSearch = search.trim().toLowerCase();
//     return profiles
//       .filter((profile) => !selectedCategory || profile.hostel === selectedCategory)
//       .map((profile) => {
//         const hostelMatch = profile.hostel?.toLowerCase().includes(lowerSearch);
//         const filteredStudents = profile.students?.filter((s: any) => {
//           const nameMatch = s.name?.toLowerCase().includes(lowerSearch);
//           const regdMatch = String(s.regd || "").toLowerCase().includes(lowerSearch);
//           const attendance = Number(s.att) || 0;
//           // Apply attendance filter if selected
//           let attendanceMatch = true;
//           if (attendanceFilter === "lt20") attendanceMatch = attendance < 20;
//           else if (attendanceFilter === "lt30") attendanceMatch = attendance < 30;
//           else if (attendanceFilter === "gt40") attendanceMatch = attendance > 40;
//           return (nameMatch || regdMatch || hostelMatch) && attendanceMatch;
//         });
//         return { ...profile, students: filteredStudents };
//       })
//       .filter((p) => p.students && p.students.length > 0);
//   }, [search, profiles, selectedCategory, attendanceFilter]);

//   const handleAttendanceFilter = (
//     event: React.MouseEvent<HTMLElement>,
//     newFilter: string | null
//   ) => {
//     setAttendanceFilter(newFilter);
//     setFiltering(true);
//     setTimeout(() => {
//       resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//       setFiltering(false);
//     }, 300);
//   };

//   const chipCounts = useMemo(() => {
//     const lowerSearch = search.trim().toLowerCase();
//     return profiles.reduce((acc, profile) => {
//       const count = profile.students.filter((s: any) => {
//         const nameMatch = s.name?.toLowerCase().includes(lowerSearch);
//         const regdMatch = String(s.regd || "").toLowerCase().includes(lowerSearch);
//         const hostelMatch = profile.hostel?.toLowerCase().includes(lowerSearch);
//         return nameMatch || regdMatch || hostelMatch;
//       }).length;
//       acc[profile.hostel] = count;
//       return acc;
//     }, {} as Record<string, number>);
//   }, [profiles, search]);

//   const handleAccordionChange = (hostel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
//     setExpandedAccordions((prev) => ({ ...prev, [hostel]: isExpanded }));
//   };

//   const handleDateChange = (newValue: Date | null) => {
//     setSelectedDate(newValue);
//     setDateInputValue(newValue ? format(newValue, "dd/MM/yyyy") : "");
//   };

//   const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setDateInputValue(value);
//     // Parse the date in dd/MM/yyyy format
//     if (value.length === 10) {
//       const parsedDate = parse(value, "dd/MM/yyyy", new Date());
//       if (isValid(parsedDate)) {
//         setSelectedDate(parsedDate);
//       }
//     }
//   };

//   const theme = useTheme();
//   const primary = theme.palette.primary.main;
//   const primarylight = theme.palette.primary.light;

//   // 

//   const people = ["Alice", "Bob", "Charlie", "Diana"];

//   // Custom TextField component that filters out invalid props
//   const CustomTextField = React.forwardRef((props: any, ref) => {
//     const { sectionListRef, ...other } = props;
//     return <TextField {...other} ref={ref} />;
//   });
//   CustomTextField.displayName = "CustomTextField";

//   return (
//     <Box>
//       {loading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Box>
//           {/* Hostel Chips */}
//           <Box p={2}>
//             <Grid container spacing={2}>
//               {profiles.map(({ hostel }) => {
//                 const count = chipCounts[hostel] || 0;
//                 return (
//                   <Grid key={hostel}>
//                     <Badge
//                       badgeContent={count}
//                       max={100000}
//                       color={dynamicColors[hostel] || "default"}
//                     >
//                       <Chip
//                         icon={<IconBuildings size={16} />}
//                         label={hostel.toUpperCase()}
//                         onClick={() => {
//                           handleChipClick(hostel);
//                           setFullDataHostels((prev) => ({ ...prev, [hostel]: true }));
//                         }}
//                         sx={{
//                           minWidth: 100,
//                           height: 35,
//                           backgroundColor:
//                             selectedCategory === hostel
//                               ? `${dynamicColors[hostel]}.main`
//                               : `${dynamicColors[hostel]}.light`,
//                           color: selectedCategory === hostel ? "white" : "",
//                           fontWeight: "bold",
//                           cursor: "pointer",
//                           "&:hover": {
//                             backgroundColor: `${dynamicColors[hostel]}.dark`,
//                             color: "white",
//                           },
//                         }}
//                       />
//                     </Badge>
//                   </Grid>
//                 );
//               })}
//             </Grid>
//           </Box>
//           <Box display="flex">
//             <Typography variant="h6" sx={{ p: 2, fontWeight: "bold", fontSize: 12 }}>
//               Total Students :{totalStudents}
//             </Typography>
//             <Typography variant="h6" sx={{ p: 2, fontWeight: "bold", fontSize: 12 }}>
//               Total Hostel :{profiles.length}
//             </Typography>
//           </Box>
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <Box sx={{ flexGrow: 1, p: 2 }}>
//               <Grid container spacing={2} alignItems="center">
//                 {/* Date Picker */}
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <DatePicker
//                     label="DD/MM/YYYY"
//                     value={selectedDate}
//                     onChange={handleDateChange}
//                     enableAccessibleFieldDOMStructure={false}
//                     slots={{
//                       textField: (params) => (
//                         <TextField
//                           {...params}
//                           fullWidth
//                           error={showFieldErrors && !!formErrors.selectedDate}
//                           helperText={showFieldErrors ? formErrors.selectedDate : ""}
//                           value={dateInputValue}
//                           onChange={handleDateInputChange}
//                           placeholder="DD/MM/YYYY"
//                         />
//                       ),
//                     }}
//                   />
//                 </Grid>
//                 {/* Dropdown */}
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <FormControl fullWidth error={showFieldErrors && !!formErrors.selectedPerson}>
//                     <InputLabel id="person-label">Select Authority</InputLabel>
//                     <Select
//                       labelId="person-label"
//                       value={selectedPerson}
//                       label="Select Person"
//                       onChange={(e) => setSelectedPerson(e.target.value)}
//                     >
//                       <MenuItem value="">
//                         <em>Select Authority</em>
//                       </MenuItem>
//                       {people.map((person, index) => (
//                         <MenuItem key={index} value={person}>
//                           {person}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                     {showFieldErrors && formErrors.selectedPerson && (
//                       <FormHelperText>{formErrors.selectedPerson}</FormHelperText>
//                     )}
//                   </FormControl>
//                 </Grid>
//               </Grid>
//             </Box>
//           </LocalizationProvider>
//           {/* Search & Reset */}
//           <Grid container justifyContent="flex-end" spacing={1} sx={{ p: 2 }}>
//             <Grid>
//               <TextField
//                 label="Search by hostel, name or reg. no."
//                 variant="outlined"
//                 size="small"
//                 sx={{ width: 250 }}
//                 value={search}
//                 onChange={handleSearchChange}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon color="action" />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </Grid>
//             <Grid>
//               <ToggleButtonGroup
//                 value={attendanceFilter}
//                 exclusive
//                 onChange={handleAttendanceFilter}
//                 aria-label="attendance filter"
//                 size="small"
//               >
//                 <ToggleButton value="lt20" aria-label="less than 50%">
//                   <Typography variant="caption" color="error">
//                     ↓20%
//                   </Typography>
//                 </ToggleButton>
//                 <ToggleButton value="lt30" aria-label="less than 75%">
//                   <Typography variant="caption" color="warning">
//                     ↓30%
//                   </Typography>
//                 </ToggleButton>
//                 <ToggleButton value="gt40" aria-label="greater than 90%">
//                   <Typography variant="caption" color="success">
//                     ↑40%
//                   </Typography>
//                 </ToggleButton>
//               </ToggleButtonGroup>
//             </Grid>
//             <Grid>
//               <Chip
//                 icon={
//                   <RestartAltIcon
//                     sx={{
//                       animation: isRotating ? "spin 1s linear infinite" : "none",
//                       "@keyframes spin": {
//                         "0%": {
//                           transform: "rotate(0deg)",
//                         },
//                         "100%": {
//                           transform: "rotate(360deg)",
//                         },
//                       },
//                     }}
//                   />
//                 }
//                 label="Reset"
//                 color="error"
//                 clickable
//                 onClick={() => {
//                   setIsRotating(true);
//                   // Start continuous rotation
//                   // Perform reset operations
//                   setSearch("");
//                   setAttendanceFilter(null);
//                   setSelectedCategory(null);
//                   setCheckedStudents([]);
//                   setHostelChecked({});
//                   setSelectedDate(null);
//                   setSelectedPerson("");
//                   setDateInputValue("");
//                   setFormErrors({});
//                   setShowFieldErrors(false);
//                   // When all operations are done (you might need to adjust timing)
//                   setTimeout(() => {
//                     resultsRef.current?.scrollIntoView({ behavior: "smooth" });
//                     setIsRotating(false); // Stop rotation
//                   }, 1000); // Adjust this duration as needed
//                 }}
//               />
//             </Grid>
//           </Grid>

//           {/* Accordion Display */}
//           {filtering ? (
//             <Box display="flex" justifyContent="center" alignContent="center">
//               <CircularProgress />
//             </Box>
//           ) : (
//             <div ref={resultsRef}>
//               <Scrollbar sx={{ height: "440px" }}>
//                 {filteredProfiles.map(({ hostel, students }) => (
//                   <Accordion
//                     key={hostel}
//                     sx={{
//                       transition: "all 0.2s ease-in-out",
//                       boxShadow: "0 2px 10px rgba(122, 112, 112, 0.08)",
//                       "&:hover": {
//                         transform: "scale(1.01)",
//                         boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
//                       },
//                     }}
//                     disableGutters
//                     expanded={expandedAccordions[hostel] || false}
//                     onChange={handleAccordionChange(hostel)}
//                   >
//                     <AccordionSummary>
//                       <Box
//                         sx={{
//                           width: "100%",
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                         }}
//                       >
//                         <Typography
//                           variant="h6"
//                           sx={{ display: "flex", alignItems: "center", fontSize: "12px" }}
//                         >
//                           <IconBuildings size={16} style={{ marginRight: 6 }} />
//                           {hostel.toUpperCase()}
//                         </Typography>
//                         <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1, mx: 1 }}>
//                           <LinearProgress
//                             variant="determinate"
//                             value={
//                               students.reduce(
//                                 (sum: number, student: any) => sum + (Number(student.att) || 0),
//                                 0
//                               ) / (students.length || 1)
//                             }
//                             color={
//                               students.reduce(
//                                 (sum: number, student: any) => sum + (Number(student.att) || 0),
//                                 0
//                               ) /
//                                 (students.length || 1) >
//                                 80
//                                 ? "success"
//                                 : students.reduce(
//                                   (sum: number, student: any) => sum + (Number(student.att) || 0),
//                                   0
//                                 ) /
//                                   (students.length || 1) >
//                                   50
//                                   ? "warning"
//                                   : "error"
//                             }
//                             sx={{ height: 6, flexGrow: 1, borderRadius: 3 }}
//                           />
//                         </Box>
//                         <Typography variant="caption" sx={{ minWidth: 40 }}>
//                           {Math.round(
//                             students.reduce(
//                               (sum: number, student: any) => sum + (Number(student.att) || 0),
//                               0
//                             ) / (students.length || 1)
//                           )}
//                           %
//                         </Typography>
//                         <Checkbox
//                           checked={students.every((s: any) =>
//                             checkedStudents.some((c) => c.regd === s.regd)
//                           )}
//                           indeterminate={
//                             students.some((s: any) =>
//                               checkedStudents.some((c) => c.regd === s.regd)
//                             ) &&
//                             !students.every((s: any) =>
//                               checkedStudents.some((c) => c.regd === s.regd)
//                             )
//                           }
//                           onChange={(e) =>
//                             handleHostelCheckboxChange(hostel, e.target.checked, students)
//                           }
//                           onClick={(e) => e.stopPropagation()}
//                         />
//                       </Box>
//                     </AccordionSummary>
//                     <AccordionDetails>
//                       <Grid container spacing={2}>
//                         {students
//                           .slice(
//                             0,
//                             fullDataHostels[hostel]
//                               ? students.length
//                               : visibleCounts[hostel] || BATCH_SIZE
//                           )
//                           .map((student: any, index: number) => {
//                             // Dynamic chart configuration for each student
//                             const studentAttendance = Number(student.att) || 0;
//                             const mainColor =
//                               studentAttendance > 80
//                                 ? theme.palette.success.main
//                                 : studentAttendance >= 50
//                                   ? theme.palette.warning.main
//                                   : "#FF4D4D";
//                             const uniqueId = `${hostel}-${student.regd}-${index}`;
//                             const isChecked = checkedStudents.some((s) => s.regd === student.regd);
//                             // const attendanceStatus = isChecked
//                             //   ? checkedStudents.find((s) => s.regd === student.regd)
//                             //     ?.attendanceStatus || "present"
//                             //   : "present";
//                             const optionscolumnchart: ApexOptions = {
//                               chart: {
//                                 type: "donut",
//                                 fontFamily: "'Plus Jakarta Sans', sans-serif;",
//                                 toolbar: {
//                                   show: false,
//                                 },
//                                 height: 100,
//                               },
//                               labels: ["Attend", "Non-Attend"],
//                               colors: [mainColor, theme.palette.primary.light, "#F9F9FD"],
//                               plotOptions: {
//                                 pie: {
//                                   donut: {
//                                     size: "83%",
//                                     background: "transparent",
//                                     labels: {
//                                       show: true,
//                                       name: {
//                                         show: true,
//                                         offsetY: 7,
//                                       },
//                                       value: {
//                                         show: false,
//                                       },
//                                       total: {
//                                         show: true,
//                                         color: theme.palette.mode === "dark" ? "white" : "black",
//                                         fontSize: "8px",
//                                         fontWeight: "600",
//                                         label: `${studentAttendance}%`,
//                                       },
//                                     },
//                                   },
//                                 },
//                               },
//                               dataLabels: {
//                                 enabled: false,
//                               },
//                               stroke: {
//                                 show: false,
//                               },
//                               legend: {
//                                 show: false,
//                               },
//                               tooltip: {
//                                 theme: theme.palette.mode === "dark" ? "dark" : "light",
//                                 fillSeriesColor: false,
//                               },
//                             };
//                             const seriescolumnchart = [studentAttendance, 100 - studentAttendance];

//                             return (
//                               <Grid key={uniqueId} size={{ xs: 12, md: 3 }}>
//                                 <CardContent
//                                   sx={{
//                                     transition: "all 0.2s ease-in-out",
//                                     boxShadow: "0 2px 10px rgba(122, 112, 112, 0.08)",
//                                     "&:hover": {
//                                       transform: "scale(1.01)",
//                                       boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
//                                     },
//                                   }}
//                                 >
//                                   <Stack direction="row" spacing={2} alignItems="center">
//                                     <Box width="100%">
//                                       {/* First Row - Two Columns */}
//                                       <Box display="flex" justifyContent="space-between" alignItems="center">
//                                         {/* Column 1 - Name */}
//                                         <Box width="50%">
//                                           <Tooltip title={student.name}>
//                                             <Typography variant="h6" noWrap>
//                                               {student.name}
//                                             </Typography>
//                                           </Tooltip>
//                                         </Box>
//                                         {/* Column 2 - Checkbox */}
//                                         <Box width="50%" display="flex" justifyContent="flex-end">
//                                           <Checkbox
//                                             checked={isChecked}
//                                             onChange={(e) =>
//                                               handleCheckboxChange(e.target.checked, student, hostel)
//                                             }
//                                           />
//                                         </Box>
//                                       </Box>
//                                       {/* Second Row - Two Columns */}
//                                       <Box display="flex" justifyContent="space-between">
//                                         {/* Column 1 - Registration Number */}
//                                         <Box>
//                                           <Typography variant="caption">
//                                             RegNo: {student.regd}
//                                           </Typography>
//                                         </Box>
//                                         {/* Column 2 - Chart */}
//                                         <Box alignItems="revert">
//                                           <Chart
//                                             options={optionscolumnchart}
//                                             series={seriescolumnchart}
//                                             type="donut"
//                                             width={"60%"}
//                                             height={60}
//                                           />
//                                         </Box>
//                                       </Box>
//                                       {/* Attendance Toggle */}
//                                       {/* {isChecked && (
//                                         <Box display="flex" alignItems="center" mt={1}>
//                                           <Switch
//                                             checked={attendanceStatus === "present"}
//                                             onChange={(e) =>
//                                               handleAttendanceToggleChange(
//                                                 student.regd,
//                                                 e.target.checked ? "present" : "absent"
//                                               )
//                                             }
//                                           />
//                                           <Typography variant="body2" ml={1}>
//                                             {attendanceStatus === "present" ? "Present" : "Absent"}
//                                           </Typography>
//                                         </Box>
//                                       )} */}
//                                     </Box>
//                                   </Stack>
//                                 </CardContent>
//                               </Grid>
//                             );
//                           })}
//                         {!fullDataHostels[hostel] &&
//                           students.length > (visibleCounts[hostel] || BATCH_SIZE) && (
//                             <Grid size={{ xs: 12 }}>
//                               <Box display="flex" justifyContent="center">
//                                 <Button
//                                   variant="outlined"
//                                   onClick={() =>
//                                     setVisibleCounts((prev) => ({
//                                       ...prev,
//                                       [hostel]: (prev[hostel] || BATCH_SIZE) + BATCH_SIZE,
//                                     }))
//                                   }
//                                 >
//                                   Load More
//                                 </Button>
//                               </Box>
//                             </Grid>
//                           )}
//                       </Grid>
//                     </AccordionDetails>
//                   </Accordion>
//                 ))}
//               </Scrollbar>
//             </div>
//           )}
//         </Box>

//       )}
//       {/* Validation Alert Snackbar */}
//       <Snackbar
//         open={showValidationAlert}
//         autoHideDuration={6000}
//         onClose={() => setShowValidationAlert(false)}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert severity="error" sx={{ width: "100%" }}>
//           Please select a date and authority before selecting students.
//         </Alert>
//       </Snackbar>



//     </Box>
//   );
// };

// export default HostelActivityDetails;







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
  IconButton,
  Menu,
} from "@mui/material";

import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { IconBuildings, IconChevronDown, IconDownload } from "@tabler/icons-react";
import { gethostelactivityAction } from "@/app/actions/StaffActions/hostalActivityAction/admin/gethostelactivity";
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

import { gethostelauthorityAction } from "@/app/actions/StaffActions/hostalActivityAction/admin/getAuthorityAction";
import { saveadminAction } from "@/app/actions/StaffActions/hostalActivityAction/admin/saveadminAction";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Student {
  id: number;
  regd
  : string;
  name: string;
  att: string;
  hostelAttendance: string;
  programName: string;

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

const HostelActivityDetails = ({ onDataFetched }: any) => {
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
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [setstudentfilled, setSetstudentfilled] = useState(false);

  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  // useEffect(() => {


  //   const fetchData = async () => {
  //     if (isDataFetched.current) return;
  //     setLoading(true);
  //     try {
  //       const response = await gethostelactivityAction();
  //       const reposeauthrity = await gethostelauthorityAction();
  //       const token = String(session?.user?.token).split("NEXT2121ANG")[1];
  //       if (response.status === "success") {
  //         const decrypted = decryptDataforResponse(response.ApiData, token);
  //         const decryptedauthority = decryptDataforResponse(reposeauthrity.ApiData, token);
  //         const parsed1 = JSON.parse(decryptedauthority);
  //         // console.log("Fetched Authority Data:", parsed1);
  //         setauthority(parsed1);
  //         const parsed = JSON.parse(decrypted);
  //         // console.log(" Datalive:", parsed);
  //         setHostel(parsed);
  //         onDataFetched?.(parsed);
  //         const total = parsed.reduce((sum: number, hostel: any) => {
  //           return sum + (hostel.students?.length || 0);
  //         }, 0);
  //         // console.log("Total Students:", total);
  //         setTotalStudents(total);
  //         const initialCounts: Record<string, number> = {};
  //         parsed.forEach((profile: any) => {
  //           initialCounts[profile.hostel] = BATCH_SIZE;
  //         });
  //         setVisibleCounts(initialCounts);
  //       } else {
  //         setError(response.message);
  //       }
  //     } catch (err) {
  //       setError(err instanceof Error ? err.message : "Unknown error");
  //     } finally {
  //       setLoading(false);
  //       isDataFetched.current = true;
  //     }
  //   };
  //   fetchData();
  // }, [onDataFetched, session]);
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await gethostelactivityAction();
      const reposeauthrity = await gethostelauthorityAction();
      const token = String(session?.user?.token).split("NEXT2121ANG")[1];

      if (response.status === "success") {
        const decrypted = decryptDataforResponse(response.ApiData, token);
        const decryptedauthority = decryptDataforResponse(reposeauthrity.ApiData, token);

        const parsed1 = JSON.parse(decryptedauthority);
        setauthority(parsed1);

        const parsed = JSON.parse(decrypted);
        console.log("hsotelactivirty", parsed)
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

  // 2. Call fetchData in useEffect (for first load)
  useEffect(() => {
    if (!isDataFetched.current) {
      fetchData();
    }
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

  const handleChipClick = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
    setSearch("");
    setFiltering(true);
    setExpandedAccordions((prev) => ({ ...prev, [category]: true }));
    setFullDataHostels((prev) => ({ ...prev, [category]: true }));
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setFiltering(false);
    }, 300);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
    setFiltering(true);
    // Expand accordions that have matching results
    if (searchValue.trim()) {
      const matchingHostels: Record<string, boolean> = {};
      profiles.forEach((profile) => {
        const hasMatch = profile.students.some((s: any) => {
          const nameMatch = s.name?.toLowerCase().includes(searchValue.toLowerCase());
          const regdMatch = String(s.regd || "").includes(searchValue);
          return nameMatch || regdMatch;
        });
        if (hasMatch) matchingHostels[profile.hostel] = true;
      });
      setExpandedAccordions(matchingHostels);
    } else {
      // If search is empty, close all accordions or keep some open as per your preference
      setExpandedAccordions({});
    }
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setFiltering(false);
    }, 300);
  };

  const handleCheckboxChange = async (checked: boolean, student: any, hostel: string, hostelId: number) => {
    // Validate form before allowing checkbox selection
    // const isValid = await validateForm();
    // if (!isValid) {
    //   setShowValidationAlert(true);
    //   setShowFieldErrors(true);
    //   return;
    // }

    const studentWithHostel = {
      ...student,
      hostelId,
      hostel,
      selectedDate: dateInputValue,
      selectedPerson: selectedPerson,

    };
    setCheckedStudents((prev) =>
      checked
        ? [...prev, studentWithHostel]
        : prev.filter((s) => s.regd !== student.regd)
    );
  };

  const handleHostelCheckboxChange = async (hostel: string, isChecked: boolean, students: any[], hostelId: number) => {
    // Validate form before allowing checkbox selection
    // const isValid = await validateForm();
    // if (!isValid) {
    //   setShowValidationAlert(true);
    //   setShowFieldErrors(true);
    //   return;
    // }

    setHostelChecked((prev) => ({ ...prev, [hostel]: isChecked }));
    setCheckedStudents((prev) => {
      const regdList = students.map((s) => s.regd);
      if (isChecked) {
        const newChecked = students
          .filter((s) => !prev.some((p) => p.regd === s.regd))
          .map((s) => ({
            ...s,
            hostelId,
            hostel,
            selectedDate: dateInputValue,
            selectedPerson: selectedPerson,
            students: { ...s }

          }));
        return [...prev, ...newChecked];
      } else {
        return prev.filter((s) => !regdList.includes(s.regd));
      }
    });
  };

  // const handleAttendanceToggleChange = (studentregd: string, newStatus: "present" | "absent") => {
  //   setCheckedStudents((prev) =>
  //     prev.map((student) =>
  //       student.regd === studentregd
  //         ? { ...student, attendanceStatus: newStatus }
  //         : student
  //     )
  //   );
  // };

  const filteredProfiles = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();
    return profiles
      .filter((profile) => !selectedCategory || profile.hostel === selectedCategory)
      .map((profile) => {
        const hostelMatch = profile.hostel?.toLowerCase().includes(lowerSearch);
        const filteredStudents = profile.students?.filter((s: any) => {
          const nameMatch = s.name?.toLowerCase().includes(lowerSearch);
          const regdMatch = String(s.regd || "").toLowerCase().includes(lowerSearch);
          const attendance = Number(s.att) || 0;
          // Apply attendance filter if selected
          let attendanceMatch = true;
          if (attendanceFilter === "lt20") attendanceMatch = attendance < 20;
          else if (attendanceFilter === "lt30") attendanceMatch = attendance < 30;
          else if (attendanceFilter === "gt40") attendanceMatch = attendance > 40;
          return (nameMatch || regdMatch || hostelMatch) && attendanceMatch;
        });
        return { ...profile, students: filteredStudents };
      })
      .filter((p) => p.students && p.students.length > 0);
  }, [search, profiles, selectedCategory, attendanceFilter]);

  // const handleAttendanceFilter = (
  //   event: React.MouseEvent<HTMLElement>,
  //   newFilter: string | null
  // ) => {
  //   setAttendanceFilter(newFilter);
  //   setFiltering(true);
  //   setTimeout(() => {
  //     resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  //     setFiltering(false);
  //   }, 300);
  // };

  const chipCounts = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();
    return profiles.reduce((acc, profile) => {
      const count = profile.students.filter((s: any) => {
        const nameMatch = s.name?.toLowerCase().includes(lowerSearch);
        const regdMatch = String(s.regd || "").toLowerCase().includes(lowerSearch);
        const hostelMatch = profile.hostel?.toLowerCase().includes(lowerSearch);
        return nameMatch || regdMatch || hostelMatch;
      }).length;
      acc[profile.hostel] = count;
      return acc;
    }, {} as Record<string, number>);
  }, [profiles, search]);

  const handleAccordionChange = (hostel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordions((prev) => ({ ...prev, [hostel]: isExpanded }));
  };


  const handleDateChange = (newValue: Date | null, context?: any) => {
    setSelectedDate(newValue);
    setDateInputValue(newValue ? format(newValue, "dd/MM/yyyy") : "");
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateInputValue(value);
    // Parse the date in dd/MM/yyyy format
    if (value.length === 10) {
      const parsedDate = parse(value, "dd/MM/yyyy", new Date());
      if (isValid(parsedDate)) {
        setSelectedDate(parsedDate);
      }
    }
  };

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;





  // Custom TextField component that filters out invalid props
  const CustomTextField = React.forwardRef((props: any, ref) => {
    const { sectionListRef, ...other } = props;
    return <TextField {...other} ref={ref} />;
  });
  CustomTextField.displayName = "CustomTextField";





  const handleSubmit = async () => {
    if (checkedStudents.length === 0) {
      setSetstudentfilled(true);
    }
    else {

      // setIsSubmitting(true);
      const isValid = await validateForm();
      if (!isValid) {
        setShowValidationAlert(true);
        setShowFieldErrors(true);
        return;
      }
      else {
        setIsSubmitting(true);
      }

      try {

        await new Promise(resolve => setTimeout(resolve, 1500));




        // console.log('Submitted students:', checkedStudents);
        const formattedData = checkedStudents.reduce((acc, student) => {
          // Check if hostel already exists in the accumulator
          let hostel: HostelFormatted | undefined = acc.find((item: HostelFormatted) => item.hostel === student.hostel);

          interface HostelFormatted {
            hostel: string;
            hostelId: number;
            selectedDate: string;
            selectedPerson: string;
            students: StudentFormatted[];
          }

          interface StudentFormatted {
            name: string;
            regd: string;
            deliveredLecture: number;
            hostelAttendance: number;
            att: number;
            programName: string;

          }

          if (!hostel) {
            // If hostel doesn't exist, create a new entry for the hostel
            hostel = {
              hostel: student.hostel,
              hostelId: student.hostelId,
              selectedDate: student.selectedDate,
              selectedPerson: student.selectedPerson,
              students: []
            };
            acc.push(hostel);
          }

          // Add the student to the hostel's students array
          hostel.students.push({
            name: student.name,
            regd: student.regd,
            deliveredLecture: student.deliveredLecture,
            hostelAttendance: student.hostelAttendance,
            att: student.att,
            programName: student.programName


          });

          return acc;
        }, []);

        // console.log("formateddata",formattedData);
        const credentialsJson = JSON.stringify(formattedData);
        console.log("credentialsJson", credentialsJson);

        if (!session || !session.user || !session.user.token) {
          throw new Error("Session or token is missing");
        }
        const ab = {
          "User": "",
          "Hostels": formattedData
        }
        const credentialsJsons = JSON.stringify(ab);
        // console.log("credentialsJsons", credentialsJsons); 
        let splitValue = session.user.token.split("NEXT2121ANG");
        const { Data } = encryptData(credentialsJsons, splitValue[1]);
        console.log("Encrypted Dataparameter:", Data);


        const response = await saveadminAction(Data);
        console.log("Encrypted Datareposnse:", Data);
        const token = String(session?.user?.token).split("NEXT2121ANG")[1];
        const decrypted = decryptDataforResponse(response.ApiData, token);
        const parsed = JSON.parse(decrypted);
        console.log("save data response", parsed);
     
        setSubmitSuccess(true);
        setCheckedStudents([]);
        setCheckedStudents([]);
        setHostelChecked({});
        setExpandedAccordions({});
        setSearch("");
        setAttendanceFilter(null);
        setSelectedCategory(null);
        setSelectedPerson([]);
        setDateInputValue("");
        isDataFetched.current = false;
        await fetchData();
      } catch (error) {
        console.error('Error submitting data:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (event: SelectChangeEvent<typeof selectedPerson>) => {
    const {
      target: { value },
    } = event;
    setSelectedPerson(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };




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
        'Delivered Lectures': student.deliveredLecture || '0',
        'Programme Name': student.programName || '0'



      })) || []
    );
  };

  const downloadPDF = () => {
    if (!profiles || profiles.length === 0) return;

    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();

    doc.setFontSize(16);
    doc.text("Pending Students For Session", 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${currentDate} | Total Students: ${totalStudents}`, 14, 30);

    const flattenedData = flattenStudentsData(profiles);

    const headers = [
      'Reg No', 'Name', 'Hostel',
      'Current Att(%)', 'Hostel Att(%)', 'Lectures', 'Programme'

    ];

    const data = flattenedData.map(student => [
      student['Registration Number'],
      student['Student Name'],
      student['Hostel'],

      student['Current Attendance (%)'],
      student['Hostel Attendance (%)'],
      student['Delivered Lectures'],
      student['Programme Name'],


    ]);

    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 8 }
    });

    doc.save(`Pending Students For Session-${currentDate.replace(/\//g, '-')}.pdf`);
    setUploadSuccess(true);
    setAnchorEl(null);
  };

  const handleExport = async () => {
    if (!profiles || profiles.length === 0) return;

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Pending Students For Session");

      const headers = [
        'Registration Number', 'Student Name', 'Hostel', 'Current Attendance (%)',
        'Hostel Attendance (%)', 'Delivered Lectures', 'Programme Name'

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
      a.download = `Pending Students For Session-${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;
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
              {profiles.map(({ hostel }) => {
                const count = chipCounts[hostel] || 0;
                return (
                  <Grid key={hostel}>
                    <Badge
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
            {/* <Grid>
              <ToggleButtonGroup
                value={attendanceFilter}
                exclusive
                onChange={handleAttendanceFilter}
                aria-label="attendance filter"
                size="small"
              >
                <ToggleButton value="lt20" aria-label="less than 50%">
                  <Typography variant="caption" color="error">
                    ↓20%
                  </Typography>
                </ToggleButton>
                <ToggleButton value="lt30" aria-label="less than 75%">
                  <Typography variant="caption" color="warning">
                    ↓30%
                  </Typography>
                </ToggleButton>
                <ToggleButton value="gt40" aria-label="greater than 90%">
                  <Typography variant="caption" color="success">
                    ↑40%
                  </Typography>
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid> */}
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
                  // Start continuous rotation
                  // Perform reset operations
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
                    {filteredProfiles.map(({ hostel, students, hostelId }) => (
                      <Accordion
                        key={hostel}
                        sx={{
                          transition: "all 0.2s ease-in-out",
                          boxShadow: "0 2px 10px rgba(122, 112, 112, 0.08)",
                          "&:hover": {
                            transform: "scale(1.01)",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                          },
                        }}
                        disableGutters
                        expanded={expandedAccordions[hostel] || false}
                        onChange={handleAccordionChange(hostel)}
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
                            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1, mx: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={
                                  students.reduce(
                                    (sum: number, student: any) => sum + (Number(student.att) || 0),
                                    0
                                  ) / (students.length || 1)
                                }
                                color={
                                  students.reduce(
                                    (sum: number, student: any) => sum + (Number(student.att) || 0),
                                    0
                                  ) /
                                    (students.length || 1) >
                                    80
                                    ? "success"
                                    : students.reduce(
                                      (sum: number, student: any) => sum + (Number(student.att) || 0),
                                      0
                                    ) /
                                      (students.length || 1) >
                                      50
                                      ? "warning"
                                      : "error"
                                }
                                sx={{ height: 6, flexGrow: 1, borderRadius: 3 }}
                              />
                            </Box>
                            <Typography variant="caption" sx={{ minWidth: 40 }}>
                              {Math.round(
                                students.reduce(
                                  (sum: number, student: any) => sum + (Number(student.att) || 0),
                                  0
                                ) / (students.length || 1)
                              )}
                              %
                            </Typography>
                            <Checkbox
                              checked={students.every((s: any) =>
                                checkedStudents.some((c) => c.regd === s.regd)
                              )}
                              indeterminate={
                                students.some((s: any) =>
                                  checkedStudents.some((c) => c.regd === s.regd)
                                ) &&
                                !students.every((s: any) =>
                                  checkedStudents.some((c) => c.regd === s.regd)
                                )
                              }
                              onChange={(e) =>
                                handleHostelCheckboxChange(hostel, e.target.checked, students, hostelId)
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
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


                                const uniqueId = `${hostel}-${student.regd}-${index}`;
                                const isChecked = checkedStudents.some((s) => s.regd === student.regd);
                                // const attendanceStatus = isChecked
                                //   ? checkedStudents.find((s) => s.regd === student.regd)
                                //     ?.attendanceStatus || "present"
                                //   : "present";
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
                                              <Checkbox
                                                checked={isChecked}
                                                onChange={(e) =>
                                                  handleCheckboxChange(e.target.checked, student, hostel, hostelId)
                                                }
                                              />
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
                                          <Box sx={{ fontSize: 5 }}>
                                            <Tooltip title={student.programName}>
                                              <Typography variant="caption" noWrap>
                                                {student.programName}
                                              </Typography>
                                            </Tooltip>
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

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ flexGrow: 1, p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                {/* Date Picker */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DatePicker
                    disablePast
                    label="DD/MM/YYYY"
                    value={selectedDate}
                    // onChange={handleDateChange} //Commented 
                    enableAccessibleFieldDOMStructure={false}
                    slots={{
                      textField: (params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={showFieldErrors && !!formErrors.selectedDate}
                          helperText={showFieldErrors ? formErrors.selectedDate : ""}
                          value={dateInputValue}
                          onChange={handleDateInputChange}
                          placeholder="DD/MM/YYYY"
                        />
                      ),
                    }}
                  />
                </Grid>
                {/* Dropdown */}
                <Grid size={{ xs: 12, sm: 6 }}>

                  <div>
                    <FormControl fullWidth error={showFieldErrors && !!formErrors.selectedPerson}>
                      <InputLabel id="demo-multiple-checkbox-label">Authority</InputLabel>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={selectedPerson}
                        onChange={handleChange}
                        input={<OutlinedInput label="Name" />}
                        // renderValue={(selected) => selected.join(', ')}
                        renderValue={(selected) =>
                          authority
                            .filter((person) => selected.includes(String(person.uid)))
                            .map((person) => person.detail)
                            .join(", ")
                        }
                        MenuProps={MenuProps}
                      >

                        {authority.map((person, index) => (
                          <MenuItem key={index} value={String(person.uid)}  >
                            <Checkbox checked={selectedPerson.includes(person.uid)} />
                            <ListItemText primary={person.detail} />
                          </MenuItem>
                        ))}
                      </Select>
                      {showFieldErrors && formErrors.selectedPerson && (
                        <FormHelperText>{formErrors.selectedPerson}</FormHelperText>
                      )}
                    </FormControl>
                  </div>
                </Grid>
              </Grid>
            </Box>
          </LocalizationProvider>


          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              sx={{ minWidth: 120 }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </Box>

        </Box>



      )}


      <Snackbar
        open={setstudentfilled}
        autoHideDuration={6000}
        onClose={() => setSetstudentfilled(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          select student !
        </Alert>
      </Snackbar>
      {/* Validation Alert Snackbar */}
      <Snackbar
        open={showValidationAlert}
        autoHideDuration={6000}
        onClose={() => setShowValidationAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          Please select a date and authority before selecting students.
        </Alert>
      </Snackbar>

      <Snackbar
        open={submitSuccess}
        autoHideDuration={3000}
        onClose={() => setSubmitSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          submitted successfully!
        </Alert>
      </Snackbar>



    </Box>
  );
};

export default HostelActivityDetails;