
"use client";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import React, {  useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Typography from "@mui/material/Typography";
import { DialogProps, Card} from "@mui/material";
import { ProfileState } from "@/store/store";
import { useSelector } from "@/store/hooks";
import { useTheme } from "@mui/material/styles";
import AttendancePopup from "../../Popup/AttendancePopup/AttendancePopup";
import { ApexOptions } from "apexcharts";
import { Icon } from "@iconify/react";



const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Attendence = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [scroll, setScroll] = useState<DialogProps["scroll"]>("paper");
  const [open, setOpen] = useState<boolean>(false);

  const profile = useSelector((state: ProfileState) => state.profile) as {
    profileData: { aggrAttendance: number }[];
  };

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;
  const attendance = profile?.profileData?.[0]?.aggrAttendance ?? 0;
  // Effect to open modal when attendance < 75
  // useEffect(() => {
  //   if (profile?.profileData?.[0]?.aggrAttendance < 75) {
  //     setOpen(true);
  //   }
  // }, [profile?.profileData?.[0]?.aggrAttendance]);


  // const handleCloseModal = () => {
  //   setOpen(false);
  // };


  const handleClickOpen = (scrollType: DialogProps["scroll"], index: number) => () => {
    setOpenIndex(index);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpenIndex(null);
  };
 
  let mainColor;
  if (attendance > 80) {
    mainColor = theme.palette.success.main; // Green
  } else if (attendance >= 50) {
    mainColor =  theme.palette.warning.main; // Blue
  } else {
    mainColor = "#FF4D4D"; // Red
  }

  const optionscolumnchart: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "donut",
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        toolbar: { show: false },
        height: 100,
      },
      labels: ["Attend", "Non-Attend"],
      colors: [mainColor, primarylight, "#F9F9FD"],
      plotOptions: {
        pie: {
          donut: {
            size: "83%",
            background: "transparent",
            labels: {
              show: true,
              name: { show: true, offsetY: 7 },
              value: { show: false },
              total: {
                show: true,
                color: theme.palette.mode === "dark" ? "white" : "black",
                fontSize: "15px",
                fontWeight: "600",
                label: `${attendance}%`,
              },
            },
          },
        },
      },
      dataLabels: { enabled: false },
      stroke: { show: false },
      legend: { show: false },
      tooltip: {
        theme: theme.palette.mode === "dark" ? "dark" : "light",
        fillSeriesColor: false,
      },
    }),
    [attendance, primary, primarylight, theme]
  );

  const seriescolumnchart = useMemo(
    () => [
      attendance ?? 0,
      100 - (attendance ?? 0),
    ],
    [attendance]
  );

  const iconData = {

    label: "Attendance",
  };

  const styleForModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    outline: "none",
  };

  return (
    <Card className="cardWithShadow" sx={{ height: { xs: "100%", sm: "100%", md: "100%", lg: "92%" } }}>
      <Box>
        <Grid  size={{ xs: 12, sm: 12, md: 12, lg: 12 }}  onClick={handleClickOpen("paper", 0)}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: -3,
                paddingTop: "8px",
                paddingBottom: "8px",
                borderRadius: "0",
                borderBottom: "1px solid #E0E0E0",
                width: "100%",
              }}
            >
              <Typography  fontWeight={800} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {/* <img src={iconData.icon} alt="icon" width={24} /> */}
                <Icon icon="mynaui:chart-bar-solid" width={24} />
                {iconData.label}
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="flex-start" ml={2}>
                <Typography variant="subtitle1" fontSize={"15px"} fontWeight={800} color="secondary.main">
                  {attendance}%
                </Typography>
              </Box>
            </Box>
            

            <Box
              width="50%"
              height="200px"
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                cursor: "pointer",
              }}
            >
              <Chart options={optionscolumnchart} series={seriescolumnchart} type="donut" width={"215%"} height={190} />
            </Box>
          </Box>
        </Grid>

        {/* Attendance Popup Dialog */}
        <AttendancePopup open={openIndex !== null} handleClose={handleClose} title="Attendance" />
      </Box>

      {/* Modal for Attendance Alert */}
      {/* <Modal open={open} onClose={handleCloseModal} aria-labelledby="attendance-modal-title">
        <Box sx={styleForModal}>
          <Typography variant="h5" id="attendance-modal-title">
            Attendance Alert
          </Typography>
          <Typography variant="body1" mt={2}>
            Your attendance is below {attendance}%
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <IconX size={24} />
          </IconButton>
        </Box>
      </Modal> */}
    </Card>
  );
};

export default Attendence;
