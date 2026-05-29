


"use client";
import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Button,
  Card,
  IconButton,
  Grid,
  Skeleton,
  Tooltip,
} from "@mui/material";
import OJTApplyUni from "./OJTPopup/OJTApplyUni";
import { getOJTCompanyData } from "@/app/actions/OJTDashboard/OJTCompanyDataAction";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import { useSession } from "next-auth/react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import OJTGuidelines from "./OJTPopup/OJTGuidelines";
import Messages from "./OJTMessage";

const OverallPerformance = () => {
  const theme = useTheme();
  const [isModalOpenApply, setIsModalOpenApply] = useState(false);
  const handleOJTApplyClick = () => setIsModalOpenApply(true);
  const closeModalOJTApply = () => setIsModalOpenApply(false);

  const isDataFetched = useRef(false);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [OJTdata, setOJTdata] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);



  const [isModalOpenInfo, setIsModalOpenInfo] = useState(false);
  const handleInfoClick = () => {
    setIsModalOpenInfo(true);
  };

  const closeModalInfo = () => {
    setIsModalOpenInfo(false);
  }

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < OJTdata.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const currentItem = OJTdata[currentIndex];

  useEffect(() => {
    const fetchPlacementData = async () => {
      if (isDataFetched.current) return;

      try {
        const response = await getOJTCompanyData();
        let splitValue = String(session?.user?.token).split("NEXT2121ANG");

        if (response.status === "success") {
          let apiData = response.ApiData;
          const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
          const parsedData = JSON.parse(decryptedData);
          // console.log("data",parsedData)

          setOJTdata(parsedData);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        isDataFetched.current = true;
        setLoading(false);
      }
    };

    fetchPlacementData();
  }, [session]);

  return (
    <>
      {loading || OJTdata.length === 0 ? (

        <Grid>
          <Card sx={{ height: {lg:"200px"} }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Skeleton variant="text" width={100} height={30} />
              <Box display="flex" gap={1}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="circular" width={24} height={24} />
              </Box>
            </Box>

            <Skeleton variant="text" width="60%" height={24} sx={{ mt: 0 }} />

            <Box display="flex" alignItems="center" mt={2}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Box flex={1}>
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="text" width="30%" height={18} />
                <Skeleton variant="text" width="50%" height={18} />
              </Box>
              <Skeleton variant="circular" width={60} height={40} />
            </Box>
          </Card>

          <br />

          <Card sx={{ p: 2 }}>
            <Skeleton variant="text" width="50%" height={20} />
            <Skeleton variant="circular" width={60} height={35} sx={{ mt: 1, ml: 6 }} />
          </Card>
        </Grid>
      ) : (




        currentItem && (
          <Grid key={currentItem.driveId}>
            <Card sx={{ height: {lg:"233px"} }}>
              <Box>
                <OJTGuidelines isOpen={isModalOpenInfo} closeModal={closeModalInfo} title={"OJT Guidline"}></OJTGuidelines>
                
              </Box>
             <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 5, mt: "-20px" }}>
  <Tooltip title="Guidelines">
    <InfoOutlinedIcon onClick={handleInfoClick} sx={{ cursor: "pointer" }} />
  </Tooltip>

  <Messages />
</Box>

             

              <Box display="flex" alignItems="center" justifyContent="space-between" mt={1} >
                <Typography variant="h5">Offers</Typography>
                <Box>
                  <IconButton onClick={handlePrev} disabled={currentIndex === 0}>
                    <ArrowBackIosIcon sx={{ height: "12px" }} />
                  </IconButton>
                  <IconButton onClick={handleNext} disabled={currentIndex === OJTdata.length - 1}>
                    <ArrowForwardIosIcon sx={{ height: "12px" }} />
                  </IconButton>
                </Box>
              </Box>


              <Typography variant="subtitle1" px={2}>
                Offer through University
              </Typography>

              <Box display="flex" alignItems="center" mt={1} ml={3}>
                <Avatar sx={{ bgcolor: "orange", mr: 2 }}>P</Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {currentItem.company}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentItem.drivetype}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    DriveId-{currentItem.driveId}
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  sx={{
                    ml: { xs: 0, sm: 4, md: "auto" },
                    mt: { xs: 2, sm: 0 },
                    alignSelf: { xs: "center", md: "flex-end" },
                  }}
                  onClick={handleOJTApplyClick}
                >
                  Apply
                </Button>

                <OJTApplyUni
                  isOpen={isModalOpenApply}
                  closeModal={closeModalOJTApply}
                  currentItem={currentItem}
                />
              </Box>

            </Card>

            <br />

            <Card sx={{ p: 2 }}>
              If you have any query related to OJT Raise RMS.
              <Button sx={{ marginLeft: 6 }}>Click Here</Button>
            </Card>
          </Grid>
        )

      )}
    </>
  );
};

export default OverallPerformance;
