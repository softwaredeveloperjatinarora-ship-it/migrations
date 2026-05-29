

"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Tooltip,
  Button,
  Stack,
  TextField,
  IconButton,
  Box,
  Card,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useTheme } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import { getOJTAttendanceViewData } from "@/app/actions/OJTDashboard/OJTAttendanceViewDataAction";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";

type AttendanceType = {
  id: number;
  date: string;
  CompanyName: string;
  InTime: string;
  OutTime: string;
  Reason?: string;
  AttendanceType: string;
};

const AttendanceTable = ({ onDataFetched }: any) => {
  const theme = useTheme();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session } = useSession();
  const [OJTdata, setOJTdata] = useState<any[]>([]);
  const [originalOJTdata, setOriginalOJTdata] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isDataFetched = useRef(false);

  const parseDate = (dateStr: string | undefined | null) => {
    if (!dateStr || typeof dateStr !== "string") return null;
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };


   const [loading, setLoading] = useState<boolean>(true);
  
  
  
    useEffect(() => {
      const fetchPlacementData = async () => {
        if (isDataFetched.current) return;
  
        try {
          setLoading(true);
          const response = await getOJTAttendanceViewData();
          // console.log("message ", response)
  
          if (response.status === "success") {
            let apiData = response.ApiData;
            let splitValue = String(session?.user?.token).split("NEXT2121ANG");
            const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
            const parsedData = JSON.parse(decryptedData);
            // console.log("attendencess", parsedData)
             setOJTdata(parsedData);
             setOriginalOJTdata(parsedData);
            onDataFetched(apiData);
          } else {
            setError(response.message);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Unknown error occurred");
        } finally {
          setLoading(false);
          isDataFetched.current = true;
        }
      };
  
      fetchPlacementData();
    }, [onDataFetched, session]);




  // Combine date + search filters
  useEffect(() => {
    const start = fromDate ? new Date(fromDate) : null;
    const end = toDate ? new Date(toDate) : null;

    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    const search = searchTerm.trim().toLowerCase();

    const filtered = originalOJTdata.filter((item) => {
      const itemDate = parseDate(item.Date);
      if (!itemDate) return false;
      itemDate.setHours(0, 0, 0, 0);

      const matchesDateRange =
        (!start || itemDate >= start) &&
        (!end || itemDate <= end);

      const matchesSearch =
        item.CompanyName.toLowerCase().includes(search) ||
        item.Date.toLowerCase().includes(search) ||
        item.AttendanceType.toLowerCase().includes(search) ||
        item.InTime.toLowerCase().includes(search) ||
        item.OutTime.toLowerCase().includes(search);

      return matchesDateRange && matchesSearch;
    });

    setOJTdata(filtered);
  }, [fromDate, toDate, searchTerm]);

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setSearchTerm("");
    setOJTdata(originalOJTdata);
  };

  const rowsPerPage = 8;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(OJTdata?.length / rowsPerPage);

  const handlePrevious = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const [show, setShow] = useState(true);
  const handleClose = () => setShow(!show);

  return (
    show && (
      <Card>
        <Box sx={{ padding: 2, width: "100%" }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            mb={2}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              View Attendance
            </Typography>

            <TextField
              variant="outlined"
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              size="small"
              sx={{ width: { xs: "100%", sm: "50%", md: "20%" } }}
            />
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <TextField
              label="Date From"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            />
            <TextField
              label="Date To"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={handleReset}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              Reset
            </Button>
          </Stack>

          <Box sx={{ width: "100%", overflowX: "auto", mt: 2 }}>
            <TableContainer
              component={Paper}
              sx={{ width: "100%", minWidth: 600, margin: "auto" }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Date</b></TableCell>
                    <TableCell><b>Company Name</b></TableCell>
                    <TableCell><b>In Time</b></TableCell>
                    <TableCell><b>Out Time</b></TableCell>
                    <TableCell><b>Attendance Type</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {OJTdata.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    OJTdata
                      .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                      .map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.Date}</TableCell>
                          <TableCell>{row.CompanyName}</TableCell>
                          <TableCell>{row.InTime}</TableCell>
                          <TableCell>{row.OutTime}</TableCell>
                          <TableCell sx={{ width: "200px" }}>
                            {row.AttendanceType === "On Leave" && row.Reason ? (
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Box
                                  bgcolor="warning.light"
                                  color="warning.main"
                                  fontSize="12px"
                                  p="0px 7px"
                                  border="1px solid"
                                  borderRadius={2}
                                  width="80px"
                                  height="20px"
                                >
                                  {row.AttendanceType}
                                </Box>
                                <Tooltip
                                  title={<Typography sx={{ whiteSpace: "pre-line" }}>{row.Reason}</Typography>}
                                  arrow
                                >
                                  <Typography
                                    sx={{
                                      paddingLeft: 2,
                                      cursor: "pointer",
                                      textDecoration: "underline",
                                    }}
                                  >
                                    Reason
                                  </Typography>
                                </Tooltip>
                              </Box>
                            ) : (
                              <Box
                                bgcolor="success.light"
                                color="success.main"
                                fontSize="12px"
                                p="0px 7px"
                                border="1px solid"
                                borderRadius={2}
                                width="80px"
                                height="20px"
                              >
                                {row.AttendanceType}
                              </Box>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{ mt: 2 }}
          >
            <IconButton onClick={handlePrevious} disabled={page === 0}>
              <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="body1">
              {page + 1} / {totalPages}
            </Typography>
            <IconButton onClick={handleNext} disabled={page === totalPages - 1}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Stack>
        </Box>
      </Card>
    )
  );
};

export default AttendanceTable;
