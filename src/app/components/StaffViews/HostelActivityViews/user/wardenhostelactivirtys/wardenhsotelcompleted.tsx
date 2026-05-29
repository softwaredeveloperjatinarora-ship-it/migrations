



"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
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
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import { gethostelactivitywardenAction } from "@/app/actions/StaffActions/hostalActivityAction/warden/getwardenAction";
import { gethostelactivitywardenCompletedAction } from "@/app/actions/StaffActions/hostalActivityAction/warden/getcompletedwardenAction";
import Breadcrumb from "@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";

const BCrumb = [
  { to: "/dashboard", title: "Home", icon: "ic:baseline-home" },
  { title: "warden Hostel Activity" },
];




const WardenCompleted = ({ onDataFetched }: any) => {
  const [roleChecked, setRoleChecked] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isDataFetched = useRef(false);
  const [student, setstudent] = useState<any[]>([]);



  
    // if (!roleChecked) return null; 
  useEffect(() => {
    const fetchData = async () => {
      if (isDataFetched.current) return;
      setLoading(true);
      try {
        const response = await gethostelactivitywardenCompletedAction();
        const token = String(session?.user?.token).split("NEXT2121ANG")[1];

        if (response.status === "success") {
          const decrypted = decryptDataforResponse(response.ApiData, token);
          const parsed = JSON.parse(decrypted);
          console.log("warden completed:", parsed);
          setstudent(parsed);
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
    if (session?.user?.token) {
      fetchData();
    }
  }, [onDataFetched, session]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
    const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Flatten all students into one array (for search/export)
  const apiStudents = useMemo(() => {
    if (!student || student.length === 0) return [];
    return student.flatMap((h: any) =>
      (h.students || []).map((s: any) => ({
        name: s.name,
        regd: s.registerationNumber ?? "N/A",
        hostel: h.hostel,
        sessionOn:h.sessionOn,
        dutyperson:h.dutyperson,
        wardenRemarks:s.wardenRemarks,
        roomNumber:s.roomNumber,
        wardenRemarksOn:formatDate(s.wardenRemarksOn)





      }))
    );
  }, [student]);

  // Group students by hostel (for UI)
  const groupedByHostel = useMemo(() => {
    const groups: Record<string, any[]> = {};
    apiStudents.forEach((s) => {
      if (!groups[s.hostel]) groups[s.hostel] = [];
      groups[s.hostel].push(s);
    });
    // Sort students within hostel
    Object.keys(groups).forEach((key) => {
      groups[key] = groups[key].sort((a, b) => a.name.localeCompare(b.name));
    });
    return groups;
  }, [apiStudents]);


  // Filtered by search
  const filteredGroups = useMemo(() => {
    if (!searchTerm) return groupedByHostel;
    const term = searchTerm.toLowerCase();
    const groups: Record<string, any[]> = {};
    Object.keys(groupedByHostel).forEach((hostel) => {
      const matches = groupedByHostel[hostel].filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          s.regd.toString().includes(term) ||
          s.hostel.toLowerCase().includes(term)||
          s.sessionOn.toLowerCase().includes(term)||
          s.dutyperson.toLowerCase().includes(term)||
          s.roomNumber.toLowerCase().includes(term)||
          s.wardenRemarks.toLowerCase().includes(term)

      );
      if (matches.length > 0) groups[hostel] = matches;
    });
    return groups;
  }, [searchTerm, groupedByHostel]);

  // ===== Menu & Export =====
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

    const headers = [["Name", "Registration No", "Hostel","Session_On","Duty_Person","RoomNo","Remarks","RemarksOn"]];
    const data = apiStudents.map((s) => [s.name, s.regd, s.hostel,s.sessionOn,s.dutyperson,s.roomNumber,s.wardenRemarks,s.wardenRemarksOn]);

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
    setUploadSuccess(true);
  };

  const handleExport = async () => {
    if (!apiStudents || apiStudents.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Hostel Report");

    worksheet.addRow(["Name", "Registration No", "Hostel","Session_On","Duty_Person","RoomNo","Remarks","RemarksOn"]);

    apiStudents.forEach((s) => {
      worksheet.addRow([s.name, s.regd, s.hostel,s.sessionOn,s.dutyperson,s.roomNumber,s.wardenRemarks,s.wardenRemarksOn]);
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

    setUploadSuccess(true);
  };
   
  return (
    <Box p={2}>
      <Breadcrumb
        title="Warden Hostel Activity"
        items={BCrumb}
        titleIcon="material-symbols:hotel"
      />
      <ChildCard>
        {/* Search Bar, Total Count, and Download Button */}
        <Box display="flex" alignItems="center" gap={2} mb={2} flexWrap="wrap">
          <TextField
            label="Search by Name, Regd, or Hostel"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: isMobile ? "100%" : "200px" }}
          />

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

        <Scrollbar sx={{ height: "440px" }}>
          {/* Grouped by hostel */}
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
                      sx={{
                        height: "80%",
                        display: "flex",
                        alignItems: "center",
                        transition: "all 0.2s ease-in-out",
                        boxShadow: "0 2px 10px rgba(122, 112, 112, 0.08)",
                        "&:hover": {
                          transform: "scale(1.01)",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                        },
                      }}
                    >
                      <Box>
                        <Tooltip title={student.name}>
                          <Typography
                            variant="h6"
                            gutterBottom
                            align="center"
                          >
                           {student.name} ({student.regd})
                          </Typography>
                        </Tooltip>
                        <Box
                          
                          justifyContent="space-between"
                          columnGap={4}
                          mt={1}
                        >
                         <Box display="flex">
                          <Typography  variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }} >
                            Session_On: 
                          </Typography>
                          <Typography variant="body2" paddingLeft={1} sx={{fontSize:12}} >
                            {student.sessionOn}
                            </Typography>
                           
                          </Box>
                          <Box  display="flex" mt={1}>
                           <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                            Duty_Person: 
                          </Typography>
                          <Typography paddingLeft={1} sx={{fontSize:12}}>
                            {student.dutyperson}
                          </Typography>
                        
                          
                          </Box>
                            {student.wardenRemarks&&(
                           <Typography paddingLeft={1} sx={{fontSize:12}}>
                            Remarks:{student.wardenRemarks}
                            
                          </Typography>
                          )}
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
    </Box>
  );
};

export default WardenCompleted;
