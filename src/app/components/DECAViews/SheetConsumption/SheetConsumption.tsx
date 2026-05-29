'use client';

import React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  Stack,
  Paper,
  LinearProgress,
  linearProgressClasses,
} from '@mui/material';

// Raw data
const trafficData = [
  { name: 'Theory Sheets', used: 3023, total: 6000, color: '#64b5f6' },
  { name: 'Library Sheets', used: 3200, total: 6000, color: '#f48fb1' },
  { name: 'Practical Sheets', used: 2900, total: 6000, color: '#ffcc80' },
];


const useProcessedTrafficData = () => {
  const theme = useTheme();

  return trafficData.map((item) => {
    const lowerName = item.name.toLowerCase();

    let newColor = item.color;
    if (lowerName.includes('theory')) {
      newColor = theme.palette.primary.main;
    } else if (lowerName.includes('library')) {
      newColor = theme.palette.secondary.main;
    } else if (lowerName.includes('practical')) {
      newColor = theme.palette.warning.main;
    }

    return {
      ...item,
      color: newColor,
    };
  });
};
  

interface StyledLinearProgressProps {
  barColor: string;
}

const StyledLinearProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== 'barColor',
})<StyledLinearProgressProps>(({ barColor }) => ({
  height: 10,
  borderRadius: 8,
  backgroundColor: '#f5f5f5',
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 8,
    backgroundColor: barColor,
  },
}));


const SheetConsumption = () => {
  const processedData = useProcessedTrafficData();

  return (
   <Paper
  elevation={0}
  sx={{
    p: 1,
    borderRadius: 1,
    backgroundColor: 'transparent', 
    boxShadow: 'none',
    width: '100%',
  }}
>
  <Stack spacing={1} mt={0}>
    {processedData.map((entry, index) => {
      const percentage = (entry.used / entry.total) * 100;

      return (
        <Box key={index} sx={{ width: '100%' }}>
          <Typography variant="subtitle1" fontWeight={500}>
            {entry.name}
          </Typography>

          <StyledLinearProgress
            variant="determinate"
            value={percentage}
            barColor={entry.color}
            sx={{ mt: 1, width: '100%' }} 
          />

          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mt: '5px', textAlign: 'right' }} 
          >
            {entry.used.toLocaleString()} / {entry.total.toLocaleString()}
          </Typography>
        </Box>
      );
    })}
  </Stack>
</Paper>

  );
};

export default SheetConsumption;
  