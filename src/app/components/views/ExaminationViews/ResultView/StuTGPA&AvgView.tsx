"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CircularProgress } from "@mui/material";
import BlankCard from "@/app/components/shared/BlankCard";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Box, Stack } from "@mui/system";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import { useSelector } from "react-redux";
import { AppState, ProfileState } from "@/store/store";
import { IconReport } from "@tabler/icons-react";
import ResultTabs from "./ResultTabs";
import PageContainer from "@/app/components/container/PageContainer";
import {
  StudentComponentWiseMarks,
  StudentDefaulterStatus,
  StudentGradeCount,
  StudentTGPASummary,
} from "@/app/api/interfaces/Examination/stutgpasummary";
import { getStudentTgpaAction } from "@/app/actions/examination/student result/getstutgpasummaryAction";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import { useSession } from "next-auth/react";
import { getStudentGradeCountAction } from "@/app/actions/examination/student result/getstudentgardecountAction";
import { getStudentComponentWisePercentageAction } from "@/app/actions/examination/student result/getstudentcomponentwisperAction";
import { getStudentDefaulterStatusAction } from "@/app/actions/examination/student result/getstudentdefaulterstatusAction";
import StudentDefaulter from "./StudentDefaulter";
const StuTGPAView = () => {
  //Storing the data with useState
  const [tgpa, setTgpa] = useState<StudentTGPASummary[]>([]);
  const [grade, setGrade] = useState<StudentGradeCount[]>([]);
  const [studentmarks, setStudentMarks] = useState<StudentComponentWiseMarks[]>(
    []
  );
  const [studentDefaulter, setStudentDefaulter] = useState<
    StudentDefaulterStatus[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const third = theme.palette.success.main;
  const fourth = theme.palette.warning.main;
  const borderColor = theme.palette.divider;
  const profilee = useSelector((state: ProfileState) => state.profile) as {
    profileData: {
      cgpa: string;
      gender: string;
    }[];
  };
  console.log(profilee);

  useEffect(() => {
    const fetchStudentDefaulterStatus = async () => {
      try {
        setLoading(true);
        const res = await getStudentDefaulterStatusAction(
        );
        let splitValue = String(session?.user?.token).split("NEXT2121ANG");
        const decData = decryptDataforResponse(res.ApiData, splitValue[1]);
        const parsedData = JSON.parse(decData);
        if (parsedData && Array.isArray(parsedData) && parsedData.length > 0) {
          setStudentDefaulter(parsedData);
        } else {
          fetchData();
          fetchGradeCount();
          fetchComponentWisePercentage();
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDefaulterStatus();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getStudentTgpaAction();
      let splitValue = String(session?.user?.token).split("NEXT2121ANG");
      const decData = decryptDataforResponse(res.ApiData, splitValue[1]);
      const parsedData = JSON.parse(decData);
      setTgpa(parsedData);
    } catch (error) {}
  };
  const fetchGradeCount = async () => {
    try {
      const res = await getStudentGradeCountAction();
      let splitValue = String(session?.user?.token).split("NEXT2121ANG");
      const decData = decryptDataforResponse(res.ApiData, splitValue[1]);
      const parsedData = JSON.parse(decData);
      setGrade(parsedData);
    } catch (error) {}
  };
  const fetchComponentWisePercentage = async () => {
    try {
      const res = await getStudentComponentWisePercentageAction();
      let splitValue = String(session?.user?.token).split("NEXT2121ANG");
      const decData = decryptDataforResponse(res.ApiData, splitValue[1]);
      const parsedData = JSON.parse(decData);
      setStudentMarks(parsedData);
    } catch (error) {}
  };
  const getTGPAValuesByCategory = (data: any[], category: string): number[] => {
    const categoryData = data.find((item) => item.Category === category);

    return categoryData
      ? Object.entries(categoryData)
          .filter(([key, value]) => key.startsWith("TGPASem") && value !== null)
          .map(([, value]) => Number(value))
      : [];
  };
  const studentTGPAs = getTGPAValuesByCategory(tgpa, "Student");
  const classTGPAs = getTGPAValuesByCategory(tgpa, "Class");

  const studentTGPA = tgpa.find((item) => item.Category === "Class");
  const termIDs = Object.entries(studentTGPA || {})
    .filter(([key, value]) => key.startsWith("TGPASem") && value !== null)
    .map(([key]) => key.replace("TGPA", ""));

  const gradeName = grade.map((item) => item.Grade);
  const gradeCounts = grade.map((item) => item.RecordCount);

  const term = studentmarks.map((item) => item.TermId);
  const CA = studentmarks.map((item) => item.CA);
  const MidTermTheory = studentmarks.map((item) => item.MidTermTheory);
  const EndTermTheory = studentmarks.map((item) => item.EndTermTheory);
  const EndTermPractical = studentmarks.map((item) => item.EndTermPractical);

  const optionscolumnchart: any = {
    chart: {
      type: "bar",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 250,
      stacked: true,
    },
    colors: [primary],
    plotOptions: {
      bar: {
        borderRadius: [6],
        horizontal: false,
        barHeight: "100%",
        columnWidth: "25%",
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
    },
    yaxis: {
      show: false,
    },
    xaxis: {
      categories: gradeName,
      axisTicks: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
  };
  const seriescolumnchart = [
    {
      name: "Count",
      data: gradeCounts,
    },
  ];

  const optionsareachart: any = {
    chart: {
      id: "area-chart",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
      zoom: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: "3",
      curve: "smooth",
    },
    fill: {
      type: "solid", // you can also use 'gradient', 'pattern', or 'image'
      opacity: 0, // Set opacity to 0 to make the fill transparent
    },
    colors: [primary, secondary, third, fourth],
    xaxis: {
      type: "string",
      categories: term,
    },
    yaxis: {
      opposite: false,
      min: 0, // Set the minimum y-axis value
      max: 100, // Set the maximum y-axis value
      tickAmount: 5,
      labels: {
        show: true,
      },
      title: {
        text: "Avg",
      },
    },
    legend: {
      show: true,
      position: "bottom",
      width: "50px",
    },
    grid: {
      show: false,
    },
    tooltip: {
      theme: "dark",
      fillSeriesColor: false,
    },
  };

  const seriesareachart = [
    {
      name: "CA",
      data: CA,
    },
    {
      name: "Mid-Term Theory",
      data: MidTermTheory,
    },
    {
      name: "End-Term Theory",
      data: EndTermTheory,
    },
    {
      name: "Practical-Term Theory",
      data: EndTermPractical,
    },
  ];

  const optionslinechart: any = {
    chart: {
      height: 350,
      type: "line",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
      zoom: {
        type: "x",
        enabled: true,
      },
      toolbar: {
        show: false,
      },
      shadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 1,
      },
    },
    xaxis: {
      categories: termIDs,
      title: {
        text: "Termid",
      },
    },
    grid: {
      show: false,
    },
    colors: [primary, secondary],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "straight",
      width: "2",
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5,
    },
    tooltip: {
      theme: "dark",
    },
    yaxis: {
      min: 2,
      max: 10,
      tickAmount: 4,
      title: {
        text: "TGPA",
      },
    },
  };

  const serieslinechart: any = [
    {
      name: "Your",
      data: studentTGPAs,
    },
    {
      name: "Higest",
      data: classTGPAs,
    },
  ];

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <PageContainer title="Result Summary" description="Result Summary">
          <Grid container>
            <Grid
              size={{
                sm: 12,
              }}
            >
              {/* <ResultTabs isVisible={studentDefaulter ? false : true} /> */}
            </Grid>
          </Grid>
          {studentDefaulter ? (
            <StudentDefaulter
              Description={studentDefaulter[0].Description}
              OfficeAddress={studentDefaulter[0].OfficeAddress}
              gender={profilee.profileData[0]?.gender}
            />
          ) : (
            <Grid container spacing={3} mt={2}>
              <Grid
                size={{
                  sm: 12,
                }}
              >
                <Grid container spacing={2}>
                  <Grid
                    size={{
                      xs: 12,
                      sm: 4,
                      lg: 2,
                    }}
                  >
                    <Stack spacing={2}>
                      <Card
                        sx={{
                          padding: 0,
                          border: !customizer.isCardShadow
                            ? `1px solid ${borderColor}`
                            : "none",
                          backgroundColor: "primary.main",
                          color: "white",
                          position: "relative",
                        }}
                        elevation={customizer.isCardShadow ? 9 : 0}
                        variant={
                          !customizer.isCardShadow ? "outlined" : undefined
                        }
                      >
                        <Image
                          src="/images/backgrounds/top-info-shape.png"
                          alt="img"
                          className="top-img"
                          width={70}
                          height={90}
                        />
                        <CardContent>
                          <Box mb={4}>
                            <IconReport width="40" height="80" />
                          </Box>
                          <Typography variant="h2">
                            {profilee.profileData[0]?.cgpa}
                          </Typography>
                          <Typography component="span" variant="subtitle2">
                            CGPA
                          </Typography>
                        </CardContent>
                      </Card>
                    </Stack>
                  </Grid>
                  <Grid
                    size={{
                      xs: 12,
                      sm: 8,
                      lg: 10,
                    }}
                  >
                    <Stack>
                      <BlankCard>
                        <CardContent
                          sx={{
                            p: "15px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="h4">Grades Analysis</Typography>
                          <Box display="flex" alignItems="center"></Box>
                        </CardContent>
                        <Chart
                          options={optionscolumnchart}
                          series={seriescolumnchart}
                          type="bar"
                          height={"150px"}
                          width={"100%"}
                        />
                      </BlankCard>
                    </Stack>
                  </Grid>
                  <Grid
                    size={{
                      xs: 12,
                      sm: 12,
                      lg: 12,
                    }}
                  >
                    <BlankCard>
                      <CardContent sx={{ p: "30px" }}>
                        <Box display="flex" alignItems="center">
                          <Typography variant="h4" sx={{ marginLeft: 1 }}>
                            TGPA Comparison to Highest Class TGPA
                          </Typography>
                        </Box>
                      </CardContent>
                      <Chart
                        options={optionslinechart}
                        series={serieslinechart}
                        type="line"
                        height="250px"
                        width={"100%"}
                      />
                    </BlankCard>
                  </Grid>
                  <Grid
                    size={{
                      xs: 12,
                      sm: 12,
                      lg: 12,
                    }}
                  >
                    <BlankCard>
                      <CardContent sx={{ p: "30px" }}>
                        <Typography variant="h4">
                          Component Wise Performance
                        </Typography>
                      </CardContent>
                      <Chart
                        options={optionsareachart}
                        series={seriesareachart}
                        type="area"
                        height="300px"
                        width={"100%"}
                      />
                    </BlankCard>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </PageContainer>
      )}
    </>
  );
};

export default StuTGPAView;
