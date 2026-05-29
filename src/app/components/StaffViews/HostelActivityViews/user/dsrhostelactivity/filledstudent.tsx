
// "use client";
// import React, { useMemo, useState } from "react";

// import {
//   Accordion,
//   AccordionDetails,
//   AccordionSummary,
//   Alert,
//   Box,
//   CardContent,
//   Grid,
//   LinearProgress,
//   Snackbar,
//   Stack,
//   Typography,
//   useTheme,
//   Chip,
//   Button,
//   Menu,
//   MenuItem,
// } from "@mui/material";
// import IconButton from '@mui/material/IconButton';
// import { IconBuildings, IconDownload } from "@tabler/icons-react";
// import { ApexOptions } from "apexcharts";
// import dynamic from "next/dynamic";
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
// import BlankCard from "@/app/components/shared/BlankCard";
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import ExcelJS from "exceljs";
// const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// interface DSRForm {
//   parentDiscussion: {
//     date: string;
//     method: string;
//     alternativeContact: {
//       mother: string;
//       father: string;
//       guardian: string;
//     };
//   };
//   officialObservation: string;
//   Attendence: string
//   counsellingRequired: string;
//   absentReason: string;
//   hostel: string;
//   name: string;
//   regd: string;
//   status: "pending" | "completed";
// }


// interface FlatDSRForm {
//   parentDiscussionDate: string;
//   parentDiscussionMethod: string;
//   alternativeContactMother: string;
//   alternativeContactFather: string;
//   alternativeContactGuardian: string;
//   officialObservation: string;
//   Attendence: string;
//   counsellingRequired: string;
//   absentReason: string;
//   hostel: string;
//   name: string;
//   regd: string;
//   status: "pending" | "completed";
// }

// // const Filledstudent = ({ checkedStudents }: { checkedStudents: Record<string, DSRForm> }) => {

// const Filledstudent = ({ checkedStudents }: { checkedStudents: Record<string, DSRForm> }) => {
//   const flatData: Record<string, FlatDSRForm> = Object.fromEntries(
//     Object.entries(checkedStudents).map(([key, value]) => [
//       key,
//       {
//         parentDiscussionDate: value.parentDiscussion.date,
//         parentDiscussionMethod: value.parentDiscussion.method,
//         alternativeContactMother: value.parentDiscussion.alternativeContact.mother,
//         alternativeContactFather: value.parentDiscussion.alternativeContact.father,
//         alternativeContactGuardian: value.parentDiscussion.alternativeContact.guardian,
//         officialObservation: value.officialObservation,
//         Attendence: value.Attendence,
//         counsellingRequired: value.counsellingRequired,
//         absentReason: value.absentReason,
//         hostel: value.hostel,
//         name: value.name,
//         regd: value.regd,
//         status: value.status,
//       },
//     ])
//   );


//   const [uploadSuccess, setUploadSuccess] = useState(false);
//   const theme = useTheme();
//   const [submitSuccess, setSubmitSuccess] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   // Convert the DSR forms object to an array
//   const dsrFormsArray = Object.values(checkedStudents);

//   // Group by hostel
//   const groupedByHostel = useMemo(() => {
//     const map: Record<string, DSRForm[]> = {};
//     dsrFormsArray.forEach((form) => {
//       // Ensure we have a valid hostel name from the form
//       const hostel = form.hostel || "Unknown Hostel"; // Provide a better default if needed
//       if (!map[hostel]) map[hostel] = [];
//       map[hostel].push(form);
//     });
//     return map;
//   }, [checkedStudents]);

//   const hostelNames = Object.keys(groupedByHostel);
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const open = Boolean(anchorEl);

//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleDownloadPDF = () => {
//     handleClose();
//     downloadPDF();
//   };

//   const handleDownloadExcel = () => {
//     handleClose();
//     handleExport();
//   };
//   const downloadPDF = () => {
//     const doc = new jsPDF();

//     doc.setFontSize(18);
//     doc.text('DSR Forms Report', 14, 22);
//     doc.setFontSize(12);
//     doc.text(`Total Students: ${dsrFormsArray.length}`, 14, 30);

//     const headers = [
//       ['Name', 'Reg No', 'Hostel', 'Discussion Date', 'Method', 'Observation', 'CounsellingRequired', 'Attendence ', 'Absent Reason']
//     ];

//     const data = dsrFormsArray.map(form => [
//       form.name,
//       form.regd,
//       form.hostel,
//       form.parentDiscussion.date || 'N/A',
//       form.parentDiscussion.method || 'N/A',
//       form.officialObservation || 'N/A',
//       form.counsellingRequired || 'N/A',
//       form.Attendence === 'Present' ? 'Present' : 'Absent',
//       form.absentReason || 'N/A'
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

//     doc.save('dsr_forms_report.pdf');
//     setUploadSuccess(true);
//   };



//   const handleExport = async () => {
//     if (!dsrFormsArray || dsrFormsArray.length === 0) return;

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("DSR Report");

//     // Add header row
//     worksheet.addRow([
//       "Name",
//       "Reg No",
//       "Hostel",
//       "Discussion Date",
//       "Method",
//       "Observation",
//       "Counselling Required",
//       "Attendance",
//       "Absent Reason",
//     ]);

//     // Add student rows
//     dsrFormsArray.forEach((form) => {
//       worksheet.addRow([
//         form.name,
//         form.regd,
//         form.hostel,
//         form.parentDiscussion.date || "N/A",
//         form.parentDiscussion.method || "N/A",
//         form.officialObservation || "N/A",
//         form.counsellingRequired || "N/A",
//         form.Attendence === "Present" ? "Present" : "Absent",
//         form.absentReason || "N/A",
//       ]);
//     });

//     // Optional: style header
//     const headerRow = worksheet.getRow(1);
//     headerRow.font = { bold: true };
//     headerRow.alignment = { horizontal: "center" };

//     // Generate Excel file and trigger download in browser
//     const buffer = await workbook.xlsx.writeBuffer();
//     const blob = new Blob([buffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "dsr_forms_report.xlsx";
//     a.click();
//     window.URL.revokeObjectURL(url);

//     setUploadSuccess(true);
//   };

//   const handleSubmit = async () => {
//     if (dsrFormsArray.length === 0) return;

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
//       console.log('Submitted students:', dsrFormsArray);
//        console.log("daaaa",flatData);
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
//           Completed DSR Forms ({dsrFormsArray.length})
//         </Typography>

//         {dsrFormsArray.length > 0 && (
//           <>
//             <IconButton
//               color="primary"
//               sx={{
//                 py: 0.5,
//                 fontSize: "0.75rem",
//                 whiteSpace: "nowrap",
//                 marginBottom: 2,
//               }}
//               onClick={handleClick}
//             >
//               <IconDownload width={22} />
//             </IconButton>

//             <Menu
//               anchorEl={anchorEl}
//               open={open}
//               onClose={handleClose}
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

//             <Snackbar
//               open={uploadSuccess}
//               autoHideDuration={3000}
//               onClose={() => setUploadSuccess(false)}
//               anchorOrigin={{ vertical: "top", horizontal: "center" }}
//             >
//               <Alert severity="success" sx={{ width: "100%" }}>
//                 Report downloaded successfully!
//               </Alert>
//             </Snackbar>
//           </>
//         )}
//       </Box>

//       {dsrFormsArray.length === 0 ? (
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
//             No DSR Forms Found
//           </Typography>
//           <Typography variant="body2" color="text.secondary" mt={1}>
//             You haven't completed any DSR forms yet.
//           </Typography>
//         </Box>
//       ) : (
//         hostelNames.map((hostel) => (
//           <Accordion key={hostel} sx={{ mb: 2 }}>
//             <AccordionSummary>
//               <Box sx={{
//                 width: "100%",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 px: 2,
//               }}>
//                 <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
//                   <IconBuildings size={16} style={{ marginRight: 6 }} />
//                   {hostel.toUpperCase()} ({groupedByHostel[hostel].length})
//                 </Typography>
//               </Box>
//             </AccordionSummary>

//             <AccordionDetails>
//               <Scrollbar sx={{ height: "440px" }}>
//                 <Grid container spacing={2}>
//                   {groupedByHostel[hostel].map((form) => (
//                     <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={`${form.hostel}-${form.regd}`}>
//                       <BlankCard sx={{
//                         transition: "all 0.2s ease-in-out",
//                         "&:hover": {
//                           transform: "scale(1.01)",
//                           boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
//                         },
//                       }}>
//                         <CardContent>
//                           <Stack spacing={2}>
//                             <Box display="flex" justifyContent="space-between" alignItems="center">
//                               <Typography variant="h6">{form.name}</Typography>
//                               {form.status === 'completed' ? (
//                                 <Box display="flex" alignItems="center">
//                                   <CheckCircleIcon color="success" fontSize="small" />
//                                   {/* <Typography variant="body2" color="success.main" ml={0.5}>
//             Completed
//           </Typography> */}
//                                 </Box>
//                               ) : (
//                                 <Box display="flex" alignItems="center">
//                                   <AccessTimeIcon color="warning" fontSize="small" />
//                                   <Typography variant="body2" color="warning.main" ml={0.5}>
//                                     Pending
//                                   </Typography>
//                                 </Box>
//                               )}
//                             </Box>

//                             <Typography variant="body2">Reg No: {form.regd}</Typography>
//                             <Typography variant="body2">Hostel: {form.hostel}</Typography>

//                             {form.parentDiscussion.date && (
//                               <Box mt={1}>
//                                 <Typography variant="subtitle2" color="text.secondary">Parent Discussion:</Typography>
//                                 <Stack spacing={0.5} mt={0.5}>
//                                   <Typography variant="body2">
//                                     <span style={{ fontWeight: 500 }}>Date:</span> {form.parentDiscussion.date || 'N/A'}
//                                   </Typography>
//                                   <Typography variant="body2">
//                                     <span style={{ fontWeight: 500 }}>Method:</span> {form.parentDiscussion.method || 'N/A'}
//                                   </Typography>
//                                   {form.parentDiscussion.alternativeContact.mother && (
//                                     <Typography variant="body2">
//                                       <span style={{ fontWeight: 500 }}>Mother's Contact:</span> {form.parentDiscussion.alternativeContact.mother}
//                                     </Typography>
//                                   )}
//                                   {form.parentDiscussion.alternativeContact.father && (
//                                     <Typography variant="body2">
//                                       <span style={{ fontWeight: 500 }}>Father's Contact:</span> {form.parentDiscussion.alternativeContact.father}
//                                     </Typography>
//                                   )}
//                                   {form.parentDiscussion.alternativeContact.guardian && (
//                                     <Typography variant="body2">
//                                       <span style={{ fontWeight: 500 }}>Guardian's Contact:</span> {form.parentDiscussion.alternativeContact.guardian}
//                                     </Typography>
//                                   )}
//                                 </Stack>
//                               </Box>
//                             )}

//                             {form.officialObservation && (
//                               <Box mt={1}>
//                                 <Typography variant="subtitle2" color="text.secondary">Official Observation:</Typography>
//                                 <Box bgcolor="action.hover" p={1} borderRadius={1} mt={0.5}>
//                                   <Typography variant="body2">{form.officialObservation}</Typography>
//                                 </Box>
//                               </Box>
//                             )}

//                             <Box mt={1}>
//                               <Typography variant="subtitle2" color="text.secondary">Student Status:</Typography>
//                               <Stack spacing={0.5} mt={0.5}>
//                                 <Typography variant="body2">
//                                   <span style={{ fontWeight: 500 }}>Attendance:</span> {form.Attendence === 'Present' ? (
//                                     <span style={{ color: 'green' }}>Present</span>
//                                   ) : (
//                                     <span style={{ color: 'red' }}>Absent</span>
//                                   )}
//                                 </Typography>
//                                 {form.Attendence === 'Absent' && form.absentReason && (
//                                   <Typography variant="body2">
//                                     <span style={{ fontWeight: 500 }}>Reason:</span> {form.absentReason}
//                                   </Typography>
//                                 )}
//                                 <Typography variant="body2">
//                                   <span style={{ fontWeight: 500 }}>Counselling Required:</span> {form.counsellingRequired}
//                                 </Typography>
//                               </Stack>
//                             </Box>
//                           </Stack>
//                         </CardContent>
//                       </BlankCard>
//                     </Grid>
//                   ))}
//                 </Grid>
//               </Scrollbar>
//             </AccordionDetails>
//           </Accordion>


//         ))


//       )}
//         {dsrFormsArray.length > 0 && (
//       <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleSubmit}
//           disabled={isSubmitting}
//           sx={{ minWidth: 120 }}
//         >
//           {isSubmitting ? 'Submitting...' : 'Submit'}
//         </Button>
//       </Box>
//         )}
//       <Snackbar
//         open={submitSuccess}
//         autoHideDuration={3000}
//         onClose={() => setSubmitSuccess(false)}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert severity="success" sx={{ width: "100%" }}>
//           submitted successfully!
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default Filledstudent;






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


import { Theme } from '@mui/material/styles';
import { gethostelauthorityAction } from "@/app/actions/StaffActions/hostalActivityAction/admin/getAuthorityAction";
import { gethostelactivityadmincheckedAction } from "@/app/actions/StaffActions/hostalActivityAction/admin/getadmincheckedAction";
import { getdsrcheckedAction } from "@/app/actions/StaffActions/hostalActivityAction/dsr/checkeddsrAction";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
interface Student {
  id: number;
  registerationNumber: string;
  name: string;
  current_Attendance: string;
  hostelAttendance: string;
  deliveredLacture: string;
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
        const response = await getdsrcheckedAction();
        // const reposeauthrity = await gethostelauthorityAction();
        const token = String(session?.user?.token).split("NEXT2121ANG")[1];
        if (response.status === "success") {
          const decrypted = decryptDataforResponse(response.ApiData, token);
          // const decryptedauthority = decryptDataforResponse(reposeauthrity.ApiData, token);
          // const parsed1 = JSON.parse(decryptedauthority);
          // console.log("Fetched Authority Data:", parsed1);
          // setauthority(parsed1);
          const parsed = JSON.parse(decrypted);
          console.log(" Dsr completed:", parsed);
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
  //         const regdMatch = String(s.registerationNumber || "").includes(searchValue);
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
          const regdMatch = String(s.registerationNumber || "").includes(searchValue);
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



  // const filteredProfiles = useMemo(() => {
  //   const lowerSearch = search.trim().toLowerCase();
  //   return profiles
  //     .filter((profile) => !selectedCategory || profile.hostel === selectedCategory)
  //     .map((profile) => {
  //       const hostelMatch = profile.hostel?.toLowerCase().includes(lowerSearch);
  //       const filteredStudents = profile.students?.filter((s: any) => {
  //         const nameMatch = s.name?.toLowerCase().includes(lowerSearch);
  //         const regdMatch = String(s.registerationNumber || "").toLowerCase().includes(lowerSearch);
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
          const regdMatch = String(s.registerationNumber || "").toLowerCase().includes(lowerSearch);
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



  // const chipCounts = useMemo(() => {
  //   const lowerSearch = search.trim().toLowerCase();
  //   return profiles.reduce((acc, profile) => {
  //     const count = profile.students.filter((s: any) => {
  //       const nameMatch = s.name?.toLowerCase().includes(lowerSearch);
  //       const regdMatch = String(s.registerationNumber || "").toLowerCase().includes(lowerSearch);
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
        'Registration Number': student.registerationNumber || 'N/A',
        'Student Name': student.name || 'N/A',
        'Hostel': profile.hostel || 'N/A',
        'Current Attendance (%)': student.current_Attendance || '0',
        'Hostel Attendance (%)': student.hostelAttendance || '0',
        'Delivered Lectures': student.deliveredLacture || '0',
        'Attendance Status': student.attendace || 'N/A',
        'Attendance Date': formatDate(student.attendaceOn),
        'Absent Reason': student.absentReason || 'N/A',
        'IsConnectedwithParents': student.isConnectedWithParents || 'N/A',
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
    doc.text("Session-Completed-Report", 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${currentDate} | Total Students: ${totalStudents}`, 14, 30);

    const flattenedData = flattenStudentsData(profiles);

    const headers = [
      'Reg No', 'Name', 'Hostel', 'Status',
      'Current Att(%)', 'Hostel Att(%)', 'Lectures',
      'IsConnectedwithParents', 'Session Date', 'Duty Person'
    ];

    const data = flattenedData.map(student => [
      student['Registration Number'],
      student['Student Name'],
      student['Hostel'],
      student['Attendance Status'],
      student['Current Attendance (%)'],
      student['Hostel Attendance (%)'],
      student['Delivered Lectures'],
      student['IsConnectedwithParents'],
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

    doc.save(`Session-Completed-Report-${currentDate.replace(/\//g, '-')}.pdf`);
    setUploadSuccess(true);
    setAnchorEl(null);
  };

  const handleExport = async () => {
    if (!profiles || profiles.length === 0) return;

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Session-Completed-Report");

      const headers = [
        'Registration Number', 'Student Name', 'Hostel', 'Current Attendance (%)',
        'Hostel Attendance (%)', 'Delivered Lectures', 'Attendance Status',
        'Attendance Date', 'Absent Reason', 'IsConnectedwithParents',
        'Connected With', 'Mobile Number', 'Discussion with Parents',
        'Final Feedback', 'Counselling Required', 'Session Date', 'Duty Person'
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
      a.download = `Session-Completed-Report-${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;
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
              {profiles.map(({ hostel, dutyperson, sessionOn, }) => {
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
                            <Typography variant="caption" sx={{ display: "block" }}>
                              Session: {formatDate(sessionOn)} | Duty Person: {dutyperson || "N/A"}
                            </Typography>
                            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1, mx: 1 }}>

                            </Box>


                          </Box>
                        </AccordionSummary >
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
                                const studentAttendance = Number(student.
                                  current_Attendance) || 0;
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
                                                {student.registerationNumber}
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
                                          <Box display="flex" alignItems="center" mt={1} justifyContent="center">
                                            <Typography variant="caption" color={student.attendace === "Present" ? "success.main" : "error.main"}>
                                              {student.attendace}
                                            </Typography>
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