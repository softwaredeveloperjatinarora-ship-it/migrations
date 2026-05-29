import React from "react";
import {
  Box,
  Grid,
  Typography,
} from "@mui/material";

import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import RunningWithErrorsOutlinedIcon from "@mui/icons-material/RunningWithErrorsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";



// Icon Wrapper Styles
const iconStyle = {
  p: 1,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 20,
  height: 20,
};

const ojtdetailsData = {
  "Request ID": 39595,
  VID: 12219998,
  "Applied On": "21 Jan 2025",
  "Offer Source": "Independent Offer",
  "Offer Type": "Internship",
  Company: "LPU Infotech",
  DOJ: "21 Jan 2025",
  "Start Date": "21 Jan 2025",
  "End Date": "21 Jun 2025",
  Status: "Approved",
  Mentor: {
    id: 32918,
    Name: "Sukhbeer Kaur",
    phoneNumber: 7717655525,
  },
};

interface DriveDetailsProps {
  data: {
    requestId: number;
    // driveId: number;
    offerSource: string;
    offerType: string;
    salary: number;
    duration: string;
    actionRequired: string;
    joinDate: string;
    endDate: string;
  };
  company: any;
}

const DriveDetails: React.FC<DriveDetailsProps> = ({ data,company }) => {
  return (
    <Box display="flex" flexDirection="column" gap={1} justifyContent="center">

      {/* First Row */}
      <Grid container spacing={1} mt={2}>
        <Grid  size={{ xs: 6, sm: 6, md: 3 }}  >
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box sx={iconStyle}>
                <AssignmentOutlinedIcon sx={{ color: "#0074BA", width: 26, mt: 2 }} />
              </Box>
              <Typography variant="body1" fontWeight="bold">
                Request ID
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ pl: 4 }}>
              {ojtdetailsData["Request ID"]}
            </Typography>
          </Box>
        </Grid>

        <Grid  size={{ xs: 6, sm: 6, md: 3 }}>
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box sx={iconStyle}>
                <AssignmentOutlinedIcon sx={{ color: "#0074BA", width: 26, mt: 2 }} />
              </Box>
              <Typography variant="body1" fontWeight="bold">
                Drive ID
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ pl: 4 }}>
              {company.offerType.toLowerCase() === "independent offer"
        ? "N/A"
        : company.driveId}
            </Typography>
          </Box>
        </Grid>
     

        <Grid  size={{ xs: 6, sm: 6, md: 3 }}>
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box sx={iconStyle}>
                <AssignmentOutlinedIcon sx={{ color: "#0074BA", width: 26, mt: 2 }} />
              </Box>
              <Typography variant="body1" fontWeight="bold">
                Offer Source
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ pl: 4 }}>
              {company.offerType}
            </Typography>
          </Box>
        </Grid>

        <Grid  size={{ xs: 6, sm: 6, md: 3 }}>
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box sx={iconStyle}>
                <TextSnippetOutlinedIcon sx={{ color: "#0074BA", width: 26, mt: 2 }} />
              </Box>
              <Typography variant="body1" fontWeight="bold">
                Offer Type
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ pl: 4 }}>
              Internship
            </Typography>
          </Box>
        </Grid>

      </Grid>

      {/* Second Row */}
      <Grid container spacing={1}>
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box sx={iconStyle}>
                <RunningWithErrorsOutlinedIcon sx={{ color: "#0074BA", width: 26, mt: 2 }} />
              </Box>
              <Typography variant="body1" fontWeight="bold">
                Duration
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ pl: 4 }}>
              6 Months
            </Typography>
          </Box>
        </Grid>

        <Grid  size={{ xs: 6, sm: 6, md: 3 }}>
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box sx={iconStyle}>
                <AssignmentOutlinedIcon sx={{ color: "#0074BA", width: 26, mt: 2 }} />
              </Box>
              <Typography variant="body1" fontWeight="bold">
                Start Date
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ pl: 4 }}>
              {company.joinDate}
            </Typography>
          </Box>
        </Grid>

        <Grid  size={{ xs: 6, sm: 6, md: 3 }}>
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box sx={iconStyle}>
                <AssignmentOutlinedIcon sx={{ color: "#0074BA", width: 26, mt: 2 }} />
              </Box>
              <Typography variant="body1" fontWeight="bold">
                End Date
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ pl: 4 }}>
              {company.endDate}
            </Typography>
          </Box>
        </Grid>
        
        <Grid  size={{ xs: 6, sm: 6, md: 3 }}>
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box sx={iconStyle}>
                <ReceiptOutlinedIcon sx={{ color: "#0074BA", width: 26, mt: 2 }} />
              </Box>
              <Typography variant="body1" fontWeight="bold">
                Action Required
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ pl: 4 }}>
              N/A
            </Typography>
          </Box>
        </Grid>
      </Grid>
      

    </Box>
  );
};

export default DriveDetails;
