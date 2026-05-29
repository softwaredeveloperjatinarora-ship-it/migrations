"use client";
import PageContainer from "@/app/components/container/PageContainer";
import {
  Button,
  Card,
  CardMedia,
  Chip,
  Divider,
  Grid,
  Stack,
} from "@mui/material";
import React, { useState } from "react";
import ExamTabs from "./ExamTabs";
import { CardContent, Typography, Box } from "@mui/material";
import BlankCard from "@/app/components/shared/BlankCard";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";
import { IconCertificate2 } from "@tabler/icons-react";
import ExamFeeCart from "./Cart/ExamFeeCart";
import ExamFeeSideBar from "./Cart/ExamFeeSideBar";
import { CalendarToday } from "@mui/icons-material";
import { Add, Check } from "@mui/icons-material";

export interface Course {
  name: string;
  price: string;
}

const StuReEvaluationRegisteration = () => {
  //Side bar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  //Cart State and function
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const handleToggleCourse = (course: Course, checked: boolean) => {
    setSelectedCourses(
      (prevCourses) =>
        checked
          ? [...prevCourses, course] // Add course if switch is ON
          : prevCourses.filter((c) => c.name !== course.name) // Remove if switch is OFF
    );
  };

  //Color
  const theme = useTheme();
  const customizer = useSelector((state: AppState) => state.customizer);
  const borderColor = theme.palette.divider;
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;
  const error = theme.palette.error.main;
  const errorlight = theme.palette.error.light;
  const warning = theme.palette.warning.main;
  const warninglight = theme.palette.warning.light;
  const secondary = theme.palette.secondary.main;
  const secondarylight = theme.palette.secondary.light;
  const stats = [
    {
      title: "CHE110 :: ENVIRONMENTAL STUDIES",
      subtitle: "8",
      time: "A",
      color: primary,
      lightcolor: primarylight,
      icon: <IconCertificate2 width={20} />,
    },
    {
      title: "CHE120 :: ENVIRONMENTAL STUDIES",
      subtitle: "1",
      time: "B",
      color: secondary,
      lightcolor: secondarylight,
      icon: <IconCertificate2 width={20} />,
    },
    {
      title: "	HRMM504 :: ORGANIZATION BEHAVIOUR AND HUMAN RESOURCE DYNAMICS-II",
      subtitle: "3",
      time: "C",
      color: warning,
      lightcolor: warninglight,
      icon: <IconCertificate2 width={20} />,
    },
    {
      title: "CHE130 :: ENVIRONMENTAL STUDIES",
      subtitle: "4",
      time: "D",
      color: error,
      lightcolor: errorlight,
      icon: <IconCertificate2 width={20} />,
    },
    {
      title: "CHE134 :: ENVIRONMENTAL STUDIES",
      subtitle: "4",
      time: "D",
      color: error,
      lightcolor: errorlight,
      icon: <IconCertificate2 width={20} />,
    },
  ];
  const note =
    "I agree that if the marks decrease in any course code after re-evaluation process, then the decreased marks may be considered and accordingly re-grading may be carried out.";
  return (
    <PageContainer title="Exam Registartion" description="Exam Registartion">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <ExamTabs />
        </Grid>
        <Grid size={{ xs: 12, md: 12, sm: 12 }}>
          <BlankCard>
            <CardContent sx={{ padding: 2 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">Re-Rvalution Registration</Typography>
                <Chip
                  label="524252"
                  sx={{
                    bgcolor: "primary.light",
                    color: "primary.main",
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                    padding: "4px 8px",
                    borderRadius: "12px",
                  }}
                />
              </Box>
              <Divider sx={{ mt: "1%" }} />
              <Stack
                direction={{xs:'column',sm:'column',md:'row'}}
               
                spacing={2}
                mt={1}
              >
                {stats.map((stat, i) => (
                  <Card
                    key={i}
                    sx={{
                      maxWidth: 230,
                      padding: 1,
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
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
                      📖 Theory
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
                        {stat.title}
                      </Typography>

                      {/* Unique Date Section */}
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
                          <span style={{ color: "red" }}>25-Mar-2025</span>
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
                        ₹750
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: selectedCourses.some(
                            (course) => course.name === stat.title
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
                            { name: stat.title, price: "₹750.00" },
                            !selectedCourses.some(
                              (course) => course.name === stat.title
                            )
                          )
                        }
                      >
                        {selectedCourses.some(
                          (course) => course.name === stat.title
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

export default StuReEvaluationRegisteration;
