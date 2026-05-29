"use client"
import { useState } from 'react';
import { Card, CardContent, Grid } from "@mui/material";
import ChildCard from "@/app/components/shared/ChildCard";
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import PageContainer from '@/app/components/container/PageContainer';
import DailyMarkAttendance from '@/app/components/DECAViews/StartupActivity/DailyAttendance/DailyAttendance';
import DailyAttendanceInfomation from '@/app/components/DECAViews/StartupActivity/DailyAttendance/DailyAttendanceInformation';
const drawerWidth = 240;
const secdrawerWidth = 320;

const DailyMarkAttendanceMain = () => {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  return (
    (<PageContainer
      title="Daily Attendance"
      description="this is Daily Attendance infomation"
    >
      {/* <Breadcrumb title="School Staff" items={BCrumb} /> */}
      <Card>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm:4 }}>
          <ChildCard title="Daily Attendance" >
           <DailyMarkAttendance/>
          </ChildCard>
        </Grid>
        <Grid size={{ xs: 12, sm:8 }}>
      <DailyAttendanceInfomation/>
        </Grid>
        
      </Grid>
      </Card>
    </PageContainer>)
  );
};

export default DailyMarkAttendanceMain;
