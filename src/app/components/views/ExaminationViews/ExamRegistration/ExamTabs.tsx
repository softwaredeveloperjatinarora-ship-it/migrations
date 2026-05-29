'use client'
import React from 'react'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { IconCheckupList,IconClipboardText,IconReport, IconReportAnalytics } from "@tabler/icons-react";
import Link from "next/link";
 
import BlankCard from '@/app/components/shared/BlankCard';
import { usePathname } from 'next/navigation';
import Breadcrumb from '@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
const ExamTabs = () => {
    const location =usePathname();;
    const [value, setValue] = React.useState(location);
    const handleChange = (event: React.SyntheticEvent, newValue: any) => {
      setValue(newValue);
    };
    const ProfileTabs = [
      {
        label: "Re-Evaluation",
        icon: <IconCheckupList size="25" />,
        to: "/dashboard/examination/examregisteration/re-evaluationregisteration",
      },
      {
        label: "Re-Appear",
        icon: <IconReportAnalytics size="25" />,
        to: "/dashboard/examination/examregisteration/re-appearregistertion",
      },
      {
        label: "Scrutiny",
        icon: <IconReport size="25" />,
        to: "/dashboard/examination/examregisteration/",
      },
      {
        label: "R-Grade",
        icon: <IconClipboardText size="25" />,
        to: "/dashboard/examination/examregisteration/",
      }
    ];
    const BCrumb = [
        {
          to: "/dashboard",
          title: "Home",
        },
        {
          title: "Exam Registartion",
        },
      ];
    
  
  return (
    <>
    <Breadcrumb title="Exam Registartion" items={BCrumb} />
    <BlankCard>
    <Box
      mt={1}
      sx={{ mt: 1 }}
    >
      <Box
        justifyContent={"left"}
        display="flex"
        sx={{ maxWidth: { xs: 320, sm: "100%" } }}
      >
         <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          allowScrollButtonsMobile
        > 
          {ProfileTabs.map((tab) => {
            return (  
                 <Tab
                  iconPosition="start"
                  label={tab.label}
                  sx={{ minHeight: "50px" }}
                  icon={tab.icon}
                  component={Link}
                  href={tab.to}
                  value={tab.to}
                  key={tab.label}
                /> 
            );
          })}
         </Tabs> 
      </Box>
    </Box>
    </BlankCard>
 
    </>
  
  )
}

export default ExamTabs
