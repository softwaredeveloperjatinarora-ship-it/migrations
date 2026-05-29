
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
    Apartment,
    MeetingRoom,
    LocationOn,
    Group,
    Male,
    Female,
    ErrorOutline,
    People,
    AssignmentInd,
    CalendarMonth,
} from "@mui/icons-material";
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    Container,
    Paper,
    useTheme,
    TableBody,
    TableCell,
    TableRow,
    Table,
    Chip,
    TableHead,
    TextField,
    MenuItem,
    CircularProgress,
    Button,
    Divider,
    Stack,
} from "@mui/material";
import { LoadingButton } from '@mui/lab';
import Breadcrumb from "@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import BlockManagement from "./BlockManagement";
import RoomDetails from "./RoomDetail";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { getExamDutyManagementAction, getExamDutyTrendsAction, getExamDutyTypesAction } from "@/app/actions/StaffActions/ExamDutyManagementActions/getexamdutydashboard";
import CentersDetail from "./CentersDetail";
import RoomListModal from "./RoomListModel";
import UMCCasesModal from "./UMCCasesModel";
import RoomListDetailModal from "./RoomListDetailModel";
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";


interface Timeslotwithtype {
    examTypeName: string;
    examtiming: string;
    description: string;
    examname: string;
    examFullTime: string;
    // add more fields if your API returns them
}

const ExaminationDutyManagementDashboard = () => {
    const theme = useTheme();
    const { data: session, status } = useSession();
    const [renderedOnce, setRenderedOnce] = useState(false);
    const [showUI, setShowUI] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [availableTimes, setAvailableTimes] = React.useState<string[]>([]);
    const BCrumb = [
        { to: "/dashboard", title: "Home", icon: "ic:baseline-home" },
        { title: "Examination Duty Dashboard" }
    ];
    const [loading, setLoading] = useState(false);

    const [stats, setStats] = useState<any[]>([]);

    const [visibleSection, setVisibleSection] = useState<string | null>(null);
    const [selectedCard, setSelectedCard] = useState<string | null>(null);

    const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);
    const [selectedTime, setSelectedTime] = React.useState<string>("");
    const [loadingTimes, setLoadingTimes] = React.useState(false);
    const [selectedType, setselectedType] = React.useState("");
    const [examDate, setExamDate] = React.useState<string>("");
    const [examtypes, setExamtypes] = React.useState<string[]>([]);
    const [timeslotswithtype, setTimeslotswithtype] = React.useState<Timeslotwithtype[]>([]);
    const [filtertimeslotswithtype, setFiltertimeslotswithtype] = React.useState<Timeslotwithtype[]>([]);

    const examtypevalues = [
        { value: "Theory" }
    ];

    const [openRoomModal, setOpenRoomModal] = useState(false);
    const [openUMCModal, setOpenUMCModal] = useState(false);

    useEffect(() => {
        debugger;
      //  console.log('Session in useeffect is', session?.user?.token)
        if (status === "authenticated") {
            setShowUI(true);
        } else {
            setShowUI(false);
        }
    }, [session]);

    const handleSubmit = async () => {
        debugger;

        setStats([]);
        const requestbody = {
            ExamHeldDate: examDate,
            TM: selectedTime,
            EType: selectedType
        }

        try {
            setLoading(true);
            const response = await getExamDutyTrendsAction(requestbody);
            if (response?.status === "success" && response.ApiData) {

                const totalBlock = response?.ApiData.item1?.[0]?.totalBlock || "0";
                const blockNos = response?.ApiData.item1?.[0]?.blockNos || "0";
                const totalCenter = response?.ApiData.item1?.[0]?.totalCenter || "0";
                const totalRooms = response?.ApiData.item1?.[0]?.totalRooms || "0";
                const totalUMC = response?.ApiData.item3?.[0]?.totalUMC || "0";
                const totalDiscrepancies = response?.ApiData.item4?.[0]?.totalDiscrepancies || "0";

                const female = response?.ApiData.item2?.find((x: any) => x.category === "Female")?.scheduleStrength || "0";
                const male = response?.ApiData.item2?.find((x: any) => x.category === "Male")?.scheduleStrength || "0";
                //const totalStrength = response?.ApiData.item2?.find((x: any) => x.category === "Total")?.scheduleStrength || "0";


                const femaleData = response?.ApiData.item2?.find((x: any) => x.category === "Female");
                const maleData = response?.ApiData.item2?.find((x: any) => x.category === "Male");
                const totalData = response?.ApiData.item2?.find((x: any) => x.category === "Total");

                const totalStrength = totalData?.scheduleStrength || "0";
                const totalPresent = totalData?.presentStrength || "0";
                const totalAbsent = totalData?.absentStrength || "0";

                const femaleStrength = femaleData?.scheduleStrength || "0";
                const femalePresent = femaleData?.presentStrength || "0";
                const femaleAbsent = femaleData?.absentStrength || "0";

                const maleStrength = maleData?.scheduleStrength || "0";
                const malePresent = maleData?.presentStrength || "0";
                const maleAbsent = maleData?.absentStrength || "0";
                // Assign to stats array
                const updatedStats = [
                    // { value: totalBlock, label: "Total Blocks", icon: <Apartment fontSize="large" color="primary" /> },
                    {
                        value: (
                            <Box textAlign="center">
                                {/* Line 1 — total block count */}
                                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                                     {totalBlock}
                                </Typography>

                                {/* Line 2 — block numbers */}
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "gray",
                                        fontSize: "0.9rem",
                                        mt: 0.5,
                                        whiteSpace: "pre-line", // ensures newline respected
                                        wordBreak: "break-word", // wrap long block lists
                                    }}
                                >
                                    (Block: {blockNos || "N/A"})
                                </Typography>
                            </Box>
                        ),
                        label: "Total Blocks",
                        icon: <Apartment fontSize="large" color="primary" />,
                    },
                    { value: totalCenter, label: "Total Centers", icon: <LocationOn fontSize="large" sx={{ color: "gold" }} /> },
                    { value: totalRooms, label: "Total Rooms", icon: <MeetingRoom fontSize="large" sx={{ color: "green" }} /> },
                    { value: totalUMC, label: "Total UMC", icon: <Group fontSize="large" sx={{ color: "teal" }} /> },
                    // { value: totalStrength, label: "Total Strength", icon: <People fontSize="large" color="primary" /> },
                    {
                        value: totalStrength,
                        label: "Total Student Strength",
                        icon: <People fontSize="large" color="primary" />,
                        subLabel: (
                            <span>
                                <span style={{ color: "green", fontWeight: 600 }}>Present: {totalPresent}</span>{" | "}
                                <span style={{ color: "red", fontWeight: 600 }}>Absent: {totalAbsent}</span>
                            </span>
                        ),
                    },

                    // { value: male, label: "Male", icon: <Male fontSize="large" sx={{ color: "green" }} /> },
                    {
                        value: maleStrength,
                        label: "Male Students",
                        icon: <Male fontSize="large" color="primary" />,
                        subLabel: (
                            <span>
                                <span style={{ color: "green", fontWeight: 600 }}>Present: {malePresent}</span>{" | "}
                                <span style={{ color: "red", fontWeight: 600 }}>Absent: {maleAbsent}</span>
                            </span>
                        ),
                    },
                    // { value: female, label: "Female", icon: <Female fontSize="large" sx={{ color: "orange" }} /> },
                    {
                        value: femaleStrength,
                        label: "Female Students",
                        icon: <Female fontSize="large" color="primary" />,
                        subLabel: (
                            <span>
                                <span style={{ color: "green", fontWeight: 600 }}>Present: {femalePresent}</span>{" | "}
                                <span style={{ color: "red", fontWeight: 600 }}>Absent: {femaleAbsent}</span>
                            </span>
                        ),
                    },
                    { value: totalDiscrepancies, label: "Discrepancies", icon: <ErrorOutline fontSize="large" sx={{ color: "red" }} /> },
                      { value: 0, label: "Assign SOC", icon: <AssignmentInd fontSize="large" sx={{ color: "teal" }} /> },
                      { value: 0, label: "UpComing Exams", icon: <CalendarMonth fontSize="large" sx={{ color: "primary" }} /> }
                ];
                //   console.log('Stats are', JSON.stringify(updatedStats));
                setStats(updatedStats);
             //   console.log('Selected time is', selectedTime);
                if (selectedTime) {
                    const filtered = timeslotswithtype.filter(
                        (item: any) => item.examtiming === selectedTime
                    );
                    setFiltertimeslotswithtype(filtered);
                }

                setLoading(false);

            }

        } catch (error) {
            console.error("Error fetching times:", error);
            setAvailableTimes([]);
            setLoading(false);
        } finally {
            setLoadingTimes(false);
            setLoading(false);
        }

    };

    const handleDateChange = async (newValue: Dayjs | null) => {
        debugger;
        setSelectedDate(newValue);
        setSelectedTime("");
        setAvailableTimes([]);
        setStats([]);
        setselectedType("");
        setVisibleSection(null);
        setFiltertimeslotswithtype([]);
        if (!newValue) return;

        const formattedDate = newValue.format("YYYY-MM-DD");
        setExamDate(formattedDate);
        setLoadingTimes(true);


        try {
       debugger;
       console.log('token is ',session?.user.token);
       const finaltoken = session?.user?.token;
        let splitValue =finaltoken?.split("_NEXT_JATINSARPAL_JS_");
        debugger;

        const payload = {
            ExamHeldDate:newValue.format("YYYY-MM-DD")          
        };
        const credentialsJson = JSON.stringify(payload);
        const { Data } = encryptData(credentialsJson, splitValue?.[1] ?? ""); // encrypt
        console.log(Data);
        const response = await getExamDutyTypesAction(Data);  
        if (response.status === "success") {
            debugger;
            console.log('Response is',JSON.stringify(response));
            const splitValue = String(session?.user?.token).split("_NEXT_JATINSARPAL_JS_");
            const decryptedData = decryptDataforResponse(
                response.ApiData,
                splitValue[1]
            );
            const parsedData = JSON.parse(decryptedData);
            const types = parsedData.map((item: any) => item.examTypeName);
                setExamtypes(examtypevalues.map(e => e.value));
        //         console.log("Participation Response", parsedData);
        //     return parsedData




//            const response = await getExamDutyTypesAction(newValue.format("YYYY-MM-DD"));
            //console.log('Response from API is', response);
            // const { ApiData, status } = response;
            // if (response?.ApiData) {
            //     const types = ApiData.item1.map((item: any) => item.examTypeName);
            //     setExamtypes(examtypevalues.map(e => e.value));
            }
        } catch (error) {
            console.error("Error fetching types:", error);
            setExamtypes([]);
        } finally {
            setLoadingTimes(false);
        }
        try {
            const response = await getExamDutyManagementAction(newValue.format("YYYY-MM-DD"));
           // console.log('timingResponse from API is', response.ApiData?.item1);
            const { ApiData, status } = response;
            if (response?.ApiData) {
                // const times = ApiData.item1.map((item: any) => item.examtiming);
                setTimeslotswithtype(response?.ApiData.item1);
                const uniqueTimes: string[] = Array.from(
                    new Set(
                        response.ApiData.item1
                            .map((item: any) => item.examtiming)
                            .filter((t: string): t is string => !!t && t.trim() !== '')
                    )
                );
                setAvailableTimes(uniqueTimes);
            }
        } catch (error) {
            console.error("Error fetching times:", error);
            setAvailableTimes([]);
        } finally {
            setLoadingTimes(false);
        }
    };

    const handleTypeChange = async (newValue: Dayjs | null) => {
        setSelectedDate(newValue);
        setSelectedTime("");
        setAvailableTimes([]);
        setStats([]);
        setselectedType("");
        setVisibleSection(null);
        if (!newValue) return;

        const formattedDate = newValue.format("YYYY-MM-DD");
        setExamDate(formattedDate);
        setLoadingTimes(true);


        try {
            const response = await getExamDutyManagementAction(newValue.format("YYYY-MM-DD"));
            //console.log('Response from API is', response);
            const { ApiData, status } = response;
            if (response?.ApiData) {
                const times = ApiData.item1.map((item: any) => item.examTiming);
                setAvailableTimes(times);
            }
        } catch (error) {
            console.error("Error fetching times:", error);
            setAvailableTimes([]);
        } finally {
            setLoadingTimes(false);
        }
    };

    // useEffect(() => {
    //     debugger;
    //     if (status === "authenticated" && !renderedOnce) {
    //         setRenderedOnce(true); // Mark as rendered once
    //     }
    // }, [status, renderedOnce]);

    // if (status === "loading") {
    //     return <p>Loading...</p>;
    // }

    // // If not authenticated, show login message
    // if (status === "unauthenticated") {
    //     return <h1>No session found</h1>;
    // }

    // // Prevent re-rendering if already rendered once with session
    // if (!renderedOnce) {
    //     return null; // Wait until session is set
    // }

    // if (!showUI) {
    //     return <h1>No session found</h1>;
    // }

    const handleTimeChange = (time: string) => {
        setSelectedTime(time);
        setVisibleSection(null);
        setFiltertimeslotswithtype([]);
        setStats([]);
    };




    const handleCardClick = (label: string) => {
        debugger;
       // console.log('Session ', session?.user?.token);
        setSelectedCard(label);
        if (label === "Total Blocks") {
            setVisibleSection((prev) => (prev === "blocks" ? null : "blocks"));
            setOpenRoomModal(false);
            setOpenUMCModal(false);
        } else if (label === "Total Rooms") {
            setVisibleSection((prev) => (prev === "rooms" ? null : "rooms"));
            setOpenRoomModal(true);
            setOpenUMCModal(false);
        }
        else if (label === "Total Centers") {
            setVisibleSection((prev) => (prev === "centers" ? null : "centers"));
            setOpenRoomModal(false);
            setOpenUMCModal(false);
        }
        else if (label === "Total UMC") {
            setVisibleSection((prev) => (prev === "umcs" ? null : "umcs"));
            setOpenRoomModal(false);
            setOpenUMCModal(true);
        }

        else {
            setVisibleSection(null);
            setOpenRoomModal(false);
            setOpenUMCModal(false);
        }
    };

    return (
        <>
            <Breadcrumb title="Exam Duty Management" items={BCrumb} />
            <Box>

                <Paper
                    elevation={6}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        backgroundColor: "rgba(255, 255, 255, 0.98)",
                    }}
                >
                    <Box
                        sx={{
                            textAlign: "center",
                            background: theme.palette.primary.main,
                            borderRadius: 3,
                            py: 4,
                            mb: 5,
                            color: "white",
                        }}
                    >
                        <Typography variant="h4" fontWeight="bold" display="flex" justifyContent="center" alignItems="center" gap={1}>
                            🗒️ Examination Duty Management
                        </Typography>
                        <Typography variant="subtitle1">
                            Comprehensive examination center and duty management system
                        </Typography>
                    </Box>

                    <Box>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Grid
                                container
                                spacing={2}
                                alignItems="center"
                                justifyContent="center"
                                sx={{
                                    mt: 1,
                                    flexWrap: "wrap",
                                }}
                            >
                                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                                    <Box
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2,
                                                "& fieldset": { borderColor: "#ccc" },
                                                "&:hover fieldset": { borderColor: "primary.main" },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "primary.main",
                                                    boxShadow: "0 0 6px rgba(25,118,210,0.5)",
                                                },
                                            }, width: 200
                                        }}
                                    >
                                        <DatePicker
                                            label="Select Date"
                                            value={selectedDate}
                                            onChange={(value) => handleDateChange(value as Dayjs | null)}
                                            slotProps={{
                                                field: { clearable: true },
                                            }}
                                        />
                                    </Box>
                                </Grid>


                                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                                    <TextField
                                        select
                                        label="Select Type"
                                        fullWidth
                                        value={selectedType}
                                        onChange={(e) => setselectedType(e.target.value)}
                                        //  onChange={(e) => handleTypeChange(e.target.value)} 
                                        sx={{
                                            backgroundColor: "white",
                                            borderRadius: 2,
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": { borderColor: "#ccc" },
                                                "&:hover fieldset": { borderColor: "primary.main" },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "primary.main",
                                                    boxShadow: "0 0 6px rgba(25,118,210,0.5)",
                                                },
                                            },
                                        }}
                                    >
                                        {/* {centers.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))} */}
                                        {examtypes.length > 0 ? (
                                            examtypes.map((type, i) => (
                                                <MenuItem key={i} value={type}>
                                                    {type}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled>No Exam Types available</MenuItem>
                                        )}
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                                    {loadingTimes ? (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                height: "56px",
                                                border: "1px solid #ccc",
                                                borderRadius: 2,
                                            }}
                                        >
                                            <CircularProgress size={24} />
                                        </Box>
                                    ) : (
                                        <TextField
                                            select
                                            label="Select Available Time"
                                            fullWidth
                                            disabled={!availableTimes.length}
                                            value={selectedTime}
                                            // onChange={(e) => setSelectedTime(e.target.value)}
                                            onChange={(e) => handleTimeChange(e.target.value)}
                                            sx={{
                                                backgroundColor: "white",
                                                borderRadius: 2,
                                                "& .MuiOutlinedInput-root": {
                                                    "& fieldset": { borderColor: "#ccc" },
                                                    "&:hover fieldset": { borderColor: "primary.main" },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "primary.main",
                                                        boxShadow: "0 0 6px rgba(25,118,210,0.5)",
                                                    },
                                                },
                                            }}
                                        >
                                            {availableTimes.length > 0 ? (
                                                availableTimes.map((time, i) => (
                                                    <MenuItem key={i} value={time}>
                                                        {time}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem disabled>No times available</MenuItem>
                                            )}
                                        </TextField>
                                    )}
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                                    {/* <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{
                                            height: "56px",
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            textTransform: "none",
                                        }}
                                        onClick={handleSubmit}
                                    >
                                        Fetch
                                    </Button> */}
                                    <LoadingButton
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        loading={loading} // <-- boolean state
                                        loadingPosition="start" // or "end"
                                        sx={{
                                            height: "56px",
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            textTransform: "none",
                                        }}
                                        onClick={handleSubmit}
                                    >
                                        {loading ? "Fetching..." : "Fetch"}
                                    </LoadingButton>
                                </Grid>
                            </Grid>
                        </LocalizationProvider>
                    </Box>

                    <Grid container spacing={3} mt={2}>
                        {filtertimeslotswithtype.length > 0 && (() => {
                            // ✅ Step 1: Check if all slots share the same time
                            const allTimes = filtertimeslotswithtype.map((s) => s.examFullTime);
                            const isSameTime = allTimes.every((t) => t === allTimes[0]);
                            const commonTime = isSameTime ? allTimes[0] : null;

                            return (
                                <Grid size={{ xs: 12 }}>
                                    <Card
                                        sx={{
                                            textAlign: "center",
                                            boxShadow: 3,
                                            transition: "0.3s",
                                            "&:hover": { boxShadow: 6, transform: "scale(1.02)" },
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                textAlign: "center",
                                                fontWeight: 600,
                                                color: "#1976d2",
                                                mb: 1,
                                            }}
                                        >
                                            Exam Timeslots
                                        </Typography>

                                        {/* ✅ Common time (display once if all same) */}


                                        <Stack
                                            direction="row"
                                            flexWrap="wrap"
                                            gap={1.5}
                                            justifyContent="center"
                                        >
                                            {commonTime && (
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        mt: 2,
                                                        color: "#0d47a1",
                                                        fontWeight: 600,
                                                        mb: 1,
                                                    }}
                                                >
                                                    ⏰ {commonTime}
                                                </Typography>
                                            )}
                                            {filtertimeslotswithtype.map((slot, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        p: 1.5,
                                                        m: 0.5,
                                                        minWidth: 200,
                                                        borderRadius: "12px",
                                                        backgroundColor: "#e3f2fd",
                                                        border: "1px solid #90caf9",
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    {/* Exam type */}
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{
                                                            fontSize: 15,
                                                            fontWeight: 600,
                                                            color: "#0d47a1",
                                                        }}
                                                    >
                                                        {/* {slot.examTypeName || "Unknown Type"} */}
                                                    </Typography>

                                                    {/* ✅ Only show individual time if not all same */}
                                                    {!commonTime && (
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontSize: 14,
                                                                fontWeight: 500,
                                                                color: "#0d47a1",
                                                            }}
                                                        >
                                                            ⏰ {slot.examFullTime || "N/A"}
                                                        </Typography>
                                                    )}

                                                    {/* Description */}
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontSize: 14,
                                                            fontWeight: 500,
                                                            color: "#0d47a1",
                                                        }}
                                                    >
                                                        📝 {slot.description || "N/A"}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Card>
                                </Grid>
                            );
                        })()}

                        {stats.map((stat, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                                <Card onClick={() => handleCardClick(stat.label)}
                                    sx={{
                                        textAlign: "center",
                                        p: 2,
                                        height: 180,
                                        cursor:
                                            stat.label === "Total Blocks" || stat.label === "Total Rooms"
                                                ? "pointer"
                                                : "default",
                                        boxShadow: 3,
                                        backgroundColor:
                                            selectedCard === stat.label ? theme.palette.primary.light : "white",
                                        transition: "0.3s",
                                        "&:hover": { boxShadow: 6, transform: "scale(1.02)" },
                                    }}
                                >

                                    <CardContent>
                                        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#eca685ff" }}>
                                            {stat.value}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {stat.label}
                                        </Typography>

                                        {/* ✅ Show subLabel if exists (for Total Strength card) */}
                                        {stat.subLabel && (
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 500,
                                                    mt: 0.5,
                                                }}
                                            >
                                                {stat.subLabel}
                                            </Typography>
                                        )}

                                        {/* Icon at bottom */}
                                        {stat.icon}
                                    </CardContent>
                                </Card>

                            </Grid>
                        ))}
                    </Grid>
                </Paper>
                {/* {visibleSection === "blocks" && <BlockManagement />}
                {visibleSection === "rooms" && <RoomDetails />}
                {visibleSection === "centers" &&  <CentersDetail
                        examDate={examDate}
                        selectedTime={selectedTime}
                        selectedType={selectedType}
                />} */}
                {/* <Box sx={{ display: visibleSection === "blocks" ? "block" : "none" }}>
                    <BlockManagement />
                </Box>

                <Box sx={{ display: visibleSection === "rooms" ? "block" : "none" }}>
                    <RoomDetails />
                </Box> */}

                <Box sx={{ display: visibleSection === "centers" ? "block" : "none" }}>
                    <CentersDetail
                        examDate={examDate}
                        selectedTime={selectedTime}
                        selectedType={selectedType}
                        key={examDate?.toString() || "centers"}
                    />
                </Box>
                {/* <RoomListModal
                    open={openRoomModal}
                    onClose={() => setOpenRoomModal(false)}
                    examDate={examDate}
                    selectedTime={selectedTime}
                    selectedType={selectedType}
                /> */}
                <RoomListDetailModal
                    open={openRoomModal}
                    onClose={() => setOpenRoomModal(false)}
                    examDate={examDate}
                    selectedTime={selectedTime}
                    selectedType={selectedType}
                />

                <UMCCasesModal
                    open={openUMCModal}
                    onClose={() => setOpenUMCModal(false)}
                    examDate={examDate}
                    selectedTime={selectedTime}
                    selectedType={selectedType}

                />

            </Box>
        </>
    );
};

export default ExaminationDutyManagementDashboard;
