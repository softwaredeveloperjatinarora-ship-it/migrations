import React from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { IconClock, IconDotsVertical, IconDownload } from "@tabler/icons-react";
import Modal from "@mui/material/Modal";
import { useEffect, useRef, useState } from "react";
import { Button, useMediaQuery, useTheme } from "@mui/material";
import {

    IconX,

} from "@tabler/icons-react";
import jsPDF from 'jspdf';
import html2canvas from "html2canvas";

export interface TimeTable {
    rowNum: string;
    blinking: string;
    termId: string;
    attendanceDay: string;
    dprTime: string;
    classinMinutes: string;
    startTime: string;
    endTime: string;
    hrs: string;
    minutes: string;
    details: any;
    clashStatus: string;
    roomNumber: string;
    section: string;
    courseCode: string;
    attendanceType: string;
    apiData: any
}

const Daily = ({ apiData }: any) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [details, setDetails] = React.useState<{ Details: any } | null>(null);
    const [multiplier, setMultiplier] = React.useState(window.innerWidth < 1024 ? 3.9 : 7);
    const [value, setValue] = React.useState("");





    const sortTimeTable = (timeTable: TimeTable[]) => {
        const daysOrder = ["mon", "tue", "wed", "thu", "fri", "sat"];
        return timeTable.sort((a, b) => {
            const dayA = a.attendanceDay.toLocaleLowerCase();
            const dayB = b.attendanceDay.toLocaleLowerCase();
            if (dayA === dayB) {
                return a.startTime.localeCompare(b.startTime);
            }
            return daysOrder.indexOf(dayA) - daysOrder.indexOf(dayB);
        });
    };



    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 600) setMultiplier(7.2);
            else if (window.innerWidth < 1024) setMultiplier(7);
            else setMultiplier(7.2);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);



    const handleOpen = () => {
        setOpen(true); // Open the modal
    };

    const handleClose = () => {
        setOpen(false); // Close the modal
        setDetails(null); // Reset the details when closing the modal
    };




    const calculateMarginBottom = (start: string, end: string, courseCode?: string) => {
        try {
            const [startHour, startMin] = start.split(':').map(Number);
            const [endHour, endMin] = end.split(':').map(Number);
            const totalStartMinutes = startHour * 60 + startMin;
            const totalLastMinutes = endHour * 60 + endMin;
            const diffMinutes = Math.abs(totalStartMinutes - totalLastMinutes);

            if (courseCode) {
                let courseCodeLength = courseCode.split(',').length;
                if (courseCodeLength > 1) {
                    return (((((diffMinutes / 60)) * 2) - 1.25) * multiplier) - courseCodeLength - 0.2;
                }
            }
            return (((((diffMinutes / 60)) * 2) - 1.25) * multiplier);
        } catch (error) {
            //   console.log("Error calculating margin bottom:");
            return "Dear Student, Your Timetable Will be available Shortly";
        }
    };



    const calculateMarginTop = (start: string, last: string) => {
        try {
            if (!dprTime || dprTime.length === 0) {
                throw new Error("dprTime is undefined or empty.");
            }

            last = dprTime[0];

            const [startHour, startMin] = start.split(':').map(Number);
            const [lastHour, lastMin] = last.split(':').map(Number);

            const totalStartMinutes = startHour * 60 + startMin;
            const totalLastMinutes = lastHour * 60 + lastMin;
            const diffMinutes = totalStartMinutes - totalLastMinutes;

            return Math.abs((diffMinutes / 30) * multiplier);
        } catch (error) {
            //   console.log("Error calculating margin top:");
            return "Dear Student, Your Timetable Will be available Shortly";
        }
    };


    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const styleForModal = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        border: '0px',
        bgcolor: 'background.paper',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
    };





    const theme = useTheme();


    const currentDay = new Date()
        .toLocaleString("en-us", { weekday: "short" })
        .toLowerCase(); // Get current day



    const [allData, setAllData] = useState<any[]>(apiData);


    useEffect(() => {
        if (allData.length > 0) {
            // console.log("allData123", allData)
            const startTimes = allData?.[0]?.Day.map((time: any) => time.StartTime);
            const endTimes = allData?.[0]?.Day.map((time: any) => time.EndTime);
            const minStartTime = startTimes.reduce((min: number, time: number) => time < min ? time : min, startTimes[0]);
            const maxEndTime = endTimes.reduce((max: number, time: number) => time > max ? time : max, endTimes[0]);
            setDPRTimeRange(`${minStartTime}-${maxEndTime}`)
        }
    }, [allData])


    const [DPRtimeRange, setDPRTimeRange] = React.useState<string>()
    // console.log("dpr time range",DPRtimeRange)


    const dprTimeArray = (selectedDay?: string, timeRange?: string) => {
        try {
            let dayTimes: any[] = [];

            if (selectedDay) {
                dayTimes = allData.flatMap(item =>
                    item.Day.filter(
                        (time: any) =>
                            time.AttendanceDay.toLocaleLowerCase() ===
                            selectedDay.toLocaleLowerCase()
                    )
                );
            } else if (timeRange) {
                const [startRange, endRange] = timeRange.split('-').map(time => time.trim());
                dayTimes = allData.flatMap(item =>
                    item.Day.filter(
                        (time: any) => time.StartTime >= startRange && time.EndTime <= endRange
                    )
                );
            } else {
                dayTimes = allData.flatMap(item => item.Day);
            }

            if (dayTimes.length === 0) return [];

            const startTimes = dayTimes.map(time => time.StartTime);
            const endTimes = dayTimes.map(time => time.EndTime);

            const minStartTime = startTimes.reduce(
                (min, time) => (time < min ? time : min),
                startTimes[0]
            );
            const maxEndTime = endTimes.reduce(
                (max, time) => (time > max ? time : max),
                endTimes[0]
            );

            const [startHour, startMin] = minStartTime.split(':').map(Number);
            const [endHour, endMin] = maxEndTime.split(':').map(Number);

            const times: string[] = [];

            for (let i = startHour; i <= endHour; i++) {
                times.push(`${i}:00`);
                if (!(i === endHour && endMin === 0)) {
                    times.push(`${i}:30`);
                }
            }

            return times;
        } catch (error) {



            return [];
        }
    };

    const dprTime = window.innerWidth >= 1024 ? dprTimeArray(undefined, DPRtimeRange) : dprTimeArray(value);



    const [showEmptyTab, setShowEmptyTab] = React.useState(true);



    React.useEffect(() => {
        if (allData?.[0]?.Day.length > 0) {
            // const today = new Date();
            const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
            const today = days[new Date().getDay()];
            // const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
            // console.log(today);
            if (allData?.[0]?.Day.some((time: any) => time.AttendanceDay.toLowerCase() === today)) { setValue(today.toLowerCase()) }
            else {
                if (window.innerWidth < 1024) {
                    setValue(allData?.[0]?.Day[0].AttendanceDay.toLowerCase());
                }

            }
            if (window.innerWidth < 1024) {
                setShowEmptyTab(false)


            }

        }
    }, [allData])
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



    const tableRef = useRef<HTMLDivElement>(null);

    const exportToPdf = async () => {
        if (!tableRef.current) {
            alert("Table not found!");
            return;
        }

        // Store original styles and layout
        const originalStyles = {
            position: tableRef.current.style.position,
            overflow: tableRef.current.style.overflow,
            width: tableRef.current.style.width,
            height: tableRef.current.style.height,
        };

        // Force desktop layout for PDF export regardless of device
        const originalViewport = document.querySelector('meta[name="viewport"]');
        if (originalViewport) {
            originalViewport.setAttribute('content', 'width=1200');
        }

        // Temporarily modify styles for PDF capture
        tableRef.current.style.position = 'absolute';
        tableRef.current.style.overflow = 'visible';
        tableRef.current.style.width = '1200px'; // Fixed width for consistent PDF
        tableRef.current.style.height = 'auto';

        // Apply desktop styles specifically for PDF export
        const tabPanels = tableRef.current.querySelectorAll('.MuiTabPanel-root');
        tabPanels.forEach((panel: any) => {
            panel.style.padding = '24px 0 0';
        });


        // Force desktop layout in tabs
        const tabs = tableRef.current.querySelectorAll('.MuiTab-root');
        tabs.forEach((tab: any) => {
            tab.style.pointerEvents = 'auto'; // Disable tab switching in PDF
        });

        // Calculate the total height needed
        const totalHeight = tableRef.current.scrollHeight;

        // Create a canvas with the full height
        const canvas = await html2canvas(tableRef.current, {
            scale: 2,
            height: totalHeight,
            width: 1200, // Fixed width matching our forced desktop view
            scrollY: 0,
            scrollX: 0,
            windowHeight: totalHeight,
            useCORS: true,
            allowTaint: true,
        });

        // Restore original styles and layout
        Object.assign(tableRef.current.style, originalStyles);
        if (originalViewport) {
            originalViewport.setAttribute('content', 'width=device-width, initial-scale=1');
        }


        tabs.forEach((tab: any) => {
            tab.style.pointerEvents = '';
        });

        // Create PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Calculate image dimensions with margins
        const margin = 10; // 10mm margin on each side
        const imgWidth = pdfWidth - (margin * 2);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Split image across pages if needed
        let position = 0;
        while (position < imgHeight) {
            if (position > 0) {
                pdf.addPage();
            }
            pdf.addImage(
                canvas.toDataURL('image/png'),
                'PNG',
                margin,
                margin - position,
                imgWidth,
                imgHeight
            );
            position += pdfHeight - (margin * 2); // Account for margins
        }

        pdf.save('DailyTimetable.pdf');
    };


    if (allData?.[0]?.Day[0].AttendanceDay == "NA") return (<Typography variant="h6" sx={{ textAlign: "center", mb: { lg: 10 }, mt: { lg: "20%" } }}>
       

 <Box
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    py: 6,
    px: 4,
    textAlign: "center",
    // border: "2px dashed #ccc",
    // borderRadius: 4,
    // bgcolor: "#fefefe",
    // mt: 4,
  }}
>


  <Typography variant="h6" fontWeight="bold" color="text.primary">
    No Timetable Found
  </Typography>
  <Typography variant="body2" color="text.secondary" mt={1} mb={2}>
    It looks like your class schedule hasn't been uploaded yet.
  </Typography>

 
</Box>


    </Typography>);

    // console.log("time",allData?.[0]?.Day )



    return (
        <Box>
            
            <IconButton color="primary" sx={{
                py: 0.5,
                fontSize: '0.75rem',
                whiteSpace: 'nowrap',
                 marginBottom: 2,
                    position: "absolute",
                    top: {lg:10,xs:80},
                    right:{lg:20,xs:10},
            }}>
                <IconDownload width={22}  onClick={exportToPdf} />
            </IconButton>

            <Box ref={tableRef} id="dataTable" sx={{
                position: 'relative',
                overflow: 'visible',
                width: '100%',
                '@media print': {
                    '& *': {
                        visibility: 'visible',
                    },
                }
            }}>
                <TabContext value={value} >


                    <Box sx={{ borderBottom: 1, borderColor: "divider", position: "sticky", top: 0, zIndex: 1, backgroundColor: 'background.paper' }} ml={5} >

                        <TabList
                            onChange={handleChange}
                            aria-label="lab API tabs example"
                            variant={window.innerWidth < 1024 ? "scrollable" : "fullWidth"}
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                            TabIndicatorProps={{ style: { display: window.innerWidth > 1024 ? "none" : "block" } }}
                        >

                            {Array.from(new Set(allData?.[0]?.Day.map((time: any) =>
                                time.AttendanceDay.toLocaleLowerCase())))
                                .filter((day: any) => ["mon", "tue", "wed", "thu", "fri", "sat"]
                                    .includes(day))
                                .sort((a: any, b: any) => ["mon", "tue", "wed", "thu", "fri", "sat"]
                                    .indexOf(a) - ["mon", "tue", "wed", "thu", "fri", "sat"].indexOf(b)
                                )
                                .map((day: any) =>
                                (
                                    <Tab
                                        key={day.toLowerCase()}
                                        label={day.charAt(0).toUpperCase() + day.slice(1)}
                                        value={day}
                                        sx={{ pointerEvents: `${window.innerWidth > 1024 ? "none" : "auto"}`, }}
                                    />
                                ))}
                            {showEmptyTab &&
                                <Tab key="" label="" value="" sx={{ visibility: "hidden", height: 0, minHeight: 0, padding: 0, position: "absolute", }} />
                            }
                        </TabList>
                    </Box>




                    <TabPanel
                        value={value}
                        sx={{
                            "&.MuiTabPanel-root": {
                                padding: "24px 0 0",
                            },
                        }}

                    >

                        {/* <Scrollbar sx={{ height: "100%" }}> */}
                        <Grid container >
                            <Grid textAlign="left" size={0.7}  >
                                <Stack direction="column" spacing={4} color="gray">
                                    {dprTime.map((time, idx) => (
                                        <Typography variant="subtitle1" key={idx} m={0}>{time}</Typography>
                                    ))}
                                </Stack>
                            </Grid>
                            <Box sx={window.innerWidth >= 1024 ? { display: 'flex', justifyContent: 'space-around', width: '96%', position: 'absolute', '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none', msOverflowStyle: 'none', marginLeft: '2.5rem' } : {}}>

                                {window.innerWidth >= 1024 ? (
                                    Array.from(
                                        new Set(
                                            allData?.flatMap((item) => item.Day.map((time: any) => time.AttendanceDay.toLocaleLowerCase()))
                                        )
                                    )
                                        .filter(day => ["mon", "tue", "wed", "thu", "fri", "sat"].includes(day))
                                        .sort((a, b) => {
                                            // Sort the days in the order you want: mon, tue, wed, thu, fri, sat
                                            const order = ["mon", "tue", "wed", "thu", "fri", "sat"];
                                            return order.indexOf(a) - order.indexOf(b);
                                        })
                                        .map(day => (
                                            <Grid size={1.7} ml={2} key={day.toLowerCase()} sx={{ outline: 'none' }}>
                                                <Box mb={4}>
                                                    {allData?.flatMap((item) => item.Day.map((time: any, idx: any) => (
                                                        time.AttendanceDay.toLocaleLowerCase()) === day && (
                                                            <Paper elevation={9} sx={{ mt: idx > 0 && allData[0].Day[idx - 1].AttendanceDay === time.AttendanceDay ? calculateMarginTop(time.StartTime, allData[0].Day[idx - 1].EndTime) : calculateMarginTop(time.StartTime, '9:00'), position: 'absolute', width: '10rem', cursor: "pointer" }} key={idx} onClick={() => {
                                                                setDetails(time);
                                                                handleOpen();
                                                            }}>
                                                                <Box
                                                                    p={2}

                                                                    sx={{
                                                                        borderWidth: "0 0 0 5px",
                                                                        borderStyle: "solid",
                                                                        // borderColor: time.Blinking ? "orange" : "primary.main",
                                                                        borderColor: time.blinking === "blinking" ? "error.main" :
                                                                            (new Date().toLocaleString("en-us", { weekday: "short" }).toLowerCase() === time.AttendanceDay.toLowerCase()) ?
                                                                                "success.main" : "primary.main",
                                                                    }}
                                                                >
                                                                    <Typography variant="h6">{time.CourseCode}</Typography>
                                                                    <Stack
                                                                        direction="row"
                                                                        spacing={1}
                                                                        color="textSecondary"
                                                                        mb={calculateMarginBottom(time.StartTime, time.EndTime, time.CourseCode)}
                                                                    >
                                                                        <IconClock width={18} />
                                                                        <Typography variant="subtitle1">
                                                                            {time.StartTime} - {time.EndTime}
                                                                        </Typography>
                                                                    </Stack>
                                                                </Box>
                                                            </Paper>
                                                        )
                                                    ))}
                                                </Box>
                                            </Grid>
                                        ))
                                ) : ( // For mobile

                                    <Grid size={9} ml={4} position={"relative"}>
                                        {allData?.[0]?.Day.map((time: any, idx: any) => (
                                            time.AttendanceDay.toLocaleLowerCase()) === value.toLocaleLowerCase() && (

                                                <Paper elevation={9} sx={{ mt: idx > 0 && allData[0].Day[idx - 1].AttendanceDay === time.AttendanceDay ? calculateMarginTop(time.StartTime, allData[0].Day[idx - 1].EndTime) : calculateMarginTop(time.StartTime, time.StartTime), position: 'absolute', width: '15rem', cursor: "pointer" }} key={idx} onClick={() => {
                                                    setDetails(time);
                                                    handleOpen();
                                                }}>
                                                    <Box
                                                        p={2}
                                                        sx={{
                                                            borderWidth: "0 0 0 5px",
                                                            borderStyle: "solid",
                                                            // borderColor: time.Blinking ? "orange" : "primary.main",
                                                            borderColor: time.blinking === "blinking" ? "error.main" :
                                                                (new Date().toLocaleString("en-us", { weekday: "short" }).toLowerCase() === time.AttendanceDay.toLowerCase()) ?
                                                                    "success.main" : "primary.main",
                                                        }}
                                                    >
                                                        <Typography variant="h6">{time.CourseCode}</Typography>
                                                        <Stack
                                                            direction="row"
                                                            spacing={1}
                                                            color="textSecondary"
                                                            mb={calculateMarginBottom(time.StartTime, time.EndTime)}
                                                        >
                                                            <IconClock width={18} />
                                                            <Typography variant="subtitle1">
                                                                {time.StartTime} - {time.EndTime}
                                                            </Typography>
                                                        </Stack>
                                                    </Box>
                                                </Paper>
                                            )
                                        )}
                                    </Grid>
                                )}
                            </Box>
                        </Grid>
                        {/* </Scrollbar> */}
                    </TabPanel>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="parent-modal-title"
                        aria-describedby="parent-modal-description"
                    >
                        <Box sx={{ ...styleForModal, width: 400, outline: 'none' }}>
                            <Typography variant="h5" id="parent-modal-title">Details</Typography>

                            {details ? (
                                <>


                                    <Typography variant="h6" sx={{ fontSize: 12 }}>
                                        {typeof details?.Details === "string" &&
                                            Object.entries(parseCourseInfo(details?.Details))
                                                .map(([key, value]) => `${key}: ${value}`)
                                                .join(" | ")}
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant="body2">No details available</Typography>
                            )}

                            <IconButton
                                aria-label="close"
                                onClick={handleClose}
                                sx={(theme) => ({
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: theme.palette.grey[500],
                                })}
                            >
                                <IconX size={24} />

                            </IconButton>
                        </Box>
                    </Modal>

                </TabContext>
            </Box>
        </Box>
    );
};


export default Daily;









