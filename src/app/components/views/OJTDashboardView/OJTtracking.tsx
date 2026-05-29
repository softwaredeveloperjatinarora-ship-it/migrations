import React from "react";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { styled } from "@mui/system";

// Timeline event data
const approvedEvents = [
  { title: "Applied On", date: "2021-07-10" },
  { title: "Company Verification", date: "2021-07-11" },
  { title: "Academic verification", date: "2021-07-11" },
  { title: "Approved", date: "" },
];

const disapprovedEvents = [
  { title: "Approved On", date: "2021-07-15" },
  { title: "Cancelled On", date: "2021-07-10" },
  { title: "Eligibility Verification", date: "2021-07-11" },
  { title: "Final Verification", date: "2021-07-11" },
];

// Custom step icon component
const CustomStepIcon = ({ icon, active, completed, status }: any) => {
  const approvedIcons = [
    "clarity:form-line",
    "fluent:building-20-regular",
    "mdi:academic-cap-outline",
    "typcn:tick-outline",
  ];

  const cancelledIcons = [
    "clarity:form-line",
    "material-symbols:cancel-outline-rounded",
    "line-md:account-delete",
   "fluent-mdl2:completed"
   
  ];

  const isCancelled = status.toLowerCase() !== "approved";
  const iconList = isCancelled ? cancelledIcons : approvedIcons;
  const iconName = iconList[Number(icon) - 1] || "mdi:checkbox-blank-circle-outline";

  return (
    <Icon
      icon={iconName}
      width={30}
      height={30}
      style={{
        color: completed ? "#1976d2" : "#9e9e9e", 
        transform: active ? "scale(1.2)" : "scale(1)",
        transition: "transform 0.3s ease",
      }}
    />
  );
};

// Custom connector between steps
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`& .${stepConnectorClasses.line}`]: {
    borderTopWidth: 2,
    borderColor: "#9e9e9e",
  },
  [`&.Mui-completed .${stepConnectorClasses.line}`]: {
    borderColor: "#1976d2",
  },
}));

// Props interface
interface TimelineWrapperProps {
  company: {
    status: string;
  };
}

// Main component
const TimelineWrapper: React.FC<TimelineWrapperProps> = ({ company }) => {
  const isApproved = company.status.toLowerCase() === "approved";
  const events = isApproved ? approvedEvents : disapprovedEvents;

  const completedStepCount = events.filter((e) => e.date).length;

  return (
    <Box mt={3}>
      <Typography sx={{ fontSize: "16px", mb: 1, ml: 4 }} fontWeight="bold">
        {isApproved ? "Approval" : "Cancelled"} 
      </Typography>

      <Stepper
        alternativeLabel
        activeStep={completedStepCount}
        connector={<CustomConnector />}
        sx={{ "& .MuiStepLabel-label": { mt: 1, fontWeight: 500 } }}
      >
        {events.map((label, index) => (
          <Step key={index} completed={Boolean(label.date)}>
            <StepLabel
              StepIconComponent={(props) => (
                <CustomStepIcon {...props} status={company.status} />
              )}
            >
              <Box
                sx={{
                  color: label.date ? "inherit" : "gray",
                  fontStyle: label.date ? "normal" : "italic",
                }}
              >
                {label.date || "Pending"}
              </Box>
              <Box>{label.title}</Box>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default TimelineWrapper;
