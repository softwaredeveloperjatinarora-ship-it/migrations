

// "use client";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Scrollbar } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import Avatar from "@mui/material/Avatar";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import CardContent from "@mui/material/CardContent";
// import Grid from "@mui/material/Grid";
// import Typography from "@mui/material/Typography";
// import { Stack } from "@mui/system";
// import BlankCard from "../../shared/BlankCard";
// import { decryptDataforResponse } from "../../../api/services/auth/Encrptdecrpt";
// import React, { useEffect, useRef, useState } from "react";
// import { DialogProps } from "@mui/material/Dialog/Dialog";
// import { useSession } from "next-auth/react";
// import { Card, Divider, Skeleton, useTheme } from "@mui/material";
// import { Icon } from "@iconify/react";
// import ModalComponent from "./Popup/AppointmentModal/AppointmentModal";
// import { getHeadDetailsAction } from "@/app/actions/homeAction/HeadDetails/getHeadDetailsAction";
// import RatingPopup from "./Popup/AppointmentModal/RatingPopup";


// const MentorContact = ({ onDataFetched }: any) => {
//   const theme = useTheme();
//   const isDataFetched = useRef(false);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const { data: session } = useSession();
//   const [mentordata, setMentordata] = useState<any[]>([]);
//   // console.log(mentordata);
//   // State for tracking which card's popup is open
//   const [openIndex, setOpenIndex] = useState<number | null>(null);
//   const [openRatingIndex, setOpenRatingIndex] = useState<number | null>(null);

//   const handleBookAppointmentClick = (index: number) => {
//     setOpenIndex(index);
//     setOpenRatingIndex(null); // Ensure rating popup is closed
//   };

//   const handleRateMentorClick = (index: number) => {
//     setOpenRatingIndex(index);
//     setOpenIndex(null); // Ensure appointment popup is closed
//   };

//   const handleClose = () => {
//     setOpenIndex(null);
//     setOpenRatingIndex(null);
//   };

//   useEffect(() => {
//     const fetchPlacementData = async () => {
//       if (isDataFetched.current) return;

//         setLoading(true);
//       try {
//         const response = await getHeadDetailsAction();

//         let splitValue = String(session?.user?.token).split("NEXT2121ANG");
//         if (response.status === "success") {
//           let apiData = response.ApiData;
//           const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
//           const parsedData = JSON.parse(decryptedData);
//           // console.log("Mentors data", parsedData);
//           setMentordata(parsedData);
//           onDataFetched(apiData);
//         } else {
//           setError(response.message);
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Unknown error occurred");
//       } finally {
//         setLoading(false);
//         isDataFetched.current = true;
//       }
//     };

//     fetchPlacementData();
//   }, [onDataFetched, session?.user?.token]);

//   return (

//     <>

//       {loading ? (
//         <LoadingSkeleton />
//       ) : (

   

//     <Box sx={{ position: "relative", width: "100%", padding: 0 }}>
//       <Swiper
//         key={mentordata.length}
//         modules={[Navigation]}
//         spaceBetween={20}
//         slidesPerView={4}
//         navigation
//         loop={true}
//         loopAdditionalSlides={4}
//         breakpoints={{
//           320: { slidesPerView: 1 },
//           600: { slidesPerView: 2 },
//           900: { slidesPerView: 3 },
//           1200: { slidesPerView: 4 },
//         }}
//       >
//         {mentordata.map((card, index) => (
//           <SwiperSlide key={index}>
//             <Grid size={{xs:12 ,sm:12, lg:12}}>
//               <BlankCard>
//                 <CardContent sx={{ height: 450, cursor: "default" }}>
//                   {card.picture ? (
//                     <img
//                       src={`data:image/${card.picture.startsWith("/") ? "png" : "jpeg"
//                         };base64,${card.picture}`}
//                       alt="Mentor"
//                       style={{
//                         height: 100,
//                         width: 100,
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         margin: "auto",
//                         borderRadius: "50px",
//                       }}
//                       onError={(e) => {
//                         const target = e.target as HTMLImageElement;
//                         target.style.display = "none";
//                       }}
//                     />
//                   ) : (
//                     <Avatar sx={{ width: 100, height: 100, margin: "auto" }} />
//                   )}

//                   <Stack direction="row" spacing={2} mt={3} justifyContent="center">
//                     <Box textAlign="center">
//                       <Box
//                         mb={2}
//                         p={1}
//                         borderRadius="24px"
//                         sx={{
//                           backgroundColor: "primary.light",
//                           display: "flex",
//                           justifyContent: "center",
//                           alignItems: "center",
//                         }}
//                       >
//                         <Typography
//                           variant="h6"
//                           sx={{
//                             whiteSpace: "nowrap",
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                             borderRadius: "24px",
//                           }}
//                         >
//                           {card.head}
//                         </Typography>
//                       </Box>

//                       <Typography
//                         sx={{
//                           fontSize: "14px",
//                           whiteSpace: "nowrap",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         {card.name}
//                       </Typography>

//                       <Typography
//                         sx={{
//                           fontSize: "13px",
//                           whiteSpace: "nowrap",
//                           fontWeight: "bold",
//                           height: "20px",
//                         }}
//                       >
//                         {card.designation}
//                       </Typography>

//                       <Box
//                         display="flex"
//                         flexDirection="column"
//                         alignItems="center"
//                         mt={2}
//                         gap={1}
//                       >
//                         <Typography
//                           variant="subtitle2"
//                           color="textSecondary"
//                           fontSize={"12px"}
//                         >
//                           {card.division}
//                         </Typography>

//                         <Typography
//                           variant="subtitle2"
//                           color="textSecondary"
//                           display="flex"
//                           alignItems="center"
//                           gap="7px"
//                         >
//                           <Icon width={20} height={20} icon="ic:outline-email" />
//                           {card.staffEmail}
//                         </Typography>

//                         <Typography
//                           variant="subtitle2"
//                           color="textSecondary"
//                           display="flex"
//                           alignItems="center"
//                           gap="7px"
//                         >
//                           <Icon width={20} height={20} icon="tabler:phone" />
//                           {card.mobileNo}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </Stack>

            
//                   <Stack spacing={2} mt={3} alignItems="center">
//                     {/* <Button
//                       size="large"
//                       variant="text"
//                       color="primary"
//                       onClick={() => handleBookAppointmentClick(index)}
//                     >
//                       Book Appointment
//                     </Button>
//                     <Button
//                       size="large"
//                       variant="text"
//                       color="secondary"
//                       onClick={() => handleRateMentorClick(index)}
//                     >
//                       Rate Mentor
//                     </Button> */}


//                     {card.pendingAppointment === 0 ? (
//                       <Button size="large"
//                         variant="text"
//                         color="primary" onClick={() => handleBookAppointmentClick(index)}>
//                         Book Appointment
//                       </Button>
//                     ) : card.pendingAppointment === 1 ? (
//                       <Button size="large"
//                         variant="text"
//                         color="primary" onClick={() => handleRateMentorClick(index)}>
//                         Rate Mentor
//                       </Button>
//                     ) : null}


//                   </Stack>
//                 </CardContent>
//               </BlankCard>
//             </Grid>
//           </SwiperSlide>
          
//         ))}
//       </Swiper>
//       {openIndex !== null && (
//         <ModalComponent open={true} handleClose={handleClose} roleId={3} AuthCode={mentordata?.[openIndex]?.authCode}/>
//       )}


//       {openRatingIndex !== null && (
//         <RatingPopup open={true} handleClose={handleClose} />
//       )}
//     </Box>
//     )}
//     </>
//   );
// };

// const LoadingSkeleton = () => {
//   return (
//     <Box sx={{ position: "relative", width: "100%", padding: 0 }}>
//       <Swiper
//         modules={[Navigation]}
//         spaceBetween={20}
//         slidesPerView={4}
//         navigation
//         loop={true}
//         loopAdditionalSlides={4}
//         breakpoints={{
//           320: { slidesPerView: 1 },
//           600: { slidesPerView: 2 },
//           900: { slidesPerView: 3 },
//           1200: { slidesPerView: 4 },
//         }}
//       >
//         {[1, 2, 3, 4].map((item) => (
//           <SwiperSlide key={item}>
//             <Grid  size={{xs:12,sm:12,lg:12 }} >
//               <BlankCard>
//                 <CardContent sx={{ height: 450, cursor: "default" }}>
//                   <Skeleton
//                     variant="circular"
//                     width={100}
//                     height={100}
//                     sx={{ margin: "auto" }}
//                   />

//                   <Stack direction="row" spacing={2} mt={3} justifyContent="center">
//                     <Box textAlign="center" width="100%">
//                       <Box
//                         mb={2}
//                         p={1}
//                         borderRadius="24px"
//                         sx={{
//                           // backgroundColor: "primary.light",
//                           display: "flex",
//                           justifyContent: "center",
//                           alignItems: "center",
//                           width: "60%",
//                           margin: "auto",
//                         }}
//                       >
//                         <Skeleton variant="text" width="100%" height={40} />
//                       </Box>

//                       <Skeleton
//                         variant="text"
//                         width="80%"
//                         height={24}
//                         sx={{ margin: "auto", mb: 1 }}
//                       />
//                       <Skeleton
//                         variant="text"
//                         width="60%"
//                         height={20}
//                         sx={{ margin: "auto", mb: 1 }}
//                       />

//                       <Box
//                         display="flex"
//                         flexDirection="column"
//                         alignItems="center"
//                         mt={2}
//                         gap={1}
//                       >
//                         <Skeleton variant="text" width="60%" height={18} />
//                         <Skeleton variant="text" width="80%" height={18} />
//                         <Skeleton variant="text" width="50%" height={18} />
//                       </Box>
//                     </Box>
//                   </Stack>

//                   <Stack spacing={2} mt={3} alignItems="center">
//                     <Skeleton variant="rectangular" width={160} height={36} />
//                   </Stack>
//                 </CardContent>
//               </BlankCard>
//             </Grid>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </Box>
//   );
// };



// export default MentorContact;


"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/system";
import BlankCard from "../../shared/BlankCard";
import { decryptDataforResponse } from "../../../api/services/auth/Encrptdecrpt";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Skeleton, useTheme } from "@mui/material";
import { Icon } from "@iconify/react";
import ModalComponent from "./Popup/AppointmentModal/AppointmentModal";
import { getHeadDetailsAction } from "@/app/actions/homeAction/HeadDetails/getHeadDetailsAction";
import RatingPopup from "./Popup/AppointmentModal/RatingPopup";

const MentorContact = ({ onDataFetched }: any) => {
  const theme = useTheme();
  const isDataFetched = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();
  const [mentordata, setMentordata] = useState<any[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openRatingIndex, setOpenRatingIndex] = useState<number | null>(null);

  const handleBookAppointmentClick = (index: number) => {
    setOpenIndex(index);
    setOpenRatingIndex(null);
  };

  const handleRateMentorClick = (index: number) => {
    setOpenRatingIndex(index);
    setOpenIndex(null);
  };

  const handleClose = () => {
    setOpenIndex(null);
    setOpenRatingIndex(null);
  };

  useEffect(() => {
    const fetchPlacementData = async () => {
      if (isDataFetched.current) return;

      setLoading(true);
      try {
        const response = await getHeadDetailsAction();
        let splitValue = String(session?.user?.token).split("NEXT2121ANG");

        if (response.status === "success") {
          let apiData = response.ApiData;
          const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
          const parsedData = JSON.parse(decryptedData);
          setMentordata(parsedData);
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
  }, [onDataFetched, session?.user?.token]);

  const slidesPerView = Math.min(mentordata.length || 4, 4);

  return (
    <>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <Box sx={{ position: "relative", width: "100%", padding: 0 }}>
          <Swiper
            key={mentordata.length}
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={slidesPerView}
            navigation
            breakpoints={{
              320: { slidesPerView: 1 },
              600: { slidesPerView: 2 },
              900: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
          >
            {mentordata.map((card, index) => (
              <SwiperSlide key={index}>
                <Grid size={{xs:12,sm:12,lg:12 }} >
                  <BlankCard>
               <CardContent sx={{ height: 450, cursor: "default" }}>
                  {card.picture ? (
                    <img
                      src={`data:image/${card.picture.startsWith("/") ? "png" : "jpeg"
                        };base64,${card.picture}`}
                      alt="Mentor"
                      style={{
                        height: 100,
                        width: 100,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "auto",
                        borderRadius: "50px",
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  ) : (
                    <Avatar sx={{ width: 100, height: 100, margin: "auto" }} />
                  )}

                  <Stack direction="row" spacing={2} mt={3} justifyContent="center">
                    <Box textAlign="center">
                      <Box
                        mb={2}
                        p={1}
                        borderRadius="24px"
                        sx={{
                          backgroundColor: "primary.light",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            whiteSpace: "nowrap",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "24px",
                          }}
                        >
                          {card.head}
                        </Typography>
                      </Box>

                      <Typography
                        sx={{
                          fontSize: "14px",
                          whiteSpace: "nowrap",
                          fontWeight: "bold",
                        }}
                      >
                        {card.name}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "13px",
                          whiteSpace: "nowrap",
                          fontWeight: "bold",
                          height: "20px",
                        }}
                      >
                        {card.designation}
                      </Typography>

                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        mt={2}
                        gap={1}
                      >
                        <Typography
                          variant="subtitle2"
                          color="textSecondary"
                          fontSize={"12px"}
                        >
                          {card.division}
                        </Typography>

                        <Typography
                          variant="subtitle2"
                          color="textSecondary"
                          display="flex"
                          alignItems="center"
                          gap="7px"
                        >
                          <Icon width={20} height={20} icon="ic:outline-email" />
                          {card.staffEmail}
                        </Typography>

                        <Typography
                          variant="subtitle2"
                          color="textSecondary"
                          display="flex"
                          alignItems="center"
                          gap="7px"
                        >
                          <Icon width={20} height={20} icon="tabler:phone" />
                          {card.mobileNo}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>

            
                  <Stack spacing={2} mt={3} alignItems="center">
             


                    {card.pendingAppointment === 0 ? (
                      <Button size="large"
                        variant="text"
                        color="primary" onClick={() => handleBookAppointmentClick(index)}>
                        Book Appointment
                      </Button>
                    ) : card.pendingAppointment === 1 ? (
                      <Button size="large"
                        variant="text"
                        color="primary" onClick={() => handleRateMentorClick(index)}>
                        Rate Mentor
                      </Button>
                    ) : null}


                  </Stack>
                </CardContent>
                  </BlankCard>
                </Grid>
              </SwiperSlide>
            ))}
          </Swiper>

          {openIndex !== null && (
            <ModalComponent
              open={true}
              handleClose={handleClose}
              roleId={3}
              AuthCode={mentordata?.[openIndex]?.authCode}
            />
          )}
          {openRatingIndex !== null && <RatingPopup open={true} handleClose={handleClose} />}
        </Box>
      )}
    </>
  );
};

const LoadingSkeleton = () => {
  return (
    <Box sx={{ position: "relative", width: "100%", padding: 0 }}>
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={4}
        navigation
        breakpoints={{
          320: { slidesPerView: 1 },
          600: { slidesPerView: 2 },
          900: { slidesPerView: 3 },
          1200: { slidesPerView: 4 },
        }}
      >
        {[1, 2, 3, 4].map((item) => (
          <SwiperSlide key={item}>
            <Grid size={{xs:12,sm:12,lg:12 }} >
              <BlankCard>
                <CardContent sx={{ height: 450, cursor: "default" }}>
                  <Skeleton variant="circular" width={100} height={100} sx={{ margin: "auto" }} />
                  <Stack direction="row" spacing={2} mt={3} justifyContent="center">
                    <Box textAlign="center" width="100%">
                      <Box
                        mb={2}
                        p={1}
                        borderRadius="24px"
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          width: "60%",
                          margin: "auto",
                        }}
                      >
                        <Skeleton variant="text" width="100%" height={40} />
                      </Box>
                      <Skeleton variant="text" width="80%" height={24} sx={{ margin: "auto", mb: 1 }} />
                      <Skeleton variant="text" width="60%" height={20} sx={{ margin: "auto", mb: 1 }} />
                      <Box display="flex" flexDirection="column" alignItems="center" mt={2} gap={1}>
                        <Skeleton variant="text" width="60%" height={18} />
                        <Skeleton variant="text" width="80%" height={18} />
                        <Skeleton variant="text" width="50%" height={18} />
                      </Box>
                    </Box>
                  </Stack>
                  <Stack spacing={2} mt={3} alignItems="center">
                    <Skeleton variant="rectangular" width={160} height={36} />
                  </Stack>
                </CardContent>
              </BlankCard>
            </Grid>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default MentorContact;
