"use client";
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { useSelector } from "react-redux";
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import { useSession } from "next-auth/react";
// Icons
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { IconX } from '@tabler/icons-react';
import { getSchoolStaffAction } from '@/app/actions/DECAActions/DistanceExamination/schoolStaff/getSchoolStaff';
import { addStaffAction } from '@/app/actions/DECAActions/DistanceExamination/schoolStaff/addSchoolStaff';

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required").min(3, "Name must be at least 3 characters"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
});

const FVOnLeave = ({ reloadContactList }: { reloadContactList?: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [duplicateError, setDuplicateError] = useState('');
  const centerNumber = useSelector((state: any) => state.center.centerNumber)
  const [response, setResponse] = useState<any>(null);
  const { data: session } = useSession();
  const [existingContacts, setExistingContacts] = useState<any[]>([])
  const fetchSchoolStaff = async () => {
    try {
        if (!session?.user?.token) {
        console.warn("Session or token missing during fetch");
        return;
      } ``

      const splitValue = session.user?.token.split("NEXT2121ANG");

      const formfields = {
        CenterNo: centerNumber,
      };

      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);

      const response = await getSchoolStaffAction(Data);
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);

      let parsedData;
      parsedData = JSON.parse(decryptedData);
      setExistingContacts(parsedData);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching school staff:", error);
      setLoading(false);
    }
  };
  
  const checkForDuplicates = (name: string, phone: string) => {
    if (!existingContacts || existingContacts.length === 0) return null;

    // Check for duplicates with exact name match (case insensitive)
    const nameMatch = existingContacts?.find(
      contact => contact.Name && contact.Name.toLowerCase() === name.toLowerCase()
    );

    // if (nameMatch) {
    //   return `A staff member with the name "${name}" already exists.`;
    // }

    // Check for duplicates with exact phone match
    const phoneMatch = existingContacts.find(
      contact => contact.PhoneNo && contact.PhoneNo === phone
    );

    if (phoneMatch) {
      return `A staff member with the phone number "${phone}" already exists.`;
    }

    return null;
  };

  const username = useSelector((state: any) => state.user?.username);
  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      // Check for duplicates
      const duplicateError = checkForDuplicates(values.name, values.phone);

      if (duplicateError) {
        setDuplicateError(duplicateError);
        return;
      }

      setLoading(true);
      setDuplicateError('');

      try {
        if (!session?.user?.token) {
          console.warn("Session or token missing during fetch");
          return;
        }

        const splitValue = session.user?.token.split("NEXT2121ANG");

        const formfields = {
          CenterNo: centerNumber,
          Name: values.name,
          PhoneNo: values.phone,
          AddedBy: username
        };

        const credentialsJson = JSON.stringify(formfields);
        const { Data } = encryptData(credentialsJson, splitValue[1]);

        const response = await addStaffAction(Data);

        setLoading(false);
        if (response?.data) {
          setSuccessDialog(true);
          resetForm();
          // Reload contact list immediately
          if (typeof reloadContactList === 'function') {
            reloadContactList();
          }
        } else {
          setErrorMessage(response?.message || 'Failed to add staff. Please try again.');
          setErrorDialog(true);
        }

      } catch (error) {
        setLoading(false);
        console.error('Error submitting form:', error);
        setErrorMessage('An unexpected error occurred. Please try again.');
        setErrorDialog(true);
      }
    }
  });

  // Reset duplicate error when input changes
  useEffect(() => {
    if (duplicateError) {
      setDuplicateError('');
    }
  }, [formik.values.name, formik.values.phone]);

  useEffect(() => {
    fetchSchoolStaff()
  }, [])
  const handleCloseSuccessDialog = () => {
    setSuccessDialog(false);
    // Reload contact list when dialog is closed
    if (typeof reloadContactList === 'function') {
      reloadContactList();
    }
  };

  const handleCloseErrorDialog = () => {
    setErrorDialog(false);
  };

  return (
    <>
      {/* Success Dialog */}
      <Dialog
        open={successDialog}
        onClose={handleCloseSuccessDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleOutlineIcon color="success" />
            <Typography variant="h6">Success</Typography>
          </Box>
          <IconButton edge="end" color="inherit" onClick={handleCloseSuccessDialog} aria-label="close">
            <IconX size={18} />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Typography>Staff added successfully</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button onClick={handleCloseSuccessDialog} color="primary" variant="contained" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
      <Dialog
        open={errorDialog}
        onClose={handleCloseErrorDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ErrorOutlineIcon color="error" />
            <Typography variant="h6">Error</Typography>
          </Box>
          <IconButton edge="end" color="inherit" onClick={handleCloseErrorDialog} aria-label="close">
            <IconX size={18} />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Typography>{errorMessage}</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button onClick={handleCloseErrorDialog} color="primary" variant="contained" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={1} marginTop="-13px">
          {duplicateError && (
            <Alert
              severity="error"
              sx={{
                mb: 1,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderRadius: 1,

              }}
            >
              {duplicateError}
            </Alert>
          )}

          <Box sx={{ mt: 0 }}>
            <CustomFormLabel>Staff Name</CustomFormLabel>
            <CustomTextField
              id="bl-name"
              name="name"
              placeholder="Enter Name"
              fullWidth
              value={formik.values.name}
              onChange={(e: any) => {
                const value = e.target.value;
                // Allow only letters and spaces
                if (/^[A-Za-z\s]*$/.test(value)) {
                  formik.setFieldValue("name", value);
                }
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
            />

            {formik.touched.name && formik.errors.name && (
              <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                {formik.errors.name}
              </Typography>
            )}
          </Box>

          <Box>
            <CustomFormLabel>Phone Number</CustomFormLabel>
            <CustomTextField
              id="bl-phone"
              name="phone"
              placeholder="10-digit number"
              fullWidth
              value={formik.values.phone}
              onChange={(e: any) => {
                const value = e.target.value;
                // Allow only digits (0–9)
                if (/^\d*$/.test(value)) {
                  formik.setFieldValue("phone", value);
                }
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
            />
            {formik.touched.phone && formik.errors.phone && (
              <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                {formik.errors.phone}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>



            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>

              <Button
                variant="outlined"
                color="error"
                onClick={formik.handleReset}
                startIcon={<CancelIcon />}
                disabled={loading}
              >
                Reset
              </Button>

              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
                sx={{ px: 3 }}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </form>
    </>
  );
};

export default FVOnLeave;