
"use client"
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { Modal, Box, Typography, Card, Button, Stack, Snackbar, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useRef, useState } from "react";
import { OJTCancel } from "@/app/actions/OJTDashboard/OJTCancelAction";
import { useSession } from "next-auth/react";
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";

interface OJTCancelProps {
  isOpen: boolean;
  closeModalCan: (data?: boolean) => void;
  id: number;
}

const OJTCancelllation: React.FC<OJTCancelProps> = ({ isOpen, closeModalCan, id }) => {
  if (!isOpen) return null;

  const [remarks, setRemarks] = useState("");
  const [lastWorkingDate, setLastWorkingDate] = useState("");
  const [openToast, setOpenToast] = useState(false);
  const [cancelToast, setcancelToast] = useState(false);




  const handleConfirm = async (id: number) => {
   
    closeModalCan(false);
    setcancelToast(true);

  };

  const handleClose = () => {
    closeModalCan(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!remarks || !lastWorkingDate) {
      setOpenToast(true);
      return;
    }

  
    closeModalCan(true);
  };

  const handleReset = () => {
    setRemarks("");
    setLastWorkingDate("");
  };

  return (
    <>
      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={() => setOpenToast(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenToast(false)} severity="error" sx={{ width: "150%" }}>
          All fields are  Mandatory to Fill
        </Alert>

      </Snackbar>
       <Snackbar
        open={cancelToast}
        autoHideDuration={3000}
        onClose={() => setcancelToast(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setcancelToast (false)} severity="error" sx={{ width: "150%" }}>
         cancellation successfull
        </Alert>

      </Snackbar>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "70%", md: "50%" },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            OJT Cancellation
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
              color: "black",
              backgroundColor: "lightgrey",
              borderRadius: "50%",
            }}
          >
            <CloseIcon sx={{ width: "15px", height: "15px" }} />
          </Box>

          <Card title="Ordinary Form">
            <form onSubmit={handleSubmit}>
              <CustomFormLabel htmlFor="cancel-remarks">Cancel Remarks</CustomFormLabel>
              <CustomTextField
                id="cancel-remarks"
                value={remarks}
                onChange={(e: any) => setRemarks(e.target.value)}
                helperText="Enter your Cancellation Remarks here"
                variant="outlined"
                multiline
                fullWidth
              />

              <CustomFormLabel htmlFor="last-working-date">Last Working Date</CustomFormLabel>
              <CustomTextField
                type="date"
                id="last-working-date"
                value={lastWorkingDate}
                onChange={(e: any) => setLastWorkingDate(e.target.value)}
                fullWidth
              />

              <Stack direction="row" spacing={4} mt={6} justifyContent="center">
                <Button type="submit" color="primary" variant="contained" onClick={() => handleConfirm(id)} >
                  Submit
                </Button>
                <Button type="button" onClick={handleReset} color="primary" variant="contained">
                  Reset
                </Button>
              </Stack>
            </form>
          </Card>
        </Box>
      </Modal>
    </>
  );
};

export default OJTCancelllation;
