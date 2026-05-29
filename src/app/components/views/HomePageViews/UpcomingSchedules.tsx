"use Client";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Alert,
  Box,
  Grid,
  Paper,
  Snackbar,
  Stack,
  Tab,
  Typography,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { IconClock } from "@tabler/icons-react";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import DashboardCard from "../../shared/DashboardCard";
import { getUpcomingSchedulesAction } from "@/app/actions/homeAction/UpcomingSchedules/getUpcomingSchedulesAction";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import TimeTablePopup from "./Popup/TimeTablePopup/TimeTablePopup";


 import SchoolIcon from "@mui/icons-material/School"


interface Schedule {
  timing: ReactNode;
  courseInfo: ReactNode;
  borderColor: string;
}

interface TabData {
  value: string;
  label: string;
  schedules: Schedule[];
}
const UpcomingSchedules = ({ onDataFetched }: any) => {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [value, setValue] = useState("1");
  const [loading, setLoading] = useState(true);
  const [Upcomingdata, setUpcomingdata] = useState<TabData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isDataFetched = useRef(false);
  const { data: session } = useSession();
    const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // const handleOpen = () => setOpen(true);

  const handleOpen = () => {

    if (Upcomingdata.length <= 0) {
      setIsPopupOpen(false)
      setAlertMessage("No Class Schedule Found");
      setOpenAlert(true);

    }

    else {
      setIsPopupOpen(true)
    }

    // setOpen(true)
  };

  const handleClose = () => {
    setOpen(false)
    setOpenAlert(false);
  };

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // Converts time like "04-05 PM" into a 24-hour start time (e.g., 16 for "04-05 PM")
  const convertTo24Hour = (timing: string): number => {
    const [startTime] = timing.split(" ")[0].split("-"); // Extract start time
    let hour = parseInt(startTime, 10);
    const isPM = timing.includes("PM");

    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    return hour;
  };

  // Determines the border color based on the current time
  // const getBorderColor = (startHour: number) => {
  //   const currentHour = new Date().getHours();
  //   if (startHour < currentHour) return "red"; // Past schedules 🔴
  //   if (startHour === currentHour) return "orange"; // Ongoing schedules 🟠
  //   return "green"; // Upcoming schedules 🟢
  // };
  const getBorderColor = (startHour: number) => {
    const currentHour = new Date().getHours();
    if (startHour < currentHour) return "#FF4D4D";
    if (startHour === currentHour) return `${theme.palette.warning.main} `;
    return `${theme.palette.success.main}`;
  };

  const categorizeScheduleByDayAndTime = (data: any[]) => {
    const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    let scheduleByDay: {
      [key: string]: { "8-12": any[]; "12-3": any[]; "3-6": any[] };
    } = {};

    days.forEach((day) => {
      scheduleByDay[day] = { "8-12": [], "12-3": [], "3-6": [] };
    });

    data.forEach((entry) => {
      days.forEach((day) => {
        if (entry[day]) {
          const hour = convertTo24Hour(entry.timing);
          let timeSlot: "8-12" | "12-3" | "3-6" | null = null;

          if (hour >= 8 && hour < 12) timeSlot = "8-12";
          else if (hour >= 12 && hour < 15) timeSlot = "12-3";
          else if (hour >= 15 && hour < 18) timeSlot = "3-6";

          if (timeSlot) {
            scheduleByDay[day][timeSlot].push({
              timing: entry.timing,
              courseInfo: entry[day],
              borderColor: getBorderColor(hour),
            });
          }
        }
      });
    });

    return scheduleByDay;
  };

  const parseCourseInfo = (courseInfo: string) => {
    const mappings: { [key: string]: string } = {
      G: "Group",
      C: "Course Code",
      R: "Room No",
      S: "Section",
    };

    const parts = courseInfo.split(" / ");
    const parsedObject: { [key: string]: string } = {};

    // Extract Class Type (First word before "/")
    parsedObject["Class Type"] = parts[0];

    // Process remaining parts correctly
    parts.slice(1).forEach((part) => {
      const keyValueMatch = part.match(/([GCRS]):[^/]+/g); // Matches "G:0", "C:MKTM534", etc.

      keyValueMatch?.forEach((match) => {
        const [key, ...valueParts] = match.split(":"); // Ensure values remain intact
        const value = valueParts.join(":").trim(); // Handle cases where values contain colons

        if (mappings[key]) {
          parsedObject[mappings[key]] = value;
        }
      });
    });

    return parsedObject;
  };

  // Test

  useEffect(() => {
    const fetchsheduletData = async () => {
      if (isDataFetched.current) return;
      try {
        setLoading(true);
        const response = await getUpcomingSchedulesAction();
        if (response.status === "success") {
          const splitValue = String(session?.user?.token).split("NEXT2121ANG");
          const decryptedData = decryptDataforResponse(
            response.ApiData,
            splitValue[1]
          );
          const parsedData = JSON.parse(decryptedData);
          // console.log("uptimetable",parsedData)

          const categorizedData = categorizeScheduleByDayAndTime(parsedData);
          const currentDay = new Date()
            .toLocaleString("en-us", { weekday: "short" })
            .toLowerCase();

          const updatedTabsData: TabData[] = [
            {
              value: "1",
              label: "8 to 12",
              schedules: categorizedData[currentDay]?.["8-12"] || [],
            },
            {
              value: "2",
              label: "12 to 3",
              schedules: categorizedData[currentDay]?.["12-3"] || [],
            },
            {
              value: "3",
              label: "3 to 6",
              schedules: categorizedData[currentDay]?.["3-6"] || [],
            },
          ];

          setUpcomingdata(updatedTabsData);

          // console.log("bydefaulttimetable",parsedData);
          // console.log("eachdaytimetable",categorizedData);
          // console.log("currentthreetabtiemtable",updatedTabsData);

          onDataFetched(response.ApiData);
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

    fetchsheduletData();
  }, [onDataFetched, session]);

  return (
    <>
    <Snackbar
        open={openAlert}
        autoHideDuration={3000} // Hide after 3 seconds
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // ✅ Alert on right side
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    <DashboardCard>
      <TabContext value={value}>
        <Box textAlign="center" mb={3.5}>
          <Typography
            variant="h4"
            gap={1}
            fontWeight="bold"
            display="flex"
            justifyContent="center"
            align="center"
            sx={{ cursor: "default", marginTop: -2, width: "100%" }}
          >
            <Box
              sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
            >
              <Icon
                icon="material-symbols:event-upcoming-outline"
                style={{ fontSize: "25px" }}
              />
              Upcoming Schedules
            </Box>

            <Box
              sx={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "flex-end",
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={handleOpen}
              // onClick={() => setIsPopupOpen(true)}
            >
              <Icon
                icon={
                  hovered
                    ? "mingcute:information-fill"
                    : "mingcute:information-line"
                }
                style={{ fontSize: "25px", color: "#707a82" }}
              />
            </Box>
          </Typography>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            aria-label="Upcoming schedules tabs"
            variant="fullWidth"
            sx={{
              "& .MuiTab-root.Mui-selected": {
                background: theme.palette.primary.main,
                color: "white",
                borderRadius: "8px",
              },
              "& .MuiTabs-indicator": {
                display: "none",
              },
            }}
          >
            {Upcomingdata.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </TabList>
        </Box>

        {/* Tab Panels */}


        {Upcomingdata.length > 0 ? (
          Upcomingdata.map((tab) => (
            <TabPanel
              key={tab.value}
              value={tab.value}
              sx={{ "&.MuiTabPanel-root": { padding: "24px 0 0" } }}
            >
              <Scrollbar sx={{ height: "157px" }}>
                <Grid container>
                  <Grid size={{ xs: 12 }}>
                    {tab.schedules.length > 0 ? (
                      tab.schedules.map((schedule, index) => (
                        <Paper elevation={9} sx={{ mt: 2 }} key={index}>
                          <Box
                            p={2}
                            sx={{
                              borderWidth: "0 0 0 5px",
                              borderStyle: "solid",
                              borderColor: schedule.borderColor,
                              borderRadius: "8px",
                            }}
                          >
                            <Typography variant="h6" sx={{ fontSize: 12 }}>
                              {typeof schedule.courseInfo === "string" &&
                                Object.entries(parseCourseInfo(schedule.courseInfo))
                                  .map(([key, value]) => `${key}: ${value}`)
                                  .join(" | ")}
                            </Typography>

                            <Stack
                              direction="row"
                              spacing={1}
                              color="textSecondary"
                              mb={2}
                            >
                              <IconClock width={18} />
                              <Typography variant="subtitle1">
                                {schedule.timing}
                              </Typography>
                            </Stack>
                          </Box>
                        </Paper>
                      ))
                    ) : (
                      <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
                        No class schedule.
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Scrollbar>
            </TabPanel>
          ))
        ) : (
          
              <Box
            sx={{
              // marginTop: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%", // or set a fixed height like 300
              textAlign: "center",
              py: 4,
              px: 2,
              // bgcolor: "#f5f5f5",
              // borderRadius: 2,
              // boxShadow: 3,
            }}
          >
            <SchoolIcon sx={{ fontSize: 60, color: "#9e9e9e", mb: 2 }} />
            <Typography variant="h6" color="textSecondary" fontWeight="bold">
              No Class Schedule Found
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              You currently don't have any classes scheduled. Please check back later or contact your instructor.
            </Typography>
          </Box>
       
        )}


        <TimeTablePopup
          open={isPopupOpen}
          handleClose={() => setIsPopupOpen(false)}
          title={"Time Table"}
        />
      </TabContext>
    </DashboardCard>
    </>
  );
};

export default UpcomingSchedules;
