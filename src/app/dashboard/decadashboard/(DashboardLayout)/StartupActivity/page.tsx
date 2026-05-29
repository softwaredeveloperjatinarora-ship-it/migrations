"use client";
import Breadcrumb from '../layout/shared/breadcrumb/Breadcrumb';
import DailyStepsView from "../../../../components/DECAViews/DailySteps/DailyActivity"
import { CardContent, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import PageContainer from '@/app/components/container/PageContainer';

const BCrumb = [
    {
    to: '/dashboard/decadashboard',
      title: 'Home',
    },
    {
      title: 'Startup Activity',
    },
];

const StartupActivity = () => {
    const [selectedType, setSelectedType] = useState<string>("Theory Sheets");

    return (
      <PageContainer
        title="Startup Activity"
        description="This is Startup Activity"
      >
        <Breadcrumb title="Startup Activity" items={BCrumb} />
            <DailyStepsView />             
      </PageContainer>
    );
};

export default StartupActivity;
