import React from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import * as Yup from "yup";
// Reuse your existing styled components
const CustomTextField = styled((props: any) => <TextField {...props} />)(({ theme }) => ({
  '& .MuiOutlinedInput-input::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: '0.8',
  },
  '& .MuiOutlinedInput-input.Mui-disabled::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: '1',
  },
  '& .Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[200],
  },
}));
export const getDateRangeValidationSchema = (
  startLabel: string = "Start date",
  endLabel: string = "End date"
) =>
  Yup.object().shape({
    startDate: Yup.string().required(`${startLabel} is required`),
    endDate: Yup.string()
      .required(`${endLabel} is required`)
      .test(
        "endDate",
        `${endLabel} cannot be before ${startLabel.toLowerCase()}`,
        function (value) {
          const { startDate } = this.parent;
          return !value || !startDate || new Date(value) >= new Date(startDate);
        }
      ),
  });

const CustomFormLabel = styled((props: any) => (
  <Typography
    variant="subtitle1"
    fontWeight={600}
    {...props}
    component="label"
    htmlFor={props.htmlFor}
  />
))(() => ({
  marginBottom: '5px',
  marginTop: '25px',
  display: 'block',
}));

interface FormDropdownProps {
  label: string;
  id: string;
  value: string;
  onChange: (event: SelectChangeEvent) => void;
  options: { value: string; label: string }[];
  error?: boolean; // Add error prop
  helperText?: string; // Add helperText prop
}

export const FormDropdown: React.FC<FormDropdownProps> = ({
  label,
  id,
  value,
  onChange,
  options,
  error,
  helperText,
}) => (
  <>
    <CustomFormLabel htmlFor={id}>{label}</CustomFormLabel>
    <FormControl fullWidth>
      <Select id={id} value={value} onChange={onChange}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {error && <Typography color="error">{helperText}</Typography>} 
      {/* Display error message */}
    </FormControl>
  </>
);

interface FormDateFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean; // Add error prop
  helperText?: string; // Add helperText prop
}

export const FormDateField: React.FC<FormDateFieldProps> = ({
  label,
  id,
  value,
  onChange,
  error,
  helperText,
  
}) => (
  <>
    <CustomFormLabel htmlFor={id}>{label}</CustomFormLabel>
    <CustomTextField
      id={id}
      type="date"
      value={value}
      onChange={onChange}
      error = {error}
      helperText = {helperText}
      fullWidth
      InputLabelProps={{
        shrink: true,
      }}
    />
  </>
);