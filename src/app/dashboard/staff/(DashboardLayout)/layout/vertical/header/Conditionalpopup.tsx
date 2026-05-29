

"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  Typography,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  Skeleton,
} from "@mui/material";
import Image from "next/image";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import { useSession } from "next-auth/react";

import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import { getConditionalPopupAction } from "@/app/actions/headerAction/ConditionalPopup/getConditionalPopupAction";
import { getSaveConditionalPopupAction } from "@/app/actions/headerAction/ConditionalPopup/getSaveConditionalPopupAction";


const messageColors = ["#ffefef", "#e5f3fb", "#e7ecf0", "#fff6ea", "#dffff3"];

const ConditionalPopup = ({ onDataFetched }: any) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [checkboxes, setCheckboxes] = useState<boolean[]>([]);
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);
  const [slidingOut, setSlidingOut] = useState<boolean[]>([]);
  const [openAlerts, setOpenAlerts] = useState<boolean[]>([]);
  const [blockUmsFlag, setBlockUmsFlag] = useState(false);
  const { data: session } = useSession();
  const isDataFetched = useRef(false);
  const [condPopup, setCondPoppup] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [repeatTimers, setRepeatTimers] = useState<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      repeatTimers.forEach(clearTimeout);
    };
  }, [repeatTimers]);

  const fetchconditionalpopuptData = async () => {
    if (isDataFetched.current) return;
    setLoading(true);
    try {
      const response = await getConditionalPopupAction();
      const splitValue = String(session?.user?.token).split("NEXT2121ANG");
      if (response.status === "success") {
        const apiData = response.ApiData;
        const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
        const parsedData = JSON.parse(decryptedData);
        // console.log("cond pop data", parsedData);

        const hasBlockUms = parsedData.some((item: any) => item.BlockUms === true);
        setBlockUmsFlag(hasBlockUms);

        if (parsedData.length > 0) {
          setCondPoppup(parsedData);
          setCheckboxes(parsedData.map(() => false));
          setVisibleItems(parsedData.map(() => true));
          setSlidingOut(parsedData.map(() => false));
          setOpenAlerts(parsedData.map(() => false));
          setShowDrawer(true);
        } else {
          setShowDrawer(false);
        }

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

  useEffect(() => {
    fetchconditionalpopuptData ();
  }, [onDataFetched, session?.user?.token]);

  const handleCheckboxChange = (index: number, checked: boolean) => {
    const updated = [...checkboxes];
    updated[index] = checked;
    setCheckboxes(updated);
  };

  const handleConfirm = async(index: number,popupid:number) => {
// console.log("popupid",popupid)
    // save api
const formfields ={
      VId:"0",
      Id:popupid.toString()
    }
    if (!session || !session.user || !session.user.token) {
            throw new Error("Session or token is missing");
          }
    
          let splitValue = session.user.token.split("NEXT2121ANG");
          const credentialsJson = JSON.stringify(formfields);
    
          // Encrypt the data
          const { Data } = encryptData(credentialsJson, splitValue[1]);
    const response1 = await getSaveConditionalPopupAction(Data);
       let apiData = response1.ApiData;
          const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
          // console.log("response save  popup ",decryptedData)

    //
    if (checkboxes[index]) {
      // console.log("indexif",index)
      const updatedSliding = [...slidingOut];
      updatedSliding[index] = true;
      setSlidingOut(updatedSliding);

      setTimeout(() => {
        const updatedVisibility = [...visibleItems];
        updatedVisibility[index] = false;
        setVisibleItems(updatedVisibility);

        if (updatedVisibility.every((v) => !v)) {
          setShowDrawer(false);

          const newTimers: NodeJS.Timeout[] = [];
          condPopup.forEach((item, i) => {
            const repeatTime = item.RepeatMessageAfterMiliSecond;
            if (repeatTime && repeatTime > 0) {
              const timer = setTimeout(() => {
                const newVisibility = [...visibleItems];
                newVisibility[i] = true;
                setVisibleItems(newVisibility);

                const newSliding = [...slidingOut];
                newSliding[i] = false;
                setSlidingOut(newSliding);

                const newCheckboxes = [...checkboxes];
                newCheckboxes[i] = false;
                setCheckboxes(newCheckboxes);

                const newAlerts = [...openAlerts];
                newAlerts[i] = false;
                setOpenAlerts(newAlerts);

                setShowDrawer(true);
              }, repeatTime);
              newTimers.push(timer);
            }
          });
          setRepeatTimers(newTimers);
        }
      }, 500);
    } else {
      const updatedAlerts = [...openAlerts];
      updatedAlerts[index] = true;
      setOpenAlerts(updatedAlerts);
      // console.log("updatedAlertselse",updatedAlerts)
    }
  };

  const handleCloseAlert = (index: number) => {
    const updatedAlerts = [...openAlerts];
    updatedAlerts[index] = false;
    setOpenAlerts(updatedAlerts);
  };

  return (
    <Box>
      <Drawer
        anchor="right"
        open={showDrawer}
        onClose={() => {}}
        ModalProps={{
          disableEscapeKeyDown: true,
          hideBackdrop: false,
        }}
        transitionDuration={{ enter: 500, exit: 500 }}
        sx={{
           zIndex: (theme) => theme.zIndex.modal + 10,
          "& .MuiDrawer-paper": {
            width: { lg: "50%", xs: "90%" },
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Important Notifications
        </DialogTitle>

        <DialogContent dividers sx={{ padding: 0 }}>
          <Scrollbar sx={{ height: "100%" }}>
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <Box sx={{ px: { xs: 2, md: 6 }, mt: 4, position: "relative" }}>
                {blockUmsFlag && (
                  <Box
                    sx={{
                      width: "100%",
                      backgroundColor: "#f44336",
                      color: "#fff",
                      px: 3,
                      py: 2,
                      mb: 3,
                      textAlign: "center",
                      fontWeight: "bold",
                      borderRadius: 1,
                    }}
                  >
                    Your UMS is blocked due to following reasons
                  </Box>
                )}

                {condPopup.map((item, i) =>
                  visibleItems[i] ? (
                    <Box
                      key={i}
                      sx={{
                        transition: "transform 0.5s ease, opacity 0.5s ease",
                        transform: slidingOut[i] ? "translateX(100%)" : "translateX(0)",
                        opacity: slidingOut[i] ? 0 : 1,
                        display: "flex",
                        justifyContent: i % 2 === 0 ? "flex-start" : "flex-end",
                      }}
                    >
                      <Box
                        sx={{
                          width: "90%",
                          backgroundColor: messageColors[i % messageColors.length],
                          px: 3,
                          py: 2,
                          mb: 2,
                          color: "black",
                          boxShadow: 3,
                          position: "relative",
                          mr: i % 2 === 0 ? 0 : "auto",
                          ml: i % 2 === 0 ? "auto" : 0,
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: "-25px",
                            left: i % 2 === 0 ? "25px" : undefined,
                            right: i % 2 !== 0 ? "25px" : undefined,
                            borderLeft: "35px solid transparent",
                            borderRight: "35px solid transparent",
                            borderBottom: `35px solid ${messageColors[i % messageColors.length]}`,
                            width: 0,
                            height: 0,
                          },
                        }}
                      >
                        <Box sx={{ display: { lg: "flex" }, justifyContent: "space-between", mt: 0 }}>
                          {item.MImage && (
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mr: 2 }}>
                              <Image src={item.MImage} alt="Timeline" width={200} height={200} />
                            </Box>
                          )}
                          <Box
                            sx={{
                              mt: 2,
                              "& a": {
                                color: "primary.main",
                                textDecoration: "none",
                              },
                              "& a:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            <Typography
                              variant="body1"
                              component="div"
                              dangerouslySetInnerHTML={{ __html: item.MessageDescription }}
                            />

{/* <Typography
                              variant="body1"
                              component="div"
                         
                            >{item.MessageDescription}</Typography> */}


                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 2 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkboxes[i]}
                                onChange={(e) => handleCheckboxChange(i, e.target.checked)}
                              />
                            }
                            label="I have read this information"
                          />
                          <Button variant="contained" onClick={() => handleConfirm(i,item.Id)}>
                            Confirm
                          </Button>
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{ position: "absolute", top: 10, right: 20 }}
                          fontWeight="bold"
                        >
                          {item.SrNo}
                        </Typography>
                        <Snackbar
                          open={openAlerts[i]}
                          autoHideDuration={3000}
                          onClose={() => handleCloseAlert(i)}
                          anchorOrigin={{ vertical: "top", horizontal: "center" }}
                        >
                          <Alert
                            onClose={() => handleCloseAlert(i)}
                            severity="error"
                            sx={{
                              width: { xs: "70%", lg: "100%" },
                              backgroundColor: "#FF4D4D",
                              color: "#fff",
                              ".MuiAlert-icon": {
                                color: "#fff",
                              },
                            }}
                          >
                            Please check the box before confirming.
                          </Alert>
                        </Snackbar>
                      </Box>
                    </Box>
                  ) : null
                )}
              </Box>
            )}
          </Scrollbar>
        </DialogContent>
      </Drawer>
    </Box>
  );
};

const LoadingSkeleton = () => {
  return (
    <Box sx={{ px: { xs: 2, md: 6 }, mt: 4 }}>
      {[...Array(2)].map((_, i) => (
        <Box
          key={i}
          sx={{
            width: "90%",
            px: 3,
            py: 2,
            mb: 2,
            color: "black",
            boxShadow: 3,
            position: "relative",
            mr: i % 2 === 0 ? 0 : "auto",
            ml: i % 2 === 0 ? "auto" : 0,
            "&::before": {
              content: '""',
              position: "absolute",
              top: "-25px",
              left: i % 2 === 0 ? "25px" : undefined,
              right: i % 2 !== 0 ? "25px" : undefined,
              borderLeft: "35px solid transparent",
              borderRight: "35px solid transparent",
              borderBottom: `35px solid transparent`,
              width: 0,
              height: 0,
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2 }}>
            <Skeleton variant="rectangular" width={100} height={100} animation="wave" />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Skeleton variant="text" width="90%" height={20} animation="wave" />
            <Skeleton variant="text" width="95%" height={20} animation="wave" />
            <Skeleton variant="text" width="85%" height={20} animation="wave" />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
            <Skeleton variant="circular" width={24} height={24} animation="wave" />
            <Skeleton variant="rectangular" width={100} height={36} animation="wave" />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ConditionalPopup;