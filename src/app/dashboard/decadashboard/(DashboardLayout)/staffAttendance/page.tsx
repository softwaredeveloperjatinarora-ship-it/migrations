"use client";
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '../layout/shared/breadcrumb/Breadcrumb';
import { CardContent, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import StaffAttendance from '@/app/components/DECAViews/Staff Attendance/staffAttendance';

const BCrumb = [
  {
    to: '/dashboard',
    title: 'Home',
  },
  {
    title: 'Staff Attendance',
  },
];


const Packetconsuiming = () => {
  const [selectedType, setSelectedType] = useState<string>("Theory Sheets");

  return (
    <PageContainer
      title="Staff Attendance"
      description="This is Daily Activities"
    >
      <Breadcrumb title="Staff Attendance " items={BCrumb} />
      <StaffAttendance />
    </PageContainer>
  );
};

export default Packetconsuiming;