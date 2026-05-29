"use client";
import Box from "@mui/material/Box";
import { styled, useTheme } from "@mui/material/styles";
import React, { useState } from "react";
//import Header from "./layout/vertical/header/Header";
// import Sidebar from "./layout/vertical/sidebar/Sidebar";
//import Customizer from "./layout/shared/customizer/Customizer";
import Customizer from "./layout/shared/customizer/Customizer";
import Navigation from "./layout/horizontal/navbar/Navigation";
import HorizontalHeader from "./layout/horizontal/header/Header";
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";

import Chatmessenger from "@/app/components/views/DoMessages/Chatmessenger";
import { position } from "html2canvas/dist/types/css/property-descriptors/position";
import Header from "./layout/horizontal/header/Header";

//import Header from "../../layout/vertical/header/Header";

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
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();

  const MainWrapper = styled("div")(() => ({
    display: "flex",
    minHeight: "100vh",
    width: "100%",
    padding: customizer.isHorizontal ? 0 : "20px",
    // backgroundColor: (theme) =>
    //   theme.palette.mode === "dark" ? "#212946" : theme.palette.grey[200]
  }));

  return (
    <MainWrapper>
      <title>Lovely Professional University</title>
      {/* ------------------------------------------- */}
      {/* Main Wrapper */}
      {/* ------------------------------------------- */}
      <Box width="100%">
        {/* PageContent */}

        {/* ------------------------------------------- */}
        {/* Sidebar */}
        {/* ------------------------------------------- */}
     
        {/* {customizer.isHorizontal ? "" : <Sidebar />} */}
  
        {customizer.isHorizontal ? <HorizontalHeader /> : ""}
           {customizer.isHorizontal ? <Navigation slider={isSidebarOpen} setSlider={setSidebarOpen} /> : ""}  

     
        {/* <PageWrapper
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
        > */}
          <Box sx={{ width: "100%" }}>
            {/* ------------------------------------------- */}
            {/* Header */}
            {/* ------------------------------------------- */}
            {customizer.isHorizontal ? " " : <Header />}

            {/* ------------------------------------------- */}
            {/* PageContent */}
            {/* ------------------------------------------- */}

            <Box sx={{ minHeight: "calc(100vh - 170px)" }}>
              {/* <Outlet /> */}
              {children}
              {/* <Index /> */}
            </Box>

            {/* ------------------------------------------- */}
            {/* End Page */}
            {/* ------------------------------------------- */}
          </Box>
          <Box sx={{position:"absolute"}}>
          {/* <Chatmessenger /> */}
          
          </Box>
          <Customizer />
        {/* </PageWrapper> */}
      </Box>
    </MainWrapper>
  );
}
