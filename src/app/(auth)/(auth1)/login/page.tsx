

// "use client";
// import Link from "next/link";
// import Avatar from '@mui/material/Avatar';
// import Box from '@mui/material/Box';

// import Stack from '@mui/material/Stack';
// import { Theme } from '@mui/material/styles';
// import Typography from '@mui/material/Typography';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import PageContainer from "@/app/components/container/PageContainer";
// import Logo from "@/app/dashboard/(DashboardLayout)/layout/shared/logo/Logo";
// //import AuthLogin from "../../authForms/AuthLogin";

// const AuthLogin = dynamic(() => import('@/app/(auth)/authForms/AuthLogin'), { ssr: false });


// import { useSelector } from "@/store/hooks";
// import { AppState } from "@/store/store";
// import BannerSlider from "../slider/BannerSlider";
// import Grid from "@mui/material/Grid";
// import dynamic from "next/dynamic";
// export default function Login() {
//   const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
//   const customizer = useSelector((state: AppState) => state.customizer);

//   return (
//     <PageContainer title="Login Page" description="this is Sample page">
//       <Box display="flex" alignItems="center">
//         <Box
//           position="relative"
//           width="100%"
//           sx={{
           
//             maxWidth: "100%",
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
//               //  width: "100%",
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
//               width="100%"
//               sx={{
               
//                 position: "relative",
//                 borderRadius: customizer.borderRadius / 18,
//                 zIndex: 1,
//                 margin: {
//                   lg: "50px auto 50px auto",
//                   sm: "0 20px ",
//                   xs: "0 0px",
//                 },
//                 boxShadow: "0 2px 30px 15px rgba(37,83,185,.1)",
//                 // backgroundColor: (theme:any)=>theme.palette.mode==="light"?"white":"#111c2d",
//                 maxWidth: {
//                   xs: "340px",
//                   sm: "500px",
//                   lg: "1320px",
//                 },
//               }}
//             >
//               {/* <Box
//                 px={4}
//                 // pb={4}
//                 // pt={2}
//                 sx={{
                 
//                   paddingLeft: {
//                     lg: 0,
//                   },
//                   paddingRight: {
//                     lg: 8,
//                   },
//                 }}
//               > */}

//               <Grid
//                 container
//                 spacing={0}
//                 justifyContent="space-between"
//               // sx={{ mb: 4 }}
//               >
//                 {lgUp ? (
//                   <Grid size={{ sm: 6, xs: 12, lg: 7 }} >
//                     <Box sx={{
//                       width: { lg: "730px" },
                    
//                     }}>
//                       <BannerSlider />

//                     </Box>

//                     {/* <Avatar
//                         src="/images/backgrounds/login3-bg.png"
//                         alt="login"
//                         sx={{
//                           width: "500px",
//                           height: "500px",
//                           maxWidth: "100%",
//                           borderRadius: 0,
//                           margin: "0 auto",
//                         }}
//                       /> */}
//                   </Grid>
//                 ) : (
//                   ""
//                 )}
//                 {/* <Grid item xs={12} sm={12} lg={5}> */}
//                 <Grid size={{ sm: 12, xs: 12, lg: 5 }} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
//                   <Box
//                     sx={{
                   
//                       width: { lg: "400px" },
//                       marginLeft: {
//                         lg: 4,
//                         xs: 4,
//                       },
//                          marginRight: {
//                         lg: 2,
//                         xs: 4,
//                       },
//                     }}
//                   >
//                     <Logo />
//                     <AuthLogin title="Welcome To LPU UMS" />
//                   </Box>
//                 </Grid>
//               </Grid>
//               {/* </Box> */}
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

// const AuthLogin = dynamic(() => import('@/app/(auth)/authForms/AuthLogin'), { ssr: false });


import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";
import BannerSlider from "../slider/BannerSlider";
import Grid from "@mui/material/Grid";
import dynamic from "next/dynamic";
import Logo from "@/app/dashboard/staff/(DashboardLayout)/layout/shared/logo/Logo";
import AuthLogin from "../../authForms/AuthLogin";
export default function Login() {
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const customizer = useSelector((state: AppState) => state.customizer);

  return (
    <PageContainer title="Login Page" description="this is Sample page">
      <Box display="flex" alignItems="center"
      //  sx={{border:"1px solid black"}}
       >
        <Box
          position="relative"
          width="100%"
          sx={{
          //  border:"1px solid red",
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
          //  border:"1px solid green",
              position: "relative",
              //  width: "100%",
              "&:before": {
                content: "''",
                position: "absolute",
                left: "-125px",
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
                right: "-60px",
                width: "304px",
                height: "315px",
                backgroundRepeat: "no-repeat",
                background: "url('/images/backgrounds/shap-login.png')",
              },
            }}
          >
            <Box
              width="100%"
              sx={{
              //  border:"1px solid pink",
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

              <Grid
                container
                spacing={0}
                justifyContent="space-between"
              // sx={{ mb: 4 }}
              >
                {lgUp ? (
                  <Grid size={{ sm: 6, xs: 12, lg: 7 }} >
                    <Box sx={{
                      width: { lg: "600px" },
                    // border:"1px solid blue",
                    }}>
                      <BannerSlider />

                    </Box>

                    {/* <Avatar
                        src="/images/backgrounds/login3-bg.png"
                        alt="login"
                        sx={{
                          width: "500px",
                          height: "500px",
                          maxWidth: "100%",
                          borderRadius: 0,
                          margin: "0 auto",
                        }}
                      /> */}
                  </Grid>
                ) : (
                  ""
                )}
              
                <Grid size={{ sm: 12, xs: 12, lg: 5 }} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Box
                    sx={{
                  //  border:"1px solid white",
                      width: { lg: "350px" },
                      marginLeft: {
                        lg: 4,
                        xs: 4,
                      },
                         marginRight: {
                        lg: 0,
                        xs: 4,
                      },
                    }}
                  >
                    <Box sx={{ml:{lg:3,xs:0}}}>

                   
                    </Box>
                    <AuthLogin title="Welcome To LPU UMS" />
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








