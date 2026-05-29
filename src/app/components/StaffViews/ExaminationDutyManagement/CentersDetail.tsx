"use client";
import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import { MeetingRoom, Description } from "@mui/icons-material";
import { getExamDutyCenterDetailAction, getExamDutyCenterRoomsListAction, GetExamDutyDistributionAction, GetExamDutyRoomAnswersheetsAction } from "@/app/actions/StaffActions/ExamDutyManagementActions/getexamdutydashboard";
import Link from "next/link";

import VisibilityIcon from "@mui/icons-material/Visibility";
interface CentersDetailProps {
  examDate: string | null;     // adjust based on your data type
  selectedTime: string | null;
  selectedType: string | null;
}

interface CenterData {
  CenterNo: string;
  CenterName?: string;
  [key: string]: any;
}

interface CenterItem {
  centerno: string;
  controlroom: string;
  category: string;
  scheduleStrength: string;
  presentStrength: string;
  absentStrength: string;
}

interface CenterUMC {
  centerNo: string;
  totalUMC: string;
}

interface CenterRoomItem {
  centerNo: string;
  totalRooms: string;
  attendanceDone: string;
  attendancePending: string;
  presentStrength: string;
  absentStrength: string;
}


interface CenterDuty {
  description: string;
  centerNo: string;
  noOfDuty: string;
  totalReported: string;
}

interface Discrepancies {
  centerNo: string;
  totalDiscrepancies: string;
}

interface SummaryRoomAnswerData {
  centerNo?: string;
  roomNo?: string;
  omrSheet?: string;
  threetwoPagesSheets?: string;
  twofourPagesSheets?: string;
  [key: string]: string | number | undefined;
}

interface CenterRoom {
  centerNo?: string;
  roomNo?: string;
}

const CentersDetail: React.FC<CentersDetailProps> = ({
  examDate,
  selectedTime,
  selectedType,
}) => {
  const theme = useTheme();
  // const centers = [
  //   101, 1301, 1302, 1303, 1304,
  //   1305, 1306, 1307, 1308, 1309,
  //   1310, 1311
  // ];
  const [centers, setCenters] = useState<CenterData[]>([]);
  const [centersData, setCentersData] = useState<CenterItem[]>([]);
  const [centerroomsData, setCenterroomsData] = useState<CenterRoomItem[]>([]);
  const [umcData, setUMCData] = useState<CenterUMC[]>([]);
  const [dutyData, setDutyData] = useState<CenterDuty[]>([]);
  const [discripenciesData, setDiscripenciesData] = useState<Discrepancies[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);
  const [filteredCenterData, setFilteredCenterData] = useState<CenterItem[]>([]);
  const [filteredRoomData, setFilteredroomData] = useState<CenterRoomItem[]>([]);
  const [filteredUMCData, setFilteredUMCData] = useState<CenterUMC[]>([]);
  const [filteredDutyData, setFilteredDutyData] = useState<CenterDuty[]>([]);
  const [filtereddiscripenciesData, setFiltereddiscripenciesData] = useState<Discrepancies[]>([]);
  const [open, setOpen] = useState(false);
  const [dialogData, setDialogData] = useState<CenterRoomItem | null>(null);
  const [dialogTitle, setDialogTitle] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const [CenterRoomsListData, setCenterRoomsListData] = useState<CenterRoom[]>([]);
  const [filteredCenterRoomsListData, setFilteredCenterRoomsListData] = useState<CenterRoom[]>([]);
  const columnNameMap: Record<string, string> = {
    centerNo: "Center No",
    roomNo: "Room No",
    omrSheet: "OMR Sheets",
    threetwoPagesSheets: "32 Page Sheets",
    twofourPagesSheets: "24 Page Sheets",
    description: "Description",
    employeeid: "Employee Id",
    employeeName: "Employee Name",
    mobileNo: "Contact No",
    departmentName: "Department",
    reportedStatus: "Reported/Not Reported"
  };

  
  useEffect(() => {
    debugger;
setCentersData([]);
setCenterroomsData([]);
setUMCData([]);
setDutyData([]);
setDiscripenciesData([]);
setFilteredCenterData([]);
setFilteredCenterRoomsListData([]);
setFilteredDutyData([]);
setFilteredDutyData([]);
setFilteredUMCData([]);
setFiltereddiscripenciesData([]);



    if (examDate && selectedTime && selectedType) {
      const fetchData = async () => {
        const requestbody = {
          ExamHeldDate: examDate,
          TM: selectedTime,
          EType: selectedType,
        };
        setLoading(true);
        try {
          const response = await getExamDutyCenterDetailAction(requestbody);
          console.log("Response from API is", response.ApiData);
          setCentersData(response.ApiData?.item1);
          setCenterroomsData(response.ApiData?.item2);
          setUMCData(response.ApiData?.item3);
          setDutyData(response.ApiData?.item4);
          setDiscripenciesData(response.ApiData?.item5);
          const apiData = response.ApiData || [];

          console.log("Parsed Centers:", JSON.stringify(apiData));
          const validCenters =
            apiData?.item1
              ?.filter((item: any) => item.centerno && item.centerno.trim() !== "")
              .filter(
                (item: any, index: number, self: any[]) =>
                  index === self.findIndex((t) => t.centerno === item.centerno)
              ) || [];
          setCenters(validCenters);
          // const singleCenterNo = validCenters[0].centerno;
          // handleChipClick(singleCenterNo);

          setLoading(false);
        } catch (error) {
          console.error("Error fetching centers:", error);
        } finally {
          setLoading(false);
        }
      };
     // if (!hasFetched && examDate && selectedTime && selectedType) {
        fetchData();
       // setHasFetched(true);
   //   }
    }
    //}, [examDate, selectedTime, selectedType]);
  }, [examDate, selectedTime, selectedType]);

  const handleChipClick = async (centerNo: string) => {
    debugger;
    setSelectedCenter(centerNo);

    let filtered = centersData.filter((item) => item.centerno === centerNo);
    console.log('Filtered centers are', filtered);
    console.log('Discripencies are', JSON.stringify(discripenciesData));
    setFilteredCenterData(filtered);
    setFilteredroomData(centerroomsData.filter((item) => item.centerNo === centerNo));
    setFilteredUMCData(umcData.filter((item) => item.centerNo === centerNo));
    setFilteredDutyData(dutyData.filter((item) => item.centerNo === centerNo));
    setFiltereddiscripenciesData(discripenciesData.filter((item) => item.centerNo === centerNo));

    setLoading(true);
    try {
      const requestbody = {
        ExamHeldDate: examDate,
        TM: selectedTime,
        EType: selectedType,
      };
      const response = await getExamDutyCenterRoomsListAction(requestbody);
      console.log("Response from API is Room list", response.ApiData);
      const data = response.ApiData?.item1 || [];
      setFilteredCenterRoomsListData(data.filter((item: any) => item.centerNo === centerNo));
      setCenterRoomsListData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching centers:", error);
    } finally {
      setLoading(false);
    }


  };



  const handleOpen = async (title: string, data: CenterRoomItem) => {
    let heading = title + '(' + examDate + ')' + selectedTime + '-' + selectedType + '-' + selectedCenter
    setDialogTitle(heading);

    try {
      const requestbody = {
        ExamHeldDate: examDate,
        TM: selectedTime,
        EType: selectedType,
        Cent: selectedCenter
      };
      console.log('Request Payload is', JSON.stringify(requestbody));
      const response = await GetExamDutyRoomAnswersheetsAction(requestbody);
      console.log("Response from API is", response.ApiData);
      setDialogData(response.ApiData.item1);
      setOpen(true);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching centers:", error);
    } finally {
      setLoading(false);
    }

  };

  const handleClose = () => {
    setOpen(false);
    setDialogData(null);
  };


  const getDisplayName = (key: string): string => {
    return columnNameMap[key] || key;
  };

  const handleOpenDutyDialog = async (title: string) => {
    let heading = title + '(' + examDate + ')' + selectedTime + '-' + selectedType + '-' + selectedCenter
    setDialogTitle(heading);

    try {
      const requestbody = {
        ExamHeldDate: examDate,
        TM: selectedTime,
        EType: selectedType,
        Cent: selectedCenter
      };
      console.log('Request Payload is', JSON.stringify(requestbody));
      const response = await GetExamDutyDistributionAction(requestbody);
      console.log("Response from API is", response.ApiData);
      setDialogData(response.ApiData.item1);
      setOpen(true);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching centers:", error);
    } finally {
      setLoading(false);
    }

  };

  const handleExportToExcel = () => {
    if (!dialogData) {
      alert("No data available to export");
      return;
    }

    let tableHTML = "";

    // CASE 1: dialogData is an array
    if (Array.isArray(dialogData) && dialogData.length > 0) {
      const keys = Object.keys(dialogData[0]);
      tableHTML += "<table border='1'><tr>";

      // Table header
      keys.forEach((key) => {
        tableHTML += `<th>${getDisplayName(key)}</th>`;
      });
      tableHTML += "</tr>";

      // Table rows
      dialogData.forEach((row) => {
        tableHTML += "<tr>";
        keys.forEach((key) => {
          let val = row[key];
          if (val === null || val === undefined) val = "-";
          if (typeof val === "object") val = JSON.stringify(val);
          tableHTML += `<td>${val}</td>`;
        });
        tableHTML += "</tr>";
      });
      tableHTML += "</table>";
    }
    // CASE 2: dialogData is a single object
    else if (typeof dialogData === "object") {
      tableHTML += "<table border='1'>";
      Object.entries(dialogData).forEach(([key, value]) => {
        let val = value;
        if (val === null || val === undefined) val = "-";
        if (typeof val === "object") val = JSON.stringify(val);
        tableHTML += `<tr><td><b>${getDisplayName(key)}</b></td><td>${val}</td></tr>`;
      });
      tableHTML += "</table>";
    }

    // Create Excel-compatible data URI
    const dataUri = "data:application/vnd.ms-excel," + encodeURIComponent(tableHTML);

    // Create download link
    const link = document.createElement("a");
    link.href = dataUri;
    link.download = `${dialogTitle || "DialogData"}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <Paper elevation={3} sx={{ p: 3, mt: 1, borderRadius: 3 }}>
      <Box sx={{ p: 2 }}>
        {/* <Typography variant="h6" sx={{ mb: 2 }}>
          Available Centers
        </Typography> */}

        {
          // loading ? (
          //   <CircularProgress />
          // ) : 
          centers.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                //mt: 1,
              }}
            >
              {centers.map((center, index) => (
                <Chip
                  key={index}
                  label={center.centerno}
                  clickable
                  //color="primary"
                  variant="outlined"
                  size="small"
                  color={selectedCenter === center.centerno ? "primary" : "default"}
                  onClick={() => handleChipClick(center.centerno)}
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.85rem",
                    borderRadius: "12px",
                    px: 1.2,
                    py: 0.2,
                    transition: "all 0.2s ease-in-out",
                    cursor: "pointer",
                    borderWidth: 1,
                    borderColor:
                      selectedCenter === center.centerno
                        ? (theme) => theme.palette.success.main
                        : (theme) => theme.palette.primary.main,
                    backgroundColor:
                      selectedCenter === center.centerno
                        ? (theme) => theme.palette.success.main
                        : (theme) => theme.palette.primary.main,
                    color: "#fff",
                    boxShadow:
                      selectedCenter === center.centerno
                        ? "0px 2px 6px rgba(56, 142, 60, 0.4)" // green shadow when active
                        : "0px 2px 6px rgba(25, 118, 210, 0.3)", // blue shadow when not selected
                    "&:hover": {
                      backgroundColor:
                        selectedCenter === center.centerno
                          ? (theme) => theme.palette.success.dark
                          : (theme) => theme.palette.primary.dark,
                      transform: "scale(1.05)",
                    },
                  }}
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No centers found for the selected parameters.
            </Typography>
          )}

        {/* {selectedCenter && (
          <Box sx={{ mt: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
            <Typography variant="subtitle1">
              Selected Center: {selectedCenter}
            </Typography>
            
          </Box>
        )} */}
        {selectedCenter && filteredCenterData.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Center {selectedCenter} Summary
            </Typography>

            <Grid container spacing={2}>
              {/* 🔹 Strength Cards */}
              {filteredCenterData.map((item, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: "16px",
                      backgroundColor: "#fff",
                      borderLeft: "6px solid #FF7043", // orange accent
                      boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": { transform: "translateY(-3px)", boxShadow: "0 4px 12px rgba(0,0,0,0.12)" },
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "#0D0D0D",
                        fontWeight: 600,
                        mb: 0.5,
                      }}
                    >
                      {item.category === "Total"
                        ? "Center Strength"
                        : `${item.category} Students`}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: "#4F4F4F", fontWeight: 500 }}
                    >
                      Actual:{" "}
                      <span style={{ color: "#000", fontWeight: 600 }}>
                        {item.scheduleStrength}
                      </span>
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: "#4F4F4F", fontWeight: 500 }}
                    >
                      Present:{" "}
                      <span style={{ color: "#000", fontWeight: 600 }}>
                        {item.presentStrength}
                      </span>
                    </Typography>
                  </Paper>
                </Grid>
              ))}

              {/* 🔹 Room Summary Card (inline) */}
              {filteredRoomData && filteredRoomData.length > 0 && (() => {
                const summary = filteredRoomData[0];
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
                      elevation={0}
                      onClick={() => handleOpen("Room Summary", summary)}
                      sx={{
                        p: 2,
                        borderRadius: "16px",
                        backgroundColor: "#fff",
                        borderLeft: "6px solid #FF7043",
                        boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#0D0D0D",
                          fontWeight: 600,
                          mb: 0.5,
                        }}
                      >
                        Room Summary :: (Click to View Rooms Detail)
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ color: "#4F4F4F", fontWeight: 500 }}
                      >
                        Total Rooms:{" "}
                        <span style={{ color: "#FF7043", fontWeight: 700 }}>
                          {summary.totalRooms}
                        </span>
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ color: "#4F4F4F", fontWeight: 500 }}
                      >
                        Attendance Done:{" "}
                        <span style={{ color: "#2E7D32", fontWeight: 700 }}>
                          {summary.attendanceDone}
                        </span>
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ color: "#4F4F4F", fontWeight: 500 }}
                      >
                        Pending:{" "}
                        <span style={{ color: "#E53935", fontWeight: 700 }}>
                          {summary.attendancePending}
                        </span>
                      </Typography>
                    </Paper>
                  </Grid>

                );
              })()}

              {filteredUMCData && filteredUMCData.length > 0 && (() => {
                debugger;
                const summary = filteredUMCData[0];
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: "16px",
                        backgroundColor: "#fff",
                        borderLeft: "6px solid #FF7043",
                        boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#0D0D0D",
                          fontWeight: 600,
                          mb: 0.5,
                        }}
                      >
                        UMC Summary
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ color: "#4F4F4F", fontWeight: 500 }}
                      >
                        Total UMC:{" "}
                        <span style={{ color: "#FF7043", fontWeight: 700 }}>
                          {summary.totalUMC}
                        </span>
                      </Typography>


                    </Paper>
                  </Grid>
                );
              })()}
              {filtereddiscripenciesData && filtereddiscripenciesData.length > 0 && (() => {
                debugger;
                const discripencies = filtereddiscripenciesData[0];
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: "16px",
                        backgroundColor: "#fff",
                        borderLeft: "6px solid #FF7043",
                        boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#0D0D0D",
                          fontWeight: 600,
                          mb: 0.5,
                        }}
                      >
                        Discrepencies
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ color: "#4F4F4F", fontWeight: 500 }}
                      >
                        Total Discrepencies:{" "}
                        <span style={{ color: "#FF7043", fontWeight: 700 }}>
                          {discripencies.totalDiscrepancies}
                        </span>
                      </Typography>


                    </Paper>
                  </Grid>
                );
              })()}
              {filteredCenterRoomsListData && filteredCenterRoomsListData.length > 0 && (() => {
                debugger;


                const allRoomNumbers: string[] = filteredCenterRoomsListData.flatMap((item) => {
                  if (Array.isArray(item.roomNo)) {
                    return item.roomNo;
                  } else if (typeof item.roomNo === "string") {
                    return [item.roomNo];
                  }
                  return [];
                });

                // Join them with commas
                const roomNumbers = allRoomNumbers.length > 0 ? allRoomNumbers.join(", ") : "No Rooms";
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: "16px", width: "100%",
                        backgroundColor: "#fff",
                        borderLeft: "6px solid #FF7043",
                        boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#0D0D0D",
                          fontWeight: 600,
                          mb: 0.5,
                        }}
                      >
                        Rooms List
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ color: "#4F4F4F", fontWeight: 500 }}
                      >

                        <span style={{ color: "#FF7043", fontWeight: 700 }}>
                          {roomNumbers}
                        </span>
                      </Typography>


                    </Paper>
                  </Grid>
                );
              })()}
              {/* <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    width: "100%",
                    backgroundColor: "#fff",
                    borderLeft: "6px solid #FF7043",
                    boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#0D0D0D",
                      fontWeight: 600,
                      mb: 0.5,
                    }}
                  >
                    Template Downloads
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4F4F4F",
                      fontWeight: 500,
                      mb: 1,
                    }}
                  >
                    Download exam templates or room assignment formats.
                  </Typography>

                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      alignSelf: "flex-start",
                      backgroundColor:theme.palette.primary.main,
                      textTransform: "none",
                      borderRadius: "8px",
                      fontWeight: 600,
                      "&:hover": { backgroundColor: theme.palette.primary.light },
                    }}
                    onClick={() => {
                      // Handle your download logic here
                      alert("Template download started!");
                    }}
                  >
                    Download Template
                  </Button>
                </Paper>
              </Grid> */}
            </Grid>
            {filteredDutyData && filteredDutyData.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#0D0D0D",
                    }}
                  >
                    Duty Type Distribution
                  </Typography>


                  <Button
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      borderRadius: "8px",
                      marginLeft: "4px",
                      backgroundColor: theme.palette.primary.main,
                      "&:hover": { backgroundColor: theme.palette.primary.light },
                    }}
                    //onClick={() => setOpenDialog(true)} 
                    onClick={() => handleOpenDutyDialog("Duty Type Distribution")}
                  >
                    <VisibilityIcon sx={{ fontSize: 20 }} />
                    Show Detail
                  </Button>
                </Box>

                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    borderRadius: "16px",
                    boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                  }}
                >
                  <Table>
                    {/* 🔶 Header */}
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: "#FF8A65", // orange header
                          "& th": {
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            textTransform: "uppercase",
                          },
                          "& th:first-of-type": { borderTopLeftRadius: "16px" },
                          "& th:last-of-type": { borderTopRightRadius: "16px" },
                        }}
                      >
                        <TableCell>DUTY TYPE</TableCell>
                        <TableCell>NO. OF DUTIES</TableCell>
                        <TableCell>REPORTED</TableCell>
                        {/* <TableCell>LINK FILE</TableCell> */}
                      </TableRow>
                    </TableHead>

                    {/* 🔸 Table Body */}
                    <TableBody>
                      {filteredDutyData.map((item, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:hover": { backgroundColor: "#f9f9f9" },
                            transition: "background 0.2s ease-in-out",
                          }}
                        >
                          {/* Duty Type with colored chip */}
                          <TableCell sx={{ py: 1.5 }}>
                            <Chip
                              label={item.description}
                              sx={{
                                backgroundColor: "#FF8A65",
                                color: "#fff",
                                fontWeight: 600,
                                borderRadius: "8px",
                                fontSize: "0.85rem",
                                px: 1.5,
                              }}
                            />
                          </TableCell>

                          {/* No. of Duties */}
                          <TableCell sx={{ fontWeight: 600, color: "#424242" }}>
                            {item.noOfDuty}
                          </TableCell>

                          {/* Reported */}
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              color:
                                Number(item.noOfDuty) === Number(item.totalReported)
                                  ? "#2E7D32"
                                  : "#E53935",
                            }}
                          >
                            {item.totalReported}
                          </TableCell>

                          {/* Link File */}
                          {/* <TableCell> */}
                          {/* <Link
                    href='#'
                    underline="none"
                  
                  sx={{
                    color: "#1565C0",
                    fontWeight: 600,
                    "&:hover": { color: "#0D47A1", textDecoration: "underline" },
                  }}
                >
                  {item.linkLabel || `${item.Description} Report`}
                </Link> */}
                          {/* </TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        )}

      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle sx={{
          fontWeight: 600,
          fontSize: "1.1rem",
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #ddd",
        }}
        >{dialogTitle}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="outlined"
              color="success"
              onClick={handleExportToExcel}
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                px: 3,
                fontWeight: 500,
                borderWidth: "1.5px",
                "&:hover": {
                  backgroundColor: "success.light",
                  borderColor: "success.main",
                },
              }}
            >
              Export to Excel
            </Button>
          </Box>
        </DialogTitle>
        {/* <DialogContent dividers>
          {dialogData ? (
            Array.isArray(dialogData) ? (


              <TableContainer component={Paper} sx={{
                maxHeight: 500,
                overflowX: "auto",
                borderRadius: 2,
                boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
              }}>
                <Table size="small" stickyHeader sx={{
                  "& th": {
                    backgroundColor: "#fafafa",
                    fontWeight: 600,
                    borderBottom: "2px solid #e0e0e0",
                    whiteSpace: "nowrap",
                  },
                  "& td": {
                    borderBottom: "1px solid #eee",
                    whiteSpace: "nowrap",
                  },
                  "& tbody tr:nth-of-type(odd)": {
                    backgroundColor: "#fafafa",
                  },
                }}
                >
                  <TableHead>
                    <TableRow>
                      {Object.keys(dialogData[0]).map((col) => (
                        <TableCell key={col}>{getDisplayName(col)}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dialogData.map((row: Record<string, any>, rowIndex: number) => (
                      <TableRow key={rowIndex}>
                        {Object.values(row).map((val, colIndex) => (
                          <TableCell key={colIndex}>
                            {val !== null && val !== undefined
                              ? typeof val === "object"
                                ? JSON.stringify(val)
                                : String(val)
                              : "-"}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <TableContainer component={Paper} sx={{
                maxHeight: 400,
                borderRadius: 2,
                boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
                overflowX: "auto",
              }}>
                <Table size="small" stickyHeader sx={{
                  "& th": {
                    backgroundColor: "#fafafa",
                    fontWeight: 600,
                    borderBottom: "2px solid #e0e0e0",
                  },
                  "& td": {
                    borderBottom: "1px solid #eee",
                  },
                  "& tbody tr:nth-of-type(odd)": {
                    backgroundColor: "#fafafa",
                  },
                }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Field</strong></TableCell>
                      <TableCell><strong>Value</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(dialogData).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell>{getDisplayName(key)}</TableCell>
                        <TableCell>
                          {value !== null && value !== undefined
                            ? typeof value === "object"
                              ? JSON.stringify(value)
                              : String(value)
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )
          ) : (
            <Typography>No data available.</Typography>
          )}
        </DialogContent> */}
        <DialogContent dividers>
          {dialogData ? (
            Array.isArray(dialogData) ? (
              (() => {
                const hasReportedStatus = dialogData.length > 0 && "reportedStatus" in dialogData[0];

                // Sort data: Not Reported first, then Reported
                const sortedData = hasReportedStatus
                  ? [...dialogData].sort((a, b) => {
                    const order: Record<string, number> = { "Reported": 1, "Not Reported": 2 };
                    const aStatus = typeof a.reportedStatus === "string" ? a.reportedStatus : "";
                    const bStatus = typeof b.reportedStatus === "string" ? b.reportedStatus : "";
                    return (order[aStatus] ?? 99) - (order[bStatus] ?? 99);
                  })
                  : dialogData;

                return (
                  <TableContainer
                    component={Paper}
                    sx={{
                      maxHeight: 500,
                      overflowX: "auto",
                      borderRadius: 2,
                      boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
                    }}
                  >
                    <Table
                      size="small"
                      stickyHeader
                      sx={{
                        "& th": {
                          backgroundColor: "#fafafa",
                          fontWeight: 600,
                          borderBottom: "2px solid #e0e0e0",
                          whiteSpace: "nowrap",
                        },
                        "& td": {
                          borderBottom: "1px solid #eee",
                          whiteSpace: "nowrap",
                        },
                        "& tbody tr:nth-of-type(odd)": {
                          backgroundColor: "#fafafa",
                        },
                      }}
                    >
                      <TableHead>
                        <TableRow>
                          {Object.keys(sortedData[0]).map((col) => (
                            <TableCell key={col}>{getDisplayName(col)}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sortedData.map((row: Record<string, any>, rowIndex: number) => {
                          const status = row.reportedStatus;
                          const bgColor =
                            status === "Not Reported"
                              ? "#ffebee" // light red
                              : status === "Reported"
                                ? "#e8f5e9" // light green
                                : "inherit";

                          const textColor =
                            status === "Not Reported"
                              ? "#d32f2f" // red
                              : status === "Reported"
                                ? "#2e7d32" // green
                                : "inherit";

                          return (
                            <TableRow key={rowIndex} sx={{ backgroundColor: bgColor, color: textColor }}>
                              {Object.values(row).map((val, colIndex) => (
                                <TableCell key={colIndex} sx={{ color: textColor }}>
                                  {val !== null && val !== undefined
                                    ? typeof val === "object"
                                      ? JSON.stringify(val)
                                      : String(val)
                                    : "-"}
                                </TableCell>
                              ))}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                );
              })()
            ) : (
              // for object-type data
              <TableContainer
                component={Paper}
                sx={{
                  maxHeight: 400,
                  borderRadius: 2,
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
                  overflowX: "auto",
                }}
              >
                <Table
                  size="small"
                  stickyHeader
                  sx={{
                    "& th": {
                      backgroundColor: "#fafafa",
                      fontWeight: 600,
                      borderBottom: "2px solid #e0e0e0",
                    },
                    "& td": {
                      borderBottom: "1px solid #eee",
                    },
                    "& tbody tr:nth-of-type(odd)": {
                      backgroundColor: "#fafafa",
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Field</strong></TableCell>
                      <TableCell><strong>Value</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(dialogData).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell>{getDisplayName(key)}</TableCell>
                        <TableCell>
                          {value !== null && value !== undefined
                            ? typeof value === "object"
                              ? JSON.stringify(value)
                              : String(value)
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )
          ) : (
            <Typography>No data available.</Typography>
          )}
        </DialogContent>


        <DialogActions sx={{ backgroundColor: "#f9f9f9", borderTop: "1px solid #ddd" }}>
          <Button onClick={handleClose} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </Paper>
  );
};


export default CentersDetail;
