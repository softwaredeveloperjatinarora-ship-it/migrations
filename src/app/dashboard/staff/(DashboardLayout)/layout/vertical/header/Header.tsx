

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from "@/store/hooks";
import {
  toggleSidebar,
  toggleMobileSidebar, setDarkMode
} from "@/store/customizer/CustomizerSlice";
import { Icon } from "@iconify/react";
// import Notifications from "./Notification";
// import Profile from "./Profile";
import Cart from "./Conditionalpopup";
// import Search from "./Search";

import { AppState } from "@/store/store";
import { shadows } from "@/utils/theme/Shadows";
import { IconButton } from '@mui/material';
import React from 'react';
const AppBarStyled = styled(AppBar)(({ theme }) => ({
  boxShadow: shadows[9],
  background: theme.palette.background.paper,
  justifyContent: "center",
  backdropFilter: "blur(4px)",
  minHeight: 64,
  borderRadius: 13,
}));

const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
  width: "100%",
  color: theme.palette.text.secondary,
  minHeight: 64,
}));
const Header = () => {
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));
  const smUp = useMediaQuery((theme: any) => theme.breakpoints.up("sm"));


  // drawer
  const customizer = useSelector((state: AppState) => state.customizer);
  const dispatch = useDispatch();

  // const AppBarStyled = styled(AppBar)(({ theme }) => ({
  //   boxShadow: shadows[9],
  //   background: theme.palette.background.paper,
  //   justifyContent: "center",
  //   backdropFilter: "blur(4px)",
  //   // [theme.breakpoints.up("lg")]: {
  //   minHeight: customizer.TopbarHeight,
  //   // },
  //   borderRadius: 13,
  // }));
  // const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
  //   width: "100%",
  //   color: theme.palette.text.secondary,
  //   minHeight: customizer.TopbarHeight,
  // }));

  return (
    <AppBarStyled position="sticky" color="default"  >
      <ToolbarStyled>
        <Stack spacing={1} direction="row" alignItems="center">
          {/* ------------------------------------------- */}
          {/* Toggle Button Sidebar */}
          {/* ------------------------------------------- */}
          <Button
            color="inherit"
            aria-label="menu"
            size="large"
            className="btn-rounded-circle-40"
          
            
            onClick={
              lgUp
                ? () => console.log()
                : () => console.log()
            }
          >
            <Icon icon="solar:list-bold-duotone" width="24" height="24" />
          </Button>

          {/* ------------------------------------------- */}
          {/* Search Dropdown */}
          {/* ------------------------------------------- */}
        </Stack>
        <Box flexGrow={1} />
        <Stack spacing={2} direction="row" alignItems="center">
          {/* {smUp ? <Search /> : ""} */}
         
          {/* ------------------------------------------- */}
          {/* Ecommerce Dropdown */}
          {/* ------------------------------------------- */}
          <Cart />
          {/* ------------------------------------------- */}
          {/* End Ecommerce Dropdown */}
          {/* ------------------------------------------- */}
          <IconButton size="large" color="inherit">
            {customizer.activeMode === 'light' ? (
              <Icon icon="solar:moon-line-duotone" width="21" height="21" onClick={() => dispatch(setDarkMode('dark'))} />
            ) : (
              <Icon icon="solar:sun-2-line-duotone" width="21" height="21" onClick={() => dispatch(setDarkMode('light'))} />
            )}
          </IconButton>

          {/* <Notifications />
          <Profile /> */}
        </Stack>

      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default  React.memo(Header);
