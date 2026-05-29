"use client";
import { useState } from "react";
import { Button, Stack, TextField, Typography, Alert, useTheme, useMediaQuery, Theme, Card, Grid, Box } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { AppState, ProfileState } from "../../../../store/store";
import { getchangePasswordAction } from "../../../actions/changepasswordAction/getchangepasswordAction";
import { useSession } from "next-auth/react";
import { decryptDataforResponse, encryptData } from "../../../api/services/auth/Encrptdecrpt";
import Breadcrumb from "@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Logo from "@/app/dashboard/staff/(DashboardLayout)/layout/shared/logo/Logo";

interface ChangePasswordValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const BCrumb = [
  {
    to: "/dashboard",
    title: "Home",
    icon: "ic:baseline-home", // Optional
  },
  {
    title: "Change password",
  },
];

// Enhanced password validation function
const validatePassword = (password: string) => {
  const errors = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must include at least one uppercase letter.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must include at least one lowercase letter.");
  }
  if (!/\d/.test(password)) {
    errors.push("Password must include at least one digit.");
  }
  if (!/[@$%^&+=]/.test(password)) {
    errors.push("Password must include at least one special character (@$%^&+=).");
  }
  if (/[<>#;]/.test(password)) {
    errors.push("Special characters <, >, #, and ; are not allowed.");
  }
  const simplePatterns = [
    /^(\w+)@12345$/, // NAME@12345 or UID@12345
    /^(\d{5,})$/, // 12345, 123456, etc.
    /(.)\1{2,}/, // AAA, repeated characters
    /LPU@12345/, // Specific blocked pattern
  ];
  if (simplePatterns.some((pattern) => pattern.test(password))) {
    errors.push("Password contains a weak or easily guessable pattern.");
  }

  return errors.length > 0 ? errors.join(" ") : null;
};

export default function ChangePassword() {
  const { data: session } = useSession();
  const profilee = useSelector((state: ProfileState) => state.profile) as {
    profileData: {
      studentUid: number;
    }[];
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const studentUid = profilee.profileData[0]?.studentUid || 0;
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));
  const customizer = useSelector((state: AppState) => state.customizer);

  const validationSchema = Yup.object({
    oldPassword: Yup.string().required("Old password is required"),
    newPassword: Yup.string()
      .required("New password is required")
      .test("password-validation", "Invalid password", (value) => {
        const error = validatePassword(value || "");
        return error === null;
      }),
    confirmPassword: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("newPassword")], "Passwords must match"),
  });

  const handleSubmit = async (values: ChangePasswordValues, { setSubmitting }: any) => {
    try {
      setSubmitError("");
      setSubmitSuccess("");
      setLoading(true);

      const formfields = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      };

      if (!session || !session.user || !session.user.token) {
        throw new Error("Session or token is missing");
      }

      let splitValue = session.user.token.split("NEXT2121ANG");
      const credentialsJson = JSON.stringify(formfields);

      // Encrypt the data
      const { Data } = encryptData(credentialsJson, splitValue[1]);

      const response = await getchangePasswordAction(Data);
      let apiData = response.ApiData;
      const decryptedData = decryptDataforResponse(apiData, splitValue[1]);

      if (response.status === "success") {
        setSubmitSuccess("Password changed successfully!");
      } else {
        setSubmitError(response.message || "Failed to change password");
      }
    } catch (error) {
      setSubmitError("Failed to change password. Please try again.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumb title="change password" items={BCrumb}  titleIcon="material-symbols:change-circle" />
      <Card
        sx={{
          // background: "transparent",
          boxShadow: "none",
          border: "none",
        }}
      >
        <Grid container spacing={4} alignItems="center">
          {lgUp && (
            <Grid size={{ xs: 12, sm: 6, lg: 6 }}
               
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                src="/images/backgrounds/seal.svg"
                alt="Seal Logo"
                width={150}
                height={150}
              />

              <Box
                sx={{
                  // backgroundColor: "white",
                  padding: "40px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  textAlign: "center",
                  maxWidth: "80%",
                  mt: 2,
                  border:"1px solid white"
                }}
              >
                <Typography variant="h4" fontWeight="bold">
                  Welcome to LPU - UMS
                </Typography>
                <Typography variant="body1" color="textSecondary" mt={1}>
                  A smart home-grown web-based ERP solution with all
                  possible features ranging from Learning Management
                  System to e-Governance.
                </Typography>
              </Box>

              <Image
                src="/images/backgrounds/qr-code.png"
                alt="QR Code"
                width={120}
                height={120}
                style={{ marginTop: "18px" }}
              />
              <Typography variant="h5" sx={{ mt: 2 }}>
                Download Our Official App
              </Typography>
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: 12, lg: 6 }}  >
            <Box display="flex" justifyContent="center" width="100%">
              <Box sx={{ width: "100%", maxWidth: "400px" }}>
                <Formik
                  initialValues={{
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, errors, touched }) => (
                    <Form>
                      <Stack mt={2} spacing={2}>
                        <Stack spacing={2} alignItems="center">
                        <Logo />

                          <Typography variant={isMobile ? "h6" : "h5"} fontWeight="700">
                            Change Password
                          </Typography>

                          <Typography variant="body1" fontWeight="600">
                            UID: {studentUid}
                          </Typography>
                        </Stack>

                        <Field
                          as={TextField}
                          fullWidth
                          label="Old Password"
                          type="password"
                          name="oldPassword"
                          autoComplete="current-password"
                          // sx={{ "& .MuiOutlinedInput-root": { borderRadius: 0 } }}
                          error={touched.oldPassword && Boolean(errors.oldPassword)}
                          helperText={<ErrorMessage name="oldPassword" />}
                        />

                        <Field
                          as={TextField}
                          fullWidth
                          label="New Password"
                          type="password"
                          name="newPassword"
                          autoComplete="new-password"
                          // sx={{ "& .MuiOutlinedInput-root": { borderRadius: 0 } }}
                          error={touched.newPassword && Boolean(errors.newPassword)}
                          helperText={<ErrorMessage name="newPassword" />}
                        />

                        <Field
                          as={TextField}
                          fullWidth
                          label="Confirm Password"
                          type="password"
                          name="confirmPassword"
                          autoComplete="new-password"
                          // sx={{ "& .MuiOutlinedInput-root": { borderRadius: 0 } }}
                          error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                          helperText={<ErrorMessage name="confirmPassword" />}
                        />

                        {submitError && <Alert severity="error">{submitError}</Alert>}
                        {submitSuccess && <Alert severity="success">{submitSuccess}</Alert>}

                        <Button
                          type="submit"
                          color="primary"
                          variant="contained"
                          disabled={isSubmitting || loading}
                        >
                          {loading ? "Processing..." : "Change Password"}
                        </Button>

                        <Button color="primary" variant="contained" component={Link} href="/dashboard">
                          Return To Home Page
                        </Button>
                      </Stack>
                    </Form>
                  )}
                </Formik>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}