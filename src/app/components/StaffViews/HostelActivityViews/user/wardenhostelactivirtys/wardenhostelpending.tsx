

// "use client";
// import React, { useState, useMemo, useEffect, useRef } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   TextField,
//   useMediaQuery,
//   IconButton,
//   Snackbar,
//   Alert,
//   Menu,
//   MenuItem,
//   Tooltip,
//   Modal,
//   FormControl,
//   InputLabel,
//   Select,
//   Button,
//   SelectChangeEvent,
// } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import ChildCard from "@/app/components/shared/ChildCard";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { IconDownload } from "@tabler/icons-react";
// import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
// import Breadcrumb from "@/app/dashboard/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
// import ExcelJS from "exceljs";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { gethRoleAction } from "@/app/actions/hostalActivityAction/getRoleAction";
// import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
// import { gethostelactivitywardenAction } from "@/app/actions/hostalActivityAction/warden/getwardenAction";
// import CloseIcon from "@mui/icons-material/Close";
// const BCrumb = [
//   { to: "/dashboard", title: "Home", icon: "ic:baseline-home" },
//   { title: "warden Hostel Activity" },
// ];

// interface FormDataPresent {
//   remarks: string;
//   remarkAdmin: string;
// }

// interface FormErrorsPresent {
//   remarks?: string;
//   remarkAdmin?: string;
// }

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
// }

// const WardenPending = ({ onDataFetched }: any) => {
//   const [roleChecked, setRoleChecked] = useState(false);
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const isDataFetched = useRef(false);
//   const [student, setstudent] = useState<any[]>([]);
//  const [openModal, setOpenModal] = useState(false);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//     useEffect(() => {
//       async function checkRole() {
//         try {
//           const token = String(session?.user?.token).split("NEXT2121ANG")[1];
//           const response = await gethRoleAction();
//           const decrypted = decryptDataforResponse(response.ApiData, token);
//           const parsed = JSON.parse(decrypted);
//           const userRole: "admin" | "warden" | "dsr" | null = parsed[0]?.type ?? null;

//           if (userRole !== "warden") {
//             if (userRole === "admin") router.replace("/dashboard/hostelactivity/admin");
//             else if (userRole === "dsr") router.replace("/dashboard/hostelactivity/dsr");
//             else router.replace("/unauthorized");
//           } else {
//             setRoleChecked(true);
//           }
//         } catch (err) {
//           console.error("Role check failed:", err);
//           router.replace("/error");
//         }
//       }

//       if (session?.user?.token) {
//         checkRole();
//       }
//     }, [session, router]);

//     // if (!roleChecked) return null; 

//         const fetchData = async () => {
//       if (isDataFetched.current) return;
//       setLoading(true);
//       try {
//         const response = await gethostelactivitywardenAction();
//         const token = String(session?.user?.token).split("NEXT2121ANG")[1];

//         if (response.status === "success") {
//           const decrypted = decryptDataforResponse(response.ApiData, token);
//           const parsed = JSON.parse(decrypted);
//           // console.log("Datalivewarden:", parsed);
//           setstudent(parsed);
//           onDataFetched?.(parsed);
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
//   useEffect(() => {


//       fetchData();

//   }, [onDataFetched, session]);

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const [searchTerm, setSearchTerm] = useState("");
//   const [uploadSuccess, setUploadSuccess] = useState(false);

//   // Flatten all students into one array (for search/export)
//   const apiStudents = useMemo(() => {
//     if (!student || student.length === 0) return [];
//     return student.flatMap((h: any) =>
//       (h.students || []).map((s: any) => ({
//         name: s.name,
//         regd: s.registerationNumber ?? "N/A",
//         hostel: h.hostel,
//         sessionOn:h.sessionOn,
//         dutyperson:h.dutyperson

//       }))
//     );
//   }, [student]);

//   // Group students by hostel (for UI)
//   const groupedByHostel = useMemo(() => {
//     const groups: Record<string, any[]> = {};
//     apiStudents.forEach((s) => {
//       if (!groups[s.hostel]) groups[s.hostel] = [];
//       groups[s.hostel].push(s);
//     });
//     // Sort students within hostel
//     Object.keys(groups).forEach((key) => {
//       groups[key] = groups[key].sort((a, b) => a.name.localeCompare(b.name));
//     });
//     return groups;
//   }, [apiStudents]);

//   // Filtered by search
//   const filteredGroups = useMemo(() => {
//     if (!searchTerm) return groupedByHostel;
//     const term = searchTerm.toLowerCase();
//     const groups: Record<string, any[]> = {};
//     Object.keys(groupedByHostel).forEach((hostel) => {
//       const matches = groupedByHostel[hostel].filter(
//         (s) =>
//           s.name.toLowerCase().includes(term) ||
//           s.regd.toString().includes(term) ||
//           s.hostel.toLowerCase().includes(term)||
//           s.sessionOn.toLowerCase().includes(term)||
//           s.dutyperson.toLowerCase().includes(term)
//       );
//       if (matches.length > 0) groups[hostel] = matches;
//     });
//     return groups;
//   }, [searchTerm, groupedByHostel]);

//   // ===== Menu & Export =====
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
//     doc.text("Warden Hostel Activity Report", 14, 22);
//     doc.setFontSize(12);
//     doc.text(`Total Students: ${apiStudents.length}`, 14, 30);

//     const headers = [["Name", "Registration No", "Hostel","Session_On","Duty_Person"]];
//     const data = apiStudents.map((s) => [s.name, s.regd, s.hostel,s.sessionOn,s.dutyperson]);

//     autoTable(doc, {
//       head: headers,
//       body: data,
//       startY: 35,
//       theme: "grid",
//       headStyles: {
//         fillColor: [41, 128, 185],
//         textColor: 255,
//         fontStyle: "bold",
//       },
//       alternateRowStyles: { fillColor: [245, 245, 245] },
//       margin: { top: 30 },
//     });

//     doc.save("hostel_students.pdf");
//     setUploadSuccess(true);
//   };

//   const handleExport = async () => {
//     if (!apiStudents || apiStudents.length === 0) return;

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("Hostel Report");

//     worksheet.addRow(["Name", "Registration No", "Hostel","Session_On","Duty_Person"]);

//     apiStudents.forEach((s) => {
//       worksheet.addRow([s.name, s.regd, s.hostel,s.sessionOn,s.dutyperson]);
//     });

//     const headerRow = worksheet.getRow(1);
//     headerRow.font = { bold: true };
//     headerRow.alignment = { horizontal: "center" };

//     const buffer = await workbook.xlsx.writeBuffer();
//     const blob = new Blob([buffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "hostel_students.xlsx";
//     a.click();
//     window.URL.revokeObjectURL(url);

//     setUploadSuccess(true);
//   };

// const handleOpenModal = (student: Student, index: number) => {

//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);

//   };




//     const [formDatapresent, setFormDatapresent] = useState<FormDataPresent>({
//       remarks: "",
//       remarkAdmin: "",
//     });

//     const [formErrorspresent, setFormErrorspresent] =
//       useState<FormErrorsPresent>({});



//     // Handler for Select
//     const handleSelectChangee = (e: SelectChangeEvent<string>) => {
//       const { name, value } = e.target;

//       setFormDatapresent((prev) => ({
//         ...prev,
//         [name]: value,
//         // optional: clear remarkAdmin if not "other"
//         remarkAdmin: value !== "other" ? "" : prev.remarkAdmin,
//       }));

//       setFormErrorspresent((prev) => ({
//         ...prev,
//         [name]: "",
//         remarkAdmin: value !== "other" ? "" : prev.remarkAdmin,
//       }));
//     };

//     // Handler for TextField
//     const handleInputChangee = (
//       e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//     ) => {
//       const { name, value } = e.target;

//       setFormDatapresent((prev) => ({
//         ...prev,
//         [name]: value,
//       }));

//       setFormErrorspresent((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     };

//     // Validation
//     const validatee = () => {
//       const errors: FormErrorsPresent = {};

//       if (!formDatapresent.remarks) {
//         errors.remarks = "Please select a remark option";
//       }

//       if (formDatapresent.remarks === "other") {
//         if (!formDatapresent.remarkAdmin.trim()) {
//           errors.remarkAdmin = "Remarks are required";
//         } else if (formDatapresent.remarkAdmin.trim().length < 10) {
//           errors.remarkAdmin = "Remarks must be at least 10 characters";
//         }
//       }

//       setFormErrorspresent(errors);
//       return Object.keys(errors).length === 0;
//     };

//     // Submit handler
//     const handleSubmitpresent = async (e: React.FormEvent, studentId: number) => {
//       e.preventDefault();

//       if (validatee()) {
//         // console.log("Form submitted", formDatapresent);
//         // console.log("id",studentId)
//         const submitData = {
//           id: studentId,
//           finalremarksadmin: `${formDatapresent.remarks}::${formDatapresent.remarkAdmin}`
//         };

//         console.log(submitData);
//         setSnackbarMessage("Admin remarks submitted!");
//         setSnackbarOpen(true);
//         isDataFetched.current = false;
//         await fetchData;

//         handleCloseModal();

//       }
//     };

//    if (!roleChecked) return null; 
//   return (
//     <Box p={2}>
//       <Breadcrumb
//         title="Warden Hostel Activity"
//         items={BCrumb}
//         titleIcon="material-symbols:hotel"
//       />
//       <ChildCard>
//         {/* Search Bar, Total Count, and Download Button */}
//         <Box display="flex" alignItems="center" gap={2} mb={2} flexWrap="wrap">
//           <TextField
//             label="Search by Name, Regd, or Hostel"
//             variant="outlined"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             sx={{ flexGrow: 1, minWidth: isMobile ? "100%" : "200px" }}
//           />

//           <Box display="flex" alignItems="center" gap={1}>
//             <Typography variant="body1" sx={{ whiteSpace: "nowrap" }}>
//               Total Students: {apiStudents.length}
//             </Typography>

//             {apiStudents.length > 0 && (
//               <>
//                 <IconButton
//                   color="primary"
//                   sx={{ py: 0.5, fontSize: "0.75rem", mb: 2 }}
//                   onClick={handleClick}
//                 >
//                   <IconDownload width={22} />
//                 </IconButton>

//                 <Menu
//                   anchorEl={anchorEl}
//                   open={open}
//                   onClose={handleClose}
//                   anchorOrigin={{
//                     vertical: "bottom",
//                     horizontal: "right",
//                   }}
//                   transformOrigin={{
//                     vertical: "top",
//                     horizontal: "right",
//                   }}
//                 >
//                   <MenuItem onClick={handleDownloadPDF}>
//                     Download PDF
//                   </MenuItem>
//                   <MenuItem onClick={handleDownloadExcel}>
//                     Download Excel
//                   </MenuItem>
//                 </Menu>

//                 <Snackbar
//                   open={uploadSuccess}
//                   autoHideDuration={3000}
//                   onClose={() => setUploadSuccess(false)}
//                   anchorOrigin={{ vertical: "top", horizontal: "center" }}
//                 >
//                   <Alert severity="success" sx={{ width: "100%" }}>
//                     Report downloaded successfully!
//                   </Alert>
//                 </Snackbar>
//               </>
//             )}
//           </Box>
//         </Box>

//         <Scrollbar sx={{ height: "440px" }}>
//           {/* Grouped by hostel */}
//           {Object.keys(filteredGroups).map((hostel) => (
//             <Box key={hostel} mb={3}>
//               <Typography
//                 variant="h6"
//                 gutterBottom
//                 align="center"
//                 sx={{ fontWeight: "bold", mt: 2 }}
//               >
//                 {hostel}
//               </Typography>
//               <Grid container spacing={1}>
//                 {filteredGroups[hostel].map((student, index) => (
//                   <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
//                     <Card
//                     onClick={() => handleOpenModal(student, index)}
//                       sx={{
//                         height: "80%",
//                         display: "flex",
//                         alignItems: "center",
//                         transition: "all 0.2s ease-in-out",
//                         boxShadow: "0 2px 10px rgba(122, 112, 112, 0.08)",
//                         "&:hover": {
//                           transform: "scale(1.01)",
//                           boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
//                         },
//                       }}
//                     >
//                       <Box>
//                         <Tooltip title={student.name}>
//                           <Typography
//                             variant="h6"
//                             gutterBottom
//                             align="center"
//                           >
//                            {student.name} ({student.regd})
//                           </Typography>
//                         </Tooltip>
//                         <Box

//                           justifyContent="space-between"
//                           columnGap={4}
//                           mt={1}
//                         >
//                          <Box display="flex">
//                           <Typography  variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }} >
//                             Session_On: 
//                           </Typography>
//                           <Typography variant="body2" paddingLeft={1} sx={{fontSize:12}} >
//                             {student.sessionOn}
//                             </Typography>
//                           </Box>
//                           <Box  display="flex" mt={1}>
//                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
//                             Duty_Person: 
//                           </Typography>
//                           <Typography paddingLeft={1} sx={{fontSize:12}}>
//                             {student.dutyperson}
//                           </Typography>
//                           </Box>
//                         </Box>
//                       </Box>
//                     </Card>
//                   </Grid>
//                 ))}
//               </Grid>
//             </Box>
//           ))}
//         </Scrollbar>
//       </ChildCard>
//        <Modal
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
//               <>
//                   <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//                       <Typography variant="h6" gutterBottom>
//                        Warden Section
//                       </Typography>
//                       <IconButton onClick={handleCloseModal}>
//                         <CloseIcon />
//                       </IconButton>
//                       <Scrollbar sx={{ minHeight: "80vh" }} >


//                           <form onSubmit={(e) => handleSubmitpresent(e, selectedStudent.id)} noValidate>
//                         <FormControl
//                           fullWidth
//                           margin="normal"
//                           error={!!formErrorspresent.remarks}
//                         >
//                           <InputLabel>Remarks*</InputLabel>
//                           <Select
//                             name="remarks"
//                             value={formDatapresent.remarks || ""}
//                             onChange={handleSelectChangee}
//                             label="Remarks*"
//                           >
//                             <MenuItem value="ok">Ok</MenuItem>
//                             <MenuItem value="not ok">Not Ok</MenuItem>
//                             <MenuItem value="other">Other</MenuItem>
//                           </Select>
//                           {formErrorspresent.remarks && (
//                             <Typography variant="caption" color="error">
//                               {formErrorspresent.remarks}
//                             </Typography>
//                           )}
//                         </FormControl>

//                         {formDatapresent.remarks === "other" && (
//                           <TextField
//                             fullWidth
//                             label="Remarks of Admin *"
//                             name="remarkAdmin"
//                             multiline
//                             rows={5}
//                             value={formDatapresent.remarkAdmin}
//                             onChange={handleInputChangee}
//                             margin="normal"
//                             error={!!formErrorspresent.remarkAdmin}
//                             helperText={formErrorspresent.remarkAdmin}
//                           />
//                         )}





//                         <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 1 }}>
//                           <Button variant="contained" type="submit" >
//                             Submit
//                           </Button>
//                           <Button variant="contained" onClick={handleCloseModal}>
//                             Close
//                           </Button>
//                         </Box>
//                       </form>
//                       </Scrollbar>
//                     </Box>
//               </>
//             </Box>
//           </Modal>
//     </Box>
//   );
// };

// export default WardenPending;


"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  TextField,
  useMediaQuery,
  IconButton,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Tooltip,
  Modal,
  FormControl,
  InputLabel,
  Select,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ChildCard from "@/app/components/shared/ChildCard";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { IconDownload } from "@tabler/icons-react";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";

import ExcelJS from "exceljs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { gethRoleAction } from "@/app/actions/StaffActions/hostalActivityAction/getRoleAction";
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import { gethostelactivitywardenAction } from "@/app/actions/StaffActions/hostalActivityAction/warden/getwardenAction";
import CloseIcon from "@mui/icons-material/Close";
import { getwardenselectremarksAction } from "@/app/actions/StaffActions/hostalActivityAction/warden/getselectectoptionremarks";
import { savewardenremarksAction } from "@/app/actions/StaffActions/hostalActivityAction/warden/savewardenremarksAction";
import Breadcrumb from "@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";

const BCrumb = [
  { to: "/dashboard", title: "Home", icon: "ic:baseline-home" },
  { title: "warden Hostel Activity" },
];

interface FormDataPresent {
  remarks: string;
  remarkAdmin: string;
}

interface FormErrorsPresent {
  remarks?: string;
  remarkAdmin?: string;
}

interface Student {
  id: string;
  name: string;
  regd: string;
  hostel: string;
  sessionOn?: string;
  dutyperson?: string;
  roomNumber?: string;
}

// Dropdown options array


const WardenPending = ({ onDataFetched }: any) => {
  const [roleChecked, setRoleChecked] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isDataFetched = useRef(false);
  const [student, setstudent] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [remarksOptions, setremarksOptions] = useState<any[]>([]);
  // remarks form state
  const [formDatapresent, setFormDatapresent] = useState<FormDataPresent>({
    remarks: "",
    remarkAdmin: "",
  });

  const [formErrorspresent, setFormErrorspresent] =
    useState<FormErrorsPresent>({});



  const fetchData = async () => {
    if (isDataFetched.current) return;
    setLoading(true);
    try {
      const response = await gethostelactivitywardenAction();
      const response1 = await getwardenselectremarksAction();
      const token = String(session?.user?.token).split("NEXT2121ANG")[1];

      if (response.status === "success") {
        const decrypted = decryptDataforResponse(response.ApiData, token);
        const decryptedremarks = decryptDataforResponse(response1.ApiData, token);
        const parsed = JSON.parse(decrypted);
        const parsed1 = JSON.parse(decryptedremarks);
        console.log("pending warden", parsed)
        console.log("selectoption", parsed1)
        setstudent(parsed);
        setremarksOptions(parsed1)
        onDataFetched?.(parsed);
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Flatten students
  const apiStudents = useMemo(() => {
    if (!student || student.length === 0) return [];
    return student.flatMap((h: any) =>
      (h.students || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        regd: s.registerationNumber ?? "N/A",
        hostel: h.hostel,
        sessionOn: h.sessionOn,
        dutyperson: h.dutyperson,
        roomNumber: s.roomNumber,
      }))
    );
  }, [student]);

  // Group by hostel
  const groupedByHostel = useMemo(() => {
    const groups: Record<string, any[]> = {};
    apiStudents.forEach((s) => {
      if (!groups[s.hostel]) groups[s.hostel] = [];
      groups[s.hostel].push(s);
    });
    Object.keys(groups).forEach((key) => {
      groups[key] = groups[key].sort((a, b) => a.name.localeCompare(b.name));
    });
    return groups;
  }, [apiStudents]);

  // Filter search
  const filteredGroups = useMemo(() => {
    if (!searchTerm) return groupedByHostel;
    const term = searchTerm.toLowerCase();
    const groups: Record<string, any[]> = {};
    Object.keys(groupedByHostel).forEach((hostel) => {
      const matches = groupedByHostel[hostel].filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          s.regd.toString().includes(term) ||
          s.hostel.toLowerCase().includes(term) ||
          s.sessionOn?.toLowerCase().includes(term) ||
          s.dutyperson?.toLowerCase().includes(term) ||
          s.roomNumber?.toLowerCase().includes(term)
      );
      if (matches.length > 0) groups[hostel] = matches;
    });
    return groups;
  }, [searchTerm, groupedByHostel]);


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

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Warden Hostel Activity Report", 14, 22);
    doc.setFontSize(12);
    doc.text(`Total Students: ${apiStudents.length}`, 14, 30);

    const headers = [["Name", "Registration No", "Hostel", "Session_On", "Duty_Person", "RoomNo"]];
    const data = apiStudents.map((s) => [s.name, s.regd, s.hostel, s.sessionOn, s.dutyperson, s.roomNumber]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 35,
      theme: "grid",
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 30 },
    });

    doc.save("hostel_students.pdf");
    setSnackbarMessage("Report Download Sucessfully!");
    setSnackbarOpen(true);
  };

  const handleExport = async () => {
    if (!apiStudents || apiStudents.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Hostel Report");

    worksheet.addRow(["Name", "Registration No", "Hostel", "Session_On", "Duty_Person", "RoomNo"]);

    apiStudents.forEach((s) => {
      worksheet.addRow([s.name, s.regd, s.hostel, s.sessionOn, s.dutyperson, s.roomNumber]);
    });

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hostel_students.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);

    setSnackbarMessage("Report Download Sucessfully!");
    setSnackbarOpen(true);
  };

  // ===== Modal Handlers =====
  const handleOpenModal = (student: Student) => {
    setSelectedStudent(student);
    setFormDatapresent({ remarks: "", remarkAdmin: "" }); // reset form
    setFormErrorspresent({});
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStudent(null);
  };

  // ===== Form Handlers =====
  const handleSelectChangee = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormDatapresent((prev) => ({
      ...prev,
      [name]: value,
      remarkAdmin: value !== "Any Other" ? "" : prev.remarkAdmin,
    }));
    setFormErrorspresent((prev) => ({
      ...prev,
      [name]: "",
      remarkAdmin: value !== "Any Other" ? "" : prev.remarkAdmin,
    }));
  };

  const handleInputChangee = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormDatapresent((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrorspresent((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

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

  const handleSubmitpresent = async (
    e: React.FormEvent,
    studentId: string
  ) => {
    e.preventDefault();
    if (validatee()) {


      if (formDatapresent.remarks === "other" && formDatapresent.remarkAdmin) {
        formDatapresent.remarks = `other :: ${formDatapresent.remarkAdmin}`;
      }
      const submitData = {
        // id: studentId,
        // finalremarksadmin: `${formDatapresent.remarks}::${formDatapresent.remarkAdmin}`,

                User : "",
          id : studentId,
        officialObservation : `${formDatapresent.remarks}`
      };
      console.log("Submit Data:", submitData);
      const credentialsJson = JSON.stringify(submitData);
          console.log("credentialsJsonadmin", credentialsJson);
      
          if (!session || !session.user || !session.user.token) {
            throw new Error("Session or token is missing");
          }
          let splitValue = session.user.token.split("NEXT2121ANG");
          const { Data } = encryptData(credentialsJson, splitValue[1]);
          
      
          console.log("Encrypted Data:", Data);
      
      
            const response = await savewardenremarksAction(Data);
      
          const decrypted = decryptDataforResponse(response.ApiData,splitValue[1] );
          const parsed = JSON.parse(decrypted);
          console.log("save data respons of remarks warden", parsed);
        
      setSnackbarMessage(" warden Remarks submitted!");
      setSnackbarOpen(true);
      isDataFetched.current = false;
      await fetchData();
      handleCloseModal();
    }
  };



  return (
    <Box p={2}>
      <Breadcrumb
        title="Warden Hostel Activity"
        items={BCrumb}
        titleIcon="material-symbols:hotel"
      />
      <ChildCard>
        {/* Search Bar */}
        <Box display="flex" alignItems="center" gap={2} mb={2} flexWrap="wrap">
          <TextField
            label="Search by Name, Regd, or Hostel"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: isMobile ? "100%" : "200px" }}
          />
          <Typography variant="body1" sx={{ whiteSpace: "nowrap" }}>
            Total Students: {apiStudents.length}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body1" sx={{ whiteSpace: "nowrap" }}>
              Total Students: {apiStudents.length}
            </Typography>

            {apiStudents.length > 0 && (
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
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem onClick={handleDownloadPDF}>
                    Download PDF
                  </MenuItem>
                  <MenuItem onClick={handleDownloadExcel}>
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
                    {/* Report downloaded successfully! */}
                    {snackbarMessage}

                  </Alert>
                </Snackbar>
              </>
            )}
          </Box>
        </Box>

        <Scrollbar sx={{ height: "440px" }}>
          {Object.keys(filteredGroups).map((hostel) => (
            <Box key={hostel} mb={3}>
              <Typography
                variant="h6"
                gutterBottom
                align="center"
                sx={{ fontWeight: "bold", mt: 2 }}
              >
                {hostel}
              </Typography>
              <Grid container spacing={1}>
                {filteredGroups[hostel].map((student, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                    <Card
                      onClick={() => handleOpenModal(student)}
                      sx={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        p: 1,
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.01)",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                        },
                      }}
                    >
                      <Box>
                        <Tooltip title={student.name}>
                          <Typography variant="h6" gutterBottom align="center">
                            {student.name} ({student.regd})
                          </Typography>
                        </Tooltip>
                        <Box mt={1}>

                          <Typography variant="body2" gap="5">
                            <b>Session On:</b> {student.sessionOn}
                          </Typography>

                          <Typography variant="body2">
                            <b>Duty Person:</b> {student.dutyperson}
                          </Typography>
                          <Typography variant="body2">
                            <b>RoomNo:</b> {student.roomNumber}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Scrollbar>
      </ChildCard>

      {/* Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
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
            p: 3,
          }}
        >
          {selectedStudent && (
            <>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Typography variant="h6">
                  Warden Section – {selectedStudent.name} ({selectedStudent.regd})
                </Typography>
                <IconButton onClick={handleCloseModal}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <form
                onSubmit={(e) => handleSubmitpresent(e, selectedStudent.id)}
                noValidate
              >
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

                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <Button variant="contained" type="submit">
                    Submit
                  </Button>
                  <Button variant="outlined" onClick={handleCloseModal}>
                    Close
                  </Button>
                </Box>
              </form>
            </>
          )}
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {/* Report downloaded successfully! */}
          {snackbarMessage}

        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WardenPending;
