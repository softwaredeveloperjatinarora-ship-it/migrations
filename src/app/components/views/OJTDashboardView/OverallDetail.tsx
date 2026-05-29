
"use client"
import React, { useState,useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@mui/material/styles";
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector } from "@/store/hooks";
import { AppState, ProfileState } from "@/store/store";
import Image from "next/image";
import {  Button,  Skeleton } from "@mui/material";
import OJTGuidelines from "./OJTPopup/OJTGuidelines";
import IndependentOfferform from "./OJTPopup/IndependentOfferform";
import { useSession } from "next-auth/react";
import { getOJTOveralldetails } from "@/app/actions/OJTDashboard/OJTOveralldetailsAction";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";


interface CongratsCardProps {
  isLoading: boolean;
}


const OverallDetail = ({ isLoading }: CongratsCardProps) => {
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));
   const profilee = useSelector((state: ProfileState) => state.profile) as { profileData: { registerationNumber: number, name: string, }[] };

  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();
  const borderColor = theme.palette.divider;
  const success = theme.palette.success.main;
  const successlight = theme.palette.success.light;
  const warning = theme.palette.warning.main;
  const warninglight = theme.palette.warning.light;


   const isDataFetched = useRef(false);
    const [OJTdetails, setOJTdetails] = useState<any[]>([]);
    const [Error, setError] = useState<string | null>(null);
    const { data: session } = useSession();
     const [loading, setLoading] = useState<boolean>(true);
  
 


 useEffect(() => {
    const fetchPlacementData = async () => {
      if (isDataFetched.current) return;

      try {
        const response = await getOJTOveralldetails();

        let splitValue = String(session?.user?.token).split("NEXT2121ANG");
        if (response.status === "success") {
          let apiData = response.ApiData;
         
          const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
          const parsedData = JSON.parse(decryptedData);

          setOJTdetails(parsedData);
          // console.log("aww",parsedData);
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







  const [isModalOpenInfo, setIsModalOpenInfo] = useState(false);
    const handleInfoClick = () => {
      setIsModalOpenInfo(true);
    };
  
    const closeModalInfo = () => {
      setIsModalOpenInfo(false);
    };


      ///OJT Apply//
       const [isModalOpenApply, setIsModalOpenApply] =useState(false);
        const handleOJTApplyClick = () => {
          setIsModalOpenApply(true);
        };
      
        const closeModalOJTApply = () => {
        
          setIsModalOpenApply(false);
        };




  // select
  const [month, setMonth] = React.useState("1");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonth(event.target.value);
  };

  
return (
  <>
    {loading ? (
   <Card sx={{ height: "320px", padding: 2 }}>
  <Skeleton variant="text" width="40%" height={28} />

  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
  
    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
      <Grid  size={12}>
        <Stack spacing={3} mt={2}>
          {[1, 2].map((_, idx) => (
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              key={idx}
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Skeleton variant="circular" width={46} height={46} />
                <Box>
                  <Skeleton variant="text" width={150} height={24} />
                  <Skeleton variant="text" width={100} height={20} />
                </Box>
              </Stack>
            </Stack>
          ))}
        </Stack>

 
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            mt: 6,
          }}
        >
          <Skeleton variant="text" width="80%" height={28} />
          <Skeleton variant="circular" width={40} height={40} />
        </Box>
      </Grid>
    </Grid>

  
    <Box sx={{ mr: "40px" ,mt:"-30px"}}>
      <Skeleton variant="circular" width={230} height={230} />
    </Box>
  </Box>
</Card>

    ) : (
      // OJTdetails.length > 0 && (
       <Card sx={{ height: "auto" }}>
  <CardContent sx={{ position: "relative", padding: 1 }}>
    <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 5, mt: "-20px" }}>
      <Typography variant="subtitle2" color="red">
        Please don't use this interface for Summer internships
      </Typography>
    </Box>

    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box sx={{ mt: "8px" }}>
        <Typography variant="h5">
          {profilee.profileData[0]?.name || "N/A"} ({profilee.profileData[0]?.registerationNumber || "N/A"}) 
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          {OJTdetails[0]?.OverallSummary || "No offers"}
        </Typography>
      </Box>
    </Box>

    <OJTGuidelines isOpen={isModalOpenInfo} closeModal={closeModalInfo} title="OJT Guidline" />

    <Grid container spacing={2}>
      <Grid size={12}>
        <Stack spacing={3} mt={3}>
          {/* Offer Through University */}
          <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  bgcolor: successlight,
                  color: success,
                  width: 46,
                  height: 46,
                }}
              >
                <Icon icon="solar:cart-3-line-duotone" width="24" height="24" />
              </Avatar>
              <Box>
                <Typography variant="h6" mb="4px">
                  Offer Through University
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  {OJTdetails[0]?.OfferThrUni ?? "0"}
                </Typography>
              </Box>
            </Stack>
          </Stack>

          {/* Independent Offer */}
          <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  bgcolor: warninglight,
                  color: warning,
                  width: 46,
                  height: 46,
                }}
              >
                <Icon icon="solar:cart-3-line-duotone" width="24" height="24" />
              </Avatar>
              <Box>
                <Typography variant="h6" mb="4px">
                  Independent Offer
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  {OJTdetails[0]?.IndependenetOffer ?? "0"}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Grid>
    </Grid>

    {lgUp && (
      <Image
        src="/images/backgrounds/man-working-on-laptop.png"
        alt="img"
        className="welcome-bg"
        width={340}
        height={240}
      />
    )}
  </CardContent>

  <Typography variant="subtitle2" sx={{ textAlign: "center", alignItems: "center", paddingTop: 1.5 }}>
    If you have any Independent Offer
    <Button onClick={handleOJTApplyClick}>Apply</Button>
  </Typography>

  <IndependentOfferform isOpen={isModalOpenApply} closeModal={closeModalOJTApply} />
</Card>

      // )
    )}
  </>
);

};

export default OverallDetail;
