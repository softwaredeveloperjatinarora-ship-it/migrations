"use client";
import { useEffect, useState } from "react";
import {
  Button,
  Stack,
  TextField,
  Typography,
  Alert,
  Box,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { resetPassword } from "../../../utils/resetpassword/updatepassword";
import { useSearchParams, useRouter } from "next/navigation";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
 

interface ChangePassword {
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPassword() {

const Data = [
    { note: " Password must be at least 8 characters and must include at least one upper case letter, one lower case letter, one numeric digit and two special character(@$%^&+=). e.g 12aAA12$" },
    { note: "Users should not keep their UMS password as NAME@12345 or UID@12345 which can easily be breached. Your password should not contain such guessable pattern/personal information/repeated series (e.g. AAA or LPU@12345)" },
    { note: "Use of Special characters < , >, #, and ; is not allowed." },
    { note: " UMS password and wifi password should be strictly different with no similarity." },
    { note: "The Password should be kept Strictly confidential and should not be shared with anyone." },
    { note: "Password should not been series like 12345,123456 etc." },
  ]

  const [successMessage, setSuccessMessage] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const forbiddenPatterns = [
    /NAME@\d{5,}/i,
    /UID@\d{5,}/i,
    /12345+/,
    /LPU@\d{5,}/i,
    /AAA+/i,
  ];

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long!')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter!')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter!')
      .matches(/\d/, 'Password must contain at least one numeric digit!')
      .matches(
        /^(?=(.*[!@#$%^&+=]){2})/,
        'Password must include at least two special characters (@$%^&+=)!'
      )
      .test(
        'no-forbidden-chars',
        'Use of <, >, #, and ; is not allowed!',
        value => !/[<>#;]/.test(value || '')
      )
      .test(
        'no-easy-patterns',
        'Password contains easily guessable patterns!',
        value => !forbiddenPatterns.some(pattern => pattern.test(value || ''))
      ),
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('newPassword')], 'Passwords do not match!')
  });

  const handleSubmit = async (values: ChangePassword) => {
    try {
      await resetPassword({ password: values.newPassword, token });
      setSuccessMessage("Password changed successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 3000);
    } catch (error: any) {
      // Formik will handle this error through setFieldError
      throw error;
    }
  };

  return (
    <>
      {/* <Image
        src={"/images/backgrounds/ums_logo1.svg"}
        width={200}
        height={70}
        alt="ums"
      /> */}
       <Box sx={{marginTop:{lg:"-30px"}}}>

       
      </Box>

      <Formik
        initialValues={{
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Stack mt={0} spacing={2}>
              <Typography variant="h5" fontWeight="700">
                Change Password
              </Typography>

              <Field
                as={CustomTextField}
                name="newPassword"
                label="New Password"
                type="password"
                autoComplete="new-password"
                // sx={{ "& .MuiOutlinedInput-root": { borderRadius: 0 } }}
                error={touched.newPassword && Boolean(errors.newPassword)}
                helperText={touched.newPassword && errors.newPassword}
              />

              <Field
                as={CustomTextField}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
                // sx={{ "& .MuiOutlinedInput-root": { borderRadius: 0 } }}
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
              />

              {successMessage && <Alert severity="success">{successMessage}</Alert>}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap:1
                }}
              >
                <Button 
                  type="submit" 
                  fullWidth 
                  color="primary" 
                  variant="contained"
                  disabled={isSubmitting}
                >
                  Change Password
                </Button>

                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  component={Link}
                  href="/login"
                >
                  Return To Login Page
                </Button>
              </Box>

              <Box sx={{ height: { lg: "220px", sm: "100%" } }}>
                <Typography variant="h6">Note:-</Typography>
                {Data.map((item, index) => (

            <Box key={index}  sx={{marginLeft: "15px", fontSize: "12px", gap: 1, display: "flex" }}>
              <Box>
                <Icon icon="tabler-point-filled" style={{ fontSize: "12px" }} />
              </Box>

              <Typography variant="body2">
                {item.note}
              </Typography>
            </Box>

         ))}
              </Box>
            </Stack>
          </Form>
        )}
      </Formik>
    </>
  );
}