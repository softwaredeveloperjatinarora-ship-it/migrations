
"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Card,
  CardContent,
  Divider,
  Avatar,
  Switch,
  InputAdornment,
  IconButton,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import PublicIcon from "@mui/icons-material/Public";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { ProfileState } from "@/store/store";
import { useSelector } from "@/store/hooks";

// Define the types for profile data structure
interface AddressType {
  hno_building_Perm?: string;
  colony_Perm?: string;
  cityname_Perm?: string;
  districtname_Perm?: string;
  statename_Perm?: string;
  addressCountryName_Perm?: string;
  pincode_Perm?: string;

  hno_building_Corres?: string;
  colony_Corres?: string;
  cityname_Corres?: string;
  districtname_Corres?: string;
  statename_Corres?: string;
  addressCountryName_Corres?: string;
  pincode_Corres?: string;

  hno_building_payingguest?: string;
  colony_payingguest?: string;
  cityname_payingguest?: string;
  districtname_payingguest?: string;
  statename_payingguest?: string;
  addressCountryName_payingguest?: string;
  pincode_payingguest?: string;
}

interface InternationalDetailsType {
  countryname: string | null;
  passportExpiryDate: string | null;
  visaExpiryDate: string | null;
  passportNo: string | null;
  visaNo: string | null;
  nationalID: string | null;
  passportIssueDate: string | null;
  visaIssuedDate: string | null;
  froIssueDate: string | null;
  froExpiryDate: string | null;
  permitNo: string | null;
}

interface ProfileDataType {
  studentUid: string;
  dateOfBirth: string;
  name: string;
  categoryCode: string;
  fathername: string;
  fatherMobile: string;
  mothername: string;
  motherMobile: string;
  gender: string;
  studentMobile: string;
  studentEmail: string;
  fatherEmail: string;
  permanentaddress: AddressType[];
  correspondenceaddress: AddressType[];
  payingguestaddress: AddressType[];
  internationalstudentdeatils: InternationalDetailsType[];
}

const ProfileForm = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [loading, setLoading] = useState(true); // Add loading state



  const profilee = useSelector((state: ProfileState) => state.profile) as {
    profileData: {
      aggrAttendance: number;
      studentUid: number;
      name: string;
      fatherName: string;
      motherName: string;
      gender: string;
      studentEmail: any;
      dateOfBirth: number;
      fatherMobile: number;
      motherMobile: number;
      studentMobile: number;
      fatherEmail: any;

      paLine1: any;
      paCityName: string;
      paDistrictName: any;
      paStateName: string;
      paCountryName: string;
      paPincode: number;

      caLine1: any;
      cCityName: string;
      cDistrictName: string;
      cStateName: string;
      cCountryName: string;
      cPincode: number;
    }[];
  };






  const [activeStep, setActiveStep] = useState(0);
  const [profileData, setProfileData] = useState<ProfileDataType[]>([
    {
      studentUid: "",
      dateOfBirth: "",
      name: "",
      categoryCode: "",
      fathername: "",
      fatherMobile: "xxxxxxxxx",
      mothername: "",
      motherMobile: "xxxxxxxxx",
      gender: "M",
      studentMobile: "xxxxxxxxx",
      studentEmail: "XXXX@XXXX.com",
      fatherEmail: "XXXX@XXXX.com",
      permanentaddress: [
        {
          hno_building_Perm: "",
          cityname_Perm: "",
          districtname_Perm: "",
          statename_Perm: "",
          addressCountryName_Perm: "",
          pincode_Perm: "",
        },
      ],
      correspondenceaddress: [
        {
          hno_building_Corres: "",
          cityname_Corres: "",
          districtname_Corres: "",
          statename_Corres: "",
          addressCountryName_Corres: "",
          pincode_Corres: "",
        },
      ],
      payingguestaddress: [
        {
          hno_building_payingguest: "",
          cityname_payingguest: "",
          districtname_payingguest: "",
          statename_payingguest: "",
          addressCountryName_payingguest: "",
          pincode_payingguest: "",
        },
      ],
      internationalstudentdeatils: [
        {
          countryname: null,
          passportExpiryDate: null,
          visaExpiryDate: null,
          passportNo: null,
          visaNo: null,
          nationalID: null,
          passportIssueDate: null,
          visaIssuedDate: null,
          froIssueDate: null,
          froExpiryDate: null,
          permitNo: null,
        },
      ],
    },
  ]);




  useEffect(() => {
    if (profilee.profileData && profilee.profileData.length > 0) {
      setProfileData([
        {
          studentUid: `${profilee.profileData[0]?.studentUid}`,
          dateOfBirth: `${profilee.profileData[0]?.dateOfBirth}`,
          name: `${profilee.profileData[0]?.name}`,
          categoryCode: "Gen",
          fathername: `${profilee.profileData[0]?.fatherName}`,
          fatherMobile: `${profilee.profileData[0]?.fatherMobile}`,
          mothername: `${profilee.profileData[0]?.motherName}`,
          motherMobile: `${profilee.profileData[0]?.motherMobile}`,
          gender: `${profilee.profileData[0]?.gender}`,
          studentMobile: `${profilee.profileData[0]?.studentMobile}`,
          studentEmail: `${profilee.profileData[0]?.studentEmail}`,
          fatherEmail: `${profilee.profileData[0]?.fatherEmail}`,
          permanentaddress: [
            {
              hno_building_Perm: `${profilee.profileData[0]?.paLine1}`,
              cityname_Perm: `${profilee.profileData[0]?.paCityName}`,
              districtname_Perm: `${profilee.profileData[0]?.paDistrictName}`,
              statename_Perm: `${profilee.profileData[0]?.paStateName}`,
              addressCountryName_Perm: `${profilee.profileData[0]?.paCountryName}`,
              pincode_Perm: `${profilee.profileData[0]?.paPincode}`,
            },
          ],
          correspondenceaddress: [
            {
              hno_building_Corres: `${profilee.profileData[0]?.caLine1}`,
              cityname_Corres: `${profilee.profileData[0]?.cCityName}`,
              districtname_Corres: `${profilee.profileData[0]?.cDistrictName}`,
              statename_Corres: `${profilee.profileData[0]?.cStateName}`,
              addressCountryName_Corres: `${profilee.profileData[0]?.cCountryName}`,
              pincode_Corres: `${profilee.profileData[0]?.cPincode}`,
            },
          ],
          payingguestaddress: [
            {
              hno_building_payingguest: "",
              cityname_payingguest: "",
              districtname_payingguest: "",
              statename_payingguest: "",
              addressCountryName_payingguest: "",
              pincode_payingguest: "",
            },
          ],
          internationalstudentdeatils: [
            {
              countryname: null,
              passportExpiryDate: null,
              visaExpiryDate: null,
              passportNo: null,
              visaNo: null,
              nationalID: null,
              passportIssueDate: null,
              visaIssuedDate: null,
              froIssueDate: null,
              froExpiryDate: null,
              permitNo: null,
            },
          ],
        },
      ]);
      setLoading(false); // Set loading to false once data is set
    }
  }, [profilee]);





  const [isAgreed, setIsAgreed] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [hasPayingGuest, setHasPayingGuest] = useState(false);
  const [isInternational, setIsInternational] = useState(false);

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgreed(event.target.checked);
  };

  const handleUpdate = () => {
    if (isAgreed) {
      setOpenToast(true);
    }
  };

  const handlePayingGuestChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setHasPayingGuest(event.target.checked);
  };

  const handleInternationalChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsInternational(event.target.checked);
  };

  const handleProfileDataChange = (
    field: string,
    value: string,
    section?: string,
    index?: number
  ) => {
    const newProfileData = [...profileData];

    if (section) {
      if (section === "payingguestaddress") {
        newProfileData[0].payingguestaddress[0][field as keyof AddressType] =
          value;
      } else if (section === "internationalstudentdeatils") {
        newProfileData[0].internationalstudentdeatils[0][
          field as keyof InternationalDetailsType
        ] = value;
      }
    }
    // } else {
    //   newProfileData[0][field as keyof ProfileDataType] = value;
    // }

    setProfileData(newProfileData);
  };

  const getStepIcon = (index: number) => {
    const icons = [
      <PersonIcon />,
      <HomeIcon />,
      <PublicIcon />,
      <VerifiedUserIcon />,
    ];
    return icons[index];
  };

  return (
    <
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
          justifyContent: "center",
        }}
      >
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            width: 56,
            height: 56,
            mr: 2,
          }}
        >
          <PersonIcon fontSize="large" />
        </Avatar>
        <Typography
          variant="h4"
          color="primary"
          fontWeight={600}
          sx={{
            background: isDarkMode
              ? "linear-gradient(45deg, #90caf9 30%, #4fc3f7 90%)"
              : "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Student Profile Updation
        </Typography>
      </Box>

      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          mb: 5,
          "& .MuiStepIcon-root": {
            fontSize: 30,
            color: theme.palette.primary.main,
          },
          "& .MuiStepIcon-text": {
            fill: isDarkMode ? "#fff" : "#000",
          },
          "& .MuiStepLabel-label": {
            mt: 1,
            fontWeight: 500,
          },
        }}
      >
        {[
          "Personal Information",
          "Address Details",
          "International Details",
          "Undertaking",
        ].map((label, index) => (
          <Step key={label}>
            <StepLabel StepIconComponent={() => getStepIcon(index)}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <form>
        {activeStep === 0 && (
          <Card
            variant="outlined"
            sx={{
              mb: 3,
              borderRadius: "12px",
              borderColor: theme.palette.primary.main,
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary" fontWeight={600}>
                  Personal Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {Object.entries(profileData[0]).map(([key, value]) =>
                  typeof value === "object" ? null : (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={key}>
                      <TextField
                        fullWidth
                        label={
                          key.charAt(0).toUpperCase() +
                          key.slice(1).replace(/([A-Z])/g, " $1")
                        }
                        value={
                          key === "dateOfBirth"
                            ? value.split("T")[0]
                            : value ?? ""
                        }
                        variant="outlined"
                        InputProps={{
                          readOnly: true,
                          startAdornment: key.includes("Email") ? (
                            <InputAdornment position="start">@</InputAdornment>
                          ) : key.includes("Mobile") ? (
                            <InputAdornment position="start">📱</InputAdornment>
                          ) : null,
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                          "& .MuiInputLabel-root": {
                            color: theme.palette.text.secondary,
                          },
                        }}
                      />
                    </Grid>
                  )
                )}
              </Grid>
            </CardContent>
          </Card>
        )}

        {activeStep === 1 && (
          <>
            {/* Permanent Address */}
            <Card
              variant="outlined"
              sx={{
                mb: 3,
                borderRadius: "12px",
                borderColor: theme.palette.primary.main,
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <HomeIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="primary" fontWeight={600}>
                    Permanent Address
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {Object.entries(profileData[0].permanentaddress[0]).map(
                    ([field, value]) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={field}>
                        <TextField
                          fullWidth
                          label={
                            field
                              .replace(/_Perm/g, "")
                              .charAt(0)
                              .toUpperCase() +
                            field
                              .replace(/_Perm/g, "")
                              .slice(1)
                              .replace(/([A-Z])/g, " $1")
                          }
                          value={value ?? ""}
                          variant="outlined"
                          InputProps={{
                            readOnly: true,
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "8px",
                            },
                          }}
                        />
                      </Grid>
                    )
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Correspondence Address */}
            <Card
              variant="outlined"
              sx={{
                mb: 3,
                borderRadius: "12px",
                borderColor: theme.palette.primary.main,
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <HomeIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="primary" fontWeight={600}>
                    Correspondence Address
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {Object.entries(profileData[0].correspondenceaddress[0]).map(
                    ([field, value]) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={field}>
                        <TextField
                          fullWidth
                          label={
                            field
                              .replace(/_Corres/g, "")
                              .charAt(0)
                              .toUpperCase() +
                            field
                              .replace(/_Corres/g, "")
                              .slice(1)
                              .replace(/([A-Z])/g, " $1")
                          }
                          value={value ?? ""}
                          variant="outlined"
                          InputProps={{
                            readOnly: true,
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "8px",
                            },
                          }}
                        />
                      </Grid>
                    )
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Paying Guest Address */}
            <Card
              variant="outlined"
              sx={{
                mb: 3,
                borderRadius: "12px",
                borderColor: hasPayingGuest
                  ? theme.palette.primary.main
                  : theme.palette.grey[300],
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                opacity: hasPayingGuest ? 1 : 0.8,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <HomeIcon
                      color={hasPayingGuest ? "primary" : "disabled"}
                      sx={{ mr: 1 }}
                    />
                    <Typography
                      variant="h6"
                      color={hasPayingGuest ? "primary" : "textSecondary"}
                      fontWeight={600}
                    >
                      Paying Guest Address
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={hasPayingGuest}
                        onChange={handlePayingGuestChange}
                        color="primary"
                      />
                    }
                    label={hasPayingGuest ? "Enabled" : "Disabled"}
                  />
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {Object.entries(profileData[0].payingguestaddress[0]).map(
                    ([field, value]) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={field}>
                        <TextField
                          fullWidth
                          label={
                            field
                              .replace(/_payingguest/g, "")
                              .charAt(0)
                              .toUpperCase() +
                            field
                              .replace(/_payingguest/g, "")
                              .slice(1)
                              .replace(/([A-Z])/g, " $1")
                          }
                          value={value ?? ""}
                          variant="outlined"
                          disabled={!hasPayingGuest}
                          onChange={(e) =>
                            handleProfileDataChange(
                              field,
                              e.target.value,
                              "payingguestaddress"
                            )
                          }
                          InputProps={{
                            readOnly: !hasPayingGuest,
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "8px",
                            },
                          }}
                        />
                      </Grid>
                    )
                  )}
                </Grid>
              </CardContent>
            </Card>
          </>
        )}

        {activeStep === 2 && (
          <Card
            variant="outlined"
            sx={{
              mb: 3,
              borderRadius: "12px",
              borderColor: isInternational
                ? theme.palette.primary.main
                : theme.palette.grey[300],
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              opacity: isInternational ? 1 : 0.8,
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PublicIcon
                    color={isInternational ? "primary" : "disabled"}
                    sx={{ mr: 1 }}
                  />
                  <Typography
                    variant="h6"
                    color={isInternational ? "primary" : "textSecondary"}
                    fontWeight={600}
                  >
                    International Student Details
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isInternational}
                      onChange={handleInternationalChange}
                      color="primary"
                    />
                  }
                  label={isInternational ? "Enabled" : "Disabled"}
                />
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {Object.entries(
                  profileData[0].internationalstudentdeatils[0]
                ).map(([field, value]) => {
                  const isDateField = field.toLowerCase().includes("date");
                  return (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={field}>
                      <TextField
                        fullWidth
                        label={
                          field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")
                        }
                        value={value ?? ""}
                        type={isDateField ? "" : "text"}
                        variant="outlined"
                        disabled={!isInternational}
                        onChange={(e) =>
                          handleProfileDataChange(
                            field,
                            e.target.value,
                            "internationalstudentdeatils"
                          )
                        }
                        InputProps={{
                          readOnly: !isInternational,
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        )}

        {activeStep === 3 && (
          <Card
            variant="outlined"
            sx={{
              mb: 3,
              borderRadius: "12px",
              borderColor: theme.palette.primary.main,
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <AssignmentTurnedInIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary" fontWeight={600}>
                  Undertaking
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Box
                sx={{
                  p: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "8px",
                  mb: 3,
                }}
              >
                <Typography variant="body1" sx={{ mb: 2, fontStyle: "italic" }}>
                  The above information given by me is correct and true to the
                  best of my knowledge and nothing has been concealed there in.
                  If anything in my information above proved to be wrong, I
                  shall be liable for action as per University rules &
                  regulations.
                </Typography>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isAgreed}
                      onChange={handleCheckboxChange}
                      color="primary"
                      size="medium"
                    />
                  }
                  label={
                    <Typography variant="body1" fontWeight={500}>
                      I agree to the above undertaking
                    </Typography>
                  }
                />
              </Box>

              {/* Notice for Incorrect Information */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: theme.palette.warning.light,
                  borderRadius: "8px",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.warning.dark,
                    fontWeight: 500,
                  }}
                >
                  <span
                    style={{
                      color: theme.palette.primary.main,
                      fontWeight: "bold",
                    }}
                  >
                    Note:
                  </span>{" "}
                  If any information is incorrect, please visit{" "}
                  <b>Record Cell, Block No. 32, Room No. 101 (Window No. 02)</b>{" "}
                  with ID proof & relevant documents or send an email to{" "}
                  <b>ao.records@lpu.co.in</b> with scanned copies of the
                  documents for rectification.
                </Typography>
              </Paper>

              {/* Update Button */}
              <Box display="flex" justifyContent="center" mt={4}>
                <Button
                  onClick={handleUpdate}
                  variant="contained"
                  disabled={!isAgreed}
                  startIcon={<SaveIcon />}
                  size="large"
                  sx={{
                    bgcolor: theme.palette.success.main,
                    color: "white",
                    py: 1.5,
                    px: 4,
                    borderRadius: "8px",
                    "&:hover": { bgcolor: theme.palette.success.dark },
                  }}
                >
                  Update Profile
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </form>

      <Box mt={4} display="flex" justifyContent="space-between">
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
          size="large"
          sx={{
            borderRadius: "8px",
            px: 3,
            py: 1,
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            "&:hover": {
              borderColor: theme.palette.primary.dark,
              bgcolor: isDarkMode
                ? "rgba(25, 118, 210, 0.08)"
                : "rgba(25, 118, 210, 0.04)",
            },
          }}
        >
          Back
        </Button>

        <Button
          onClick={handleNext}
          variant="contained"
          size="large"
          disabled={activeStep === 3}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: "white",
            px: 3,
            py: 1,
            borderRadius: "8px",
            "&:hover": { bgcolor: theme.palette.primary.dark },
          }}
        >
          Next
        </Button>
      </Box>

      {/* Toast Notification */}
      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={() => setOpenToast(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setOpenToast(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Profile successfully updated!
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default ProfileForm;