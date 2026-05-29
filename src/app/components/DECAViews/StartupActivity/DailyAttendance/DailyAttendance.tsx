"use client";
import React from 'react';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { Autocomplete, Box, Button, Stack } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// Example options for "Choose Type"
const choosetype = [
  { label: 'Observer', type: 1 },
  { label: 'Neutral', type: 2 },
  { label: 'Flying', type: 3 },
];

const validationSchema = Yup.object({
  examDate: Yup.date().required("Exam date is required"),
  empid: Yup.string()
    .matches(/^\d+$/, "Employee ID must be a number")
    .required("Employee ID is required"),
  type: Yup.object().shape({
    label: Yup.string().required("Type is required"), // Ensure the label is selected
  }),
});

const DailyMarkAttendance: React.FC = () => {
  // Formik initialization with correct types for examDate and type
  const formik = useFormik({
    initialValues: { examDate:null, empid: "", type: null },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form Submitted", values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack marginTop="-13px">
        {/* Exam Date Field */}
        <Box mt="-25px">
          <CustomFormLabel>Exam Date</CustomFormLabel>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              value={formik.values.examDate}
              onChange={(newValue) => formik.setFieldValue("examDate", newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  error: formik.touched.examDate && Boolean(formik.errors.examDate),
                },
              }}
            />
          </LocalizationProvider>
        </Box>

        {/* Choose Type Field */}
        <Box>
          <CustomFormLabel>Choose Type</CustomFormLabel>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={choosetype}
            getOptionLabel={(option) => option.label} // Display label in the Autocomplete dropdown
            fullWidth
            value={formik.values.type}
            onChange={(_, newValue) => formik.setFieldValue("type", newValue)}
            renderInput={(params) => (
              <CustomTextField
                {...params}
                placeholder="Select Type"
                aria-label="Select Type"
                error={formik.touched.type && Boolean(formik.errors.type)}
                helperText={formik.touched.type ? formik.errors.type : ""}
              />
            )}
          />
        </Box>

        {/* Employee ID Field */}
        <Box mb={3}>
          <CustomFormLabel>Employee ID</CustomFormLabel>
          <CustomTextField
            id="bl-empid"
            name="empid"
            placeholder="Enter Employee Id"
            fullWidth
            value={formik.values.empid}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.empid && Boolean(formik.errors.empid)}
            helperText={formik.touched.empid ? formik.errors.empid : ""}
          />
        </Box>

        {/* Submit and Reset Buttons */}
        <Stack direction="row" spacing={2}>
          <Button variant="contained" type="submit">
            Submit
          </Button>
          <Button variant="text" color="error" onClick={formik.handleReset}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default DailyMarkAttendance;
