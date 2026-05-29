
"use client";

import React, { useState} from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Grid,
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
  FormControl,
  FormGroup,
  FormHelperText,
  Radio,
  Alert,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { ProfileState } from "@/store/store";
import { useSelector } from "@/store/hooks";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as yup from 'yup';
import { Form, Formik } from "formik";
import OJTAcademicDetails from "./OJTAcademicDetails";
import CloseIcon from "@mui/icons-material/Close";
import * as Yup from "yup";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";


interface OJTApplyProps {
  isOpen: boolean;
  closeModal: (data?: boolean) => void;
  currentItem: any
}

const validationSchema = yup.object({
  color: yup.string().required('Required'),
});



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

const OJTApplyUni: React.FC<OJTApplyProps> = ({ isOpen, closeModal, currentItem }) => {
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
  const [ErroropenToast, setErrorOpenToast] = useState(false);
  const [openToast, setOpenToast] = useState(false);

  // const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

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
    offerProofType: '',
    packageMentioned: '',
    offerLetter: null as File | null,
    nocFile: null as File | null,
    joiningdate: '',
    Completiondate: ''
  };

  const Step1ValidationSchema = Yup.object().shape({
    offerProofType: Yup.string().required("Offer proof type is required"),
    packageMentioned: Yup.string().required("Package mention status is required"),
    offerLetter: Yup.mixed().required("Offer letter is required"),
    nocFile: Yup.mixed().required("NOC file is required"),
    joiningdate: Yup.mixed().required("date of joing is required"),
    Completiondate: Yup.mixed().required("date of joing is required"),
  });

  const handleNext = async (formik: any) => {
    // Only validate on step 1, where you have the fields to check
    if (activeStep === 1) {
      const errors = await formik.validateForm();

      // Mark all fields as touched so validation errors are visible
      formik.setTouched({
        offerProofType: true,
        packageMentioned: true,
        offerLetter: true,
        nocFile: true,
        joiningdate: true,
        Completiondate: true
      });

      if (Object.keys(errors).length === 0) {
        setActiveStep((prev) => prev + 1);
      } else {
        return; // Don't move to next step
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const [show, setShow] = useState(true);
  const handleClose = () => {
    closeModal(false)
    setShow(!show);
  };

  const [offerProofType, setOfferProofType] = useState("");
  const [packageMentioned, setPackageMentioned] = useState("");

  const [fileName, setFileName] = useState('');

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };
  const [noc, setNoc] = useState('');
  const handlenocChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setNoc(file.name);
    }
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
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Optional: You can set a max width for the modal
        "& .MuiPaper-root": {
          width: "1000px", // or any width you prefer
          // optional max width
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
          Offer Through University
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
            color: 'Black',
            backgroundColor: "lightgrey",
            borderRadius: "50%", // Makes it circular
          }}
        >
          <CloseIcon sx={{ width: "15px", height: "15px" }} />
        </Box>


        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          <Step>
            <StepLabel>Academic Information</StepLabel>
          </Step>
          <Step>
            <StepLabel>Offer Details</StepLabel>
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
                  {activeStep === 0 && <OJTAcademicDetails />}

                  {activeStep === 1 && (
                    <>
                      <Grid size={{ xs: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          Company Name
                        </Typography>
                        <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                          {currentItem.company}
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          Offer Type
                        </Typography>

                        <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                          {currentItem.drivetype
                          }
                        </Typography>

                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          Offer Source
                        </Typography>

                        <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                          {currentItem.drivetype
                          }
                        </Typography>

                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          Offer Proof Type
                        </Typography>

                        <FormControl
                          sx={{ width: "100%" }}
                          error={Boolean(formik.touched.offerProofType && formik.errors.offerProofType)}
                        >
                          <Box>
                            <FormControlLabel
                              value="email"
                              label="E-mail"
                              name="offerProofType"
                              control={
                                <Radio
                                  checked={formik.values.offerProofType === "email"}
                                  onChange={formik.handleChange}
                                />
                              }
                            />
                            <FormControlLabel
                              value="letter"
                              label="Offer Letter"
                              name="offerProofType"
                              control={
                                <Radio
                                  checked={formik.values.offerProofType === "letter"}
                                  onChange={formik.handleChange}
                                />
                              }
                            />
                          </Box>

                          <FormHelperText>
                            {formik.touched.offerProofType && formik.errors.offerProofType}
                          </FormHelperText>
                        </FormControl>

                      </Grid>

                      <Grid size={{ xs: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          Package Mentioned on Offer Letter
                        </Typography>

                        <FormControl
                          sx={{ width: "100%" }}
                          error={Boolean(formik.touched.packageMentioned && formik.errors.packageMentioned)}
                        >
                          <Box>
                            <FormControlLabel
                              value="yes"
                              label="Yes"
                              name="packageMentioned"
                              control={
                                <Radio
                                  checked={formik.values.packageMentioned === "yes"}
                                  onChange={formik.handleChange}
                                />
                              }
                            />
                            <FormControlLabel
                              value="no"
                              label="No"
                              name="packageMentioned"
                              control={
                                <Radio
                                  checked={formik.values.packageMentioned === "no"}
                                  onChange={formik.handleChange}
                                />
                              }
                            />
                          </Box>

                          <FormHelperText>
                            {formik.touched.packageMentioned && formik.errors.packageMentioned}
                          </FormHelperText>
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
                          // fullWidth
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
                          // fullWidth
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

                    </>
                  )}

                  {activeStep === 2 && (
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

                      <Box display="flex" justifyContent="center" mt={3}>
                        <Button
                          onClick={handleUpdate}
                          variant="contained"
                          disabled={
                            !checkboxes.every(({ name }, index) => checkboxStates[`${name}-${index}`])
                          }
                          sx={{
                            bgcolor: "#1976d2",
                            color: "white",
                            "&:hover": {
                              bgcolor: "#1565c0",
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
                        !checkboxes.every(({ name }, index) => checkboxStates[`${name}-${index}`])
                      }
                      sx={{
                        bgcolor: "#1976d2",
                        color: "white",
                        "&:hover": {
                          bgcolor: "#1565c0",
                        },
                      }}
                    >
                      Update
                    </Button>
                  )}
                </Grid>
              </Form>

              {/* Step Navigation Buttons */}
              <Box mt={3} display="flex" justifyContent="space-between">
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="contained"
                  sx={{
                    bgcolor: "#6c757d",
                    color: "white",
                    "&:hover": { bgcolor: "#5a6268" },
                  }}
                >
                  Back
                </Button>

                <Box flex="1 1 auto" />

                <Button
                  onClick={() => handleNext(formik)}
                  variant="contained"
                  sx={{
                    bgcolor: "#1976d2",
                    color: "white",
                    "&:hover": { bgcolor: "#1565c0" },
                  }}
                  disabled={activeStep === 3 || (activeStep === 2 && !allChecked)}
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
            </>
          )}
        </Formik>



        {/* </Box> */}

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
      </Paper>
    </Modal>
    </>
  );
};

export default OJTApplyUni;
function setSelectedValue(value: any) {
  throw new Error("Function not implemented.");
}
