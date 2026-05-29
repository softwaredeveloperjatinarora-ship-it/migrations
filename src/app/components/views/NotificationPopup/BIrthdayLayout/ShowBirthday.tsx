"use client";
import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import {
  Box,
  Typography,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  Paper,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "@/store/hooks";
import { ProfileState } from "@/store/store";

const ShowBirthday: React.FC = () => {
  const profilee = useSelector(
    (state: ProfileState) => state.profile
  ) as { profileData: { dateOfBirth: string }[] };

  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    // console.log("Profile DOB raw:", profilee.profileData[0]?.dateOfBirth);

    // Test forced visibility after 2 seconds (remove later)
    // setTimeout(() => setIsVisible(true), 2000);

    // Commenting out localStorage check for debugging
    const hasThanked = localStorage.getItem("birthday") === "true";
    if (hasThanked) {
      // console.log("User already thanked, hiding popup");
      setIsVisible(false);
      return;
    }

    if (!profilee.profileData?.length) {
      // console.log("No profile data found");
      setIsVisible(false);
      return;
    }

    const today = new Date();
    const userBirthday = new Date(profilee.profileData[0].dateOfBirth);

    // console.log("Parsed user birthday:", userBirthday);

    if (isNaN(userBirthday.getTime())) {
      // console.log("Invalid birthday date");
      setIsVisible(false);
      return;
    }

    const isBirthday =
      today.getMonth() === userBirthday.getMonth() &&
      today.getDate() === userBirthday.getDate();

    // console.log("Is birthday today?",userBirthday.getMonth() );

    setIsVisible(isBirthday);
  }, [profilee]);

  useEffect(() => {
    // console.log("Visibility changed:", isVisible);
    if (!isVisible) return;

    const colors = [
      "#a786ff",
      "#fd8bbc",
      "#90CAF9",
      "#F48FB1",
      "#FFB74D",
      "#81C784",
      "#FF69B4",
      "#00C2FF",
      "#FF3CAC",
    ];

    let animationFrameId: number;

    const animateConfetti = () => {
      confetti({
        particleCount: 15,
        angle: 60,
        spread: 120,
        origin: { x: 0, y: 0.9 },
        colors,
      });

      confetti({
        particleCount: 15,
        angle: 120,
        spread: 120,
        origin: { x: 1, y: 0.9 },
        colors,
      });

      animationFrameId = requestAnimationFrame(animateConfetti);
    };

    animateConfetti();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isVisible]);

  const handleClose = () => {
    // console.log("Close clicked");
    localStorage.setItem("birthday", "true");
    setIsVisible(false);
  };

  const handleThankYou = () => {
    // console.log("Thank You clicked - storing localStorage flag");
    localStorage.setItem("birthday", "true");
    setIsVisible(false);
  };
    
  if (!isVisible)
    return  null; 


  return (
    <Fade in={isVisible}>
      <Box
        sx={{
          position: "fixed",
          zIndex: 1300,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Paper
          elevation={12}
          sx={{
            position: "relative",
            p: { xs: 4, md: 6 },
            width: { xs: "90%", sm: "700px" },
            borderRadius: 2,
            textAlign: "center",
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, #1e1e1e, #2c2c2c)"
                : "linear-gradient(135deg, #ffffff, #f3f3f3)",
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: 12, right: 12 }}
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>

          <Typography
            variant={isSmallScreen ? "h4" : "h1"}
            fontWeight="bold"
            gutterBottom
            sx={{
              fontFamily: "'Birthday', sans-serif",
              fontSize: isSmallScreen ? "2.8rem" : "4rem",
              lineHeight: 1.2,
              color: theme.palette.mode === "dark" ? "#fff" : "#222",
              textShadow:
                theme.palette.mode === "dark"
                  ? "2px 2px 4px rgba(255, 255, 255, 0.2)"
                  : "2px 2px 6px rgba(0, 0, 0, 0.2)",
            }}
          >
            🎉 Happy Birthday! 🎂
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 4,
              mb: 5,
              fontSize: isSmallScreen ? "1rem" : "1.5rem",
              fontFamily: "'Birthday', sans-serif",
              color: theme.palette.text.secondary,
            }}
          >
            Wishing you a day filled with love, laughter, and joy. May your
            year ahead be as amazing as you are!
          </Typography>

          <Button
            variant="contained"
            onClick={handleThankYou}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "0.95rem",
              textTransform: "none",
              borderRadius: 2,
              backgroundColor: "#90CAF9",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#64b5f6",
              },
            }}
          >
            Thank You!
          </Button>
        </Paper>
      </Box>
    </Fade>
  );
};

export default ShowBirthday;
