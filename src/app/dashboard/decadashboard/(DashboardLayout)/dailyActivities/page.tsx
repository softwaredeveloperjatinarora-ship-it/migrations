"use client";
import Breadcrumb from '../layout/shared/breadcrumb/Breadcrumb';
import DailyStepsView from "../../../../components/DECAViews/DailySteps/DailyActivity"
import { CardContent, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import PageContainer from '@/app/components/container/PageContainer';

const BCrumb = [
    {
       to: '/dashboard',
      title: 'Home',
    }, 
    {
      title: 'Daily Activities',
    },
];

const Packetconsuiming = () => {
    const [selectedType, setSelectedType] = useState<string>("Theory Sheets");

    return (
      <PageContainer
        title="Daily Activities"
        description="This is Daily Activities"
      >
        <Breadcrumb title="Daily Activities" items={BCrumb} />
        {/* <Grid container spacing={3}>
          <Grid size={{xs:12}} > */}
            {/* <BlankCard>
              <CardContent > */}
                {/* <Typography variant="h5" mb={2}>Date and Session Selection</Typography> */}
                <DailyStepsView />
              {/* </CardContent>
            </BlankCard> */}
          {/* </Grid>          
        </Grid> */}
      </PageContainer>
    );
};

export default Packetconsuiming;
