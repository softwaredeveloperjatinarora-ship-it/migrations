    "use client"
import { useState } from 'react';
import { Card, CardContent, Grid } from "@mui/material";
import ChildCard from "@/app/components/shared/ChildCard";
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '../../layout/shared/breadcrumb/Breadcrumb';
import CenterRooms from '@/app/components/DECAViews/StartupActivity/RoomMaster/RoommasterInformation';
import StartupActivityView from '@/app/components/DECAViews/StartupActivity/StartupActivityView';
import RoomMaster from '@/app/components/DECAViews/StartupActivity/RoomMaster/RoomMaster';

const drawerWidth = 240;
const secdrawerWidth = 320;

const BCrumb = [
  {
    to: '/dashboard/decadashboard',
    title: 'Home',
  },
  {
    title: 'Add Rooms',
  },
];

const Roommastermain = () => {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  return (
    (<PageContainer
      title="Room Master"
      description="this is Room Master infomation"
    >
      <Breadcrumb title="Add Rooms" items={BCrumb} />
      <StartupActivityView />
      <Card sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <ChildCard title="Room Master"  >
              <RoomMaster />
            </ChildCard>
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <CenterRooms />
          </Grid>

        </Grid>
      </Card>
    </PageContainer>)
  );
};

export default Roommastermain;
