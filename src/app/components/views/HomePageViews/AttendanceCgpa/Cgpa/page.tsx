"use client";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import Typography from "@mui/material/Typography";
import { DialogProps } from "@mui/material/Dialog";
import CgpaPopup from "../../Popup/CGPAPopup/CGPAPopup";
import { ProfileState } from "@/store/store";
import { useSelector } from "@/store/hooks";
import { useTheme } from "@mui/material/styles";
import { Card } from "@mui/material";
import { ApexOptions } from "apexcharts";
import { Icon } from "@iconify/react";


const Percentage = () => {
  const Chart = React.useMemo(
    () => dynamic(() => import("react-apexcharts"), { ssr: false }),
    []
  );

  const [openIndex, setOpenIndex] = React.useState<number | null>(null); // Track the index of the open card
  const [scroll, setScroll] = React.useState<DialogProps["scroll"]>("paper");
  const [open, setOpen] = useState<boolean>(false);
  const profile = useSelector((state: ProfileState) => state.profile) as {
    profileData: { cgpa: number }[];
  };
  const cgpaa = profile?.profileData?.[0]?.cgpa ?? 0;
  const theme = useTheme();
  // useEffect(() => {
  //   if (profile?.profileData?.[0]?.cgpa <5) {
  //     setOpen(true);
  //   }
  // }, [profile?.profileData?.[0]?.cgpa]);


  // const handleCloseModal = () => {
  //   setOpen(false);
  // };

  const handleClickOpen = (scrollType: DialogProps["scroll"], index: number) => () => {
    setOpenIndex(index); // Set the card index that was clicked
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpenIndex(null); // Close the dialog
  };
 

  let mainColor;
  if (cgpaa > 8) {
    mainColor =  theme.palette.success.main; // Green
  } else if (cgpaa >= 5) {
    mainColor = theme.palette.warning.main;// Blue
  } else {
    mainColor = "#FF4D4D";// Red
  }


  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;

  // Memoize chart options and series with ApexOptions type
  const optionscolumnchart: ApexOptions = React.useMemo(() => ({
    chart: {
      type: "donut",  // Explicitly assigning a valid chart type string
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      toolbar: {
        show: false,
      },
      height: 100,
    },
    labels: ["Achieved", "Remaining"],
    colors: [mainColor, primarylight, "#F9F9FD"],
    plotOptions: {
      pie: {
        donut: {
          size: "83%",
          background: "transparent",
          labels: {
            show: true,
            name: {
              show: true,
              offsetY: 7,
            },
            value: {
              show: false,
            },
            total: {
              show: true,
              color: theme.palette.mode === "dark" ? "white" : "black",
              fontSize: "15px",
              fontWeight: "600",
              label: `${cgpaa}`,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
  }), [cgpaa, primary, primarylight, theme]);

  const seriescolumnchart = React.useMemo(() => [
    cgpaa ?? 0,
    parseFloat((10 - cgpaa).toFixed(2)), // Ensure this is a number
  ], [cgpaa]);

  const iconData = {
    
    label: "CGPA",
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
    <Card
      className="cardWithShadow"
      sx={{ height: { xs: "100%", sm: "100%", md: "100%", lg: "92%" } }}
    >
      <Box>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }} onClick={handleClickOpen("paper", 0)}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Data Container */}
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
              <Typography variant="h6" fontWeight={800} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {/* <img src={iconData.icon} alt="icon" width={24} /> */}
                <Icon icon="fa-solid:chart-line" width={24} />
                {iconData.label}
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="flex-start" ml={2}>
                <Typography variant="subtitle1" fontSize={"15px"} fontWeight={800} color="secondary.main">
                  {cgpaa}%
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
              <Chart
                options={optionscolumnchart}
                series={seriescolumnchart}
                type="donut"
                width={"215%"}
                height={190}
              />
            </Box>
          </Box>
        </Grid>

        {/* CgpaPopup Dialog */}
        {openIndex !== null && (
          <CgpaPopup
            open={openIndex !== null}
            handleClose={handleClose}
            title="CGPA"
          />
        )}
      </Box>
      {/* Modal for Attendance Alert */}
      {/* <Modal open={open} onClose={handleCloseModal} aria-labelledby="attendance-modal-title">
        <Box sx={styleForModal}>
          <Typography variant="h5" id="attendance-modal-title">
            Cgpa Alert
          </Typography>
          <Typography variant="body1" mt={2}>
            Your cgpa is below {cgpaa} 
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

export default Percentage;


