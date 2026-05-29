import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { Typography } from '@mui/material';
interface Props {
  children: any | any[];
  steps: any[];
  activeStep: number;
  handleReset: (event: React.SyntheticEvent | Event) => void;
  finalStep?: any | any[];
}
const HorizontalStepper = ({ children, steps, activeStep, handleReset, finalStep }: Props) => {

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      
     
        <React.Fragment>
          <Box sx={{ mt: 2, mb: 1 }}>{children}</Box>
        </React.Fragment>
   
    </Box>
  );
};
export default HorizontalStepper;