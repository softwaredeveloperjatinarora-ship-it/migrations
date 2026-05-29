

import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Chip,
  Tooltip,
  IconButton,
  TableCell,
  Typography,
  Button,
  TableContainer,
  Grid,
  Divider,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { IconDownload, IconFileUpload } from "@tabler/icons-react";
import FilterChip from "./FilterChip";
import { useSession } from "next-auth/react";
import UploadDialog from "./UploadDialog";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";

interface PendingAssignmentProps {
  searchTerm: string;
  onPendingCountChange: (count: number) => void;
  selectedCategory: string;
  pendingdata: any[];
}

export default function PendingAssignment({
  searchTerm,
  onPendingCountChange,
  selectedCategory,
  pendingdata
}: PendingAssignmentProps) {
  const { data: session } = useSession();
  const [selectedCourse, setSelectedCourse] = useState<string[] | null>(null);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedUploadData, setSelectedUploadData] = useState<{ course: string, type: string } | null>(null);
  const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const pendingAssignments = Array.isArray(pendingdata)
    ? pendingdata.filter((pendingdata) => pendingdata.category === "Pending")
    : [];           

  // Get unique course names for the chip filter
  const uniqueCourses = Array.from(
    new Set(pendingAssignments.map((pendingdata) => pendingdata.course.split(":")[0]))
  );

  // Filter assignments based on selected course
  const displayedData =
    selectedCourse === null
      ? pendingAssignments
      : pendingAssignments.filter((pendingdata) =>
        selectedCourse.includes(pendingdata.course.split(":")[0])
      );

  // Send count to parent whenever `pendingAssignments` changes
  useEffect(() => {
    onPendingCountChange(pendingAssignments.length);
  }, [pendingAssignments, onPendingCountChange]);

  const handleDownload = (Course: string) => { };

  const handleUploadClick = (course: string, type: string) => {
    setSelectedUploadData({ course, type });
    setOpenUploadDialog(true);
  };

  const handleFileUpload = (file: File | null) => {
    if (file) {

    }
  };

  return (

    <Box>

      <FilterChip
        items={uniqueCourses}
        onSelect={setSelectedCourse}
        selectedCategory={selectedCategory}
      />
      <Scrollbar sx={{height:'500px'}}>
      <Box >



         {isMobile ? (
                    // Card Layout for Mobile View
                    <Grid container spacing={2}>
                      {displayedData.length === 0 ? (
                        <Grid size={{ xs: 12 }} >
                          <Typography variant="h6" color="textSecondary" align="center">
                            No matching courses found.
                          </Typography>
                        </Grid>
                      ) : (
                        displayedData.map((pendingdata, index)=> (
                          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
        
                            <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography variant="h6" >
                              {pendingdata.course.includes(":") ? (
                      <>
                        {pendingdata.course.split(":")[0]}
                      </>
                    ) : (
                      pendingdata.course
                    )}
                              </Typography>
        
                              <Chip
                      color={
                        pendingdata.category === "Pending"
                          ? "warning"
                          : "warning"
                      }
                      label={pendingdata.category}
                      size="small"
                    />
                            </Box>
        
        
                            <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        
        
                              <Typography variant="body2" color="textSecondary" >
                                <b>Faculty:</b>   {pendingdata.teacher.includes(":") ? (
                      <>
                        {pendingdata.teacher.split(":")[0]} <br />
                        {pendingdata.teacher.split(":")[1]}
                      </>
                    ) : (
                      pendingdata.teacher
                    )}
                              </Typography>
        
        
                              <Typography variant="body2" color="textSecondary" >
                                <b>Upload Date:</b>    {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(pendingdata.fromDate))}
                              </Typography>
        
                            </Box>
        
        
        
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        
        
                              <Typography variant="body2" color="textSecondary" >
                                <b>Type:</b>  {pendingdata.title}
                              </Typography>
        
        
                              <Typography variant="body2" color="textSecondary" >
                                <b>Submission Date:</b>     {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(pendingdata.toDate))}
                              </Typography>
                            </Box>
        
        
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography
          variant="body2"
          color="textSecondary"
          component="div" // <-- This fixes the problem
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <b>Action:</b>
          <Box display="flex" justifyContent="center">
          <Tooltip title="Download Assignment">
                      <IconButton
                        color="primary"
                        onClick={() => handleDownload(pendingdata.course)}
                      >
                        <IconDownload width={22} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Upload Assignment">
                      <IconButton
                        color="primary"
                        onClick={() => handleUploadClick(pendingdata.course, pendingdata.title)}
                      >
                        <IconFileUpload width={30} height={25} />
                      </IconButton>
                    </Tooltip>
          </Box>
        </Typography>
        
        
                              <Typography variant="body2" color="textSecondary" paragraph>
                                <b>Remarks:</b> {pendingdata.remarks || "NA"}
                              </Typography>
                            </Box>
        
        
        
                            <Divider />
        
                          </Grid>
                        ))
                      )}
                    </Grid>
                  ) : (
        
       

      <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center"><b> Course</b></TableCell>
                  <TableCell align="center"><b>Faculty</b></TableCell>
                  <TableCell align="center"><b>Upload Date</b></TableCell>
                  <TableCell align="center"><b> Submission Date</b></TableCell>
                  <TableCell align="center"><b>Type</b></TableCell>
                  <TableCell align="center"><b>Remarks</b></TableCell>
                  <TableCell align="center"><b>Status</b></TableCell>
                  <TableCell align="center"><b>Action</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>


              {pendingAssignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="h6" color="textSecondary">
                    No matching courses found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (




              displayedData.map((pendingdata, index) => {

                    return (
                      <TableRow key={index} >
                        <TableCell align="center">
                        {pendingdata.course.includes(":") ? (
                      <>
                        {pendingdata.course.split(":")[0]}
                      </>
                    ) : (
                      pendingdata.course
                    )}
                        </TableCell>


                        <TableCell align="center">
                        {pendingdata.teacher.includes(":") ? (
                      <>
                        {pendingdata.teacher.split(":")[0]} <br />
                        {pendingdata.teacher.split(":")[1]}
                      </>
                    ) : (
                      pendingdata.teacher
                    )}
                        </TableCell>





                        <TableCell align="center">
                        {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(pendingdata.fromDate))}
                        </TableCell>


                        <TableCell align="center">
                        {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(pendingdata.toDate))}
                        </TableCell>


                        <TableCell align="center">
                        {pendingdata.title}
                        </TableCell>


                        <TableCell align="center">
                        {pendingdata.remarks || "NA"}
                         </TableCell>


                        <TableCell align="center">
                        <Chip
                      color={
                        pendingdata.category === "Pending"
                          ? "warning"
                          : "warning"
                      }
                      label={pendingdata.category}
                      size="small"
                    />
                        </TableCell>


                        <TableCell align="center">
                      

                        <Tooltip title="Download Assignment">
                      <IconButton
                        color="primary"
                        onClick={() => handleDownload(pendingdata.course)}
                      >
                        <IconDownload width={22} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Upload Assignment">
                      <IconButton
                        color="primary"
                        onClick={() => handleUploadClick(pendingdata.course, pendingdata.title)}
                      >
                        <IconFileUpload width={30} height={25} />
                      </IconButton>
                    </Tooltip>

                         </TableCell>

                      </TableRow>
                  
                    )
                  }

                  ))}

              </TableBody>
            </Table>
          </TableContainer>
                  )}

      </Box>
      </Scrollbar>

      <UploadDialog
        open={openUploadDialog}
        onClose={() => setOpenUploadDialog(false)}
        //onUpload={handleFileUpload}
        course={selectedUploadData?.course || ""}
        type={selectedUploadData?.type || ""}
      />
    </Box>
  );
}
