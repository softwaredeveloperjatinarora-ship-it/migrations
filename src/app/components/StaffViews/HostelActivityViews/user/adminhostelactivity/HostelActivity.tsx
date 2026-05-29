
// "use client";
// import React, { useEffect, useState } from "react";
// import { Box, Tabs, Tab } from "@mui/material";
// import { IconBuildingCommunity } from "@tabler/icons-react";
// import ArticleIcon from "@mui/icons-material/Article";
// import Breadcrumb from "@/app/dashboard/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
// import ChildCard from "../../../../shared/ChildCard";
// import HostelActivityDetails from "./HostelActivityDetails";
// import Checkedstudent from "./Checkedstudent";

// import TaskAltSharpIcon from '@mui/icons-material/TaskAltSharp';
// import CompletedStatus from "./completedstatus";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { gethRoleAction } from "@/app/actions/hostalActivityAction/getRoleAction";
// import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";


// const BCrumb = [
//   { to: "/dashboard", title: "Home" , icon: "ic:baseline-home" },
//   { title: "Hostel Activity" }
// ];

// const HostelActivity = () => {
//   const [activeTab, setActiveTab] = useState("0");
// const [roleChecked, setRoleChecked] = useState(false);
//   const { data: session } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     async function checkRole() {
//       try {
//         const token = String(session?.user?.token).split("NEXT2121ANG")[1];
//         const response = await gethRoleAction();
//         const decrypted = decryptDataforResponse(response.ApiData, token);
//         const parsed = JSON.parse(decrypted);
//         const userRole: "admin" | "warden" | "dsr" | null = parsed[0]?.type ?? null;

//         if (userRole !== "admin") {
//           if (userRole === "warden") router.replace("/dashboard/hostelactivity/warden");
//           else if (userRole === "dsr") router.replace("/dashboard/hostelactivity/dsr");
//           else router.replace("/unauthorized");
//         } else {
//           setRoleChecked(true);
//         }
//       } catch (err) {
//         console.error("Role check failed:", err);
//         router.replace("/error");
//       }
//     }

//     if (session?.user?.token) {
//       checkRole();
//     }
//   }, [session, router]);

//   if (!roleChecked) return null; // block UI until role is verified

//   return (
//     <>
//       <Breadcrumb 
//         title="Hostel Management" 
//         items={BCrumb} 
//         titleIcon="material-symbols:hotel" 
//       />
      
//       <ChildCard>
//         <Tabs
//           value={activeTab}
//           onChange={(_, newValue) => setActiveTab(newValue)}
         
//            aria-label="scrollable tabs example"
//             variant="scrollable"
//             scrollButtons="auto"
//             allowScrollButtonsMobile
//         >
//           <Tab icon={<IconBuildingCommunity size={20} />} label="Pending Students" value="0" />
//           <Tab icon={<ArticleIcon />} label="Allocated Students" value="1" />
//           <Tab icon={<TaskAltSharpIcon />} label="Completed Students" value="2" />
//         </Tabs>

//         <Box hidden={activeTab !== "0"}>
//           <HostelActivityDetails 
        
//           />
//         </Box>

//         <Box hidden={activeTab !== "1"}>
//           <Checkedstudent 
     
//           />
//         </Box>
//         <Box hidden={activeTab !== "2"}>
//           <CompletedStatus />
//         </Box>
//       </ChildCard>
//     </>
//   );
// };

// export default HostelActivity;


"use client";
import React, { useEffect, useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { IconBuildingCommunity } from "@tabler/icons-react";
import ArticleIcon from "@mui/icons-material/Article";
import TaskAltSharpIcon from "@mui/icons-material/TaskAltSharp";

import ChildCard from "../../../../shared/ChildCard";
import HostelActivityDetails from "./HostelActivityDetails";
import Checkedstudent from "./Checkedstudent";
import CompletedStatus from "./completedstatus";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import { gethRoleAction } from "@/app/actions/StaffActions/hostalActivityAction/getRoleAction";
import Breadcrumb from "@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";

const BCrumb = [
  { to: "/dashboard", title: "Home", icon: "ic:baseline-home" },
  { title: "Hostel Activity" },
];

interface TabPanelProps {
  children: React.ReactNode;
  value: string;
  index: string;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <Box role="tabpanel" hidden={value !== index}>
    {value === index && <Box p={2}>{children}</Box>}
  </Box>
);

const HostelActivity = () => {
  const [activeTab, setActiveTab] = useState("0");
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

        if (userRole !== "admin") {
          if (userRole === "warden") router.replace("/dashboard/staff/hostelactivity/warden");
          else if (userRole === "dsr") router.replace("/dashboard/staff/hostelactivity/dsr");
          else router.replace("/unauthorized");
        } else {
          setRoleChecked(true);
        }
      } catch (err) {
        console.error("Role check failed:", err);
        router.replace("/error");
      }
    }

    if (session?.user?.token) checkRole();
  }, [session, router]);

  if (!roleChecked) return null; // block UI until role is verified

  return (
    <>
      <Breadcrumb title="Hostel Management" items={BCrumb} titleIcon="material-symbols:hotel" />

      <ChildCard>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          aria-label="scrollable tabs example"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab icon={<IconBuildingCommunity size={20} />} label="Pending Students" value="0" />
          <Tab icon={<ArticleIcon />} label="Allocated Students" value="1" />
          <Tab icon={<TaskAltSharpIcon />} label="Completed Students" value="2" />
        </Tabs>

        <TabPanel value={activeTab} index="0">
          <HostelActivityDetails />
        </TabPanel>

        <TabPanel value={activeTab} index="1">
          <Checkedstudent />
        </TabPanel>

        <TabPanel value={activeTab} index="2">
          <CompletedStatus />
        </TabPanel>
      </ChildCard>
    </>
  );
};

export default HostelActivity;
