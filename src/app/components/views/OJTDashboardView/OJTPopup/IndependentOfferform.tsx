

"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  FormControlLabel,
  Checkbox,
  Snackbar,
  CircularProgress,
  Modal,
  MenuItem,
  FormControl,
  Autocomplete,
  FormHelperText,
  FormGroup,
  Alert,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { ProfileState } from "@/store/store";
import { useSelector } from "@/store/hooks";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import CustomRadio from "@/app/components/forms/theme-elements/CustomRadio";
import OJTAcademicDetails from "./OJTAcademicDetails";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CloseIcon from "@mui/icons-material/Close";
import * as yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from "formik";

import * as Yup from "yup";


interface OJTApplyProps {
  isOpen: boolean;
  closeModal: (data?: boolean) => void;
}

// Define the types for profile data structure

const top100Films = [
  { title: "Online Test", year: 1994 },
  { title: "Technical Interview", year: 1972 },
  { title: "Telephonic Interview", year: 1974 },
  { title: "Assignment", year: 2008 },
];

const Companies = [
  {
    value: "Cognizant Pvt.Ltd.",
    label: "Cognizant Pvt.Ltd.",
  },
  {
    value: "Teleperformance",
    label: "Teleperformance",
  },
  {
    value: "other",
    label: "Other",
  },
];

const apporach = [
  {
    value: "College Placement Cell.",
    label: "College Placement Cell.",
  },
  {
    value: "Company Website Application",
    label: "Company Website Application",
  },
  {
    value: "Intership Portal",
    label: "Intership Portal",
  },
  {
    value: "Linkdin Networking",
    label: "Linkdin Networking",
  },
  {
    value: "Code Emailing",
    label: "Job Fairs",
  },
  {
    value: "Personal Contact/referals",
    label: "Personal Contact/referals",
  },
];

const drivevenue = [
  {
    value: "Remote/Virtual Workspace",
    label: "Remote/Virtual Workspace",
  },
  {
    value: "Company Headquarters",
    label: "Company Headquarters",
  },
  {
    value: "Satellite Office",
    label: "Satellite Office",
  },
  {
    value: "Regional Office",
    label: "Regional Office",
  },
  {
    value: "Rearch Center",
    label: "Rearch Center",
  },
  {
    value: "Field Work Location",
    label: "Field Work Location",
  },
];




const checkboxes = [
  {
    name: "agreeToTerms",
    label:
      "I have read and understood all regulations of On-Job Training (OJT) Policy applicable to me and I am fully aware of all terms and conditions specified in the OJT Policy.",
  },
  {
    name: "subscribeNewsletter",
    label:
      "I shall abide by OJT Policy and Code of Conduct during OJT duration.",
  },
  {
    name: "receiveUpdates",
    label:
      "I understand that before proceeding to OJT, I will ensure that my OJT application is approved in writing by all competent authorities. My OJT will be rejected if I proceed on OJT without prior written approval.",
  },
  {
    name: "receiveUpdates",
    label:
      "I will send monthly reports of OJT progress to my School’s Placement Coordinator, duly certified by the authorized signatory of the organization, stating the details of OJT work done within that month.",
  },
  {
    name: "receiveUpdates",
    label:
      "I will submit my bank statements / salary slips on a monthly basis through UMS, for the entire period of OJT/Internship, as a proof of my salary/stipend being provided to me by the OJT/Internship organization.",
  },
  {
    name: "receiveUpdates",
    label:
      "I understand that if my OJT is terminated by the Organization or if it is cancelled by the University or if I quit the OJT on my own or in case I violate any of the regulations of OJT, I shall report back to the University for completing my academic obligations as applicable. I will neither be eligible for nor seek any relaxation in attendance or academic obligations as prescribed by the University. This may require me to register course(s) as backlog(s).",
  },
  {
    name: "receiveUpdates",
    label:
      "I understand that I will have to appear for all the exams as per the examination schedule announced by the university. I understand that I have to fulfill my professional responsibility in organization and academics requirements like ETE/ETP, Fields project, and CA etc. simultaneously.",
  },
  { name: "receiveUpdates", label: "This has the consent of my parents." },
  {
    name: "receiveUpdates",
    label:
      "I will spend  minimum 6 working hours per day in the organization at least five days per week.",
  },
  {
    name: "receiveUpdates",
    label:
      "Salaries/Stipend should be avoided in cash. Online/Bank Transfers should be recommended.",
  },
];

const OJTApplyForm: React.FC<OJTApplyProps> = ({ isOpen, closeModal }) => {
  if (!isOpen) return null;
  const [openApplyform, setOpenApplyform] = React.useState(false);
  const handleOpenApplyform = () => setOpenApplyform(true);
  const handleCloseApplyform = () => setOpenApplyform(false);

  const [company, setCompany] = React.useState("");

  const handleChange2 = (event: any) => {
    setCompany(event.target.value);
  };

  const handleChange3 = (event: any) => {
    setSelectedValue(event.target.value);
  };
  const [selectedValue, setSelectedValue] = React.useState("");

  const [loading, setLoading] = useState(true); // Add loading state
  const profilee = useSelector((state: ProfileState) => state.profile) as {
    profileData: {
      aggrAttendance: number;
      studentUid: number;
      name: string;
      fatherName: string;
      motherName: string;
      gender: string;
      studentEmail: any;
      dateOfBirth: number;
      fatherMobile: number;
      motherMobile: number;
      studentMobile: number;
      fatherEmail: any;

      paLine1: any;
      paCityName: string;
      paDistrictName: any;
      paStateName: string;
      paCountryName: string;
      paPincode: number;

      caLine1: any;
      cCityName: string;
      cDistrictName: string;
      cStateName: string;
      cCountryName: string;
      cPincode: number;
    }[];
  };

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const [activeStep, setActiveStep] = useState(0);

  // const [isAgreed, setIsAgreed] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState<{ [key: string]: boolean }>({});

  const [openToast, setOpenToast] = useState(false);
  const [ErroropenToast, setErrorOpenToast] = useState(false);

  // const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  // const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setIsAgreed(event.target.checked);
  // };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setCheckboxStates((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };





  const handleUpdate = () => {
    const allChecked = checkboxes.every((_, index) =>
      checkboxStates[`receiveUpdates-${index}`] || checkboxStates[`agreeToTerms-${index}`] || checkboxStates[`subscribeNewsletter-${index}`]
    );

    if (allChecked) {
      setOpenToast(true);
    } else {
      alert("Please agree to all terms before proceeding.");
    }
  };



  const Step1InitialValues = {
    companyname: '',
    offertype: '',
    offerProofType: '',
    Designation: '',
    ApproachMode: '',
    DriveVenue: '',
    packagementionoffer: '',
    joiningdate: '',
    Completiondate: '',
    Selectionprocess: '',
    offerLetter: null as File | null,
    nocFile: null as File | null,
    ContactPerson: '',
    ContactNo: '',
    HrEmail: '',
  };



  const Step1ValidationSchema = (step: number) => {
    if (activeStep === 1) {
      return Yup.object().shape({
        companyname: Yup.string().required("company name is required"),
        offertype: Yup.string().required("Offer  type is required"),
        offerProofType: Yup.string().required("Offer proof type is required"),
        Designation: Yup.string().required("Designation is required"),
        ApproachMode: Yup.string().required("Approach mode is required"),
        DriveVenue: Yup.string().required("drive venue is required"),
        packagementionoffer: Yup.string().required("Package mention status is required"),
        joiningdate: Yup.string().required("joining date is required"),
        Completiondate: Yup.string().required("Tentative Completion Date is required"),
        offerLetter: Yup.mixed().test("fileExists", "Offer letter is required", (value) => !!value),
        nocFile: Yup.mixed().test("fileExists", "NOC file is required", (value) => !!value),
        Selectionprocess: Yup.array().required("Selectionprocess  is required"),
      });
    }

    if (activeStep === 2) {
      return Yup.object().shape({
        ContactPerson: Yup.string().required("Contact Person is required"),
        ContactNo: Yup.string().required("Contact No is required"),
        HrEmail: Yup.string().email("Invalid email").required("HR Email is required"),
      });
    }

    // Default fallback
    return Yup.object().shape({});
  };








  const handleNext = async (formik: any) => {
    const errors = await formik.validateForm();

    if (activeStep === 1) {
      formik.setTouched({
        companyname: true,
        offertype: true,
        offerProofType: true,
        Designation: true,
        ApproachMode: true,
        DriveVenue: true,
        packagementionoffer: true,
        joiningdate: true,
        Completiondate: true,
        Selectionprocess: true,
        offerLetter: true,
        nocFile: true,
      });

      if (Object.keys(errors).length === 0) {
        setActiveStep((prev) => prev + 1);
      }
    } else if (activeStep === 2) {
      formik.setTouched({
        ContactPerson: true,
        ContactNo: true,
        HrEmail: true,
      });

      if (
        !errors.ContactPerson &&
        !errors.ContactNo &&
        !errors.HrEmail
      ) {
        setActiveStep((prev) => prev + 1);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };




  const [show, setShow] = useState(true);
  const handleClose = () => {

    closeModal(false);
    setShow(!show);
  };

  const allChecked =
    checkboxes.every((_, index) =>
      checkboxStates[`receiveUpdates-${index}`] ||
      checkboxStates[`agreeToTerms-${index}`] ||
      checkboxStates[`subscribeNewsletter-${index}`]
    );





  if (!loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }



  return show && (
    <>
      <Snackbar
        open={ErroropenToast}
        autoHideDuration={3000}
        onClose={() => setErrorOpenToast(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setErrorOpenToast(false)} severity="error" sx={{ width: "150%" }}>
          Please choose a PDF file only.
        </Alert>

      </Snackbar>
      <Modal
        open={isOpen}
        onClose={handleCloseApplyform}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          "& .MuiPaper-root": {
            width: "1000px",
          },
          marginTop: "2px",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,

            mx: "auto",
            mt: 5,
            borderRadius: "12px",
            bgcolor: isDarkMode ? "#111C2D" : "#ffffff",
            boxShadow: isDarkMode
              ? "0px 4px 10px rgba(255, 255, 255, 0.1)"
              : "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h4"
            mb={3}
            textAlign="center"
            color="primary"
            fontWeight={600}
          >
            Independent Offer
          </Typography>


          <Box
            onClick={handleClose}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              marginTop: "-30px",
              marginLeft: "100px",
              float: "right",
              marginRight: "10px",
              padding: "2px",

              backgroundColor: "lightgrey",
              borderRadius: "50%",
            }}
          >
            <CloseIcon sx={{ width: "15px", height: "15px", color: 'black' }} />
          </Box>




          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
            <Step>
              <StepLabel>Academic Information</StepLabel>
            </Step>
            <Step>
              <StepLabel>Offer Details</StepLabel>
            </Step>
            <Step>
              <StepLabel>HR & Other Details</StepLabel>
            </Step>
            <Step>
              <StepLabel>Undertaking</StepLabel>
            </Step>
          </Stepper>
          <Formik
            initialValues={Step1InitialValues}
            validationSchema={Step1ValidationSchema}
            enableReinitialize
            onSubmit={(values) => {
              // console.log("Final Submit", values);
            }}
          >
            {(formik) => (

              <>
                <Form>
                  <Grid container spacing={2}>
                    {activeStep === 0 && (
                      <>
                        {" "}
                        <OJTAcademicDetails></OJTAcademicDetails>
                      </>
                    )}

                    {activeStep === 1 && (
                      <>
                        <Grid size={{ xs: 6, sm: 4 }}>

                          <Typography variant="body2" color="text.secondary">
                            Select Company Name
                          </Typography>
                          <CustomSelect
                            id="standard-select-company"
                            name="companyname"
                            value={formik.values.companyname}
                            onChange={(e: any) => formik.setFieldValue('companyname', e.target.value)}
                            onBlur={formik.handleBlur}
                            fullWidth
                            variant="outlined"
                            error={formik.touched.companyname && Boolean(formik.errors.companyname)}
                          >
                            {Companies.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </CustomSelect>

                          {formik.touched.companyname && formik.errors.companyname && (
                            <Typography variant="caption" color="error">
                              {formik.errors.companyname}
                            </Typography>
                          )}
                        </Grid>

                        <Grid size={{ xs: 6, sm: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            Offer Type
                          </Typography>

                          <FormControl
                            component="fieldset"
                            sx={{ width: "100%" }}
                            error={formik.touched.offertype && Boolean(formik.errors.offertype)}
                          >
                            <Box>
                              <FormControlLabel
                                value="a"
                                control={<CustomRadio />}
                                label="Placement"
                                name="offertype"
                                checked={formik.values.offertype === "a"}
                                onChange={() => formik.setFieldValue("offertype", "a")}
                                onBlur={formik.handleBlur}
                              />
                              <FormControlLabel
                                value="b"
                                control={<CustomRadio />}
                                label="Internship"
                                name="offertype"
                                checked={formik.values.offertype === "b"}
                                onChange={() => formik.setFieldValue("offertype", "b")}
                                onBlur={formik.handleBlur}
                              />
                            </Box>

                            {formik.touched.offertype && formik.errors.offertype && (
                              <Typography variant="caption" color="error">
                                {formik.errors.offertype}
                              </Typography>
                            )}
                          </FormControl>

                        </Grid>

                        <Grid size={{ xs: 6, sm: 4 }} >
                          <Typography variant="body2" color="text.secondary">
                            Offer Proof Type
                          </Typography>

                          <FormControl
                            component="fieldset"
                            sx={{ width: "100%" }}
                            error={formik.touched.offerProofType && Boolean(formik.errors.offerProofType)}
                          >
                            <Box>
                              <FormControlLabel
                                value="a"
                                control={<CustomRadio />}
                                label="E-mail"
                                name="offerProofType"
                                checked={formik.values.offerProofType === "a"}
                                onChange={() => formik.setFieldValue("offerProofType", "a")}
                                onBlur={formik.handleBlur}
                              />
                              <FormControlLabel
                                value="b"
                                control={<CustomRadio />}
                                label="Offer Letter"
                                name="offerProofType"
                                checked={formik.values.offerProofType === "b"}
                                onChange={() => formik.setFieldValue("offerProofType", "b")}
                                onBlur={formik.handleBlur}
                              />
                            </Box>

                            {formik.touched.offerProofType && formik.errors.offerProofType && (
                              <Typography variant="caption" color="error">
                                {formik.errors.offerProofType}
                              </Typography>
                            )}
                          </FormControl>


                        </Grid>

                        <Grid size={{ xs: 6, sm: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            Designation
                          </Typography>

                          <TextField
                            id="Designation"
                            name="Designation"
                            variant="outlined"
                            fullWidth
                            value={formik.values.Designation}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.Designation && Boolean(formik.errors.Designation)}
                            helperText={formik.touched.Designation && formik.errors.Designation}
                          />

                        </Grid>

                        <Grid size={{ xs: 6, sm: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            Approach Mode
                          </Typography>

                          <CustomSelect
                            id="ApproachMode"
                            name="ApproachMode"
                            fullWidth
                            variant="outlined"
                            value={formik.values.ApproachMode}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.ApproachMode && Boolean(formik.errors.ApproachMode)}
                          >
                            {apporach.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </CustomSelect>

                          {formik.touched.ApproachMode && formik.errors.ApproachMode && (
                            <Typography variant="caption" color="error">
                              {formik.errors.ApproachMode}
                            </Typography>
                          )}

                        </Grid>





                        <Grid size={{ xs: 6, sm: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            Package Mentioned on Offer Letter
                          </Typography>

                          <FormControl
                            component="fieldset"
                            sx={{ width: "100%" }}
                            error={formik.touched.packagementionoffer && Boolean(formik.errors.packagementionoffer)}
                          >
                            <Box>
                              <FormControlLabel
                                value="a"
                                control={<CustomRadio />}
                                label="Yes"
                                name="packagementionoffer"
                                checked={formik.values.packagementionoffer === "a"}
                                onChange={() => formik.setFieldValue("packagementionoffer", "a")}
                                onBlur={formik.handleBlur}
                              />
                              <FormControlLabel
                                value="b"
                                control={<CustomRadio />}
                                label="No"
                                name="packagementionoffer"
                                checked={formik.values.packagementionoffer === "b"}
                                onChange={() => formik.setFieldValue("packagementionoffer", "b")}
                                onBlur={formik.handleBlur}
                              />
                            </Box>

                            {formik.touched.packagementionoffer && formik.errors.packagementionoffer && (
                              <Typography variant="caption" color="error">
                                {formik.errors.packagementionoffer}
                              </Typography>
                            )}
                          </FormControl>


                        </Grid>

                        <Grid size={{ xs: 6, sm: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            Offer Letter
                          </Typography>

                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: { xs: 'column', sm: 'row' },
                              alignItems: { xs: 'center', sm: 'flex-end' },
                              gap: { xs: 1, sm: 1 },
                            }}
                          >
                            <Button
                              component="label"
                              variant="outlined"
                              startIcon={<CloudUploadIcon />}
                              sx={{
                                borderRadius: 1,
                                height: { xs: 36, sm: 40 },
                                width: { xs: '100%', sm: 'auto' },
                                fontSize: { xs: 12, sm: 14 },
                                padding: { xs: '6px 12px', sm: '8px 16px' },
                                minWidth: 120,
                              }}
                            >
                              Choose file
                              <input
                                type="file"
                                hidden
                                accept="application/pdf"
                                name="offerLetter"
                                onChange={(event) => {
                                  const file = event.currentTarget.files?.[0];
                                  if (file) {
                                    if (file.type === "application/pdf") {
                                      formik.setFieldValue("offerLetter", file);
                                    } else {
                                      // Trigger error toast/snackbar
                                      setErrorOpenToast(true);
                                      event.target.value = ""; // Clear file input
                                    }
                                  }
                                }}
                              />
                            </Button>

                            {formik.values.offerLetter && (
                              <Typography
                                component="span"
                                sx={{
                                  fontSize: { xs: 10, sm: 12 },
                                  alignSelf: 'flex-end',
                                  wordBreak: 'break-word',
                                  maxWidth: '100%',
                                  textAlign: 'center',
                                  marginTop: { xs: 0.5, sm: 0 },
                                  color: "#1769aa"
                                }}
                              >
                                {formik.values.offerLetter.name}
                              </Typography>
                            )}
                          </Box>

                          {formik.touched.offerLetter && formik.errors.offerLetter && (
                            <FormHelperText error>{formik.errors.offerLetter}</FormHelperText>
                          )}
                        </Grid>


                        <Grid size={{ xs: 6, sm: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            NOC
                          </Typography>

                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: { xs: 'column', sm: 'row' },
                              alignItems: { xs: 'center', sm: 'flex-end' },
                              gap: { xs: 1, sm: 1 },
                            }}
                          >
                            <Button
                              component="label"
                              variant="outlined"
                              startIcon={<CloudUploadIcon />}
                              sx={{
                                borderRadius: 1,
                                height: { xs: 36, sm: 40 },
                                width: { xs: '100%', sm: 'auto' },
                                fontSize: { xs: 12, sm: 14 },
                                padding: { xs: '6px 12px', sm: '8px 16px' },
                                minWidth: 120,
                              }}
                            >
                              Choose file
                              {/* <input
        type="file"
        hidden
        name="nocFile"
        accept="application/pdf"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          if (file) {
            if (file.type === "application/pdf") {
              formik.setFieldValue("nocFile", file);
            } else {
              formik.setFieldError("nocFile", "Only PDF files are allowed");
              event.target.value = "";
            }
          }
        }}
      /> */}
                              <input
                                type="file"
                                hidden
                                accept="application/pdf"
                                name="nocFile"
                                onChange={(event) => {
                                  const file = event.currentTarget.files?.[0];
                                  if (file) {
                                    if (file.type === "application/pdf") {
                                      formik.setFieldValue("nocFile", file);
                                    } else {
                                      // Trigger error toast/snackbar
                                      setErrorOpenToast(true);
                                      event.target.value = ""; // Clear file input
                                    }
                                  }
                                }}
                              />
                            </Button>

                            {formik.values.nocFile && (
                              <Typography
                                component="span"
                                sx={{
                                  fontSize: { xs: 10, sm: 12 },
                                  alignSelf: 'flex-end',
                                  wordBreak: 'break-word',
                                  maxWidth: '100%',
                                  textAlign: 'center',
                                  marginTop: { xs: 0.5, sm: 0 },
                                  color: "#1769aa"
                                }}
                              >
                                {formik.values.nocFile.name}
                              </Typography>
                            )}
                          </Box>

                          {formik.touched.nocFile && formik.errors.nocFile && (
                            <FormHelperText error>{formik.errors.nocFile}</FormHelperText>
                          )}
                        </Grid>

                        <Grid size={{ xs: 6, sm: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            Date of Joining
                          </Typography>

                          <CustomTextField
                            id="joiningdate"
                            name="joiningdate"
                            type="date"
                            variant="outlined"
                            fullWidth
                            value={formik.values.joiningdate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.joiningdate && Boolean(formik.errors.joiningdate)}
                            helperText={formik.touched.joiningdate && formik.errors.joiningdate}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />

                        </Grid>
                        <Grid size={{ xs: 6, sm: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            Tentative Completion Date
                          </Typography>

                          <CustomTextField
                            id="Completiondate"
                            name="Completiondate"
                            type="date"
                            variant="outlined"
                            fullWidth
                            value={formik.values.Completiondate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.Completiondate && Boolean(formik.errors.Completiondate)}
                            helperText={formik.touched.Completiondate && formik.errors.Completiondate}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            Drive Venue
                          </Typography>
                          <CustomSelect
                            id="DriveVenue"
                            name="DriveVenue"
                            fullWidth
                            variant="outlined"
                            value={formik.values.DriveVenue}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.ApproachMode && Boolean(formik.errors.ApproachMode)}

                          >
                            {drivevenue.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </CustomSelect>
                          {formik.touched.DriveVenue && formik.errors.DriveVenue && (
                            <Typography variant="caption" color="error">
                              {formik.errors.DriveVenue}
                            </Typography>
                          )}
                        </Grid>


                        <Grid size={{ xs: 6, sm: 4 }}  >
                          <Typography variant="body2" color="text.secondary">
                            Selection process
                          </Typography>

                          <Autocomplete
                            multiple
                            id="tags-standard"
                            options={top100Films}
                            getOptionLabel={(option) => option.title}
                            // value={formik.values.Selectionprocess}
                            onChange={(_, value) => formik.setFieldValue("Selectionprocess", value)}
                            onBlur={() => formik.setFieldTouched("Selectionprocess", true)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Selection process"
                                error={formik.touched.Selectionprocess && Boolean(formik.errors.Selectionprocess)}
                                helperText={formik.touched.Selectionprocess && formik.errors.Selectionprocess}
                              />
                            )}
                          />


                        </Grid>

                      </>
                    )}



                    {activeStep === 2 && (
                      <>
                        <Grid size={{ xs: 6, sm: 4 }}>
                          <Typography variant="body2" color="text.secondary">Contact Person</Typography>
                          <TextField
                            id="ContactPerson"
                            name="ContactPerson"
                            fullWidth
                            variant="outlined"
                            value={formik.values.ContactPerson}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.ContactPerson && Boolean(formik.errors.ContactPerson)}
                            helperText={formik.touched.ContactPerson && formik.errors.ContactPerson}
                          />
                        </Grid>

                        <Grid size={{ xs: 6, sm: 4 }}>
                          <Typography variant="body2" color="text.secondary">Contact No.</Typography>
                          <TextField
                            id="ContactNo"
                            name="ContactNo"
                            fullWidth
                            variant="outlined"
                            value={formik.values.ContactNo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.ContactNo && Boolean(formik.errors.ContactNo)}
                            helperText={formik.touched.ContactNo && formik.errors.ContactNo}
                          />
                        </Grid>

                        <Grid size={{ xs: 6, sm: 4 }}>
                          <Typography variant="body2" color="text.secondary">HR Email</Typography>
                          <TextField
                            id="HrEmail"
                            name="HrEmail"
                            fullWidth
                            variant="outlined"
                            value={formik.values.HrEmail}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.HrEmail && Boolean(formik.errors.HrEmail)}
                            helperText={formik.touched.HrEmail && formik.errors.HrEmail}
                          />
                        </Grid>
                      </>
                    )}

                    {activeStep === 3 && (
                      <Box
                        sx={{
                          mt: 4,
                          mx: 2,
                          maxHeight: "400px",
                          overflowY: "auto",
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: "bold",
                            alignSelf: "center",
                            color: isDarkMode ? "#fff" : "#333",
                          }}
                        >
                          Undertaking
                        </Typography>
                        {activeStep === 3 && (
                          <FormGroup>
                            {checkboxes.map(({ name, label }, index) => (
                              <FormControlLabel
                                key={`${name}-${index}`}
                                control={
                                  <Checkbox
                                    name={`${name}-${index}`}
                                    checked={checkboxStates[`${name}-${index}`] || false}
                                    onChange={handleCheckboxChange}
                                  />
                                }
                                label={label}
                              />
                            ))}
                          </FormGroup>

                        )}

                        {/* Notice for Incorrect Information */}
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 2,
                            color: "red",
                            fontWeight: 500,
                          }}
                        >
                          <span style={{ color: "blue", fontWeight: "bold" }}>
                            Note:
                          </span>{" "}
                          You shall continue attending all classes as per allocated
                          courses{" "}
                          <b>
                            until 3 days prior to Internship/ OJT start date (Subject to
                            Approval)
                          </b>{" "}
                          and should not have been reported for any disciplinary action
                          during this period.
                        </Typography>

                        {/* Update Button */}
                        <Box display="flex" justifyContent="center" mt={3}>
                          <Button
                            onClick={handleUpdate}
                            variant="contained"
                            disabled={
                              !checkboxes.every((_, index) =>
                                checkboxStates[`receiveUpdates-${index}`] || checkboxStates[`agreeToTerms-${index}`] || checkboxStates[`subscribeNewsletter-${index}`]
                              )
                            }

                            sx={{
                              bgcolor: isDarkMode ? "#1976d2" : "#1976d2",
                              color: "white",
                              "&:hover": {
                                bgcolor: isDarkMode ? "#1565c0" : "#1565c0",
                              },
                            }}
                          >
                            Update
                          </Button>
                        </Box>
                      </Box>
                    )}

                    {activeStep === 4 && (
                      <Button
                        onClick={handleUpdate}
                        variant="contained"
                        disabled={
                          !checkboxes.every((_, index) =>
                            checkboxStates[`receiveUpdates-${index}`] || checkboxStates[`agreeToTerms-${index}`] || checkboxStates[`subscribeNewsletter-${index}`]
                          )
                        }

                        sx={{
                          bgcolor: isDarkMode ? "#1976d2" : "#1976d2",
                          color: "white",
                          "&:hover": { bgcolor: isDarkMode ? "#1565c0" : "#1565c0" },
                          mt: 3,
                        }}
                      >
                        Update
                      </Button>
                    )}
                  </Grid>


                  <Box mt={3} display="flex" justifyContent="space-between">
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      variant="contained"
                      sx={{
                        bgcolor: isDarkMode ? "#6c757d" : "#d32f2f",
                        color: "white",
                        "&:hover": { bgcolor: isDarkMode ? "#5a6268" : "#b71c1c" },
                      }}
                    >
                      Back
                    </Button>
                    <Box flex="1 1 auto" />
                    <Button
                      onClick={() => handleNext(formik)}
                      variant="contained"
                      sx={{
                        bgcolor: isDarkMode ? "#1976d2" : "#1976d2",
                        color: "white",
                        "&:hover": { bgcolor: isDarkMode ? "#1565c0" : "#1565c0" },
                      }}
                      disabled={activeStep === 4 || (activeStep === 3 && !allChecked)}
                    >
                      Next
                    </Button>
                  </Box>



                  {/* Toast Notification */}
                  <Snackbar
                    open={openToast}
                    autoHideDuration={3000}
                    onClose={() => setOpenToast(false)}
                  >
                    <MuiAlert
                      onClose={() => setOpenToast(false)}
                      severity="success"
                      sx={{ width: "100%" }}
                    >
                      Profile successfully updated!
                    </MuiAlert>
                  </Snackbar>

                </Form>
              </>
            )}
          </Formik>


        </Paper>
      </Modal>
    </>
  );
};

export default OJTApplyForm;
function setSelectedValue(value: any) {
  throw new Error("Function not implemented.");
}


