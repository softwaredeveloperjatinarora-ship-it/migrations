// "use client";
// import Box from "@mui/material/Box";
// import Grid from "@mui/material/Grid";
// import { Theme } from "@mui/material/styles";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import PageContainer from "@/app/components/container/PageContainer";
// import { useSelector } from "@/store/hooks";
// import { AppState } from "@/store/store";

// import Image from "next/image";
// import Typography from "@mui/material/Typography";
// import ResetPassword from "../../authForms/AuthResetPassword";
// import { Card } from "@mui/material";
// export default function ResetPasswordPage() {
//   const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
//   const customizer = useSelector((state: AppState) => state.customizer);

//   return (
//     <PageContainer
//       title="Change Password Page"
//       description="This is a sample page"
//     >
//       <Box display="flex" alignItems="center">
//         <Box
//           position="relative"
//           width="100%"
//           sx={{
//             maxWidth: "1600px",
//             height: "calc(100vh - 20px)",
//             margin: "10px auto",
//             // background: (theme) => theme.palette.grey[200],
//             overflow: "hidden",
//             borderRadius: customizer.borderRadius / 18,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <Box
//             sx={{
//               position: "relative",
//               "&:before": {
//                 content: "''",
//                 position: "absolute",
//                 left: "-125px",
//                 bottom: "-50px",
//                 width: "300px",
//                 height: "300px",
//                 borderRadius: "100%",
//                 backgroundColor: "error.main",
//               },
//               "&:after": {
//                 content: "''",
//                 position: "absolute",
//                 top: "-65px",
//                 right: "-60px",
//                 width: "304px",
//                 height: "315px",
//                 backgroundRepeat: "no-repeat",
//                 background: "url('/images/backgrounds/shap-login.png')",
//               },
//             }}
//           >
//             <Box
//               sx={{
//                 position: "relative",
//                 borderRadius: customizer.borderRadius / 18,
//                 zIndex: 1,
//                 margin: { lg: "50px auto", xs: "0 15px" },
//                 boxShadow: "0 2px 30px 15px rgba(37,83,185,.2)",
//                 backgroundColor: "",
//                 maxWidth: { xs: "340px", sm: "500px", lg: "1320px" },
//               }}
//             >
//               <Card
//                 sx={{
//                   background: "transparent",
//                   boxShadow: "none",
//                   border: "none",
//                 }}
//               >
//                 <Grid container spacing={4} alignItems="center">
//                   {lgUp && (
//                     <Grid size={{ xs: 12, sm: 6, lg: 6 }}
                     
//                       display="flex"
//                       flexDirection="column"
//                       alignItems="center"
//                       justifyContent="center"
//                     >
//                       <Image
//                         src="/images/backgrounds/seal.svg"
//                         alt="Seal Logo"
//                         width={150}
//                         height={150}
//                       />

//                       <Box
//                         sx={{
                      
//                           padding: "40px",
//                           borderRadius: "12px",
//                           boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
//                           textAlign: "center",
//                           maxWidth: "80%",
//                           mt: 2,
//                         }}
//                       >
//                         <Typography variant="h4" fontWeight="bold">
//                           Welcome to LPU - UMS
//                         </Typography>
//                         <Typography
//                           variant="body1"
//                           color="textSecondary"
//                           mt={1}
//                         >
//                           A smart home-grown web-based ERP solution with all
//                           possible features ranging from Learning Management
//                           System to e-Governance.
//                         </Typography>
//                       </Box>

//                       <Image
//                         src="/images/backgrounds/qr-code.png"
//                         alt="QR Code"
//                         width={120}
//                         height={120}
//                         style={{ marginTop: "18px" }}
//                       />
//                       <Typography variant="h5" sx={{ mt: 2 }}>
//                         Download Our Official App
//                       </Typography>
//                     </Grid>
//                   )}

//                   <Grid size={{ xs: 12, sm: 12, lg: 6 }} >
//                     <Box display="flex" justifyContent="center" width="100%">
//                       <Box sx={{ width: "100%", maxWidth: "400px" }}>
//                         <ResetPassword />
//                       </Box>
//                     </Box>
//                   </Grid>
//                 </Grid>
//               </Card>
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//     </PageContainer>
//   );
// }





"use client";
import Link from "next/link";
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

import Stack from '@mui/material/Stack';
import { Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import PageContainer from "@/app/components/container/PageContainer";
 
//import AuthLogin from "../../authForms/AuthLogin";
 

const AuthLogin = dynamic(() => import('@/app/(auth)/authForms/AuthLogin'), { ssr: false });


import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";
import BannerSlider from "../slider/BannerSlider";
import Grid from "@mui/material/Grid";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Card } from "@mui/material";
import ResetPassword from "../../authForms/AuthResetPassword";
export default function ResetPasswordPage() {
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const customizer = useSelector((state: AppState) => state.customizer);

  return (
    <PageContainer title="Login Page" description="this is Sample page">
      <Box display="flex" alignItems="center">
        <Box
          position="relative"
          width="100%"
          sx={{

            maxWidth: "100%",
            height: "calc(100vh - 0px)",
            // margin: "10px auto",
            // background: (theme) => theme.palette.grey[200],
            overflow: "hidden",
            borderRadius: customizer.borderRadius / 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{

              position: "relative",
              //  width: "100%",
              "&:before": {
                content: "''",
                position: "absolute",
                left: {xs:"-125px",lg:"-50px"},
                bottom: "-50px",
                width: "300px",
                height: "300px",
                borderRadius: "100%",
                backgroundColor: "error.main",
              },
              "&:after": {
                content: "''",
                position: "absolute",
                top: "-65px",
                right: {lg:"30px",xs:"-60px"},
                width: "304px",
                height: "315px",
                backgroundRepeat: "no-repeat",
                background: "url('/images/backgrounds/shap-login.png')",
              },
            }}
          >
            <Box
              width={{lg:"80%"}}
              sx={{

                position: "relative",
                borderRadius: customizer.borderRadius / 18,
                zIndex: 1,
                margin: {
                  lg: "50px auto 50px auto",
                  sm: "0 20px ",
                  xs: "0 0px",
                },
                boxShadow: "0 2px 30px 15px rgba(37,83,185,.1)",
                // backgroundColor: (theme:any)=>theme.palette.mode==="light"?"white":"#111c2d",
                maxWidth: {
                  xs: "340px",
                  sm: "500px",
                  lg: "1320px",
                },
              }}
            >
              {/* <Box
                px={4}
                // pb={4}
                // pt={2}
                sx={{
                 
                  paddingLeft: {
                    lg: 0,
                  },
                  paddingRight: {
                    lg: 8,
                  },
                }}
              > */}

              <Grid container>
                {lgUp && (
                  <Grid
                    size={{ xs: 12, lg: 6.7 }}

                    container
                    // justifyContent="center"
                    alignItems="center"
                    sx={{
                      // borderRadius: customizer.borderRadius / 18,
                      borderTopLeftRadius:13,
                      borderBottomLeftRadius:13,
                      backgroundImage: 'url(/images/backgrounds/profilebg-3.jpg)',
                      backgroundSize: "cover",
                      height: "607px",
                    }}
                  >
                    <Grid textAlign="center">
                      <Image src="/images/backgrounds/seal.svg" alt="Seal" width={110} height={110} />
                      <Card sx={{ p: 4, maxWidth: "90%", mx: "auto", mt: 2 }}>
                        <Typography variant="h5" color="primary" fontWeight="bold">
                          Welcome to LPU - UMS
                        </Typography>
                        <Typography variant="body1" mt={1}>
                        A smart home grown web based ERP solution with all possible features ranging from Learning Management System to eGovernance.
                        </Typography>
                      </Card>
                      <Image
                        src="/images/backgrounds/qr-code.png"
                        alt="QR Code"
                        width={100}
                        height={100}
                        style={{ marginTop: "20px" }}
                      />
                      <Typography variant="h6" mt={2}>Download Our Official App</Typography>
                    </Grid>
                  </Grid>
                )}

                <Grid
                  size={{ xs: 12, lg: 5.3}}

                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 4,
                  }}
                >
                  <Box
                    sx={{
                      width: {  xs: "100%" },
                      // mx: "auto",
                    }}
                  >
                    <ResetPassword />
                  </Box>
                </Grid>
              </Grid>

              {/* </Box> */}
            </Box>
          </Box>
        </Box>
      </Box>
    </PageContainer>
  );
}









