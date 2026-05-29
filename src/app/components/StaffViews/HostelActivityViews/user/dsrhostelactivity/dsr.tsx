



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
  Modal,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  IconButton,
  StepContent,
  Stepper,
  Step,
  StepLabel,
  Tooltip,
  Alert,
  Menu,
  Snackbar
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { IconBuildings, IconChevronDown, IconDownload } from "@tabler/icons-react";
import { gethostelactivitydsrAction } from "@/app/actions/StaffActions/hostalActivityAction/dsr/getDsrAction";
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import { useSession } from "next-auth/react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import * as Yup from "yup";
import { savedsrAction } from "@/app/actions/StaffActions/hostalActivityAction/dsr/savedsrAction";
import { fetchData } from "next-auth/client/_utils";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
const muiColors = ["primary", "secondary", "success", "warning", "error", "info"] as const;
const BATCH_SIZE = 10;

// interface Student {
//   id: string,
//   name: string;
//   regd: string;
//   att: string;
//   hostel: string;
//   room?: string;
//   feeDue?: string;
//   status?: string;
//   hostelAttendance?: number;
//   deliveredLecture?: number;
//   roomNumber?:string;
// }

// interface ParentDiscussion {
//   isconnected: "yes" | "no";
//   connectedwith: string;
//   connectedno: string;
//   parentobservation: string;
// }

// interface DSRForm {
//   id: string,
//   hostel: string;
//   name: string;
//   regd: string;
//   Attendence: string;
//   absentReason: string;
//   absentReasonDetails?: string; // Add this field
//   officialObservation: string;
//   counsellingRequired: "yes" | "no";
//   status: "pending" | "completed";
//   parentDiscussion: ParentDiscussion;
//   sessionOn: string;
//   dutyperson: string | null;
// }



// const DSRFollowUp = ({ onDataFetched }: any) => {
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState<boolean>(true);
//   const [filtering, setFiltering] = useState(false);
//   const [checkedStudents, setCheckedStudents] = useState<any[]>([]);
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
//   const [isRotating, setIsRotating] = React.useState(false);
//   const [openModal, setOpenModal] = useState(false);
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});
//   const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
//   const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
//   const [currentStudentList, setCurrentStudentList] = useState<Student[]>([]);
//   const [totalStudents, setTotalStudents] = useState(0);
//   const [dsrForms, setDsrForms] = useState<Record<string, DSRForm>>({});
//   const theme = useTheme();
//   const [refresh, setRefresh] = useState(false);
//   const [uploadSuccess, setUploadSuccess] = useState(false);
//     const [showFieldErrors, setShowFieldErrors] = useState(false);
//     const [snackbarOpen, setSnackbarOpen] = useState(false);
//     const [snackbarMessage, setSnackbarMessage] = useState("");
//   const formatDate = (dateString: string) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   const initializeFormData = (student: Student, profileData: any): DSRForm => ({
//     id: student.id,
//     hostel: student.hostel,
//     name: student.name,
//     regd: student.regd,
//     Attendence: "Absent",
//     absentReason: "",
//     absentReasonDetails: "", // Initialize this field
//     counsellingRequired: "no",
//     status: "pending",
//     parentDiscussion: {
//       isconnected: "no",
//       connectedwith: "",
//       connectedno: "",
//       parentobservation: ""
//     },
//     officialObservation: "",
//     sessionOn: formatDate(profileData.sessionOn),
//     dutyperson: profileData.dutyperson
//   });
//   const validateStep = (step: number): boolean => {
//     if (!currentStudent) return false;

//     const form = dsrForms[currentStudent.regd];
//     const errors: Record<string, string> = {};

//     switch (step) {
//       case 0: // Attendance Status
//         if (!form.Attendence) {
//           errors.Attendence = "Attendance status is required";
//         }
//         if (form.Attendence === "Absent" && !form.absentReason) {
//           errors.absentReason = "Absent reason is required when student is absent";
//         }
//         // Add validation for absent reason details when "other" is selected
//         if (form.Attendence === "Absent" && form.absentReason === "other" && !form.absentReasonDetails) {
//           errors.absentReasonDetails = "Please provide details for absent reason";
//         }
//         break;

//       case 1: // Parent Discussion (only for Present case)
//         if (form.Attendence === "Present") {
//           if (!form.parentDiscussion.isconnected) {
//             errors.isconnected = "Connection status is required";
//           }
//           if (form.parentDiscussion.isconnected === "yes") {
//             if (!form.parentDiscussion.connectedwith) {
//               errors.connectedwith = "Connected with is required";
//             }
//             if (!form.parentDiscussion.connectedno) {
//               errors.connectedno = "Contact number is required";
//             }
//             if (!form.parentDiscussion.parentobservation) {
//               errors.parentobservation = "Parent observation is required";
//             }
//           }
//         }
//         break;

//       case 2: // Official Observation (only for Present case)
//         if (form.Attendence === "Present" && !form.officialObservation) {
//           errors.officialObservation = "Official observation is required";
//         }
//         if (form.Attendence === "Present" && !form.counsellingRequired) {
//           errors.counsellingRequired = "Counselling requirement is required";
//         }
//         break;

//       case 3: // Review (no validation needed)
//         break;
//     }

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleOpenModal = (student: Student, index: number) => {
//     const allStudents = filteredProfiles.flatMap(profile => profile.students);
//     setCurrentStudentList(allStudents);
//     setCurrentStudentIndex(allStudents.findIndex(s => s.regd === student.regd));
//     setCurrentStudent(student);
//     setFormErrors({});

//     // Find the profile data for this student
//     const profileData = profiles.find(p => p.hostel === student.hostel);

//     if (!dsrForms[student.regd]) {
//       setDsrForms(prev => ({
//         ...prev,
//         [student.regd]: initializeFormData(student, profileData || { sessionOn: "", dutyperson: null })
//       }));
//     }
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setActiveStep(0);
//     setFormErrors({});
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     if (!currentStudent) return;

//     setDsrForms(prev => ({
//       ...prev,
//       [currentStudent.regd]: {
//         ...prev[currentStudent.regd],
//         [name]: value
//       }
//     }));

//     // Clear error when field is updated
//     if (formErrors[name]) {
//       setFormErrors(prev => ({
//         ...prev,
//         [name]: ""
//       }));
//     }
//   };

//   const handleParentDiscussionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     if (!currentStudent) return;

//     setDsrForms(prev => ({
//       ...prev,
//       [currentStudent.regd]: {
//         ...prev[currentStudent.regd],
//         parentDiscussion: {
//           ...prev[currentStudent.regd].parentDiscussion,
//           [name]: value
//         }
//       }
//     }));

//     if (formErrors[name]) {
//       setFormErrors(prev => ({
//         ...prev,
//         [name]: ""
//       }));
//     }
//   };

//   const handleSelectChange = (e: any) => {
//     const { name, value } = e.target;
//     if (!currentStudent) return;

//     if (name === "connectedwith") {
//       // Handle dropdown change for connectedwith
//       setDsrForms(prev => ({
//         ...prev,
//         [currentStudent.regd]: {
//           ...prev[currentStudent.regd],
//           parentDiscussion: {
//             ...prev[currentStudent.regd].parentDiscussion,
//             [name]: value
//           }
//         }
//       }));
//     } else {
//       // Handle other select changes
//       setDsrForms(prev => ({
//         ...prev,
//         [currentStudent.regd]: {
//           ...prev[currentStudent.regd],
//           [name]: value
//         }
//       }));
//     }

//     if (formErrors[name]) {
//       setFormErrors(prev => ({
//         ...prev,
//         [name]: ""
//       }));
//     }
//   };

//   const [activeStep, setActiveStep] = useState(0);

//   const steps = [
//     'Attendance Status',
//     'Parent Discussion',
//     'Official Observation',
//     'Review & Submit'
//   ];

//   const handleNext = () => {
//     if (validateStep(activeStep)) {
//       // If student is absent, skip parent discussion and official observation steps
//       if (currentStudent && dsrForms[currentStudent.regd]?.Attendence === "Absent") {
//         handleSubmit();
//         if (activeStep === 0) {
//           setActiveStep(3); // Skip directly to review step
//         } else {
//           setActiveStep((prevActiveStep) => prevActiveStep + 1);
//         }
//       } else {
//         setActiveStep((prevActiveStep) => prevActiveStep + 1);
//       }
//     }
//   };

//   const handleBack = () => {
//     // If student is absent and we're on review step, go back to attendance step
//     if (currentStudent && dsrForms[currentStudent.regd]?.Attendence === "Absent" && activeStep === 3) {
//       setActiveStep(0);
//     } else {
//       setActiveStep((prevActiveStep) => prevActiveStep - 1);
//     }
//     setFormErrors({});
//   };

//   const handleStep = (step: number) => () => {
//     // If student is absent, only allow navigation to step 0 and 3
//     if (currentStudent && dsrForms[currentStudent.regd]?.Attendence === "Absent") {
//       if (step === 0 || step === 3) {
//         setActiveStep(step);
//         setFormErrors({});
//       }
//     } else if (step <= activeStep) {
//       setActiveStep(step);
//       setFormErrors({});
//     }
//   };
//   // const handleSubmit = async () => {
//   //   if (!currentStudent) return;

//   //   const updatedForm = {
//   //     ...dsrForms[currentStudent.regd],
//   //     status: "completed" as const
//   //   };

//   //   // If student is absent, ensure all parameters exist but with empty/default values
//   //   if (updatedForm.Attendence === "Absent") {
//   //     updatedForm.parentDiscussion = {
//   //       isconnected: "no",
//   //       connectedwith: "",
//   //       connectedno: "",
//   //       parentobservation: ""
//   //     };
//   //     updatedForm.officialObservation = "";
//   //     updatedForm.counsellingRequired = "no";

//   //     // Combine absent reason with details if "other" is selected
//   //     if (updatedForm.absentReason === "other" && updatedForm.absentReasonDetails) {
//   //       updatedForm.absentReason = `other :: ${updatedForm.absentReasonDetails}`;
//   //     }
//   //   }

//   //   setDsrForms(prev => ({
//   //     ...prev,
//   //     [currentStudent.regd]: updatedForm
//   //   }));


//   //   const submittedData = {
//   //     "id": updatedForm.id,
//   //     "Attendence": updatedForm.Attendence,
//   //     "absentReason": updatedForm.absentReason,
//   //     "counsellingRequired": updatedForm.counsellingRequired,
//   //     "isconnected": updatedForm.parentDiscussion.isconnected,
//   //     "connectedwith": updatedForm.parentDiscussion.connectedwith,
//   //     "connectedno": updatedForm.parentDiscussion.connectedno,
//   //     "parentdiscussionobservation": updatedForm.parentDiscussion.parentobservation,
//   //     "officialObservation": updatedForm.officialObservation,
//   //   };

//   //   console.log("DSR Form submitted:", submittedData);
//   //   const credentialsJson = JSON.stringify(submittedData);
//   //   console.log("credentialsJsondsr", credentialsJson);

//   //   if (!session || !session.user || !session.user.token) {
//   //     throw new Error("Session or token is missing");
//   //   }
//   //   let splitValue = session.user.token.split("NEXT2121ANG");
//   //   const { Data } = encryptData(credentialsJson, splitValue[1]);

//   //   console.log("Encrypted Data:", Data);


//   //   const response = await savedsrAction(Data);

//   //   const token = String(session?.user?.token).split("NEXT2121ANG")[1];
//   //   const decrypted = decryptDataforResponse(response.ApiData, token);
//   //   const parsed = JSON.parse(decrypted);
//   //   console.log("save data responsedsr", parsed);
//   //   // console.log("save data respons of completed", parsed[0].type);
//   //   // useEffect(() => {fetchData;})
//   //   fetchData;

//   //   handleCloseModal();

//   // };

//   const handleSubmit = async () => {
//   if (!currentStudent) return;

//   const updatedForm = {
//     ...dsrForms[currentStudent.regd],
//     status: "completed" as const
//   };

//   if (updatedForm.Attendence === "Absent") {
//     updatedForm.parentDiscussion = {
//       isconnected: "no",
//       connectedwith: "",
//       connectedno: "",
//       parentobservation: ""
//     };
//     updatedForm.officialObservation = "";
//     updatedForm.counsellingRequired = "no";

//     if (updatedForm.absentReason === "other" && updatedForm.absentReasonDetails) {
//       updatedForm.absentReason = `other :: ${updatedForm.absentReasonDetails}`;
//     }
//   }

//   setDsrForms(prev => ({
//     ...prev,
//     [currentStudent.regd]: updatedForm
//   }));

//   const submittedData = {
//     id: updatedForm.id,
//     Attendence: updatedForm.Attendence,
//     absentReason: updatedForm.absentReason,
//     counsellingRequired: updatedForm.counsellingRequired,
//     isconnected: updatedForm.parentDiscussion.isconnected,
//     connectedwith: updatedForm.parentDiscussion.connectedwith,
//     connectedno: updatedForm.parentDiscussion.connectedno,
//     parentdiscussionobservation: updatedForm.parentDiscussion.parentobservation,
//     officialObservation: updatedForm.officialObservation
//   };

//   console.log("DSR Form submitted:", submittedData);
//   const credentialsJson = JSON.stringify(submittedData);

//   if (!session?.user?.token) {
//     throw new Error("Session or token is missing");
//   }

//   const splitValue = session.user.token.split("NEXT2121ANG");
//   const { Data } = encryptData(credentialsJson, splitValue[1]);

//   const response = await savedsrAction(Data);

//   const token = String(session.user.token).split("NEXT2121ANG")[1];
//   const decrypted = decryptDataforResponse(response.ApiData, token);
//   const parsed = JSON.parse(decrypted);
//   console.log("save data responsedsr", parsed);
//    setSnackbarMessage('submitted sucessfully!');
//    setSnackbarOpen(true);


//   // 🔥 after save, refetch immediately
//   await fetchData();

//   handleCloseModal();
// };

//   const handlePreviousStudent = () => {
//     if (currentStudentIndex > 0) {
//       const prevIndex = currentStudentIndex - 1;
//       const prevStudent = currentStudentList[prevIndex];
//       setCurrentStudentIndex(prevIndex);
//       setCurrentStudent(prevStudent);
//       setFormErrors({});
//       setActiveStep(0);

//       const profileData = profiles.find(p => p.hostel === prevStudent.hostel);

//       if (!dsrForms[prevStudent.regd]) {
//         setDsrForms(prev => ({
//           ...prev,
//           [prevStudent.regd]: initializeFormData(prevStudent, profileData || { sessionOn: "", dutyperson: null })
//         }));
//       }
//     }
//   };

//   const handleNextStudent = () => {
//     if (currentStudentIndex < currentStudentList.length - 1) {
//       const nextIndex = currentStudentIndex + 1;
//       const nextStudent = currentStudentList[nextIndex];
//       setCurrentStudentIndex(nextIndex);
//       setCurrentStudent(nextStudent);
//       setFormErrors({});
//       setActiveStep(0);

//       const profileData = profiles.find(p => p.hostel === nextStudent.hostel);

//       if (!dsrForms[nextStudent.regd]) {
//         setDsrForms(prev => ({
//           ...prev,
//           [nextStudent.regd]: initializeFormData(nextStudent, profileData || { sessionOn: "", dutyperson: null })
//         }));
//       }
//     }
//   };



//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     if (isDataFetched.current) return;
//   //     setLoading(true);
//   //     try {
//   //       const response = await gethostelactivitydsrAction();
//   //       const token = String(session?.user?.token).split("NEXT2121ANG")[1];
//   //       if (response.status === "success") {
//   //         const decrypted = decryptDataforResponse(response.ApiData, token);
//   //         const parsed = JSON.parse(decrypted);
//   //         console.log("Fetched DSR Data:", parsed);
//   //         const total = parsed.reduce((sum: number, hostel: any) => {
//   //           return sum + (hostel.students?.length || 0);
//   //         }, 0);
//   //         setTotalStudents(total);

//   //         const validatedProfiles = parsed.map((profile: any) => ({
//   //           ...profile,
//   //           students: profile.students.map((student: any) => ({
//   //             ...student,
//   //             hostel: profile.hostel
//   //           }))
//   //         }));

//   //         setHostel(validatedProfiles);
//   //         onDataFetched?.(validatedProfiles);

//   //         const initialCounts: Record<string, number> = {};
//   //         validatedProfiles.forEach((profile: any) => {
//   //           initialCounts[profile.hostel] = BATCH_SIZE;
//   //         });
//   //         setVisibleCounts(initialCounts);
//   //       } else {
//   //         setError(response.message);
//   //       }
//   //     } catch (err) {
//   //       setError(err instanceof Error ? err.message : "Unknown error");
//   //     } finally {
//   //       setLoading(false);
//   //       isDataFetched.current = true;
//   //     }
//   //   };

//   //   fetchData();
//   // }, [onDataFetched, session]);



//   const fetchData = async () => {
//   setLoading(true);
//   try {
//     const response = await gethostelactivitydsrAction();
//     const token = String(session?.user?.token).split("NEXT2121ANG")[1];
//     if (response.status === "success") {
//       const decrypted = decryptDataforResponse(response.ApiData, token);
//       const parsed = JSON.parse(decrypted);
//       console.log("pending DSR Data :", parsed);

//       const total = parsed.reduce((sum: number, hostel: any) => {
//         return sum + (hostel.students?.length || 0);
//       }, 0);
//       setTotalStudents(total);

//       const validatedProfiles = parsed.map((profile: any) => ({
//         ...profile,
//         students: profile.students.map((student: any) => ({
//           ...student,
//           hostel: profile.hostel
//         }))
//       }));

//       setHostel(validatedProfiles);
//       onDataFetched?.(validatedProfiles);

//       const initialCounts: Record<string, number> = {};
//       validatedProfiles.forEach((profile: any) => {
//         initialCounts[profile.hostel] = BATCH_SIZE;
//       });
//       setVisibleCounts(initialCounts);
//     } else {
//       setError(response.message);
//     }
//   } catch (err) {
//     setError(err instanceof Error ? err.message : "Unknown error");
//   } finally {
//     setLoading(false);
//   }
// };

// // useEffect runs once initially
// useEffect(() => {
//   fetchData();
// }, [onDataFetched, session]);




//   const dynamicColors = useMemo(() => {
//     const map: Record<string, typeof muiColors[number]> = {};
//     profiles.forEach((profile, index) => {
//       map[profile.hostel] = muiColors[index % muiColors.length];
//     });
//     return map;
//   }, [profiles]);

//   const handleChipClick = (category: string) => {
//     setSelectedCategory((prev) => (prev === category ? null : category));
//     setSearch("");
//     setFiltering(true);
//     setExpandedAccordions(prev => ({
//       ...prev,
//       [category]: true
//     }));

//     setFullDataHostels(prev => ({
//       ...prev,
//       [category]: true
//     }));

//     setTimeout(() => {
//       resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//       setFiltering(false);
//     }, 300);
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const searchValue = e.target.value;
//     setSearch(searchValue);
//     setFiltering(true);

//     if (searchValue.trim()) {
//       const matchingHostels: Record<string, boolean> = {};
//       profiles.forEach(profile => {
//         const hasMatch = profile.students.some((s: any) => {
//           const nameMatch = s.name?.toLowerCase().includes(searchValue.toLowerCase());
//           const regdMatch = String(s.regd || "").includes(searchValue);
//           return nameMatch || regdMatch;
//         });
//         if (hasMatch) matchingHostels[profile.hostel] = true;
//       });
//       setExpandedAccordions(matchingHostels);
//     } else {
//       setExpandedAccordions({});
//     }

//     setTimeout(() => {
//       resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//       setFiltering(false);
//     }, 300);
//   };

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
//     setExpandedAccordions(prev => ({
//       ...prev,
//       [hostel]: isExpanded
//     }));
//   };





//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//     const open = Boolean(anchorEl);

//     const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//       setAnchorEl(event.currentTarget);
//     };

//     const handleClose = () => {
//       setAnchorEl(null);
//     };

//     const handleDownloadPDF = () => {
//       handleClose();
//       downloadPDF();
//     };

//     const handleDownloadExcel = () => {
//       handleClose();
//       handleExport();
//     };

//    const flattenStudentsData = (profiles: any[]) => {
//     if (!profiles || profiles.length === 0) return [];

//     return profiles.flatMap(profile => 
//       profile.students?.map((student: Student) => ({
//         'Registration Number': student. regd || 'N/A',
//         'Student Name': student.name || 'N/A',
//         'Hostel': profile.hostel || 'N/A',
//         'Current Attendance (%)': student.att || '0',
//         'Hostel Attendance (%)': student.hostelAttendance || '0',
//         'Delivered Lectures': student.deliveredLecture || '0',

//         'Session Date': formatDate(profile.sessionOn),
//         'Duty Person': profile.dutyperson || 'N/A',
//         'RoomNo':student.roomNumber||'N/A'
//       })) || []
//     );
//   };

//   const downloadPDF = () => {
//     if (!profiles || profiles.length === 0) return;

//     const doc = new jsPDF();
//     const currentDate = new Date().toLocaleDateString();

//     doc.setFontSize(16);
//     doc.text("Pending-Students-For-Session", 14, 22);
//     doc.setFontSize(10);
//     doc.text(`Generated on: ${currentDate} | Total Students: ${totalStudents}`, 14, 30);

//     const flattenedData = flattenStudentsData(profiles);

//     const headers = [
//       'Reg No', 'Name', 'Hostel', 
//       'Current Att(%)', 'Hostel Att(%)', 'Lectures',
//        'Session Date','Duty Person','RoomNo'
//     ];

//     const data = flattenedData.map(student => [
//       student['Registration Number'],
//       student['Student Name'],
//       student['Hostel'],

//       student['Current Attendance (%)'],
//       student['Hostel Attendance (%)'],
//       student['Delivered Lectures'],

//       student['Session Date'],
//       student['Duty Person'],
//       student['RoomNo']
//     ]);

//     autoTable(doc, {
//       head: [headers],
//       body: data,
//       startY: 35,
//       theme: 'grid',
//       headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
//       styles: { fontSize: 8 }
//     });

//     doc.save(`Pending-Students-For-Session-${currentDate.replace(/\//g, '-')}.pdf`);
//     // setUploadSuccess(true);
//     setSnackbarOpen(true);
//      setSnackbarMessage('Report download  sucessfully');
//     setAnchorEl(null);
//   };

//   const handleExport = async () => {
//     if (!profiles || profiles.length === 0) return;

//     try {
//       const workbook = new ExcelJS.Workbook();
//       const worksheet = workbook.addWorksheet("Pending-Students-For-Session");

//       const headers = [
//         'Registration Number', 'Student Name', 'Hostel', 'Current Attendance (%)',
//         'Hostel Attendance (%)', 'Delivered Lectures',  'Session Date', 'Duty Person','RoomNo'
//       ];

//       worksheet.addRow(headers);

//       // Style header
//       const headerRow = worksheet.getRow(1);
//       headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
//       headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2B78E4' } };

//       // Add data
//       const flattenedData = flattenStudentsData(profiles);
//       flattenedData.forEach(student => {
//         worksheet.addRow(headers.map(header => student[header]));
//       });

//       // Auto-fit columns
//       worksheet.columns.forEach(column => {
//         column.width = 15;
//       });

//       const buffer = await workbook.xlsx.writeBuffer();
//       const blob = new Blob([buffer], {
//         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `Pending-Students-For-Session-${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;
//       a.click();
//       window.URL.revokeObjectURL(url);
//          setSnackbarMessage('Report download  sucessfully');
//       // setUploadSuccess(true);
//       setSnackbarOpen(true);
//       setAnchorEl(null);
//     } catch (error) {
//       console.error('Error generating Excel file:', error);
//       setSnackbarMessage('Error generating Excel file');
//       setSnackbarOpen(true);
//     }
//   };


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
//               {profiles.map(({ hostel, dutyperson, sessionOn,index }) => {
//                 const uniquehostelId = `${hostel}-${dutyperson}-${sessionOn}`;
//                 const count = chipCounts[hostel] || 0;
//                 return (
//                   <Grid key={uniquehostelId}>
//                     <Badge badgeContent={count} max={100000} color={dynamicColors[hostel] || "default"}>
//                       <Chip
//                         icon={<IconBuildings size={16} />}
//                         label={hostel.toUpperCase()}
//                         onClick={() => {
//                           handleChipClick(hostel);
//                           setFullDataHostels(prev => ({ ...prev, [hostel]: true }));
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
//           <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//           <Box display="flex" >
//             <Typography variant="h6" sx={{ p: 2, fontWeight: "bold", fontSize: 12 }}>Total Students :{totalStudents}</Typography>
//             <Typography variant="h6" sx={{ p: 2, fontWeight: "bold", fontSize: 12 }}>Total Hostel :{profiles.length}</Typography>
//           </Box>
//            <Box  >
//           {profiles.length > 0 && (
//   <>
//     <IconButton
//       color="primary"
//       sx={{ py: 0.5, fontSize: "0.75rem", mb: 2 }}
//       onClick={handleClick}
//     >
//       <IconDownload width={22} />
//     </IconButton>

//     <Menu
//       anchorEl={anchorEl}
//       open={open}
//       onClose={() => setAnchorEl(null)}
//       anchorOrigin={{
//         vertical: "bottom",
//         horizontal: "right",
//       }}
//       transformOrigin={{
//         vertical: "top",
//         horizontal: "right",
//       }}
//     >
//       <MenuItem onClick={downloadPDF}>  {/* Changed from handleDownloadPDF */}
//         Download PDF
//       </MenuItem>
//       <MenuItem onClick={handleExport}>  {/* Changed from handleDownloadExcel */}
//         Download Excel
//       </MenuItem>
//     </Menu>

//     <Snackbar
//       open={snackbarOpen}
//       autoHideDuration={3000}
//       onClose={() => setSnackbarOpen(false)}
//       anchorOrigin={{ vertical: "top", horizontal: "center" }}
//     >
//       <Alert severity="success" sx={{ width: "100%" }}>
//         {/* Report downloaded successfully! */}
//         {snackbarMessage}

//       </Alert>
//     </Snackbar>
//   </>
// )}
//             </Box>
//           </Box>

//           {/* Search & Reset */}
//           <Grid container justifyContent="flex-end" spacing={1} sx={{ p: 2 }}>
//             <Grid >
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
//             <Grid >
//               <Chip
//                 icon={
//                   <RestartAltIcon
//                     sx={{
//                       animation: isRotating ? 'spin 1s linear infinite' : 'none',
//                       '@keyframes spin': {
//                         '0%': { transform: 'rotate(0deg)' },
//                         '100%': { transform: 'rotate(360deg)' }
//                       }
//                     }}
//                   />
//                 }
//                 label="Reset"
//                 color="error"
//                 clickable
//                 onClick={() => {
//                   setIsRotating(true);
//                   setSearch("");
//                   setAttendanceFilter(null);
//                   setSelectedCategory(null);
//                   setCheckedStudents([]);
//                   setHostelChecked({});
//                   setDsrForms({});
//                   setExpandedAccordions({});
//                   setTimeout(() => {
//                     resultsRef.current?.scrollIntoView({ behavior: "smooth" });
//                     setIsRotating(false);
//                   }, 1000);
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
//               {filteredProfiles.length === 0 ? (
//                 <Box
//                   display="flex"
//                   justifyContent="center"
//                   alignItems="center"
//                   minHeight="200px"
//                   flexDirection="column"
//                   sx={{ p: 3 }}
//                 >
//                   <Typography variant="h6" color="textSecondary" gutterBottom>
//                     No data found
//                   </Typography>
//                   <Typography variant="body2" color="textSecondary" textAlign="center">
//                     {search.trim() ?
//                       `No students match your search for "${search}"` :
//                       'No students available for the selected criteria'
//                     }
//                   </Typography>
//                 </Box>
//               ) : (
//                 <Scrollbar sx={{ height: "440px" }}>
//                   {filteredProfiles.map(({ hostel, students, sessionOn, dutyperson }) => (
//                     <Accordion key={`${hostel}-${dutyperson}-${sessionOn}`} sx={{
//                       transition: "all 0.2s ease-in-out",
//                       boxShadow: "0 2px 10px rgba(122, 112, 112, 0.08)",
//                       "&:hover": {
//                         transform: "scale(1.01)",
//                         boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
//                       },
//                     }} disableGutters expanded={expandedAccordions[hostel] || false}
//                       onChange={handleAccordionChange(hostel)}>
//                       <AccordionSummary expandIcon={<IconChevronDown />}>
//                         <Box
//                           sx={{
//                             width: "100%",
//                             display: "flex",
//                             justifyContent: "space-between",
//                             alignItems: "center",
//                           }}
//                         >
//                           <Box>
//                             <Typography variant="h6" sx={{ display: "flex", alignItems: "center", fontSize: "12px" }}>
//                               <IconBuildings size={16} style={{ marginRight: 6 }} />
//                               {hostel.toUpperCase()}
//                             </Typography>
//                             <Typography variant="caption" sx={{ display: "block" }}>
//                               Session: {formatDate(sessionOn)} | Duty Person: {dutyperson || "N/A"}
//                             </Typography>
//                           </Box>
//                           <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1, mx: 1 }}>

//                           </Box>

//                         </Box>
//                       </AccordionSummary>

//                       <AccordionDetails>
//                         <Grid container spacing={2}>
//                           {students
//                             .slice(0, fullDataHostels[hostel] ? students.length : (visibleCounts[hostel] || BATCH_SIZE))
//                             .map((student: any, index: number) => {
//                               const studentAttendance = Number(student.att) || 0;
//                               const hostelAttendance = Number(student.hostelAttendance) || 0;
//                               const mainColor = studentAttendance > 80 ?
//                                 theme.palette.success.main :
//                                 studentAttendance >= 50 ?
//                                   theme.palette.warning.main :
//                                   "#FF4D4D";
//                               const hostelColor = hostelAttendance > 80 ?
//                                 theme.palette.success.main :
//                                 hostelAttendance >= 50 ?
//                                   theme.palette.warning.main :
//                                   "#FF4D4D";
//                               const uniqueId = `${hostel}-${student.regd}-${index}`;

//                               const createChartOptions = (attendance: number, color: string): ApexOptions => ({
//                                 chart: {
//                                   type: "donut",
//                                   fontFamily: "'Plus Jakarta Sans', sans-serif;",
//                                   toolbar: { show: false },
//                                   height: 100,
//                                 },
//                                 labels: ["Attend", "Non-Attend"],
//                                 colors: [color, theme.palette.primary.light, "#F9F9FD"],
//                                 plotOptions: {
//                                   pie: {
//                                     donut: {
//                                       size: "83%",
//                                       background: "transparent",
//                                       labels: {
//                                         show: true,
//                                         name: { show: true, offsetY: 7 },
//                                         value: { show: false },
//                                         total: {
//                                           show: true,
//                                           color: theme.palette.mode === "dark" ? "white" : "black",
//                                           fontSize: "8px",
//                                           fontWeight: "600",
//                                           label: `${attendance}%`,
//                                         },
//                                       },
//                                     },
//                                   },
//                                 },
//                                 dataLabels: { enabled: false },
//                                 stroke: { show: false },
//                                 legend: { show: false },
//                                 tooltip: {
//                                   theme: theme.palette.mode === "dark" ? "dark" : "light",
//                                   fillSeriesColor: false,
//                                 },
//                               });

//                               const seriescolumnchart = (attendance: number) => [
//                                 attendance,
//                                 100 - attendance,
//                               ];

//                               const hasCompletedForm = dsrForms[student.regd]?.status === "completed";

//                               return (
//                                 <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={uniqueId}>
//                                   <CardContent
//                                     onClick={() => handleOpenModal(student, index)}
//                                     sx={{
//                                       transition: "all 0.2s ease-in-out",
//                                       boxShadow: "0 2px 10px rgba(122, 112, 112, 0.08)",
//                                       "&:hover": {
//                                         transform: "scale(1.01)",
//                                         boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
//                                         cursor: "pointer"
//                                       },
//                                       backgroundColor: hasCompletedForm ? "action.hover" : "background.paper",
//                                       border: hasCompletedForm ? `1px solid ${theme.palette.success.main}` : "none",
//                                       borderRadius: 1,
//                                       height: "100%"
//                                     }}
//                                   >
//                                     {/* Student Info */}
//                                     <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//                                       <Box width="50%">
//                                         <Tooltip title={student.name}>
//                                           <Typography variant="h6" noWrap>
//                                             {student.name}
//                                           </Typography>
//                                         </Tooltip>
//                                         {/* <Typography variant="caption">
//                                           Room No: {student.room || "N/A"}
//                                         </Typography> */}
//                                       </Box>
//                                       <Box width="50%" display="flex" flexDirection="column" alignItems="flex-end">
//                                         <Typography variant="caption">
//                                           {student.regd}
//                                         </Typography>
//                                         {/* <Typography variant="caption">
//                                           Fee Due: {student.feeDue || "N/A"}
//                                         </Typography> */}
//                                       </Box>
//                                     </Box>

//                                     {/* Attendance Charts */}
//                                     <Box display="flex" justifyContent="space-between">
//                                       <Box width="48%" display="flex" flexDirection="column" alignItems="center">
//                                         <Typography variant="caption">Class Atten</Typography>
//                                         <Chart
//                                           options={createChartOptions(studentAttendance, mainColor)}
//                                           series={seriescolumnchart(studentAttendance)}
//                                           type="donut"
//                                           width="100%"
//                                           height={80}
//                                         />
//                                       </Box>
//                                       <Box width="48%" display="flex" flexDirection="column" alignItems="center">
//                                         <Typography variant="caption">Hostel Atten</Typography>
//                                         <Chart
//                                           options={createChartOptions(hostelAttendance, hostelColor)}
//                                           series={seriescolumnchart(hostelAttendance)}
//                                           type="donut"
//                                           width="100%"
//                                           height={80}
//                                         />
//                                       </Box>
//                                     </Box>
//                                      <Box display="flex" justifyContent="space-between">
//                                       <Typography variant="caption" noWrap>
//                                         RoomNo:{student.roomNumber}
//                                       </Typography>
//                                      </Box>

//                                     <Box display="flex" justifyContent="space-between">
//                                       {/* <Typography variant="caption">
//                                         Status: {student.status || "N/A"}
//                                       </Typography> */}
//                                       {hasCompletedForm && (
//                                         <Typography variant="caption" color="success.main">
//                                           DSR Completed
//                                         </Typography>
//                                       )}
//                                     </Box>
//                                   </CardContent>
//                                 </Grid>
//                               );
//                             })}

//                           {!fullDataHostels[hostel] && students.length > (visibleCounts[hostel] || BATCH_SIZE) && (
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
//                         </Grid>
//                       </AccordionDetails>
//                     </Accordion>
//                   ))}
//                 </Scrollbar>
//               )}
//             </div>
//           )}

//           <Modal
//             open={openModal}
//             onClose={handleCloseModal}
//             aria-labelledby="dsr-form-modal"
//             aria-describedby="dsr-form-for-student"
//           >
//             <Box sx={{
//               position: "absolute",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//               width: { xs: "95%", sm: "90%", md: "80%", lg: "70%" },
//               bgcolor: "background.paper",
//               boxShadow: 24,
//               borderRadius: 2,
//               maxHeight: "90vh",
//               overflowY: "auto",
//               p: 3
//             }}>
//               {currentStudent && dsrForms[currentStudent.regd] && (
//                 <>

//                     <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//                       <Typography variant="h6" gutterBottom>
//                         DSR Official Section
//                       </Typography>
//                       <IconButton onClick={handleCloseModal}>
//                         <CloseIcon />
//                       </IconButton>
//                     </Box>
//    <Scrollbar sx={{ maxHeight: "80vh" }}>
//                     <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
//                       Student: {currentStudent.name} ({currentStudent.regd}) - {currentStudent.hostel}
//                     </Typography>

//                     {Object.keys(formErrors).length > 0 && (
//                       <Alert severity="error" sx={{ mb: 2 }}>
//                         Please fill all required fields.
//                       </Alert>
//                     )}

//                     <Stepper activeStep={activeStep} orientation="vertical">
//                       {/* Step 1: Attendance Status */}
//                       <Step>
//                         <StepLabel
//                           onClick={handleStep(0)}
//                           optional={dsrForms[currentStudent.regd].Attendence === "Absent" ?
//                             <Typography variant="caption">(Only this step required for absent students)</Typography> : null}
//                         >
//                           Attendance Status
//                         </StepLabel>
//                         <StepContent>
//                           <Card variant="outlined" sx={{ mb: 3 }}>
//                             <CardContent>
//                               <FormControl component="fieldset" sx={{ mt: 2, mb: 2 }} error={!!formErrors.Attendence}>
//                                 <FormLabel component="legend">Attendance *</FormLabel>
//                                 <RadioGroup
//                                   row
//                                   name="Attendence"
//                                   value={dsrForms[currentStudent.regd].Attendence}
//                                   onChange={handleInputChange}
//                                 >
//                                   <FormControlLabel value="Present" control={<Radio />} label="Present" />
//                                   <FormControlLabel value="Absent" control={<Radio />} label="Absent" />
//                                 </RadioGroup>
//                                 {formErrors.Attendence && (
//                                   <Typography variant="caption" color="error">
//                                     {formErrors.Attendence}
//                                   </Typography>
//                                 )}
//                               </FormControl>
//                               {dsrForms[currentStudent.regd].Attendence === "Absent" && (
//                                 <>
//                                   <FormControl fullWidth margin="normal" error={!!formErrors.absentReason}>
//                                     <InputLabel>Absent Reason *</InputLabel>
//                                     <Select
//                                       name="absentReason"
//                                       value={dsrForms[currentStudent.regd].absentReason}
//                                       onChange={handleSelectChange}
//                                       label="Absent Reason *"
//                                     >
//                                       <MenuItem value="longLeave">Long Leave</MenuItem>
//                                       <MenuItem value="termOff">Term off</MenuItem>
//                                       <MenuItem value="other">Any other</MenuItem>
//                                     </Select>
//                                     {formErrors.absentReason && (
//                                       <Typography variant="caption" color="error">
//                                         {formErrors.absentReason}
//                                       </Typography>
//                                     )}
//                                   </FormControl>

//                                   {/* Show text field when "other" is selected */}
//                                   {dsrForms[currentStudent.regd].absentReason === "other" && (
//                                     <TextField
//                                       fullWidth
//                                       label="Please specify absent reason *"
//                                       name="absentReasonDetails"
//                                       value={dsrForms[currentStudent.regd].absentReasonDetails || ""}
//                                       onChange={handleInputChange}
//                                       margin="normal"
//                                       error={!!formErrors.absentReasonDetails}
//                                       helperText={formErrors.absentReasonDetails}
//                                       multiline
//                                       rows={2}
//                                     />
//                                   )}
//                                 </>
//                               )}
//                               <Box sx={{ mb: 2 }}>
//                                 <Button
//                                   variant="contained"
//                                   onClick={handleNext}
//                                   sx={{ mt: 1, mr: 1 }}
//                                 >
//                                   {dsrForms[currentStudent.regd].Attendence === "Absent" ? "Skip to Review" : "Continue"}
//                                 </Button>
//                               </Box>
//                             </CardContent>
//                           </Card>
//                         </StepContent>
//                       </Step>

//                       {/* Step 2: Parent Discussion (Only for Present students) */}
//                       {dsrForms[currentStudent.regd].Attendence === "Present" && (
//                         <Step>
//                           <StepLabel onClick={handleStep(1)}>Parent Discussion</StepLabel>
//                           <StepContent>
//                             <Card variant="outlined" sx={{ mb: 3 }}>
//                               <CardContent>
//                                 <FormControl component="fieldset" sx={{ mt: 2, mb: 2 }} error={!!formErrors.isconnected}>
//                                   <FormLabel component="legend">Connected with Parent? *</FormLabel>
//                                   <RadioGroup
//                                     row
//                                     name="isconnected"
//                                     value={dsrForms[currentStudent.regd].parentDiscussion.isconnected}
//                                     onChange={handleParentDiscussionChange}
//                                   >
//                                     <FormControlLabel value="yes" control={<Radio />} label="Yes" />
//                                     <FormControlLabel value="no" control={<Radio />} label="No" />
//                                   </RadioGroup>
//                                   {formErrors.isconnected && (
//                                     <Typography variant="caption" color="error">
//                                       {formErrors.isconnected}
//                                     </Typography>
//                                   )}
//                                 </FormControl>

//                                 {dsrForms[currentStudent.regd].parentDiscussion.isconnected === "yes" && (
//                                   <>
//                                     <FormControl fullWidth margin="normal" error={!!formErrors.connectedwith}>
//                                       <InputLabel>Connected With *</InputLabel>
//                                       <Select
//                                         name="connectedwith"
//                                         value={dsrForms[currentStudent.regd].parentDiscussion.connectedwith}
//                                         onChange={handleSelectChange}
//                                         label="Connected With *"
//                                       >
//                                         <MenuItem value="Father">Father</MenuItem>
//                                         <MenuItem value="Mother">Mother</MenuItem>
//                                         <MenuItem value="Guardian">Guardian</MenuItem>
//                                       </Select>
//                                       {formErrors.connectedwith && (
//                                         <Typography variant="caption" color="error">
//                                           {formErrors.connectedwith}
//                                         </Typography>
//                                       )}
//                                     </FormControl>

//                                     <TextField
//                                       fullWidth
//                                       label="Contact Number *"
//                                       name="connectedno"
//                                       value={dsrForms[currentStudent.regd].parentDiscussion.connectedno}
//                                       onChange={handleParentDiscussionChange}
//                                       margin="normal"
//                                       error={!!formErrors.connectedno}
//                                       helperText={formErrors.connectedno}
//                                     />

//                                     <TextField
//                                       fullWidth
//                                       label="Parent Observation *"
//                                       name="parentobservation"
//                                       multiline
//                                       rows={3}
//                                       value={dsrForms[currentStudent.regd].parentDiscussion.parentobservation}
//                                       onChange={handleParentDiscussionChange}
//                                       margin="normal"
//                                       error={!!formErrors.parentobservation}
//                                       helperText={formErrors.parentobservation}
//                                     />
//                                   </>
//                                 )}

//                                 <Box sx={{ mb: 2 }}>
//                                   <Button
//                                     variant="contained"
//                                     onClick={handleNext}
//                                     sx={{ mt: 1, mr: 1 }}
//                                   >
//                                     Continue
//                                   </Button>
//                                   <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
//                                     Back
//                                   </Button>
//                                 </Box>
//                               </CardContent>
//                             </Card>
//                           </StepContent>
//                         </Step>
//                       )}

//                       {/* Step 3: Official Observation (Only for Present students) */}
//                       {dsrForms[currentStudent.regd].Attendence === "Present" && (
//                         <Step>
//                           <StepLabel onClick={handleStep(2)}>Official Observation</StepLabel>
//                           <StepContent>
//                             <Card variant="outlined" sx={{ mb: 3 }}>
//                               <CardContent>
//                                 <TextField
//                                   fullWidth
//                                   label="Official Observation *"
//                                   name="officialObservation"
//                                   multiline
//                                   rows={4}
//                                   value={dsrForms[currentStudent.regd].officialObservation}
//                                   onChange={handleInputChange}
//                                   margin="normal"
//                                   error={!!formErrors.officialObservation}
//                                   helperText={formErrors.officialObservation}
//                                 />
//                                 <FormControl component="fieldset" sx={{ mt: 2, mb: 2 }} error={!!formErrors.counsellingRequired}>
//                                   <FormLabel component="legend">Counselling Required? *</FormLabel>
//                                   <RadioGroup
//                                     row
//                                     name="counsellingRequired"
//                                     value={dsrForms[currentStudent.regd].counsellingRequired}
//                                     onChange={handleInputChange}
//                                   >
//                                     <FormControlLabel value="yes" control={<Radio />} label="Yes" />
//                                     <FormControlLabel value="no" control={<Radio />} label="No" />
//                                   </RadioGroup>
//                                   {formErrors.counsellingRequired && (
//                                     <Typography variant="caption" color="error">
//                                       {formErrors.counsellingRequired}
//                                     </Typography>
//                                   )}
//                                 </FormControl>

//                                 <Box sx={{ mb: 2 }}>
//                                   <Button
//                                     variant="contained"
//                                     onClick={handleNext}
//                                     sx={{ mt: 1, mr: 1 }}
//                                   >
//                                     Continue
//                                   </Button>
//                                   <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
//                                     Back
//                                   </Button>
//                                 </Box>
//                               </CardContent>
//                             </Card>
//                           </StepContent>
//                         </Step>
//                       )}



//                       {/* Step 4: Review & Submit - ALWAYS SHOW SUBMIT BUTTON */}
//                       <Step>
//                         <StepLabel onClick={handleStep(3)}>Review & Submit</StepLabel>
//                         <StepContent>
//                           <Card variant="outlined" sx={{ mb: 3 }}>
//                             <CardContent>
//                               <Typography variant="h6" gutterBottom>
//                                 Review DSR Form
//                               </Typography>

//                               <Stack spacing={2}>
//                                 <Box>
//                                   <Typography variant="subtitle2" color="text.secondary">
//                                     Attendance Status
//                                   </Typography>
//                                   <Typography variant="body1">
//                                     {dsrForms[currentStudent.regd].Attendence}
//                                     {dsrForms[currentStudent.regd].Attendence === "Absent" &&
//                                       ` - ${dsrForms[currentStudent.regd].absentReason}`}
//                                     {dsrForms[currentStudent.regd].absentReason === "other" &&
//                                       dsrForms[currentStudent.regd].absentReasonDetails &&
//                                       `: ${dsrForms[currentStudent.regd].absentReasonDetails}`}
//                                   </Typography>
//                                 </Box>

//                                 {dsrForms[currentStudent.regd].Attendence === "Present" ? (
//                                   <>
//                                     <Box>
//                                       <Typography variant="subtitle2" color="text.secondary">
//                                         Parent Discussion
//                                       </Typography>
//                                       <Typography variant="body1">
//                                         Connected: {dsrForms[currentStudent.regd].parentDiscussion.isconnected}
//                                       </Typography>
//                                       {dsrForms[currentStudent.regd].parentDiscussion.isconnected === "yes" && (
//                                         <>
//                                           <Typography variant="body2">
//                                             With: {dsrForms[currentStudent.regd].parentDiscussion.connectedwith}
//                                           </Typography>
//                                           <Typography variant="body2">
//                                             Contact: {dsrForms[currentStudent.regd].parentDiscussion.connectedno}
//                                           </Typography>
//                                           <Typography variant="body2">
//                                             Observation: {dsrForms[currentStudent.regd].parentDiscussion.parentobservation}
//                                           </Typography>
//                                         </>
//                                       )}
//                                     </Box>

//                                     <Box>
//                                       <Typography variant="subtitle2" color="text.secondary">
//                                         Official Observation
//                                       </Typography>
//                                       <Typography variant="body1">
//                                         {dsrForms[currentStudent.regd].officialObservation}
//                                       </Typography>
//                                     </Box>

//                                     <Box>
//                                       <Typography variant="subtitle2" color="text.secondary">
//                                         Counselling Required
//                                       </Typography>
//                                       <Typography variant="body1">
//                                         {dsrForms[currentStudent.regd].counsellingRequired}
//                                       </Typography>
//                                     </Box>
//                                   </>
//                                 ) : (
//                                   <Box>
//                                     <Typography variant="subtitle2" color="text.secondary">
//                                       Parent Discussion (Skipped for Absent)
//                                     </Typography>
//                                     <Typography variant="body2" fontStyle="italic">
//                                       All parent discussion fields will be submitted with empty values
//                                     </Typography>
//                                   </Box>
//                                 )}

//                                 <Box>
//                                   <Typography variant="subtitle2" color="text.secondary">
//                                     Session Date
//                                   </Typography>
//                                   <Typography variant="body1">
//                                     {dsrForms[currentStudent.regd].sessionOn}
//                                   </Typography>
//                                 </Box>

//                                 <Box>
//                                   <Typography variant="subtitle2" color="text.secondary">
//                                     Duty Person
//                                   </Typography>
//                                   <Typography variant="body1">
//                                     {dsrForms[currentStudent.regd].dutyperson || "N/A"}
//                                   </Typography>
//                                 </Box>
//                               </Stack>

//                               <Box sx={{ mb: 2, mt: 2 }}>
//                                 <Button
//                                   variant="contained"
//                                   onClick={handleSubmit}
//                                   sx={{ mt: 1, mr: 1 }}
//                                 >
//                                   Submit DSR
//                                 </Button>
//                                 <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
//                                   Back
//                                 </Button>
//                               </Box>
//                             </CardContent>
//                           </Card>
//                         </StepContent>
//                       </Step>
//                     </Stepper>

//                     {/* Navigation between students */}
//                     <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
//                       <Button
//                         startIcon={<ArrowBackIcon />}
//                         onClick={handlePreviousStudent}
//                         disabled={currentStudentIndex === 0}
//                       >
//                         Previous Student
//                       </Button>

//                       <Typography variant="body2" color="text.secondary">
//                         {currentStudentIndex + 1} of {currentStudentList.length}
//                       </Typography>

//                       <Button
//                         endIcon={<ArrowForwardIcon />}
//                         onClick={handleNextStudent}
//                         disabled={currentStudentIndex === currentStudentList.length - 1}
//                       >
//                         Next Student
//                       </Button>
//                     </Box>
//                   </Scrollbar>
//                 </>
//               )}
//             </Box>
//           </Modal>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default DSRFollowUp;




interface Student {
  id: string,
  name: string;
  regd: string;
  att: string;
  hostel: string;
  room?: string;
  feeDue?: string;
  status?: string;
  hostelAttendance?: number;
  deliveredLecture?: number;
  roomNumber?: string;
}

interface ParentDiscussion {
  isconnected: "yes" | "no";
  connectedwith: string;
  connectedno: string;
  parentobservation: string;
}

interface DSRForm {
  id: string,
  hostel: string;
  name: string;
  regd: string;
  Attendence: string;
  absentReason: string;
  absentReasonDetails?: string;
  officialObservation: string;
  counsellingRequired: "yes" | "no";
  status: "pending" | "completed";
  parentDiscussion: ParentDiscussion;
  sessionOn: string;
  dutyperson: string | null;
}

const DSRFollowUp = ({ onDataFetched }: any) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [filtering, setFiltering] = useState(false);
  const [checkedStudents, setCheckedStudents] = useState<any[]>([]);
  const [hostelChecked, setHostelChecked] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [profiles, setHostel] = useState<any[]>([]);
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});
  const isDataFetched = useRef(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession();
  const [expandedAccordions, setExpandedAccordions] = useState<Record<string, boolean>>({});
  const [fullDataHostels, setFullDataHostels] = useState<Record<string, boolean>>({});
  const [attendanceFilter, setAttendanceFilter] = useState<string | null>(null);
  const [isRotating, setIsRotating] = React.useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [currentStudentList, setCurrentStudentList] = useState<Student[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [dsrForms, setDsrForms] = useState<Record<string, DSRForm>>({});
  const theme = useTheme();
  const [refresh, setRefresh] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const initializeFormData = (student: Student, profileData: any): DSRForm => ({
    id: student.id,
    hostel: student.hostel,
    name: student.name,
    regd: student.regd,
    Attendence: "Absent",
    absentReason: "",
    absentReasonDetails: "",
    counsellingRequired: "no",
    status: "pending",
    parentDiscussion: {
      isconnected: "no",
      connectedwith: "",
      connectedno: "",
      parentobservation: ""
    },
    officialObservation: "",
    sessionOn: formatDate(profileData.sessionOn),
    dutyperson: profileData.dutyperson
  });

  const validateStep = (step: number): boolean => {
    if (!currentStudent) return false;

    const form = dsrForms[currentStudent.regd];
    const errors: Record<string, string> = {};

    switch (step) {
      case 0:
        if (!form.Attendence) {
          errors.Attendence = "Attendance status is required";
        }
        if (form.Attendence === "Absent" && !form.absentReason) {
          errors.absentReason = "Absent reason is required when student is absent";
        }
        if (form.Attendence === "Absent" && form.absentReason === "other" && !form.absentReasonDetails) {
          errors.absentReasonDetails = "Please provide details for absent reason";
        }
        break;

      case 1:
        if (form.Attendence === "Present") {
          if (!form.parentDiscussion.isconnected) {
            errors.isconnected = "Connection status is required";
          }
          if (form.parentDiscussion.isconnected === "yes") {
            if (!form.parentDiscussion.connectedwith) {
              errors.connectedwith = "Connected with is required";
            }
            if (!form.parentDiscussion.connectedno) {
              errors.connectedno = "Contact number is required";
            }
            if (!form.parentDiscussion.parentobservation) {
              errors.parentobservation = "Parent observation is required";
            }
          }
        }
        break;

      case 2:
        if (form.Attendence === "Present" && !form.officialObservation) {
          errors.officialObservation = "Official observation is required";
        }
        if (form.Attendence === "Present" && !form.counsellingRequired) {
          errors.counsellingRequired = "Counselling requirement is required";
        }
        break;

      case 3:
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenModal = (student: Student, index: number) => {
    const allStudents = filteredProfiles.flatMap(profile => profile.students);
    setCurrentStudentList(allStudents);
    setCurrentStudentIndex(allStudents.findIndex(s => s.regd === student.regd));
    setCurrentStudent(student);
    setFormErrors({});

    const profileData = profiles.find(p => p.hostel === student.hostel);

    if (!dsrForms[student.regd]) {
      setDsrForms(prev => ({
        ...prev,
        [student.regd]: initializeFormData(student, profileData || { sessionOn: "", dutyperson: null })
      }));
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setActiveStep(0);
    setFormErrors({});
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!currentStudent) return;

    setDsrForms(prev => ({
      ...prev,
      [currentStudent.regd]: {
        ...prev[currentStudent.regd],
        [name]: value
      }
    }));

    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleParentDiscussionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!currentStudent) return;

    setDsrForms(prev => ({
      ...prev,
      [currentStudent.regd]: {
        ...prev[currentStudent.regd],
        parentDiscussion: {
          ...prev[currentStudent.regd].parentDiscussion,
          [name]: value
        }
      }
    }));

    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    if (!currentStudent) return;

    if (name === "connectedwith") {
      setDsrForms(prev => ({
        ...prev,
        [currentStudent.regd]: {
          ...prev[currentStudent.regd],
          parentDiscussion: {
            ...prev[currentStudent.regd].parentDiscussion,
            [name]: value
          }
        }
      }));
    } else {
      setDsrForms(prev => ({
        ...prev,
        [currentStudent.regd]: {
          ...prev[currentStudent.regd],
          [name]: value
        }
      }));
    }

    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    'Attendance Status',
    'Parent Discussion',
    'Official Observation',
    'Review & Submit'
  ];

  // const handleNext = () => {
  //   if (validateStep(activeStep)) {
  //     if (currentStudent && dsrForms[currentStudent.regd]?.Attendence === "Absent") {
  //       if (activeStep === 0) {
  //         setActiveStep(3); // Skip directly to review step for absent students
  //       } else {
  //         setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //       }
  //     } else {
  //       setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //     }
  //   }
  // };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (currentStudent && dsrForms[currentStudent.regd]?.Attendence === "Absent") {
        // For absent students, always go to review step after attendance
        setActiveStep(3);
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStudent && dsrForms[currentStudent.regd]?.Attendence === "Absent" && activeStep === 3) {
      setActiveStep(0);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
    setFormErrors({});
  };

  const handleStep = (step: number) => () => {
    if (currentStudent && dsrForms[currentStudent.regd]?.Attendence === "Absent") {
      if (step === 0 || step === 3) {
        setActiveStep(step);
        setFormErrors({});
      }
    } else if (step <= activeStep) {
      setActiveStep(step);
      setFormErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!currentStudent || isSubmitting) return;

    setIsSubmitting(true);

    const updatedForm = {
      ...dsrForms[currentStudent.regd],
      status: "completed" as const
    };

    if (updatedForm.Attendence === "Absent") {
      updatedForm.parentDiscussion = {
        isconnected: "no",
        connectedwith: "",
        connectedno: "",
        parentobservation: ""
      };
      updatedForm.officialObservation = "";
      updatedForm.counsellingRequired = "no";

      if (updatedForm.absentReason === "other" && updatedForm.absentReasonDetails) {
        updatedForm.absentReason = `other :: ${updatedForm.absentReasonDetails}`;
      }
    }

    setDsrForms(prev => ({
      ...prev,
      [currentStudent.regd]: updatedForm
    }));

    const submittedData = {
      id: updatedForm.id,
      Attendence: updatedForm.Attendence,
      absentReason: updatedForm.absentReason,
      counsellingRequired: updatedForm.counsellingRequired,
      isconnected: updatedForm.parentDiscussion.isconnected,
      connectedwith: updatedForm.parentDiscussion.connectedwith,
      connectedno: updatedForm.parentDiscussion.connectedno,
      parentdiscussionobservation: updatedForm.parentDiscussion.parentobservation,
      officialObservation: updatedForm.officialObservation
    };

    console.log("DSR Form submitted:", submittedData);
    const credentialsJson = JSON.stringify(submittedData);

    if (!session?.user?.token) {
      throw new Error("Session or token is missing");
    }

    const splitValue = session.user.token.split("NEXT2121ANG");
    const { Data } = encryptData(credentialsJson, splitValue[1]);

    try {
      const response = await savedsrAction(Data);

      const token = String(session.user.token).split("NEXT2121ANG")[1];
      const decrypted = decryptDataforResponse(response.ApiData, token);
      const parsed = JSON.parse(decrypted);
      console.log("save data responsedsr", parsed);

      setSnackbarMessage('Submitted successfully!');
      setSnackbarOpen(true);

      // Close modal first
      handleCloseModal();

      // Then refresh data after modal is closed
      setTimeout(() => {
        fetchData();
      }, 300);

    } catch (error) {
      console.error("Error submitting DSR:", error);
      setSnackbarMessage('Error submitting DSR');
      setSnackbarOpen(true);
      setIsSubmitting(false);
    }
  };

  const handlePreviousStudent = () => {
    if (currentStudentIndex > 0) {
      const prevIndex = currentStudentIndex - 1;
      const prevStudent = currentStudentList[prevIndex];
      setCurrentStudentIndex(prevIndex);
      setCurrentStudent(prevStudent);
      setFormErrors({});
      setActiveStep(0);

      const profileData = profiles.find(p => p.hostel === prevStudent.hostel);

      if (!dsrForms[prevStudent.regd]) {
        setDsrForms(prev => ({
          ...prev,
          [prevStudent.regd]: initializeFormData(prevStudent, profileData || { sessionOn: "", dutyperson: null })
        }));
      }
    }
  };

  const handleNextStudent = () => {
    if (currentStudentIndex < currentStudentList.length - 1) {
      const nextIndex = currentStudentIndex + 1;
      const nextStudent = currentStudentList[nextIndex];
      setCurrentStudentIndex(nextIndex);
      setCurrentStudent(nextStudent);
      setFormErrors({});
      setActiveStep(0);

      const profileData = profiles.find(p => p.hostel === nextStudent.hostel);

      if (!dsrForms[nextStudent.regd]) {
        setDsrForms(prev => ({
          ...prev,
          [nextStudent.regd]: initializeFormData(nextStudent, profileData || { sessionOn: "", dutyperson: null })
        }));
      }
    }
  };



  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await gethostelactivitydsrAction();
      const token = String(session?.user?.token).split("NEXT2121ANG")[1];
      if (response.status === "success") {
        const decrypted = decryptDataforResponse(response.ApiData, token);
        const parsed = JSON.parse(decrypted);
        console.log("pending DSR Data :", parsed);

        const total = parsed.reduce((sum: number, hostel: any) => {
          return sum + (hostel.students?.length || 0);
        }, 0);
        setTotalStudents(total);

        const validatedProfiles = parsed.map((profile: any) => ({
          ...profile,
          students: profile.students.map((student: any) => ({
            ...student,
            hostel: profile.hostel
          }))
        }));

        setHostel(validatedProfiles);
        onDataFetched?.(validatedProfiles);

        const initialCounts: Record<string, number> = {};
        validatedProfiles.forEach((profile: any) => {
          initialCounts[profile.hostel] = BATCH_SIZE;
        });
        setVisibleCounts(initialCounts);

        isDataFetched.current = true;
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch only
  useEffect(() => {
    if (!isDataFetched.current) {
      fetchData();
    }
  }, [onDataFetched, session]);

  const dynamicColors = useMemo(() => {
    const map: Record<string, typeof muiColors[number]> = {};
    profiles.forEach((profile, index) => {
      map[profile.hostel] = muiColors[index % muiColors.length];
    });
    return map;
  }, [profiles]);

  // const handleChipClick = (category: string) => {
  //   setSelectedCategory((prev) => (prev === category ? null : category));
  //   setSearch("");
  //   setFiltering(true);
  //   setExpandedAccordions(prev => ({
  //     ...prev,
  //     [category]: true
  //   }));

  //   setFullDataHostels(prev => ({
  //     ...prev,
  //     [category]: true
  //   }));

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

  //   if (searchValue.trim()) {
  //     const matchingHostels: Record<string, boolean> = {};
  //     profiles.forEach(profile => {
  //       const hasMatch = profile.students.some((s: any) => {
  //         const nameMatch = s.name?.toLowerCase().includes(searchValue.toLowerCase());
  //         const regdMatch = String(s.regd || "").includes(searchValue);
  //         return nameMatch || regdMatch;
  //       });
  //       if (hasMatch) matchingHostels[profile.hostel] = true;
  //     });
  //     setExpandedAccordions(matchingHostels);
  //   } else {
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
  //   setExpandedAccordions(prev => ({
  //     ...prev,
  //     [hostel]: isExpanded
  //   }));
  // };

  const chipCounts = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();
    return profiles.reduce((acc, profile) => {
      // Create unique key combining hostel, dutyperson, and sessionOn
      const uniqueKey = `${profile.hostel}-${profile.dutyperson}-${profile.sessionOn}`;

      const count = profile.students.filter((s: any) => {
        const nameMatch = s.name?.toLowerCase().includes(lowerSearch);
        const regdMatch = String(s.regd || "").toLowerCase().includes(lowerSearch);
        const hostelMatch = profile.hostel?.toLowerCase().includes(lowerSearch);
        return nameMatch || regdMatch || hostelMatch;
      }).length;

      acc[uniqueKey] = count;
      return acc;
    }, {} as Record<string, number>);
  }, [profiles, search]);


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
        'Session Date': formatDate(profile.sessionOn),
        'Duty Person': profile.dutyperson || 'N/A',
        'RoomNo': student.roomNumber || 'N/A'
      })) || []
    );
  };

  const downloadPDF = () => {
    if (!profiles || profiles.length === 0) return;

    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();

    doc.setFontSize(16);
    doc.text("Pending-Students-For-Session", 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${currentDate} | Total Students: ${totalStudents}`, 14, 30);

    const flattenedData = flattenStudentsData(profiles);

    const headers = [
      'Reg No', 'Name', 'Hostel',
      'Current Att(%)', 'Hostel Att(%)', 'Lectures',
      'Session Date', 'Duty Person', 'RoomNo'
    ];

    const data = flattenedData.map(student => [
      student['Registration Number'],
      student['Student Name'],
      student['Hostel'],
      student['Current Attendance (%)'],
      student['Hostel Attendance (%)'],
      student['Delivered Lectures'],
      student['Session Date'],
      student['Duty Person'],
      student['RoomNo']
    ]);

    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 8 }
    });

    doc.save(`Pending-Students-For-Session-${currentDate.replace(/\//g, '-')}.pdf`);
    setSnackbarOpen(true);
    setSnackbarMessage('Report download successfully');
    setAnchorEl(null);
  };

  const handleExport = async () => {
    if (!profiles || profiles.length === 0) return;

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Pending-Students-For-Session");

      const headers = [
        'Registration Number', 'Student Name', 'Hostel', 'Current Attendance (%)',
        'Hostel Attendance (%)', 'Delivered Lectures', 'Session Date', 'Duty Person', 'RoomNo'
      ];

      worksheet.addRow(headers);

      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
      headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2B78E4' } };

      const flattenedData = flattenStudentsData(profiles);
      flattenedData.forEach(student => {
        worksheet.addRow(headers.map(header => student[header]));
      });

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
      a.download = `Pending-Students-For-Session-${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      setSnackbarMessage('Report download successfully');
      setSnackbarOpen(true);
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
              {profiles.map(({ hostel, dutyperson, sessionOn, index }) => {
                const uniquehostelId = `${hostel}-${dutyperson}-${sessionOn}`;
                const count = chipCounts[uniquehostelId] || 0;
                return (
                  <Grid key={uniquehostelId}>
                    {/* <Badge badgeContent={count} max={100000} color={dynamicColors[hostel] || "default"}>
                      <Chip
                        icon={<IconBuildings size={16} />}
                        label={hostel.toUpperCase()}
                        onClick={() => {
                          handleChipClick(hostel);
                          setFullDataHostels(prev => ({ ...prev, [hostel]: true }));
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
            <Box display="flex" >
              <Typography variant="h6" sx={{ p: 2, fontWeight: "bold", fontSize: 12 }}>Total Students :{totalStudents}</Typography>
              <Typography variant="h6" sx={{ p: 2, fontWeight: "bold", fontSize: 12 }}>Total Hostel :{profiles.length}</Typography>
            </Box>
            <Box>
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
                    <MenuItem onClick={downloadPDF}>
                      Download PDF
                    </MenuItem>
                    <MenuItem onClick={handleExport}>
                      Download Excel
                    </MenuItem>
                  </Menu>

                  <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                  >
                    <Alert severity="success" sx={{ width: "100%" }}>
                      {snackbarMessage}
                    </Alert>
                  </Snackbar>
                </>
              )}
            </Box>
          </Box>

          {/* Search & Reset */}
          <Grid container justifyContent="flex-end" spacing={1} sx={{ p: 2 }}>
            <Grid >
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
            <Grid >
              <Chip
                icon={
                  <RestartAltIcon
                    sx={{
                      animation: isRotating ? 'spin 1s linear infinite' : 'none',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' }
                      }
                    }}
                  />
                }
                label="Reset"
                color="error"
                clickable
                onClick={() => {
                  setIsRotating(true);
                  setSearch("");
                  setAttendanceFilter(null);
                  setSelectedCategory(null);
                  setCheckedStudents([]);
                  setHostelChecked({});
                  setDsrForms({});
                  setExpandedAccordions({});
                  setTimeout(() => {
                    resultsRef.current?.scrollIntoView({ behavior: "smooth" });
                    setIsRotating(false);
                  }, 1000);
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
                <Scrollbar sx={{ height: "440px" }}>
                  {filteredProfiles.map(({ hostel, students, sessionOn, dutyperson, uniqueId }) => (
                    <Accordion key={uniqueId} sx={{
                      transition: "all 0.2s ease-in-out",
                      boxShadow: "0 2px 10px rgba(122, 112, 112, 0.08)",
                      "&:hover": {
                        transform: "scale(1.01)",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                      },
                    }} disableGutters expanded={expandedAccordions[uniqueId] || false}
                      onChange={handleAccordionChange(uniqueId)}>
                      <AccordionSummary expandIcon={<IconChevronDown />}>
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Typography variant="h6" sx={{ display: "flex", alignItems: "center", fontSize: "12px" }}>
                              <IconBuildings size={16} style={{ marginRight: 6 }} />
                              {hostel.toUpperCase()}
                            </Typography>
                            <Typography variant="caption" sx={{ display: "block" }}>
                              Session: {formatDate(sessionOn)} | Duty Person: {dutyperson || "N/A"}
                            </Typography>
                          </Box>
                          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1, mx: 1 }}>

                          </Box>

                        </Box>
                      </AccordionSummary>

                      <AccordionDetails>
                        <Grid container spacing={2}>
                          {students
                            .slice(0, fullDataHostels[hostel] ? students.length : (visibleCounts[hostel] || BATCH_SIZE))
                            .map((student: any, index: number) => {
                              const studentAttendance = Number(student.att) || 0;
                              const hostelAttendance = Number(student.hostelAttendance) || 0;
                              const mainColor = studentAttendance > 80 ?
                                theme.palette.success.main :
                                studentAttendance >= 50 ?
                                  theme.palette.warning.main :
                                  "#FF4D4D";
                              const hostelColor = hostelAttendance > 80 ?
                                theme.palette.success.main :
                                hostelAttendance >= 50 ?
                                  theme.palette.warning.main :
                                  "#FF4D4D";
                              const uniqueId = `${hostel}-${student.regd}-${index}`;

                              const createChartOptions = (attendance: number, color: string): ApexOptions => ({
                                chart: {
                                  type: "donut",
                                  fontFamily: "'Plus Jakarta Sans', sans-serif;",
                                  toolbar: { show: false },
                                  height: 100,
                                },
                                labels: ["Attend", "Non-Attend"],
                                colors: [color, theme.palette.primary.light, "#F9F9FD"],
                                plotOptions: {
                                  pie: {
                                    donut: {
                                      size: "83%",
                                      background: "transparent",
                                      labels: {
                                        show: true,
                                        name: { show: true, offsetY: 7 },
                                        value: { show: false },
                                        total: {
                                          show: true,
                                          color: theme.palette.mode === "dark" ? "white" : "black",
                                          fontSize: "8px",
                                          fontWeight: "600",
                                          label: `${attendance}%`,
                                        },
                                      },
                                    },
                                  },
                                },
                                dataLabels: { enabled: false },
                                stroke: { show: false },
                                legend: { show: false },
                                tooltip: {
                                  theme: theme.palette.mode === "dark" ? "dark" : "light",
                                  fillSeriesColor: false,
                                },
                              });

                              const seriescolumnchart = (attendance: number) => [
                                attendance,
                                100 - attendance,
                              ];

                              const hasCompletedForm = dsrForms[student.regd]?.status === "completed";

                              return (
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={uniqueId}>
                                  <CardContent
                                    onClick={() => handleOpenModal(student, index)}
                                    sx={{
                                      transition: "all 0.2s ease-in-out",
                                      boxShadow: "0 2px 10px rgba(122, 112, 112, 0.08)",
                                      "&:hover": {
                                        transform: "scale(1.01)",
                                        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                                        cursor: "pointer"
                                      },
                                      backgroundColor: hasCompletedForm ? "action.hover" : "background.paper",
                                      border: hasCompletedForm ? `1px solid ${theme.palette.success.main}` : "none",
                                      borderRadius: 1,
                                      height: "100%"
                                    }}
                                  >
                                    {/* Student Info */}
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                      <Box width="50%">
                                        <Tooltip title={student.name}>
                                          <Typography variant="h6" noWrap>
                                            {student.name}
                                          </Typography>
                                        </Tooltip>
                                      </Box>
                                      <Box width="50%" display="flex" flexDirection="column" alignItems="flex-end">
                                        <Typography variant="caption">
                                          {student.regd}
                                        </Typography>
                                      </Box>
                                    </Box>

                                    {/* Attendance Charts */}
                                    <Box display="flex" justifyContent="space-between">
                                      <Box width="48%" display="flex" flexDirection="column" alignItems="center">
                                        <Typography variant="caption">Class Atten</Typography>
                                        <Chart
                                          options={createChartOptions(studentAttendance, mainColor)}
                                          series={seriescolumnchart(studentAttendance)}
                                          type="donut"
                                          width="100%"
                                          height={80}
                                        />
                                      </Box>
                                      <Box width="48%" display="flex" flexDirection="column" alignItems="center">
                                        <Typography variant="caption">Hostel Atten</Typography>
                                        <Chart
                                          options={createChartOptions(hostelAttendance, hostelColor)}
                                          series={seriescolumnchart(hostelAttendance)}
                                          type="donut"
                                          width="100%"
                                          height={80}
                                        />
                                      </Box>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between">
                                      <Typography variant="caption" noWrap>
                                        RoomNo:{student.roomNumber}
                                      </Typography>
                                    </Box>

                                    <Box display="flex" justifyContent="space-between">
                                      {hasCompletedForm && (
                                        <Typography variant="caption" color="success.main">
                                          DSR Completed
                                        </Typography>
                                      )}
                                    </Box>
                                  </CardContent>
                                </Grid>
                              );
                            })}

                          {!fullDataHostels[hostel] && students.length > (visibleCounts[hostel] || BATCH_SIZE) && (
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
              )}
            </div>
          )}

          <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="dsr-form-modal"
            aria-describedby="dsr-form-for-student"
            key={currentStudent?.regd}
          >
            <Box sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "95%", sm: "90%", md: "80%", lg: "70%" },
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 2,
              p: 3
            }}>
              {currentStudent && dsrForms[currentStudent.regd] && (
                <>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" gutterBottom>
                      DSR Official Section
                    </Typography>
                    <IconButton onClick={handleCloseModal} disabled={isSubmitting}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  <Scrollbar sx={{ maxHeight: "80vh" }}>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                      Student: {currentStudent.name} ({currentStudent.regd}) - {currentStudent.hostel}
                    </Typography>

                    {Object.keys(formErrors).length > 0 && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        Please fill all required fields.
                      </Alert>
                    )}

                    <Stepper activeStep={activeStep} orientation="vertical">
                      {/* Step 1: Attendance Status */}
                      <Step>
                        <StepLabel
                          onClick={handleStep(0)}
                          optional={dsrForms[currentStudent.regd].Attendence === "Absent" ?
                            <Typography variant="caption">(Only this step required for absent students)</Typography> : null}
                        >
                          Attendance Status
                        </StepLabel>
                        <StepContent>
                          <Card variant="outlined" sx={{ mb: 3 }}>
                            <CardContent>
                              <FormControl component="fieldset" sx={{ mt: 2, mb: 2 }} error={!!formErrors.Attendence}>
                                <FormLabel component="legend">Attendance *</FormLabel>
                                <RadioGroup
                                  row
                                  name="Attendence"
                                  value={dsrForms[currentStudent.regd].Attendence}
                                  onChange={handleInputChange}
                                >
                                  <FormControlLabel value="Present" control={<Radio />} label="Present" />
                                  <FormControlLabel value="Absent" control={<Radio />} label="Absent" />
                                </RadioGroup>
                                {formErrors.Attendence && (
                                  <Typography variant="caption" color="error">
                                    {formErrors.Attendence}
                                  </Typography>
                                )}
                              </FormControl>
                              {dsrForms[currentStudent.regd].Attendence === "Absent" && (
                                <>
                                  <FormControl fullWidth margin="normal" error={!!formErrors.absentReason}>
                                    <InputLabel>Absent Reason *</InputLabel>
                                    <Select
                                      name="absentReason"
                                      value={dsrForms[currentStudent.regd].absentReason}
                                      onChange={handleSelectChange}
                                      label="Absent Reason *"
                                    >
                                      <MenuItem value="longLeave">Long Leave</MenuItem>
                                      <MenuItem value="termOff">Term off</MenuItem>
                                      <MenuItem value="other">Any other</MenuItem>
                                    </Select>
                                    {formErrors.absentReason && (
                                      <Typography variant="caption" color="error">
                                        {formErrors.absentReason}
                                      </Typography>
                                    )}
                                  </FormControl>

                                  {dsrForms[currentStudent.regd].absentReason === "other" && (
                                    <TextField
                                      fullWidth
                                      label="Please specify absent reason *"
                                      name="absentReasonDetails"
                                      value={dsrForms[currentStudent.regd].absentReasonDetails || ""}
                                      onChange={handleInputChange}
                                      margin="normal"
                                      error={!!formErrors.absentReasonDetails}
                                      helperText={formErrors.absentReasonDetails}
                                      multiline
                                      rows={2}
                                    />
                                  )}
                                </>
                              )}
                              <Box sx={{ mb: 2 }}>
                                <Button
                                  variant="contained"
                                  onClick={handleNext}
                                  sx={{ mt: 1, mr: 1 }}
                                  disabled={isSubmitting}
                                >
                                  {dsrForms[currentStudent.regd].Attendence === "Absent" ? "Skip to Review" : "Continue"}
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </StepContent>
                      </Step>

                      {/* Step 2: Parent Discussion (Only for Present students) */}
                      {dsrForms[currentStudent.regd].Attendence === "Present" && (
                        <Step>
                          <StepLabel onClick={handleStep(1)}>Parent Discussion</StepLabel>
                          <StepContent>
                            <Card variant="outlined" sx={{ mb: 3 }}>
                              <CardContent>
                                <FormControl component="fieldset" sx={{ mt: 2, mb: 2 }} error={!!formErrors.isconnected}>
                                  <FormLabel component="legend">Connected with Parent? *</FormLabel>
                                  <RadioGroup
                                    row
                                    name="isconnected"
                                    value={dsrForms[currentStudent.regd].parentDiscussion.isconnected}
                                    onChange={handleParentDiscussionChange}
                                  >
                                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="no" control={<Radio />} label="No" />
                                  </RadioGroup>
                                  {formErrors.isconnected && (
                                    <Typography variant="caption" color="error">
                                      {formErrors.isconnected}
                                    </Typography>
                                  )}
                                </FormControl>

                                {dsrForms[currentStudent.regd].parentDiscussion.isconnected === "yes" && (
                                  <>
                                    <FormControl fullWidth margin="normal" error={!!formErrors.connectedwith}>
                                      <InputLabel>Connected With *</InputLabel>
                                      <Select
                                        name="connectedwith"
                                        value={dsrForms[currentStudent.regd].parentDiscussion.connectedwith}
                                        onChange={handleSelectChange}
                                        label="Connected With *"
                                      >
                                        <MenuItem value="Father">Father</MenuItem>
                                        <MenuItem value="Mother">Mother</MenuItem>
                                        <MenuItem value="Guardian">Guardian</MenuItem>
                                      </Select>
                                      {formErrors.connectedwith && (
                                        <Typography variant="caption" color="error">
                                          {formErrors.connectedwith}
                                        </Typography>
                                      )}
                                    </FormControl>

                                    <TextField
                                      fullWidth
                                      label="Contact Number *"
                                      name="connectedno"
                                      value={dsrForms[currentStudent.regd].parentDiscussion.connectedno}
                                      onChange={handleParentDiscussionChange}
                                      margin="normal"
                                      error={!!formErrors.connectedno}
                                      helperText={formErrors.connectedno}
                                    />

                                    <TextField
                                      fullWidth
                                      label="Parent Observation *"
                                      name="parentobservation"
                                      multiline
                                      rows={3}
                                      value={dsrForms[currentStudent.regd].parentDiscussion.parentobservation}
                                      onChange={handleParentDiscussionChange}
                                      margin="normal"
                                      error={!!formErrors.parentobservation}
                                      helperText={formErrors.parentobservation}
                                    />
                                  </>
                                )}

                                <Box sx={{ mb: 2 }}>
                                  <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ mt: 1, mr: 1 }}
                                    disabled={isSubmitting}
                                  >
                                    Continue
                                  </Button>
                                  <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }} disabled={isSubmitting}>
                                    Back
                                  </Button>
                                </Box>
                              </CardContent>
                            </Card>
                          </StepContent>
                        </Step>
                      )}

                      {/* Step 3: Official Observation (Only for Present students) */}
                      {dsrForms[currentStudent.regd].Attendence === "Present" && (
                        <Step>
                          <StepLabel onClick={handleStep(2)}>Official Observation</StepLabel>
                          <StepContent>
                            <Card variant="outlined" sx={{ mb: 3 }}>
                              <CardContent>
                                <TextField
                                  fullWidth
                                  label="Official Observation *"
                                  name="officialObservation"
                                  multiline
                                  rows={4}
                                  value={dsrForms[currentStudent.regd].officialObservation}
                                  onChange={handleInputChange}
                                  margin="normal"
                                  error={!!formErrors.officialObservation}
                                  helperText={formErrors.officialObservation}
                                />
                                <FormControl component="fieldset" sx={{ mt: 2, mb: 2 }} error={!!formErrors.counsellingRequired}>
                                  <FormLabel component="legend">Counselling Required? *</FormLabel>
                                  <RadioGroup
                                    row
                                    name="counsellingRequired"
                                    value={dsrForms[currentStudent.regd].counsellingRequired}
                                    onChange={handleInputChange}
                                  >
                                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="no" control={<Radio />} label="No" />
                                  </RadioGroup>
                                  {formErrors.counsellingRequired && (
                                    <Typography variant="caption" color="error">
                                      {formErrors.counsellingRequired}
                                    </Typography>
                                  )}
                                </FormControl>

                                <Box sx={{ mb: 2 }}>
                                  <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ mt: 1, mr: 1 }}
                                    disabled={isSubmitting}
                                  >
                                    Continue
                                  </Button>
                                  <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }} disabled={isSubmitting}>
                                    Back
                                  </Button>
                                </Box>
                              </CardContent>
                            </Card>
                          </StepContent>
                        </Step>
                      )}

                      {/* Step 4: Review & Submit - ALWAYS SHOW THIS STEP */}
                      <Step>
                        <StepLabel
                          onClick={handleStep(3)}
                          optional={
                            <Typography variant="caption">
                              {dsrForms[currentStudent.regd].Attendence === "Absent"
                                ? "(Final step for absent students)"
                                : "(Final step)"}
                            </Typography>
                          }
                        >
                          Review & Submit
                        </StepLabel>
                        <StepContent>
                          <Card variant="outlined" sx={{ mb: 3 }}>
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                Review DSR Form
                              </Typography>

                              <Stack spacing={2}>
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    Attendance Status
                                  </Typography>
                                  <Typography variant="body1">
                                    {dsrForms[currentStudent.regd].Attendence}
                                    {dsrForms[currentStudent.regd].Attendence === "Absent" &&
                                      ` - ${dsrForms[currentStudent.regd].absentReason}`}
                                    {dsrForms[currentStudent.regd].absentReason === "other" &&
                                      dsrForms[currentStudent.regd].absentReasonDetails &&
                                      `: ${dsrForms[currentStudent.regd].absentReasonDetails}`}
                                  </Typography>
                                </Box>

                                {dsrForms[currentStudent.regd].Attendence === "Present" ? (
                                  <>
                                    <Box>
                                      <Typography variant="subtitle2" color="text.secondary">
                                        Parent Discussion
                                      </Typography>
                                      <Typography variant="body1">
                                        Connected: {dsrForms[currentStudent.regd].parentDiscussion.isconnected}
                                      </Typography>
                                      {dsrForms[currentStudent.regd].parentDiscussion.isconnected === "yes" && (
                                        <>
                                          <Typography variant="body2">
                                            With: {dsrForms[currentStudent.regd].parentDiscussion.connectedwith}
                                          </Typography>
                                          <Typography variant="body2">
                                            Contact: {dsrForms[currentStudent.regd].parentDiscussion.connectedno}
                                          </Typography>
                                          <Typography variant="body2">
                                            Observation: {dsrForms[currentStudent.regd].parentDiscussion.parentobservation}
                                          </Typography>
                                        </>
                                      )}
                                    </Box>

                                    <Box>
                                      <Typography variant="subtitle2" color="text.secondary">
                                        Official Observation
                                      </Typography>
                                      <Typography variant="body1">
                                        {dsrForms[currentStudent.regd].officialObservation}
                                      </Typography>
                                    </Box>

                                    <Box>
                                      <Typography variant="subtitle2" color="text.secondary">
                                        Counselling Required
                                      </Typography>
                                      <Typography variant="body1">
                                        {dsrForms[currentStudent.regd].counsellingRequired}
                                      </Typography>
                                    </Box>
                                  </>
                                ) : (
                                  <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                      Parent Discussion (Skipped for Absent)
                                    </Typography>
                                    <Typography variant="body2" fontStyle="italic">
                                      All parent discussion fields will be submitted with empty values
                                    </Typography>
                                  </Box>
                                )}

                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    Session Date
                                  </Typography>
                                  <Typography variant="body1">
                                    {dsrForms[currentStudent.regd].sessionOn}
                                  </Typography>
                                </Box>

                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    Duty Person
                                  </Typography>
                                  <Typography variant="body1">
                                    {dsrForms[currentStudent.regd].dutyperson || "N/A"}
                                  </Typography>
                                </Box>
                              </Stack>

                              {/* SUBMIT BUTTON - ALWAYS VISIBLE IN REVIEW STEP */}
                              <Box sx={{ mb: 2, mt: 2 }}>
                                <Button
                                  variant="contained"
                                  onClick={handleSubmit}
                                  sx={{ mt: 1, mr: 1 }}
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting ? "Submitting..." : "Submit DSR"}
                                </Button>
                                <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }} disabled={isSubmitting}>
                                  Back
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </StepContent>
                      </Step>
                    </Stepper>

                    {/* Show current step content directly if we're on review step for absent students */}
                    {activeStep === 3 && dsrForms[currentStudent.regd]?.Attendence === "Absent" && (
                      <Card variant="outlined" sx={{ mb: 3, mt: 2 }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Review DSR Form - Absent Student
                          </Typography>

                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Attendance Status
                              </Typography>
                              <Typography variant="body1">
                                {dsrForms[currentStudent.regd].Attendence} - {dsrForms[currentStudent.regd].absentReason}
                                {dsrForms[currentStudent.regd].absentReason === "other" &&
                                  dsrForms[currentStudent.regd].absentReasonDetails &&
                                  `: ${dsrForms[currentStudent.regd].absentReasonDetails}`}
                              </Typography>
                            </Box>

                            {/* <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Parent Discussion (Skipped for Absent)
                    </Typography>
                    <Typography variant="body2" fontStyle="italic">
                      All parent discussion fields will be submitted with empty values
                    </Typography>
                  </Box> */}

                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Session Date
                              </Typography>
                              <Typography variant="body1">
                                {dsrForms[currentStudent.regd].sessionOn}
                              </Typography>
                            </Box>

                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Duty Person
                              </Typography>
                              <Typography variant="body1">
                                {dsrForms[currentStudent.regd].dutyperson || "N/A"}
                              </Typography>
                            </Box>
                          </Stack>

                          <Box sx={{ mb: 2, mt: 2 }}>
                            <Button
                              variant="contained"
                              onClick={handleSubmit}
                              sx={{ mt: 1, mr: 1 }}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Submitting..." : "Submit DSR"}
                            </Button>
                            <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }} disabled={isSubmitting}>
                              Back to Attendance
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    )}

                    {/* Navigation between students */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                      <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={handlePreviousStudent}
                        disabled={currentStudentIndex === 0 || isSubmitting}
                      >
                        Previous Student
                      </Button>

                      <Typography variant="body2" color="text.secondary">
                        {currentStudentIndex + 1} of {currentStudentList.length}
                      </Typography>

                      <Button
                        endIcon={<ArrowForwardIcon />}
                        onClick={handleNextStudent}
                        disabled={currentStudentIndex === currentStudentList.length - 1 || isSubmitting}
                      >
                        Next Student
                      </Button>
                    </Box>
                  </Scrollbar>
                </>
              )}
            </Box>
          </Modal>
        </Box>
      )}
    </Box>
  );
};

export default DSRFollowUp;