"use client";
import React from 'react';
import {
  Box,
  CardContent,
  Typography
} from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useRouter } from 'next/navigation';
import BlankCard from '../../shared/BlankCard';
import { IconPackage, IconDoor, IconUsers } from "@tabler/icons-react";

const StartupActivityView = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState('kit-receiving');

  const NAVIGATION_TABS = [
    { 
      value: 'kit-receiving', 
      icon: <IconPackage width={20} height={20} />, 
      label: 'Kit Receiving', 
      path: '/dashboard/decadashboard/StartupActivity/KitReceiving',
      pathMatch: 'KitReceiving',
      disabled: false 
    },
    { 
      value: 'add-rooms', 
      icon: <IconDoor width={20} height={20} />, 
      label: 'Add Rooms', 
      path: '/dashboard/decadashboard/StartupActivity/RoomMaster', 
      pathMatch: 'RoomMaster',
      disabled: false 
    },
    { 
      value: 'add-staff', 
      icon: <IconUsers width={20} height={20} />, 
      label: 'Add Staff', 
      path: '/dashboard/decadashboard/StartupActivity/SchoolStaff',
      pathMatch: 'SchoolStaff',
      disabled: false 
    }
  ];

  const handleTabChange = (event: any, newValue: string) => {
    setActiveTab(newValue);
    const selectedTab = NAVIGATION_TABS.find(tab => tab.value === newValue);
    if (selectedTab) {
      router.push(selectedTab.path);
    }
  };

  // Get current path to set active tab
  React.useEffect(() => {
    const currentPath = window.location.pathname;
    
    // Find the tab whose pathMatch value is contained in the current path
    const currentTab = NAVIGATION_TABS.find(tab => 
      currentPath.includes(tab.pathMatch)
    );
    
    if (currentTab) {
      setActiveTab(currentTab.value);
    }
  }, []);

  return (
    <Box>
      <BlankCard>
        <CardContent sx={{ paddingTop: 0 }}>
          <Box sx={{ width: '100%'}}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              aria-label="startup activity tabs"
              variant="fullWidth"
            >
              {NAVIGATION_TABS.map((tab) => (
                <Tab 
                  key={tab.value} 
                  icon={tab.icon} 
                  label={tab.label} 
                  value={tab.value} 
                  disabled={tab.disabled} 
                />
              ))}
            </Tabs>
          </Box>
        </CardContent>
      </BlankCard>
    </Box>
  );
};

export default StartupActivityView;