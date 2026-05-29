"use client";
import { useEffect } from "react";
import Head from "next/head";
import { Box, Typography } from "@mui/material";
import DashboardCard from "../../shared/DashboardCard";
import { Icon } from "@iconify/react";

const SocialFootprints = () => {
  useEffect(() => {
    // Dynamically load SnapWidget script after component mounts
    const script = document.createElement("script");
    script.src = "https://snapwidget.com/js/snapwidget.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <Head>
        <title>Social Footprints</title>
      </Head>

      <DashboardCard>
        <Box>
          {/* <Card sx={{ boxShadow: 3 }}> */}
          {/* <CardContent> */}
          <Box
            textAlign="center"
            sx={{
              paddingTop: "8px",
              paddingBottom: "8px",
              borderRadius: "0",
              borderBottom: "1px solid #E0E0E0",
            }}
          >
            <Typography
              variant="h4"
              gap={1}
              fontWeight="bold"
              display={"flex"}
              justifyContent={"center"}
              align="center"
            >
              <Icon icon="tabler:social" style={{ fontSize: "25px" }} />
              Social Footprints
            </Typography>
          </Box>

          {/* Instagram Feed */}
          <Box sx={{ width: "100%", mt: 4 }}>
            <iframe
              src="https://snapwidget.com/embed/1070224"
              className="snapwidget-widget"
              frameBorder="0"
              scrolling="no"
              style={{
                border: "none",
                overflow: "hidden",
                width: "100%",
                height: "440px",
              }}
              title="Posts from Instagram"
            ></iframe>
          </Box>
          {/* </CardContent> */}
          {/* </Card> */}
        </Box>
      </DashboardCard>
    </>
  );
};

export default SocialFootprints;
