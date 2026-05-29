

'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { IconCalendarStats, IconReport, IconReportAnalytics } from "@tabler/icons-react";
import Breadcrumb from "@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import BlankCard from '@/app/components/shared/BlankCard';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import StudentGradeView from './StudentGradeView';
import StuMarksView from './StuMarksView';
import StuTGPAView from './StuTGPA&AvgView';
interface Props {
  bred: boolean;
}
// interface Props {
//   isVisible: boolean;
// }
const ResultTabs = ({ bred }: Props) => {
  // console.log("🔁 ResultTabs rendered");

  const [value, setValue] = React.useState('0'); // Default to first tab

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const ProfileTabs = [
    {
      label: "Statistical Analysis",
      icon: <IconCalendarStats size="25" />,
      component: () => <StuTGPAView />,
    },
    {
      label: "Marks",
      icon: <IconReport size="25" />,
      component: () => <StuMarksView />,
    },
    {
      label: "Grades",
      icon: <IconReportAnalytics size="25" />,
      component: () => <StudentGradeView />,
    },
  ];

  const BCrumb = [
    { to: "/dashboard", title: "Home" },
    { title: "Result Summary" },
  ];

  return (
    <>

      {/* <Breadcrumb title="Result Summary" items={BCrumb} /> */}
      {bred && (
        <Breadcrumb title="Result Summary" items={BCrumb} />
      )}
      <BlankCard>
        <Box mt={1}>
          <TabContext value={value}>
            <Box display="flex" justifyContent="left" sx={{ maxWidth: { xs: 320, sm: '100%' } }}>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                allowScrollButtonsMobile
                aria-label="Result Tabs"
              >
                {ProfileTabs.map((tab, index) => (
                  <Tab
                    key={tab.label}
                    icon={tab.icon}
                    iconPosition="start"
                    label={tab.label}
                    value={index.toString()}
                    sx={{ minHeight: '50px' }}
                  />
                ))}
              </Tabs>
            </Box>

            {ProfileTabs.map((tab, index) => (
              <TabPanel key={index} value={index.toString()}>
                {tab.component()}
              </TabPanel>
            ))}
          </TabContext>
        </Box>
      </BlankCard>
    </>
  );
};

export default ResultTabs;
