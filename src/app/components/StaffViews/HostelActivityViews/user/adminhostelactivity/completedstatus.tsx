
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Badge,
  Box,
  Chip,
  Grid,
  TextField,
  InputAdornment,
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
  Tooltip,
  Alert,
  Modal,
  IconButton,
  StepLabel,
  StepContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Stepper,
  Step,
  Card,
  Snackbar,
  Menu,
  SelectChangeEvent,
} from "@mui/material";

import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { IconBuildings, IconChevronDown, IconDownload } from "@tabler/icons-react";

import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import { useSession } from "next-auth/react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VerifiedIcon from '@mui/icons-material/Verified';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { getcompletedadminAction } from "@/app/actions/StaffActions/hostalActivityAction/admin/get completedadminAction";
import { savedsrAction } from "@/app/actions/StaffActions/hostalActivityAction/dsr/savedsrAction";
import { fetchData } from "next-auth/client/_utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { useRouter } from "next/navigation";
import { getselectremarkscompletedAction } from "@/app/actions/StaffActions/hostalActivityAction/admin/getselecremarksofcompleted";
import { savepresentcompletedremarksAction } from "@/app/actions/StaffActions/hostalActivityAction/admin/savepresentcompletedremarksAction";

const muiColors = ["primary", "secondary", "success", "warning", "error", "info"] as const;
const BATCH_SIZE = 10;

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
  actionTakenRemarks?: string;
  actionTakenDate: string;
}

interface DSRForm {
  id: number,
  attendace: "Present" | "Absent";
  absentReason: string;
  isCounsellingRequired: "yes" | "no";
  isConnectedWithParents: "yes" | "no";
  connectedWith: string;
  mobileNumber: string;
  discussionWithParents: string;
  finalFeedBack: string;
  status: "pending" | "completed";
  updatedBy: string;
  updatedAt: string;
}

interface HostelData {
  hostel: string;
  hostelId: number;
  sessionOn: string;
  dutyperson: string;
  students: Student[];
}
interface FormDataPresent {
  remarks: string;
  remarkAdmin: string;
}

interface FormErrorsPresent {
  remarks?: string;
  remarkAdmin?: string;
}


const CompletedStatus = ({ onDataFetched }: { onDataFetched?: (data: any) => void }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [filtering, setFiltering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setHostel] = useState<any[]>([]);
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});
  const isDataFetched = useRef(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession();
  const [expandedAccordions, setExpandedAccordions] = useState<Record<string, boolean>>({});
  const [fullDataHostels, setFullDataHostels] = useState<Record<string, boolean>>({});
  const [attendanceFilter, setAttendanceFilter] = useState<string | null>(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [currentStudentList, setCurrentStudentList] = useState<Student[]>([]);
  const [dsrForms, setDsrForms] = useState<Record<string, DSRForm>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [dsrattendance, setdsrattendance] = useState("");
  const theme = useTheme();
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [remarksOptions, setremarksOptions] = useState<any[]>([]);

  const router = useRouter();
  const fetchData = async () => {
    if (isDataFetched.current) return;
    setLoading(true);
    try {
      const response = await getcompletedadminAction();
      const response1 = await getselectremarkscompletedAction();
      const token = session?.user?.token ? String(session.user.token).split("NEXT2121ANG")[1] : "";
      if (response.status === "success") {
        const decrypted = decryptDataforResponse(response.ApiData, token);
        const decryptedremarks = decryptDataforResponse(response1.ApiData, token);
        const parsed = JSON.parse(decrypted);
        const parsed1 = JSON.parse(decryptedremarks);
        console.log("Fetched completed DSR data:", parsed);
        // console.log("select",parsed1);
        setHostel(parsed);
        setremarksOptions(parsed1)
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

  useEffect(() => {
    fetchData();
  }, [onDataFetched, session]);

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
  //     setExpandedAccordions({});
  //   }
  //   setTimeout(() => {
  //     resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  //     setFiltering(false);`1
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
  //         const attendance = Number(s.current_Attendance) || 0;
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

  // const handleAccordionChange = (hostel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
  //   setExpandedAccordions((prev) => ({ ...prev, [hostel]: isExpanded }));
  // };

  const initializeFormData = (student: Student): DSRForm => ({
    id: student.id,
    attendace: student.attendace,
    absentReason: student.absentReason || "",
    isCounsellingRequired: student.isCounsellingRequired,
    isConnectedWithParents: student.isConnectedWithParents,
    connectedWith: student.connectedWith || "",
    mobileNumber: student.mobileNumber || "",
    discussionWithParents: student.discussionWithParents || "",
    finalFeedBack: student.finalFeedBack || "",
    status: "pending",
    updatedBy: "",
    updatedAt: ""
  });

  const validateStep = (step: number): boolean => {
    if (!selectedStudent) return false;

    const form = dsrForms[selectedStudent.registerationNumber];
    if (!form) return false;

    const errors: Record<string, string> = {};

    switch (step) {
      case 0:
        if (!form.attendace) {
          errors.attendace = "Attendance status is required";
        }
        if (form.attendace === "Absent" && !form.absentReason) {
          errors.absentReason = "Absent reason is required when student is absent";
        }
        break;

      case 1:
        if (form.attendace === "Present") {
          if (!form.isConnectedWithParents) {
            errors.isConnectedWithParents = "Connection status is required";
          }
          if (form.isConnectedWithParents === "yes") {
            if (!form.connectedWith) errors.connectedWith = "Connected with is required";
            if (!form.mobileNumber) errors.mobileNumber = "Contact number is required";
            if (!form.discussionWithParents) errors.discussionWithParents = "Discussion with parents is required";
          }
        }
        break;

      case 2:
        if (form.attendace === "Present") {
          if (!form.finalFeedBack) errors.finalFeedBack = "Final feedback is required";
          if (!form.isCounsellingRequired) errors.isCounsellingRequired = "Counselling requirement is required";
        }
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenModal = (student: Student, index: number) => {
    const allStudents = filteredProfiles.flatMap(profile => profile.students);
    setCurrentStudentList(allStudents);
    setCurrentStudentIndex(allStudents.findIndex(s => s.registerationNumber === student.registerationNumber));
    setSelectedStudent(student);
    setFormErrors({});
    setActiveStep(0);

    if (!dsrForms[student.registerationNumber]) {
      setDsrForms(prev => ({
        ...prev,
        [student.registerationNumber]: initializeFormData(student)
      }));
    }
    setModalOpen(true);
    setdsrattendance(student.attendace)
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setActiveStep(0);
    setFormErrors({});
    setSelectedStudent(null);
    setCurrentStudentList([]);
    setCurrentStudentList([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!selectedStudent) return;

    setDsrForms(prev => ({
      ...prev,
      [selectedStudent.registerationNumber]: {
        ...prev[selectedStudent.registerationNumber],
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

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    if (!selectedStudent) return;

    setDsrForms(prev => ({
      ...prev,
      [selectedStudent.registerationNumber]: {
        ...prev[selectedStudent.registerationNumber],
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

  const steps = [
    'Attendance Status',
    ...(selectedStudent && dsrForms[selectedStudent.registerationNumber]?.attendace === "Present"
      ? ['Parent Discussion', 'Official Observation']
      : []),
    'Review & Submit'
  ];

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setFormErrors({});
  };

  const handleStep = (step: number) => () => {
    if (step < activeStep) {
      setActiveStep(step);
      setFormErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!selectedStudent) return;

    // Update form status to completed
    const updatedForm: DSRForm = {
      ...dsrForms[selectedStudent.registerationNumber],
      status: "completed",
      updatedBy: session?.user?.name || "Admin",
      updatedAt: new Date().toLocaleString()
    };

    setDsrForms(prev => ({
      ...prev,
      [selectedStudent.registerationNumber]: updatedForm
    }));






    const submittedData = {
      "id": updatedForm.id,
      "Attendence": updatedForm.attendace,
      "absentReason": "",
      "counsellingRequired": updatedForm.isCounsellingRequired,
      "isconnected": updatedForm.isConnectedWithParents,
      "connectedwith": updatedForm.connectedWith,
      "connectedno": updatedForm.mobileNumber,
      "parentdiscussionobservation": updatedForm.discussionWithParents,
      "officialObservation": updatedForm.finalFeedBack,
      "UpdateBy": "admin"
    };

    // console.log("Formatted Data:", submittedData);
    const credentialsJson = JSON.stringify(submittedData);
    // console.log("credentialsJsonadmin", credentialsJson);

    if (!session || !session.user || !session.user.token) {
      throw new Error("Session or token is missing");
    }
    let splitValue = session.user.token.split("NEXT2121ANG");
    const { Data } = encryptData(credentialsJson, splitValue[1]);

    // console.log("Encrypted Data:", Data);


    const response = await savedsrAction(Data);
   isDataFetched.current = false;
  await fetchData(); // ✅ CALL the async function
    setSnackbarMessage(`DSR form submitted successfully for ${selectedStudent.name}`);
    setSnackbarOpen(true);
   
    const decrypted = decryptDataforResponse(response.ApiData, splitValue[1]);
    const parsed = JSON.parse(decrypted);
    console.log("save data respons of completed", parsed);

 
    // Show success message
 
    // router.refresh();

    handleCloseModal();
  };

  const handlePreviousStudent = () => {
    if (currentStudentIndex > 0) {
      const prevIndex = currentStudentIndex - 1;
      const prevStudent = currentStudentList[prevIndex];
      setCurrentStudentIndex(prevIndex);
      setSelectedStudent(prevStudent);
      setFormErrors({});
      setActiveStep(0);

      if (!dsrForms[prevStudent.registerationNumber]) {
        setDsrForms(prev => ({
          ...prev,
          [prevStudent.registerationNumber]: initializeFormData(prevStudent)
        }));
      }
    }
  };

  const handleNextStudent = () => {
    if (currentStudentIndex < currentStudentList.length - 1) {
      const nextIndex = currentStudentIndex + 1;
      const nextStudent = currentStudentList[nextIndex];
      setCurrentStudentIndex(nextIndex);
      setSelectedStudent(nextStudent);
      setFormErrors({});
      setActiveStep(0);

      if (!dsrForms[nextStudent.registerationNumber]) {
        setDsrForms(prev => ({
          ...prev,
          [nextStudent.registerationNumber]: initializeFormData(nextStudent)
        }));
      }
    }
  };

  const getAttendanceIcon = (attendance: "Present" | "Absent") => {
    return attendance === "Present"
      ? <CheckCircleIcon color="success" fontSize="small" />
      : <CancelIcon color="error" fontSize="small" />;
  };

  const isFormEditable = (student: Student) => {
    return student.attendace === "Absent" && dsrForms[student.registerationNumber]?.status !== "completed";
  };

  const isFormCompleted = (student: Student) => {
    return dsrForms[student.registerationNumber]?.status === "completed";
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // const formatDate = (dateString: string) => {
  //   if (!dateString) return '';
  //   const date = new Date(dateString);
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const year = date.getFullYear();
  //   return `${day}-${month}-${year}`;
  // };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'N/A') return 'N/A';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    } catch (error) {
      return 'Invalid Date';
    }
  };

  function setShowFieldErrors(arg0: boolean) {
    throw new Error("Function not implemented.");
  }


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
        'IsConnectedwithparents': student.isConnectedWithParents || 'N/A',
        'Connected With': student.connectedWith || 'N/A',
        'Mobile Number': student.mobileNumber || 'N/A',
        'Discussion with Parents': student.discussionWithParents || 'N/A',
        'Final Feedback': student.finalFeedBack || 'N/A',
        'Counselling Required': student.isCounsellingRequired || 'N/A',
        'Session Date': formatDate(profile.sessionOn),
        'Duty Person': profile.dutyperson || 'N/A',
        'Remarks': student.actionTakenRemarks || '',
        'RemarksOn': formatDate(student.actionTakenDate)


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
      'Parent Connected', 'Session Date', 'Duty Person', 'Remarks', 'RemarksOn'
    ];

    const data = flattenedData.map(student => [
      student['Registration Number'],
      student['Student Name'],
      student['Hostel'],
      student['Attendance Status'],
      student['Current Attendance (%)'],
      student['Hostel Attendance (%)'],
      student['Delivered Lectures'],
      student['IsConnectedwithparents'],
      student['Session Date'],
      student['Duty Person'],
      student['Remarks'],
      student['RemarksOn']
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
        'Attendance Date', 'Absent Reason', 'IsConnectedwithparents',
        'Connected With', 'Mobile Number', 'Discussion with Parents',
        'Final Feedback', 'Counselling Required', 'Session Date', 'Duty Person', 'Remarks', 'RemarksOn'
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




  const [formDatapresent, setFormDatapresent] = useState<FormDataPresent>({
    remarks: "",
    remarkAdmin: "",
  });

  const [formErrorspresent, setFormErrorspresent] =
    useState<FormErrorsPresent>({});
  const [isDisabled, setIsDisabled] = useState(false);

  // ✅ Prefill logic (robust split + hide Admin field unless Any Other)
  useEffect(() => {
    if (selectedStudent?.actionTakenRemarks) {
      const value = selectedStudent.actionTakenRemarks.trim();
      const parts = value.split("::");
      const remarks = parts[0]?.trim() || "";
      const remarkAdmin = parts.length > 1 ? parts[1]?.trim() || "" : "";

      setFormDatapresent({
        remarks,
        remarkAdmin,
      });

      setIsDisabled(true);
    } else {
      setFormDatapresent({
        remarks: "",
        remarkAdmin: "",
      });
      setIsDisabled(false);
    }
  }, [selectedStudent]);

  // Dropdown handler
  const handleSelectChangee = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;

    setFormDatapresent((prev) => ({
      ...prev,
      [name]: value,
      remarkAdmin: value === "Any Other" ? prev.remarkAdmin : "",
    }));

    setFormErrorspresent((prev) => ({
      ...prev,
      [name]: "",
      remarkAdmin: value === "Any Other" ? prev.remarkAdmin : "",
    }));
  };

  // Text input handler
  const handleInputChangee = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormDatapresent((prev) => ({ ...prev, [name]: value }));
    setFormErrorspresent((prev) => ({ ...prev, [name]: "" }));
  };

  // ✅ Show Admin TextField only if:
  // - remark = "Any Other" (user selected), OR
  // - remark = "Any Other" in prefilled data
  const showAdminField = formDatapresent.remarks === "Any Other";
  // Validation
  const validatee = () => {
    const errors: FormErrorsPresent = {};

    if (!formDatapresent.remarks) {
      errors.remarks = "Please select a remark option";
    }

    if (formDatapresent.remarks === "Any Other") {
      if (!formDatapresent.remarkAdmin.trim()) {
        errors.remarkAdmin = "Remarks are required";
      } else if (formDatapresent.remarkAdmin.trim().length < 10) {
        errors.remarkAdmin = "Remarks must be at least 10 characters";
      }
    }

    setFormErrorspresent(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit handler
  const handleSubmitpresent = async (e: React.FormEvent, studentId: number) => {
    e.preventDefault();

    if (validatee()) {
      // console.log("Form submitted", formDatapresent);
      // console.log("id",studentId)
      if (formDatapresent.remarks === "Any Other" && formDatapresent.remarkAdmin) {
        formDatapresent.remarks = `Any Other :: ${formDatapresent.remarkAdmin}`;
      }
      const submitData = {
        // id: studentId,
        // finalremarksadmin: `${formDatapresent.remarks}::${formDatapresent.remarkAdmin}`

        User: "",
        id: studentId,
        officialObservation: `${formDatapresent.remarks}`

      };
      console.log(submitData);

      const credentialsJson = JSON.stringify(submitData);
      console.log("credentialsJsonadmin", credentialsJson);

      if (!session || !session.user || !session.user.token) {
        throw new Error("Session or token is missing");
      }
      let splitValue = session.user.token.split("NEXT2121ANG");
      const { Data } = encryptData(credentialsJson, splitValue[1]);


      console.log("Encrypted Data:", Data);


      const response = await savepresentcompletedremarksAction(Data);

      const decrypted = decryptDataforResponse(response.ApiData, splitValue[1]);
      const parsed = JSON.parse(decrypted);
      console.log("save data respons of completed present", parsed);





      setSnackbarMessage("Admin remarks submitted for present!");
      setSnackbarOpen(true);
      // router.refresh();
      isDataFetched.current = false;
      await fetchData();

      handleCloseModal();

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
              {profiles.map(({ hostel, dutyperson, sessionOn }) => {
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
                Total Students: {totalStudents}
              </Typography>
              <Typography variant="h6" sx={{ p: 2, fontWeight: "bold", fontSize: 12 }}>
                Total Hostels: {profiles.length}
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
                        "0%": { transform: "rotate(0deg)" },
                        "100%": { transform: "rotate(360deg)" },
                      },
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
                <div>
                  <Scrollbar sx={{ height: "440px" }}>
                    {filteredProfiles.map(({ hostel, students, dutyperson, sessionOn,uniqueId }) => (
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

                          <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box>
                              <Typography variant="h6" sx={{ display: "flex", alignItems: "center", fontSize: "12px" }}>
                                <IconBuildings size={16} style={{ marginRight: 6 }} />
                                {hostel.toUpperCase()}
                              </Typography>

                            </Box>
                            <Typography variant="caption" sx={{ display: "block", fontWeight: "bold" }}>
                              Session: {formatDate(sessionOn)} | Duty Person: {dutyperson || "N/A"}
                            </Typography>

                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            {students.slice(0, fullDataHostels[hostel] ? students.length : visibleCounts[hostel] || BATCH_SIZE).map((student: any, index: number) => {
                              const studentAttendance = Number(student.current_Attendance) || 0;
                              const hostelAttendance = Number(student.hostelAttendance) || 0;
                              const mainColor = studentAttendance > 80 ? theme.palette.success.main : studentAttendance >= 50 ? theme.palette.warning.main : "#FF4D4D";
                              const hostelattenColor = hostelAttendance > 80 ? theme.palette.success.main : hostelAttendance >= 50 ? theme.palette.warning.main : "#FF4D4D";
                              const uniqueId = `${hostel}-${student.registerationNumber}-${index}-${dutyperson}-${sessionOn}`;
                              const isCompleted = isFormCompleted(student);
                              const isAbsent = student.attendace === "Absent";

                              const optionscolumnchart: ApexOptions = {
                                chart: { type: "donut", fontFamily: "'Plus Jakarta Sans', sans-serif;", toolbar: { show: false }, height: 100 },
                                labels: ["Attend", "Non-Attend"],
                                colors: [mainColor, theme.palette.primary.light, "#F9F9FD"],
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
                                          label: `${studentAttendance}%`,
                                        },
                                      },
                                    },
                                  },
                                },
                                dataLabels: { enabled: false },
                                stroke: { show: false },
                                legend: { show: false },
                                tooltip: { theme: theme.palette.mode === "dark" ? "dark" : "light", fillSeriesColor: false },
                              };
                              const seriescolumnchart = [studentAttendance, 100 - studentAttendance];

                              const optionscolumncharthostel: ApexOptions = {
                                chart: { type: "donut", fontFamily: "'Plus Jakarta Sans', sans-serif;", toolbar: { show: false }, height: 100 },
                                labels: ["Attend", "Non-Attend"],
                                colors: [hostelattenColor, theme.palette.primary.light, "#F9F9FD"],
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
                                          label: `${hostelAttendance}%`,
                                        },
                                      },
                                    },
                                  },
                                },
                                dataLabels: { enabled: false },
                                stroke: { show: false },
                                legend: { show: false },
                                tooltip: { theme: theme.palette.mode === "dark" ? "dark" : "light", fillSeriesColor: false },
                              };
                              const seriescolumncharthostel = [hostelAttendance, 100 - hostelAttendance];

                              return (
                                <Grid key={uniqueId} size={{ xs: 12, md: 3 }}>
                                  <CardContent
                                    onClick={() => handleOpenModal(student, index)}
                                    sx={{
                                      transition: "all 0.2s ease-in-out",
                                      boxShadow: "0 2px 10px rgba(122, 112, 112, 0.08)",
                                      "&:hover": {
                                        transform: "scale(1.01)",
                                        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                                        cursor: "pointer",
                                      },
                                      position: "relative",
                                      border: isCompleted && isAbsent ? `2px solid ${theme.palette.success.main}` : "none",
                                    }}
                                  >
                                    {/* Completion Badge for Absent Students */}
                                    {isCompleted && isAbsent && (
                                      <Box
                                        sx={{
                                          position: "absolute",
                                          top: 8,
                                          right: 8,
                                          backgroundColor: theme.palette.success.main,
                                          color: "white",
                                          borderRadius: "50%",
                                          width: 24,
                                          height: 24,
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <VerifiedIcon sx={{ fontSize: 16 }} />
                                      </Box>
                                    )}

                                    <Stack direction="row" spacing={2} alignItems="center">
                                      <Box width="100%">
                                        {/* Attendance Icon - Top Right */}
                                        <Box display="flex" justifyContent="flex-end" alignItems="center" mb={1}>
                                          {getAttendanceIcon(student.attendace)}
                                        </Box>

                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                          <Tooltip title={student.name}>
                                            <Typography variant="h6" noWrap sx={{ width: '70%' }}>
                                              {student.name}
                                            </Typography>
                                          </Tooltip>
                                        </Box>

                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                          <Typography variant="caption">RegNo: {student.registerationNumber}</Typography>
                                        </Box>

                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                          <Box>
                                            <Chart
                                              options={optionscolumnchart}
                                              series={seriescolumnchart}
                                              type="donut"
                                              width={60}
                                              height={60}
                                            />
                                            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center' }}>
                                              Atten
                                            </Typography>
                                          </Box>
                                          <Box>
                                            <Chart
                                              options={optionscolumncharthostel}
                                              series={seriescolumncharthostel}
                                              type="donut"
                                              width={60}
                                              height={60}
                                            />
                                            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center' }}>
                                              H-Atten
                                            </Typography>
                                          </Box>
                                        </Box>

                                        <Box display="flex" mt={1} justifyContent="center" gap={2}>
                                          <Typography variant="caption" color={student.attendace === "Present" ? "success.main" : "error.main"}>
                                            {student.attendace}
                                          </Typography>
                                          {student.actionTakenRemarks && (
                                            <Typography variant="caption" color={student.attendace === "Present" ? "success.main" : "error.main"}>
                                              Adminremarks:{student.actionTakenRemarks}
                                            </Typography>
                                          )}
                                        </Box>

                                        {/* Updated by Admin Message for Absent Students */}
                                        {isCompleted && isAbsent && (
                                          <Box
                                            sx={{
                                              mt: 1,
                                              p: 1,
                                              backgroundColor: theme.palette.success.light,
                                              borderRadius: 1,
                                              border: `1px solid ${theme.palette.success.main}`,
                                            }}
                                          >
                                            <Box display="flex" alignItems="center" gap={0.5}>
                                              <AdminPanelSettingsIcon sx={{ fontSize: 16, color: theme.palette.success.dark }} />
                                              <Typography variant="caption" color="success.dark" fontWeight="bold">
                                                Updated by Admin
                                              </Typography>
                                            </Box>
                                            <Typography variant="caption" color="success.dark" display="block">
                                              {dsrForms[student.registerationNumber]?.updatedBy} - {dsrForms[student.registerationNumber]?.updatedAt}
                                            </Typography>
                                          </Box>
                                        )}
                                      </Box>
                                    </Stack>
                                  </CardContent>
                                </Grid>
                              );
                            })}

                            {!fullDataHostels[hostel] && students.length > (visibleCounts[hostel] || BATCH_SIZE) && (
                              <Grid size={{ xs: 12 }}>
                                <Box display="flex" justifyContent="center">
                                  <Button
                                    variant="outlined"
                                    onClick={() => setVisibleCounts((prev) => ({ ...prev, [hostel]: (prev[hostel] || BATCH_SIZE) + BATCH_SIZE }))}
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

      {/* Student Details Modal */}
      {/* Student Details Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="dsr-form-modal"
        aria-describedby="dsr-form-for-student"
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
          maxHeight: "90vh",
          overflowY: "auto",
          p: 3
        }}>
          {selectedStudent && (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" gutterBottom>
                  DSR Official Section
                  {selectedStudent.attendace === "Absent" && dsrForms[selectedStudent.registerationNumber]?.status === "completed" && (
                    <Chip
                      label="Completed"
                      color="success"
                      size="small"
                      sx={{ ml: 2 }}
                      icon={<VerifiedIcon />}
                    />
                  )}
                </Typography>
                <IconButton onClick={handleCloseModal}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                Student: {selectedStudent.name} ({selectedStudent.registerationNumber}) - {selectedStudent.hostel}
              </Typography>

              {/* Present Student - Read-only Data Display */}
              {selectedStudent.attendace === "Present" ? (
                <Scrollbar sx={{ maxHeight: "70vh" }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon color="success" />
                        Present Student Details
                      </Typography>

                      <Grid container spacing={3}>
                        {/* Basic Information */}
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Basic Information
                          </Typography>
                          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Stack spacing={1}>
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" fontWeight="bold">Current Attendance:</Typography>
                                <Typography variant="body2">{selectedStudent.current_Attendance}%</Typography>
                              </Box>
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" fontWeight="bold">Hostel Attendance:</Typography>
                                <Typography variant="body2">{selectedStudent.hostelAttendance}%</Typography>
                              </Box>
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" fontWeight="bold">Delivered Lectures:</Typography>
                                <Typography variant="body2">{selectedStudent.deliveredLacture}</Typography>
                              </Box>
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" fontWeight="bold">Attendance Marked On:</Typography>
                                <Typography variant="body2">{formatDate(selectedStudent.attendaceOn)}</Typography>
                              </Box>
                            </Stack>
                          </Box>
                        </Grid>

                        {/* Parent Discussion */}
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Parent Discussion
                          </Typography>
                          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Stack spacing={1}>
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" fontWeight="bold">Connected with Parents:</Typography>
                                <Typography variant="body2">
                                  {selectedStudent.isConnectedWithParents === "yes" ? "Yes" : "No"}
                                </Typography>
                              </Box>

                              {selectedStudent.isConnectedWithParents === "yes" && (
                                <>
                                  <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" fontWeight="bold">Connected With:</Typography>
                                    <Typography variant="body2" textTransform="capitalize">
                                      {selectedStudent.connectedWith}
                                    </Typography>
                                  </Box>
                                  <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" fontWeight="bold">Mobile Number:</Typography>
                                    <Typography variant="body2">{selectedStudent.mobileNumber}</Typography>
                                  </Box>
                                </>
                              )}
                            </Stack>
                          </Box>
                        </Grid>

                        {/* Discussion Details */}
                        {selectedStudent.isConnectedWithParents === "yes" && (
                          <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Discussion Details
                            </Typography>
                            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                              <Typography variant="body2" fontWeight="bold" gutterBottom>
                                Discussion with Parents:
                              </Typography>
                              <Typography variant="body2">
                                {selectedStudent.discussionWithParents || "No discussion recorded"}
                              </Typography>
                            </Box>
                          </Grid>
                        )}

                        {/* Official Observation */}
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Final Feedback
                          </Typography>
                          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, minHeight: '100px' }}>
                            <Typography variant="body2">
                              {selectedStudent.finalFeedBack || "No feedback provided"}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Counselling Requirement
                          </Typography>
                          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="body2">
                              {selectedStudent.isCounsellingRequired === "yes" ? "Counselling Required" : "No Counselling Required"}
                            </Typography>
                          </Box>

                        </Grid>


                      </Grid>
                      {/* <form onSubmit={(e) => handleSubmitpresent(e, selectedStudent.id)} noValidate>
                        <FormControl
                          fullWidth
                          margin="normal"
                          error={!!formErrorspresent.remarks}
                        >
                          <InputLabel>Remarks*</InputLabel>
                          <Select
                            name="remarks"
                            value={formDatapresent.remarks || ""}
                            onChange={handleSelectChangee}
                            label="Remarks*"
                          >
                     

                              {remarksOptions.map((opt) => (
                                                  <MenuItem key={opt.type} value={opt.type}>
                                                    {opt.type}
                                                  </MenuItem>
                                                ))}
                          </Select>
                          {formErrorspresent.remarks && (
                            <Typography variant="caption" color="error">
                              {formErrorspresent.remarks}
                            </Typography>
                          )}
                        </FormControl>

                        {formDatapresent.remarks === "Any Other" && (
                          <TextField
                            fullWidth
                            label="Remarks of Admin *"
                            name="remarkAdmin"
                            multiline
                            rows={5}
                            value={formDatapresent.remarkAdmin}
                            onChange={handleInputChangee}
                            margin="normal"
                            error={!!formErrorspresent.remarkAdmin}
                            helperText={formErrorspresent.remarkAdmin}
                          />
                        )}





                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Button variant="contained" type="submit" >
                            Submit
                          </Button>
                          <Button variant="contained" onClick={handleCloseModal}>
                            Close
                          </Button>
                        </Box>
                      </form> */}
                      <form onSubmit={(e) => handleSubmitpresent(e, selectedStudent.id)} noValidate>
                        <FormControl fullWidth margin="normal" error={!!formErrorspresent.remarks}>
                          <InputLabel>Remarks*</InputLabel>
                          <Select
                            name="remarks"
                            value={formDatapresent.remarks || ""}
                            onChange={handleSelectChangee}
                            label="Remarks*"
                            disabled={isDisabled}
                          >
                            {/* Always include prefilled remark if not in options */}
                            {isDisabled && formDatapresent.remarks &&
                              !remarksOptions.some((opt) => opt.type === formDatapresent.remarks) && (
                                <MenuItem value={formDatapresent.remarks}>
                                  {formDatapresent.remarks}
                                </MenuItem>
                              )}

                            {remarksOptions.map((opt) => (
                              <MenuItem key={opt.type} value={opt.type}>
                                {opt.type}
                              </MenuItem>
                            ))}
                          </Select>
                          {formErrorspresent.remarks && (
                            <Typography variant="caption" color="error">
                              {formErrorspresent.remarks}
                            </Typography>
                          )}
                        </FormControl>


                        {showAdminField && (
                          <TextField
                            fullWidth
                            label="Remarks of Admin *"
                            name="remarkAdmin"
                            multiline
                            rows={5}
                            value={formDatapresent.remarkAdmin}
                            onChange={handleInputChangee}
                            margin="normal"
                            error={!!formErrorspresent.remarkAdmin}
                            helperText={formErrorspresent.remarkAdmin}
                            disabled={isDisabled}
                            InputLabelProps={{
                              shrink: !!formDatapresent.remarkAdmin || isDisabled,
                            }}
                          />
                        )}

                        <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 1 }}>
                          <Button variant="contained" type="submit" disabled={isDisabled}>
                            Submit
                          </Button>
                          <Button variant="contained" onClick={handleCloseModal}>
                            Close
                          </Button>
                        </Box>
                      </form>

                    </CardContent>
                  </Card>

                  {/* Navigation between students */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                    <Button
                      startIcon={<ArrowBackIcon />}
                      onClick={handlePreviousStudent}
                      disabled={currentStudentIndex === 0}
                    >
                      Previous Student
                    </Button>

                    <Typography variant="body2" color="text.secondary">
                      {currentStudentIndex + 1} of {currentStudentList.length}
                    </Typography>

                    <Button
                      endIcon={<ArrowForwardIcon />}
                      onClick={handleNextStudent}
                      disabled={currentStudentIndex === currentStudentList.length - 1}
                    >
                      Next Student
                    </Button>
                  </Box>
                </Scrollbar>
              ) : (
                /* Absent Student - Full Stepper Form */
                <Scrollbar sx={{ maxHeight: "70vh" }}>
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
                        optional={dsrForms[selectedStudent.registerationNumber]?.attendace === "Absent" ?
                          <Typography variant="caption">Absent reason: {dsrForms[selectedStudent.registerationNumber]?.absentReason}</Typography> : null}
                      >
                        Attendance Status
                      </StepLabel>
                      <StepContent>
                        <Card variant="outlined" sx={{ mb: 3 }}>
                          <CardContent>
                            <FormControl component="fieldset" sx={{ mt: 2, mb: 2 }} error={!!formErrors.attendace}>
                              <FormLabel component="legend">Attendance *</FormLabel>
                              <RadioGroup
                                row
                                name="attendace"
                                value={dsrForms[selectedStudent.registerationNumber]?.attendace || "Absent"}
                                onChange={handleInputChange}
                              >
                                <FormControlLabel
                                  value="Present"
                                  control={<Radio disabled={!isFormEditable(selectedStudent)} />}
                                  label="Present"
                                />

                              </RadioGroup>
                              {formErrors.attendace && (
                                <Typography variant="caption" color="error">
                                  {formErrors.attendace}
                                </Typography>
                              )}
                            </FormControl>



                            <Box sx={{ mb: 2 }}>
                              <Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{ mt: 1, mr: 1 }}
                                disabled={dsrForms[selectedStudent.registerationNumber]?.status === "completed"}
                              >
                                Continue
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </StepContent>
                    </Step>

                    {/* Step 2: Parent Discussion */}
                    <Step>
                      <StepLabel onClick={handleStep(1)}>Parent Discussion</StepLabel>
                      <StepContent>
                        <Card variant="outlined" sx={{ mb: 3 }}>
                          <CardContent>
                            <FormControl component="fieldset" sx={{ mt: 2, mb: 2 }} error={!!formErrors.isConnectedWithParents}>
                              <FormLabel component="legend">Connected with Parent? *</FormLabel>
                              <RadioGroup
                                row
                                name="isConnectedWithParents"
                                value={dsrForms[selectedStudent.registerationNumber]?.isConnectedWithParents || "False"}
                                onChange={handleInputChange}
                              >
                                <FormControlLabel
                                  value="yes"
                                  control={<Radio disabled={!isFormEditable(selectedStudent)} />}
                                  label="Yes"
                                />
                                <FormControlLabel
                                  value="no"
                                  control={<Radio disabled={!isFormEditable(selectedStudent)} />}
                                  label="No"
                                />
                              </RadioGroup>
                              {formErrors.isConnectedWithParents && (
                                <Typography variant="caption" color="error">
                                  {formErrors.isConnectedWithParents}
                                </Typography>
                              )}
                            </FormControl>

                            {dsrForms[selectedStudent.registerationNumber]?.isConnectedWithParents === "yes" && (
                              <>
                                <FormControl fullWidth margin="normal" error={!!formErrors.connectedWith}>
                                  <InputLabel>Connected With *</InputLabel>
                                  <Select
                                    name="connectedWith"
                                    value={dsrForms[selectedStudent.registerationNumber]?.connectedWith || ""}
                                    onChange={handleSelectChange}
                                    label="Connected With *"
                                    disabled={!isFormEditable(selectedStudent)}
                                  >
                                    <MenuItem value="Father">Father</MenuItem>
                                    <MenuItem value="Mother">Mother</MenuItem>
                                    <MenuItem value="Guardian">Guardian</MenuItem>
                                  </Select>
                                  {formErrors.connectedWith && (
                                    <Typography variant="caption" color="error">
                                      {formErrors.connectedWith}
                                    </Typography>
                                  )}
                                </FormControl>

                                <TextField
                                  fullWidth
                                  label="Mobile Number *"
                                  name="mobileNumber"
                                  value={dsrForms[selectedStudent.registerationNumber]?.mobileNumber || ""}
                                  onChange={handleInputChange}
                                  margin="normal"
                                  error={!!formErrors.mobileNumber}
                                  helperText={formErrors.mobileNumber}
                                  disabled={!isFormEditable(selectedStudent)}
                                />

                                <TextField
                                  fullWidth
                                  label="Discussion with Parents *"
                                  name="discussionWithParents"
                                  multiline
                                  rows={3}
                                  value={dsrForms[selectedStudent.registerationNumber]?.discussionWithParents || ""}
                                  onChange={handleInputChange}
                                  margin="normal"
                                  error={!!formErrors.discussionWithParents}
                                  helperText={formErrors.discussionWithParents}
                                  disabled={!isFormEditable(selectedStudent)}
                                />
                              </>
                            )}

                            <Box sx={{ mb: 2 }}>
                              <Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{ mt: 1, mr: 1 }}
                                disabled={dsrForms[selectedStudent.registerationNumber]?.status === "completed"}
                              >
                                Continue
                              </Button>
                              <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                                Back
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </StepContent>
                    </Step>

                    {/* Step 3: Official Observation */}
                    <Step>
                      <StepLabel onClick={handleStep(2)}>Official Observation</StepLabel>
                      <StepContent>
                        <Card variant="outlined" sx={{ mb: 3 }}>
                          <CardContent>
                            <TextField
                              fullWidth
                              label="Final Feedback *"
                              name="finalFeedBack"
                              multiline
                              rows={4}
                              value={dsrForms[selectedStudent.registerationNumber]?.finalFeedBack || ""}
                              onChange={handleInputChange}
                              margin="normal"
                              error={!!formErrors.finalFeedBack}
                              helperText={formErrors.finalFeedBack}
                              disabled={!isFormEditable(selectedStudent)}
                            />
                            <FormControl component="fieldset" sx={{ mt: 2, mb: 2 }} error={!!formErrors.isCounsellingRequired}>
                              <FormLabel component="legend">Counselling Required? *</FormLabel>
                              <RadioGroup
                                row
                                name="isCounsellingRequired"
                                value={dsrForms[selectedStudent.registerationNumber]?.isCounsellingRequired || "False"}
                                onChange={handleInputChange}
                              >
                                <FormControlLabel
                                  value="yes"
                                  control={<Radio disabled={!isFormEditable(selectedStudent)} />}
                                  label="Yes"
                                />
                                <FormControlLabel
                                  value="no"
                                  control={<Radio disabled={!isFormEditable(selectedStudent)} />}
                                  label="No"
                                />
                              </RadioGroup>
                              {formErrors.isCounsellingRequired && (
                                <Typography variant="caption" color="error">
                                  {formErrors.isCounsellingRequired}
                                </Typography>
                              )}
                            </FormControl>

                            <Box sx={{ mb: 2 }}>
                              <Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{ mt: 1, mr: 1 }}
                                disabled={dsrForms[selectedStudent.registerationNumber]?.status === "completed"}
                              >
                                Continue
                              </Button>
                              <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                                Back
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </StepContent>
                    </Step>

                    {/* Step 4: Review & Submit */}
                    <Step>
                      <StepLabel onClick={handleStep(3)}>Review & Submit</StepLabel>
                      <StepContent>
                        <Card variant="outlined" sx={{ mb: 3 }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              Review DSR Form
                              {dsrForms[selectedStudent.registerationNumber]?.status === "completed" && (
                                <Chip
                                  label="Already Submitted"
                                  color="success"
                                  size="small"
                                  sx={{ ml: 2 }}
                                  icon={<VerifiedIcon />}
                                />
                              )}
                            </Typography>

                            <Stack spacing={2}>
                              {/* Review content remains the same */}
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Attendance Status
                                </Typography>
                                <Typography variant="body1">
                                  {dsrForms[selectedStudent.registerationNumber]?.attendace}
                                  {dsrForms[selectedStudent.registerationNumber]?.attendace === "Absent" &&
                                    ` - ${dsrForms[selectedStudent.registerationNumber]?.absentReason}`}
                                </Typography>
                              </Box>

                              <Box>
                                {dsrForms[selectedStudent.registerationNumber].attendace === "Present" ? (
                                  <>
                                    <Box>
                                      <Typography variant="subtitle2" color="text.secondary">
                                        Parent Discussion
                                      </Typography>
                                      <Typography variant="body1">
                                        IsConnected: {dsrForms[selectedStudent.registerationNumber].isConnectedWithParents === "yes" ? "Yes" : "No"}
                                      </Typography>
                                      {dsrForms[selectedStudent.registerationNumber].isConnectedWithParents === "yes" && (
                                        <>
                                          <Typography variant="body2">
                                            Connected With: {dsrForms[selectedStudent.registerationNumber].connectedWith}
                                          </Typography>
                                          <Typography variant="body2">
                                            Mobile: {dsrForms[selectedStudent.registerationNumber].mobileNumber}
                                          </Typography>
                                          <Typography variant="body2">
                                            Parent Discussion: {dsrForms[selectedStudent.registerationNumber].discussionWithParents}
                                          </Typography>
                                        </>
                                      )}
                                    </Box>

                                    <Box>
                                      <Typography variant="subtitle2" color="text.secondary">
                                        Final Feedback
                                      </Typography>
                                      <Typography variant="body1">
                                        {dsrForms[selectedStudent.registerationNumber].finalFeedBack}
                                      </Typography>
                                    </Box>

                                    <Box>
                                      <Typography variant="subtitle2" color="text.secondary">
                                        Counselling Required
                                      </Typography>
                                      <Typography variant="body1">
                                        {dsrForms[selectedStudent.registerationNumber].isCounsellingRequired === "yes" ? "Yes" : "No"}
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
                              </Box>
                            </Stack>

                            <Box sx={{ mb: 2, mt: 2 }}>
                              {dsrForms[selectedStudent.registerationNumber]?.status !== "completed" && (
                                <Button
                                  variant="contained"
                                  onClick={handleSubmit}
                                  sx={{ mt: 1, mr: 1 }}
                                >
                                  Submit DSR
                                </Button>
                              )}
                              <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                                Back
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </StepContent>
                    </Step>
                  </Stepper>

                  {/* Navigation between students */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                    <Button
                      startIcon={<ArrowBackIcon />}
                      onClick={handlePreviousStudent}
                      disabled={currentStudentIndex === 0}
                    >
                      Previous Student
                    </Button>

                    <Typography variant="body2" color="text.secondary">
                      {currentStudentIndex + 1} of {currentStudentList.length}
                    </Typography>

                    <Button
                      endIcon={<ArrowForwardIcon />}
                      onClick={handleNextStudent}
                      disabled={currentStudentIndex === currentStudentList.length - 1}
                    >
                      Next Student
                    </Button>
                  </Box>
                </Scrollbar>
              )}
            </>
          )}
        </Box>
      </Modal>

      {/* Snackbar for success message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CompletedStatus;






