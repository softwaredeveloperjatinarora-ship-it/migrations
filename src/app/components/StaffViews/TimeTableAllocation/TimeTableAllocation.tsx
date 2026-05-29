// "use client";
// import Breadcrumb from "@/app/dashboard/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
// import { Autocomplete, Box, Button, Card, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material'
// import React from 'react'
// import CustomTextField from "../../forms/theme-elements/CustomTextField";
// import TimeTableGrouping from "./timeTableGrouping/TimeTableGrouping";
// import CourseTeacherMapping from "./courseTeacherMapping/CourseTeacherMapping";
// import SlotValidation from "./slotValidation/SlotValidation";
// import Allocation from "./Allocation/Allocation";


// const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];

// const BCrumb = [
//     {
//         to: "/dashboard",
//         title: "Home",
//     },
//     {
//         title: "Time Table Grouping",
//     },
// ];




// const TimeTableAllocation = () => {

//     return (
//         <>
//             <Breadcrumb title="Time Table Grouping" items={BCrumb} />

//             <Card>
//                 <Stepper alternativeLabel>
//                     {steps.map((label) => {
//                         const stepProps = {};
//                         const labelProps = {};

//                         return (
//                             <Step key={label} {...stepProps}>
//                                 <StepLabel {...labelProps}>{label}</StepLabel>
//                             </Step>
//                         );
//                     })}
//                 </Stepper>


//                 <Box sx={{ border: "1px solid black", margin: "20px " }}>

//                     <TimeTableGrouping />
//                     <CourseTeacherMapping />
//                     <SlotValidation />
//                     <Allocation />

//                 </Box>

//                 <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//                     <Button>Next</Button>
//                 </Box>

//             </Card >
//         </>
//     )
// }

// export default TimeTableAllocation












// "use client";
// import React, { useState } from 'react';
// import Breadcrumb from "@/app/dashboard/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
// import {
//     Autocomplete,
//     Box,
//     Button,
//     Card,
//     Step,
//     StepLabel,
//     Stepper,
//     TextField,
//     Typography
// } from '@mui/material';

// import CustomTextField from "../../forms/theme-elements/CustomTextField";
// import TimeTableGrouping from "./timeTableGrouping/TimeTableGrouping";
// import CourseTeacherMapping from "./courseTeacherMapping/CourseTeacherMapping";
// import SlotValidation from "./slotValidation/SlotValidation";
// import Allocation from "./Allocation/Allocation";
// import ChildCard from '../../shared/ChildCard';

// const steps = ['TimeTable Grouping', 'Course Teacher Mapping', 'Slot Validation', 'Allocation'];

// const BCrumb = [
//     {
//         to: "/dashboard",
//         title: "Home",
//     },
//     {
//         title: "Time Table Grouping",
//     },
// ];

// const TimeTableAllocation = () => {
//     const [activeStep, setActiveStep] = useState(0);

//     const handleNext = () => {
//         if (activeStep < steps.length - 1) {
//             setActiveStep((prevStep) => prevStep + 1);
//         }
//     };

//     const handleBack = () => {
//         if (activeStep > 0) {
//             setActiveStep((prevStep) => prevStep - 1);
//         }
//     };

//     const renderStepContent = (step: number) => {
//         switch (step) {
//             case 0:
//                 return <TimeTableGrouping />;
//             case 1:
//                 return <CourseTeacherMapping />;
//             case 2:
//                 return <SlotValidation />;
//             case 3:
//                 return <Allocation />;
//             default:
//                 return null;
//         }
//     };

//     return (
//         <>
//             {/* <Breadcrumb title="Time Table" items={BCrumb} /> */}

//             <Box sx={{ mt:-0.5  ,mb: -1.5,height:"20%"  }}>
//                 <Breadcrumb title="Time Table" items={BCrumb} />
//             </Box>

//             <Card sx={{ p: 3 }}>
//                 <Stepper activeStep={activeStep} alternativeLabel>
//                     {steps.map((label, index) => (
//                         <Step key={index}>
//                             <StepLabel>{label}</StepLabel>
//                         </Step>
//                     ))}
//                 </Stepper>


//                 <Box sx={{ mt: 3 }}>
//                     {/* <ChildCard > */}

//                     <Box >
//                         {renderStepContent(activeStep)}
//                     </Box>
//                     {/* </ChildCard> */}

//                 </Box>

//                 <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
//                     <Button disabled={activeStep === 0} onClick={handleBack}>
//                         Back
//                     </Button>
//                     <Button onClick={handleNext} disabled={activeStep === steps.length - 1}>
//                         Next
//                     </Button>
//                 </Box>
//             </Card>
//         </>
//     );
// };

// export default TimeTableAllocation;































"use client";
import React, { useState } from 'react';

import {
    Autocomplete,
    Box,
    Button,
    Card,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography
} from '@mui/material';

import CustomTextField from "../../forms/theme-elements/CustomTextField";
import TimeTableGrouping from "./timeTableGrouping/TimeTableGrouping";
// import CourseTeacherMapping from "./courseTeacherMapping/CourseTeacherMapping";
// import SlotValidation from "./slotValidation/SlotValidation";
// import Allocation from "./Allocation/Allocation";
import ChildCard from '../../shared/ChildCard';
import Breadcrumb from '@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';

const steps = ['TimeTable Grouping', 'Course Teacher Mapping', 'Slot Validation', 'Allocation'];

const BCrumb = [
    {
        to: "/dashboard",
        title: "Home",
    },
    {
        title: "Time Table Grouping",
    },
];

const TimeTableAllocation = () => {
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep((prevStep) => prevStep - 1);
        }
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return <TimeTableGrouping />;
            // case 1:
            //     return <CourseTeacherMapping />;
            // case 2:
            //     return <SlotValidation />;
            // case 3:
            //     return <Allocation />;
            default:
                return null;
        }
    };

    return (
        <>
            {/* <Breadcrumb title="Time Table" items={BCrumb} /> */}

            <Box sx={{ mt: -0.5, mb: -1, height: "20%" }}>
                <Breadcrumb title="Online Time Table Scheduling" items={BCrumb} />
            </Box>

            <Card sx={{ p: 3 }}>
                {/* <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => (
                        <Step key={index}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper> */}



                <Typography variant="h6" sx={{ fontSize: "14px", whiteSpace: "nowrap" }}>
                    Time Table Grouping
                </Typography>




                <Box sx={{ mt: 3 }}>
                    {/* <ChildCard > */}

                    <Box >
                        {renderStepContent(activeStep)}
                    </Box>
                    {/* </ChildCard> */}

                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                    <Button disabled={activeStep === 0} onClick={handleBack}>
                        Back
                    </Button>
                    {/* <Button onClick={handleNext} disabled={activeStep === steps.length - 1}>
                        Next
                    </Button> */}
                </Box>
            </Card>
        </>
    );
};

export default TimeTableAllocation;
