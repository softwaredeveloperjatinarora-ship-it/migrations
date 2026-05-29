// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Box,
//   Typography,
//   Grid,
//   Skeleton,
//   Stack,
//   Card,
//   CardMedia,
//   CardContent,
//   IconButton,
// } from "@mui/material";
// import { useSession } from "next-auth/react";
// import { useTheme } from "@mui/material/styles";
// import { getHappeningAction } from "@/app/actions/homeAction/Happening/getHappeningAction";
// import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
// import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
// import Link from "next/link";
// import { IconX } from "@tabler/icons-react";

// interface PopupProps {
//   open: boolean;
//   handleClose: () => void;
//   title: string;
// }

// const HappeningPopup: React.FC<PopupProps> = ({ open, handleClose, title }) => {
//   const { data: session } = useSession();
//   const theme = useTheme();
//   const [loading, setLoading] = useState<boolean>(true);
//   const [placedata, setPlacedata] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await getHappeningAction();
//         let splitValue = String(session?.user?.token).split("NEXT2121ANG");
//         const ApiData1 = decryptDataforResponse(
//           response.ApiData,
//           splitValue[1]
//         );
//         const parsedData = JSON.parse(ApiData1);
//         setPlacedata(parsedData);
//       } catch (err) {
//         setError("Failed to fetch data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (open) fetchData();
//   }, [open]);

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       aria-labelledby="scroll-dialog-title"
//       PaperProps={{ sx: { width: "100%", height: "90%" } }}
//       maxWidth="lg"
//     >
//          <DialogTitle
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         {title}
//         <IconButton onClick={handleClose} size="small" sx={{ ml: 2 }}>
//           <IconX color="#FF8488" size={24} />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent dividers sx={{ padding: 0 }}>
//         <Scrollbar sx={{ height: "100%" }}>
//           {loading ? (
//             <Skeleton variant="rectangular" height={220} />
//           ) : error ? (
//             <Typography color="error" align="center">
//               {error}
//             </Typography>
//           ) : placedata.length > 0 ? (
//             <Grid container spacing={3}>
//               {placedata.map((item, index) => (
//                 <Grid item xs={12} sm={6} md={4} key={index}>
//                   <Link
//                     href={item.link}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     style={{ textDecoration: "none" }}
//                   >
//                     <Card
//                       sx={{
                     
//                         borderRadius: 2,
                      
//                         boxShadow: 3,
//                         transition: "transform 0.2s",
//                         "&:hover": { transform: "scale(1.03)" },
//                         height: "100%",
//                       }}
//                     >
//                       <CardMedia
//                         component="img"
//                         height="180"
//                         image={item.imageName}
//                         alt={item.title}
//                         sx={{ borderTopLeftRadius: 2, borderTopRightRadius: 2 }}
//                       />
//                       <CardContent>
//                         <Typography
//                           variant="h6"
//                           sx={{ fontWeight: "bold", color: "" }}
//                         >
//                           {item.title}
//                         </Typography>
//                       </CardContent>
//                     </Card>
//                   </Link>
//                 </Grid>
//               ))}
//             </Grid>
//           ) : (
//             <Typography align="center">No data available.</Typography>
//           )}
//         </Scrollbar>
//       </DialogContent>
//       <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>

//         <Button color="primary" sx={{ backgroundColor: "primary.main", color: "white" }} onClick={() => window.open("https://happenings.lpu.in/", "_blank")} >
//           View More
//         </Button>

//         <Button color="primary" onClick={handleClose}>
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default HappeningPopup;















"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,

  Skeleton,
  Stack,
  Card,
  CardMedia,
  CardContent,

  Tooltip,
  Fab,
  Rating,
  IconButton,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useTheme } from "@mui/material/styles";
import  Grid from "@mui/material/Grid";
import { getHappeningAction } from "@/app/actions/homeAction/Happening/getHappeningAction";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import Link from "next/link";
import BlankCard from "@/app/components/shared/BlankCard";
import { IconBasket } from "@tabler/icons-react";
import Image from 'next/image';
import { IconX } from "@tabler/icons-react";


interface PopupProps {
  open: boolean;
  handleClose: () => void;
  title: string;
}

const HappeningPopup: React.FC<PopupProps> = ({ open, handleClose, title }) => {
  const { data: session } = useSession();
  const theme = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [placedata, setPlacedata] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const borderColor = theme.palette.divider;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getHappeningAction();
        let splitValue = String(session?.user?.token).split("NEXT2121ANG");
        const ApiData1 = decryptDataforResponse(response.ApiData, splitValue[1]);
        const parsedData = JSON.parse(ApiData1);
        setPlacedata(parsedData);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchData();
  }, [open]);

  return (
    //   <Dialog
    //     open={open}
    //     onClose={handleClose}
    //     aria-labelledby="scroll-dialog-title"
    //     PaperProps={{ sx: { width: "100%", height: "90%" } }}
    //     maxWidth="lg"
    //   >
    //     <DialogTitle
    //       sx={{
    //          textAlign: "center"
    //         // bgcolor: "primary.main",
    //         // color: "white",
    //         // textAlign: "center",
    //         // fontSize: "1.5rem",
    //         // fontWeight: "bold",
    //         // py: 2,
    //       }}
    //     >
    //       {title}
    //     </DialogTitle>
    //       <DialogContent dividers sx={{ padding: 0 }}>
    //     <Scrollbar sx={{ height: "100%"  }}>
    //         {loading ? (
    //           <Skeleton variant="rectangular" height={220} />
    //         ) : error ? (
    //           <Typography color="error" align="center">{error}</Typography>
    //         ) : placedata.length > 0 ? (
    //           <Grid container spacing={3} sx={{ padding: 3 }}>
    //             {placedata.map((item, index) => (
    //               <Grid item xs={12} sm={6} md={4} key={index}>
    //                 <Link

    //                   href={item.link}
    //                   target="_blank"
    //                   rel="noopener noreferrer"
    //                   style={{ textDecoration: "none" }}
    //                 >
    //                   <Card
    //                     sx={{
    //                       // display:"flex",
    //                       // flexDirection:"column",
    //                       borderRadius: 2,
    //                       // boxShadow: 3,
    //                       boxShadow: 3,
    // transition: "transform 0.2s",
    // "&:hover": { transform: "scale(1.03)" },
    // height: "100%",

    //                     }}
    //                   >
    // <CardMedia
    //   component="img"
    //   height="180"
    //   image={item.imageName}
    //   alt={item.title}
    //   sx={{ borderTopLeftRadius: 2, borderTopRightRadius: 2 }}
    // />
    //                     <CardContent>
    //                       <Typography
    //                         variant="h6"
    //                         sx={{ fontWeight: "bold" }}
    //                       >
    //                         {item.title}
    //                       </Typography>
    //                     </CardContent>
    //                   </Card>
    //                 </Link>
    //                </Grid>
    //             ))}
    //           </Grid>
    //         ) : (
    //           <Typography align="center">No data available.</Typography>
    //         )}
    //     </Scrollbar>
    //       </DialogContent>
    //       <DialogActions>
    //    <Button color="primary" onClick={handleClose}>
    //      Close
    //   </Button>
    //  </DialogActions>
    //   </Dialog>

    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      PaperProps={{ sx: { width: "100%", height: "90%" } }}
      maxWidth="lg"

    >
      <DialogTitle sx={{
        textAlign: "center", display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        {title}


        <IconButton onClick={handleClose} size="small" sx={{ ml: 2 }}>
          <IconX size={24} />
        </IconButton>

      </DialogTitle>
      <DialogContent dividers sx={{ padding: 3 }}>
        <Scrollbar sx={{ height: "100%" }}>
          <Grid container spacing={3}>
            {placedata.map((item, index) => (
              <Grid size={{ lg: 4, sm: 4, xs: 12, md: 4 }} 
               
                key={index}
                // xs={12} // 1 column on small screens
                // sm={4}  // 3 cards per row on small screens
                // lg={4}  // 3 cards per row on large screens
              >
                <Link

                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <BlankCard sx={{

                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.03)" },
                    height: "100%",
                  }}>
                    <Typography component="div"  >
                      {/* <img
                        src="https://i.pinimg.com/736x/3a/51/01/3a510144ff1b7d22cf76b8b089c8870f.jpg"
                        alt="img"
                        width={250}
                        height={268}
                        style={{ width: "100%" }}
                      /> */}
                      <CardMedia
                        component="img"
                        height="180"
                        image={item.imageName}
                        alt={item.title}
                        sx={{ borderTopLeftRadius: 2, borderTopRightRadius: 2 }}
                      />
                    </Typography>
                    {/* <Tooltip title="Add To Cart">
                      <Fab
                        size="small"
                        color="primary"
                        sx={{ bottom: "75px", right: "15px", position: "absolute" }}
                      >
                        <IconBasket size="16" />
                      </Fab>
                    </Tooltip> */}
                    <CardContent sx={{ p: 3, pt: 2 }}>
                      <Typography variant="h6" sx={{ fontSize: "13px" }}>{item.title}</Typography>
                      {/* <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1}> */}
                      {/* <Stack direction="row" alignItems="center"> */}
                      {/* <Typography variant="h6">${product.price}</Typography> */}
                      {/* <Typography color="textSecondary" ml={1} sx={{ textDecoration: 'line-through' }}>
                      ${product.salesPrice}
                    </Typography> */}
                      {/* </Stack> */}
                      {/* </Stack> */}
                    </CardContent>
                  </BlankCard>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Scrollbar>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>

        <Button color="primary" sx={{ backgroundColor: "primary.main", color: "white" }} onClick={() => window.open("https://happenings.lpu.in/", "_blank")} >
          View More
        </Button>

        <Button color="primary" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>





  );
};

export default HappeningPopup;


