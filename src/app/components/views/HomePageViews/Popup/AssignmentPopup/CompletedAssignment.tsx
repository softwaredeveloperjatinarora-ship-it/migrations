


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
  TableContainer,
  Grid,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { IconDownload, IconFileUpload, IconEye } from "@tabler/icons-react";
import FilterChip from "./FilterChip";
import { useSession } from "next-auth/react";
import UploadDialog from "./UploadDialog";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";

interface PendingAssignmentProps {
  searchTerm: string;
  onCompletedCountChange: (count: number) => void;
  selectedCategory: string;
  completedData: any[];
}

export default function PendingAssignment({
  searchTerm,
  onCompletedCountChange,
  selectedCategory,
  completedData
}: PendingAssignmentProps) {
  const [selectedCourse, setSelectedCourse] = useState<string[] | null>(null);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedUploadData, setSelectedUploadData] = useState<{ course: string, type: string } | null>(null);
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Filter assignments to get only Completed ones and match searchTerm
  const completedAssignments = Array.isArray(completedData)
    ? completedData.filter((completedData) => completedData.category === "Completed")
    : [];

  // Get unique course names for the chip filter
  const uniqueCourses = Array.from(
    new Set(completedAssignments.map((completedData) => completedData.course.split(":")[0]))
  );

  // Filter assignments based on selected course
  const displayedData =
    selectedCourse === null
      ? completedAssignments
      : completedAssignments.filter((completedData) =>
        selectedCourse.includes(completedData.course.split(":")[0])
      );

  // Send count to parent whenever `pendingAssignments` changes
  useEffect(() => {
    onCompletedCountChange(completedAssignments.length);
  }, [completedAssignments, onCompletedCountChange]);

  const handleDownload = (course: string) => { };
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
      <Scrollbar sx={{ height: '500px' }}>
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
                displayedData.map((completedData, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>

                    <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="h6" >
                        {completedData.course.includes(":") ? (
                          <>
                            {completedData.course.split(":")[0]}
                          </>
                        ) : (
                          completedData.course
                        )}
                      </Typography>

                      <Chip
                        color={
                          completedData.category === "Completed"
                            ? "success"
                            : "warning"
                        }
                        label={completedData.category}
                        size="small"
                      />
                    </Box>


                    <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>



                      <Typography variant="body2" color="textSecondary" >
                        <b>Faculty:</b>   {completedData.teacher.includes(":") ? (
                          <>
                            {completedData.teacher.split(":")[0]} <br />
                            {completedData.teacher.split(":")[1]}
                          </>
                        ) : (
                          completedData.teacher
                        )}
                      </Typography>


                      <Typography variant="body2" color="textSecondary" >
                        <b>Upload Date:</b>  {new Intl.DateTimeFormat("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(completedData.fromDate))}
                      </Typography>

                    </Box>



                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>



                      <Typography variant="body2" color="textSecondary" >
                        <b>Type:</b>  {completedData.title}
                      </Typography>


                      <Typography variant="body2" color="textSecondary" >
                        <b>Submission Date:</b>    {new Intl.DateTimeFormat("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(completedData.toDate))}
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
        onClick={() => handleDownload(completedData.course)}
      >
        <IconDownload width={22} />
      </IconButton>
    </Tooltip>
    <Tooltip title="Upload Assignment">
      <IconButton
        color="primary"
        onClick={() =>
          handleUploadClick(completedData.course, completedData.title)
        }
      >
        <IconFileUpload width={30} height={25} />
      </IconButton>
    </Tooltip>
    <Tooltip title="View Assignment">
      <IconButton
        color="success"
        onClick={() => handleDownload(completedData.course)}
      >
        <IconEye width={22} />
      </IconButton>
    </Tooltip>
  </Box>
</Typography>


                      <Typography variant="body2" color="textSecondary" paragraph>
                        <b>Remarks:</b> {completedData.remarks || "NA"}
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


                  {completedAssignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="h6" color="textSecondary">
                          No matching courses found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (




                    displayedData.map((completedData, index) => {

                      return (
                        <TableRow key={index} >
                          <TableCell align="center">
                            {completedData.course.includes(":") ? (
                              <>
                                {completedData.course.split(":")[0]}
                              </>
                            ) : (
                              completedData.course
                            )}
                          </TableCell>


                          <TableCell align="center">
                            {completedData.teacher.includes(":") ? (
                              <>
                                {completedData.teacher.split(":")[0]} <br />
                                {completedData.teacher.split(":")[1]}
                              </>
                            ) : (
                              completedData.teacher
                            )}
                          </TableCell>





                          <TableCell align="center">
                            {new Intl.DateTimeFormat("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }).format(new Date(completedData.fromDate))}
                          </TableCell>


                          <TableCell align="center">
                            {new Intl.DateTimeFormat("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }).format(new Date(completedData.toDate))}
                          </TableCell>


                          <TableCell align="center">
                            {completedData.title}

                          </TableCell>


                          <TableCell align="center">
                            {completedData.remarks || "NA"}
                          </TableCell>


                          <TableCell align="center">
                            <Chip
                              color={
                                completedData.category === "Completed"
                                  ? "success"
                                  : "warning"
                              }
                              label={completedData.category}
                              size="small"
                            />
                          </TableCell>


                          <TableCell align="center">

                            <Box display="flex" justifyContent="center">
                              <Tooltip title="Download Assignment">
                                <IconButton
                                  color="primary"
                                  onClick={() => handleDownload(completedData.course)}
                                >
                                  <IconDownload width={22} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Upload Assignment">
                                <IconButton
                                  color="primary"
                                  onClick={() => handleUploadClick(completedData.course, completedData.title)}
                                >
                                  <IconFileUpload width={30} height={25} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="View Assignment">
                                <IconButton
                                  color="success"
                                  onClick={() => handleDownload(completedData.course)}
                                >
                                  <IconEye width={22} />
                                </IconButton>
                              </Tooltip>
                            </Box>

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
        course={selectedUploadData?.course || ""}
        type={selectedUploadData?.type || ""}
      />
    </Box>
  );
}
