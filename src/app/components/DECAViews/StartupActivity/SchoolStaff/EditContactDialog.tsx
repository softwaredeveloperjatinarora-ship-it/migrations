"use client";
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Alert,
  AlertTitle,
  Divider
} from '@mui/material';
import { IconX, IconEdit, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { useSession } from "next-auth/react";

// Import the SchoolStaff interface from ContactList component
import { SchoolStaff } from './SchoolContactList';
import { decryptDataforResponse, encryptData } from '@/app/api/services/auth/Encrptdecrpt';
import { useSelector } from 'react-redux';
import { updateStaffAction } from '@/app/actions/DECAActions/DistanceExamination/schoolStaff/updateSchoolStaff';

interface EditContactDialogProps {
  open: boolean;
  contact: SchoolStaff | null;
  onClose: () => void;
  onUpdateSuccess: () => void;
  allContacts: SchoolStaff[];
}

const EditContactDialog = ({
  open,
  contact,
  onClose,
  onUpdateSuccess,
  allContacts
}: EditContactDialogProps) => {
  const [name, setName] = useState(contact?.Name || '');
  const [phone, setPhone] = useState(contact?.PhoneNo || '');
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [duplicationError, setDuplicationError] = useState('');
  const { data: session } = useSession();
  const centerNumber = useSelector((state: any) => state.center.centerNumber)

const username = useSelector((state: any) => state.user?.username);
  // Update state when contact changes
  React.useEffect(() => {
    if (contact) {
      setName(contact.Name || '');
      setPhone(contact.PhoneNo || '');
      setNameError('');
      setPhoneError('');
      setDuplicationError('');
      setShowConfirmation(false);
    }
  }, [contact]);

  const validateForm = () => {
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else if (name.trim().length < 3) {
      setNameError('Name must be at least 3 characters');
      isValid = false;
    } else {
      setNameError('');
    }

    // Validate phone
    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(phone.trim())) {
      setPhoneError('Phone number must be 10 digits');
      isValid = false;
    } else {
      setPhoneError('');
    }

    // Check for duplication (only if name or phone has changed)
    if (isValid && contact) {
      const isDuplicate = allContacts.some(
        staff =>
          staff.id !== contact.id &&
          ((staff.Name === name && staff.PhoneNo === phone) ||
            (staff.Name === name && staff.Name !== contact.Name) ||
            (staff.PhoneNo === phone && staff.PhoneNo !== contact.PhoneNo))
      );

      if (isDuplicate) {
        setDuplicationError('A staff member with this name or phone number already exists');
        isValid = false;
      } else {
        setDuplicationError('');
      }
    }

    return isValid;
  };

  const handleUpdate = async () => {
    if (!contact) return;

    setLoading(true);
    try {
      if (!session?.user?.token) {
        console.warn("Session or token missing during fetch");
        return;
      }

      const splitValue = session.user?.token.split("NEXT2121ANG");

      const formfields = {
        "CenterNo": centerNumber,
        "EmpId": username,
        "id": contact.id,
        "Name": name,
        "PhoneNo": phone,
        "IsActive": '1'
      }

      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);

      const response = await updateStaffAction(Data);
      // const decryptedData = JSON.parse(decryptDataforResponse(response, splitValue[1]));

      if (response?.status === 'success') {
        // console.log("decryptedData", decryptedData);
        onUpdateSuccess();
      } else {
        console.error('Failed to update staff:', response);
      }

      setLoading(false);

      // const formData = new FormData();
      // formData.append('centerNo', contact.CenterNo);
      // formData.append('empId', '28388'); // Static value for empId
      // formData.append('staffId', contact.id); // Using contact.id directly
      // formData.append('staffName', name);
      // formData.append('staffMobileNumber', phone);

      // Debug log the formData entries

      // removed this for avoid build error
      //   Array.from(formData.entries()).forEach(([key, value]) => {
      //   console.log(`${key}: ${value}`);
      // });


      // const result = await updateStaffAction(formfields);

      // if (result.status === 'success') {
      //   onUpdateSuccess();
      // } else {
      //   console.error('Failed to update staff:', result.message);
      // }
    } catch (error) {
      console.error('Error during update:', error);
    } finally {
      setLoading(false);
      setShowConfirmation(false);
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmUpdate = () => {
    handleUpdate();
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }
      }}
    >
      {!showConfirmation ? (
        <>
          <DialogTitle sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2.5
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconEdit size={22} />
              <Typography variant="h6">Edit Staff Contact</Typography>
            </Box>
            <IconButton
              edge="end"
              color="inherit"
              onClick={onClose}
              disabled={loading}
              aria-label="close"
            >
              <IconX size={18} />
            </IconButton>
          </DialogTitle>

          <Divider />

          <DialogContent sx={{ pt: 3 }}>
            {duplicationError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                <AlertTitle>Error</AlertTitle>
                {duplicationError}
              </Alert>
            )}

            <TextField
              autoFocus
              margin="dense"
              label="Staff Name"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!nameError}
              helperText={nameError}
              disabled={loading}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="dense"
              label="Phone Number"
              fullWidth
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={!!phoneError}
              helperText={phoneError}
              disabled={loading}
            />
          </DialogContent>

          <DialogActions sx={{ p: 2.5, pt: 1 }}>
            <Button
              onClick={onClose}
              color="inherit"
              disabled={loading}
              startIcon={<IconX size={18} />}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              color="primary"
              variant="contained"
              disabled={loading}
              startIcon={!loading && <IconCheck size={18} />}
            >
              {loading ? <CircularProgress size={24} /> : 'Update'}
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogTitle sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2.5
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconAlertCircle size={22} color="#ED6C02" />
              <Typography variant="h6">Confirm Update</Typography>
            </Box>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleCancelConfirmation}
              disabled={loading}
              aria-label="close"
            >
              <IconX size={18} />
            </IconButton>
          </DialogTitle>

          <Divider />

          <DialogContent sx={{ pt: 3 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Are you sure you want to update this staff contact?
            </Alert>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Staff ID:</Typography>
                <Typography variant="body1" fontWeight="500">{contact?.id}</Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">Current Name:</Typography>
                <Typography variant="body1" fontWeight="500">{contact?.Name}</Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">New Name:</Typography>
                <Typography variant="body1" fontWeight="500">{name}</Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">Current Phone:</Typography>
                <Typography variant="body1" fontWeight="500">{contact?.PhoneNo}</Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">New Phone:</Typography>
                <Typography variant="body1" fontWeight="500">{phone}</Typography>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, pt: 1 }}>
            <Button
              onClick={handleCancelConfirmation}
              color="inherit"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmUpdate}
              color="primary"
              variant="contained"
              disabled={loading}
              startIcon={!loading && <IconCheck size={18} />}
            >
              {loading ? <CircularProgress size={24} /> : 'Confirm & Update'}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default EditContactDialog;