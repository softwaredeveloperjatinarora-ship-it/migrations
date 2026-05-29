

"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Button,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import { IconX } from "@tabler/icons-react";
import UpcomingEvents from "./UpcomingEvents";
import EventsHistory from "./EventsHistory";

interface PopupProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  count: any;
}

const AllEventsTabs: React.FC<PopupProps> = ({ open, handleClose, title, count }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [childValue, setChildValue] = useState<any>(null);

  const dynamicTitle = tabIndex === 0 ? "Upcoming Events" : "Events History";
  const displayCount = tabIndex === 0 ? count : childValue ?? "Loading...";

  const handleChildValue = (value: any) => {
    setChildValue(value);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { width: "100%", height: "90%" } }}
      maxWidth="lg"
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {dynamicTitle}
        <IconButton onClick={handleClose} size="small">
          <IconX size={24} />
        </IconButton>
      </DialogTitle>

      <Divider />

      {/* Tabs & Legends */}
      <Box
        sx={{
          display: { lg: "flex" },
          justifyContent: { lg: "space-between" },
          alignItems: "center",
          px: 2,
          pt: 2,
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={(_, newIndex) => setTabIndex(newIndex)}
          TabIndicatorProps={{ sx: { height: 3 } }}
          sx={{ "& .MuiTab-root": { fontWeight: "bold", ml: 1 } }}
        >
          <Tab label="Upcoming Events" />
          <Tab label="Events History" />
        </Tabs>

        <Box
  sx={{
    // ✅ Ensures full flex centering on mobile
    display: "flex",
    flexDirection: "column",
    alignItems: { xs: "center", lg: "flex-start" }, // ✅ Center on mobile
    justifyContent: { lg: "flex-start", xs: "center" }, // ✅ Center on mobile
    textAlign: { xs: "center", lg: "left" }, // ✅ Ensures text aligns in center on mobile
    mr: { lg: 2, xs: 0 },
    mt: { xs: 2 },
    mb: { xs: 1, lg: 0 },
  }}
>
  <Typography
    variant="h6"
    sx={{
      fontSize: "13px",
      display: "flex",
      flexWrap: "wrap", // ✅ Allows wrap on smaller screens
      justifyContent: "center",
      alignItems: "center",
      gap: 1, // optional for spacing
      textAlign: "center",
    }}
  >
    <Box
      sx={{
        width: "20px",
        height: "15px",
        backgroundColor: "green",
        border: "1px solid green",
        borderRadius: 0,
        marginRight: "5px",
      }}
    />
    A (High Impact)

    <Box
      sx={{
        width: "20px",
        height: "15px",
        backgroundColor: "yellow",
        border: "1px solid yellow",
        borderRadius: 0,
        margin: "0 5px",
      }}
    />
    B (Moderate Impact)

    <Box
      sx={{
        width: "20px",
        height: "15px",
        backgroundColor: "blue",
        border: "1px solid blue",
        borderRadius: 0,
        margin: "0 5px",
      }}
    />
    C (Average Impact)
  </Typography>

  <Typography
    variant="body1"
    sx={{
      fontSize: "12px",
      textAlign: { xs: "center", lg: "left" }, // ✅ Centers this line too on mobile
      marginTop: 1,
    }}
  >
    (Impact legends are in terms of Celebrity/ Guest/ Participants and Audience present)
  </Typography>
</Box>

      </Box>

    {/* Tabs search */}


      {/* Content */}
      <DialogContent sx={{ padding: 2 }}>
        {tabIndex === 0 ? (
          <UpcomingEvents
            open={false}
            handleClose={() => { }}
            title=""
          />
        ) : (
          <EventsHistory
            open={true}
            handleClose={() => { }}
            title=""
          />
        )}
      </DialogContent>

      <Divider />

      <DialogActions >
              {/* <Button
                color="primary"
                sx={{ backgroundColor: "primary.main", color: "white" }}
                // onClick={handleOpenAllEvents}
              >
                Export To Excel
              </Button> */}
    
              <Button color="primary" onClick={handleClose}>
                Close
              </Button>
            </DialogActions>
    </Dialog>
  );
};

export default AllEventsTabs;














// "use client";

// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   IconButton,
//   Tabs,
//   Tab,
//   Divider,
//   Button,
//   Box,
//   Typography,
//   TextField,
// } from "@mui/material";
// import { IconX } from "@tabler/icons-react";
// import UpcomingEvents from "./UpcomingEvents";
// import EventsHistory from "./EventsHistory";

// interface PopupProps {
//   open: boolean;
//   handleClose: () => void;
//   title: string;
//   count: any;
// }

// const AllEventsTabs: React.FC<PopupProps> = ({ open, handleClose, title, count }) => {
//   const [tabIndex, setTabIndex] = useState(0);
//   const [childValue, setChildValue] = useState<any>(null);

//   const dynamicTitle = tabIndex === 0 ? "Upcoming Events" : "Events History";
//   const displayCount = tabIndex === 0 ? count : childValue ?? "Loading...";

//   const handleChildValue = (value: any) => {
//     setChildValue(value);
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       PaperProps={{ sx: { width: "100%", height: "90%" } }}
//       maxWidth="lg"
//     >
//       <DialogTitle
//         sx={{
//           textAlign: "center",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         {dynamicTitle}
//         <IconButton onClick={handleClose} size="small">
//           <IconX size={24} />
//         </IconButton>
//       </DialogTitle>

//       <Divider />

//       {/* Tabs & Legends */}
//       <Box
//         sx={{
//           display: { lg: "flex" },
//           justifyContent: { lg: "center" },
//           alignItems: "center",
//           px: 2,
//           pt: 2,
//         }}
//       >
      

//         <Box
//   sx={{
//     // ✅ Ensures full flex centering on mobile
//     display: "flex",
//     flexDirection: "column",
//     alignItems: { xs: "center", lg: "flex-start" }, // ✅ Center on mobile
//     justifyContent: { lg: "flex-start", xs: "center" }, // ✅ Center on mobile
//     textAlign: { xs: "center", lg: "left" }, // ✅ Ensures text aligns in center on mobile
//     mr: { lg: 2, xs: 0 },
//     mt: { xs: 2 },
//     mb: { xs: 1, lg: 0 },
//   }}
// >
//   <Typography
//     variant="h6"
//     sx={{
//       fontSize: "13px",
//       display: "flex",
//       flexWrap: "wrap", // ✅ Allows wrap on smaller screens
//       justifyContent: "center",
//       alignItems: "center",
//       gap: 1, // optional for spacing
//       textAlign: "center",
//     }}
//   >
//     <Box
//       sx={{
//         width: "20px",
//         height: "15px",
//         backgroundColor: "green",
//         border: "1px solid green",
//         borderRadius: 0,
//         marginRight: "5px",
//       }}
//     />
//     A (High Impact)

//     <Box
//       sx={{
//         width: "20px",
//         height: "15px",
//         backgroundColor: "yellow",
//         border: "1px solid yellow",
//         borderRadius: 0,
//         margin: "0 5px",
//       }}
//     />
//     B (Moderate Impact)

//     <Box
//       sx={{
//         width: "20px",
//         height: "15px",
//         backgroundColor: "blue",
//         border: "1px solid blue",
//         borderRadius: 0,
//         margin: "0 5px",
//       }}
//     />
//     C (Average Impact)
//   </Typography>

//   <Typography
//     variant="body1"
//     sx={{
//       fontSize: "12px",
//       textAlign: { xs: "center", lg: "left" }, // ✅ Centers this line too on mobile
//       marginTop: 1,
//     }}
//   >
//     (Impact legends are in terms of Celebrity/ Guest/ Participants and Audience present)
//   </Typography>
// </Box>

//       </Box>


//       <Tabs
//           value={tabIndex}
//           onChange={(_, newIndex) => setTabIndex(newIndex)}
//           TabIndicatorProps={{ sx: { height: 3 } }}
//           sx={{ "& .MuiTab-root": { fontWeight: "bold", ml: 1 } }}
//         >
//           <Tab label="Upcoming Events" />
//           <Tab label="Events History" />
//         </Tabs>

//       {/* Search Box - Visible only for Upcoming Events */}
//       {tabIndex === 0 ? (
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: {
//               lg: "space-between",
//               xs: "center",
//               md: "space-between",
//             },
//             alignItems: "center",
//             flexWrap: "wrap",
//             gap: 2,
//             ml: { lg: 3, xs: 0 },
//             mt: 1,
//           }}
//         >
//           <Box
//             sx={{
//               width: { xs: "100%", lg: "auto" },
//               display: "flex",
//               flexDirection: { xs: "column", lg: "row" },
//               alignItems: "center",
//               gap: 1,
//             }}
//           >
//             <Box
//               sx={{
//                 display: { lg: "flex" },
//                 alignItems: "center",
//                 width: { xs: "100%", sm: "auto" },
//                 gap: 1,
//               }}
//             >
//               <Typography
//                 variant="h6"
//                 sx={{
//                   fontSize: "14px",
//                   whiteSpace: "nowrap",
//                   display: "flex",
//                   justifyContent: "center",
//                 }}
//               >
//                 Search (Title/Description/Event Category):
//               </Typography>

//               <TextField
//                 variant="outlined"
//                 size="small"
//                 sx={{ minWidth: { xs: "100%", sm: 250 }, marginTop: 1 }}
//               />

//               <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 1 }}>
//                 <Button sx={{ width: "80px", marginRight: 1 }}>Show</Button>
//                 <Button sx={{ width: "80px" }}>Reset</Button>
//               </Box>
//             </Box>
//           </Box>
//         </Box>
//       ) : (

//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: {
//               lg: "space-between",
//               xs: "center",
//               md: "space-between",
//             },
//             alignItems: "center",
//             flexWrap: "wrap",
//             gap: 2,
//             ml: { lg: 3, xs: 0 },
//             mt: 1,
//           }}
//         >
//           {/* ✨ Wrapper for left and right sections */}
//           <Box
//             sx={{
//               width: "100%",
//               display: "flex",
//               flexDirection: {
//                 xs: "column",
//                 lg: "row", // side by side on desktop
//               },
//               justifyContent: "space-between",
//               gap: 2,
//             }}
//           >
//             {/* ✅ Left side: Start and End Date */}



//             <Box sx={{ display: { xs: "flex" }, justifyContent: { xs: "center" }, alignItems: { xs: "center" }, margin: { xs: "0px 0px 10px 0px" } }}>

//               <Box sx={{ gap: 1, marginRight: { xs: "5px" } }}>
//                 <Typography
//                   variant="h6"
//                   sx={{
//                     fontSize: "14px",
//                     whiteSpace: "nowrap",
//                     display: { xs: "flex" },
//                     justifyContent: { xs: "center" },
//                   }}
//                 >
//                   Start Date:
//                 </Typography>
//                 <TextField
//                   variant="outlined"
//                   size="small"
//                   type="date"
//                   sx={{
//                     width: "150px",
//                     "& .MuiInputBase-root": {
//                       fontSize: "13px",
//                       height: "35px",
//                       marginTop: { xs: 1 }
//                     },
//                   }}
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Box>

//               <Box sx={{ gap: 1, marginLeft: { xs: "5px" }, }}>
//                 <Typography
//                   variant="h6"
//                   sx={{
//                     fontSize: "14px",
//                     whiteSpace: "nowrap",
//                     display: { xs: "flex" },
//                     justifyContent: { xs: "center" },
//                   }}
//                 >
//                   End Date:
//                 </Typography>
//                 <TextField
//                   variant="outlined"
//                   size="small"
//                   type="date"
//                   sx={{
//                     width: "150px",
//                     "& .MuiInputBase-root": {
//                       fontSize: "13px",
//                       height: "35px",
//                       marginTop: { xs: 1 }
//                     },
//                   }}
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Box>
//             </Box>


//             {/* ✅ Right side: Search + Buttons */}
//             <Box
//               sx={{
//                 marginRight: { xs: 0, lg: 3 },
//                 display: "flex",
//                 flexDirection: { xs: "row", sm: "row", lg: "row" },
//                 alignItems: "center",
//                 gap: 1,
//                 justifyContent: { xs: "center", lg: "flex-end" },
//                 flexWrap: "wrap",
//               }}
//             >
//                <Typography
//                 variant="h6"
//                 sx={{
//                   fontSize: "14px",
//                   whiteSpace: "nowrap",
//                   textAlign: "center",
//                 }}
//               >
//                 Search (Title/Description/Event Category):
//               </Typography>
//               <TextField
//                 variant="outlined"
//                 size="small"
//                 sx={{
//                   minWidth: { xs: "100%", sm: 310, lg: 200 },
//                   marginTop: { xs: 1, sm: 0 },
//                 }}
//               />
//               <Button sx={{ minWidth: "80px", marginTop: { xs: 1, sm: 0 } }}>Show</Button>
//               <Button sx={{ minWidth: "80px", marginTop: { xs: 1, sm: 0 } }}>Reset</Button>
//             </Box>
//           </Box>
//         </Box>



//       )}


//       {/* Content */}
//       <DialogContent sx={{ padding: 2 }}>
//         {tabIndex === 0 ? (
//           <UpcomingEvents
//             open={false}
//             handleClose={() => { }}
//             title=""
//           />
//         ) : (
//           <EventsHistory
//             open={false}
//             handleClose={() => { }}
//             title=""
//           />
//         )}


        
//       </DialogContent>

//       <Divider />

//       <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
//               <Button
//                 color="primary"
//                 sx={{ backgroundColor: "primary.main", color: "white" }}
//                 // onClick={handleOpenAllEvents}
//               >
//                 Export To Excel
//               </Button>
    
//               <Button color="primary" onClick={handleClose}>
//                 Close
//               </Button>
//             </DialogActions>
//     </Dialog>
//   );
// };

// export default AllEventsTabs;
