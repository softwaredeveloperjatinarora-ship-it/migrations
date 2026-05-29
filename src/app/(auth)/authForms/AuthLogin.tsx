 "use client";

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from "next/link";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import Backdrop from '@mui/material/Backdrop';
import Loading from '@/app/loading';
import Divider from '@mui/material/Divider';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';
import Script from 'next/script';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import OtpModal from './OtpModal';
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react"
import { setProfileData } from "@/store/profile/profileSlice";
import { getprofileAction } from '@/app/actions/DECAActions/DistanceExamination/ProfileDetails/getprofileAction';
import { RootState } from '@/store/store';
import { decryptDataforResponse, encryptData } from '@/app/api/services/auth/Encrptdecrpt';
import { setUsername } from '@/store/profile/EmployeeIdSlice';
// import { loginType } from '@/app/dashboard/DECA/(DashboardLayout)/DECAdashboard/types/auth/auth';
const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;


const AuthLogin = ({ title, subtitle, subtext }: any) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [otp, setOtp] = useState('');
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfile] = useState<any[]>([]); // Now it's an array
  const [loggedIn, setLoggedIn] = useState(false)
  const { data: session } = useSession()
  console.log("session",session)
  const username = useSelector((state: any) => state.user?.username);
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpenModal(false);
    router.push('/dashboard');
  }

  const handleLogin = async (values: { username: string, password: string }) => {
    setLoginError('');
    setCredentials({
      username: values.username,
      password: values.password
    });
    dispatch(setUsername(values.username || profileData[0]?.EmployeeCode));
    await fetchProfileData();
    setOpenModal(true); // Open OTP modal only
  };

  const fetchProfileData = async () => {

    setLoading(true);
    try {
      const formfields = {
        "EmpId": Number(credentials.username)
};

      let splitValue = String(session?.user?.token).split("NEXT2121ANG");
      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const response = await getprofileAction(Data);

      let apiData = response?.data;
      const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
      console.log("decryptedData", decryptedData)
      const parsedData = JSON.parse(decryptedData);
      setProfile(Array.isArray(parsedData) ? parsedData : [parsedData]);
      dispatch(setProfileData(Object.values(parsedData)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };
  const onSubmitOtp = async () => {
    setLoading(true);
    setOpen(true);

    const result = await signIn("credentials", {
      username: credentials.username,
      password: credentials.password,
      otp: otp,
      redirect: false
    });
    console.log(result)
    setLoading(false);
    setOpen(false);
    setOpenModal(false);
    console.log("result", result)
    if (result?.error) {
      setLoginError('Invalid credentials or OTP');
    } else {
      setLoggedIn(true)
      router.push('/dashboard/decadashboard');
    }
  };

  useEffect(() => {
    if (session?.user?.token) {
      fetchProfileData();
    }
  }, [session?.user?.token]);

  useEffect(() => {
    const initializeTurnstile = () => {
      if (window.turnstile) {
        window.turnstile.render('#turnstile-container', {
          sitekey: recaptchaSiteKey,
          callback: (token: string) => {
            setCaptchaToken(token);
          },
          'expired-callback': () => {
            setCaptchaToken(null);
          },
          'error-callback': () => {
            setCaptchaToken(null);
          }
        });
      }
    };

    if (window.turnstile) {
      initializeTurnstile();
    } else {
      window.onloadTurnstileCallback = initializeTurnstile;
    }

    return () => {
      if (window.turnstile) {
        window.turnstile.remove('#turnstile-container');
      }
    };
  }, []);


  return (
    <>
      <OtpModal
        openModal={openModal}
        handleClose={() => setOpenModal(false)}
        otp={otp}
        setOtp={setOtp}
        onSubmitOtp={onSubmitOtp}
        loading={loading}
      />

      {/* <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"
        strategy="afterInteractive"
      /> */}
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      {title && (
        <Typography fontWeight="700" variant="h3" mb={1} ml={{ lg: 3, xs: 0 }}>
          {title}
        </Typography>
      )}

      {subtext}

      <Box mt={3} >
        <Divider sx={{ ml: { lg: 3, xs: 0 }, mr: { lg: 3, xs: 0 } }}>
          <Typography
            component="span"
            color="textSecondary"
            variant="h6"
            fontWeight="400"
            position="relative"
            px={0}

          >
            Sign in
          </Typography>
        </Divider>
      </Box>

      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ values, errors, touched, isSubmitting }) => (
          <Form>
            <Stack>

              <CustomFormLabel htmlFor="username" sx={{ ml: { lg: 3 } }}>Username</CustomFormLabel>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

                <Field
                  as={CustomTextField}
                  id="username"
                  name="username"
                  variant="outlined"
                  sx={{ width: { xs: "100%", lg: "90%" } }}
                  value={values.username}
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                />
              </Box>
              <CustomFormLabel htmlFor="password" sx={{ ml: { lg: 3 } }}>Password</CustomFormLabel>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Field
                  as={CustomTextField}
                  id="password"
                  name="password"
                  type="password"
                  variant="outlined"
                  sx={{ width: { xs: "100%", lg: "90%" } }}
                  value={values.password}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
              </Box>

              <Box my={2} justifyContent="center" >
                <div id="turnstile-container" style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }} />
              </Box>

              <Stack
                justifyContent="space-between"
                direction={{ xs: 'column', sm: 'row' }}
                alignItems="center"
                my={0}
              >
                {/* <FormGroup>
                  <FormControlLabel
                    control={<CustomCheckbox defaultChecked />}
                    label="Remember on this Device"
                  />
                </FormGroup> */}
                {/* <Typography
                  component={Link}
                  href="/forgot-password"
                  fontWeight="500"
                  sx={{
                    textDecoration: "none",
                    color: "primary.main",
                    ml: { lg: 3 }
                  }}
                >
                  Forgot Password?
                </Typography> */}
              </Stack>

              {loginError && (
                <Typography color="error" variant="body2" mt={2} textAlign="center">
                  {loginError}
                </Typography>
              )}
            </Stack>

            <Box my={2} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                type="submit"
                // disabled={isSubmitting || loading || !captchaToken}
                disabled={isSubmitting || loading}
                sx={{ height: 40, width: { xs: "100%", lg: "90%" }, }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign In"
                )}
</Button>
            </Box>
            {subtitle}
          </Form>
        )}
      </Formik>

      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={open}
      >
        <Loading />
      </Backdrop>
    </>
  );
};

export default AuthLogin; 
