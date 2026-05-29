"use client";
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '../layout/shared/breadcrumb/Breadcrumb';
import { CardContent, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import DownloadSeatingplan from '@/app/components/DECAViews/Seating plan/DownloadSeatingplan';

const BCrumb = [
    {
       to: '/dashboard',
      title: 'Home',
    }, 
    {
      title: 'Seating Plan',
    },
];

const Packetconsuiming = () => {
    const [selectedType, setSelectedType] = useState<string>("Theory Sheets");

    return (
      <PageContainer
        title="Download Seating Plan"
        description="download seating plan"
      >
        <Breadcrumb title="Download seating plan" items={BCrumb} />
        {/* <Grid container spacing={3}>
          <Grid size={{xs:12}} > */}
            {/* <BlankCard>
              <CardContent > */}
                {/* <Typography variant="h5" mb={2}>Date and Session Selection</Typography> */}
          <DownloadSeatingplan />
              {/* </CardContent>
            </BlankCard> */}
          {/* </Grid>          
        </Grid> */}
      </PageContainer>
    );
};

export default Packetconsuiming;
