

"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import dynamic from "next/dynamic";
import { useTheme } from "@mui/material/styles";
import { Card, CardContent } from "@mui/material";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const OJTWorkingHours = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  const [apiData] = useState([
    { date: "16-06-2025", status: "Absent", hours: 0 ,punchout:"17-06-2025"},
    { date: "18-06-2025", status: "Present", hours: 23440 ,punchout:"19-06-2025"},
    { date: "20-06-2025", status: "Absent", hours: 0 ,punchout:"21-06-2025"},
    { date: "22-06-2025", status: "Present", hours: 0,punchout:"22-06-2025" },
    { date: "23-06-2025", status: "Absent", hours: 0 ,punchout:"24-06-2025"},
    { date: "24-06-2025", status: "Present", hours: 7.20,punchout:"25-06-2025" },
    { date: "26-06-2025", status: "Present", hours: 8,punchout:"27-06-2025" },


  ]);

  // Extract all required info in one .map()
  const transformedData = apiData.map((item) => ({
   
    category: item.date.split("-")[0],

    barColor: item.status === "Absent" ? "#BDBDBD" : theme.palette.warning.dark,
    displayHours: item.status === "Absent" ? 70 : item.hours,
  tooltipText:
  item.status === "Absent"
    ? "Absent"
    : (() => {
        const totalSeconds = Math.round(item.hours * 3600);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        const format = (n: number) => n.toString().padStart(2, "0");
        const formattedTime = `${format(h)}:${format(m)}:${format(s)}`;
      return `Punch Out: ${item.punchout}<br/>Working Hours: ${formattedTime}`;

      })(),

    status: item.status,
    rawHours: item.hours,
  }));

  const seriescolumnchart = [
    {
      name: "",
      data: transformedData.map((item) => item.displayHours),
    },
  ];

  const optionscolumnchart: any = {
    chart: {
      type: "bar",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: { show: false },
      height: 150,
    },
    colors: transformedData.map((item) => item.barColor),
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "26%",
        borderRadius: 3,
        distributed: true,
      },
    },
    stroke: { show: false },
    dataLabels: {
      formatter: () => "",
    },
    legend: { show: false },
    grid: { show: false },
    xaxis: {
      categories: transformedData.map((item) => item.category),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      max: 100,
      labels: { show: false },
    },
   tooltip: {
  theme: theme.palette.mode === "dark" ? "dark" : "light",
  fillSeriesColor: false,
  y: {
    formatter: (_: number, opts: any) => {
      return transformedData[opts.dataPointIndex].tooltipText;
    },
  },
  fixed: {
    enabled: true,
    position: "top", // place tooltip above the bar
    offsetY: -20,    // optional, adjust vertical position
  },
  style: {
    fontSize: '12px',
  },
},

  };

  return (
    <Card sx={{ height: "295px", p: 2 }}>
      <Typography variant="h5">Working Hours</Typography>
      <Typography variant="subtitle1">Last 7 Days</Typography>
      <CardContent>
        <Box mt={-3} height="165px" gap={2}>
          <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="bar"
            height={150}
            width="100%"
          />
        </Box>

        <Stack
          direction="row"
          spacing={2}
          mt={3}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: theme.palette.warning.dark,
                borderRadius: "50%",
              }}
            />
            <Typography variant="caption">Present</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 12,
                height: 12,
                backgroundColor: "#BDBDBD",
                borderRadius: "50%",
              }}
            />
            <Typography variant="caption">Absent</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default OJTWorkingHours;
