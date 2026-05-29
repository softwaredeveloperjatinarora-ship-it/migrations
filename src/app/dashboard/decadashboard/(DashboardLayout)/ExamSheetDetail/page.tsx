"use client";
import React, { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import Breadcrumb from "../layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import ExamSheetConsumption from "@/app/components/DECAViews/ExamSheetDetail/ExamSheetConsumption";
import ExamSheetSummary from "@/app/components/DECAViews/ExamSheetDetail/ExamSheetSummary";

const BCrumb = [
  {
    to: "/dashboard",
    title: "Home",
  },
  {
    title: "Exam Sheet Data",
  },
];

// Tab Panel Component
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
      id={`tab-panel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography component={"div"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const ExamSheetDetails = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <PageContainer title="Staff Attendance" description="This is Daily Activities">
      <Breadcrumb title="Exam Sheet Details" items={BCrumb} />

      {/* Tabs Section */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}>
        <Tabs value={tabValue} onChange={handleChange} aria-label="Exam Sheet Tabs">
          <Tab label="Exam Sheet Consumption" />
          <Tab label="Exam Sheet Summary" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <TabPanel value={tabValue} index={0}>
        <ExamSheetConsumption />.
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ExamSheetSummary />
      </TabPanel>
    </PageContainer>
  );
};

export default ExamSheetDetails;
