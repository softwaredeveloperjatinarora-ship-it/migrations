

"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
  IconButton,
  Typography,
  Table,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
  TableBody,
  Stack,
  Box,
  TextField,
  useMediaQuery,
  useTheme,
  Card,
  CircularProgress,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar"; // Import Scrollbar
import { IconDownload, IconX } from "@tabler/icons-react";
import BlankCard from "@/app/components/shared/BlankCard";
// import { basicsTableData, TableType } from "../../EmergencyNumberPopup/tableData";
import { getUpComingEventsAction } from "@/app/actions/homeAction/EventsDetails/getUpComingEventsAction";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import { useSession } from "next-auth/react";

interface PopupProps {
  open: boolean;
  handleClose: () => void;
  title: string;
}

const UpcomingEvents: React.FC<PopupProps> = ({
  open,
  handleClose,
  title,
}) => {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down("lg"));
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [allEventData, setAllEventData] = useState<any[]>([]);
  const [upcomingEventdata, setUpcomingEventdata] = useState<any[]>([]);

  const [searchText, setSearchText] = useState<string>("");
  const [openAlert, setOpenAlert] = useState(false); // ✅ Track alert visibility

  const fetchData = async (open: boolean) => {
    try {
      setLoading(true);
      const response = await getUpComingEventsAction();
      let splitValue = String(session?.user?.token).split("NEXT2121ANG");
      const ApiData1 = decryptDataforResponse(response.ApiData, splitValue[1]);
      const parsedData = JSON.parse(ApiData1);
      setAllEventData(parsedData);
      setUpcomingEventdata(parsedData);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(open);
  }, [open]);

  const handleSearch = () => {
    const filtered = allEventData.filter((item) =>
      [item.Title, item.Description, item.EventCategory].some((field) =>
        field?.toLowerCase().includes(searchText.toLowerCase())
      )
    );
    setUpcomingEventdata(filtered);
  };

  const handleReset = () => {
    setSearchText("");
    setUpcomingEventdata(allEventData);
  };





  const downloadExcel = () => {
    if (!upcomingEventdata || upcomingEventdata.length === 0) {
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

    const tableRows = upcomingEventdata
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
            width: { xs: "100%", lg: "auto" },
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: { lg: "flex" },
              alignItems: "center",
              width: { xs: "100%", sm: "auto" },
              gap: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "14px",
                whiteSpace: "nowrap",
                display: "flex",
                justifyContent: "center",
              }}
            >
              Search (Title/Description/Event Category):
            </Typography>

            <TextField
              variant="outlined"
              size="small"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{ minWidth: { xs: "100%", sm: 250 }, marginTop: 1 }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 1,
              }}
            >
              <Button sx={{ width: "80px", marginRight: 1 }} onClick={handleSearch}>
                Show
              </Button>
              <Button sx={{ width: "80px" }} onClick={handleReset}>
                Reset
              </Button>
              {/* <Button
                color="primary"
                sx={{ backgroundColor: "primary.main", color: "white", float: "inline-end" }}
                onClick={downloadExcel}
              >
                Export To Excel
              </Button> */}

              <IconButton color="primary" size="small" sx={{ ml: 2 }}>
                {/* <IconX color="#FF8488" size={24} /> */}
                <IconDownload width={22} onClick={downloadExcel} />
              </IconButton>

            </Box>
          </Box>
        </Box>
      </Box>

      {isCompact ? (
        <Scrollbar sx={{ height: "calc(100vh - 200px)" }}>
          {error && (
            <Typography color="error" textAlign="center">
              {error}
            </Typography>
          )}
          {upcomingEventdata.map((item, index) => (
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
                    borderLeft: `10px solid ${item.impact === "A"
                      ? "green"
                      : item.impact === "B"
                        ? "yellow"
                        : item.impact === "C"
                          ? "blue"
                          : "no Color"
                      }`,
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "15px",
                    padding: "10px",
                    boxShadow: "none",
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
                      <Typography variant="h6" fontSize="14px" component="span">
                        Description-{" "}
                      </Typography>
                      <Typography component="span">{item.Description}</Typography>
                    </Typography>
                    <Typography component="div">
                      <Typography variant="h6" fontSize="14px" component="span">
                        Objective-{" "}
                      </Typography>
                      <Typography component="span">{item.Objective}</Typography>
                    </Typography>
                    <Typography component="div">
                      <Typography variant="h6" fontSize="14px" component="span">
                        Venue-{" "}
                      </Typography>
                      <Typography component="span">{item.Venue}</Typography>
                    </Typography>
                    <Typography component="div">
                      <Typography variant="h6" fontSize="14px" component="span">
                        Event Category-{" "}
                      </Typography>
                      <Typography component="span">{item.EventCategory}</Typography>
                    </Typography>
                    <Typography component="div">
                      <Typography variant="h6" fontSize="14px" component="span">
                        Type-{" "}
                      </Typography>
                      <Typography component="span">{item.Type}</Typography>
                    </Typography>
                    <Typography component="div">
                      <Typography variant="h6" fontSize="14px" component="span">
                        For-{" "}
                      </Typography>
                      <Typography component="span">{item.EventFor}</Typography>
                    </Typography>
                    <Typography component="div">
                      <Typography variant="h6" fontSize="14px" component="span">
                        Organized By-{" "}
                      </Typography>
                      <Typography component="span">{item.OrganizedBy}</Typography>
                    </Typography>
                  </Typography>
                </Card>
              </Box>
              {index !== upcomingEventdata.length - 1 && <Divider />}
            </React.Fragment>
          ))}
          {loading && (
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress />
            </Box>
          )}
          {!loading && upcomingEventdata.length === 0 && (
            <Typography textAlign="center">No messages found.</Typography>
          )}
        </Scrollbar>
      ) : (
        <Scrollbar sx={{ height: "300px" }}>
          <BlankCard>
            <TableContainer>
              <Table
                aria-label="simple table"
                sx={{ whiteSpace: "nowrap", width: "100%" }}
              >
                <TableHead>
                  <TableRow>
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
                  {upcomingEventdata.map((basic, index) => (
                    <TableRow key={basic.id || index}>
                      <TableCell sx={{ textAlign: "center", padding: "10px" }}>
                        <Box
                          sx={{
                            width: "15px",
                            borderRadius: 0,
                            height: "150px",
                            backgroundColor:
                              basic.impact === "A"
                                ? "green"
                                : basic.impact === "B"
                                  ? "yellow"
                                  : basic.impact === "C"
                                    ? "blue"
                                    : "transparent",
                            border: `1px solid ${basic.impact === "A"
                              ? "green"
                              : basic.impact === "B"
                                ? "yellow"
                                : basic.impact === "C"
                                  ? "blue"
                                  : "transparent"
                              }`,
                            margin: { lg: "0 5px" },
                          }}
                        />
                      </TableCell>

                      {["Title", "Description", "Objective", "EventDates", "Venue", "EventFor", "Type", "EventCategory", "OrganizedBy"].map((field) => (
                        <TableCell
                          key={field}
                          sx={{ textAlign: "center", padding: "10px", whiteSpace: "normal", wordBreak: "break-word" }}
                        >
                          <Typography variant="h6" fontWeight={400} fontSize={"0.8rem"}>
                            {basic[field]}
                          </Typography>
                        </TableCell>
                      ))}
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

export default UpcomingEvents;
