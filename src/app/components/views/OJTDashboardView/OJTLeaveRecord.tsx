
"use client"
import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import dynamic from "next/dynamic";
import { useTheme } from "@mui/material/styles";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { IconCircle } from "@tabler/icons-react";
import { Card, CardHeader,  Skeleton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { getOJTAttendanceCount } from "@/app/actions/OJTDashboard/OJTAttendenceCountAction";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";


interface ProductsCardProps {
  isLoading: boolean;
}

const OJTLeaveRecord = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const info = theme.palette.info.main;
  const error = theme.palette.error.main;





  const isDataFetched = useRef(false);
  const [OJTAttendence, setOJTAttendence] = useState<any[]>([]);
  const [Error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    const fetchPlacementData = async () => {
      if (isDataFetched.current) return;

      setLoading(true);
      try {
        const response = await getOJTAttendanceCount();
        // console.log("saloni", response);
        // console.log("atte", OJTAttendence[0]?.AbsentCount
        // )
        setOJTAttendence(response);

        let splitValue = String(session?.user?.token).split("NEXT2121ANG");
        if (response.status === "success") {
          let apiData = response.ApiData;
          const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
          const parsedData = JSON.parse(decryptedData);

          // console.log(parsedData)

        } else {
          setError(response.message);
        }
      } catch (err) {
        // setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        isDataFetched.current = true;
        setLoading(false);
      }
    };

    fetchPlacementData();
  }, [isDataFetched, session]);
  const absent = OJTAttendence[0]?.AbsentCount
  const totalattendance = OJTAttendence[0]?.TotalAttendance
  const present = OJTAttendence[0]?.PresentCount

  const totaldays = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    // Set day to 0 of next month to get the last day of the current month
    return new Date(year, month + 1, 0).getDate();
  };
  const days = totaldays();
  const notmarked = days - (present + absent)


  // chart
  const optionscolumnchart: any = {
    chart: {
      type: "donut",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 170,
      stacked: true,
    },
    labels: ["Present", "Absent", "Not Marked"],
    colors: [theme.palette.info.dark, '#ff8a65', theme.palette.warning.dark],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "85%",
        },
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
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
  };
  const seriescolumnchart = [present, absent, notmarked];


return (
  <>
    {loading || OJTAttendence.length === 0 ? (

      // Array.from(new Array(1)).map((_, index) => (
        <Card
          // key={index}
          sx={{
            height: '295px',
            p: 2,
            borderRadius: 1,
            boxShadow: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <CardHeader
            title={<Skeleton variant="text" width="60%" height={28} />}
            subheader={<Skeleton variant="text" width="30%" height={20} />}
            sx={{ pb: 0, pt: 1 }}
            action={
              <Box textAlign="right">
                <Skeleton variant="text" width={50} height={28} />
                <Skeleton variant="rectangular" width={90} height={24} sx={{ mt: 1, borderRadius: 2 }} />
              </Box>
            }
          />

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5} mb={4}>
            <Box width="50%" display="flex" justifyContent="center">
              <Skeleton variant="circular" width={130} height={130} />
            </Box>

            <Box width="50%" display="flex" flexDirection="column" gap={2} alignItems="flex-start" sx={{ ml: '20px' }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Skeleton variant="circular" width={14} height={14} />
                <Skeleton variant="text" width={100} height={24} />
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Skeleton variant="circular" width={14} height={14} />
                <Skeleton variant="text" width={100} height={24} />
              </Box>
            </Box>
          </Box>
        </Card>
      // ))
    ) : (
      OJTAttendence.map((item, index) => (
        <Card
          key={index}
          sx={{
            height: '295px',
            p: 2,
            borderRadius: 1,
            boxShadow: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <CardHeader
            title={<Typography variant="h6" fontWeight={600}>Attendance Record</Typography>}
            subheader={<Typography variant="subtitle2" color="text.secondary">This Month</Typography>}
            sx={{ pb: 0, pt: 1 }}
            action={
              <Box textAlign="right">
                <Typography variant="h5" fontWeight={700}>
                  {item.TotalAttendance}
                </Typography>
                <Box
                  bgcolor="warning.light"
                  color="warning.main"
                  fontSize="12px"
                  px={1.2}
                  py={0.5}
                  border="1px solid"
                  borderRadius={2}
                  display="inline-block"
                  mt={0.5}
                >
                  Marked Days
                </Box>
              </Box>
            }
          />

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5} mb={2}>
            <Box width="50%" display="flex" justifyContent="center">
              <Chart
                options={optionscolumnchart}
                series={seriescolumnchart}
                type="donut"
                height={160}
                width="70%"
              />
            </Box>

            <Box width="50%" display="flex" flexDirection="column" gap={2} alignItems="flex-start" sx={{ ml: '20px' }}>
              <Box display="flex" alignItems="center" gap={1}>
                <IconCircle size={14} color="#2e7d32" />
                <Typography variant="body1" sx={{ fontSize: '16px' }} color="text.secondary">
                  Present:
                </Typography>
                <Typography sx={{ fontSize: '16px' }} fontWeight={600} color="success.main">
                  {item.PresentCount}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <IconCircle size={14} color="#1976d2" />
                <Typography variant="body1" sx={{ fontSize: '16px' }} color="text.secondary">
                  Absent:
                </Typography>
                <Typography sx={{ fontSize: '16px' }} fontWeight={600} color="primary.main">
                  {item.AbsentCount}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      ))
    )}
  </>
);



};

export default OJTLeaveRecord;
