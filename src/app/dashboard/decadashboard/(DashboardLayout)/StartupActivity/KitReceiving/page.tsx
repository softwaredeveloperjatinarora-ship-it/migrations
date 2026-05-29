"use client";
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '../../layout/shared/breadcrumb/Breadcrumb';
import { CardContent } from '@mui/material';
import React, { useState } from 'react';
import StartupActivityView from '@/app/components/DECAViews/StartupActivity/StartupActivityView';
import BlankCard from '@/app/components/shared/BlankCard';
import PacketAcceptanceView from '@/app/components/DECAViews/StartupActivity/packetAcceptanceConsole/PacketAcceptanceView';
import PktData from '@/app/components/DECAViews/StartupActivity/packetAcceptanceConsole/PktData';

const BCrumb = [
  {
    to: '/dashboard/decadashboard',
    title: 'Home',
  },
  {
    title: 'Kit Receiving',
  },
];

const PacketAcceptanceConsole = () => {
  const [selectedType, setSelectedType] = useState<string>("Theory Sheets");
  const [packetStatus, setPacketStatus] = useState<boolean>(false);

  const handleViewDetails = (type: string | null): void => {
    setSelectedType(type || "Theory Sheets");
  };

  // Function to receive packet status from PacketAcceptanceView
  const handlePacketStatusChange = (status: boolean) => {
    setPacketStatus(status);
  };

  return (
    <PageContainer
      title="Packet Manager"
      description="This is kit receiving"
    >
      <Breadcrumb title="Kit Receiving" items={BCrumb} />
      <StartupActivityView />
      <BlankCard sx={{ mt: 2 }}>
        <CardContent>
          <PacketAcceptanceView onPacketStatusChange={handlePacketStatusChange} />
        </CardContent>
      </BlankCard>
      <PktData selectedType={selectedType} packetStatus={packetStatus} />
    </PageContainer>
  );
};

export default PacketAcceptanceConsole;