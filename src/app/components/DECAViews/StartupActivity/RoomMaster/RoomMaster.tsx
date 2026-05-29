"use client";
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { Box, Button, Stack, Snackbar, Alert, CircularProgress, Typography } from '@mui/material';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { useDispatch, useSelector } from 'react-redux';
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import { useSession } from "next-auth/react";
import { setRooms } from '@/store/roomMaster/roomsSlice';
import { getRoomsAction } from '@/app/actions/DECAActions/DistanceExamination/roomMaster/getRooms';
import { addRoomsAction } from '@/app/actions/DECAActions/DistanceExamination/roomMaster/addRoom';


interface FormValues {
  number: string;
  row: string;
  column: string;
}

interface Room {
  id: string;
  roomNo: string;
  row: number;
  col: number;
  centerNo: string | null;
  addBy: string | null;
  isActive: string;
  RoomNo?: string
}

const RoomMaster: React.FC = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const centerNumber = useSelector((state: any) => state.center.centerNumber)
  const [loading, setLoading] = useState(true);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [confirmationSeverity, setConfirmationSeverity] = useState<'success' | 'error'>('success');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [existingRooms, setExistingRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [response, setResponse] = useState<any>(null);

  const username = useSelector((state: any) => state.user?.username);
  const fetchExistingRooms = async () => {
    try {

      setLoading(true);
      if (!session?.user?.token) {
        console.warn("Session or token missing during fetch");
        return;
      }

      const splitValue = session.user?.token.split("NEXT2121ANG");

      const formfields = {
        CenterNo: centerNumber,
      };

      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);

      const response = await getRoomsAction(Data);
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);

      let parsedData;
      parsedData = JSON.parse(decryptedData);
      setExistingRooms(parsedData);
      dispatch(setRooms([...parsedData].reverse()));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching school staff:", error);
      setLoading(false);
    }
  };

  // Fetch existing rooms when component mounts
  useEffect(() => {
    if (centerNumber) {
      fetchExistingRooms();
    } 
  }, [response])

  const validationSchema = Yup.object({
    number: Yup.string()
      .required("Room number is required")
      .matches(/^[a-zA-Z0-9]+$/, "Room number must contain only letters and numbers")
      .test("unique-room", "Room already exists", function (value) {
        if (!value) return true;
        const exists = existingRooms.some(
          room => room.RoomNo?.trim().toLowerCase() === value.trim().toLowerCase()
        );
        return !exists;
      }),

    row: Yup.number()
      .typeError("Row number must be a number")
      .required("Row number is required")
      .integer("Row number must be an integer")
      .positive("Row number must be positive"),

    column: Yup.number()
      .typeError("Column number must be a number")
      .required("Column number is required")
      .integer("Column number must be an integer")
      .positive("Column number must be positive"),
  });

  const formik = useFormik<FormValues>({
    initialValues: { number: "", row: "", column: "" },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (!session?.user?.token) {
          console.warn("Session or token missing during fetch");
          return;
        }

        const splitValue = session?.user?.token?.split('NEXT2121ANG');
        const formfields = {
          "CenterNo": centerNumber,
          "RoomNo": values.number.toString(),
          "Row": values.row ? parseInt(values.row.toString(), 10) : null,  // Convert to integer
          "Col": values.column ? parseInt(values.column.toString(), 10) : null, // Convert to integer
          "AddBy": username
        }

        const credentialsJson = JSON.stringify(formfields);
        const { Data } = encryptData(credentialsJson, splitValue[1]);

        const response = await addRoomsAction(Data);
        const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
        setResponse(decryptedData)


        if (response) {
          setConfirmationMessage('Room added successfully!');
          setConfirmationSeverity('success');
          formik.resetForm();

          // Refresh the list of rooms
          fetchExistingRooms();
        } else {
          // Display detailed error message if available
          setConfirmationMessage('Failed to add room.');
          setConfirmationSeverity('error');
        }

      } catch (error: any) {
        console.error("Form submission error:", error);
        setConfirmationMessage(error.message || 'Error adding room.');
        setConfirmationSeverity('error');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Calculate total capacity based on current form values
  const totalCapacity =
    formik.values.row && formik.values.column
      ? parseInt(formik.values.row) * parseInt(formik.values.column)
      : 0;

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack marginTop="-13px">
        {/* Room Number Field */}

        <Box mt="-25px">
          <CustomFormLabel>Room Number</CustomFormLabel>
          <CustomTextField
            id="bl-Room"
            name="number"
            placeholder="Enter Room Number"
            fullWidth
            value={formik.values.number}
            onChange={(e: any) => {
              const value = e.target.value;
              // Allow only digits (0–9)
              formik.setFieldValue("number", value);
              // if (/^\d*$/.test(value)) {
              // }
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.number && !!formik.errors.number}
            helperText={formik.touched.number ? formik.errors.number : ""}
            disabled={isSubmitting}
          // inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />

        </Box>

        {/* Row Field */}
        <Box>
          <CustomFormLabel>Row</CustomFormLabel>
          <CustomTextField
            id="bl-Row"
            name="row"
            placeholder="Enter Row Number"
            fullWidth
            value={formik.values.row}
            onChange={(e: any) => {
              const value = e.target.value;
              // allow only digits
              if (/^\d*$/.test(value)) {
                formik.setFieldValue("row", value);
              }
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.row && !!formik.errors.row}
            helperText={formik.touched.row ? formik.errors.row : ""}
            disabled={isSubmitting}
          />
        </Box>

        {/* Column Field */}
        <Box mb={2}>
          <CustomFormLabel>Column</CustomFormLabel>
          <CustomTextField
            id="bl-Column"
            name="column"
            placeholder="Enter Column Number"
            fullWidth
            value={formik.values.column}
            onChange={(e: any) => {
              const value = e.target.value;
              // allow only digits
              if (/^\d*$/.test(value)) {
                formik.setFieldValue("column", value);
              }
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.column && !!formik.errors.column}
            helperText={formik.touched.column ? formik.errors.column : ""}
            disabled={isSubmitting}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />

        </Box>

        {/* Display Total Capacity */}
        {totalCapacity > 0 && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
            <Typography variant="subtitle2">
              Total Capacity: {totalCapacity} seats
            </Typography>
          </Box>
        )}

        {/* Submit and Reset Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>


          <Stack direction="row" spacing={2}>

            <Button
              variant="text"
              color="error"
              onClick={formik.handleReset}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting || !formik.isValid}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </Stack>
        </Box>
      </Stack>

      {/* Snackbar for Confirmation */}
      <Snackbar
        open={!!confirmationMessage}
        autoHideDuration={6000}
        onClose={() => setConfirmationMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setConfirmationMessage(null)} severity={confirmationSeverity}>
          {confirmationMessage}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default RoomMaster;