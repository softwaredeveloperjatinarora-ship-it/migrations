'use client'
import {
    Box,
    CardContent,
    Typography,
    Grid,
    Avatar,
    Divider,
    Button,
    Checkbox,
    FormControlLabel,
    Stack,
    useMediaQuery,
    useTheme  } from '@mui/material';
import ParentCard from '@/app/components/shared/ParentCard';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useSelector } from 'react-redux';
import { ProfileState } from '@/store/store';
import { useState } from 'react';
import { Widgets } from '@mui/icons-material';
  
  const CredentialVerification = ({ onConfirmed }: { onConfirmed: (data: string,setp:string) => void  }) => {
    const theme = useTheme();
   const [isChecked, setIsChecked] = useState(false);

    const profilee = useSelector((state: ProfileState) => state.profile) as {
        profileData: {
          snap: string;
        }[];
      };
      const handleConfirm = () => {
        if (isChecked) {
          onConfirmed('StudentDues','CredentialVerification');
        } else {
          alert("Please confirm you have read the information.");
        }
      };
    return (
      <ParentCard title="Credential Verification">
        <CardContent sx={{ p: 1, mt: -3 }}>
          {/* Main Content */}
          <Grid container spacing={4}>
            {/* Info Section */}
            <Grid size={{ xs: 12, md: 8 }}>
              {/* Personal Details */}
              <Box mb={3}>
                <Stack direction="row" alignItems="center" spacing={0.5} mb={1}>
                  <PersonIcon fontSize="small" color="primary" />
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="primary"
                  >
                    Personal Details
                  </Typography>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Grid container spacing={1}>
                  <Grid size={{ xs: 6 }}>
                    <b>Student Name:</b> Rahul Kapoor
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <b>Father Name:</b> Ravi Kumar
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <b>Mother Name:</b> Rajni
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <b>Gender:</b> M
                  </Grid>
                </Grid>
              </Box>

              {/* Academic Details */}
              <Box mb={3}>
                <Stack direction="row" alignItems="center" spacing={0.5} mb={1}>
                  <SchoolIcon fontSize="small" color="info" />
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="info"
                  >
                    Academic Details
                  </Typography>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Grid container spacing={1}>
                  <Grid size={{ xs: 6 }}>
                    <b>Program:</b> MCA
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <b>Degree Name:</b> Master of Computer Applications
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <b>Batch Year:</b> 2015
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <b>Student Status:</b> PC
                  </Grid>
                </Grid>
              </Box>

              {/* Contact Details */}
              <Box>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.5}
                  mb={1}
                  width="100%"
                >
                  <LocationOnIcon fontSize="small" color="warning" />
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="warning"
                  >
                    Contact Details
                  </Typography>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Grid container spacing={1}>
                  <Grid size={{ xs: 6 }}>
                    <b>Mobile No.:</b> xxxx
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <b>Address:</b> H No - 238, St No - 1, Bhanoki Road,
                    Satnampura, Phagwara, Kapurthala, Punjab, India (144401)
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Profile Picture */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                justifyContent="center"
                alignItems="center"
                height="100%"
                sx={{ float: "right", width: 173, height: 173 }}
                mt={2.3}
              >
                <Avatar
                  src={`data:image/jpg;base64,${profilee.profileData[0]?.snap}`}
                  alt="Student Photo"
                  variant="square" // Makes it square
                  sx={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 0.5,
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Agreement and Button */}
          <Divider sx={{ my: 2 }} />
          <Box
            display="flex"
            justifyContent="center"
            alignItems="left"
            flexDirection="column"
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  name="confirmRead"
                />
              }
              label="I undertake the above given information is correct and if at any stage this information is found to be incorrect later on, then I shall be liable to pay the correction charges for my credentials as per university policy."
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
        </CardContent>
      </ParentCard>
    );
  };
  
  export default CredentialVerification;
  