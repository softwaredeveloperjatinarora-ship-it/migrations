
"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Typography,
  Table,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
  TableBody,
  Box,
  TextField,
  useTheme,
  useMediaQuery,
  Card,
  Divider,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import BlankCard from "@/app/components/shared/BlankCard";
import { getEventSearchListAction } from "@/app/actions/homeAction/EventsDetails/getEventSearchListAction";
import { useSession } from "next-auth/react";
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import { IconDownload } from "@tabler/icons-react";

interface PopupProps {
  open: boolean;
  handleClose: () => void;
  title: string;
}

const EventsHistory: React.FC<PopupProps> = ({
  open,
  handleClose,
  title,
}) => {
  const theme = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const [eventSearchtdata, setEventSearchtdata] = useState<any[]>([]);
  const isCompact = useMediaQuery(theme.breakpoints.down("lg"));
  const observer = useRef<IntersectionObserver | null>(null);
  const [originalEventData, setOriginalEventData] = useState<any[]>([]);
  const [EventDate, setEventDate] = useState<any[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
 const [openAlert, setOpenAlert] = useState(false); // ✅ Track alert visibility
  // Get today's date in YYYY-MM-DD format for default values
 const getTodayDDMMYYYY = (): string => {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

const getDateMinusMonthsDDMMYYYY = (months: number): string => {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

// For input default values: YYYY-MM-DD
const getTodayYYYYMMDD = (): string => {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

const getDateMinusMonthsYYYYMMDD = (months: number): string => {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

// Usage:
const defaultFromDateApi = getDateMinusMonthsDDMMYYYY(3); // For API
const defaultToDateApi = getTodayDDMMYYYY();

const defaultFromDateInput = getDateMinusMonthsYYYYMMDD(3); // For <input type=date>
const defaultToDateInput = getTodayYYYYMMDD();


  const parseDate = (dateStr: string | undefined | null) => {
    if (!dateStr || typeof dateStr !== "string") return null;

    const [dayStr, monthStr, yearStr] = dateStr.split(" ");

    const monthMap: { [key: string]: number } = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };

    const day = parseInt(dayStr);
    const month = monthMap[monthStr];
    const year = parseInt(yearStr);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

    return new Date(year, month, day);
  };

  const fetchData = async (startDate?: string, endDate?: string) => {
// console.log("startDate",startDate,"endDate",endDate)
// console.log("defaultFromDateApi",defaultFromDateApi,"defaultToDateApi",defaultToDateApi)
    try {
      // console.log("today",todays)
      setLoading(true);
      const formfields = {
         StartDate: startDate || defaultFromDateApi,
      EndDate: endDate || defaultToDateApi,
      SearchCriteria: searchTerm || null,
      };

      if (!session || !session.user || !session.user.token) {
        throw new Error("Session or token is missing");
      }

      let splitValue = session.user.token.split("NEXT2121ANG");
      const credentialsJson = JSON.stringify(formfields);
      // console.log("credentialsJson", credentialsJson)
      const { Data } = encryptData(credentialsJson, splitValue[1]);

      const response = await getEventSearchListAction(Data);
      const ApiData1 = decryptDataforResponse(response.ApiData, splitValue[1]);
      const parsedData = JSON.parse(ApiData1);
      // console.log("response",parsedData )

      setOriginalEventData(parsedData);
      setEventSearchtdata(parsedData);

      const Dates = parsedData.map(
        (item: { EventDate: any }) => item.EventDate
      );
      setEventDate(Dates);

    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      // console.log("popup",open)
      fetchData();
    }
  }, [open]);


// If your fromDate and toDate are in YYYY-MM-DD format from UI, convert to DD/MM/YYYY for API:
const convertYYYYMMDDtoDDMMYYYY = (dateStr: string) => {
  if (!dateStr) return "";
  const [yyyy, mm, dd] = dateStr.split("-");
  return `${yyyy}-${mm}-${dd}`;
};

const handleSearch = async () => {
  const formattedFromDate = fromDate ? convertYYYYMMDDtoDDMMYYYY(fromDate) : defaultFromDateInput;
  const formattedToDate = toDate ? convertYYYYMMDDtoDDMMYYYY(toDate) : defaultToDateInput;
// console.log("From",defaultFromDateInput,"SDF",fromDate)
  await fetchData(formattedFromDate, formattedToDate);
};


  const handleReset = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
    fetchData(); // Reset to default (today's data)
  };


  const [statementType, setStatementType] = useState<string>("D"); // Default: Detailed




    const downloadExcel = () => {
    if (!eventSearchtdata || eventSearchtdata.length === 0) {
      // setAlertMessage("No data available to download.");
      setOpenAlert(true);
      return;
    }

    const headers = [
      "",
      "Title",
      "Description",
      "Objective",
      "Dates",
      "Venue",
      "For",
      "Type",
      "Event Category",
      "Organized By"
    ];

    // const tableRows = eventSearchtdata
    //   .map(item => {
    //     return `<tr>
    //       <td>${item.impact || ""}</td>
    //     <td>${item.Title || ""}</td>
    //     <td>${item.Description || ""}</td>
    //     <td>${item.Objective || ""}</td>
    //     <td>${item.EventDates || ""}</td>
    //     <td>${item.Venue || ""}</td>
    //     <td>${item.EventFor || ""}</td>
    //     <td>${item.Type || ""}</td>
    //     <td>${item.EventCategory || ""}</td>
    //     <td>${item.OrganizedBy || ""}</td>
    //   </tr>`;
    //   })
    //   .join("");

    const tableRows = eventSearchtdata
      .map((item) => {
        // Determine color based on impact
        let impactColor = "";
        if (item.impact === "A") impactColor = "green";
        else if (item.impact === "B") impactColor = "yellow";
        else if (item.impact === "C") impactColor = "blue";
        else impactColor = "transparent";

        return `<tr>
      <td style="background-color:${impactColor}; width:15px;"></td>
      <td style="height:50px;">${item.Title || ""}</td>
      <td>${item.Description || ""}</td>
      <td>${item.Objective || ""}</td>
      <td>${item.EventDates || ""}</td>
      <td>${item.Venue || ""}</td>
      <td>${item.EventFor || ""}</td>
      <td>${item.Type || ""}</td>
      <td>${item.EventCategory || ""}</td>
      <td>${item.OrganizedBy || ""}</td>
    </tr>`;
      })
      .join("");


    const htmlTable = `
    <table border="1">
      <thead>
        <tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;

    const blob = new Blob(["\ufeff" + htmlTable], {
      type: "application/vnd.ms-excel",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "events_history.xls";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };


  const handleCloseAlert = () => {
    setOpenAlert(false);
  };




  return (
    <>
    
      <Snackbar
        open={openAlert}
        autoHideDuration={3000} // Hide after 3 seconds
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // ✅ Alert on right side
      >
        <Alert onClose={handleCloseAlert} severity="error" sx={{ width: "100%" }}>
          No data available to download.
        </Alert>
      </Snackbar>
      <Box
        sx={{
          display: "flex",
          justifyContent: {
            lg: "space-between",
            xs: "center",
            md: "space-between",
          },
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          ml: { lg: 3, xs: 0 },
          mt: 1,

        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: {
              xs: "column",
              lg: "row",
            },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{
            display: { xs: "flex" },
            justifyContent: { xs: "center" },
            alignItems: { xs: "center" },
            margin: { xs: "0px 0px 10px 0px" }
          }}>
            <Box sx={{ gap: 1, marginRight: { xs: "5px" } }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                  display: { xs: "flex" },
                  justifyContent: { xs: "center" },
                }}
              >
                Start Date:
              </Typography>
              <TextField
                variant="outlined"
                size="small"
                type="date"
                value={fromDate || defaultFromDateInput}
                onChange={(e) => setFromDate(e.target.value)}
                sx={{
                  width: "150px",
                  "& .MuiInputBase-root": {
                    fontSize: "13px",
                    height: "35px",
                    marginTop: { xs: 1 }
                  },
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Box sx={{ gap: 1, marginLeft: { xs: "5px" } }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                  display: { xs: "flex" },
                  justifyContent: { xs: "center" },
                }}
              >
                End Date:
              </Typography>
              <TextField
                variant="outlined"
                size="small"
                type="date"
                value={toDate || defaultToDateInput}
                onChange={(e) => setToDate(e.target.value)}
                sx={{
                  width: "150px",
                  "& .MuiInputBase-root": {
                    fontSize: "13px",
                    height: "35px",
                    marginTop: { xs: 1 }
                  },
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              marginRight: { xs: 0, lg: 3 },
              display: "flex",
              flexDirection: { xs: "row", sm: "row", lg: "row" },
              alignItems: "center",
              gap: 1,
              justifyContent: { xs: "center", lg: "flex-end" },
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "14px",
                whiteSpace: "nowrap",
                textAlign: "center",
              }}
            >
              Search (Title/Description/Event Category):
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                minWidth: { xs: "100%", sm: 310, lg: 200 },
                marginTop: { xs: 1, sm: 0 },
              }}
            />
            <Button
              sx={{ minWidth: "80px", marginTop: { xs: 1, sm: 0 } }}
              onClick={handleSearch}
            >
              Show
            </Button>
            <Button
              sx={{ minWidth: "80px", marginTop: { xs: 1, sm: 0 } }}
              onClick={handleReset}
            >
              Reset
            </Button>
            {/* <Button
              color="primary"
              sx={{ backgroundColor: "primary.main", color: "white" }}
              onClick={downloadCSV}
              className="download-button"
            >
              Export To Excel
            </Button> */}
          <IconButton color="primary" size="small" sx={{ ml: 2 }}>
                          {/* <IconX color="#FF8488" size={24} /> */}
                           <IconDownload width={22}  onClick={downloadExcel} />
                        </IconButton>

          </Box>
        </Box>
      </Box>

      {isCompact ? (
        <Scrollbar sx={{ height: "calc(100vh - 600px)" }}>
          {error && (
            <Typography color="error" textAlign="center">
              {error}
            </Typography>
          )}
          {eventSearchtdata.map((item, index) => {
            const isLast = index === eventSearchtdata.length - 1;
            return (
              <React.Fragment key={index}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    margin: "10px 0",
                    width: "98%",
                    padding: "7px",
                  }}
                >
                  <Card
                    sx={{
                      cursor: "default",
                      borderLeft: `2px solid ${item.impact === "A" ? "green" : item.impact === "B" ? "yellow" : item.impact === "C" ? "blue" : "no Color"}`,
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "15px",
                      padding: "10px",
                      boxShadow: "none",
                      borderWidth: "0 0 0 10px",
                      borderStyle: "solid",
                      borderColor:
                        item.impact === "A"
                          ? "green"
                          : item.impact === "B"
                            ? "yellow"
                            : item.impact === "C"
                              ? "blue"
                              : "no Color",
                      borderRadius: 0,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        marginBottom: "8px",
                      }}
                    >
                      <Typography
                        component="span"
                        color="primary.main"
                        fontWeight="bold"
                        fontSize="1rem"
                      >
                        {item.Title}
                      </Typography>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "0.8em",
                          fontWeight: "bold",
                          color: "secondary.main",
                        }}
                      >
                        {item.EventDates}
                      </Typography>
                    </Box>

                    <Typography component="div" fontSize="0.95rem">
                      <Typography component="div">
                        <Typography variant="h6" fontSize="14px" component="span">Description- </Typography>
                        <Typography component="span">{item.Description}</Typography>
                      </Typography>
                      <Typography component="div">
                        <Typography variant="h6" fontSize="14px" component="span">Objective- </Typography>
                        <Typography component="span">{item.Objective}</Typography>
                      </Typography>
                      <Typography component="div">
                        <Typography variant="h6" fontSize="14px" component="span">Venue- </Typography>
                        <Typography component="span">{item.Venue}</Typography>
                      </Typography>
                      <Typography component="div">
                        <Typography variant="h6" fontSize="14px" component="span">Event Category- </Typography>
                        <Typography component="span">{item.EventCategory}</Typography>
                      </Typography>
                      <Typography component="div">
                        <Typography variant="h6" fontSize="14px" component="span">Type- </Typography>
                        <Typography component="span">{item.Type}</Typography>
                      </Typography>
                      <Typography component="div">
                        <Typography variant="h6" fontSize="14px" component="span">For- </Typography>
                        <Typography component="span">{item.EventFor}</Typography>
                      </Typography>
                      <Typography component="div">
                        <Typography variant="h6" fontSize="14px" component="span">Organized By- </Typography>
                        <Typography component="span">{item.OrganizedBy}</Typography>
                      </Typography>
                    </Typography>
                  </Card>
                </Box>
                {index !== eventSearchtdata.length - 1 && <Divider />}
              </React.Fragment>
            );
          })}
          {loading && (
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress />
            </Box>
          )}
          {!loading && eventSearchtdata.length === 0 && (
            <Typography textAlign="center">No messages found.</Typography>
          )}
        </Scrollbar>
      ) : (
        <Scrollbar sx={{ height: "300px" }}>
          <BlankCard>
            <TableContainer>
              <Table aria-label="simple table" sx={{ whiteSpace: "nowrap", width: "100%" }}>
                <TableHead>
                  <TableRow>

                    {/* {(statementType === "S" ? ["", "Title", "Description", "Objective", "Dates", "Venue", "For", "Type", "DRCR"]
                      : ["", "Title", "Description", "Objective", "Dates", "Venue", "For", "Type", "DRCR"]).map((header, index) => (
                        <TableCell key={index} sx={{ width: "2%", textAlign: "center", fontWeight: "bold" }}>
                          <Typography variant="h6">{header}</Typography>
                        </TableCell>
                      ))} */}

                    <TableCell sx={{ width: "2%" }}></TableCell>
                    <TableCell sx={{ width: "20%", textAlign: "center", fontWeight: "bold" }}>
                      <Typography variant="h6">Title</Typography>
                    </TableCell>
                    <TableCell sx={{ width: "15%", textAlign: "center", fontWeight: "bold" }}>
                      <Typography variant="h6">Description</Typography>
                    </TableCell>
                    <TableCell sx={{ width: "15%", textAlign: "center", fontWeight: "bold" }}>
                      <Typography variant="h6">Objective</Typography>
                    </TableCell>
                    <TableCell sx={{ width: "12%", textAlign: "center", fontWeight: "bold" }}>
                      <Typography variant="h6">Dates</Typography>
                    </TableCell>
                    <TableCell sx={{ width: "15%", textAlign: "center", fontWeight: "bold" }}>
                      <Typography variant="h6">Venue</Typography>
                    </TableCell>
                    <TableCell sx={{ width: "5%", textAlign: "center", fontWeight: "bold" }}>
                      <Typography variant="h6">For</Typography>
                    </TableCell>
                    <TableCell sx={{ width: "5%", textAlign: "center", fontWeight: "bold" }}>
                      <Typography variant="h6">Type</Typography>
                    </TableCell>
                    <TableCell sx={{ width: "6%", textAlign: "center", fontWeight: "bold", whiteSpace: "normal" }}>
                      <Typography variant="h6">Event Category</Typography>
                    </TableCell>
                    <TableCell sx={{ width: "15%", textAlign: "center", fontWeight: "bold" }}>
                      <Typography variant="h6">Organized By</Typography>
                    </TableCell>


                  </TableRow>
                </TableHead>
                <TableBody>
                  {eventSearchtdata.map((basic, index) => (
                    <TableRow key={basic.id || index}>
                      <TableCell sx={{ textAlign: "center", padding: "10px" }}>
                        {basic.impact === "A" ? (
                          <Box
                            sx={{
                              width: "15px",
                              height: "150px",
                              backgroundColor: "green",
                              border: "1px solid green",
                              borderRadius: 0,
                              margin: { lg: "0 5px" },
                            }}
                          />
                        ) : basic.impact === "B" ? (
                          <Box
                            sx={{
                              width: "15px",
                              height: "150px",
                              backgroundColor: "yellow",
                              border: "1px solid yellow",
                              borderRadius: 0,
                              margin: { lg: "0 5px" },
                            }}
                          />
                        ) : basic.impact === "C" ? (
                          <Box
                            sx={{
                              width: "15px",
                              height: "150px",
                              backgroundColor: "blue",
                              border: "1px solid blue",
                              borderRadius: 0,
                              margin: { lg: "0 5px" },
                            }}
                          />
                        ) : "No color"}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", padding: "10px", whiteSpace: "normal", wordBreak: "break-word" }}>
                        <Typography variant="h6" fontWeight={400} fontSize={"0.8rem"}>
                          {basic.Title}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", padding: "10px", whiteSpace: "normal", wordBreak: "break-word" }}>
                        <Typography variant="h6" fontWeight={400} fontSize={"0.8rem"}>
                          {basic.Description}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", padding: "10px", whiteSpace: "normal", wordBreak: "break-word" }}>
                        <Typography variant="h6" fontWeight={400} fontSize={"0.8rem"}>
                          {basic.Objective}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", padding: "10px", whiteSpace: "normal", wordBreak: "break-word" }}>
                        <Typography variant="h6" fontWeight={400} fontSize={"0.8rem"}>
                          {basic.EventDates}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", padding: "10px", whiteSpace: "normal", wordBreak: "break-word" }}>
                        <Typography variant="h6" fontWeight={400} fontSize={"0.8rem"}>
                          {basic.Venue}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", padding: "10px", whiteSpace: "normal", wordBreak: "break-word" }}>
                        <Typography variant="h6" fontWeight={400} fontSize={"0.8rem"}>
                          {basic.EventFor}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", padding: "10px", whiteSpace: "normal", wordBreak: "break-word" }}>
                        <Typography variant="h6" fontWeight={400} fontSize={"0.8rem"}>
                          {basic.Type}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", padding: "10px", whiteSpace: "normal", wordBreak: "break-word" }}>
                        <Typography variant="h6" fontWeight={400} fontSize={"0.8rem"}>
                          {basic.EventCategory}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", padding: "10px", whiteSpace: "normal", wordBreak: "break-word" }}>
                        <Typography variant="h6" fontWeight={400} fontSize={"0.8rem"}>
                          {basic.OrganizedBy}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </BlankCard>
        </Scrollbar>
      )}

    </>
  );
};

export default EventsHistory;











