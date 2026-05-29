
// import * as React from "react";
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import IconButton from '@mui/material/IconButton';
// import Stack from '@mui/material/Stack';
// import { Theme } from '@mui/material/styles';
// import Toolbar from '@mui/material/Toolbar';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import { styled } from '@mui/material/styles';
// import { useDispatch } from "@/store/hooks";
// import { toggleMobileSidebar } from "@/store/customizer/CustomizerSlice";
// import { IconMenu2 } from "@tabler/icons-react";
// import Notifications from "../../vertical/header/Notification";
// import Profile from "../../vertical/header/Profile";
// import Search from "../../vertical/header/Search";
// import Logo from "../../shared/logo/Logo";
// import HelloBar from "@/app/components/views/NotificationPopup/helloBar/HelloBar";
// import ThemeToggleButton from "../modetheme/modetheme";
// import ConditionalPopup from "../../vertical/header/Conditionalpopup";
// import Navigation from "../navbar/Navigation";




// export default function Header() {
//   const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));
//   const dispatch = useDispatch();
//   const AppBarStyled = styled(AppBar)(({ theme }) => ({
//     background: theme.palette.background.paper,
//     justifyContent: "center",
//     backdropFilter: "blur(4px)",
//     borderBottom: '1px solid rgba(0,0,0,0.05)',

//   }));
//   const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
//     margin: "0 auto",
//     width: "100%",
//     color: `${theme.palette.text.secondary} !important`,

//   }));
// const [show, setShow] = React.useState(false);
//   return (
//     <AppBarStyled position="sticky" color="default" elevation={0}>


//       <HelloBar />
//       <Toolbar sx={{ maxWidth: "100%" }}>
//         <Box sx={{ width: lgDown ? "0px" : "auto", overflow: "hidden",marginLeft:{lg:"9%"}

//  }}>
//           <Logo />
//         </Box>

//         {lgDown && (
//            <>
//             <IconButton color="inherit" aria-label="menu" onClick={() => setShow(!show)}>
//               <IconMenu2 />
//             </IconButton>
//             <Navigation slider={show} setSlider={setShow} />
//           </>
//         )}

//         <Box flexGrow={1} />
//         <Stack spacing={1} direction="row" alignItems="center" sx={{marginRight:{lg:"7%"}}}>
//           <Search />

//           {/* Use the ThemeToggleButton component */}
//           <ThemeToggleButton />

//           <Notifications />
//          <Box >
//           <ConditionalPopup  />
//           </Box>
//           <Profile />
//         </Stack>
//       </Toolbar>
//     </AppBarStyled>
//   );
// }



"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { Theme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/material/styles";
import { useDispatch } from "@/store/hooks";
import { toggleMobileSidebar } from "@/store/customizer/CustomizerSlice";

import { IconMenu2 } from "@tabler/icons-react";
// import Notifications from "../../vertical/header/Notification";
// import Profile from "../../vertical/header/Profile";
// import Search from "../../vertical/header/Search";
import Logo from "../../shared/logo/Logo";
import HelloBar from "@/app/components/views/NotificationPopup/helloBar/HelloBar";
import ThemeToggleButton from "../modetheme/modetheme";
import ConditionalPopup from "../../vertical/header/Conditionalpopup";
import Navigation from "../navbar/Navigation"; // Keep this import
import Search from "../../vertical/header/Search";

// ✅ Define memoized MobileNavigation inside same file
const MobileNavigation = React.memo(({ lgDown }: { lgDown: boolean }) => {
  const [show, setShow] = React.useState(false);

  if (!lgDown) return null;

  return (
    <>
      <IconButton color="inherit" aria-label="menu" onClick={() => setShow(!show)}>
        <IconMenu2 />
      </IconButton>
      {show && <Navigation slider={show} setSlider={setShow} />}
    </>
  );
});

export default function Header() {
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));
  const dispatch = useDispatch();

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    background: theme.palette.background.paper,
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
  }));

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    margin: "0 auto",
    width: "100%",
    color: `${theme.palette.text.secondary} !important`,
  }));

  return (
    <AppBarStyled position="sticky" color="default" elevation={0}>
      {/* <HelloBar /> */}
      <Toolbar sx={{ maxWidth: "100%" }}>
        <Box
          sx={{
            width: lgDown ? "0px" : "auto",
            overflow: "hidden",
            marginLeft: { lg: "9%" },
          }}
        >
          <Logo />
        </Box>

        {/* ✅ Inline memoized mobile menu */}
        <MobileNavigation lgDown={lgDown} />

        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center" sx={{ marginRight: { lg: "7%" } }}>
          <Search />
          {/* <ThemeToggleButton /> */}
          {/* <Notifications />  */}
          <Box>
            {/* <ConditionalPopup /> */}
          </Box>
          {/* <Profile /> */}
        </Stack>
      </Toolbar>
    </AppBarStyled>
  );
}   

