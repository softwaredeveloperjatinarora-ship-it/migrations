"use client"

import { Box, Slider, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react'
import { BarChart } from '@mui/x-charts/BarChart';

import { allArray, attendenceDetail } from './attendencemain';
import convertAttendenceData from './attendenceUtils';
import { Gauge, gaugeClasses } from '@mui/x-charts';

function BarChartAndGauge({ attendenceDetail }: { attendenceDetail: attendenceDetail[] }) {
    const theme = useTheme()

    const [{ percentageArray, colorArray, courseCodeArr, totalPresent, }, setAllArray] = React.useState<allArray>(convertAttendenceData(attendenceDetail));
    const isXs = useMediaQuery("(max-width:600px)")
    React.useEffect(() => {
        setAllArray(convertAttendenceData(attendenceDetail ? attendenceDetail : []))
    }, [attendenceDetail])
 let mainColor;
  if (totalPresent > 80) {
    mainColor = theme.palette.success.main; // Green
  } else if (totalPresent >= 50) {
    mainColor =  theme.palette.warning.main; // Blue
  } else {
    mainColor = "#FF4D4D"; // Red
  }
    return (
        <Box sx={{ p: 1, borderRadius: 2, borderBottomRightRadius: 0, borderBottomLeftRadius: 0, bgcolor: theme.palette.mode === "dark" ? theme.palette.background.paper : 'AppWorkspace', display: 'grid', gridTemplateColumns: { sm: '70% 30%' }, alignItems: 'center', width: '100%' }}>

            <BarChart
                height={isXs ? 400 : 300}
                key={isXs ? 'horizontal' : 'vertical'}
                layout={isXs ? 'horizontal' : 'vertical'}

                xAxis={isXs
                    ? [{ data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] }]
                    : [{
                        scaleType: 'band',
                        data: courseCodeArr,
                        colorMap: { type: 'ordinal', colors: colorArray },
                        valueFormatter: (code) => code,
                    }]
                }
                yAxis={isXs
                    ? [{
                        scaleType: 'band',
                        data: courseCodeArr,
                        colorMap: { type: 'ordinal', colors: colorArray },
                        valueFormatter: (code) => code,
                    }]
                    : [{ data: [0, 25, 50, 75, 100] }]
                }
                series={[{
                    data: percentageArray.map((a) => (a === 0 ? 100 : a)),
                    stack: 'total',
                    valueFormatter: (val, { dataIndex }) => `${percentageArray[dataIndex]} %`,
                }]}
                barLabel={({ value, dataIndex }) =>
                    value === 100 && percentageArray[dataIndex] === 100 ? '🏆' : ''
                }
            />

            <Box sx={{ height: { sm: '30vw', lg: '45vh' }, p: 2, justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h3" textAlign='start' width={"100%"}> Total{isXs && ` - ${totalPresent}%`}</Typography>

                {!isXs ?
                    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                        <Gauge
                            value={totalPresent ?? 0}
                            startAngle={0}
                            endAngle={360}
                            innerRadius="66%"
                            outerRadius="85%"
                            cornerRadius={3}
                            sx={{
                                [`& .${gaugeClasses.valueText}`]: {
                                    opacity: 0, 
                                },
                                [`& .${gaugeClasses.valueArc}`]: {
                                    fill: mainColor,
                                },
                            }}
                        />
                        <Typography
                            variant="h4"
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                            }}
                        >
                            {`${totalPresent ?? 0}%`}
                        </Typography>
                    </Box>

                    : <Slider
                        value={attendenceDetail?.[0]?.Total_Perc ? attendenceDetail?.[0]?.Total_Perc : 0}
                        disabled

                        sx={{
                            "& .MuiSlider-thumb": { display: "none" }, // Hides the thumb
                            height: 12,
                            "& .MuiSlider-track": { color: mainColor }
                        }}
                    />}
            </Box>
        </Box>
    )
}

export default BarChartAndGauge

