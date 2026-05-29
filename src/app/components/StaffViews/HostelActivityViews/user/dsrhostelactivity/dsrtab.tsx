


"use client";
import React, { useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { IconBuildingCommunity } from "@tabler/icons-react";
import ArticleIcon from "@mui/icons-material/Article";

import DSRFollowUp from "./dsr";
import ChildCard from "@/app/components/shared/ChildCard";
import Filledstudent from "./filledstudent";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { gethRoleAction } from "@/app/actions/StaffActions/hostalActivityAction/getRoleAction";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import Breadcrumb from "@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
// Removed incorrect import for DSRForm as it is defined locally.
const BCrumb = [
  { to: "/dashboard", title: "Home", icon: "ic:baseline-home" },
  { title: "Dsr Hostel Activity" },
];

interface TabPanelProps {
  children: React.ReactNode;
  value: string;
  index: string;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  return (
    <Box role="tabpanel" hidden={value !== index}>
      {value === index && <Box p={2}>{children}</Box>}
    </Box>
  );
};



const Dsrtab = () => {
  const [value, setValue] = useState("0");
 

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [roleChecked, setRoleChecked] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
  
    useEffect(() => {
      async function checkRole() {
        try {
          const token = String(session?.user?.token).split("NEXT2121ANG")[1];
          const response = await gethRoleAction();
          const decrypted = decryptDataforResponse(response.ApiData, token);
          const parsed = JSON.parse(decrypted);
          const userRole: "admin" | "warden" | "dsr" | null = parsed[0]?.type ?? null;
  
          if (userRole !== "dsr") {
            if (userRole === "admin") router.replace("/dashboard/staff/hostelactivity/admin");
            else if (userRole === "warden") router.replace("/dashboard/staff/hostelactivity/warden");
            else router.replace("/unauthorized");
          } else {
            setRoleChecked(true);
          }
        } catch (err) {
          console.error("Role check failed:", err);
          router.replace("/error");
        }
      }
  
      if (session?.user?.token) {
        checkRole();
      }
    }, [session, router]);
  
    if (!roleChecked) return null; // block UI until role is verified

  

  return (
    <>
      <Breadcrumb
        title="DSR Hostel Activity"
        items={BCrumb}
        titleIcon="material-symbols:hotel"
      />
      <ChildCard>
        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.grey[100],
            display: "flex",
            justifyContent: "flex-start",
            borderRadius: 1,
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="primary"
            indicatorColor="primary"
            aria-label="scrollable tabs example"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab
              icon={<IconBuildingCommunity size={20} />}
              label="Pending Students"
              value="0"
            />
            <Tab
              icon={<ArticleIcon />}
              label="Session Completed"
              value="1"
            />
          </Tabs>
        </Box>

        <TabPanel value={value} index="0">
          <DSRFollowUp
           
            
          />
        </TabPanel>

        <TabPanel value={value} index="1">
          <Filledstudent  />
        </TabPanel>
      </ChildCard>
    </>
  );
};

export default Dsrtab;