


// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import Box from "@mui/material/Box";
// import PageContainer from "@/app/components/container/PageContainer";
// import WelcomeCard from "./WelcomeCard";
// import TopCards from "./TopCards";
// import Slidershow from "./Slidershow";
// import SeatingPlan from "./SeatingPlan";
// import RecentPlaced from "./RecentlyPlaced";
// import Placement from "./Placement";
// import RulesCard from "./Rulescard";
// import UpcomingSchedules from "./UpcomingSchedules";
// import Announcements from "./Announcements";
// import MentorContact from "./MentorsContac";
// import SocialMedia from "./SocialMedia";
// import Attendenceper from "./Attenpercent/page";
// import { useSession } from "next-auth/react";
// import { decryptDataforResponse } from "../../../api/services/auth/Encrptdecrpt";
// import { getTodayPlacementAction } from "../../../actions/homeAction/TodayPlacement/getTodayPlacementAction";
// import { gettopcardAction } from "../../../actions/homeAction/topcard/gettopcardAction";
// import NotificationPopup from "@/app/components/views/NotificationPopup/page";
// import Grid from "@mui/material/Grid";
// import { useTheme } from "@mui/material/styles";
// import Card from "@mui/material/Card";
// import { AppState } from "@/store/store";
// import { CardContent, Divider, Skeleton, Stack } from "@mui/material";
// import { Icon } from "@iconify/react";
// import Scrollbar from "../../custom-scroll/Scrollbar";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import BlankCard from "../../shared/BlankCard";
// import { useSelector } from "react-redux";


// export default function HomePage({ onDataFetched }: any) {
//   const isDataFetched = useRef(false);
//   const [loading, setLoading] = useState<boolean>(true);
//   const { data: session } = useSession();
//   const [parsedData1, setParsedData1] = useState<any[]>([]);
//   const [parsedData2, setParsedData2] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchPlacementData = async () => {
//       if (isDataFetched.current) return;
//       setLoading(true);

//       try {
//         const response1 = await getTodayPlacementAction();
//         const response2 = await gettopcardAction();


//         let splitValue = String(session?.user?.token).split("NEXT2121ANG");
//         if (response1.status === "success" && response2.status === "success") {
//           let apiData1 = response1.ApiData;
//           let apiData2 = response2.ApiData;

//           const decryptedData1 = decryptDataforResponse(
//             apiData1,
//             splitValue[1]
//           );
//           const decryptedData2 = decryptDataforResponse(
//             apiData2,
//             splitValue[1]
//           );

//           const parsed1 = JSON.parse(decryptedData1);
//           const parsed2 = JSON.parse(decryptedData2);

//           setParsedData1(parsed1);
//           setParsedData2(parsed2);

//           // Send data to parent component via callback function
//           onDataFetched(parsed1, parsed2);
//         } else {
//           setError(response1.message || response2.message);
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Unknown error occurred");
//       } finally {
//         setLoading(false);
//         isDataFetched.current = true;
//       }
//     };

//     fetchPlacementData();
//   }, [onDataFetched, session]);




//   return (


//     <>

//       {loading ? (
//         <LoadingSkeleton />
//       ) : (



//         <PageContainer title="Student Dashboard" description="Student Dashboard">
//           <Box>
//             <NotificationPopup />
//             <Grid container spacing={3}>
//               {/* first row  */}
//               <Grid size={{ lg: 6, xs: 12, md: 12 }} >
//                 <WelcomeCard />
//               </Grid>

//               <Grid size={{ lg: 6, xs: 12, md: 12 }}>
//                 <TopCards counterData={parsedData2} />
//               </Grid>

//               {/* secound row  */}
//               <Grid size={{ lg: 7, xs: 12, md: 12 }}  >
//                 <Slidershow />
//               </Grid>

//               <Grid size={{ lg: 5, xs: 12, md: 12 }} >
//                 <Attendenceper />
//               </Grid>

//               {/* third row  */}
//               <Grid size={{ lg: 5, xs: 12, md: 12 }} >
//                 <RulesCard />
//               </Grid>

//               <Grid size={{ lg: 7, xs: 12, md: 12 }} >
//                 <UpcomingSchedules />
//               </Grid>

//               {/* fourth row  */}
//               <Grid size={{ lg: 3.5, xs: 12, md: 12 }} >
//                 <RecentPlaced placementdata={parsedData1} />
//               </Grid>

//               <Grid size={{ lg: 4, xs: 12, md: 12 }} >
//                 <Placement placementdata={parsedData1} />
//               </Grid>

//               <Grid size={{ lg: 4.5, xs: 12, md: 12 }} >
//                 <SeatingPlan counterData={parsedData2} />
//               </Grid>

//               {/* fifth row  */}
//               <Grid size={{ lg: 12, xs: 12, md: 12 }} >
//                 <Announcements />
//               </Grid>

//               {/* sixth row  */}
//               <Grid size={{ lg: 12, xs: 12, md: 12 }} >
//                 <MentorContact />
//               </Grid>

//               {/* seventh row  */}
//               <Grid size={{ lg: 12, xs: 12, md: 12 }} >
//                 <SocialMedia />
//               </Grid>
//             </Grid>
//           </Box>
//         </PageContainer>

//       )}
//     </>
//   );
// }








// const LoadingSkeleton = () => {
//   const theme = useTheme();
//   const customizer = useSelector((state: AppState) => state.customizer);
//   const borderColor = theme.palette.divider;

//   const skeletonArray1 = [1, 2, 3, 4];
//   const skeletonArray2 = [1, 2, 3, 4, 5, 6];

//   return (

//     <Box sx={{ px: 0, pt: 0 }}>

//       {/* 1 */}
//       <Grid container spacing={3}>
//         {/* first row  */}
//         <Grid size={{ lg: 6, xs: 12, md: 12 }} >

//           <Card
//             sx={{
//               height: { xs: "310px", sm: "140px", lg: "150px" },
//               mt: { xs: 2.5, lg: 0, md: 0, sm: 0 },
//               padding: 0,
//               border: !customizer.isCardShadow ? `1px solid ${borderColor}` : "none",
//               overflow: "unset",
//               display: "flex",
//               alignItems: "center",
//             }}
//             elevation={customizer.isCardShadow ? 9 : 0}
//             variant={!customizer.isCardShadow ? "outlined" : undefined}
//           >
//             <CardContent sx={{ width: "100%", py: 2 }}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   flexDirection: { xs: "column", sm: "row" },
//                   justifyContent: "center",
//                   alignItems: "center",
//                   gap: 2,
//                   width: "100%",
//                 }}
//               >
//                 {/* Avatar Skeleton */}
//                 <Skeleton
//                   variant="circular"
//                   width={82}
//                   height={82}
//                   sx={{ borderRadius: "10%", flexShrink: 0 }}
//                 />

//                 {/* Text Skeletons */}
//                 <Box
//                   sx={{
//                     flex: 1,
//                     textAlign: "center",
//                   }}
//                 >
//                   <Skeleton variant="text" height={30} width="60%" sx={{ mx: "auto" }} />
//                   <Skeleton variant="text" height={20} width="80%" sx={{ mx: "auto" }} />
//                   <Skeleton variant="text" height={20} width="70%" sx={{ mx: "auto" }} />
//                 </Box>

//                 {/* Button Skeleton */}
//                 <Skeleton variant="rectangular" width={90} height={36} />
//               </Box>
//             </CardContent>
//           </Card>

//         </Grid>

//         {/* 2 */}

//         <Grid container size={{ lg: 6, xs: 12, md: 12 }}>
//           {skeletonArray1.map((_, i) => (
//             // <Grid key={i} item xs={6} sm={6} md={4} lg={3}>
//             <Grid key={i} size={{ lg: 3, xs: 6, md: 4, sm: 6 }}>
//               <Card
//                 key={i}
//                 sx={{
//                   height: "150px",
//                   padding: 0,
//                   border: !customizer.isCardShadow ? `1px solid ${borderColor}` : "none",
//                   // backgroundColor: "primary.main",
//                   color: "white",
//                   position: "relative",
//                   overflow: "hidden",
//                 }}
//                 elevation={customizer.isCardShadow ? 9 : 0}
//                 variant={!customizer.isCardShadow ? "outlined" : undefined}
//               >
//                 {/* Simulated image */}
//                 {/* <Skeleton
//               variant="rectangular"
//               width={59}
//               height={81}
//               sx={{ position: "absolute", top: 0, left: 0 }}
//             /> */}

//                 <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 1 }}>
//                   {/* Simulated icon */}
//                   <Skeleton variant="circular" width={30} height={30} />

//                   {/* Simulated counter */}
//                   <Skeleton variant="text" width={40} height={30} />

//                   {/* Simulated subtitle */}
//                   <Skeleton variant="text" width={80} height={20} />
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>


//         {/* 3 */}

//         {/* secound row  */}
//         <Grid size={{ lg: 7, xs: 12, md: 12 }}  >
//           <Card sx={{ height: { lg: "367px" } }}>

//             <Stack direction="row" gap={2} sx={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
//               <Box
//                 sx={{
//                   position: "relative",
//                   width: "100%",
//                   height: { lg: "300px", md: "310px", sm: "150px", xs: "200px" },
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   borderRadius: "8px",
//                   overflow: "hidden",
//                 }}
//               >
//                 <Skeleton variant="rectangular" width="100%" height="100%" sx={{ position: "absolute", top: 0, left: 0 }} />
//                 <Icon icon="fluent:image-multiple-off-16-regular" width="60" height="60" color="#ccc" />
//               </Box>
//             </Stack>
//           </Card>
//         </Grid>



//         {/* 4 */}

//         <Grid size={{ lg: 5, xs: 12, md: 12 }} >
//           <Grid container spacing={3}>
//             {/* First row: two side-by-side cards */}
//             <Grid size={{ xs: 12, md: 6 }}  >
//               {/* First Card (left) */}
//               {/* <Box
//       sx={{
//         height: "100%",
//         borderRadius: 2,
//         p: 2,
//         boxShadow: 3,
//         backgroundColor: "#fff",
//       }}
//     > */}

//               <Card
//                 className="cardWithShadow"
//                 sx={{ height: { xs: "100%", sm: "100%", md: "100%", lg: "90%" } }}
//               >
//                 <Box>
//                   <Grid size={{ xs: 12, md: 12 }}>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       {/* Skeleton for header with icon and text */}
//                       <Box
//                         sx={{
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "space-between",
//                           marginTop: -3,
//                           paddingTop: "8px",
//                           paddingBottom: "8px",
//                           borderBottom: "1px solid #E0E0E0",
//                           borderRadius: "0",
//                           width: "100%",
//                         }}
//                       >
//                         {/* Left side: icon + text */}
//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                           <Skeleton variant="circular" width={24} height={24} />
//                           <Skeleton variant="text" width={60} height={28} />
//                         </Box>

//                         {/* Right side: CGPA text */}
//                         <Box
//                           display="flex"
//                           flexDirection="column"
//                           alignItems="flex-start"
//                           ml={2}
//                         >
//                           <Skeleton variant="text" width={40} height={24} />
//                         </Box>
//                       </Box>

//                       {/* Skeleton chart area */}
//                       <Box
//                         width="50%"
//                         height="200px"
//                         sx={{
//                           position: "relative",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           flexDirection: "column",
//                         }}
//                       >
//                         <Skeleton
//                           variant="circular"
//                           width={150}
//                           height={150}
//                           sx={{ mb: 1 }}
//                         />
//                       </Box>
//                     </Box>
//                   </Grid>
//                 </Box>
//               </Card>
//               {/* </Box> */}
//             </Grid>

//             <Grid size={{ xs: 12, md: 6 }} >
//               {/* Second Card (right) */}
//               <Card
//                 className="cardWithShadow"
//                 sx={{ height: { xs: "100%", sm: "100%", md: "100%", lg: "90%" } }}
//               >
//                 <Box>
//                   <Grid size={{ xs: 12, md: 12 }}>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       {/* Skeleton for header with icon and text */}
//                       <Box
//                         sx={{
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "space-between",
//                           marginTop: -3,
//                           paddingTop: "8px",
//                           paddingBottom: "8px",
//                           borderBottom: "1px solid #E0E0E0",
//                           borderRadius: "0",
//                           width: "100%",
//                         }}
//                       >
//                         {/* Left side: icon + text */}
//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                           <Skeleton variant="circular" width={24} height={24} />
//                           <Skeleton variant="text" width={60} height={28} />
//                         </Box>

//                         {/* Right side: CGPA text */}
//                         <Box
//                           display="flex"
//                           flexDirection="column"
//                           alignItems="flex-start"
//                           ml={2}
//                         >
//                           <Skeleton variant="text" width={40} height={24} />
//                         </Box>
//                       </Box>

//                       {/* Skeleton chart area */}
//                       <Box
//                         width="50%"
//                         height="200px"
//                         sx={{
//                           position: "relative",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           flexDirection: "column",
//                         }}
//                       >
//                         <Skeleton
//                           variant="circular"
//                           width={150}
//                           height={150}
//                           sx={{ mb: 1 }}
//                         />
//                       </Box>
//                     </Box>
//                   </Grid>
//                 </Box>
//               </Card>
//             </Grid>

//             {/* Second row: full-width third card */}
//             <Grid size={{ xs: 12 }} >
//               <Card
//                 className="cardWithShadow"
//                 sx={{
//                   marginTop: { xs: 0, lg: -3 },
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "space-between",
//                   padding: 2,
//                 }}
//               >
//                 <Box ml={2} display="flex" justifyContent="center" alignItems="center">
//                   {/* Left: Icon + Text */}
//                   <Box display="flex" alignItems="center">
//                     {/* Icon Skeleton */}
//                     <Box px={1}>
//                       <Skeleton variant="rectangular" width={55} height={55} />
//                     </Box>

//                     {/* Text Skeleton */}
//                     <Box display="flex" flexDirection="column" ml={2}>
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                         <Skeleton variant="text" width={60} height={20} />
//                         <Skeleton variant="text" width={40} height={20} />
//                       </Box>
//                     </Box>
//                   </Box>

//                   {/* Right: Pay Fee Button Skeleton */}
//                   <Skeleton
//                     variant="rounded"
//                     width={80}
//                     height={36}
//                     sx={{ marginLeft: "auto" }}
//                   />
//                 </Box>
//               </Card>
//             </Grid>
//           </Grid>



//         </Grid>


//         {/* 5 */}

//         {/* third row  */}
//         <Grid size={{ lg: 5, xs: 12, md: 12 }} >
//           <Grid container spacing={3}>
//             {skeletonArray2.map((_, i) => (
//               <Grid key={i} size={{ xs: 6, sm: 6, md: 4 }}>
//                 <Card
//                   sx={{
//                     height: "150px",
//                     padding: 0,
//                     border: !customizer.isCardShadow ? `1px solid ${borderColor}` : "none",
//                     // backgroundColor: "primary.main",
//                     color: "white",
//                     position: "relative",
//                   }}
//                   elevation={customizer.isCardShadow ? 9 : 0}
//                   variant={!customizer.isCardShadow ? "outlined" : undefined}
//                 >
//                   {/* Simulated top image */}
//                   {/* <Skeleton
//               variant="rectangular"
//               width={59}
//               height={81}
//               sx={{
//                 position: "absolute",
//                 top: 8,
//                 left: 8,
//                 borderRadius: 1,
//               }}
//             /> */}

//                   <CardContent
//                     sx={{
//                       textAlign: "center",
//                       height: "100%",
//                       display: "flex",
//                       flexDirection: "column",
//                       justifyContent: "center",
//                       alignItems: "center",
//                       gap: 1.2,
//                     }}
//                   >
//                     <Skeleton variant="circular" width={30} height={30} />
//                     <Skeleton variant="text" width={40} height={24} />
//                     <Skeleton variant="text" width={80} height={20} />
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Grid>


//         {/* 6 */}

//         <Grid size={{ lg: 7, xs: 12, md: 12 }} >
//           <Card>
//             <Box textAlign="center" mb={1.5}>
//               <Skeleton variant="text" width="50%" height={30} sx={{ mx: "auto" }} />
//             </Box>
//             <Skeleton variant="rounded" width="100%" height={108} sx={{ mb: 1 }} />
//             <Skeleton variant="rounded" width="100%" height={108} />
//           </Card>
//         </Grid>


//         {/* 7 */}

//         {/* fourth row  */}
//         <Grid size={{ lg: 3.5, xs: 12, md: 12 }} >
//           <Card className="cardWithShadow" sx={{ height: "246px", padding: 0 }}>
//             {/* Header Skeleton */}
//             <Box
//               sx={{
//                 paddingTop: "8px",
//                 paddingBottom: "8px",
//                 borderRadius: "0",
//                 borderBottom: "1px solid #E0E0E0",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 gap: "8px",
//               }}
//             >
//               <Skeleton variant="circular" width={25} height={25} />
//               <Skeleton variant="text" width={120} height={20} />
//             </Box>

//             {/* Horizontally scrolling skeletons */}
//             <Box sx={{ display: "flex", justifyContent: "center", overflow: "hidden", whiteSpace: "nowrap", position: "relative" }}>
//               {/* <Box sx={{ display: "flex", gap: { xs: 1.5, lg: 1.1 }, padding: 2 }}> */}
//               {[1, 2, 3].map((item) => (
//                 <Card
//                   key={item}
//                   sx={{
//                     boxShadow: "none",
//                     width: 180,
//                     height: 170,
//                     flexShrink: 0,
//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     p: 2,
//                   }}
//                 >
//                   <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1 }} />
//                   <Skeleton variant="text" width="60%" height={18} sx={{ mb: 1 }} />
//                   <Skeleton variant="text" width="50%" height={18} />
//                 </Card>
//               ))}
//             </Box>
//             {/* </Box> */}
//           </Card>
//         </Grid>

//         {/* 8 */}

//         <Grid size={{ lg: 4, xs: 12, md: 12 }} >
//           <Card sx={{ height: { xs: "410px", lg: "246px" }, padding: 0, borderRadius: "12px" }}>
//             {/* Header Skeleton */}
//             <Box
//               sx={{
//                 paddingTop: "8px",
//                 paddingBottom: "8px",
//                 borderRadius: "0",
//                 borderBottom: "1px solid #E0E0E0",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 gap: "8px",
//               }}
//             >
//               <Skeleton variant="circular" width={24} height={24} />
//               <Skeleton variant="text" width={160} height={20} />
//             </Box>

//             {/* Scrollable Content Skeleton */}
//             <Scrollbar sx={{ height: { xs: "100%", lg: "100%" } }}>
//               <Box
//                 sx={{
//                   height: { xs: "300px", lg: "100%" },
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 2,
//                   padding: 2,
//                   margin: 2,
//                 }}
//               >
//                 {[1, 2, 3].map((item) => (
//                   <React.Fragment key={item}>
//                     <Box
//                       sx={{

//                         paddingLeft: 2,
//                       }}
//                     >
//                       <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
//                       <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
//                       <Skeleton variant="text" width="70%" height={20} />
//                     </Box>
//                     {item !== 3 && <Divider />}
//                   </React.Fragment>
//                 ))}
//               </Box>
//             </Scrollbar>
//           </Card>
//         </Grid>

//         {/* 9 */}

//         <Grid size={{ lg: 4.5, xs: 12, md: 12 }} >
//           <Card sx={{ height: { xs: "410px", lg: "246px" }, padding: 0, borderRadius: "12px" }}>
//             {/* Header Skeleton */}
//             <Box
//               sx={{
//                 paddingTop: "8px",
//                 paddingBottom: "8px",
//                 borderRadius: 0,
//                 borderBottom: "1px solid #E0E0E0",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 position: "relative",
//               }}
//             >
//               <Skeleton variant="circular" width={25} height={25} />
//               <Skeleton variant="text" width={160} height={20} sx={{ mx: 2 }} />
//               <Box sx={{ position: "absolute", right: 10 }}>
//                 <Skeleton variant="circular" width={25} height={25} />
//               </Box>
//             </Box>

//             {/* Scrollable Content Skeleton */}
//             <Scrollbar sx={{ height: { xs: "100%", lg: "100%" } }}>
//               <Box
//                 sx={{
//                   height: { xs: "300px", lg: "100%" },
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 2,
//                   padding: 2,
//                   margin: 2,
//                 }}
//               >
//                 {[1, 2, 3].map((item) => (
//                   <React.Fragment key={item}>
//                     <Box sx={{ cursor: "default" }}>
//                       {/* Course Name Skeleton */}
//                       <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />

//                       {/* Inline fields: Code, Date, Time */}
//                       <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
//                         <Skeleton variant="text" width={90} height={20} />
//                         <Skeleton variant="text" width={90} height={20} />
//                         <Skeleton variant="text" width={90} height={20} />
//                       </Box>
//                     </Box>
//                     {item !== 3 && <Divider />}
//                   </React.Fragment>
//                 ))}
//               </Box>
//             </Scrollbar>
//           </Card>
//         </Grid>

//         {/* 10 */}

//         {/* fifth row  */}
//         <Grid size={{ lg: 12, xs: 12, md: 12 }} >
//           <Card sx={{ borderRadius: "12px", padding: 2 }}>
//             {/* Header Title Skeleton */}
//             <Box textAlign="center" mb={2}>
//               <Skeleton variant="circular" width={25} height={25} sx={{ mx: "auto" }} />
//               <Skeleton variant="text" width={180} height={30} sx={{ mx: "auto", mt: 1 }} />
//             </Box>

//             {/* Tabs Skeleton */}
//             <Box sx={{ display: "flex", gap: 2, px: 2, mb: 2 }}>
//               {[1, 2, 3].map((_, i) => (
//                 <Skeleton key={i} variant="rectangular" width={130} height={35} />
//               ))}
//             </Box>

//             {/* Scrollable Skeleton Panel */}
//             <Box
//               sx={{
//                 border: "1px solid #B6CBBD",
//                 borderRadius: "8px",
//                 height: "500px",
//                 overflow: "hidden",
//               }}
//             >
//               <Scrollbar sx={{ height: "100%", p: 2 }}>
//                 {[1, 2, 3].map((_, i) => (
//                   <React.Fragment key={i}>
//                     <Box sx={{ mb: 2 }}>
//                       {/* Accordion Summary Skeleton */}
//                       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                           <Skeleton variant="circular" width={14} height={14} />
//                           <Skeleton variant="text" width={220} height={20} />
//                         </Box>
//                         <Skeleton variant="text" width={100} height={16} />
//                       </Box>

//                       {/* Accordion Details Skeleton */}
//                       <Box sx={{ pl: 3 }}>
//                         <Skeleton variant="text" width="100%" height={20} />
//                         <Skeleton variant="text" width="90%" height={20} sx={{ mt: 1 }} />
//                         <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />

//                         {/* File section */}
//                         <Skeleton variant="text" width="40%" height={20} sx={{ mt: 2 }} />
//                         {[1, 2].map((j) => (
//                           <Skeleton key={j} variant="text" width="70%" height={18} sx={{ mt: 1 }} />
//                         ))}

//                         {/* Uploader Info */}
//                         {/* <Skeleton variant="text" width="30%" height={18} sx={{ mt: 2 }} />
//                   <Skeleton variant="text" width="50%" height={18} />
//                   <Skeleton variant="text" width="40%" height={18} /> */}
//                       </Box>
//                     </Box>
//                     {i !== 2 && <Divider />}
//                   </React.Fragment>
//                 ))}
//               </Scrollbar>
//             </Box>
//           </Card>
//         </Grid>

//         {/* 11 */}

//         {/* sixth row  */}
//         <Grid size={{ lg: 12, xs: 12, md: 12 }} >
//           <Box sx={{ position: "relative", width: "100%", padding: 0 }}>
//             <Swiper
//               modules={[Navigation]}
//               spaceBetween={20}
//               slidesPerView={4}
//               navigation
//               loop={true}
//               loopAdditionalSlides={4}
//               breakpoints={{
//                 320: { slidesPerView: 1 },
//                 600: { slidesPerView: 2 },
//                 900: { slidesPerView: 3 },
//                 1200: { slidesPerView: 4 },
//               }}
//             >
//               {[1, 2, 3, 4].map((item) => (
//                 <SwiperSlide key={item}>
//                   <Grid size={{ xs: 12, sm: 12, lg: 12 }}>
//                     <BlankCard>
//                       <CardContent sx={{ height: 450, cursor: "default" }}>
//                         <Skeleton
//                           variant="circular"
//                           width={100}
//                           height={100}
//                           sx={{ margin: "auto" }}
//                         />

//                         <Stack direction="row" spacing={2} mt={3} justifyContent="center">
//                           <Box textAlign="center" width="100%">
//                             <Box
//                               mb={2}
//                               p={1}
//                               borderRadius="24px"
//                               sx={{
//                                 // backgroundColor: "primary.light",
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 alignItems: "center",
//                                 width: "60%",
//                                 margin: "auto",
//                               }}
//                             >
//                               <Skeleton variant="text" width="100%" height={40} />
//                             </Box>

//                             <Skeleton
//                               variant="text"
//                               width="80%"
//                               height={24}
//                               sx={{ margin: "auto", mb: 1 }}
//                             />
//                             <Skeleton
//                               variant="text"
//                               width="60%"
//                               height={20}
//                               sx={{ margin: "auto", mb: 1 }}
//                             />

//                             <Box
//                               display="flex"
//                               flexDirection="column"
//                               alignItems="center"
//                               mt={2}
//                               gap={1}
//                             >
//                               <Skeleton variant="text" width="60%" height={18} />
//                               <Skeleton variant="text" width="80%" height={18} />
//                               <Skeleton variant="text" width="50%" height={18} />
//                             </Box>
//                           </Box>
//                         </Stack>

//                         <Stack spacing={2} mt={3} alignItems="center">
//                           <Skeleton variant="rectangular" width={160} height={36} />
//                         </Stack>
//                       </CardContent>
//                     </BlankCard>
//                   </Grid>
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           </Box>
//         </Grid>

//         {/* 12 */}

//         {/* seventh row  */}
//         <Grid size={{ lg: 12, xs: 12, md: 12 }} >
//           {/* <DashboardCard> */}
//           <Card
//             sx={{
//               height: "100%",
//               padding: 0,
//               borderRadius: "12px",
//               boxShadow: 3,
//             }}
//           >
//             {/* Header Skeleton */}
//             <Box
//               sx={{
//                 paddingTop: "10px",
//                 paddingBottom: "10px",
//                 borderRadius: 0,
//                 borderBottom: "1px solid #E0E0E0",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 position: "relative",
//               }}
//             >
//               <Skeleton variant="circular" width={25} height={25} />
//               <Skeleton variant="text" width={160} height={24} sx={{ mx: 2 }} />
//             </Box>

//             {/* Instagram Feed Skeleton */}
//             <Box sx={{ width: "100%", mt: 2, mb: 2, p: 2 }}>
//               <Skeleton
//                 variant="rectangular"
//                 width="100%"
//                 height={400}
//                 sx={{ borderRadius: "8px" }}
//               />
//             </Box>
//           </Card>
//           {/* </DashboardCard> */}
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };




// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import Box from "@mui/material/Box";
// import PageContainer from "@/app/components/container/PageContainer";
// import WelcomeCard from "./WelcomeCard";
// import TopCards from "./TopCards";
// import Slidershow from "./Slidershow";
// import SeatingPlan from "./SeatingPlan";
// import RecentPlaced from "./RecentlyPlaced";
// import Placement from "./Placement";
// import RulesCard from "./Rulescard";
// import UpcomingSchedules from "./UpcomingSchedules";
// import Announcements from "./Announcements";
// import MentorContact from "./MentorsContac";
// import SocialMedia from "./SocialMedia";
// import Attendenceper from "./Attenpercent/page";
// import { useSession } from "next-auth/react";
// import { decryptDataforResponse } from "../../../api/services/auth/Encrptdecrpt";
// import { getTodayPlacementAction } from "../../../actions/homeAction/TodayPlacement/getTodayPlacementAction";
// import { gettopcardAction } from "../../../actions/homeAction/topcard/gettopcardAction";
// import NotificationPopup from "@/app/components/views/NotificationPopup/page";
// import Grid from "@mui/material/Grid";

// export default function HomePage({ onDataFetched }: any) {
//   const isDataFetched = useRef(false);
//   const [loading, setLoading] = useState<boolean>(true);
//   const { data: session } = useSession();
//   const [parsedData1, setParsedData1] = useState<any[]>([]);
//   const [parsedData2, setParsedData2] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);


//   ////Comments Ravi pandey
//   useEffect(() => {
//     const fetchPlacementData = async () => {
//       if (isDataFetched.current) return;

//       try {
//         setLoading(true);
//         const response1 = await getTodayPlacementAction();
//         const response2 = await gettopcardAction();

//         let splitValue = String(session?.user?.token).split("NEXT2121ANG");
//         if (response1.status === "success" && response2.status === "success") {
//           let apiData1 = response1.ApiData;
//           let apiData2 = response2.ApiData;
//           const decryptedData1 = decryptDataforResponse(
//             apiData1,
//             splitValue[1]
//           );
//           const decryptedData2 = decryptDataforResponse(
//             apiData2,
//             splitValue[1]
//           );

//           const parsed1 = JSON.parse(decryptedData1);
//           const parsed2 = JSON.parse(decryptedData2);

//           setParsedData1(parsed1);
//           setParsedData2(parsed2);

//           // Send data to parent component via callback function
//           onDataFetched(parsed1, parsed2);
//         } else {
//           setError(response1.message || response2.message);
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Unknown error occurred");
//       } finally {
//         setLoading(false);
//         isDataFetched.current = true;
//       }
//     };

//     fetchPlacementData();
//   }, [onDataFetched, session]);

//   return (
//     <PageContainer title="Student Dashboard" description="Student Dashboard">
//       <Box>
//       <NotificationPopup />
//         <Grid container spacing={3}>
//           {/* first row  */}
//           <Grid size={{ lg: 6, xs: 12, md: 12 }} >
//             <WelcomeCard />
//           </Grid>

//           <Grid size    ={{ lg: 6, xs: 12, md: 12 }}>
//             <TopCards counterData={parsedData2} />
//           </Grid>

//           {/* secound row  */}
//           <Grid size={{ lg: 7, xs: 12, md: 12 }}  >
//             <Slidershow />
//           </Grid>

//           <Grid  size={{ lg: 5, xs: 12, md: 12 }} >
//             <Attendenceper />
//           </Grid>

//           {/* third row  */}
//           <Grid size={{ lg: 5, xs: 12, md: 12 }} >
//             <RulesCard />
//           </Grid>

//           <Grid size ={{ lg: 7, xs: 12, md: 12 }} >
//             <UpcomingSchedules />
//           </Grid>

//           {/* fourth row  */}
//           <Grid size    ={{ lg: 3.5, xs: 12, md: 12 }} >
//             <RecentPlaced placementdata={parsedData1} />
//           </Grid>

//           <Grid size    ={{ lg: 4, xs: 12, md: 12 }} >
//             <Placement placementdata={parsedData1} />
//           </Grid>

//           <Grid size    ={{ lg: 4.5, xs: 12, md: 12 }} >
//             <SeatingPlan counterData={parsedData2} />
//           </Grid>

//           {/* fifth row  */}
//           <Grid size={{ lg: 12, xs: 12, md: 12 }} >
//             <Announcements />
//           </Grid>

//           {/* sixth row  */}
//           <Grid size={{ lg: 12, xs: 12, md: 12 }} >
//             <MentorContact />
//           </Grid>

//           {/* seventh row  */}
//           <Grid size    ={{ lg: 12, xs: 12, md: 12 }} >
//             <SocialMedia />
//           </Grid>
//         </Grid>
//       </Box>
//     </PageContainer>
//   );
// }





"use client";
import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import PageContainer from "@/app/components/container/PageContainer";
import WelcomeCard from "./WelcomeCard";
import TopCards from "./TopCards";
import Slidershow from "./Slidershow";
import SeatingPlan from "./SeatingPlan";
import RecentPlaced from "./RecentlyPlaced";
import Placement from "./Placement";
import RulesCard from "./Rulescard";
import UpcomingSchedules from "./UpcomingSchedules";
import Announcements from "./Announcements";
import MentorContact from "./MentorsContac";
import SocialMedia from "./SocialMedia";
import Attendenceper from "./AttendanceCgpa/attendancecgpa";
import { useSession } from "next-auth/react";
import { decryptDataforResponse } from "../../../api/services/auth/Encrptdecrpt";
import { getTodayPlacementAction } from "../../../actions/homeAction/TodayPlacement/getTodayPlacementAction";

import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import { AppState } from "@/store/store";
import { CardContent, Divider, Skeleton, Stack } from "@mui/material";
import { Icon } from "@iconify/react";
import Scrollbar from "../../custom-scroll/Scrollbar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import BlankCard from "../../shared/BlankCard";
import { useSelector } from "react-redux";
import LazySectionWrapper from "@/utils/lazyloading";
import Ranking from "./Ranking";
import ShowBirthday from "../NotificationPopup/BIrthdayLayout/ShowBirthday";
import PlacementDrivePopup from "../NotificationPopup/PlacementDrivePopup/PlacementDrivePopup";
import FeeextensionPopup from "../NotificationPopup/FeeextensionPopup/FeeextensionPopup";


export default function HomePage({ onDataFetched }: any) {
  const isDataFetched = useRef(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();
  const [parsedData1, setParsedData1] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    const fetchPlacementData = async () => {
      if (isDataFetched.current) return;
      setLoading(true);

      try {
        const response1 = await getTodayPlacementAction();

        let splitValue = String(session?.user?.token).split("NEXT2121ANG");
        if (response1.status === "success") {
          let apiData1 = response1.ApiData;
          const decryptedData1 = decryptDataforResponse(
            apiData1,
            splitValue[1]
          );


          const parsed1 = JSON.parse(decryptedData1);

          setParsedData1(parsed1);

          onDataFetched(parsed1);
        } else {
          setError(response1.message);
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




  return (


    <>

      {loading ? (
        <LoadingSkeleton />
      ) : (



        <PageContainer title="Student Dashboard" description="Student Dashboard">
          <Box>
            <ShowBirthday />
            <FeeextensionPopup />
            <PlacementDrivePopup  />

            <Grid container spacing={3}>
              {/* first row  */}
              <Grid size={{ lg: 6, xs: 12, md: 12 }} >
                <LazySectionWrapper>
                  <WelcomeCard />
                </LazySectionWrapper>
              </Grid>

              <Grid size={{ lg: 6, xs: 12, md: 12 }}>
                <LazySectionWrapper>
                  <TopCards />
                </LazySectionWrapper>
              </Grid>

              {/* secound row  */}
              <Grid size={{ lg: 7, xs: 12, md: 12 }}  >
                <LazySectionWrapper>
                  <Slidershow />
                </LazySectionWrapper>
              </Grid>

              <Grid size={{ lg: 5, xs: 12, md: 12 }} >
                <LazySectionWrapper>
                  <Attendenceper />
                </LazySectionWrapper>
              </Grid>


              <Grid size={{ xs: 12, lg: 12 }} >
                <LazySectionWrapper>
                  <Ranking />
                </LazySectionWrapper>
              </Grid>

              {/* third row  */}
              <Grid size={{ lg: 5, xs: 12, md: 12 }} >
                <LazySectionWrapper>
                  <RulesCard />
                </LazySectionWrapper>
              </Grid>

              <Grid size={{ lg: 7, xs: 12, md: 12 }} >
                <LazySectionWrapper>
                  <UpcomingSchedules />
                </LazySectionWrapper>
              </Grid>

              {/* fourth row  */}
              <Grid size={{ lg: 3.5, xs: 12, md: 12 }} >
                <LazySectionWrapper>
                  <RecentPlaced placementdata={parsedData1} />
                </LazySectionWrapper>
              </Grid>

              <Grid size={{ lg: 4, xs: 12, md: 12 }} >
                <LazySectionWrapper>
                  <Placement placementdata={parsedData1} />
                </LazySectionWrapper>
              </Grid>

              <Grid size={{ lg: 4.5, xs: 12, md: 12 }} >
                <LazySectionWrapper>
                  <SeatingPlan />
                </LazySectionWrapper>
              </Grid>

              {/* fifth row  */}
              <Grid size={{ lg: 12, xs: 12, md: 12 }} >
                <LazySectionWrapper>
                  <Announcements />
                </LazySectionWrapper>
              </Grid>

              {/* sixth row  */}
              <Grid size={{ lg: 12, xs: 12, md: 12 }} >
                <LazySectionWrapper>
                  <MentorContact />
                </LazySectionWrapper>
              </Grid>

              {/* seventh row  */}
              <Grid size={{ lg: 12, xs: 12, md: 12 }} >
                <LazySectionWrapper>
                  <SocialMedia />
                </LazySectionWrapper>
              </Grid>
            </Grid>
          </Box>
        </PageContainer>

      )}
    </>
  );
}








const LoadingSkeleton = () => {
  const theme = useTheme();
  const customizer = useSelector((state: AppState) => state.customizer);
  const borderColor = theme.palette.divider;

  const skeletonArray1 = [1, 2, 3, 4];
  const skeletonArray2 = [1, 2, 3, 4, 5, 6];

  return (

    <Box sx={{ px: 0, pt: 0 }}>

      {/* 1 */}
      <Grid container spacing={3}>
        {/* first row  */}
        <Grid size={{ lg: 6, xs: 12, md: 12 }} >

          <Card
            sx={{
              height: { xs: "310px", sm: "140px", lg: "150px" },
              mt: { xs: 2.5, lg: 0, md: 0, sm: 0 },
              padding: 0,
              border: !customizer.isCardShadow ? `1px solid ${borderColor}` : "none",
              overflow: "unset",
              display: "flex",
              alignItems: "center",
            }}
            elevation={customizer.isCardShadow ? 9 : 0}
            variant={!customizer.isCardShadow ? "outlined" : undefined}
          >
            <CardContent sx={{ width: "100%", py: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                }}
              >
                {/* Avatar Skeleton */}
                <Skeleton
                  variant="circular"
                  width={82}
                  height={82}
                  sx={{ borderRadius: "10%", flexShrink: 0 }}
                />

                {/* Text Skeletons */}
                <Box
                  sx={{
                    flex: 1,
                    textAlign: "center",
                  }}
                >
                  <Skeleton variant="text" height={30} width={100} sx={{ mx: "auto" }} />
                  <Skeleton variant="text" height={20} width={120} sx={{ mx: "auto" }} />
                  <Skeleton variant="text" height={20} width={140} sx={{ mx: "auto" }} />
                </Box>

                {/* Button Skeleton */}
                <Skeleton variant="rectangular" width={90} height={36} />
              </Box>
            </CardContent>
          </Card>

        </Grid>

        {/* 2 */}

        <Grid container size={{ lg: 6, xs: 12, md: 12 }}>
          {skeletonArray1.map((_, i) => (
            // <Grid key={i} item xs={6} sm={6} md={4} lg={3}>
            <Grid key={i} size={{ lg: 3, xs: 6, md: 4, sm: 6 }}>
              <Card
                key={i}
                sx={{
                  height: "150px",
                  padding: 0,
                  border: !customizer.isCardShadow ? `1px solid ${borderColor}` : "none",
                  // backgroundColor: "primary.main",
                  color: "white",
                  position: "relative",
                  overflow: "hidden",
                }}
                elevation={customizer.isCardShadow ? 9 : 0}
                variant={!customizer.isCardShadow ? "outlined" : undefined}
              >
                {/* Simulated image */}
                {/* <Skeleton
              variant="rectangular"
              width={59}
              height={81}
              sx={{ position: "absolute", top: 0, left: 0 }}
            /> */}

                <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 1 }}>
                  {/* Simulated icon */}
                  <Skeleton variant="circular" width={30} height={30} />

                  {/* Simulated counter */}
                  <Skeleton variant="text" width={40} height={30} />

                  {/* Simulated subtitle */}
                  <Skeleton variant="text" width={80} height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>


        {/* 3 */}

        {/* secound row  */}
        <Grid size={{ lg: 7, xs: 12, md: 12 }}  >
          <Card sx={{ height: { lg: "367px" } }}>

            <Stack direction="row" gap={2} sx={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: { lg: "300px", md: "310px", sm: "150px", xs: "200px" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <Skeleton variant="rectangular" width="100%" height="100%" sx={{ position: "absolute", top: 0, left: 0 }} />
                <Icon icon="fluent:image-multiple-off-16-regular" width="60" height="60" color="#ccc" />
              </Box>
            </Stack>
          </Card>
        </Grid>



        {/* 4 */}

        <Grid size={{ lg: 5, xs: 12, md: 12 }} >
          <Grid container spacing={3}>
            {/* First row: two side-by-side cards */}
            <Grid size={{ xs: 12, md: 6 }}  >
              {/* First Card (left) */}
              {/* <Box
      sx={{
        height: "100%",
        borderRadius: 2,
        p: 2,
        boxShadow: 3,
        backgroundColor: "#fff",
      }}
    > */}

              <Card
                className="cardWithShadow"
                sx={{ height: { xs: "100%", sm: "100%", md: "100%", lg: "90%" } }}
              >
                <Box>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {/* Skeleton for header with icon and text */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: -3,
                          paddingTop: "8px",
                          paddingBottom: "8px",
                          borderBottom: "1px solid #E0E0E0",
                          borderRadius: "0",
                          width: "100%",
                        }}
                      >
                        {/* Left side: icon + text */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Skeleton variant="circular" width={24} height={24} />
                          <Skeleton variant="text" width={60} height={28} />
                        </Box>

                        {/* Right side: CGPA text */}
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="flex-start"
                          ml={2}
                        >
                          <Skeleton variant="text" width={40} height={24} />
                        </Box>
                      </Box>

                      {/* Skeleton chart area */}
                      <Box
                        width="50%"
                        height="200px"
                        sx={{
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <Skeleton
                          variant="circular"
                          width={150}
                          height={150}
                          sx={{ mb: 1 }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Box>
              </Card>
              {/* </Box> */}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} >
              {/* Second Card (right) */}
              <Card
                className="cardWithShadow"
                sx={{ height: { xs: "100%", sm: "100%", md: "100%", lg: "90%" } }}
              >
                <Box>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {/* Skeleton for header with icon and text */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: -3,
                          paddingTop: "8px",
                          paddingBottom: "8px",
                          borderBottom: "1px solid #E0E0E0",
                          borderRadius: "0",
                          width: "100%",
                        }}
                      >
                        {/* Left side: icon + text */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Skeleton variant="circular" width={24} height={24} />
                          <Skeleton variant="text" width={60} height={28} />
                        </Box>

                        {/* Right side: CGPA text */}
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="flex-start"
                          ml={2}
                        >
                          <Skeleton variant="text" width={40} height={24} />
                        </Box>
                      </Box>

                      {/* Skeleton chart area */}
                      <Box
                        width="50%"
                        height="200px"
                        sx={{
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <Skeleton
                          variant="circular"
                          width={150}
                          height={150}
                          sx={{ mb: 1 }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Box>
              </Card>
            </Grid>

            {/* Second row: full-width third card */}
            <Grid size={{ xs: 12 }} >
              <Card
                className="cardWithShadow"
                sx={{
                  marginTop: { xs: 0, lg: -3 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: 2,
                }}
              >
                <Box ml={2} display="flex" justifyContent="center" alignItems="center">
                  {/* Left: Icon + Text */}
                  <Box display="flex" alignItems="center">
                    {/* Icon Skeleton */}
                    <Box px={1}>
                      <Skeleton variant="rectangular" width={55} height={55} />
                    </Box>

                    {/* Text Skeleton */}
                    <Box display="flex" flexDirection="column" ml={2}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Skeleton variant="text" width={60} height={20} />
                        <Skeleton variant="text" width={40} height={20} />
                      </Box>
                    </Box>
                  </Box>

                  {/* Right: Pay Fee Button Skeleton */}
                  <Skeleton
                    variant="rounded"
                    width={80}
                    height={36}
                    sx={{ marginLeft: "auto" }}
                  />
                </Box>
              </Card>
            </Grid>
          </Grid>



        </Grid>



        <Grid container size={{ lg: 12, xs: 12, }}> <Box sx={{ position: "relative", width: "100%", padding: 0 }}>
          {/* Internal CSS for custom navigation arrows */}
          <style>
            {`
          .swiper-button-next,
          .swiper-button-prev {
            width: 16px !important; 
            height: 16px !important; 
            background-size: 16px !important; 
          }

          .swiper-button-next:after,
          .swiper-button-prev:after {
            font-size: 18px !important; 
            margin-top:28px;
          }
        `}
          </style>

          <Swiper
            key={1} // Keep this as a static number for the skeleton since it’s just the skeleton loading
            modules={[Navigation]}
            spaceBetween={18}
            slidesPerView={3}
            navigation
            loop={true}
            loopAdditionalSlides={4}
            breakpoints={{
              320: { slidesPerView: 1 },
              600: { slidesPerView: 1 },
              900: { slidesPerView: 3 },
              1200: { slidesPerView: 3 },
            }}
          >
            <Grid container spacing={0}>
              {[...Array(3)].map((_, index) => (
                <SwiperSlide key={index}>
                  <BlankCard>
                    <Box sx={{ margin: 1.5 }}>
                      <Stack direction="row" spacing={0} alignItems="center" justifyContent="space-between">

                        {/* Avatar + Title */}
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ marginLeft: { lg: 2.5, xs: 3 } }}>
                          <Skeleton variant="circular" width={30} height={30} />
                          <Stack spacing={0}>
                            <Skeleton variant="text" width={100} height={20} />
                          </Stack>
                        </Stack>

                        {/* Progress Bar and Percent */}
                        <Stack direction="row" alignItems="flex-start" sx={{ gap: 1, display: "flex", alignItems: "center", justifyContent: "center", minWidth: 100 }}>
                          <Skeleton variant="text" width={30} height={30} />
                          <Skeleton variant="rectangular" width={80} height={5} />
                        </Stack>

                        {/* Menu Icon */}
                        <Box sx={{ marginRight: { xs: 2.5, lg: 2 } }}>
                          <Skeleton variant="rectangular" width={5} height={25} />
                        </Box>

                      </Stack>

                      {/* Location */}
                      <Skeleton variant="text" width="80%" height={20} />
                    </Box>
                  </BlankCard>
                </SwiperSlide>
              ))}
            </Grid>
          </Swiper>
        </Box>
        </Grid>


        {/* 5 */}

        {/* third row  */}
        <Grid size={{ lg: 5, xs: 12, md: 12 }} >
          <Grid container spacing={3}>
            {skeletonArray2.map((_, i) => (
              <Grid key={i} size={{ xs: 6, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    height: "150px",
                    padding: 0,
                    border: !customizer.isCardShadow ? `1px solid ${borderColor}` : "none",
                    // backgroundColor: "primary.main",
                    color: "white",
                    position: "relative",
                  }}
                  elevation={customizer.isCardShadow ? 9 : 0}
                  variant={!customizer.isCardShadow ? "outlined" : undefined}
                >
                  {/* Simulated top image */}
                  {/* <Skeleton
              variant="rectangular"
              width={59}
              height={81}
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                borderRadius: 1,
              }}
            /> */}

                  <CardContent
                    sx={{
                      textAlign: "center",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 1.2,
                    }}
                  >
                    <Skeleton variant="circular" width={30} height={30} />
                    <Skeleton variant="text" width={40} height={24} />
                    <Skeleton variant="text" width={80} height={20} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>


        {/* 6 */}

        <Grid size={{ lg: 7, xs: 12, md: 12 }} >
          <Card>
            <Box textAlign="center" mb={1.5}>
              <Skeleton variant="text" width="50%" height={30} sx={{ mx: "auto" }} />
            </Box>
            <Skeleton variant="rounded" width="100%" height={108} sx={{ mb: 1 }} />
            <Skeleton variant="rounded" width="100%" height={108} />
          </Card>
        </Grid>


        {/* 7 */}

        {/* fourth row  */}
        <Grid size={{ lg: 3.5, xs: 12, md: 12 }} >
          <Card className="cardWithShadow" sx={{ height: "246px", padding: 0 }}>
            {/* Header Skeleton */}
            <Box
              sx={{
                paddingTop: "8px",
                paddingBottom: "8px",
                borderRadius: "0",
                borderBottom: "1px solid #E0E0E0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Skeleton variant="circular" width={25} height={25} />
              <Skeleton variant="text" width={120} height={20} />
            </Box>

            {/* Horizontally scrolling skeletons */}
            <Box sx={{ display: "flex", justifyContent: "center", overflow: "hidden", whiteSpace: "nowrap", position: "relative" }}>
              {/* <Box sx={{ display: "flex", gap: { xs: 1.5, lg: 1.1 }, padding: 2 }}> */}
              {[1, 2, 3].map((item) => (
                <Card
                  key={item}
                  sx={{
                    boxShadow: "none",
                    width: 180,
                    height: 170,
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 2,
                  }}
                >
                  <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="60%" height={18} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="50%" height={18} />
                </Card>
              ))}
            </Box>
            {/* </Box> */}
          </Card>
        </Grid>

        {/* 8 */}

        <Grid size={{ lg: 4, xs: 12, md: 12 }} >
          <Card sx={{ height: { xs: "410px", lg: "246px" }, padding: 0, borderRadius: "12px" }}>
            {/* Header Skeleton */}
            <Box
              sx={{
                paddingTop: "8px",
                paddingBottom: "8px",
                borderRadius: "0",
                borderBottom: "1px solid #E0E0E0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width={160} height={20} />
            </Box>

            {/* Scrollable Content Skeleton */}
            <Scrollbar sx={{ height: { xs: "100%", lg: "100%" } }}>
              <Box
                sx={{
                  height: { xs: "300px", lg: "100%" },
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  padding: 2,
                  margin: 2,
                }}
              >
                {[1, 2, 3].map((item) => (
                  <React.Fragment key={item}>
                    <Box
                      sx={{

                        paddingLeft: 2,
                      }}
                    >
                      <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="70%" height={20} />
                    </Box>
                    {item !== 3 && <Divider />}
                  </React.Fragment>
                ))}
              </Box>
            </Scrollbar>
          </Card>
        </Grid>

        {/* 9 */}

        <Grid size={{ lg: 4.5, xs: 12, md: 12 }} >
          <Card sx={{ height: { xs: "410px", lg: "246px" }, padding: 0, borderRadius: "12px" }}>
            {/* Header Skeleton */}
            <Box
              sx={{
                paddingTop: "8px",
                paddingBottom: "8px",
                borderRadius: 0,
                borderBottom: "1px solid #E0E0E0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Skeleton variant="circular" width={25} height={25} />
              <Skeleton variant="text" width={160} height={20} sx={{ mx: 2 }} />
              <Box sx={{ position: "absolute", right: 10 }}>
                <Skeleton variant="circular" width={25} height={25} />
              </Box>
            </Box>

            {/* Scrollable Content Skeleton */}
            <Scrollbar sx={{ height: { xs: "100%", lg: "100%" } }}>
              <Box
                sx={{
                  height: { xs: "300px", lg: "100%" },
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  padding: 2,
                  margin: 2,
                }}
              >
                {[1, 2, 3].map((item) => (
                  <React.Fragment key={item}>
                    <Box sx={{ cursor: "default" }}>
                      {/* Course Name Skeleton */}
                      <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />

                      {/* Inline fields: Code, Date, Time */}
                      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <Skeleton variant="text" width={90} height={20} />
                        <Skeleton variant="text" width={90} height={20} />
                        <Skeleton variant="text" width={90} height={20} />
                      </Box>
                    </Box>
                    {item !== 3 && <Divider />}
                  </React.Fragment>
                ))}
              </Box>
            </Scrollbar>
          </Card>
        </Grid>

        {/* 10 */}

        {/* fifth row  */}
        <Grid size={{ lg: 12, xs: 12, md: 12 }} >
          <Card sx={{ borderRadius: "12px", padding: 2 }}>
            {/* Header Title Skeleton */}
            <Box textAlign="center" mb={2}>
              <Skeleton variant="circular" width={25} height={25} sx={{ mx: "auto" }} />
              <Skeleton variant="text" width={180} height={30} sx={{ mx: "auto", mt: 1 }} />
            </Box>

            {/* Tabs Skeleton */}
            <Box sx={{ display: "flex", gap: 2, px: 2, mb: 2 }}>
              {[1, 2, 3].map((_, i) => (
                <Skeleton key={i} variant="rectangular" width={130} height={35} />
              ))}
            </Box>

            {/* Scrollable Skeleton Panel */}
            <Box
              sx={{
                border: "1px solid #B6CBBD",
                borderRadius: "8px",
                height: "500px",
                overflow: "hidden",
              }}
            >
              <Scrollbar sx={{ height: "100%", p: 2 }}>
                {[1, 2, 3].map((_, i) => (
                  <React.Fragment key={i}>
                    <Box sx={{ mb: 2 }}>
                      {/* Accordion Summary Skeleton */}
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Skeleton variant="circular" width={14} height={14} />
                          <Skeleton variant="text" width={220} height={20} />
                        </Box>
                        <Skeleton variant="text" width={100} height={16} />
                      </Box>

                      {/* Accordion Details Skeleton */}
                      <Box sx={{ pl: 3 }}>
                        <Skeleton variant="text" width="100%" height={20} />
                        <Skeleton variant="text" width="90%" height={20} sx={{ mt: 1 }} />
                        <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />

                        {/* File section */}
                        <Skeleton variant="text" width="40%" height={20} sx={{ mt: 2 }} />
                        {[1, 2].map((j) => (
                          <Skeleton key={j} variant="text" width="70%" height={18} sx={{ mt: 1 }} />
                        ))}

                        {/* Uploader Info */}
                        {/* <Skeleton variant="text" width="30%" height={18} sx={{ mt: 2 }} />
                  <Skeleton variant="text" width="50%" height={18} />
                  <Skeleton variant="text" width="40%" height={18} /> */}
                      </Box>
                    </Box>
                    {i !== 2 && <Divider />}
                  </React.Fragment>
                ))}
              </Scrollbar>
            </Box>
          </Card>
        </Grid>

        {/* 11 */}

        {/* sixth row  */}
        <Grid size={{ lg: 12, xs: 12, md: 12 }} >
          <Box sx={{ position: "relative", width: "100%", padding: 0 }}>
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={4}
              navigation
              loop={true}
              loopAdditionalSlides={4}
              breakpoints={{
                320: { slidesPerView: 1 },
                600: { slidesPerView: 2 },
                900: { slidesPerView: 3 },
                1200: { slidesPerView: 4 },
              }}
            >
              {[1, 2, 3, 4].map((item) => (
                <SwiperSlide key={item}>
                  <Grid size={{ xs: 12, sm: 12, lg: 12 }}>
                    <BlankCard>
                      <CardContent sx={{ height: 450, cursor: "default" }}>
                        <Skeleton
                          variant="circular"
                          width={100}
                          height={100}
                          sx={{ margin: "auto" }}
                        />

                        <Stack direction="row" spacing={2} mt={3} justifyContent="center">
                          <Box textAlign="center" width="100%">
                            <Box
                              mb={2}
                              p={1}
                              borderRadius="24px"
                              sx={{
                                // backgroundColor: "primary.light",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "60%",
                                margin: "auto",
                              }}
                            >
                              <Skeleton variant="text" width="100%" height={40} />
                            </Box>

                            <Skeleton
                              variant="text"
                              width="80%"
                              height={24}
                              sx={{ margin: "auto", mb: 1 }}
                            />
                            <Skeleton
                              variant="text"
                              width="60%"
                              height={20}
                              sx={{ margin: "auto", mb: 1 }}
                            />

                            <Box
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                              mt={2}
                              gap={1}
                            >
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
        </Grid>

        {/* 12 */}

        {/* seventh row  */}
        <Grid size={{ lg: 12, xs: 12, md: 12 }} >
          {/* <DashboardCard> */}
          <Card
            sx={{
              height: "100%",
              padding: 0,
              borderRadius: "12px",
              boxShadow: 3,
            }}
          >
            {/* Header Skeleton */}
            <Box
              sx={{
                paddingTop: "10px",
                paddingBottom: "10px",
                borderRadius: 0,
                borderBottom: "1px solid #E0E0E0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Skeleton variant="circular" width={25} height={25} />
              <Skeleton variant="text" width={160} height={24} sx={{ mx: 2 }} />
            </Box>

            {/* Instagram Feed Skeleton */}
            <Box sx={{ width: "100%", mt: 2, mb: 2, p: 2 }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={400}
                sx={{ borderRadius: "8px" }}
              />
            </Box>
          </Card>
          {/* </DashboardCard> */}
        </Grid>
      </Grid>
    </Box>
  );
};