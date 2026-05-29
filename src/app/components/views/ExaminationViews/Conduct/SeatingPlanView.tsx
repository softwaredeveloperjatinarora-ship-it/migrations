"use client";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  IconAlertTriangleFilled,
  IconCalendar,
  IconClock,
  IconClockCode,
  IconDownload,
  IconHistoryToggle,
  IconHome,
  IconInfoHexagon,
  IconListCheck,
  IconSearch,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getseatingPlanAction } from "@/app/actions/examination/conduct/getseatingplanAction";
import { useSession } from "next-auth/react";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
 
import BlankCard from "@/app/components/shared/BlankCard";
import {
  Avatar,
  Button,
  CardContent,
  Chip,
  InputAdornment,
  TextField,
} from "@mui/material";
import { SeatingPlan } from "@/app/api/interfaces/Examination/studentseatingplaninterface";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useSelector } from "react-redux";
import { ProfileState } from "@/store/store";
import Breadcrumb from "@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
const SeatingPlanView =  () => {
   
    const profilee = useSelector((state: ProfileState) => state.profile) as {
      profileData: {
        registerationNumber: string;
        programName: string;
        studentSection: string;
        snap: string;
        name: string;
        studentEmail: any;
        fatherName:string
      }[];
    };
   

    const [state, setState] = useState<{ 
      loading: boolean; 
      success: boolean; 
      error: string | null; 
    }>({
      loading: true,
      success: false,
      error: "Just a moment! Retrieving your exam schedule...",
    });
  //for search parameter
  const [searchTerm, setSearchTerm] = useState("");
  //getting the session
  const { data: session } = useSession();
  //storing the data from API
  const [datafetched, setDatafetched] = useState<SeatingPlan[]>([]);
  const [originalData, setOriginalData] = useState<SeatingPlan[]>([]);
  //Creating the form data to send in API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const formData = new FormData();
        const res = await getseatingPlanAction();
        let splitValue = String(session?.user?.token).split("NEXT2121ANG");
        const ApiData = decryptDataforResponse(res.ApiData, splitValue[1]);
        const parsedData=JSON.parse(ApiData); // Parse the ApiData
        console.log('Responseexam' , res)
        setDatafetched(parsedData);
        setOriginalData(parsedData);
       
         if (res.status === "success" && parsedData?.length > 0) {
          setState({ loading: false, success: true, error: null });
        } else {
          setState({
            loading: false, 
            success: false,
            error: "Exam not scheduled currently. Please check back again.",
          });
        }
      } catch (error) {
        setState({
          loading: false, 
          success: false,
          error: "An error occurred while fetching the data. Please try again.",
        });
      }
    };

     fetchData();
  }, []);

  const ExamCount = (option: string) => {
    return datafetched.filter(
      (item) => item.Filters.toLocaleUpperCase() === option.toLocaleUpperCase()
    ).length;
  };

  // Handle search input change

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debugger;
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      // Restore original data when search is cleared
      setDatafetched(originalData);
    } else {
      // Filter data based on CourseCode or CourseName
      const filteredData = originalData.filter(
        (item) =>
          item.CourseCode.toLowerCase().includes(term) ||
          item.CourseName.toLowerCase().includes(term)
      );
      setDatafetched(filteredData);
    }
  };
  const studentData = {
    registrationNumber: "12015567",
    name: "Abhijeet Balyan",
    fatherName: "Rajeev Kumar Balyan",
    program: "B.P.Ed.",
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    // Title
    doc.addImage("/images/logos/lpu_logo.png", "png", 15, 10, 50, 30);
    doc.setFont("Times New Roman", "bold");
    doc.setFontSize(16);
    doc.text("Examination Hall Ticket", 80, 20);
    doc.setFontSize(10);
    doc.text("Admit Card", 98, 25);

    // Student Details
    doc.setFontSize(10);
    // Updated Student Details
    doc.text("Registration Number         :", 20, 50);
    doc.text(profilee.profileData[0]?.registerationNumber.toString(), 65, 50); // Adjusted x-coordinate for value
    doc.text("Student Name                     :", 20, 57);
    doc.text(profilee.profileData[0]?.name, 65, 57); // Adjusted x-coordinate for value
    doc.text("Father Name                       :", 20, 64);
    doc.text(profilee.profileData[0]?.fatherName, 65, 64); // Adjusted x-coordinate for value
    doc.text("Program                              :", 20, 71);
   // doc.text(profilee.profileData[0]?.programName , 65, 71); // Adjusted x-coordinate for value
   const maxWidth = 100; 
   const wrappedText = doc.splitTextToSize(profilee.profileData[0]?.programName, maxWidth);
   doc.text(wrappedText, 65, 71);
   doc.addImage(`data:image/jpg;base64,${profilee.profileData[0]?.snap}`, "jpg", 165, 42, 30, 30);
    // Draw a border (rectangle) around the image
    doc.setDrawColor(0); // Black border
    doc.setLineWidth(0.2); // Border thickness
    doc.rect(165, 42, 30, 30); // (x, y, width, height)

    // Table Headers and Data
    const tableY = 78; // Starting Y position for table
    autoTable(doc, {
      startY: tableY,
      margin: { left: 20 },
      styles: {
        fillColor: "white",
        textColor: "black",
        lineWidth: 0.1, // Border thickness
        lineColor: [0, 0, 0], // Border color (black)
        halign: "center", // Center align text
        valign: "middle", // Vertically center align
      },
      headStyles: {
        fillColor: "white", // Gray header background
        textColor: "black",
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        halign: "center", // Center align header text
        valign: "middle", // Vertically center align header text
        fontStyle: "bold", // Make header bold
      },
      bodyStyles: {
        fillColor: "white",
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        halign: "center", // Center align text in body
        valign: "middle", // Vertically center align body text
      },
      columnStyles: {}, // Keep empty if no column-specific styles needed
      head: [
        [
          "Sr. No.",
          "Course Code",
          "Exam Date",
          "Exam Timing",
          "Room No.",
          "Exam Description",
        ],
      ],
      body: originalData.map((exam, index) => [
        index + 1,
        exam.CourseCode,
        exam.ExamDate,
        exam.ExamTime,
        exam.RoomNo.includes("Link") ? "MyClass" : exam.RoomNo,
        exam.ExamTypeDesc,
      ]),
    });

    // Calculating Y position after table (you can adjust this manually if needed)
    const finalY = tableY + originalData.length * 10; // Estimate the height for now

    // Important Instructions
    doc.setFont("segoe UI", "bold");
    doc.setFontSize(11);
    doc.text("Important Instructions:", 20, finalY);
    const instructions = [
      "1. Report 30 minutes before the start of the exam.",
      "2. No student will be allowed to enter the examination center without this Admit Card/ID Card.",
      "3. No entry to the exam center after the start of the exam.",
      "4. Mobile phones or any other electronic devices are strictly prohibited.",
      "5. The examination center is not responsible for personal belongings.",
      "6. Verify the course code on the question paper before starting the exam.",
    ];
    doc.setFont("Arial", "bold");
    instructions.forEach((instruction, index) => {
      doc.text(instruction, 20, finalY + 5 + index * 5);
    });

    doc.text("Controller of Examination", 150, finalY + 50);
    doc.save(studentData.registrationNumber + "_AdmitCard.pdf");
  };
  const BCrumb = [
    {
      to: "/dashboard",
      title: "Home",
    },
    {
      title: "Upcoming Exam Schedules",
    },
  ];

  // Handle status filter change
  const handleClick = (status: string) => {};

  return (
    <>
      <Breadcrumb title="Upcoming Exam Schedules" items={BCrumb} />
      <BlankCard>
        <CardContent>
          <Box mb={2}>
            <Grid container spacing={3}>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 3,
                }}
              >
                <Box
                  bgcolor="primary.light"
                  p={3}
                  onClick={() => handleClick("All")}
                  sx={{ cursor: "pointer" }}
                >
                  <Stack direction="row" gap={2} alignItems="center">
                    <Box
                      width={38}
                      height={38}
                      bgcolor="primary.main"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography
                        color="primary.contrastText"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <IconListCheck width={22} />
                      </Typography>
                    </Box>
                    <Box>
                      <Typography>Total Exam</Typography>
                      <Typography fontWeight={500}>
                        {datafetched.length}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 3,
                }}
              >
                <Box
                  bgcolor="success.light"
                  p={3}
                  onClick={() => handleClick("Shipped")}
                  sx={{ cursor: "pointer" }}
                >
                  <Stack direction="row" gap={2} alignItems="center">
                    <Box
                      width={38}
                      height={38}
                      bgcolor="success.main"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography
                        color="primary.contrastText"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <IconHistoryToggle width={22} />
                      </Typography>
                    </Box>
                    <Box>
                      <Typography>Today's Exam</Typography>
                      <Typography fontWeight={500}>
                        {ExamCount("Today")}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 3,
                }}
              >
                <Box
                  bgcolor="warning.light"
                  p={3}
                  onClick={() => handleClick("Delivered")}
                  sx={{ cursor: "pointer" }}
                >
                  <Stack direction="row" gap={2} alignItems="center">
                    <Box
                      width={38}
                      height={38}
                      bgcolor="warning.main"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography
                        color="info.contrastText"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <IconClockCode width={22} />
                      </Typography>
                    </Box>
                    <Box>
                      <Typography>Upcoming Exam</Typography>
                      <Typography fontWeight={500}>
                        {ExamCount("Upcoming")}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 3,
                }}
              >
                <Box
                  bgcolor="#FFF3F5"
                  p={3}
                  onClick={() => handleClick("Pending")}
                  sx={{ cursor: "pointer" }}
                >
                  <Stack direction="row" gap={2} alignItems="center">
                    <Box
                      width={38}
                      height={38}
                      bgcolor="#E57575" //"error.main"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography
                        color="error.contrastText"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <IconAlertTriangleFilled width={22} />
                      </Typography>
                    </Box>
                    <Box>
                      <Typography>Not Allowed</Typography>
                      <Typography fontWeight={500}>
                        {ExamCount("Defaulter")}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Stack
            mb={2}
            justifyContent="space-between"
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <TextField
              id="search"
              type="text"
              size="small"
              variant="outlined"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconSearch size={"16"} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<IconDownload width={18} />}
                onClick={generatePDF}
                disabled={originalData.length == 0 ? true : false}
              >
                Admit Card
              </Button>
            </Box>
          </Stack>
          {datafetched &&
          typeof datafetched === "object" &&
          Object.keys(datafetched).length > 0 ? (
            <Scrollbar sx={{ height: "100vh" }}>
              <Grid container spacing={2}>
                {datafetched.map((item, index) => (
                  <Grid size={12} key={index}>
                    <Paper elevation={12} variant="outlined">
                      <Box
                        p={1}
                        sx={{
                          borderWidth: "0 0 0 7px",
                          borderStyle: "solid",
                          borderColor:
                            item.Filters === "Upcoming"
                              ? "warning.main"
                              : item.Filters === "Today"
                              ? "success.main"
                              : item.Filters === "Defaulter"
                              ? "#E57575"
                              : "primary.main",
                        }}
                      >
                        <Stack
                          direction={{
                            xs: "column",
                            sm: "column",
                            md: "row",
                          }}
                          justifyContent="space-between"
                          alignItems="center"
                          mb={0.5}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              textDecoration:
                                item.Filters == "Defaulter"
                                  ? "line-through"
                                  : "none",
                            }}
                          >
                            {item.CourseCode} - {item.CourseName}
                          </Typography>
                          <Stack
                            direction={{
                              xs: "column",
                              sm: "column",
                              md: "row",
                            }}
                            spacing={1}
                            justifyContent="flex-end"
                          >
                            {item.ExamCategory && (
                              <Chip
                                sx={{
                                  backgroundColor: "primary.light",
                                }}
                                avatar={
                                  <Avatar
                                    sx={{
                                      backgroundColor: "primary.main",
                                    }}
                                  >
                                    {item.ExamCategory.slice(0, 1)}
                                  </Avatar>
                                }
                                label={item.ExamCategory}
                              />
                            )}
                            <Chip
                              sx={{
                                backgroundColor:
                                  item.Filters === "Upcoming"
                                    ? "warning.light"
                                    : item.Filters === "Today"
                                    ? "success.light"
                                    : item.Filters === "Defaulter"
                                    ? "#FFF3F5"
                                    : "primary.light",
                              }}
                              avatar={
                                <Avatar
                                  sx={{
                                    backgroundColor: (theme) =>
                                      item.Filters === "Upcoming"
                                        ? theme.palette.warning.main
                                        : item.Filters === "Today"
                                        ? theme.palette.success.main
                                        : item.Filters === "Defaulter"
                                        ? "#E57575"
                                        : theme.palette.primary.main,
                                    color: "white",
                                  }}
                                >
                                  {item.Filters.slice(0, 1)}
                                </Avatar>
                              }
                              label={item.Filters}
                            />
                          </Stack>
                        </Stack>
                        <Stack
                          direction={{
                            xs: "column",
                            sm: "column",
                            md: "row",
                          }}
                          spacing={1.5}
                          color="textSecondary"
                          mb={0.5}
                        >
                          <IconCalendar width={18} />
                          <Typography
                            style={{ width: "150px" }}
                            variant="subtitle1"
                            fontWeight="bold"
                          >
                            {item.ExamDate}
                          </Typography>

                          <IconClock width={18} />
                          <Typography variant="subtitle1" fontWeight="bold">
                            {item.ExamTime}&nbsp;&nbsp;&nbsp;&nbsp;[
                            {item.ReportingTime}]
                          </Typography>
                        </Stack>
                        <Stack
                          direction={{
                            xs: "column",
                            sm: "column",
                            md: "row",
                          }}
                          spacing={1.5}
                          color="textSecondary"
                          mb={0.5}
                        >
                          <IconHome width={18} />
                          <Typography
                            variant="subtitle1"
                            style={{ width: "150px" }}
                          >
                            {item.RoomNo.includes("Link") ? (
                              <Link
                                href="https://myclass.lpu.in/"
                                target="_blank"
                              >
                                Online Exam Link
                              </Link>
                            ) : item.RoomNo.trim() !== "" ? (
                              item.RoomNo
                            ) : (
                              "Awaited"
                            )}
                          </Typography>
                          <IconInfoHexagon width={18} />
                          <Typography variant="subtitle1">
                            {item.ExamTypeDesc + " - " + item.PaperType}
                          </Typography>
                        </Stack>

                        <Stack
                          direction={{
                            xs: "column",
                            sm: "column",
                            md: "row",
                          }}
                          spacing={1}
                          color="textSecondary"
                          mb={0.5}
                        >
                          <IconInfoHexagon width={18} />
                          <Typography variant="subtitle1">
                            {item.Instructions &&
                            item.Instructions.trim() !== ""
                              ? item.Instructions
                              : "Instruction Awaited"}
                          </Typography>
                        </Stack>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Scrollbar>
          ) : null}
          {(state.loading || state.error) && (
            <Grid size={12}>
              <Paper elevation={9} variant="outlined">
                <Box
                  p={1}
                  sx={{
                    borderWidth: "0 0 0 5px",
                    borderStyle: "solid",
                    borderColor: "primary.main",
                  }}
                >
                  <Typography
                    variant="h6"
                    mt={3}
                    mb={3}
                    align="center"
                    fontWeight="bold"
                    fontSize="25px"
                    color="textSecondary"
                  >
                    {state.loading
                      ? "Just a moment! Retrieving your exam schedule..."
                      : state.error}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          )}
        </CardContent>
      </BlankCard>
    </>
  );
};

export default SeatingPlanView;
