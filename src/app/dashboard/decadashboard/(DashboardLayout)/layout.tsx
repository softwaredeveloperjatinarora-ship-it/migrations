// "use client";

// import Box from "@mui/material/Box";
// import Container from "@mui/material/Container";
// import { styled, useTheme } from "@mui/material/styles";
// import React from "react";
// import Header from "./layout/vertical/header/Header";
// import Sidebar from "./layout/vertical/sidebar/Sidebar";
// import Customizer from "./layout/shared/customizer/Customizer";
// import Navigation from "./layout/horizontal/navbar/Navigation";
// import HorizontalHeader from "./layout/horizontal/header/Header";
// import { useSelector } from "@/store/hooks";
// import { AppState } from "@/store/store";

// const PageWrapper = styled("div")(() => ({
//   display: "flex",
//   flexGrow: 1,
//   paddingBottom: "60px",
//   flexDirection: "column",
//   zIndex: 1,
//   backgroundColor: "transparent",
// }));

// const MainWrapper = styled("div")(() => ({
//   display: "flex",
//   minHeight: "100vh",
//   width: "100%",
// }));

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const customizer = useSelector((state: AppState) => state.customizer);
//   const theme = useTheme();

//   // Sidebar offset logic for main content
//   const sidebarOffset = customizer.isCollapse
//     ? customizer.MiniSidebarWidth
//     : customizer.SidebarWidth;

//   return (
//     <MainWrapper>
//       <title>Spike NextJs 14.0.3</title>

//       {/* ------------------------------------------- */}
//       {/* Sidebar (Always Visible on All Screen Sizes) */}
//       {/* ------------------------------------------- */}
//       {!customizer.isHorizontal && (
//         <Box
//           sx={{
//             width: sidebarOffset,
//             minWidth: sidebarOffset,
//             height: "100vh",
//             position: "fixed",
//             top: 0,
//             left: 0,
//             zIndex: 1100,
//             bgcolor: theme.palette.background.paper,
//             borderRight: "1px solid rgba(0,0,0,0.1)",
//           }}
//         >
//           <Sidebar />
//         </Box>
//       )}

//       {/* ------------------------------------------- */}
//       {/* Main Content Area (shifted right) */}
//       {/* ------------------------------------------- */}
//       <Box
//         width="100%"
//         sx={{
//           ml: !customizer.isHorizontal ? `${sidebarOffset}px` : 0,
//           transition: "margin-left 0.3s ease",
//         }}
//       >
//         {/* Horizontal Header/Navigation (for horizontal layout only) */}
//         {customizer.isHorizontal && <HorizontalHeader />}
//         {customizer.isHorizontal && <Navigation />}

//         <PageWrapper className="page-wrapper">
//           <Container
//             sx={{
//               maxWidth:
//                 customizer.isLayout === "boxed" ? "lg" : "100%!important",
//             }}
//           >
//             {/* Header (for vertical layout only) */}
//             {!customizer.isHorizontal && <Header />}

//             {/* Page Content */}
//             <Box
//               sx={{
//                 minHeight: "calc(100vh - 170px)",
//                 py: { sm: 3 },
//               }}
//             >
//               {children}
//             </Box>
//           </Container>

//           <Customizer />
//         </PageWrapper>
//       </Box>
//     </MainWrapper>
//   );
// }


"use client";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { styled, useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import Header from "./layout/vertical/header/Header";
import Sidebar from "./layout/vertical/sidebar/Sidebar";
import Customizer from "./layout/shared/customizer/Customizer";
import Navigation from "./layout/horizontal/navbar/Navigation";
import HorizontalHeader from "./layout/horizontal/header/Header";
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
}));

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();

  const MainWrapper = styled("div")(() => ({
    display: "flex",
    minHeight: "100vh",
    width: "100%",
    padding: customizer.isHorizontal ? 0 : "20px",
  }));

  return (
    <MainWrapper>
      <title>Spike NextJs 14.0.3</title>
      {/* ------------------------------------------- */}
      {/* Main Wrapper */}
      {/* ------------------------------------------- */}
      <Box width="100%">
        {/* ------------------------------------------- */}
        {/* Sidebar */}
        {/* ------------------------------------------- */}
        {customizer.isHorizontal ? "" : <Sidebar />}

        {customizer.isHorizontal ? <HorizontalHeader /> : ""}

        {customizer.isHorizontal ? <Navigation /> : ""}
        <PageWrapper
          className="page-wrapper"
          sx={{
            ...(customizer.isCollapse && {
              [theme.breakpoints.up("lg")]: {
                ml: `${customizer.MiniSidebarWidth}px`,
              },
            }),
            ...(!customizer.isCollapse &&
              !customizer.isHorizontal && {
                [theme.breakpoints.up("lg")]: {
                  ml: `${customizer.SidebarWidth}px`,
                },
              }),
          }}
        >
          <Container
            sx={{
              maxWidth:
                customizer.isLayout === "boxed" ? "lg" : "100%!important",
            }}
          >
            {/* ------------------------------------------- */}
            {/* Header */}
            {/* ------------------------------------------- */}
            {customizer.isHorizontal ? " " : <Header />}

            {/* ------------------------------------------- */}
            {/* PageContent */}
            {/* ------------------------------------------- */}

            <Box
              sx={{
                minHeight: "calc(100vh - 170px)",
                py: { sm: 3 },
              }}
            >
              {children}
            </Box>

            {/* ------------------------------------------- */}
            {/* End Page */}
            {/* ------------------------------------------- */}
          </Container>
          <Customizer />
        </PageWrapper>
      </Box>
    </MainWrapper>
  );
}
