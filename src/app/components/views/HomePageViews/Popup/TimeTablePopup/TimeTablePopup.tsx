

"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import Weekly from "./timetable/Weekly";
import { useSession } from "next-auth/react";
import { GetStudentMyTimeTableAction } from "@/app/actions/homeAction/StudentTimeTable/GetStudentMyTimeTableAction";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import Daily from "./timetable/Daily";
import { IconX } from "@tabler/icons-react";

interface PopupProps {
  open: boolean;
  handleClose: () => void;
  title: string;
}

const TimeTablePopup: React.FC<PopupProps> = ({ open, handleClose, title }) => {
  const isDataFetched = useRef(false);
  const [allData, setAllData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const [dayData, setDayData] = useState<any[]>([]);
  const [weekData, setWeekData] = useState<any[]>([]);
  const [showWeekTab, setShowWeekTab] = useState(false); // State to control the visibility of the Week tab


  const fetchtimetableData = async () => {
    if (isDataFetched.current || !session?.user?.token) return;
    setLoading(true);

    try {
      setLoading(true);
      const response = await GetStudentMyTimeTableAction();

      if (response.status === "success") {
        const splitValue = String(session.user.token).split("NEXT2121ANG");
        const decryptedData = decryptDataforResponse(response.ApiData, splitValue[1]);
        const parsedData = JSON.parse(decryptedData);
        setAllData(parsedData);
        // console.log(" all time Table data", parsedData);
        const dayData = parsedData?.[0]?.Day || [];
        const weekData = parsedData?.[0]?.Week || [];

        setDayData(dayData);
        setWeekData(weekData);

        // Check if weekData is present to show the Week tab
        setShowWeekTab(weekData && weekData.length > 0);

        // console.log("Day Data:", dayData);
        // console.log("Week Data:", weekData);
      } else {
        setError(response.message || "Unknown error occurred");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
      isDataFetched.current = true;
    }
  };



  const descriptionElementRef = React.useRef<HTMLDivElement>(null);

  const [selectedTab, setSelectedTab] = useState(0);

  React.useEffect(() => {
    if (open) {
      fetchtimetableData();
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      PaperProps={{ sx: { width: "100%", height: "90%" } }}
      maxWidth="lg"
    >
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>


          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {title}
            <IconButton onClick={handleClose} size="small" sx={{ ml: 2 }}>
              <IconX color="#FF8488" size={24} />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Scrollbar sx={{ height: "100%" }}>
              <Box sx={{ width: "100%", gap: 2, marginTop: -2 }}>
                <Tabs
                  value={selectedTab}
                  onChange={handleTabChange}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    padding: 0,
                    marginBottom: 2,
                  }}
                >

                  <Tab label="Daily" sx={{ textAlign: "left", padding: 0 }} />
                  {showWeekTab && <Tab label="Weekly" sx={{ textAlign: "left", padding: 0 }} />}
                </Tabs>

                {allData && allData.length > 0 && selectedTab === 0 && <Daily apiData={allData} />}
                {allData && allData.length > 0 && selectedTab === 1 && showWeekTab && <Weekly apiData={allData} />}
              </Box>
            </Scrollbar>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default TimeTablePopup;



