


"use client"
import CompanyDetails from "@/app/components/views/OJTDashboardView/CompanyDetails"
import OJTAttendanceView from "@/app/components/views/OJTDashboardView/OJTAttendanceView"
import OverallDetail from "@/app/components/views/OJTDashboardView/OverallDetail"
import OverallPerformance from "@/app/components/views/OJTDashboardView/OverallPerformance"
import { Card, Grid, Tooltip, Typography } from "@mui/material"
import Box from "@mui/material/Box"
import OJTWorkingHours from "@/app/components/views/OJTDashboardView/OJTWorkingHours"
import OJTLeaveRecord from "@/app/components/views/OJTDashboardView/OJTLeaveRecord"
import Link from "next/link"
import OJTGuidelines from "@/app/components/views/OJTDashboardView/OJTPopup/OJTGuidelines"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useState } from "react"
import Messages from "@/app/components/views/OJTDashboardView/OJTMessage"
import { Icon } from "@iconify/react";
import Breadcrumb from "@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb"
 


const BCrumb = [
    { to: "/dashboard", title: "Home" , icon: "ic:baseline-home"},
    { title: "OJTDashboard"},
];
const OJTMaindashboard = () => {

  const [isModalOpenInfo, setIsModalOpenInfo] = useState(false);
  const handleInfoClick = () => {
    setIsModalOpenInfo(true);
  };

  const closeModalInfo = () => {
    setIsModalOpenInfo(false);
  };


  return (

    <Box>
   <Breadcrumb title="OJTDashboard" items={BCrumb} titleIcon="ix:certificate"/>

   

      <Grid container spacing={3}>
        {/* first row  */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <OverallDetail isLoading={false}></OverallDetail>
        </Grid>
        {/* <Grid item xs={12} lg={5}> */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <OverallPerformance></OverallPerformance>
        </Grid>
        {/* <Grid item xs={12} lg={4}> */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <CompanyDetails isLoading={false}></CompanyDetails>
        </Grid>
        {/* <Grid item xs={12} lg={4}> */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <OJTLeaveRecord></OJTLeaveRecord>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <OJTWorkingHours></OJTWorkingHours>
        </Grid>
        <Grid size={{ xs: 12, lg: 12 }}>
          <OJTAttendanceView></OJTAttendanceView>
        </Grid>

      </Grid>


    </Box>

  )

}
export default OJTMaindashboard