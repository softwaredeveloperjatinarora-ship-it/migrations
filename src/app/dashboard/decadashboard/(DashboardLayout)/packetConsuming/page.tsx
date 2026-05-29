"use client";
import Breadcrumb from '../layout/shared/breadcrumb/Breadcrumb';
import { CardContent } from '@mui/material';
import React, { useState } from 'react';
import PacketconsuimingView from '../../../../components/DECAViews/Packet Consuming/PacketConsuuming'
import PageContainer from '@/app/components/container/PageContainer';
import BlankCard from '@/app/components/shared/BlankCard';


const BCrumb = [
  {
    to: '/dashboard',
    title: 'Home',
  },
  {
    title: 'Sheet Consumption',
  },
];

const Packetconsuiming = () => {
  const [selectedType, setSelectedType] = useState<string>("Theory Sheets");

  return (
    <PageContainer
      title="Sheet Consumption"
      description="This is Sheet Consumption"
    >
      <Breadcrumb title="Sheet Consumption" items={BCrumb} />
      <BlankCard sx={{ p: 0 }}>
        <CardContent sx={{ p: 1 }}>
          <PacketconsuimingView />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};

export default Packetconsuiming;