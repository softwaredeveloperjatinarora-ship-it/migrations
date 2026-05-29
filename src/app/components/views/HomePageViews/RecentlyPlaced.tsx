"use client";
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Box, Stack } from "@mui/material";
import { Icon } from "@iconify/react";
interface placemnentData {
  placementdata: any[];
}
const RecentPlaced = ({ placementdata }: placemnentData) => {
  
  const [recentplacedData, setrecentplacedData] = useState<any[]>([]);
 

  useEffect(() => {
    if (placementdata && placementdata.length > 0) {
      setrecentplacedData(
        placementdata.filter((data) => data.driveId !== null)
      );
    }
  }, [placementdata]);

  const numberOfItems = recentplacedData.length;
  const keyframes = generateKeyframes(numberOfItems);

  return (
    <Card className="cardWithShadow" sx={{ height: "246px", padding: 0 }}>
      <Box
        
        sx={{
          paddingTop: "8px",
          paddingBottom: "8px",
          borderRadius: "0",
          borderBottom: "1px solid #E0E0E0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          whiteSpace: "nowrap",
          cursor: "default",
          textAlign: "center",
          fontSize: "14px",
          gap: "8px",
          fontWeight: "bolder",
        }}
      >
       
        <Icon
          icon="wpf:worldwide-location"
          style={{ fontSize: "25px" }}
        />
        Recently Placed
        {/* </h1> */}
      </Box>

      <Box
        sx={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            // gap: 1,
            gap: { xs: 1.5, lg: 1 },

            animation: "recentPlacedSlide 20s ease-in-out infinite",
            "&:hover": {
              animationPlayState: "paused",
            },
          }}
        >
          {recentplacedData.map((data, index) => (
            <Card
              key={index}
              className="cardWithShadow"
              sx={{
                boxShadow: "none",
                marginTop: 2.8,
                display: "flex",
                flexDirection: "column",
                height: "170px",
                flexShrink: 0,
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                p: 2,
              }}
            >
              <Icon icon="subway:location" style={{ fontSize: "17px" }} />
              <Stack direction="column" alignItems="center">
                {/* Company Name */}
                <Typography
                  variant="subtitle1"
                  color="secondary.main"
                  fontWeight="bold"
                  textAlign="center"
                  fontSize={"15px"}
                  sx={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                >

                  {data.companyName}
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  color="text.secondary"
                  fontSize="14px"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center", // Ensures vertical alignment
                    gap: 1,
                    marginTop: 1,
                    textAlign: "center",
                  }}
                >
                  <Icon icon="grommet-icons:money" width={20} height={20} style={{  verticalAlign: "middle",fontSize: "17px" }} />
                  Package (CTC): <b>{data.package}</b>
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  color="text.secondary"
                  fontSize="14px"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center", // Ensures vertical alignment
                    gap: 1,
                    marginTop: 1,
                    textAlign: "center",
                  }}
                >
                  <Icon
                    icon="vaadin:group"
                    width={17}
                    height={17}
                    style={{ verticalAlign: "middle" }}
                  />
                  Total Students Placed: <b>{data.total}</b>
                </Typography>

                {/* </Stack> */}
              </Stack>
            </Card>
          ))}
        </Box>
        <style jsx>{`
          @keyframes recentPlacedSlide {
            ${keyframes}
          }
        `}</style>
      </Box>
    </Card>
  );
};

// Function to generate keyframes with hold time
const generateKeyframes = (numberOfItems: number) => {
  let keyframes = "";
  const totalDuration = 100;
  const holdTime = 20;
  const slideTime = (totalDuration - holdTime * numberOfItems) / numberOfItems;

  for (let i = 0; i < numberOfItems; i++) {
    const startHold = i * (holdTime + slideTime);
    const endHold = startHold + holdTime;
    const startSlide = endHold;
    const endSlide = startSlide + slideTime;

    // Add hold time
    keyframes += `
      ${startHold}%, ${endHold}% {
        transform: translateX(-${i * 103}%);
      }
    `;

    // Add slide time
    if (i < numberOfItems - 1) {
      keyframes += `
        ${startSlide}%, ${endSlide}% {
          transform: translateX(-${(i + 1) * 103}%);
        }
      `;
    }
  }

  // Add final hold time for the last item
  keyframes += `
    100% {
      transform: translateX(0%);
    }
  `;

  return keyframes;
};

export default RecentPlaced;
