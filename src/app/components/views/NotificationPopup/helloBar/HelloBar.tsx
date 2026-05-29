
"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Link,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useRef } from "react";
import { useSession } from "next-auth/react";
import { getHelloBarAction } from "../../../../actions/headerAction/HelloBar/getHelloBarAction";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";


const HelloBar: React.FC = ({ onDataFetched }: any) => {
  const isDataFetched = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();
  const [hellloBarData, setHelloBarData] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlacementData = async () => {
      if (isDataFetched.current) return;

      try {
        setLoading(true);
        const response = await getHelloBarAction();

        let splitValue = String(session?.user?.token).split("NEXT2121ANG");
        if (response.status === "success") {
          let apiData = response.ApiData;
          const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
          const parsedData = JSON.parse(decryptedData);

          // console.log("helloobar data", parsedData);
          

          setHelloBarData(parsedData);
          onDataFetched(apiData);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
        isDataFetched.current = true;
      }
    };

    fetchPlacementData();
  }, [onDataFetched, session?.user?.token]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % hellloBarData.length);
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + hellloBarData.length) % hellloBarData.length);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") handleNext();
      if (event.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % hellloBarData.length);
    }, 3000);
    return () => clearTimeout(interval);
  }, [currentIndex, hellloBarData]);
const colors= hellloBarData[currentIndex]?.COLOR || "#1976d2"
const urls=hellloBarData[currentIndex]?.NavigationURL
// console.log("url",urls)

  // Safely trim message based on screen size
  const displayedMessage = useMemo(() => {
    // Safely access Blockreason, default to empty string if undefined
    const messageText = hellloBarData[currentIndex]?.Blockreason || "";

    // Handle trimming of messageText
    return isMobile
      ? messageText.length > 100
        ? messageText.slice(0, 60) + "..."
        : messageText
      : messageText.length > 140
        ? messageText.slice(0, 140) + "..."
        : messageText;
  }, [currentIndex, isMobile, hellloBarData]);
  if (hellloBarData.length === 0) return null;
  return (
    
    <Box
      sx={{
        width: "100%",
        backgroundColor: colors, // Dynamic color based on COLOR
        color: "white",
        textAlign: "center",
        py: 1,
        height: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        position: "relative",
        borderRadius: 0,
      }}
      
    >
      <IconButton onClick={handlePrev} sx={{ color: "white" }}>
        <ArrowBackIosIcon sx={{ fontSize: "15px" }} />
      </IconButton>

      <Typography
        variant="body1"
        fontWeight="bold"
        sx={{
          flex: 1,
          textAlign: "center",
          fontSize: { xs: "8px", sm: "10px", md: "12px" },
          marginBottom: { xs: "0px", sm: "0px", md: "0px" },
        }}
      >
       <Link href={urls} style={{ textDecoration: 'none',color:"white" }}>{displayedMessage}</Link> 
      </Typography>
     

      <IconButton onClick={handleNext} sx={{ color: "white" }}>
        <ArrowForwardIosIcon sx={{ fontSize: "15px" }} />
      </IconButton>

      {!isMobile && (
        <Box
          sx={{
            position: "absolute",
            bottom: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "4px",
            pb: 1,
          }}
        >
          {hellloBarData.map((_, index) => (
            <IconButton
              key={index}
              sx={{
                color:
                  index === currentIndex ? "gold" : "rgba(255,255,255,0.5)",
                p: 0.5,
              }}
            ></IconButton>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default HelloBar;






