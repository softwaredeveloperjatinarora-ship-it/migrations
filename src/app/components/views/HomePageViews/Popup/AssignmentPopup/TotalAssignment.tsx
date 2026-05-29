
import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Chip,
  Tooltip,
  IconButton,
  useTheme,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableCell,
  Typography,
  TableContainer,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Divider
} from "@mui/material";
import { IconFileText, IconBook, IconChecklist, IconDownload } from "@tabler/icons-react";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import { useSession } from "next-auth/react";
import FilterChip from "./FilterChip";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";

interface TotalAssignmentProps {
  searchTerm: string;
  onTotalCountChange: (count: number) => void;
  selectedCategory: string;
  TotalData: any[];
}

export const TotalAssignment = ({ searchTerm, onTotalCountChange, selectedCategory, TotalData }: TotalAssignmentProps) => {
  const theme = useTheme();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [assignment, setAssignment] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(true);
  const [selectedCourse, setSelectedCourse] = useState<string[] | null>(null);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); 

  const TotalAssignments = Array.isArray(TotalData) ? TotalData : [];


  const uniqueCourses = Array.from(
    new Set(TotalAssignments.map((TotalData) => TotalData.course.split(":")[0]))
  );

  const displayedData =
    selectedCourse === null
      ? TotalAssignments
      : TotalAssignments.filter((TotalData) =>
        selectedCourse.includes(TotalData.course.split(":")[0])
      );

  useEffect(() => {
    onTotalCountChange(TotalAssignments.length);
  }, [TotalAssignments, onTotalCountChange]);

  return (
    <Box>
      <FilterChip items={uniqueCourses} onSelect={setSelectedCourse} selectedCategory={selectedCategory} />

      <Scrollbar sx={{ height: '500px' }}>
        <Box sx={{ overflowX: "auto", mt: 1 }}>
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
                displayedData.map((TotalData, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    {/* <Card> */}
                    {/* <CardContent> */}
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="h6" >
                        {TotalData.course.includes(":") ? TotalData.course.split(":")[0] : TotalData.course}
                      </Typography>

                      <Chip
                        color={TotalData.category === "Pending" ? "warning" : TotalData.category === "Completed" ? "success" : "primary"}
                        label={TotalData.category}
                        size="small"
                      />
                    </Box>


                    <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>



                      <Typography variant="body2" color="textSecondary" paragraph>
                        <b>Faculty:</b>   {TotalData.teacher.includes(":") ? (
                          <>
                            {TotalData.teacher.split(":")[0]} <br />
                            {TotalData.teacher.split(":")[1]}
                          </>
                        ) : (
                          TotalData.teacher
                        )}
                      </Typography>


                      <Typography variant="body2" color="textSecondary" paragraph>
                        <b>Upload Date:</b> {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(TotalData.fromDate))}
                      </Typography>

                    </Box>



                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>



                      <Typography variant="body2" color="textSecondary" paragraph>
                        <b>Type:</b> {TotalData.title}
                      </Typography>


                      <Typography variant="body2" color="textSecondary" paragraph>
                        <b>Submission Date:</b>  {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(TotalData.toDate))}
                      </Typography>
                    </Box>


                    <Typography variant="body2" color="textSecondary" paragraph>
                      <b>Remarks:</b>{TotalData.remarks || "NA"}
                    </Typography>

                    {/* </CardContent> */}
                    {/* </Card> */}

                    <Divider />

                  </Grid>
                ))
              )}
            </Grid>
          ) : (
            // Table Layout for Larger Screens
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center"><b>Course</b></TableCell>
                    <TableCell align="center"><b>Faculty</b></TableCell>
                    <TableCell align="center"><b>Upload Date</b></TableCell>
                    <TableCell align="center"><b>Submission Date</b></TableCell>
                    <TableCell align="center"><b>Type</b></TableCell>
                    <TableCell align="center"><b>Remarks</b></TableCell>
                    <TableCell align="center"><b>Status</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {TotalAssignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="h6" color="textSecondary">
                          No matching courses found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedData.map((TotalData, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">
                          {TotalData.course.includes(":") ? TotalData.course.split(":")[0] : TotalData.course}
                        </TableCell>
                        <TableCell align="center">
                          {TotalData.teacher.includes(":") ? (
                            <>
                              {TotalData.teacher.split(":")[0]} <br />
                              {TotalData.teacher.split(":")[1]}
                            </>
                          ) : (
                            TotalData.teacher
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(TotalData.fromDate))}
                        </TableCell>
                        <TableCell align="center">
                          {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(TotalData.toDate))}
                        </TableCell>
                        <TableCell align="center">{TotalData.title}</TableCell>
                        <TableCell align="center">{TotalData.remarks || "NA"}</TableCell>
                        <TableCell align="center">
                          <Chip
                            color={TotalData.category === "Pending" ? "warning" : TotalData.category === "Completed" ? "success" : "primary"}
                            label={TotalData.category}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Scrollbar>
    </Box>
  );
};
