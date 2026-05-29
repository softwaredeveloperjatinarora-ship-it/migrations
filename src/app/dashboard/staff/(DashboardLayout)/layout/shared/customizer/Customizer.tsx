
import { FC, useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Fab from "@mui/material/Fab";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useSelector, useDispatch } from "@/store/hooks";
import Box, { BoxProps } from "@mui/material/Box";
import { IconSettings, IconCheck } from "@tabler/icons-react";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import { setTheme } from "@/store/customizer/CustomizerSlice";
import { AppState, ProfileState } from "@/store/store";
import { useSession } from "next-auth/react";
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import { getthemeAction } from "@/app/actions/headerAction/Theme/getthemeAction";
const SidebarWidth = "320px";

interface ColorOption {
  id: number;
  bgColor: string;
  disp: string;
  code: string;
}

const Customizer: FC = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const customizer = useSelector((state: AppState) => state.customizer);
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const profilee = useSelector((state: ProfileState) => state.profile) as {
    profileData: { umsColor: string }[];
  };

  const umsColorCode = profilee.profileData[0]?.umsColor || "O";

  const thColors: ColorOption[] = [
    { id: 1, bgColor: "#0085db", disp: "BLUE_THEME", code: "B" },
    { id: 2, bgColor: "#0074BA", disp: "AQUA_THEME", code: "A" },
    { id: 3, bgColor: "#763EBD", disp: "PURPLE_THEME", code: "P" },
    { id: 4, bgColor: "#0A7EA4", disp: "GREEN_THEME", code: "G" },
    { id: 5, bgColor: "#01C0C8", disp: "CYAN_THEME", code: "C" },
    { id: 6, bgColor: "#FA896B", disp: "ORANGE_THEME", code: "O" },
  ];

  const matchedColor = thColors.find((color) => color.code === umsColorCode);
  const defaultTheme = matchedColor?.disp || "ORANGE_THEME";

  useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) {
      dispatch(setTheme(savedTheme));
    } else {
      dispatch(setTheme(defaultTheme));
    }
  }, [defaultTheme, dispatch]);

  const handleThemeChange = async (theme: string, code: string) => {
    if (status !== 'authenticated') {
      console.warn("Session not authenticated, skipping theme change API call");
      dispatch(setTheme(theme)); // Still update Redux state
      localStorage.setItem("selectedTheme", theme); // Persist selected theme
      return;
    }

    dispatch(setTheme(theme)); // Update Redux state
    localStorage.setItem("selectedTheme", theme); // Persist selected theme
    // console.log("selectedTheme", theme,"code",code);

    const formfields = { UMSColor: code, UMSMode: null };

    if (!session || !session.user || !session.user.token) {
      throw new Error("Session or token is missing");
    }

    let splitValue = session.user.token.split("NEXT2121ANG");
    const credentialsJson = JSON.stringify(formfields);


    // Encrypt the data
    const { Data } = encryptData(credentialsJson, splitValue[1]);


    try {
      const response = await getthemeAction(Data); // Make the API call
      let apiData = response.ApiData;
      const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
      // console.log("set colour", decryptedData);
    } catch (error) {
      console.error("Error changing theme:", error);
    }
  };

  return (
    <div>
      <Tooltip title="Settings">        
        <Fab
          color="primary"
          aria-label="settings"
          sx={{ position: "fixed", right: "25px", bottom: "15px" }}
          onClick={() => setShowDrawer(true)}
        >
          <IconSettings stroke={1.5} />
        </Fab>
      </Tooltip>

      <Drawer
        anchor="right"
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        PaperProps={{ sx: { width: SidebarWidth } }}
      >
        <Scrollbar sx={{ height: "calc(100vh - 5px)" }}>
          <Divider />
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Theme Colors
            </Typography>

            {/* Theme color selection */}
            <Grid container spacing={2}>
              {thColors.map((thcolor) => (
                <Grid key={thcolor.id} size={{ xs: 4 }}>
                  <Box
                    sx={{
                      boxShadow: 3,
                      padding: "10px",
                      cursor: "pointer",
                      justifyContent: "center",
                      display: "flex",
                      transition: "0.1s ease-in",
                      border: "1px solid rgba(145, 158, 171, 0.12)",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                    onClick={() => handleThemeChange(thcolor.disp, thcolor.code)}
                  >
                    <Tooltip title={thcolor.disp} placement="top">
                      <Box
                        sx={{
                          backgroundColor: thcolor.bgColor,
                          width: "25px",
                          height: "25px",
                          borderRadius: "60px",
                          alignItems: "center",
                          justifyContent: "center",
                          display: "flex",
                          color: "white",
                        }}
                        aria-label={thcolor.bgColor}
                      >
                        {customizer.activeTheme === thcolor.disp ? (
                          <IconCheck width={13} />
                        ) : (
                          ""
                        )}
                      </Box>
                    </Tooltip>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* User's Selected Theme Box */}
            {/* <Box pt={4}>
              <Typography variant="subtitle1">Your Selected Theme:</Typography>
              <Box
                sx={{
                  backgroundColor:
                    thColors.find((c) => c.disp === customizer.activeTheme)
                      ?.bgColor || "#FFFFFF",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  marginTop: "10px",
                  border: "2px solid rgba(0,0,0,0.2)",
                }}
              >
                {thColors.find((c) => c.disp === customizer.activeTheme)?.code ||
                  "-"}
              </Box>
            </Box> */}
          </Box>
        </Scrollbar>
      </Drawer>
    </div>
  );
};

export default Customizer;

