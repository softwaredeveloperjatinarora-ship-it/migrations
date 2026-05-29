"use client";
import React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import {
  IconCalendarStats,
  IconReport,
  IconReportAnalytics,
} from "@tabler/icons-react";
import BlankCard from "@/app/components/shared/BlankCard";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import {
  IconChartBar,
  IconFilePlus,
  IconExchange,
  IconMessageReport,
} from "@tabler/icons-react";
import { CardContent, Grid } from "@mui/material";
import CertificateSummary from "./CertificateSummary";
import CertificateList from "./CertificateList";
import OtherRequest from "./OtherRequest";

const CertificateTabs = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const CertificateTabs = [
    {
      label: "Application Summary",
      icon: <IconChartBar size={25} />,
      component: () => <CertificateSummary />,
    },
    {
      label: "Apply Certificate",
      icon: <IconFilePlus size={25} />,
      component: () => <CertificateList/>,
    },
    {
      label: "Change Collection Mode",
      icon: <IconExchange size={25} />,
      component: () => "",
    },
    {
      label: "Other Request",
      icon: <IconMessageReport size={25} />,
      component: () => <OtherRequest/>,
    },
  ];

  return (
    <>
      <Box>
        <TabContext value={value}>
          <Grid container spacing={0.3}>
            {/* Tabs Section */}
            <Grid size={{ xs: 12 }}>
              <BlankCard>
                <Box px={1} py={1}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    allowScrollButtonsMobile
                    aria-label="scrollable profile tabs"
                    sx={{ bgcolor: "transparent" }}
                  >
                    {CertificateTabs.map((tab, index) => (
                      <Tab
                        key={tab.label}
                        icon={tab.icon}
                        iconPosition="start"
                        label={tab.label}
                        value={index.toString()}
                        sx={{ minHeight: "48px", textTransform: "none" }}
                      />
                    ))}
                  </Tabs>
                </Box>
              </BlankCard>
            </Grid>

            {/* Tab Content Section */}
            <Grid size={{ xs: 12 }}>
              <Box  py={2}>
                {CertificateTabs.map((tab, index) => (
                  <TabPanel key={index} value={index.toString()} sx={{ p: 0 }}>
                    {tab.component()}
                  </TabPanel>
                ))}
              </Box>
            </Grid>
          </Grid>
        </TabContext>
      </Box>
    </>
  );
};

export default CertificateTabs;
