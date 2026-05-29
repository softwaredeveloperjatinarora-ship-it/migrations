"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Box,
  Typography,
  Dialog,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Icon } from "@iconify/react";
import SeatingpalnPopup from "./Popup/SeatingpalnPopup/SeatingpalnPopup";
import { getseatingPlanAction } from "@/app/actions/homeAction/seatingplans/getseatingplansAction";
import { useSession } from "next-auth/react";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import { keyframes } from "@mui/system";
import { IconClock,IconCalendar } from "@tabler/icons-react";

const SeatingPlan = ({ onDataFetched }: any) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();
  const [seatingPlanData, setSeatingPlandata] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isDataFetched = useRef(false);
  const [hovered, setHovered] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const handleOpen = () => {


    if (seatingPlanData.length <= 0) {
      setOpen(false);
      setAlertMessage("No Seating Plan Found");
      setOpenAlert(true);
    }

    else {

      setOpen(true)
    }

  };


  const handleClose = () => {
    setOpen(false)
      setOpenAlert(false);
  };

  useEffect(() => {
    const fetchPlacementData = async () => {
      if (isDataFetched.current) return;

      try {
        setLoading(true);
        const response = await getseatingPlanAction();

        if (response.status === "success") {
          let apiData = response.ApiData;
          let splitValue = String(session?.user?.token).split("NEXT2121ANG");
          const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
          const parsedData = JSON.parse(decryptedData);
          setSeatingPlandata(parsedData);
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

  const ringAnimation = keyframes`
  0% { transform: rotate(0); }
  15% { transform: rotate(10deg); }
  30% { transform: rotate(-10deg); }
  45% { transform: rotate(6deg); }
  60% { transform: rotate(-6deg); }
  75% { transform: rotate(4deg); }
  100% { transform: rotate(0); }
`;

  return (
    <>
          <Snackbar
        open={openAlert}
        autoHideDuration={3000} // Hide after 3 seconds
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // ✅ Alert on right side
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    <Card
      sx={{
        padding: 0,
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        height: { xs: "250px", lg: "246px" },
      }}
    >
      <Box
        sx={{
          paddingTop: "8px",
          paddingBottom: "8px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          borderRadius: "0",
          borderBottom: "1px solid #E0E0E0",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            cursor: "default",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "16px",
            width: "100%",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Icon
            icon="material-symbols:airline-seat-recline-normal-rounded"
            style={{ fontSize: "25px" }}
          />
          Seating Plan
          <Box
            sx={{
              marginLeft: "auto",
              position: "absolute",
              right: 10,
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={handleOpen}
          >
            <Icon
              icon={
                hovered
                  ? "mingcute:information-fill"
                  : "mingcute:information-line"
              }
              style={{ fontSize: "25px", color: "#707a82" }}
            />
          </Box>
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Scrollbar sx={{ height: "300px" }}>
          <Box
            sx={{
              height: {
                xs: "300px",
                lg: "100%",
              },
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: 2,
              
            }}
          >
            {seatingPlanData.length > 0 ? (
              seatingPlanData.map((data: any, index: number) => (
                <React.Fragment key={index}>
                  <Box
                    sx={{
                      
                      p: 0,
                      cursor: "default",
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        color: "secondary.main",
                        mb: 1.5,
                        display: "flex",
                        justifyContent: "center",
                        fontSize: "16px",
                      }}
                    >
                     {data.CourseName == null ?  data.CourseCode  :  data.CourseName }
                    </Typography>

                    <Box display="flex" justifyContent={"center"}>
                      <Typography
                        variant="body2"
                        style={{ display: "flex", alignItems: "center",padding:2 }}
                      >
                     
                        <b> {data.CourseCode}</b>
                      </Typography>

                      <Typography
                        variant="body2"
                        style={{ display: "flex", alignItems: "center" ,padding:2}}
                      >
                        <Icon
                          icon="ci:line-l"
                          style={{
                            fontSize: "20px",
                            color: theme.palette.primary.main,
                          }}
                        />
                        <IconCalendar  width={18}/> {data.ExamDate}
                      </Typography>

                      <Typography
                        variant="body2"
                        style={{ display: "flex", alignItems: "center" ,padding:2}}
                      >
                        <Icon
                          icon="ci:line-l"
                          style={{
                            fontSize: "20px",
                            color: theme.palette.primary.main,
                          }}
                        />
                        <IconClock width={18} />{data.ExamTime}
                      </Typography>
                    </Box>
                  </Box>
                  {index !== seatingPlanData.length - 1 && <Divider />}
                </React.Fragment>
              ))
            ) : (
                   <Box
                  textAlign="center"
                  sx={{ padding: "10px", color: "text.secondary" }}
                >
                  {loading ? "Loading..." : (
                    <Box>
                      <Icon
                        icon="jam:newspaper-f"
                        style={{ fontSize: 45, color: "#9e9e9e", marginBottom: 1.5 }}
                      />
                      <Typography variant="h6" color="textSecondary" fontWeight="bold">
                        No Seating Plan Found
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        You currently don't have any Seating Plan. Please check back later.
                      </Typography>
                    </Box>
                  )}
                </Box>
            )}
          </Box>
        </Scrollbar>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <SeatingpalnPopup
          open={open}
          handleClose={handleClose}
          title="Seating Plan"
        />
      </Dialog>
    </Card>
    </>
  );
};

export default SeatingPlan;
