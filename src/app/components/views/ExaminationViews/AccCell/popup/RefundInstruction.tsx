import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
  Paper,
  Stack,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import GavelIcon from "@mui/icons-material/Gavel";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

interface PopupProps {
  open: boolean;
  handleClose: () => void;
}

export const InstructionCard = ({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
}) => (
  <Paper
    elevation={2}
    sx={{
      p: 2,
      mb: 3,
      backgroundColor: "#f9f9f9",
    }}
  >
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <Box mt={0.5}>{icon}</Box>
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" textAlign="justify" color="text.secondary">
          {content}
        </Typography>
      </Box>
    </Stack>
  </Paper>
);

const RefundInstruction: React.FC<PopupProps> = ({ open, handleClose }) => {
  const [isChecked, setIsChecked] = useState(false);
  const descriptionElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && descriptionElementRef.current) {
      descriptionElementRef.current.focus();
    }
  }, [open]);

  const handleConfirm = () => {
    if (isChecked) {
      handleClose();
    } else {
      alert("Please confirm you have read the information.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      scroll="paper"
    >
      <DialogTitle>Instructions for Refund</DialogTitle>
      <DialogContent dividers  ref={descriptionElementRef}>
        <InstructionCard
          icon={<AccountBalanceIcon color="primary" />}
          title="1. Bank Loan"
          content="Students need to obtain a NOC from the Bank and attach it when applying for the refund in the portal. If a student wants the refund amount transferred to the Bank, they can provide a letter from the bank mentioning the Branch A/c, IFSC code, and bank name."
        />

        <InstructionCard
          icon={<GavelIcon color="secondary" />}
          title="2. Bihar Govt. Loan"
          content="Students need to submit an Affidavit which should be attested and stamped by the notary. Without attestation, the affidavit will not be considered. The format of the affidavit has been attached in the interface."
        />

        <InstructionCard
          icon={<AccountBoxIcon color="success" />}
          title="3. Bank A/c Details"
          content="As per policy, only parents' bank account details will be considered for refunding the money for Masters and Bachelor students. PhD students' own accounts will be considered for the refund of money."
        />

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          mt={4}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                name="confirmRead"
              />
            }
            label="I have read this information"
          />
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={!isChecked}
          >
            Confirm
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RefundInstruction;
