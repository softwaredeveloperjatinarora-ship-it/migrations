"use client";
import PageContainer from "@/app/components/container/PageContainer";
import React, { useState } from "react";
import ExamTabs from "./ExamTabs";
import {
  Stack,
  CardContent,
  Chip,
  Grid,
  Box,
  Typography,
  Divider,
  Card,
  CardMedia,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import BlankCard from "@/app/components/shared/BlankCard";
import { Add, Check } from "@mui/icons-material";
import { CalendarToday } from "@mui/icons-material";
import { Course } from "./StuReEvaluationRegisteration";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import ExamFeeCart from "./Cart/ExamFeeCart";
import ExamFeeSideBar from "./Cart/ExamFeeSideBar";

const StuReAppearRegistertion = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  // Set the first filter option as default
  const [selectedFilter, setSelectedFilter] = useState("Re-Appear");

  // Function to toggle selected courses
  const handleToggleCourse = (course: Course, checked: boolean) => {
    setSelectedCourses(
      (prevCourses) =>
        checked
          ? [...prevCourses, course] // Add course if selected
          : prevCourses.filter((c) => c.name !== course.name) // Remove if deselected
    );
  };

  const ExamFilter = [
    { option: "Re-Appear" },
    { option: "Improvement" },
    { option: "Result Awaited" },
  ];
  const note =
    "1.Student applying for reappear are advised to apply early so as to avoid last minute rush. The Students should note that they themselves shall be responsible in case of any network related problem.\n2. In case fee is deducted from their account and is not updated in their UMS login in the next 24 hours they must report the issue at 32-102.";
  const courseRecords = [
    {
      courseCode: "MLT127",
      courseName: "MLT127 :: BASIC BIOCHEMISTRY",
      examType: "Re-Appear",
      examCategory: "Theory",
      fee: 750.0,
      status: "Submitted",
      paid: true,
      examDates: ["06 Apr 2025", "08 Apr 2025", "10 Apr 2025"],
      lastDate: "15 Apr 2025",
    },
    {
      courseCode: "CHE110",
      courseName: "CHE110 :: ENVIRONMENTAL STUDIES",
      examType: "Improvement",
      examCategory: "Theory",
      fee: 750.0,
      status: null,
      paid: false,
      examDates: ["02 Apr 2025", "05 Apr 2025"],
      lastDate: "12 Apr 2025",
    },
    {
      courseCode: "MLT111",
      courseName: "MLT111 :: HUMAN ANATOMY AND PHYSIOLOGY",
      examType: "Re-Appear",
      examCategory: "Theory",
      fee: 750.0,
      status: null,
      paid: false,
      examDates: ["01 Apr 2025", "03 Apr 2025"],
      lastDate: "10 Apr 2025",
    },
    {
      courseCode: "MLT111",
      courseName: "MLT112 :: HUMAN ANATOMY",
      examType: "Re-Appear",
      examCategory: "Theory",
      fee: 750.0,
      status: null,
      paid: false,
      examDates: ["01 Apr 2025", "03 Apr 2025"],
      lastDate: "10 Apr 2025",
    },
    {
      courseCode: "MLT122",
      courseName: "MLT122 :: BASIC FUNDAMENTALS OF HAEMATOLOGY",
      examType: "Improvement",
      examCategory: "Theory",
      fee: 750.0,
      status: "Result Awaited",
      paid: false,
      examDates: ["09 Apr 2025", "12 Apr 2025"],
      lastDate: "18 Apr 2025",
    },
    {
      courseCode: "MLT124",
      courseName: "MLT124 :: GENERAL MICROBIOLOGY",
      examType: "Re-Appear",
      examCategory: "Theory",
      fee: 750.0,
      status: "Result Awaited",
      paid: false,
      examDates: ["15 Apr 2025", "18 Apr 2025"],
      lastDate: "22 Apr 2025",
    },
    {
      courseCode: "MLT123",
      courseName: "MLT123 :: BASIC FUNDAMENTALS OF HAEMATOLOGY LABORATORY",
      examType: "Improvement",
      examCategory: "Practical",
      fee: 750.0,
      status: null,
      paid: false,
      examDates: ["11 Apr 2025", "14 Apr 2025"],
      lastDate: "20 Apr 2025",
    },
    {
      courseCode: "MLT125",
      courseName: "MLT125 :: GENERAL MICROBIOLOGY LABORATORY",
      examType: "Re-Appear",
      examCategory: "Practical",
      fee: 750.0,
      status: "Result Awaited",
      paid: false,
      examDates: ["20 Apr 2025", "22 Apr 2025"],
      lastDate: "28 Apr 2025",
    },
    {
      courseCode: "MLT128",
      courseName: "MLT128 :: GENERAL MICROBIOLOGY LABORATORY",
      examType: "Re-Appear",
      examCategory: "Practical",
      fee: 750.0,
      status: "Result Awaited",
      paid: false,
      examDates: ["20 Apr 2025", "22 Apr 2025"],
      lastDate: "28 Apr 2025",
    },
    {
      courseCode: "MLT128",
      courseName: "MLT128 :: BASIC BIOCHEMISTRY LABORATORY",
      examType: "Result Awaited",
      examCategory: "Practical",
      fee: 750.0,
      status: "Result Awaited",
      paid: false,
      examDates: ["25 Apr 2025", "28 Apr 2025"],
      lastDate: "30 Apr 2025",
    },
  ];

  // Filter courses based on selected filter
  const filteredCourses = courseRecords.filter(
    (course) => course.examType === selectedFilter
  );

  return (
    <PageContainer title="Exam Registartion" description="Exam Registartion">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <ExamTabs />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Stack
            direction="row"
            spacing={{ xs: 1, sm: 1, md: 0.5 }}
            alignItems="left"
            justifyContent="left"
            sx={{
              p: { xs: 1, sm: 1, md: 2 },
              bgcolor: "background.paper",
              borderRadius: "12px",
              boxShadow: 2,
              flexWrap: "wrap",
              width: "100%",
              gap: { xs: 1, sm: 2 },
            }}
          >
            {ExamFilter.map((item, index) => (
              <Chip
                key={index}
                label={item.option}
                variant="filled"
                sx={{
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                  fontWeight: "bold",
                  minWidth: { xs: 45, sm: 70 },
                  px: { xs: 1, sm: 2 },
                  bgcolor:
                    selectedFilter === item.option
                      ? (theme) => theme.palette.primary.main
                      : (theme) => theme.palette.secondary.light,
                  color:
                    selectedFilter === item.option
                      ? "white"
                      : (theme) => theme.palette.secondary.main,
                  flexShrink: 0,
                }}
                onClick={() => setSelectedFilter(item.option)}
              />
            ))}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 12, sm: 12 }}>
          <BlankCard>
            <CardContent sx={{ padding: 2 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">{selectedFilter}</Typography>
              </Box>
              <Divider sx={{ mt: "1%" }} />
              <Stack
                direction={{ xs: "column", sm: "column", md: "row" }}
                mt={1}
                sx={{
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                  alignItems: "stretch",
                  gap: 1.5,
                }}
              >
                {filteredCourses.map((course, i) => (
                  <Card
                    key={i}
                    sx={{
                      width: 230,
                      padding: 1,
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      flexShrink: 0,
                      minHeight: "100%",
                    }}
                  >
                    {/* Price Badge */}
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: "bold",
                        color: "primary.main",
                        backgroundColor: "primary.light",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        width: "fit-content",
                        marginBottom: 1,
                      }}
                    >
                      📖 {course.examCategory}
                    </Typography>

                    {/* Product Image */}
                    <CardMedia
                      component="img"
                      height="80"
                      image="/images/backgrounds/undraw_notebook_8ihb.svg"
                      alt="Product Image"
                      sx={{
                        objectFit: "contain",
                        marginBottom: 1,
                      }}
                    />

                    <CardContent
                      sx={{ padding: "4px", textAlign: "left", flexGrow: 1 }}
                    >
                      {/* Course Title */}

                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 3,
                          minHeight: "60px",
                        }}
                      >
                        {course.courseName}
                      </Typography>
                      {/* Exam Date Section */}
                      <Box
                        display="flex"
                        alignItems="center"
                        sx={{
                          backgroundColor: "#f3f4f6",
                          borderRadius: "8px",
                          padding: "4px",
                          mt: 1,
                        }}
                      >
                        <CalendarToday
                          sx={{ fontSize: 14, color: "gray", mr: 1 }}
                        />
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color="text.secondary"
                          fontSize={11}
                          sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "nowrap" }}
                        >
                          Exam Date:{" "}
                          <span>
                          <Select
                            sx={{
                              height: "24px",     
                              fontSize: "10px",  
                              minWidth: "90px",   
                              flexShrink: 0,  
                              backgroundColor: "white",
                            }}
                          >
                            {course.examDates.map((date, i) => (
                              <MenuItem key={i} value={date}>
                                {date}
                              </MenuItem>
                            ))}
                          </Select>
                          </span>
                        </Typography>
                      </Box>

                      {/* Last  Date Section */}
                      <Box
                        display="flex"
                        sx={{
                          backgroundColor: "#f3f4f6",
                          borderRadius: "8px",
                          padding: "4px",
                          mt: 1,
                        }}
                      >
                        <CalendarToday
                          sx={{ fontSize: 14, color: "gray", mr: 1 }}
                        />
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color="text.secondary"
                          fontSize={11}
                        >
                          Due Date:{" "}
                          <span style={{ color: "red" }}>
                            {course.lastDate}
                          </span>
                        </Typography>
                      </Box>
                    </CardContent>

                    {/* Price & Add Button - Aligned Properly */}
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      padding="8px"
                    >
                      {/* Price */}
                      <Typography variant="body1" fontWeight="bold">
                        ₹{course.fee}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: selectedCourses.some(
                            (courses) => courses.name === course.courseName
                          )
                            ? "error.main"
                            : "primary.main",
                          color: "white",
                          borderRadius: "5px",
                          minWidth: "40px",
                          height: "32px",
                        }}
                        onClick={() =>
                          handleToggleCourse(
                            { name: course.courseName, price: "₹750.00" },
                            !selectedCourses.some(
                              (courses) => courses.name === course.courseName
                            )
                          )
                        }
                      >
                        {selectedCourses.some(
                          (courses) => courses.name === course.courseName
                        ) ? (
                          <Check fontSize="small" />
                        ) : (
                          <Add fontSize="small" />
                        )}
                      </Button>
                    </Box>
                  </Card>
                ))}
              </Stack>
              <Divider sx={{ mt: "1%" }} />
              <footer
                style={{
                  marginTop: "8px",
                  fontWeight: "bold",
                  textAlign: "justify",
                  textJustify: "inter-word",
                  whiteSpace: "pre-line",
                }}
              >
                {note}
              </footer>
            </CardContent>
          </BlankCard>
        </Grid>
        <Grid size={{ sm: 12 }}>
          <ExamFeeCart
            items={selectedCourses}
            onOpenSidebar={() => {
              setIsSidebarOpen(true);
            }}
          />
        </Grid>
      </Grid>
      <ExamFeeSideBar
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </PageContainer>
  );
};

export default StuReAppearRegistertion;
