"use client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";
import { useTheme } from "@mui/material/styles";
import { Icon } from "@iconify/react";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import React, { useEffect, useState } from "react";
import { Divider } from "@mui/material";

interface PlacementData {
  placementdata: any[];
}

const Placement = ({ placementdata }: PlacementData) => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();
  const borderColor = theme.palette.divider;

  const [loading, setLoading] = useState<boolean>(true);
  const [placedata, setPlacedata] = useState<any[]>([]);

  useEffect(() => {
    if (placementdata && placementdata.length > 0) {
      setPlacedata(placementdata.filter((data) => data.driveId === null));
    }
  }, [placementdata]);

  return (
    <>
      <Card
        sx={{
          padding: 0,
          borderRadius: "12px", // Make the card rounded
          // height: "246px"
          height: { xs: "410px", lg: "246px" },
        }}
      >
        <Box
          sx={{
            // borderRadius: "4px",
            paddingTop: "8px",
            paddingBottom: "8px",
            borderRadius: "0",
            borderBottom: "1px solid #E0E0E0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // borderRadius: "12px 12px 0 0", // Rounded top corners
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              cursor: "default",

              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "16px",
            }}
          >
            <Icon icon="hugeicons:permanent-job" style={{ fontSize: "24px" }} />
            Today's Placement Drives
          </Typography>
        </Box>

        <Scrollbar sx={{ height: { xs: "100%", lg: "100%" } }}>
          <Box
            sx={{
              height: {
                xs: "300px",
                lg: "100%",
              },
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: 2,
              margin: 2,
            }}
          >
            {/* Display placement cards */}
            {placedata.length > 0 ? (
              placedata.map((placement, index) => (
                <React.Fragment key={index}>
                  <Box
                    sx={{
                      p: 0,
                      pl: 2,
                      // mb: 2,
                      cursor: "default",
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      borderWidth: "0 0 0 3px",
                      borderStyle: "solid",
                      borderColor: "primary.main",
                      borderRadius: 0,
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        color: theme.palette.secondary.main,
                        mb: 2.5,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "16px",
                      }}
                    >
                      <Box>
                        <Icon
                          icon="tabler:point"
                          style={{
                            fontSize: "18px",
                            color: theme.palette.primary.main,
                          }}
                        />
                      </Box>
                      {placement.companyName}
                      <Box>
                        <Icon
                          icon="tabler:point"
                          style={{
                            fontSize: "18px",
                            color: theme.palette.primary.main,
                          }}
                        />
                      </Box>
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: "bold", color: "text.primary" }}
                    >
                      <b>Batch:</b> {placement.batchYear}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      <b>Stream:</b> {placement.stream}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      <b>Salary:</b> {placement.salaryPackage}
                    </Typography>
                  </Box>
                  {index !== placedata.length - 1 && <Divider sx={{}} />}{" "}
                  {/* Horizontal line between cards */}
                </React.Fragment>
              ))
            ) : (
              <Typography
                textAlign="center"
                sx={{ padding: "10px", color: "text.secondary" }}
              >
                {loading ? "Loading..." : "No placement data available"}
              </Typography>
            )}

            <Stack
              direction="row"
              spacing={1}
              mt={3}
              alignItems="center"
            ></Stack>
          </Box>
        </Scrollbar>
      </Card>
    </>
  );
};

export default Placement;
