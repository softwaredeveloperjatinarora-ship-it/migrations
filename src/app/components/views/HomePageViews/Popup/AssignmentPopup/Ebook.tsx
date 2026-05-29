

import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Tooltip,
  IconButton,
  TableCell,
  Typography,
  useTheme,
  TableContainer,
  Grid,
  useMediaQuery,
  Chip,
  Divider,
} from "@mui/material";
import { IconChevronDown, IconDownload } from "@tabler/icons-react";
import FilterChip from "./FilterChip";
import { useSession } from "next-auth/react";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";

interface PendingAssignmentProps {
  searchTerm: string;
  onEContentCountChange: (count: number) => void;
  selectedCategory: string;
  EContentData: any[];
}

export default function Ebook({
  searchTerm,
  onEContentCountChange,
  selectedCategory,
  EContentData,
}: PendingAssignmentProps) {
  const [expanded, setExpanded] = useState<string | false>(false);
  const { data: session } = useSession();
  const [selectedCourse, setSelectedCourse] = useState<string[] | null>(null);
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); 

  const Econtent = Array.isArray(EContentData)
    ? EContentData.filter((item) => item.category === "Econtent")
    : [];

  const uniqueCourses = Array.from(
    new Set(Econtent.map((item) => item.course.split(":")[0]))
  );

  const displayedData =
    selectedCourse === null
      ? Econtent
      : Econtent.filter((item) =>
        selectedCourse.includes(item.course.split(":")[0])
      );

  useEffect(() => {
    onEContentCountChange(Econtent.length);
  }, [Econtent, onEContentCountChange]);

  const handleDownload = (course: string) => {
    // download logic
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
                displayedData.map((item, index)=> (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    {/* <Card> */}
                    {/* <CardContent> */}
                    <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="h6" >
                      {item.course.includes(":")
                            ? item.course.split(":")[0]
                            : item.course}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" paragraph>
                        <b>Type:</b>  {item.title}
                      </Typography>
                   
                    </Box>


                    <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>



                      <Typography variant="body2" color="textSecondary" paragraph>
                        <b>Faculty:</b>     {item.teacher.includes(":") ? (
                            <>
                              {item.teacher.split(":")[0]} <br />
                              {item.teacher.split(":")[1]}
                            </>
                          ) : (
                            item.teacher
                          )}
                      </Typography>

                    <Typography variant="body2" color="textSecondary" paragraph>
                      <b>Remarks:</b>  {item.remarks || "NA"}
                    </Typography>

                    </Box>





                    <Typography variant="body2" color="textSecondary" paragraph>
                      <b>Action:</b>  
                      <Tooltip title="Download Assignment">
                            <IconButton color="primary" onClick={() => handleDownload(item.course)}>
                              <IconDownload width={22} />
                            </IconButton>
                          </Tooltip>

                    </Typography>

                    <Divider />

                  </Grid>
                ))
              )}
            </Grid>
          ) : (



          <TableContainer
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center"><b> Course</b></TableCell>
                  <TableCell align="center"><b>Faculty</b></TableCell>
                  <TableCell align="center"><b>Type</b></TableCell>
                  <TableCell align="center"><b> Remarks</b></TableCell>
                  <TableCell align="center"><b>Action</b></TableCell>

                </TableRow>
              </TableHead>
              <TableBody>


                {Econtent.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="h6" color="textSecondary">
                        No matching courses found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (




                  displayedData.map((item, index) => {

                    return (
                      <TableRow key={`${item.course}-${index}`} >
                        <TableCell align="center">
                          {item.course.includes(":")
                            ? item.course.split(":")[0]
                            : item.course}
                        </TableCell>


                        <TableCell align="center">
                          {item.teacher.includes(":") ? (
                            <>
                              {item.teacher.split(":")[0]} <br />
                              {item.teacher.split(":")[1]}
                            </>
                          ) : (
                            item.teacher
                          )}
                        </TableCell>





                        <TableCell align="center">
                          {item.title}
                        </TableCell>


                        <TableCell align="center">
                          {item.remarks || "NA"}
                        </TableCell>


                        <TableCell align="center">
                          <Tooltip title="Download Assignment">
                            <IconButton color="primary" onClick={() => handleDownload(item.course)}>
                              <IconDownload width={22} />
                            </IconButton>
                          </Tooltip>

                        </TableCell>

                      </TableRow>
                      //   );
                      // })

                    )
                  }

                  ))}


              </TableBody>
            </Table>
          </TableContainer>

)}
        </Box>
      </Scrollbar>
    </Box>
  );
}
