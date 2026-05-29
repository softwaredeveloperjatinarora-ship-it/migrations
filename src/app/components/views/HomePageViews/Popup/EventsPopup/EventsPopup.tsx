
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Box,
  Typography,
  Card,
  IconButton,
} from "@mui/material";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import { useSession } from "next-auth/react";
import { getEventsAction } from "@/app/actions/homeAction/EventsDetails/getEventsAction";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import { useTheme } from "@mui/material/styles";
import { IconX } from "@tabler/icons-react";
import ViewDetailsPopup from "./ViewDetailsPopup";
import AllEventsTabs from "./AllEvents/AllEventsTabs";

interface PopupProps {
  open: boolean;
  handleClose: () => void;
  title: string;
}

const EventsPopup: React.FC<PopupProps> = ({ open, handleClose, title }) => {
  const descriptionElementRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [Eventdata, setEventdata] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const borderColor = theme.palette.divider;

  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [allEventsOpen, setAllEventsOpen] = useState(false); // <-- NEW STATE

  const handleOpenViewDetails = () => {
    setViewDetailsOpen(true);
  };

  const handleCloseViewDetails = () => {
    setViewDetailsOpen(false);
  };

  const handleOpenAllEvents = () => {
    setAllEventsOpen(true);
  };

  const handleCloseAllEvents = () => {
    setAllEventsOpen(false);
  };

  const fetchData = async () => {
    try {
      const response = await getEventsAction();
      let splitValue = String(session?.user?.token).split("NEXT2121ANG");
      const ApiData1 = decryptDataforResponse(response.ApiData, splitValue[1]);
      const parsedData = JSON.parse(ApiData1);
      setEventdata(parsedData);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
      if (descriptionElementRef.current) {
        descriptionElementRef.current.focus();
      }
    }
  }, [open]);

  return (
    <>
      {/* ViewDetailsPopup */}
      <ViewDetailsPopup
        open={viewDetailsOpen}
        handleClose={handleCloseViewDetails}
        title="Division of Student Welfare Contact Details"
      />

      {/* AllEventsTabs */}
      <AllEventsTabs
        open={allEventsOpen}
        handleClose={handleCloseAllEvents}
        title={title}
        count={Eventdata.length}
      />

      {/* Main Events Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: "100%",
            height: "90%",
            borderRadius: "16px",
            boxShadow: 24,
            backgroundColor: theme.palette.background.paper,
          },
        }}
        maxWidth="lg"
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {title}
          <IconButton onClick={handleClose} size="small" sx={{ ml: 2 }}>
            <IconX size={24} />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Scrollbar sx={{ height: "450px", padding: "10px" }}>
          <Box
              sx={{
                display: {lg:"flex"},
                // justifyContent: { lg: "right", xs: "left" },
                justifyContent: { lg: "space-between",},
                mb: 0,
                marginTop: { lg: "-10px", xs: "4px " },
                marginLeft:{xs:1,lg:0}
              }}
            >
              <Typography variant="h6">Get your event listed here through email events@lpu.co.in</Typography>
              <Button
                variant="outlined"
                onClick={handleOpenViewDetails}
                sx={{ padding: "0px 25px" ,mt:{xs:1,lg:0}}}
              >
                View Details
              </Button>
            </Box>

            <Grid container spacing={3}>
              {Eventdata.map((process, i) => (
                // <Grid size={{ lg: 4, sm: 6, xs: 12, md: 4 }}  key={i}>
                <Grid size={{  sm: 6, xs: 12, md: 4 }}  key={i}>
                  <Card
                    sx={{
                      cursor: "default",
                      border: `1px solid ${borderColor}`,
                      padding: "20px",
                      borderRadius: "12px",
                      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                      marginTop: { xs: 1 },
                      height: { lg: "200px" },
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        marginBottom: "10px",
                        textAlign: "center",
                        color: "secondary.main",
                      }}
                    >
                      {process.title}
                    </Typography>

                    <Box>
                      <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
                        📅 <b>Date:</b> {process.eventDate}
                      </Typography>
                      <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
                        ⏰ <b>Time:</b> {process.eventTime}
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        📍 <b>Venue:</b> {process.venue}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Scrollbar>
        </DialogContent>

        <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            color="primary"
            sx={{ backgroundColor: "primary.main", color: "white" }}
            onClick={handleOpenAllEvents}
          >
            All Events
          </Button>

          <Button color="primary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventsPopup;
