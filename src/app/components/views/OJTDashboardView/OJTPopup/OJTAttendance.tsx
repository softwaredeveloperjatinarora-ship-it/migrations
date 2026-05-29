

"use client"

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Avatar,
  Tabs,
  Tab,
  Divider,
  SelectChangeEvent,
  Modal,
  Snackbar,
  Alert,
} from "@mui/material";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import UpdateIcon from "@mui/icons-material/Update";
import UpdateDisabledIcon from "@mui/icons-material/UpdateDisabled";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import CloseIcon from "@mui/icons-material/Close"
import LocationOffIcon from '@mui/icons-material/LocationOff';
import OJTHelp from "./OJTHelp";

interface AttendanceState {
  time: string;
  date: string;
  timeSlots: string[];
  timeOutSlots: string[];
  isPunchingIn: boolean;
  slot: string;
  hasPunchedIn: boolean;
  punchedInTime: Date | number;
  punchedOutTime: Date | null;
  workingHours: string;
  progress: number;
  atdType: string;
  tabValue?: number | null | string;
  leaveReason: string;
  submittedLeaveReason: string;
  show: boolean;
}

interface OJTAttendanceProps {
  isOpen: boolean;
  closeModal: (data?: boolean) => void;
}



const AttendanceCard: React.FC<OJTAttendanceProps> = ({ isOpen, closeModal }) => {

  if (!isOpen) return null;
  const [openAtt, setOpenAtt] = React.useState(false);
  const handleOpenAtt = () => setOpenAtt(true);
  const handleCloseAtt = () => setOpenAtt(false);


  const [time, setTime] = useState<AttendanceState["time"]>("");
  const [date, setDate] = useState<AttendanceState["date"]>("");
  const [timeSlots, setTimeSlots] = useState<AttendanceState["timeSlots"]>([]);
  const [timeOutSlots, setTimeOutSlots] = useState<
    AttendanceState["timeOutSlots"]
  >([]);
  const [isPunchingIn, setIsPunchingIn] =
    useState<AttendanceState["isPunchingIn"]>(true);
  const [slot, setSlot] = useState<AttendanceState["slot"]>("");
  const [hasPunchedIn, setHasPunchedIn] =
    useState<AttendanceState["hasPunchedIn"]>(false);
  const [punchedInTime, setPunchedInTime] =
    useState<AttendanceState["punchedInTime"]>();
  const [punchedOutTime, setPunchedOutTime] =
    useState<AttendanceState["punchedOutTime"]>(null);
  const [workingHours, setWorkingHours] =
    useState<AttendanceState["workingHours"]>("0");
  const [tabValue, setTabValue] = useState<AttendanceState["tabValue"]>("");
  const [leaveReason, setLeaveReason] =
    useState<AttendanceState["leaveReason"]>("");
  const [submittedLeaveReason, setSubmittedLeaveReason] =
    useState<AttendanceState["submittedLeaveReason"]>("");
  const [show, setShow] = useState<AttendanceState["show"]>(true);
  const [locationAllowed, setLocationAllowed] = useState(false);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [country, setCountry] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);



  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    if (
      timeSlots.includes(selectedValue) ||
      timeOutSlots.includes(selectedValue)
    ) {
      setSlot(selectedValue);
    } else {
      // console.warn(`Out-of-range value selected: ${selectedValue}`);
      setSlot(""); // Reset to empty if the value is invalid
    }
  };

  const handleClose = () => {
    closeModal(false);
    setShow(!show);
  };

  //Show Date
  useEffect(() => {
    const updateDateTime = () => {
      const d = new Date();
      const day = d.getDate().toString().padStart(2, "0");
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = monthNames[d.getMonth()];
      const year = d.getFullYear();
      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;

      setTime(`${hours}:${minutes} ${ampm}`);
      setDate(`${day} ${month} ${year}`);
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);


  // code for getting  user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // console.log("Latitude:", lat);
          // console.log("Longitude:", lon);

          setLatitude(lat);
          setLongitude(lon);
          setLocationAllowed(true);

          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
            );

            const data = await response.json();

            const cityName = data.city || data.locality || "Unknown City";
            const state = data.principalSubdivision || "Unknown State";
            const countryName = data.countryName || "Unknown Country";

            // console.log(" Location:", `${cityName}, ${state}, ${countryName}`);

            setCity(cityName);
            setStateName(state);
            setCountry(countryName);

            // Optional: If you want to store this full string
            // setLocationDisplay(`${cityName}, ${state}, ${countryName}`);
          } catch (err) {
            // console.error(" Failed to fetch location details:", err);
          }
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            // console.warn(" Location permission denied");
            setLocationAllowed(false);
            setOpenToast(true);
          } else {
            // console.error(" Geolocation error:", error.message);
          }
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);




  const formattedPunchedIn = punchedInTime
    ? punchedInTime instanceof Date
      ? punchedInTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      : "Invalid Date"
    : "N/A";

  const formattedPunchedOut = punchedOutTime
    ? punchedOutTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    : "N/A";


  const generateTimeSlots = (addMinutes = 0) => {
    const now = new Date();
    const slots = [];

    for (let i = 0; i < 4; i++) {
      const slot = new Date(
        now.getTime() - i * 10 * 60 * 1000 + addMinutes * 60 * 1000
      );
      slots.push(
        slot.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }

    return slots;
  };

  useEffect(() => {
    setTimeSlots(generateTimeSlots());
  }, []);

  // punch in code 

  const handlePunchIn = () => {

    if (!locationAllowed) {

      setOpenToast(true); // Show the snackbar
      return;
    }
    if (!locationAllowed) {
      setOpenToast(true);
      return;
    }

    setSlot("");
    if (!slot) return console.error("No slot selected.");

    const now = new Date();
    const [timePart, period] = slot.split(" ");
    const [selectedHour, selectedMinute] = timePart.split(":").map(Number);

    if (!isNaN(selectedHour) && !isNaN(selectedMinute)) {
      let hour = selectedHour;

      if (period === "pm" && hour >= 1 && hour <= 11) hour += 12;
      if (period === "am" && hour === 12) hour = 0;
      if (period !== "am" && period !== "pm") {
        // console.error(" Invalid period detected. Expected 'AM' or 'PM'.");
        return;
      }

      const punchedInDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hour,
        selectedMinute
      );

      const newTimeOutSlots = generateTimeSlots(5);
      setTimeOutSlots(newTimeOutSlots);

      setPunchedInTime(punchedInDate);
      setHasPunchedIn(true);
      setWorkingHours("00:00:00");

      if (newTimeOutSlots.length > 0) {
        setSlot(newTimeOutSlots[0]);
      }
    } else {
      console.error(" Invalid slot time selected. Couldn't parse numbers.");
    }
  };



  const handlePunchOut = () => {
    if (!hasPunchedIn || !(punchedInTime instanceof Date)) return;

    const punchedOutDate = new Date(); // ✅ Use current date and time
    setPunchedOutTime(punchedOutDate);
    setHasPunchedIn(false);

    const diffInMs = punchedOutDate.getTime() - punchedInTime.getTime();
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

    const formattedTime = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    setWorkingHours(formattedTime);
  };


  useEffect(() => {
    if (hasPunchedIn && punchedInTime instanceof Date) {
      // Ensure it's a Date object
      const intervalId = setInterval(() => {
        const now = new Date();

        // If user selects slot, use that instead of the current time
        const punchedInDateTime = new Date(punchedInTime);

        const diffInMs = now.getTime() - punchedInDateTime.getTime(); // Use .getTime() for accurate comparison

        // Convert to hours, minutes, and seconds
        const hours = Math.floor(diffInMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

        const formattedTime = `${String(hours).padStart(2, "0")}:${String(
          minutes
        ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        setWorkingHours(formattedTime);

        // Calculate progress for a 12-hour max
        const totalHours = diffInMs / (1000 * 60 * 60);
        const progressValue = Math.min((totalHours / 12) * 100, 100);

      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [hasPunchedIn, punchedInTime]);

  // const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setTabValue(newValue); // Sets which tab is active
  //   setOpenToast(true);
  // };

  //  handle tab change..................

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue); // Sets which tab is active

    if (!locationAllowed && newValue === 0) {
      // Only show alert if user tries to go to "Present" tab and location is off
      setOpenToast(true);
    }
  };


  // Handling change in textarea
  const handleLeaveReasonChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setLeaveReason(event.target.value);
  };

  // Handling submit button click
  const handleSubmitLeave = () => {
    if (leaveReason.trim()) {
      // Only submit if there's something typed

      setSubmittedLeaveReason(leaveReason);

    }

  };
  useEffect(() => {
    if (isPunchingIn && !hasPunchedIn && slot === "") {
      const d = new Date();
      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const currentTime = `${hours}:${minutes} ${ampm}`;

      if (timeSlots.includes(currentTime)) {
        setSlot(currentTime); // Auto-select current time if available
      } else if (timeSlots.length > 0) {
        setSlot(timeSlots[0]); // Otherwise, select the first available slot
      }
    }
  }, [isPunchingIn, hasPunchedIn, timeSlots, slot]);

  const [showHelp, setShowHelp] = useState(false);

  const handleClick = () => {
    setShowHelp(!showHelp);
  };

  const [isAgreed, setIsAgreed] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const handleUpdate = () => {
    if (isAgreed) {
      setOpenToast(true);
    }
  };


  return (
    <>
      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={() => setOpenToast(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenToast(false)} severity="error" sx={{ width: "100%" }}>
          Location access is required to use this website. Please enable it.
        </Alert>

      </Snackbar>
      <Modal
        open={isOpen}
        onClose={handleCloseAtt}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ marginTop: 20 }}
      >

        <Card
          sx={{
            maxWidth: 430,
            margin: "20px auto",
            padding: 0,
            border: "1px solid #f0f0f0",
            borderRadius: 1,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            marginTop={"5px"}
            fontSize={"20px"}
            mb={0}
            mt={2}
            pl={2}
            sx={{ border: "none" }}
          >
            Attendance{" "}
            <Box
              onClick={handleClick}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ml: { xs: "30px", sm: "-50px", lg: -16 },
                mb: 0,
                cursor: "pointer",
                marginTop: "-20px",
                mr: { xs: 1, sm: 2 },
              }}
            >
              <HelpOutlineOutlinedIcon
                sx={{ width: "17px", marginRight: "4px", color: "goldenrod" ,
                  

                }}
                onClick={() => setIsUploadModalOpen(true)}
              />

              <OJTHelp
                isOpen={isUploadModalOpen}
                closeModal={() => setIsUploadModalOpen(false)}
              />

              <Typography variant="subtitle2" fontSize={"14px"}>
                {/* <a href={help.src} target="_blank" rel="noopener noreferrer">
              Help
              </a> */}
              </Typography>
            </Box>
          </Typography>
          <Box
            onClick={handleClose}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              marginTop: "-30px",
              marginLeft: "100px",
              float: "right",
              marginRight: "10px",
              padding: "2px",
              color: 'black',

              backgroundColor: "lightgrey",
              borderRadius: "50%", // Makes it circular
            }}
          >
            <CloseIcon sx={{ width: "15px", height: "15px" }} />
          </Box>

          <Box
            sx={{ display: "flex", alignItems: "center", pl: 2, mt: 1, mb: 0 }}
          >
            <CalendarMonthOutlinedIcon
              sx={{ width: "17px", marginRight: "4px", color: "goldenrod" }}
            />
            <Typography variant="subtitle2" fontSize={"14px"}>
              {date}
            </Typography>
          </Box>

          {!locationAllowed && (

            <Box sx={{ pl: 1, mt: 0, mb: 0, pr: 2 }}

            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  marginLeft: 0.7,
                }}
              >

                <LocationOffIcon sx={{ width: 25, height: 35, color: "#FF4D4D" }} />

                <Stack>

                  <Typography
                    variant="body2"
                    sx={{
                      color: " #FF4D4D",
                      fontSize: { xs: "12px", sm: "14px", md: "14px", },
                    }}
                  >
                    Location access is required for marking attendence.

                  </Typography>
                </Stack>



              </Box>

            </Box>
          )}
          <Box sx={{ pl: 1, mt: 1, mb: 0, pr: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                marginTop: 3,
              }}
            >
              {/* Profile Avatar */}
              <Avatar
                sx={{ bgcolor: "#FFD700", width: 40, height: 40 }}
                alt="User Avatar"
              ></Avatar>

              {/* Text Content */}
              <Stack>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "11px", sm: "13px", md: "18px" }, // Adjust font size for mobile and other devices
                  }}
                >
                  20 March 2025
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "gray",
                    fontSize: { xs: "12px", sm: "14px", md: "14px" }, // Adjust font size for mobile and other devices
                  }}
                >
                  Last Attendance
                </Typography>
              </Stack>

              {/* Time Display */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column", // Change to column to stack items vertically
                  alignItems: "flex-end", // Aligns text to the right
                  marginLeft: "auto",
                  gap: 0.2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "gray",
                    fontWeight: "bold",
                    fontSize: { xs: "12px", sm: "14px", md: "14px" }, // Adjust font size for mobile and other devices
                  }}
                >
                  IN - OUT
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "gray",
                    fontSize: { xs: "12px", sm: "14px", md: "14px" }, // Adjust font size for mobile and other devices
                  }}
                >
                  <b>1:30 - 1:30</b>
                </Typography>
              </Box>
            </Box>
          </Box>


          <CardContent>



            <Box
              sx={{
                width: "100%",
                marginTop: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "4px 8px",
                borderRadius: 1,
                flexDirection: { xs: "column", sm: "row" }, // Responsive layout
                gap: { xs: 2, sm: 0 }, // Add gap for mobile
              }}
            >
              {/* Left Side: Icon & Text */}
              <Box display="flex" alignItems="center" sx={{ flex: 1, marginLeft: -3.5 }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    bgcolor: "primary.main",
                    width: 40,
                    height: 40,
                    marginRight: "2px",
                  }}
                >
                  <MessageOutlinedIcon sx={{ width: 22, height: 22 }} />
                </Avatar>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    marginRight: "8px",
                    fontSize: { xs: "14px", sm: "14px", mt: 1 }, // Adjust font size for mobile
                  }}
                >
                  Attendance Type
                </Typography>
              </Box>

              {/* Right Side: Tabs */}
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                TabIndicatorProps={{
                  sx: { display: "none" },
                }}
                sx={{
                  minHeight: "30px",
                  flex: 1,
                  justifyContent: { xs: "center", sm: "flex-end" }, // Center tabs on mobile
                }}
              >
                <Tab
                  label="Present"
                  // disabled={!!leaveReason}
                  disabled={!!leaveReason || !locationAllowed}

                  sx={{
                    backgroundColor: tabValue === 0 ? "#E3F2FD" : "transparent",
                    border: "1px solid #D3D3D3",
                    borderTopLeftRadius: 4,
                    borderBottomLeftRadius: 4,
                    transition: "background-color 0.3s",
                    padding: "2px 8px",
                    minHeight: "30px",
                    height: "30px",
                    fontSize: { xs: "12px", sm: "14px" }, // Adjust font size for mobile
                    "&:not(:last-child)": { borderRight: "1px solid #D3D3D3" },
                  }}
                />
                <Tab
                  label="On Leave"
                  disabled={!!punchedInTime || !locationAllowed} // Disable when punched in
                  sx={{
                    backgroundColor: tabValue === 1 ? "#E0E0E0" : "transparent",
                    border: "1px solid #D3D3D3",
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4,
                    transition: "background-color 0.3s",
                    padding: "2px 8px",
                    minHeight: "30px",
                    height: "30px",
                    fontSize: { xs: "12px", sm: "14px" }, // Adjust font size for mobile
                  }}
                />
                <Tab
                  key=""
                  label=""
                  value=""
                  sx={{
                    visibility: "hidden", // Keeps it in the DOM without being visible
                    height: 0, // Collapses the height to prevent space
                    minHeight: 0,
                    padding: 0,
                    position: "absolute",
                  }}
                />
              </Tabs>
            </Box>

            {tabValue === 0 && (
              <>
                {!punchedOutTime && (
                  <div>
                    <Typography
                      variant="body1"
                      align="center"
                      mb={2}
                      mt={2}
                      sx={{ fontSize: { xs: "14px", sm: "16px" } }} // Adjust font size for mobile
                    >
                      Select Timing
                    </Typography>
                    <FormControl
                      sx={{
                        width: { xs: "100%", sm: "60%" }, // Full width for mobile
                        marginBottom: { xs: 2, sm: 0 }, // Add margin for mobile
                      }}
                    >
                      <InputLabel id="demo-simple-select-label">
                        {time || "Current Time"}
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // value={slot} // Set default time when punching out
                        label="Slot"
                        onChange={handleChange}
                      >
                        {(isPunchingIn ? timeSlots : timeOutSlots).map((time, index) => (
                          <MenuItem key={index} value={time}>
                            {time}
                          </MenuItem>
                        ))}
                      </Select>

                    </FormControl>

                    <Button
                      disabled={!locationAllowed}
                      variant="contained"
                      color="warning"
                      size="medium"
                      sx={{
                        borderRadius: 0,
                        backgroundColor: "#F76542",
                        marginTop: "2px",
                        marginLeft: { xs: "", sm: "13px" },
                        width: { xs: "100%", sm: "30%" }, // Full width for mobile
                      }}
                      onClick={hasPunchedIn ? handlePunchOut : handlePunchIn}
                    >
                      {hasPunchedIn ? "Punch Out" : "Punch In"}
                    </Button>
                  </div>
                )}
                <br />
                {punchedInTime && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" }, // Responsive layout
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      marginBottom: 0,
                      padding: 1,
                      gap: { xs: 2, sm: 0 }, // Add gap for mobile
                    }}
                  >
                    {/* Punch In */}
                    <Box sx={{ textAlign: "center", flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          fontSize: { xs: "14px", sm: "16px" }, // Adjust font size for mobile
                        }}
                      >
                        <UpdateIcon fontSize="small" sx={{ color: "red" }} />{" "}
                        <br />
                        {formattedPunchedIn
                          ? formattedPunchedIn
                          : "Not Checked In"}
                      </Typography>
                      <Typography
                        sx={{ fontSize: { xs: "12px", sm: "14px" } }} // Adjust font size for mobile
                      >
                        Punch In
                      </Typography>
                    </Box>

                    <Divider
                      orientation="horizontal"
                      flexItem
                      sx={{
                        marginY: 2,
                        display: { xs: "block", sm: "none" }, // Show divider for mobile
                      }}
                    />
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{
                        marginX: 2,
                        display: { xs: "none", sm: "block" }, // Show divider for desktop
                      }}
                    />

                    {/* Punch Out */}
                    <Box sx={{ textAlign: "center", flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          fontSize: { xs: "14px", sm: "16px" }, // Adjust font size for mobile
                        }}
                      >
                        <UpdateDisabledIcon
                          fontSize="small"
                          sx={{ color: "green" }}
                        />{" "}
                        <br />
                        {formattedPunchedOut
                          ? formattedPunchedOut
                          : "Not Checked In"}
                      </Typography>
                      <Typography
                        sx={{ fontSize: { xs: "12px", sm: "14px" } }} // Adjust font size for mobile
                      >
                        Punch Out
                      </Typography>
                    </Box>

                    <Divider
                      orientation="horizontal"
                      flexItem
                      sx={{
                        marginY: 2,
                        display: { xs: "block", sm: "none" }, // Show divider for mobile
                      }}
                    />
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{
                        marginX: 2,
                        display: { xs: "none", sm: "block" }, // Show divider for desktop
                      }}
                    />

                    {/* Working Hours */}
                    <Box sx={{ textAlign: "center", flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          fontSize: { xs: "14px", sm: "16px" }, // Adjust font size for mobile
                        }}
                      >
                        <WatchLaterOutlinedIcon
                          fontSize="small"
                          sx={{ color: "goldenrod" }}
                        />{" "}
                        <br /> {workingHours}
                      </Typography>
                      <Typography
                        sx={{ fontSize: { xs: "12px", sm: "14px" } }} // Adjust font size for mobile
                      >
                        Total Hours
                      </Typography>
                    </Box>
                  </Box>
                )}
              </>
            )}
          </CardContent>

          {tabValue === 1 && (
            <div style={{ marginTop: "4px", textAlign: "center", padding: 5 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", marginBottom: 1 }}
              >
                Reason for Leave
              </Typography>

              {submittedLeaveReason ? (
                // Show the submitted reason as plain text
                <div
                  style={{
                    padding: "12px",
                    marginTop: "10px",
                    borderRadius: "8px",
                    border: "1px solid #B0BEC5",
                    backgroundColor: "#FAFAFA",
                    textAlign: "left",

                  }}
                >
                  <Typography variant="body2" sx={{ color: "gray" }}>
                    <strong> Leave Reason:</strong> {submittedLeaveReason}
                  </Typography>
                </div>
              ) : (
                // Show the textarea when no reason has been submitted
                <>
                  <textarea
                    value={leaveReason}
                    onChange={handleLeaveReasonChange}
                    rows={5}
                    cols={30}
                    placeholder="Please describe your reason for leave..."
                    style={{
                      width: "90%",
                      padding: "12px",
                      marginTop: "10px",
                      borderRadius: "8px",
                      border: "1px solid #B0BEC5",
                      backgroundColor: "#F5F5F5",
                      resize: "none",
                      fontFamily: "Arial, sans-serif",
                      fontSize: "14px",
                      outlineColor: "#42A5F5",
                      transition: "border-color 0.3s, background-color 0.3s",
                      color: 'black'
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitLeave}
                    sx={{
                      marginTop: "15px",
                      backgroundColor: "#42A5F5",
                      "&:hover": { backgroundColor: "#1E88E5" },
                      borderRadius: 0,
                    }}
                  >
                    Submit
                  </Button>
                  <br />
                </>
              )}
            </div>
          )}
        </Card></Modal>

    </>
  );
};

export default AttendanceCard;

