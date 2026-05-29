




import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Grid,
  Stack,
  useTheme,
} from "@mui/material";
import {
  IconFileText,
  IconBook,
  IconX,
  IconListDetails,
  IconChecklist,
} from "@tabler/icons-react";
import PendingAssignment from "./PendingAssignment";
import CompletedAssignmen from "./CompletedAssignment";
import Ebook from "./Ebook";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import { useSession } from "next-auth/react";
import { getAssignmentAction } from "../../../../../actions/homeAction/Assignment/getAssignmentAction";
import { TotalAssignment } from "./TotalAssignment";

interface PopupProps {
  open: boolean;
  handleClose: () => void;
  title: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const AssignmentPopup: React.FC<PopupProps> = ({ open, handleClose, title }) => {
  const [value, setValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [CompletedCount, setCompletedCount] = useState(0);
  const [EContentCount, setEContentCount] = useState(0);
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [assignment, setAssignments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await getAssignmentAction();
      let splitValue = String(session?.user?.token).split("NEXT2121ANG");
      const ApiData1 = decryptDataforResponse(response.ApiData, splitValue[1]);
      const parsedData = JSON.parse(ApiData1);

      setAssignments(parsedData);
      const pendingCount1 = parsedData.filter((item: any) => item.category === "Pending").length;
      const completedCount1 = parsedData.filter((item: any) => item.category === "Completed").length;
      const EContentCount1 = parsedData.filter((item: any) => item.category === "Econtent").length;

      setPendingCount(pendingCount1);
      setCompletedCount(completedCount1);
      setEContentCount(EContentCount1);
      setTotalCount(parsedData.length);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchData();
  }, [open]);

  const handleClick = (status: string) => {
    switch (status) {
      case "Total":
        setValue(0);
        break;
      case "Pending":
        setValue(1);
        break;
      case "Completed":
        setValue(2);
        break;
      case "Content":
        setValue(3);
        break;
      default:
        setValue(0);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          handleClose();
        }
      }}
      PaperProps={{ sx: { width: "100%", height: "90%" } }}
      maxWidth="lg"
      disableEscapeKeyDown={true}
    >
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

      <Box sx={{ position: "sticky", top: 0, background: "", zIndex: 10, px: 3 }}>
        <Grid container spacing={3}>
          {/* Total Tab */}
          <Grid size={{ xs: 12, sm: 6, md:6 , lg: 3 }}  >
            <Box
              bgcolor="primary.light"
              p={2}
              width="90%"
              onClick={() => handleClick("Total")}
              sx={{
                cursor: "pointer",
                borderBottom: value === 0 ? `3px solid ${useTheme().palette.primary.main}` : "none",
              }}
            >
              <Stack direction="row" gap={2} alignItems="center">
                <Box
                  width={32}
                  height={32}
                  bgcolor="primary.main"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography color="primary.contrastText">
                    <IconListDetails width={18} />
                  </Typography>
                </Box>
                <Box>
                  <Typography>Total</Typography>
                  <Typography fontWeight={500}>{totalCount}</Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Pending Tab */}
          <Grid size={{ xs: 12, sm: 6, md:6 , lg: 3 }}>
            <Box
              bgcolor="warning.light"
              p={2}
              width="90%"
              onClick={() => handleClick("Pending")}
              sx={{
                cursor: "pointer",
                borderBottom: value === 1 ? `3px solid ${useTheme().palette.warning.main}` : "none",
              }}
            >
              <Stack direction="row" gap={2} alignItems="center">
                <Box
                  width={38}
                  height={38}
                  bgcolor="warning.main"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography color="primary.contrastText">
                    <IconFileText size={22} />
                  </Typography>
                </Box>
                <Box>
                  <Typography>Pending Assignment</Typography>
                  <Typography fontWeight={500}>{pendingCount}</Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Completed Tab */}
          <Grid  size={{ xs: 12, sm: 6, md:6 , lg: 3 }}>
            <Box
              bgcolor="success.light"
              p={2}
              width="90%"
              onClick={() => handleClick("Completed")}
              sx={{
                cursor: "pointer",
                borderBottom: value === 2 ? `3px solid ${useTheme().palette.success.main}` : "none",
              }}
            >
              <Stack direction="row" gap={2} alignItems="center">
                <Box
                  width={38}
                  height={38}
                  bgcolor="success.main"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography color="primary.contrastText">
                    <IconChecklist size={22} />
                  </Typography>
                </Box>
                <Box>
                  <Typography>Completed</Typography>
                  <Typography fontWeight={500}>{CompletedCount}</Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* E-Content Tab */}
          <Grid  size={{ xs: 12, sm: 6, md:6 , lg: 3 }}>
            <Box
              bgcolor="info.light"
              p={2}
              width="90%"
              onClick={() => handleClick("Content")}
              sx={{
                cursor: "pointer",
                borderBottom: value === 3 ? `3px solid ${useTheme().palette.info.main}` : "none",
              }}
            >
              <Stack direction="row" gap={2} alignItems="center">
                <Box
                  width={38}
                  height={38}
                  bgcolor="info.main"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography color="primary.contrastText">
                    <IconBook size={22} />
                  </Typography>
                </Box>
                <Box>
                  <Typography>E-Content</Typography>
                  <Typography fontWeight={500}>{EContentCount}</Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <DialogContent dividers sx={{ border: "none", height: "70vh", overflowX: "auto", overflowY: "auto" }}>
        <TabPanel value={value} index={0}>
          <TotalAssignment searchTerm={searchTerm} onTotalCountChange={setTotalCount} selectedCategory="Total" TotalData={assignment} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <PendingAssignment searchTerm={searchTerm} onPendingCountChange={setPendingCount} selectedCategory="Pending" pendingdata={assignment} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <CompletedAssignmen searchTerm={searchTerm} onCompletedCountChange={setCompletedCount} selectedCategory="Completed" completedData={assignment} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Ebook searchTerm={searchTerm} onEContentCountChange={setEContentCount} selectedCategory="Content" EContentData={assignment} />
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button color="primary" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignmentPopup;
