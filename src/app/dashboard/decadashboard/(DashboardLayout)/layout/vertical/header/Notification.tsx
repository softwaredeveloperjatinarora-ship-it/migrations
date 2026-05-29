// import React, { useState } from "react";
// import Avatar from '@mui/material/Avatar';
// import Badge from '@mui/material/Badge';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Chip from '@mui/material/Chip';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import Typography from '@mui/material/Typography';
// import * as dropdownData from "./data";
// import Scrollbar from "@/app/components/custom-scroll/Scrollbar";

// import { Icon } from "@iconify/react";
// import { Stack } from "@mui/system";
// import Link from "next/link";
// import theme from "@/utils/theme";

// const Notifications = () => {
//   const [anchorEl2, setAnchorEl2] = useState(null);

//   const handleClick2 = (event: any) => {
//     setAnchorEl2(event.currentTarget);
//   };

//   const handleClose2 = () => {
//     setAnchorEl2(null);
//   };

//   return (
//     <Box>
//       <Button
//         size="large"
//         aria-label="show 11 new notifications"
//         aria-controls="msgs-menu"
//         aria-haspopup="true"
//         className="btn-rounded-circle-40"
//         color="inherit"
//         onClick={handleClick2}
//       >
//         <Box
//           sx={{
//             position: "relative",
//             top: "5px",
//             animationName: "pulse",
//           }}
//         >
//           <Icon icon="solar:bell-bing-line-duotone" width="24" height="24" />
//           <Box
//             sx={{
//               position: "absolute",
//               top: "-14px",
//               right: "-5px",
//               height: "18px",
//               width: "18px",
//               zIndex: "10",
//               border: "2px solid #4bd08b",
//               borderRadius: "70px",
//               animationIterationCount: "infinite !important",
//               animation: "heartbit 1s ease-out"
//             }}
//           ></Box>
//           <Box
//             sx={{
//               width: "4px",
//               height: "4px",
//               borderRadius: "30px",
//               position: "absolute",
//               right: "2px",
//               top: "-7px",
//               backgroundColor:"success.main"
//             }}
//           ></Box>
//         </Box>
//       </Button>
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
//           },
//         }}
//       >
//         <Stack
//           direction="row"
//           py={2}
//           px={4}
//           justifyContent="space-between"
//           alignItems="center"
//         >
//           <Typography variant="h6">Notifications</Typography>
//           <Chip label="5 new" color="primary" size="small" />
//         </Stack>
//         <Scrollbar sx={{ height: "385px" }}>
//           {dropdownData.notifications.map((notification, index) => (
//             <Box key={index}>
//               <MenuItem sx={{ py: 2, px: 4 }}>
//                 <Stack direction="row" spacing={2}>
//                   <Avatar
//                     src={notification.avatar}
//                     alt={notification.avatar}
//                     sx={{
//                       width: 48,
//                       height: 48,
//                     }}
//                   />
//                   <Box>
//                     <Typography
//                       variant="subtitle2"
//                       color="textPrimary"
//                       fontWeight={600}
//                       noWrap
//                       sx={{
//                         width: "240px",
//                       }}
//                     >
//                       {notification.title}
//                     </Typography>
//                     <Typography
//                       color="textSecondary"
//                       variant="subtitle2"
//                       sx={{
//                         width: "240px",
//                       }}
//                       noWrap
//                     >
//                       {notification.subtitle}
//                     </Typography>
//                   </Box>
//                 </Stack>
//               </MenuItem>
//             </Box>
//           ))}
//         </Scrollbar>
//         <Box p={3} pb={1}>
//           <Button
//             href="/apps/email"
//             variant="outlined"
//             component={Link}
//             color="primary"
//             fullWidth
//           >
//             See all Notificationssss
//           </Button>
//         </Box>
//       </Menu>
//     </Box>
//   );
// };

// export default Notifications;



import React, { useEffect, useRef, useState } from "react";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import { Icon } from "@iconify/react";
import { Stack } from "@mui/system";
import { Divider } from "@mui/material";
import { useSession } from "next-auth/react";
// import EventsPopup from "../../../../../components/views/HomePageViews/Popup/EventsPopup/EventsPopup";
import { gettopcardAction } from "@/app/actions/homeAction/topcard/gettopcardAction";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
// import AssignmentPopup from "@/app/components/views/HomePageViews/Popup/AssignmentPopup/AssignmentPopup";
import MessagePopup from "@/app/components/views/HomePageViews/Popup/MessagePopup/MessagePopup";
import Happening from "@/app/components/views/HomePageViews/Happening";
import HappeningPopup from "@/app/components/views/HomePageViews/Popup/HappeningPopup/HappeningPopup";


const Notifications = ({ onDataFetched }: any) => {
  const isDataFetched = useRef(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();
  const [parsedData2, setParsedData2] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // State variables to control popups
  const [messagePopupOpen, setMessagePopupOpen] = useState(false);
  const [assignmentPopupOpen, setAssignmentPopupOpen] = useState(false);
  const [eventsPopupOpen, setEventsPopupOpen] = useState(false);
  const [happeningPopupOpen, setHappeningPopupOpen] = useState(false);

  useEffect(() => {
    const fetchPlacementData = async () => {
      if (isDataFetched.current) return;

      try {
        setLoading(true);
        const response2 = await gettopcardAction();

        let splitValue = String(session?.user?.token).split("NEXT2121ANG");
        if (response2.status === "success") {
          let apiData2 = response2.ApiData;
          const decryptedData2 = decryptDataforResponse(apiData2, splitValue[1]);
          const parsed2 = JSON.parse(decryptedData2);

          setParsedData2(parsed2);
          onDataFetched(parsed2);
        } else {
          setError(response2.message);
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

  // Filter notifications that have a counter > 0
  const notice = [
    { title: "Message", counter: parsedData2[0]?.countMessage || 0, color: "primary", icon: <Icon icon="ic:round-message" width="20" height="20" />, },
    { title: "Assignment", counter: parsedData2[0]?.countAssignment || 0, color: "secondary", icon: <Icon icon="hugeicons:assignments" width="20" height="20" />, },
    { title: "Events", counter: parsedData2[0]?.countEvent || 0, color: "warning", icon: <Icon icon="carbon:event" width="20" height="20" />, },
    { title: "Happening", counter: parsedData2[0]?.countHappen || 0, color: "success", icon: <Icon icon="tabler:news" width="20" height="20" />, },
  ].filter(notification => {
    // Always show Message and Assignment
    if (notification.title === "Message" || notification.title === "Assignment") {
      return true;
    }
    // Only show Events and Happening if count > 0
    return notification.counter > 0;
  });


  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);

  const handleClick2 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  // Function to open respective popups
  const handleRedirect = (title: string) => {
    switch (title) {
      case "Message":
        setMessagePopupOpen(true);
        break;
      case "Assignment":
        setAssignmentPopupOpen(true);
        break;
      case "Events":
        setEventsPopupOpen(true);
        break;
      case "Happening":
        setHappeningPopupOpen(true);
        break;
      default:
        break;
    }
    handleClose2(); // Close the notifications menu when a notification is clicked
  };

  const totalNotifications = notice.reduce((total, item) => total + item.counter, 0);
  return (
    // Calculate total notifications count

    <Box>
      <Button
        size="large"
        aria-label="show notifications"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        className="btn-rounded-circle-40"
        color="inherit"
        onClick={handleClick2}
      >
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Badge
            badgeContent={totalNotifications}
            color="primary"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "0.7rem",
                height: "20px",
                minWidth: "30px",
                padding: "2px 6px",
                borderRadius: "10px",
              },
            }}
          >
            <Icon icon="solar:bell-bing-line-duotone" width="30" height="30" />
          </Badge>
        </Box>
      </Button>

      {/* Notification Dropdown */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{ "& .MuiMenu-paper": { width: "290px" } }}
      >

        <Stack
          direction="row"
          py={2}
          px={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Notifications</Typography>
          <Chip label={`${totalNotifications} New`} color="primary" size="small" />
        </Stack>



        <Divider />
        <Scrollbar sx={{ height: "180px" }}>
          {notice.map((notification, index) => (
            <Box key={index}>
              <MenuItem sx={{ py: 2, px: 4 }} onClick={() => handleRedirect(notification.title)}>
                <Stack direction="row" spacing={2}>
                  <Box display="flex" alignItems="center" width="240px" gap={1}>
                    {/* Icon box */}
                    <Box
                      minWidth="40px"
                      height="40px"
                      bgcolor={`${notification.color}.light`}
                      color={`${notification.color}.main`}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius={1} // optional for rounded look
                    >
                      {notification.icon}
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="subtitle2"
                      color="textPrimary"
                      fontWeight={600}
                      noWrap
                      sx={{ flexShrink: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {notification.title}
                    </Typography>

                    {/* Counter */}
                    <Typography
                      color="textSecondary"
                      sx={{ color: "primary.main", flexShrink: 0 }}
                      variant="subtitle2"
                      noWrap
                    >
                      ({notification.counter})
                    </Typography>
                  </Box>

                </Stack>
              </MenuItem>
            </Box>
          ))}
        </Scrollbar>
      </Menu>

      <MessagePopup open={messagePopupOpen} handleClose={() => setMessagePopupOpen(false)} title="Message" count={parsedData2[0]?.countMessage || 0} />
      {/* <AssignmentPopup open={assignmentPopupOpen} handleClose={() => setAssignmentPopupOpen(false)} title="Assignment" /> */}
      {/* <EventsPopup open={eventsPopupOpen} handleClose={() => setEventsPopupOpen(false)} title="Events" /> */}
      <HappeningPopup open={happeningPopupOpen} handleClose={() => setHappeningPopupOpen(false)} title="Happening" />

    </Box>

  );
};

export default Notifications;
