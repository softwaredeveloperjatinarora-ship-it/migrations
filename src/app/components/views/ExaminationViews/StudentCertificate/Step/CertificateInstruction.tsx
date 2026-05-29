'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Divider,
  Button,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  IconFileText,
  IconInfoCircle,
  IconHelpCircle,
  IconCircleCheckFilled,
} from '@tabler/icons-react';
import Link from 'next/link';
import BlankCard from '@/app/components/shared/BlankCard';
import ParentCard from '@/app/components/shared/ParentCard';

// Reusable Instruction Card
const InstructionCard = ({
    icon,
    title,
    children,
  }: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
  }) => (
    <Card
      variant="outlined"
      sx={{
        mb: 1,
        backgroundColor: '#fdfdfd',
        alignSelf: 'flex-start',
        width: '100%',
        p: 1, 
      }}
    >
      <CardContent sx={{ p:1,  width: '100%' }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start"> 
          <Box mt={0.5}>{icon}</Box>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
              {title}
            </Typography>
            <Typography
                variant="body2"
                component="div"
                sx={{ color: 'text.secondary', lineHeight: 1.8 }}
            >
              {children}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

// Main Instruction Page
const CertificateInstruction = ({ onConfirmed }: { onConfirmed: (data: string,setp:string) => void  }) => {
      const [isChecked, setIsChecked] = useState(false);
      const handleConfirm = () => {
        if (isChecked) {
        onConfirmed('FacultyRanking','CertificateInstruction');
        } else {
          alert("Please confirm you have read the information.");
        }
      };
  return (
    <ParentCard title="Certificate Application Guidelines">
      <Box px={1} py={1} mt={-3}>
        {/* Header */}
        <InstructionCard
          icon={<IconFileText color="teal" size={28} />}
          title="Through this interface a student can apply for the following:"
        >
          a. Updation of Student's Information <br />
          b. Certificates
        </InstructionCard>

       
        <InstructionCard
          icon={<IconCircleCheckFilled color="orange" size={28} />}
          title="Steps to be followed for Application Procedure"
        >
          <ol style={{ paddingLeft: "1rem", margin: 0 }}>
            <li>Faculty feedback is mandatory to proceed to the next step.</li>
            <li>
              Before applying for certificates, verify your Name, Father's Name,
              Mother's Name, and DOB in the{" "}
              <strong>Credential Verification</strong> tab.
            </li>
            <li>
              If there is any error, click <strong>"Update Credentials"</strong>{" "}
              and upload your 10th mark sheet.
            </li>
            <li>
              You cannot apply for certificates while updates are pending (up to
              3 working days).
            </li>
            <li>
              No Dues must be cleared before certificate application. Check
              status in <strong>No Dues</strong>.
            </li>
            <li>
              Click <strong>Apply Certificates</strong> to begin your request.
            </li>
            <li>
              Can’t find your certificate? Go to <strong>Other Request</strong>{" "}
              and upload documents.
            </li>
            <li>
              After payment, track status under <strong>My Certificates</strong>
              .
            </li>
            <li>
              <strong>
                <b>
                  THE FEE OF THE DOCUMENTS/CERTIFICATES WILL NOT BE REFUNDED TO
                  THE STUDENT AT ANY COST & THEY HAVE TO PAY THE FEE AGAIN FOR
                  THE REQUIRED CERTIFICATE(S) IN CASE OF RE-APPLICATION.
                </b>
              </strong>
            </li>
            <li>
              <strong>Collection Timelines:</strong> Certificates marked
              ‘Packed’ are ready in 3–5 working days. Not collected in 20–25
              days? They will be destroyed (no refund).
            </li>
            <li>
              <strong>Collection Process:</strong> Use your token from{" "}
              <strong>Print Receipt</strong> to collect from Building 32, Room
              101.
            </li>
            <li>
              <strong>Dispatch Option:</strong> Documents dispatched within 15
              days (charges non-refundable, university not liable for transit
              issues).
            </li>
            <li>
              <strong>Express Mode:</strong> Urgent issuance available with
              extra fees.
            </li>
          </ol>
        </InstructionCard>

        {/* Query Section */}
        <InstructionCard
          icon={<IconHelpCircle color="blue" size={28} />}
          title="Need Help?"
        >
          For any queries related to certificates, please log a request on RMS:{" "}
          <br />
          <strong>
            UMS Navigation → Relationship Management System → Log Request
          </strong>
          <br />
          <strong>Master Category:</strong> Records and Certificates <br />
          <strong>Sub Category:</strong> Letter of Recommendation (LOR) <br />
          <Box mt={1}>
            <Button
              variant="outlined"
              color="primary"
              component={Link}
              href="#"
              target="_blank"
            >
              Log a Request
            </Button>
          </Box>
        </InstructionCard>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="left"
          flexDirection="column"
          mt={2}
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
            sx={{width:'100px'}}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </ParentCard>
  );
};

export default CertificateInstruction;
