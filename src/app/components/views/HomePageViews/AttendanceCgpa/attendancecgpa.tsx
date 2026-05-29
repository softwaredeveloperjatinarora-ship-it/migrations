"use client";
import Typography from "@mui/material/Typography";
import Percentage from "./Cgpa/page";
import Attendence from "./Attendance/attendance";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import { getFeeNumberAction } from "@/app/actions/homeAction/feeNumber/getFeeNumberAction";
import { Box, Button, Card, Grid } from "@mui/material";
import { Icon } from "@iconify/react";
const Attendenceper = ({ onDataFetched }: any) => {
  const iconData = {
    // icon: "/images/Homepageimage/feedue.png",
    percentage: "112000",
    label: "Fee Due",
    color: "success",
  };

  const isDataFetched = useRef(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();
  const [feedata, setFeeata] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    const fetchPlacementData = async () => {
      if (isDataFetched.current) return;

      try {
        setLoading(true);
        const response = await getFeeNumberAction();
        let splitValue = String(session?.user?.token).split("NEXT2121ANG");
        if (response.status === "success") {
          let apiData = response.ApiData;
          const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
          const parsedData = JSON.parse(decryptedData);

          setFeeata(parsedData);
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
  }, [onDataFetched]);


  // useEffect(() => {
  //   if (feedata[0]?.pendingFee > 1) {
  //     setOpen(true);
  //   }
  // }, [feedata[0]?.pendingFee]);


  // const handleCloseModal = () => {
  //   setOpen(false);
  // };


  const styleForModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    outline: "none",
  };

  return (



    < Box sx={{ justifyContent: "space-between", display: "flex", flexDirection: "column", height: "100%" }
    }>
      <Grid container spacing={3}>
        {/* Stacked vertically on small screens, side-by-side on larger screens */}

        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
          <Percentage />
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
          <Attendence />
        </Grid>
      </Grid>

      <Card className="cardWithShadow" sx={{ marginTop: { xs: 3, lg: 0 }, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 2 }}>
        <Box ml={2} display="flex" justifyContent="center" alignItems="center">
          <Box display="flex" alignItems="center">
            {/* Icon Box */}
            <Box px={1}>
              {/* <img src={iconData.icon} alt="icon" width={55} /> */}
              <Icon icon="emojione-monotone:money-bag" width={45} />
            </Box>

            {/* Text and Fee Info */}
            <Box display="flex" flexDirection="column" ml={2}> {/* Use flexDirection column to stack "Due Fee" and the fee below it */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, cursor: "default" }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  fontSize={15}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Due Fee
                </Typography>

                <Typography
                  variant="subtitle1"
                  sx={{ cursor: "default" }}
                  fontWeight={600}
                  color={
                    loading
                      ? "black"
                      : feedata[0]?.pendingFee < 1
                        ? "success.main"
                        : typeof feedata[0]?.pendingFee === "number"
                          ? "#FF4D4D"
                          : "black"
                  }
                >
                  {loading
                    ? "Loading..."
                    : feedata[0]?.pendingFee === 0
                      ? "Nil"
                      : feedata[0]?.pendingFee ?? "N/A"}
                </Typography>
              </Box>

            </Box>
          </Box>


          <Button
            // variant="contained"
            size="large"
            variant="text"
            // color="primary"
            color="primary"
            sx={{

              marginLeft: "auto",
              whiteSpace: "nowrap",

            }}
          >
            Pay Fee
          </Button>
        </Box>

        {/* Modal for Attendance Alert */}
        {/* <Modal open={open} onClose={handleCloseModal} aria-labelledby="attendance-modal-title">
          <Box sx={styleForModal}>
            <Typography variant="h5" id="attendance-modal-title">
              Fee Alert
            </Typography>
            <Typography variant="body1" mt={2}>
              Your Fee is Due {feedata[0]?.pendingFee}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleCloseModal}
              sx={(theme) => ({
                position: "absolute",
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              })}
            >
              <IconX size={24} />
            </IconButton>
          </Box>
        </Modal> */}
      </Card>
    </Box >

  );
};

export default Attendenceper;
