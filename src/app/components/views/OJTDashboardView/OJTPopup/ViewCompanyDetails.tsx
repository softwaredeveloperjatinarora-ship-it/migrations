
"use client";

import {
  Box,
  Avatar,
  Typography,
  Chip,
  Dialog,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import { useState } from "react";
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import DriveDetails from "../Driveddetails";
import JobDescriptionDetails from "../OJTJobdescription";
import Uploaddata from "../OJTUploaddocument";
import TimelineWrapper from "../OJTtracking";

interface CompanyDetailsProps {
  isOpen: boolean;
  closeModal: (data?: boolean) => void;
  company: any;
}

const TabPanel = ({ children, value, index }: any) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
};

const ViewCompanyDetails: React.FC<CompanyDetailsProps> = ({
  isOpen,
  closeModal,
  company,
}) => {
  if (!isOpen) return null;

  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleClose = () => {
    closeModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "success";
      case "cancelled":
        return "error";
      case "deleted":
        return "warning";
      case "pending":
        return "info";
      default:
        return "default";
    }
  };

  // Normalize offer type for safe comparison
  const offerType = company.offerType?.toLowerCase();
  const isIndependentOffer = offerType !== "offer through university (placement)";

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      scroll="paper"
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          width: { xs: "90%", md: "60%" },
          height: { md: "100%" },
        },
      }}
    >
      <Scrollbar sx={{ height: { xs: "300px", md: "900px" } }}>
        {/* Close Button */}
        <Box
          onClick={handleClose}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            float: "right",
            marginRight: "10px",
            padding: "2px",
            color: "black",
            backgroundColor: "lightgrey",
            borderRadius: "50%",
            m: 2,
          }}
        >
          <CloseIcon sx={{ width: "15px", height: "15px" }} />
        </Box>

        {/* Header */}
        <Box sx={{ ml: 4, mt: 0, maxWidth: 650 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            m={2}
          >
            <Typography variant="h6">Company Details</Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h6">Status:</Typography>
              <Chip
                label={company.status}
                color={getStatusColor(company.status)}
                size="small"
              />
            </Box>
          </Box>

          <Box display="flex" alignItems="center" mt={2}>
            <Avatar sx={{ bgcolor: "orange", mr: 2, width: 50, height: 50 }}>
              <BusinessIcon sx={{ width: 35, height: 35 }} />
            </Avatar>
            <Box>
              <Typography variant="subtitle1">
                <b>Company Name:</b> {company.companyName}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ width: "100%", mt: 1 }}>
         
          <DriveDetails
            data={{
              requestId: 46767,
              // driveId: 58393,
              offerSource: "",
              offerType: "",
              salary: 0,
              duration: "",
              actionRequired: "",
              joinDate: "",
              endDate: "",
            }}
            company={company}
          />
          {/* </TabPanel> */}


        </Box>
        <Box>
          <TimelineWrapper company={company} />
        </Box>
        <Box>
          <JobDescriptionDetails company={company} />
        </Box>
        <Box>
          <Uploaddata company={company} />
        </Box>
      </Scrollbar>
    </Dialog>
  );
};

export default ViewCompanyDetails;
