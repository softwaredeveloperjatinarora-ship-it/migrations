
"use client";
import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { DialogProps } from "@mui/material/Dialog/Dialog";
import Snackbar from "@mui/material/Snackbar";  // ✅ Import Snackbar for alerts
import Alert from "@mui/material/Alert";        // ✅ Import Alert for styling
import MessagePopup from "./Popup/MessagePopup/MessagePopup";
import EventsPopup from "./Popup/EventsPopup/EventsPopup";
import HappeningPopup from "./Popup/HappeningPopup/HappeningPopup";
import AssignmentPopup from './Popup/AssignmentPopup/AssignmentPopup';
import Grid from "@mui/material/Grid";
import { useSession } from "next-auth/react";
import { gettopcardAction } from "@/app/actions/homeAction/topcard/gettopcardAction";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";


const TopCards = ({ onDataFetched }: any) => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();
  const borderColor = theme.palette.divider;

  const [alertMessage, setAlertMessage] = useState<string>("");
  const [openAlert, setOpenAlert] = useState(false); // ✅ Track alert visibility

  const [stats, setStats] = useState([
    { counter: 0, subtitle: "Message", icon: "", iconsm: <></> },
    { counter: 0, subtitle: "Assignments", icon: "", iconsm: <></> },
    { counter: 0, subtitle: "Events", icon: "", iconsm: <></> },
    { counter: 0, subtitle: "Happening", icon: "", iconsm: <></> },
  ]);
const { data: session } = useSession();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [scroll, setScroll] = useState<DialogProps["scroll"]>("paper");
const isDataFetched = useRef(false);
 const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [counterdata, setcounterdata] = useState<any[]>([]);
    useEffect(() => {
      const fetchPlacementData = async () => {
        if (isDataFetched.current) return;
  
        try {
          setLoading(true);
          const response = await gettopcardAction();
  
          if (response.status === "success") {
            let apiData = response.ApiData;
            let splitValue = String(session?.user?.token).split("NEXT2121ANG");
            const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
            const parsedData = JSON.parse(decryptedData);
            setcounterdata(parsedData);
            onDataFetched(apiData);
          } else {
            setError(response.message);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Unknown error occurred");
        } finally {
          setLoading(false);
          isDataFetched.current = true;
        }
      };
  
      fetchPlacementData();
    }, [onDataFetched, session]);
  

  // Update stats when counterData changes
  useEffect(() => {
    if (counterdata.length > 0) {
      setStats([
        {
          counter: counterdata[0]?.countMessage || 0,
          subtitle: "Message",
          icon: "/images/Homepageimage/top-warning-shape.png",
          iconsm: <Icon icon="ic:round-message" width="30" height="30" />,
        },
        {
          counter:counterdata[0]?.countAssignment || 0,
          subtitle: "Assignments",
          icon: "/images/Homepageimage/top-error-shape.png",
          iconsm: <Icon icon="hugeicons:assignments" width="30" height="30" />,
        },
        {
          counter: counterdata[0]?.countEvent || 0,
          subtitle: "Events",
          icon: "/images/Homepageimage/top-info-shape.png",
          iconsm: <Icon icon="carbon:event" width="30" height="30" />,
        },
        {
          counter: counterdata[0]?.countHappen || 0,
          subtitle: "Happening",
          icon: "/images/Homepageimage/top-warning-shape.png",
          iconsm: <Icon icon="tabler:news" width="30" height="30" />,
        },
      ]);
    }
  }, [counterdata]);

  // ✅ Handle click: Show alert if counter is 0, otherwise open the popup
  // const handleClickOpen = (scrollType: DialogProps["scroll"], index: number) => () => {
  //   if (stats[index].counter === 0) {
  //     setAlertMessage(`No ${stats[index].subtitle} is present `);
  //     setOpenAlert(true); // ✅ Show Snackbar
  //     return;
  //   }
  //   setAlertMessage("");
  //   setOpenIndex(index);
  //   setScroll(scrollType);
  // };
  const handleClickOpen = (scrollType: DialogProps["scroll"], index: number) => () => {
    const subtitle = stats[index].subtitle;
  
    // Allow Messages and Assignments to always open
    if (subtitle !== "Message" && subtitle !== "Assignments" && subtitle !== "Events" && stats[index].counter === 0) {
      setAlertMessage(`No ${subtitle} is present`);
      setOpenAlert(true);
      return;
    }
  
    // Always open popup for Messages and Assignments or if count > 0
    setOpenIndex(index);
    setScroll(scrollType);
  };

  // ✅ Close alert function
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
    <>
      {/* ✅ Snackbar Alert for No Data */}
      <Snackbar
        open={openAlert}
        autoHideDuration={3000} // Hide after 3 seconds
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // ✅ Alert on right side
      >
        <Alert onClose={handleCloseAlert} severity="error" sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <Grid container spacing={2}>
        {stats.map((stat, i) => (
          <Grid key={i} size={{ xs: 6, sm: 6, md: 4, lg: 3 }} >
            <Card
              sx={{
                cursor: "pointer",
                height: "150px",
                padding: 0,
                border: !customizer.isCardShadow ? `1px solid ${borderColor}` : "none",
                backgroundColor: "primary.main",
                color: "white",
                position: "relative",
                transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
                },
              }}
              elevation={customizer.isCardShadow ? 9 : 0}
              variant={!customizer.isCardShadow ? "outlined" : undefined}
              onClick={handleClickOpen("paper", i)}
            >
              {stat.icon && <Image src={stat.icon} alt="icon" className="top-img" width={59} height={81} />}
              <CardContent>
                <Box mb={2} sx={{ whiteSpace: "nowrap", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {stat.iconsm}
                </Box>
                <Typography variant="h4" sx={{ whiteSpace: "nowrap", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {stat.counter}
                </Typography>
                <Typography mb={3} component="span" variant="subtitle2" sx={{ whiteSpace: "nowrap", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {stat.subtitle}
                </Typography>
              </CardContent>
            </Card>

            {/* ✅ Conditional Popup Rendering */}
            {openIndex === i && stat.subtitle === "Message" && (
              <MessagePopup open={openIndex === i} handleClose={() => setOpenIndex(null)} title={"My Messages"} count={counterdata[0]?.countMessage} />
            )}
            {openIndex === i && stat.subtitle === "Assignments" && (
              <AssignmentPopup open={openIndex === i} handleClose={() => setOpenIndex(null)} title={stat.subtitle} />
            )}
            {openIndex === i && stat.subtitle === "Events" && (
              <EventsPopup open={openIndex === i} handleClose={() => setOpenIndex(null)} title={stat.subtitle} />
            )}
            {openIndex === i && stat.subtitle === "Happening" && (
              <HappeningPopup open={openIndex === i} handleClose={() => setOpenIndex(null)} title={stat.subtitle} />
            )}
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default TopCards;