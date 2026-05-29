"use client";
 
import { AppState, ProfileState } from "@/store/store";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Grid,
  InputAdornment,
  ListItemText,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { useSelector } from "react-redux";
import LORInstruction from "./PopUp/LORInstruction";
import {
  AssignmentTurnedIn,
  HourglassTop,
  DoneAll,
  Verified,
  Padding,
} from "@mui/icons-material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ParentCard from "@/app/components/shared/ParentCard";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import { IconCheck, IconChecks, IconMenu4 } from "@tabler/icons-react";
import InlineItemCard from "@/app/components/shared/InlineItemCard";
import Breadcrumb from "@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
const StudentLetterOfRecommendation = () => {
      const [selectedCategories, setSelectedCategories] = useState<string []>([]);
      const [copies, setCopies] = useState<string>("");
      const [isCopiesDisabled, setIsCopiesDisabled] = useState<boolean>(true);
  const theme = useTheme();
  const borderColor = theme.palette.divider;
  const customizer = useSelector((state: AppState) => state.customizer);

  const [instruction, setInstruction] = useState(true);
  const handleClose = () => setInstruction(false);
  const profilee = useSelector((state: ProfileState) => state.profile) as {
    profileData: {
      name: string;
    }[];
  };
  const handleDelete = () => {
    // console.info("You clicked the delete icon.");
  };
  const stepsTrack = [
    { label: "Submitted", icon: <AssignmentTurnedIn /> },
    { label: "Under Review", icon: <HourglassTop /> },
    { label: "Approved", icon: <DoneAll /> },
    { label: "Verified", icon: <Verified /> },
  ];
  const activeStepStatus = 0;
  const completedSteps: Record<number, boolean> = Array.from(
    { length: activeStepStatus },
    (_, i) => i
  ).reduce(
    (acc, curr) => ({ ...acc, [curr]: true }),
    {} as Record<number, boolean>
  );
  const handleChange = (event: SelectChangeEvent<typeof selectedCategories>) => {
    const {
        target: { value },
      } = event;
      const selected = typeof value === 'string' ? value.split(',') : value;
      setSelectedCategories(selected);
    
      // Check if "Self" is selected to enable No. of Copies
      if (selected.includes("Self")) {
        setIsCopiesDisabled(false);
      } else {
        setIsCopiesDisabled(true);
        setCopies(""); 
      }
  };
  const BCrumb = [
    {
      to: "/dashboard",
      title: "Home",
    },
    {
      title: "Letter of Recommendation",
    },
  ];
  const categories = [
    {
      value: "Job Opportunities",
      label: "Job Opportunities",
    },
    {
      value: "Higher Studies",
      label: "Higher Studies",
    },
    {
        value: "Internship,Fellowship",
        label: "Internship,Fellowship",
    },
    {
        value: "Internship",
        label: "Internship",
    },
    {
        value: "Fellowship",
        label: "Fellowship",
    }
    ,
    {
        value: "Research",
        label: "Research",
    } ,
    {
        value: "Other",
        label: "Other",
    }
  ];
  return (
    <>
      <Breadcrumb title="Letter of Recommendation" items={BCrumb} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 12, md: 4 }} sx={{ display: "flex" }}>
          <Card
            sx={{
              padding: 0,
              border: !customizer.isCardShadow
                ? `1px solid ${borderColor}`
                : "none",
              overflow: "hidden",
              backgroundColor: "background.paper",
            }}
            elevation={customizer.isCardShadow ? 9 : 0}
            variant={!customizer.isCardShadow ? "outlined" : undefined}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar
                  src="/images/profile/user3.jpg"
                  sx={{
                    width: 64,
                    height: 64,
                    border: "2px solid",
                    borderColor: "info.main",
                  }}
                />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {profilee.profileData[0]?.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    Application Summary
                  </Typography>
                </Box>
              </Box>

              <Box
                mt={3}
                p={2}
                borderRadius={2}
                bgcolor="info.light"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar
                    sx={{
                      bgcolor: "info.main",
                      width: 36,
                      height: 36,
                    }}
                  >
                    <Image
                      src="/images/svgs/icon-idea.svg"
                      alt="icon"
                      width={20}
                      height={20}
                    />
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight={500}>
                    Applications Submitted
                  </Typography>
                </Box>

                <Typography
                  variant="h5"
                  fontWeight={700}
                  color="warning.main"
                  sx={{ minWidth: "40px", textAlign: "right" }}
                >
                  {0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 8 }} sx={{ display: "flex" }}>
          <Card
            sx={{
              padding: 0,
              border: !customizer.isCardShadow
                ? `1px solid ${borderColor}`
                : "none",
              position: "relative",
            }}
            elevation={customizer.isCardShadow ? 9 : 0}
            variant={!customizer.isCardShadow ? "outlined" : undefined}
          >
            <Image
              src="/images/backgrounds/top-info-shape.png"
              alt="Background Shape"
              className="top-img"
              width={59}
              height={81}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: 0,
                opacity: 0.2,
              }}
            />

            <CardContent sx={{ position: "relative", zIndex: 1 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
                flexWrap="wrap"
                gap={2}
              >
                {/* Left: Title with Icon */}
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    sx={{
                      bgcolor: "info.main",
                      width: 48,
                      height: 48,
                    }}
                  >
                    <Image
                      src="/images/svgs/icon-idea.svg"
                      alt="icon"
                      width={24}
                      height={24}
                    />
                  </Avatar>
                  <Typography variant="h6" fontWeight={600}>
                    Application Status
                  </Typography>
                </Box>

                {/* Right: Applications Summary */}
                <Box
                  px={2}
                  py={1.5}
                  borderRadius={2}
                  bgcolor="info.light"
                  display="flex"
                  alignItems="center"
                  sx={{
                    minWidth: 180,
                    boxShadow: 1,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} flexGrow={1}>
                    <Avatar
                      sx={{
                        bgcolor: "info.main",
                        width: 32,
                        height: 32,
                      }}
                    >
                      <CalendarMonthIcon
                        fontSize="small"
                        sx={{ color: "#fff" }}
                      />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        Submission Date
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        color="warning.main"
                      >
                        {"25-Mar-2025"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* <Stack direction="row" justifyContent="space-between" mb={2}>
                        <Typography variant="h6" fontWeight={600}>
                          Application Status
                        </Typography>
                      </Stack> */}
              {/* Application Info Block */}

              <Stepper
                activeStep={activeStepStatus}
                alternativeLabel={false}
                sx={{ mt: 5 }}
              >
                {stepsTrack.map((step, index) => (
                  <Step key={index} completed={!!completedSteps[index]}>
                    <StepLabel
                      icon={step.icon}
                      sx={{
                        ...(index === activeStepStatus && {
                          ".MuiStepLabel-label": {
                            color: "black", // or theme.palette.text.primary
                            fontWeight: "bold",
                          },
                        }),
                      }}
                    >
                      {step.label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Grid size={{ xs: 12 }}>
            <ParentCard title="Application Form">
              <Grid container spacing={2}>
                <Grid
                  size={{
                    lg: 6,
                    md: 12,
                    sm: 12,
                  }}
                >
                  <CustomFormLabel
                    sx={{ marginTop: "-15px" }}
                    htmlFor="standard-select-category"
                  >
                    Purpose
                  </CustomFormLabel>
                  <CustomSelect
                    id="standard-select-category"
                    value={selectedCategories}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    displayEmpty
                    renderValue={(selected: string[]) => {
                      if (selected.length === 0) {
                        return <em>Select Purpose</em>;
                      }
                      return selected.join(", ");
                    }}
                    input={
                      <OutlinedInput
                        startAdornment={
                          <InputAdornment position="start">
                            <IconMenu4 />
                          </InputAdornment>
                        }
                      />
                    }
                  >
                    <MenuItem disabled value="">
                      <em>Select Mode of Collection</em>
                    </MenuItem>
                    {categories.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Checkbox
                          checked={
                            selectedCategories.indexOf(option.value) > -1
                          }
                        />
                        <ListItemText primary={option.label} />
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid>
                <Grid
                  size={{
                    lg: 6,
                    md: 12,
                    sm: 12,
                  }}
                >
                  <CustomFormLabel
                    sx={{ marginTop: "-15px" }}
                    htmlFor="standard-select-category"
                  >
                    Mode of Collection
                  </CustomFormLabel>
                  <InlineItemCard>
                    <Chip
                      label="Custom Icon"
                      variant="outlined"
                      color="primary"
                      avatar={<Avatar>M</Avatar>}
                      onDelete={handleDelete}
                      deleteIcon={<IconCheck width={20} />}
                    />
                    <Chip
                      label="Custom Icon"
                      variant="outlined"
                      color="secondary"
                      avatar={<Avatar>S</Avatar>}
                      onDelete={handleDelete}
                      deleteIcon={<IconChecks width={20} />}
                    />
                  </InlineItemCard>
                </Grid>
              </Grid>
            </ParentCard>
          </Grid>
        </Grid>
      </Grid>
      {instruction && (
        <LORInstruction
          open={instruction}
          handleClose={() => setInstruction(false)}
        />
      )}
    </>
  );
};

export default StudentLetterOfRecommendation;
