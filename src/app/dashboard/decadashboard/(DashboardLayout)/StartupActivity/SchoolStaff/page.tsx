"use client"
import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';

import { Card, CardContent, Grid } from "@mui/material";
import ChildCard from "@/app/components/shared/ChildCard";
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import PageContainer from '@/app/components/container/PageContainer';
import AppCard from '@/app/components/shared/AppCard';
import ParentCard from '@/app/components/shared/ParentCard';
import Breadcrumb from '../../layout/shared/breadcrumb/Breadcrumb';
import { useSelector } from 'react-redux';
import { asyncWrapProviders } from 'node:async_hooks';
import StartupActivityView from '@/app/components/DECAViews/StartupActivity/StartupActivityView';
import FVOnLeave from '@/app/components/DECAViews/StartupActivity/SchoolStaff/SchoolStaff';
import ContactList from '@/app/components/DECAViews/StartupActivity/SchoolStaff/SchoolContactList';

const drawerWidth = 240;
const secdrawerWidth = 320;

const BCrumb = [
  {
    to: '/dashboard/decadashboard',
    title: 'Home',
  },
  {
    title: 'Add Staff',
  },
];

const Contacts = () => {
  
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  
  // Reference to the contact list component to trigger reload
  const [contactListKey, setContactListKey] = useState(0);

  // Function to reload the contact list
  const reloadContactList = useCallback(() => {
    setContactListKey(prevKey => prevKey + 1);
  }, []);

  return (
    <PageContainer
      title="School Staff"
      description="this is School Staff information"
    >
      <Breadcrumb title="Add Staff" items={BCrumb} />
      <StartupActivityView />
      <Card sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 5 }}>
            <ChildCard title="Add School Staff">
              <FVOnLeave reloadContactList={reloadContactList} />
            </ChildCard>
          </Grid>
          <Grid size={{ xs: 12, sm: 7}}>
            <ChildCard title="Staff Directory">
              {/* <ContactSearch onClick={() => setLeftSidebarOpen(true)} />
              <Box sx={{ mt: 2 }}> */}
                <ContactList
                  key={contactListKey}
                  showrightSidebar={() => setRightSidebarOpen(true)}
                />
              {/* </Box> */}
            </ChildCard>
          </Grid>
        </Grid>
      </Card>
    </PageContainer>
  );
};

export default Contacts;