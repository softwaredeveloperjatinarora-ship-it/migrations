// "use client";
// import { useState } from "react";
// import {
//   Button,
//   Stack,
//   Typography,
//   Alert,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   FormControl,
//   FormControlLabel,
//   Radio,
//   RadioGroup,
//   TextField,
//   Box,
// } from "@mui/material";
// import Link from "next/link";
// import Image from "next/image";
// import { Formik, Field, Form, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { submitVerification } from "../../../utils/resetpassword/verifyuser";
// import { confirmEmail } from "../../../utils/resetpassword/verifyemail";
// import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
// import Logo from "@/app/dashboard/(DashboardLayout)/layout/shared/logo/Logo";
// import CustomRadio from "@/app/components/forms/theme-elements/CustomRadio";

// interface ForgetPasswordValues {
//   userId: string;
//   age: string;
//   usertype: string;
// }

// interface ForgetPasswordProps {
//   error: string;
//   captchaVerified: boolean;
//   recaptchaToken: string;
//   openDialog: boolean;
//   selectedEmail: string;
// }

// // Validation Schema
// const validationSchema = Yup.object().shape({
//   userId: Yup.string().required('User ID is required'),
//   age: Yup.date().required('Date of birth is required'),
// });

// // Mock email list (Replace with API response)
// const maskedEmails = ["ab****yz@gmail.com", "xy****pq@yahoo.com"];

// export default function ForgetPassword() {
//   const [state, setState] = useState<ForgetPasswordProps>({
//     error: "",
//     captchaVerified: true,
//     recaptchaToken: "",
//     openDialog: false,
//     selectedEmail: "",
//   });

//   const initialValues: ForgetPasswordValues = {
//     userId: "",
//     age: "",
//     usertype:""

//   };

//   // Handle form submission
//   const handleSubmit = async (values: ForgetPasswordValues) => {

//  let finalUserId = values.userId;
//     const startsWithP = finalUserId.toUpperCase().startsWith("P");
//     const startsWithNumber = /^\d/.test(finalUserId);

//     // Logic
//     if (startsWithP) {
//       // userId already starts with P → submit as-is, hide radio group
//     } else if (startsWithNumber && values.usertype === "Parent") {
//       // Prepend "P" if Parent is selected and userId starts with number
//       finalUserId = "P" + finalUserId;
//     }

//     // Submit the updated userId
//     console.log("Submitted userId:", finalUserId);
//     console.log("usertype",values.usertype)
//     try {
//       // Convert date format from YYYY-MM-DD to DD/MM/YYYY
//       const [year, month, day] = values.age.split("-");
//       const formattedDate = `${day}/${month}/${year}`;

//       // Call the submitVerification API with formatted date
//       await submitVerification(values.userId, formattedDate);

//       // Open popup to select email
//       setState(prev => ({ ...prev, openDialog: true }));
//     } catch (error) {
//       setState(prev => ({ ...prev, error: "Verification failed. Please try again." }));
//     }
//   };

//   // Handle email selection
//   const handleEmailSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setState(prev => ({ ...prev, selectedEmail: event.target.value }));
//   };

//   // Handle email confirmation
//   const confirmEmailSelection = async () => {
//     try {
//       // Call the confirmEmail API with the selected email
//       await confirmEmail(state.selectedEmail);
//       setState(prev => ({ ...prev, openDialog: false }));
//     } catch (error) {
//       console.error("Error confirming email:", error);
//     }
//   };




//   return (
//     <>

//       <Logo />

//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={handleSubmit}
//       >
//         {({ isSubmitting }) => (
//           <Form>
//             <Stack mt={4} spacing={2}>
//               <Typography variant="h4" fontWeight="700">
//                 Forget Password
//               </Typography>

//               <Field
//                 name="userId"
//                 as={CustomTextField}
//                 label="Enter UserId"
//                 required
//                 fullWidth
//               />
//               <ErrorMessage name="userId">
//                 {(msg) => <Typography color="error">{msg}</Typography>}
//               </ErrorMessage>
//               <Box >
//                 <RadioGroup row aria-label="usertype" name="usertype.value" defaultValue="Student">
//                   <FormControlLabel value="Student" control={<CustomRadio />} label="Student" />
//                   <FormControlLabel value="Parent" control={<CustomRadio />} label="Parent" />
//                 </RadioGroup>
//               </Box>
//               <Field
//                 name="age"
//                 type="date"
//                 as={CustomTextField}
//                 required
//                 fullWidth

//               />
//               <ErrorMessage name="age">
//                 {(msg) => <Typography color="error">{msg}</Typography>}
//               </ErrorMessage>

//               {state.error && (
//                 <Alert severity="error" sx={{ color: "black" }}>
//                   {state.error}
//                 </Alert>
//               )}

//               <Button
//                 type="submit"
//                 color="primary"
//                 variant="contained"
//                 disabled={isSubmitting}
//               >
//                 Submit
//               </Button>

//               <Button
//                 color="primary"
//                 variant="contained"
//                 fullWidth
//                 component={Link}
//                 href="/login"
//               >
//                 Return To Login
//               </Button>
//             </Stack>
//           </Form>
//         )}
//       </Formik>

//       {/* Popup Dialog */}
//       <Dialog open={state.openDialog} onClose={() => setState(prev => ({ ...prev, openDialog: false }))}>
//         <DialogTitle>Select an Email</DialogTitle>
//         <DialogContent>
//           <FormControl component="fieldset">
//             <RadioGroup value={state.selectedEmail} onChange={handleEmailSelection}>
//               {maskedEmails.map((email, index) => (
//                 <FormControlLabel
//                   key={index}
//                   value={email}
//                   control={<Radio />}
//                   label={email}
//                 />
//               ))}
//             </RadioGroup>
//           </FormControl>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setState(prev => ({ ...prev, openDialog: false }))} color="secondary">
//             Cancel
//           </Button>
//           <Button
//             onClick={confirmEmailSelection}
//             color="primary"
//             disabled={!state.selectedEmail}
//           >
//             Confirm
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }



"use client";
import { useEffect, useState } from "react";
import {
  Button,
  Stack,
  Typography,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Box,
} from "@mui/material";
import Link from "next/link";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { submitVerification } from "../../../utils/resetpassword/verifyuser";
 
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
 
import CustomRadio from "@/app/components/forms/theme-elements/CustomRadio";
import { confirmEmail } from "@/utils/resetpassword/verifyemail";

interface ForgetPasswordValues {
  userId: string;
  age: string;
  usertype: string;
}

interface ForgetPasswordProps {
  error: string;
  captchaVerified: boolean;
  recaptchaToken: string;
  openDialog: boolean;
  selectedEmail: string;
}

const validationSchema = Yup.object().shape({
  userId: Yup.string().required("User ID is required"),
  age: Yup.date().required("Date of birth is required"),
});

const maskedEmails = ["ab****yz@gmail.com", "xy****pq@yahoo.com"];

export default function ForgetPassword() {
  const [state, setState] = useState<ForgetPasswordProps>({
    error: "",
    captchaVerified: true,
    recaptchaToken: "",
    openDialog: false,
    selectedEmail: "",
  });

  const initialValues: ForgetPasswordValues = {
    userId: "",
    age: "",
    usertype: "Student",
  };

  const handleSubmit = async (values: ForgetPasswordValues) => {
    let finalUserId = values.userId.trim();
    const startsWithP = finalUserId.toUpperCase().startsWith("P");


    const startsWithNumber = /^\d/.test(finalUserId);

    if (!startsWithP && startsWithNumber && values.usertype === "Parent") {
      finalUserId = "P" + finalUserId;
    }

    console.log("Submitted userId:", finalUserId);
    console.log("usertype:", values.usertype);

    try {
      const [year, month, day] = values.age.split("-");
      const formattedDate = `${day}/${month}/${year}`;

      await submitVerification(finalUserId, formattedDate);

      setState((prev) => ({ ...prev, openDialog: true }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Verification failed. Please try again.",
      }));
    }
  };

  const handleEmailSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, selectedEmail: event.target.value }));
  };

  const confirmEmailSelection = async () => {
    try {
      await confirmEmail(state.selectedEmail);
      setState((prev) => ({ ...prev, openDialog: false }));
    } catch (error) {
      console.error("Error confirming email:", error);
    }
  };

  return (
    <>
        

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => {
          const startsWithP = values.userId.trim().toUpperCase().startsWith("P");

          // Set usertype to Parent when userId starts with "P"
          useEffect(() => {
            if (startsWithP && values.usertype !== "Parent") {
              setFieldValue("usertype", "Parent");
            }
          }, [startsWithP, values.usertype, setFieldValue]);

          return (
            <Form>
              <Stack mt={1} spacing={2}>
                <Typography variant="h4" fontWeight="700">
                  Forget Password
                </Typography>

                <Field
                  name="userId"
                  as={CustomTextField}
                  label="Enter UserId"
                  required
                  fullWidth
                />
                <ErrorMessage name="userId">
                  {(msg) => <Typography color="error">{msg}</Typography>}
                </ErrorMessage>

                {/* Hide radio group if userId starts with P */}
                {!startsWithP && (
                  <Box sx={{ mt: 2 }}>
                    <RadioGroup
                      row
                      name="usertype"
                      value={values.usertype}
                      onChange={(e) => setFieldValue("usertype", e.target.value)}
                    >
                      <FormControlLabel
                        value="Student"
                        control={<CustomRadio />}
                        label="Student"
                      />
                      <FormControlLabel
                        value="Parent"
                        control={<CustomRadio />}
                        label="Parent"
                      />
                    </RadioGroup>
                  </Box>
                )}

                <Field
                  name="age"
                  type="date"
                  as={CustomTextField}
                  required
                  fullWidth
                />
                <ErrorMessage name="age">
                  {(msg) => <Typography color="error">{msg}</Typography>}
                </ErrorMessage>

                {state.error && (
                  <Alert severity="error" sx={{ color: "black" }}>
                    {state.error}
                  </Alert>
                )}

                <Button type="submit" color="primary" variant="contained">
                  Submit
                </Button>

                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  component={Link}
                  href="/login"
                >
                  Return To Login
                </Button>
              </Stack>
            </Form>
          );
        }}
      </Formik>


      {/* Email Selection Dialog */}
      <Dialog
        open={state.openDialog}
        onClose={() => setState((prev) => ({ ...prev, openDialog: false }))}
      >
        <DialogTitle>Select an Email</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <RadioGroup
              value={state.selectedEmail}
              onChange={handleEmailSelection}
            >
              {maskedEmails.map((email, index) => (
                <FormControlLabel
                  key={index}
                  value={email}
                  control={<Radio />}
                  label={email}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setState((prev) => ({ ...prev, openDialog: false }))
            }
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmEmailSelection}
            color="primary"
            disabled={!state.selectedEmail}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
