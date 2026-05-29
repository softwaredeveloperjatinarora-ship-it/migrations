"use client";
import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Typography,
  Divider,
  MenuItem,
  TextField,
  Alert,
  OutlinedInput,
  InputAdornment,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
  Dialog,
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Stack, useTheme } from "@mui/system";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import ParentCard from "@/app/components/shared/ParentCard";
import { styled } from '@mui/material/styles';
import { IconBuildingBank, IconCaretDownFilled, IconCurrency, IconDownload, IconMail,IconMenu4, IconUser} from "@tabler/icons-react";
import CategoryIcon from '@mui/icons-material/Category';
 
import RefundInstruction from "./popup/RefundInstruction";
import AccessRestricted from "../Common/AccessRestricted";
import Breadcrumb from "@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
const categories = [
  {
    value: "Residential/ Food/Mess/Laundary Excess Fee",
    label: "Residential/ Food/Mess/Laundary Excess Fee",
  },
  {
    value: "Tuition Fee",
    label: "Tuition Fee",
  },
  {
    value: "Tuition Fee & Hostel Residential Services (Both)",
    label: "Tuition Fee & Hostel Residential Services (Both)",
  },
  {
    value: "Credit Transfer Case",
    label: "Credit Transfer Case",
  },
];
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
const StudentRefundApplication = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(false);
    const[notAllowed,setNotAllowd]=useState(false);
     const theme = useTheme();

     const primary = theme.palette.primary.light;
     const textPrimary=theme.palette.primary.main;


    useEffect(()=>{
      //setNotAllowd(true)
      setOpen(true)
    },[])

const handleChange = (event: SelectChangeEvent<typeof selectedCategories>) => {
  const {
    target: { value },
  } = event;
  setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
};
const BCrumb = [
  {
    to: "/dashboard",
    title: "Home",
  },
  {
    title: "Refund Application",
  },
];
  return (
    <>   <Breadcrumb title="Refund Application" items={BCrumb} />
    { notAllowed?<AccessRestricted img="/images/backgrounds/AccessRestricted.svg" heading="Access Restricted" subMsg="You are not authorized to apply.Please Contact the dealing official at Block 32, Room No. 102 (Window 5),or reach out at 01824-4444379 between 9:00 AM and 5:00 PM on working days."/>: (<>
      <ParentCard
        title="Application Form"
        footer={
          <>
            <Button
              variant="contained"
              color="error"
              sx={{
                mr: 1,
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" color="primary">
              Submit
            </Button>
          </>
        }
      >
        <>
        <Alert sx={{backgroundColor:primary,color:textPrimary}} severity="info">Documents</Alert>
          <Grid container spacing={1} mb={2}>
            <Grid
              size={{
                lg: 3,
                md: 4,
                sm: 4,
              }}
            >
              <CustomFormLabel htmlFor="facount">Refund Policy</CustomFormLabel>
              <Button
                variant="outlined"
                startIcon={<IconDownload />}
                href="/path-to-refund-policy.pdf"
                target="_blank"
              >
                Download Refund Policy
              </Button>
            </Grid>
            <Grid
              size={{
                lg: 3,
                md: 4,
                sm: 4,
              }}
            >
              <CustomFormLabel htmlFor="fifsc">
                Application Form
              </CustomFormLabel>
              <Button
                variant="outlined"
                startIcon={<IconDownload />}
                href="/path-to-refund-policy.pdf"
                target="_blank"
              >
                Download Application Form
              </Button>
            </Grid>
            <Grid
              size={{
                lg: 3,
                md: 4,
                sm: 4,
              }}
            >
              <CustomFormLabel htmlFor="fifsc">Consent Letter</CustomFormLabel>
              <Button
                variant="outlined"
                startIcon={<IconDownload />}
                href="/path-to-refund-policy.pdf"
                target="_blank"
              >
                Download Consent Letter
              </Button>
            </Grid>
            <Grid
              size={{
                lg: 3,
                md: 4,
                sm: 4,
              }}
            >
              <CustomFormLabel htmlFor="fifsc">
                Affidavit Letter
              </CustomFormLabel>
              <Button
                variant="outlined"
                startIcon={<IconDownload />}
                href="/path-to-refund-policy.pdf"
                target="_blank"
              >
                Download Affidavit Letter
              </Button>
            </Grid>
            <Grid
              size={{
                lg: 3,
                md: 4,
                sm: 4,
              }}
            >
              <CustomFormLabel htmlFor="facount">
                Bihar Loan Letter
              </CustomFormLabel>
              <Button
                variant="outlined"
                startIcon={<IconDownload />}
                href="/path-to-refund-policy.pdf"
                target="_blank"
              >
                Download Loan Letter
              </Button>
            </Grid>
          </Grid>
          <Alert severity="info" sx={{backgroundColor:primary,color:textPrimary}}>Refund Details</Alert>
          <Grid container spacing={3} mb={2}>
            <Grid
              size={{
                lg: 6,
                md: 12,
                sm: 12,
              }}
            >
              <CustomFormLabel htmlFor="famount">Refund Amount</CustomFormLabel>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">₹</InputAdornment>
                }
                id="famount"
                placeholder="Amount"
                fullWidth
              />
            </Grid>
            <Grid
              size={{
                lg: 6,
                md: 12,
                sm: 12,
              }}
            >
              <CustomFormLabel htmlFor="standard-select-category">
                Select Category
              </CustomFormLabel>
              <CustomSelect
                id="standard-select-category"
                multiple
                value={selectedCategories}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                displayEmpty
                renderValue={(selected: string[]) => {
                  if (selected.length === 0) {
                    return <em>Select Category</em>;
                  }
                  return selected.join(", ");
                }}
                input={
                  <OutlinedInput
                    startAdornment={
                      <InputAdornment position="start">
                        <IconMenu4 />
                      </InputAdornment>
                    }
                  />
                }
              >
                <MenuItem disabled value="">
                  <em>Select Category</em>
                </MenuItem>
                {categories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Checkbox
                      checked={selectedCategories.indexOf(option.value) > -1}
                    />
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 3,
              }}
            ></Grid>
          </Grid>
          <Alert severity="info" sx={{backgroundColor:primary,color:textPrimary}}>Account Details</Alert>
          <Grid container spacing={3} mb={2}>
            <Grid
              size={{
                lg: 6,
                md: 12,
                sm: 12,
              }}
            >
              <CustomFormLabel htmlFor="fname">Name</CustomFormLabel>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">
                    <IconUser />
                  </InputAdornment>
                }
                id="fname"
                placeholder="Name"
                fullWidth
              />
              <CustomFormLabel htmlFor="fbank">Bank Name</CustomFormLabel>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">
                    <IconBuildingBank />
                  </InputAdornment>
                }
                id="fbank"
                placeholder="Bank Name"
                fullWidth
              />
            </Grid>
            <Grid
              size={{
                lg: 6,
                md: 12,
                sm: 12,
              }}
            >
              <CustomFormLabel htmlFor="facount">Account No</CustomFormLabel>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">
                    <IconBuildingBank />
                  </InputAdornment>
                }
                id="facount"
                placeholder="Acount No"
                fullWidth
              />
              <CustomFormLabel htmlFor="fifsc">IFSC Code</CustomFormLabel>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">
                    <IconBuildingBank />
                  </InputAdornment>
                }
                id="fifsc"
                placeholder="IFSC Code"
                fullWidth
              />
            </Grid>
          </Grid>
          <Alert severity="info" sx={{backgroundColor:primary,color:textPrimary}}>Document Upload</Alert>
          <Grid container spacing={1} mb={2}>
            <Grid
              size={{
                lg: 3,
                md: 4,
                sm: 4,
              }}
            >
              <CustomFormLabel htmlFor="facount">
                Application Form
              </CustomFormLabel>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
              >
                Upload Application Form
                <VisuallyHiddenInput type="file" name="uapplication" />
              </Button>
            </Grid>
            <Grid
              size={{
                lg: 3,
                md: 4,
                sm: 4,
              }}
            >
              <CustomFormLabel htmlFor="facount">
               Consent Letter
              </CustomFormLabel>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
              >
                Upload Consent Letter
                <VisuallyHiddenInput type="file" name="uconsent" />
              </Button>
            </Grid>
            <Grid
              size={{
                lg: 3,
                md: 4,
                sm: 4,
              }}
            >
              <CustomFormLabel htmlFor="facount">
             Parent Id Proof
              </CustomFormLabel>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
              >
                Upload Id Proof
                <VisuallyHiddenInput type="file" name="uconsent" />
              </Button>
            </Grid>
            <Grid
              size={{
                lg: 3,
                md: 4,
                sm: 4,
              }}
            >
              <CustomFormLabel htmlFor="facount">
            Parent Passbook/Cancelled Cheque
              </CustomFormLabel>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
              >
                Upload document
                <VisuallyHiddenInput type="file" name="uconsent" />
              </Button>
            </Grid>
            <Grid
              size={{
                lg: 3,
                md: 4,
                sm: 4,
              }}
            >
              <CustomFormLabel htmlFor="facount">
               Stundent Id Proof
              </CustomFormLabel>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
              >
                Upload Id Proof
                <VisuallyHiddenInput type="file" name="uconsent" />
              </Button>
            </Grid>
            <Grid
              size={{
                lg: 3,
                md: 4,
                sm: 4,
              }}
            >
              <CustomFormLabel htmlFor="facount">
               Scholarship Letter
              </CustomFormLabel>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
              >
                Upload Scholarship Letter
                <VisuallyHiddenInput type="file" name="uconsent" />
              </Button>
            </Grid>
          </Grid>
        </>
      </ParentCard></>)}

       <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            <RefundInstruction  open={open}
                handleClose={handleClose} />       
         </Dialog>
    </>
  );
};

export default StudentRefundApplication;
