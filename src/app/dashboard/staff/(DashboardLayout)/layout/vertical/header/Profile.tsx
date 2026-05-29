
// import React, { useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import Box from '@mui/material/Box';
// import Divider from '@mui/material/Divider';
// import Menu from '@mui/material/Menu';
// import Typography from '@mui/material/Typography';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import { Icon } from "@iconify/react";
// import { useSession, signOut } from "next-auth/react"
// import { Stack } from "@mui/system";
// import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
// //import { getprofileAction } from "@/app/actions/headerAction/ProfileDetails/getprofileAction";
// import { setProfileData } from "@/store/profile/profileSlice";
// import EmergencyTable from "@/app/components/views/ProfilePageViews/EmergencyNumber/EmergencyTable";
// import { useDispatch } from "react-redux";
// import Button from "@mui/material/Button";
// import { Skeleton } from "@mui/material";
// import MenuComponent from "../../getmenudata/page";
// import { setMenuData } from "@/store/menu/menuSlice";
// import CircleIcon from '@mui/icons-material/Circle';

// const WS_URL = "ws://172.18.12.25/Socket/pool/SalesTeam/ws";

// const profile = [
//   {
//     href: "/dashboard/user-profile",
//     title: "My Profile",
//     // subtitle: "Account Settings",
//     icon: <Icon icon="solar:wallet-2-line-duotone" width="20" height="20" />,
//     color: "primary",
//   },
//   {
//     href: "/dashboard/change-password",
//     title: "Change Password",
//     // subtitle: "Account Settings",
//     icon: <Icon icon="fluent-mdl2:profile-search" width="20" height="20" />,
//     color: "warning",
//   },
 

// ];



// const Profile = () => {

//   const dispatch = useDispatch();
//   const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"))
//   const [anchorEl2, setAnchorEl2] = useState(null);
//   const isDataFetched = useRef(false);
//   const [profileData, setProfile] = useState<any[]>([]); // Now it's an array
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isConnected, setIsConnected] = useState(false);

//   const { data: session } = useSession()


  
//   // const getCurrentTime = () => new Date().toLocaleTimeString();
//   const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


//   const socketRef = useRef<WebSocket | null>(null);
//   // const [userId] = useState("John123");
//   const [userId] = useState(profileData[0]?.registerationNumber);


//   // WebSocket connection setup
//   const connectWebSocket = () => {
//     const socket = new WebSocket(`${WS_URL}?userId=${userId}`);
//     socketRef.current = socket;

//     socket.onopen = () => {
//       setIsConnected(true);  // User is online
//     };

//     socket.onmessage = (event) => {
//       try {
//         const message = JSON.parse(event.data);  // Parse the WebSocket message
    
//         // Check if the message is in the expected format
//         if (message && message.type === "user" && message.userId === userId) {
//           // Handle private message (correct logic here as per your requirement)
//           console.log('Private message received:', message.message);
//         } else if (message && message.type === "broadcast") {
//           // Handle broadcast message (correct logic here as per your requirement)
//           console.log('Broadcast message received:', message.message);
//         } else {
//           console.warn('Unrecognized message type:', message);
//         }
//       } catch (error) {
//         console.error("Error parsing WebSocket message:", error);
//       }
//     };
    
//     socket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//       setIsConnected(false); // Connection error, user is offline
//     };

//     socket.onclose = () => {
//       setIsConnected(false);
//       setTimeout(connectWebSocket, 5000); // Reconnect after 5 seconds if the connection is lost
//     };
//   };






//   const handleMenuData = (data: any) => {
//     transformMenuData(data);
//   };

//   const transformMenuData = (data: any) => {
//     const categories: any = {};

//     data.forEach((item: any) => {
//       const {
//         category,
//         subCategory,
//         menuId,
//         text,
//         navigationUrl,
//         description,
//         isActive,
//         type,
//         target,
//         enableForCID,
//       } = item;

//       if (!categories[category]) {
//         categories[category] = { id: category, title: category, children: [] };
//       }

//       let subCategoryItem = categories[category].children.find(
//         (sub: any) => sub.id === subCategory
//       );
//       if (!subCategoryItem) {
//         subCategoryItem = { id: subCategory, title: subCategory, children: [] };
//         categories[category].children.push(subCategoryItem);
//       }

//       subCategoryItem.children.push({
//         id: menuId,
//         title: text,
//         href: navigationUrl,
//         description: description,
//         isActive: isActive,
//         type: type,
//         target: target,
//         enableForCID: enableForCID,
//       });
//     });

//     ;
//     dispatch(setMenuData(Object.values(categories)));
//   };


//   useEffect(() => {
//     const fetchProfileData = async () => {
//       if (isDataFetched.current) return;

//       setLoading(true);
//       try {
//         const response = await getprofileAction();
//         let splitValue = String(session?.user?.token).split("NEXT2121ANG");
//         if (response.status === "success") {
//           let apiData = response.ApiData;
//           const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
//           const parsedData = JSON.parse(decryptedData);

//           setProfile(Array.isArray(parsedData) ? parsedData : [parsedData]); // Ensure it's an array
//           dispatch(setProfileData(Object.values(parsedData)));
//           isDataFetched.current = true;
//         } else {
//           setError(response.message);
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Unknown error occurred");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfileData();
//     connectWebSocket(); // Initiate WebSocket connection on mount
//   }, [session]);

//   const handleClick2 = (event: any) => {
//     setAnchorEl2(event.currentTarget);
//   };
//   const handleClose2 = () => {
//     setAnchorEl2(null);
//   };

  
// const handleSignOut = async () => {
//   try {
//     await signOut(); // wait for sign out to finish
//     window.location.href = "https://ums.lpu.in/lpuums/"; // then redirect
//   } catch (error) {
//     console.error("Sign out failed", error);
//   }
// };
//   return (
//     <Box>
//       <MenuComponent onDataFetched={handleMenuData} />
//       {/* <> */}

//       {loading ? (
//         <LoadingSkeleton lgUp={false} />
//       ) : (



//         <Button
//           size="large"
//           aria-label="show 11 new notifications"
//           color="inherit"
//           aria-controls="msgs-menu"
//           aria-haspopup="true"
//           sx={{
//             ...(typeof anchorEl2 === "object" && {
//               color: "primary.main",
//             }),
//             display: "flex",
//             gap: 2,
//           }}
//           onClick={handleClick2}
//         >




//           <img
//             src={`data:image/jpg;base64,${profileData[0]?.snap}`}
//             style={{
//               height: 45,
//               width: 45,
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               borderRadius: "50%",
//             }}
//           />

//           {lgUp ? <Box textAlign="left">
//           <Typography variant="h6" color="textPrimary" display="flex" alignItems="center"> {profileData[0]?.name}</Typography>
//           <Box display="flex" alignItems="center" mb={1}>
//       <CircleIcon  sx={{ fontSize:"10px",color: isConnected ? 'success.main' : "#FF4D4D", mr: 0.5 }} />
//       <Typography variant="body2" color="textPrimary">
//         {isConnected ? 'Online' : `Offline - Last seen ${getCurrentTime()}`}
//       </Typography>
//     </Box>

//         </Box>  : ""}
//         </Button>

//       )}

//       {/* </> */}



//       {/* ------------------------------------------- */}
//       {/* Message Dropdown */}
//       {/* ------------------------------------------- */}
//       <Menu
//         id="msgs-menu"
//         anchorEl={anchorEl2}
//         keepMounted
//         open={Boolean(anchorEl2)}
//         onClose={handleClose2}
//         anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
//         transformOrigin={{ horizontal: "right", vertical: "top" }}
//         sx={{
//           "& .MuiMenu-paper": {
//             width: "360px",
//             p: 4,
//           },
//         }}
//       >
//         <Typography variant="h5">User Profile</Typography>
//         <Stack direction="row" py={3} spacing={2} alignItems="center">

//           <img
//             src={`data:image/jpg;base64,${profileData[0]?.snap}`}
//             style={{
//               height: 95,
//               width: 95,
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               margin: "auto",
//               borderRadius: "50%",
//             }}
//           />
//           <Box>
//             <Typography variant="h6" color="textPrimary" fontWeight={600}>
//               {profileData[0]?.name}
//             </Typography>
//             <Typography variant="subtitle2" color="textSecondary">

//             </Typography>
//             <Typography
//               variant="subtitle2"
//               color="textSecondary"
//               display="flex"
//               alignItems="center"
//               gap={1}
//             >
//               <Icon icon="solar:letter-line-duotone" width="15" height="15" />
//               {profileData[0]?.studentEmail}
//             </Typography>
//           </Box>
//         </Stack>
//         <Divider />

//         {profile.map((profile) => (
//           <Box key={profile.title}>
//             <Box sx={{ py: 0.5, px: 0 }} className="hover-text-primary">
//               <Link href={profile.href} onClick={handleClose2}>
//                 <Stack direction="row" spacing={2}>
//                   <Box
                  
//                     minWidth="47px"
//                     height="47px"
//                     bgcolor={profile.color + ".light"}
//                     color={profile.color + ".main"}
//                     display="flex"
//                     alignItems="center"
//                     justifyContent="center"
//                   >

//                     {profile.icon}
//                   </Box>
//                   <Box>
//                     <Typography

//                       variant="subtitle2"
//                       fontWeight={600}
//                       color="textPrimary"
//                       className="text-hover"
//                       noWrap
//                       sx={{
//                         width: "240px",
//                         marginTop: "10px"
//                       }}
//                     >
//                       {profile.title}
//                     </Typography>

//                   </Box>
//                 </Stack>
//               </Link>
//             </Box>

//           </Box>
//         ))}

//         <Box sx={{
//           display: 'flex',
//           alignItems: 'center',
//           marginTop: 0.5,
//           cursor: "pointer",
//           justifyContent: 'space-between' // Optional: to ensure space between the dialog and text if needed
//         }} className="hover-text-primary">

//           {/* EmergencyNumbersDialog inside Box */}
//           <EmergencyTable />
//         </Box>
//         <Box mt={2}>
//         <Button
//   variant="contained"
//   color="primary"
//   fullWidth
//   onClick={handleSignOut}
// >
//   Log out
// </Button>
//         </Box>
//       </Menu>
//     </Box>
//   );
// };



// const LoadingSkeleton = ({ lgUp }: { lgUp: boolean }) => {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         gap: 2,
//         px: 1,
//       }}
//     >
//       {/* Circular Skeleton for profile image */}
//       <Skeleton
//         variant="circular"
//         width={45}
//         height={45}
//         animation="wave"
//       />


//       {/* Text Skeleton if lgUp is true */}
//       {lgUp && (
//         <Box>
//           <Skeleton
//             variant="text"
//             width={80}
//             height={24}
//             animation="wave"
//           />
//         </Box>
//       )}
//     </Box>
//   );
// };



// export default Profile;

