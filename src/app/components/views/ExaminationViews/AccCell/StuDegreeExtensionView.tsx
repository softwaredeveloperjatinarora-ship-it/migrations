"use client";
 
import { AppState, ProfileState } from "@/store/store";
import {
  Avatar,
  Box,
  Card,
  CardContent,
   Grid,
  Stack,
  Typography,
  useTheme,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Dialog,
} from "@mui/material";
import Image from "next/image";
import { useSelector } from "react-redux";
import { Stepper, Step, StepLabel  } from "@mui/material";
import {
  AssignmentTurnedIn,
  HourglassTop,
  DoneAll,
  Verified,
} from "@mui/icons-material";
import CancelIcon from '@mui/icons-material/Cancel';
import { useEffect, useState } from "react";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import ParentCard from "@/app/components/shared/ParentCard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { getStudentDetailsAction } from "@/app/actions/examination/AccCell/getstudentdetailsAction";
import { useSession } from "next-auth/react";
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import { StudentApplicationList, StudentDetails } from "@/app/api/interfaces/Examination/studentdegreeextensioninterface";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { insertStudentApplicationAction } from "@/app/actions/examination/AccCell/insertstudentapplicationAction";
import { Snackbar, Alert } from "@mui/material";
import { getStudentApplicationListAction } from "@/app/actions/examination/AccCell/getStudentApplicationListAction";
import StuDegreeExtensionApplication from "./popup/StuDegreeExtensionApplication";
import Breadcrumb from "@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
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
const StuDegreeExtension = () => {

  const [loading, setLoading] = useState<{button: boolean; normal: boolean}>({button: false, normal: false});
  const { data: session } = useSession();
   const [studentDetails, setStudentDetails] = useState<StudentDetails[] | null >(null);
   const [studentApplicationList, setStudentApplicationList] = useState<StudentApplicationList[] | null >(null);
  const customizer = useSelector((state: AppState) => state.customizer);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');
const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const theme = useTheme();
  const borderColor = theme.palette.divider;

  useEffect(()=>{
         fetchStudentDetails();
         fetchStudentApplications()
  },[])
  
  const fetchStudentDetails = async () => {
    try {
      setLoading({button:false,normal:true});
      const res = await getStudentDetailsAction(
      );
      let splitValue = String(session?.user?.token).split("NEXT2121ANG");
      const decData = decryptDataforResponse(res.ApiData, splitValue[1]);
      const parsedData = JSON.parse(decData);
       setStudentDetails(parsedData);
    } catch (error) {}
    finally  { setLoading({button:false,normal:false});}
  };

  const fetchStudentApplications = async () => {
    try {
      setLoading({button:false,normal:true});
      const res = await getStudentApplicationListAction();
      let splitValue = String(session?.user?.token).split("NEXT2121ANG");
      const decData = decryptDataforResponse(res.ApiData, splitValue[1]);
      const parsedData = JSON.parse(decData);
       setStudentApplicationList(parsedData)
      //  console.log(parsedData)
    } catch (error) {}
    finally  { setLoading({button:false,normal:false});}
  };
  
  async function submitApplication(values:{StudentMobile:string,ParentContact:string,StudentEmail:string,ExtendedYear:string}) {
    try {
      setLoading({button:true,normal:false});
       const formfields = {
          Vid: 0,
          ContactNo: values.StudentMobile,
          Email: values.StudentEmail,
          ParentContactNo: values.ParentContact,
          FileName: "application_form.pdf",
          ExtendedYear: values.ExtendedYear.toString(),
        };
        if (!session?.user?.token) {
          throw new Error("Token is undefined");
        }
        let splitValue = session.user.token.split("NEXT2121ANG"); // delimiter
        const credentialsJson = JSON.stringify(formfields);
        //EncrytData
        const { Data } = encryptData(credentialsJson, splitValue[1]);

      const res = await insertStudentApplicationAction(Data);
      if (res.status === 'success' && res.ApiData) {
        const splitValue = String(session?.user?.token).split("NEXT2121ANG");
        const decData = decryptDataforResponse(res.ApiData, splitValue[1]);
        setSnackbarSeverity("success");
        setSnackbarMessage("Application submitted successfully!");
        setSnackbarOpen(true); 
        fetchStudentDetails();
        fetchStudentApplications();

      } else {
        setSnackbarSeverity('error');
        setSnackbarMessage('Something went wrong. Please try again.');
        setSnackbarOpen(true);
      }
    } catch (error) { }
    finally  { setLoading({button:false,normal:false});}
  }

  const validationSchema = Yup.object().shape({
    StudentMobile: Yup.string()
      .matches(/^\d{10}$/, 'Enter a valid 10-digit mobile number')
      .required('Mobile number is required'),
  
    ParentContact: Yup.string()
      .matches(/^\d{10}$/, 'Enter a valid 10-digit parent number')
      .required('Parent contact is required'),
  
    StudentEmail: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
  
    agreeToTerms: Yup.boolean().oneOf([true], 'You must accept the terms'),
  });

  const profilee = useSelector((state: ProfileState) => state.profile) as {
    profileData: {
      name: string
    }[];
  };


  const BCrumb = [
    {
      to: "/dashboard",
      title: "Home",
    },
    {
      title: "Degree Extension",
    },
  ];
  const stepsTrack = [
    { label: "Submitted", icon: <AssignmentTurnedIn /> },
    { label: "Under Review", icon: <HourglassTop /> },
    { label: "Approved", icon: <DoneAll /> },
    { label: "Verified", icon: <Verified /> },
  ];
  if (studentApplicationList?.[studentApplicationList.length-1]?.Status === '0') {
    stepsTrack.push({ label: "Rejected", icon: <CancelIcon /> }); // Add the "Rejected" step if Status is 4
  }
  const statusFromAPI = studentApplicationList?.[studentApplicationList.length-1]?.Status || '5'; 
  const activeStepStatus = parseInt(statusFromAPI); // convert to number
  const completedSteps: Record<number, boolean> = Array.from({ length: activeStepStatus }, (_, i) => i).reduce(
    (acc, curr) => ({ ...acc, [curr]: true }),
    {} as Record<number, boolean>
  );
  return (
    <>
      {loading.normal ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Breadcrumb title="Degree Extension" items={BCrumb} />
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 12, md: 4 }} sx={{ display: "flex" }}>
              <Card
                sx={{
                  padding: 0,
                  border: !customizer.isCardShadow
                    ? `1px solid ${borderColor}`
                    : "none",
                  overflow: "hidden",
                  backgroundColor: "background.paper",
                }}
                elevation={customizer.isCardShadow ? 9 : 0}
                variant={!customizer.isCardShadow ? "outlined" : undefined}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar
                      src="/images/profile/user3.jpg"
                      sx={{
                        width: 64,
                        height: 64,
                        border: "2px solid",
                        borderColor: "info.main",
                      }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {profilee.profileData[0]?.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        Application Summary
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    mt={3}
                    p={2}
                    borderRadius={2}
                    bgcolor="info.light"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    onClick={() => {
                      if(studentApplicationList)
                      handleOpen();
                     
                    }}
                  >
                    
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        sx={{
                          bgcolor: "info.main",
                          width: 36,
                          height: 36,
                        }}
                      >
                        <Image
                          src="/images/svgs/icon-idea.svg"
                          alt="icon"
                          width={20}
                          height={20}
                        />
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight={500}>
                        Applications Submitted
                      </Typography>
                    </Box>

                    <Typography
                      variant="h5"
                      fontWeight={700}
                      color="warning.main"
                      sx={{ minWidth: "40px", textAlign: "right" }}
                    >
                      {studentApplicationList?.length?studentApplicationList.length:0}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 8 }} sx={{ display: "flex" }}>
              <Card
                sx={{
                  padding: 0,
                  border: !customizer.isCardShadow
                    ? `1px solid ${borderColor}`
                    : "none",
                  position: "relative",
                }}
                elevation={customizer.isCardShadow ? 9 : 0}
                variant={!customizer.isCardShadow ? "outlined" : undefined}
              >
                <Image
                  src="/images/backgrounds/top-info-shape.png"
                  alt="Background Shape"
                  className="top-img"
                  width={59}
                  height={81}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    zIndex: 0,
                    opacity: 0.2,
                  }}
                />

                <CardContent sx={{ position: "relative", zIndex: 1 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                    flexWrap="wrap"
                    gap={2}
                  >
                    {/* Left: Title with Icon */}
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        sx={{
                          bgcolor: "info.main",
                          width: 48,
                          height: 48,
                        }}
                      >
                        <Image
                          src="/images/svgs/icon-idea.svg"
                          alt="icon"
                          width={24}
                          height={24}
                        />
                      </Avatar>
                      <Typography variant="h6" fontWeight={600}>
                        Application Status
                      </Typography>
                    </Box>

                    {/* Right: Applications Summary */}
                    <Box
                      px={2}
                      py={1.5}
                      borderRadius={2}
                      bgcolor="info.light"
                      display="flex"
                      alignItems="center"
                      sx={{
                        minWidth: 180,
                        boxShadow: 1,
                      }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        flexGrow={1}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "info.main",
                            width: 32,
                            height: 32,
                          }}
                        >
                          <CalendarMonthIcon
                            fontSize="small"
                            sx={{ color: "#fff" }}
                          />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            Submission Date
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            color="warning.main"
                          >
                            {studentApplicationList?.length
                              ? 
                                  studentApplicationList[
                                    studentApplicationList.length - 1
                                  ]?.EntryDate
                                
                              : "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* <Stack direction="row" justifyContent="space-between" mb={2}>
                <Typography variant="h6" fontWeight={600}>
                  Application Status
                </Typography>
              </Stack> */}
                  {/* Application Info Block */}

                  <Stepper
                    activeStep={activeStepStatus}
                    alternativeLabel={false}
                    sx={{ mt: 5 }}
                  >
                    {stepsTrack.map((step, index) => (
                      <Step key={index} completed={!!completedSteps[index]}>
                        <StepLabel
                          icon={step.icon}
                          sx={{
                            ...(index === activeStepStatus && {
                              ".MuiStepLabel-label": {
                                color: "black", // or theme.palette.text.primary
                                fontWeight: "bold",
                              },
                            }),
                          }}
                        >
                          {step.label}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ParentCard title="Application Form">
                <Formik
                  enableReinitialize
                  initialValues={{
                    Vid: 0,
                    FileName: "testing.pdf",
                    StudentMobile: studentDetails?.[0]?.StudentMobile || "",
                    ParentContact: studentDetails?.[0]?.ParentContact || "",
                    StudentEmail: studentDetails?.[0]?.StudentEmail || "",
                    ExtendedYear: studentDetails?.[0]?.ExtendedYear || "0",
                    agreeToTerms: false,
                  }}
                  validationSchema={validationSchema}
                  onSubmit={async () => {}}
                >
                  {({
                    values,
                    handleChange,
                    touched,
                    errors,
                    setFieldValue,
                    validateForm,
                  }) => (
                    <Form>
                      <Box width="100%" mt={-4}>
                        <CustomFormLabel htmlFor="StudentMobile">
                          Contact No
                        </CustomFormLabel>
                        <CustomTextField
                          id="StudentMobile"
                          name="StudentMobile"
                          fullWidth
                          value={values.StudentMobile}
                          onChange={handleChange}
                          error={
                            touched.StudentMobile &&
                            Boolean(errors.StudentMobile)
                          }
                          helperText={
                            touched.StudentMobile && errors.StudentMobile
                          }
                        />

                        <CustomFormLabel htmlFor="ParentContact">
                          Parent No
                        </CustomFormLabel>
                        <CustomTextField
                          id="ParentContact"
                          name="ParentContact"
                          fullWidth
                          value={values.ParentContact}
                          onChange={handleChange}
                          error={
                            touched.ParentContact &&
                            Boolean(errors.ParentContact)
                          }
                          helperText={
                            touched.ParentContact && errors.ParentContact
                          }
                        />

                        <CustomFormLabel htmlFor="StudentEmail">
                          Email ID
                        </CustomFormLabel>
                        <CustomTextField
                          id="StudentEmail"
                          name="StudentEmail"
                          type="email"
                          fullWidth
                          value={values.StudentEmail}
                          onChange={handleChange}
                          error={
                            touched.StudentEmail && Boolean(errors.StudentEmail)
                          }
                          helperText={
                            touched.StudentEmail && errors.StudentEmail
                          }
                        />

                        <CustomFormLabel htmlFor="applicationFile">
                          Upload Application Form
                        </CustomFormLabel>
                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<CloudUploadIcon />}
                          sx={{ mb: 2 }}
                        >
                          Upload File
                          <VisuallyHiddenInput
                            type="file"
                            name="applicationFile"
                            onChange={(event) => {
                              const file = event.currentTarget.files?.[0];
                              setFieldValue("applicationFile", file);
                            }}
                          />
                        </Button>

                        <Box display="flex" alignItems="center">
                          <Checkbox
                            name="agreeToTerms"
                            checked={values.agreeToTerms}
                            onChange={handleChange}
                          />
                          <Typography variant="subtitle1">
                            I hereby agree to the terms and consent to submit
                            the application.
                          </Typography>
                        </Box>
                        {touched.agreeToTerms && errors.agreeToTerms && (
                          <Typography color="error" variant="caption">
                            {errors.agreeToTerms}
                          </Typography>
                        )}
                        <Divider />
                        <Stack
                          direction="row"
                          justifyContent="flex-start"
                          mt={1}
                        >
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={
                              !studentDetails ||
                              studentDetails.length === 0 ||
                              studentDetails[0]?.ApplicationSubmitted ||
                              loading.button
                            }
                            onClick={async () => {
                              const errors = await validateForm();
                              if (Object.keys(errors).length === 0 ) {
                                await submitApplication(values);
                              } else {
                              }
                            }}
                          >
                            {loading.button ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              "Submit"
                            )}
                          </Button>
                        </Stack>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </ParentCard>
            </Grid>
          </Grid>
        </>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Hide after 6 seconds
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Position at the bottom-center
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

       <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
             <StuDegreeExtensionApplication
                open={open}
                handleClose={handleClose}
                 applicationList={studentApplicationList}
              /> 
     </Dialog>
    </>
  );
};

export default StuDegreeExtension;
