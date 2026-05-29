import React from "react";
import { useSelector } from "react-redux";
import { ProfileState } from "@/store/store";
import {
  IconBriefcase,
  IconMail,
  IconDeviceDesktop,
  IconMapPin,
} from "@tabler/icons-react";
import { Typography, Stack, Divider, Grid, Box } from "@mui/material";
import ChildCard from "@/app/components/shared/ChildCard";
import Percentage from "../HomePageViews/AttendanceCgpa/Cgpa/page";
import Attendence from "../HomePageViews/AttendanceCgpa/Attendance/attendance";

const IntroCard = () => {
  // Correct placement of useSelector hook
  const profilee = useSelector((state: ProfileState) => state.profile) as {
    profileData: {
      hostelName: string;
      paCountryName: string;
      paDistrictName: string;
      paCityName: any;
      name: string;
      aggrAttendance: number;
      studentEmail: any;
      studentMobile: number;
    }[];
  };

  return (
    <Grid container spacing={2} alignItems="stretch">
      <Grid size={{ xs: 12, md: 4, lg: 4 }} >
        <ChildCard>
          <Typography
            textAlign="center"
            fontWeight={600}
            variant="h4"
            mt={-2}
            mb={1}
          >
            Introduction
          </Typography>
          <Divider />

          <Stack direction="row" gap={2} alignItems="center" mt={2} mb={2}>
            <IconBriefcase size={21} />
            <Typography variant="h6">
              {profilee.profileData[0]?.name}
            </Typography>
          </Stack>
          <Stack direction="row" gap={2} alignItems="center" mb={2}>
            <IconMail size={21} />
            <Typography variant="h6">
              {profilee.profileData[0]?.studentEmail}
            </Typography>
          </Stack>
          <Stack direction="row" gap={2} alignItems="center" mb={2}>
            <IconDeviceDesktop size={21} />
            <Typography variant="h6">
              {profilee.profileData[0]?.studentMobile}
            </Typography>
          </Stack>
          <Stack direction="row" gap={2} alignItems="center" mb={2}>
            <IconMapPin size={21} />
            <Typography variant="h6">
              {profilee.profileData[0]?.paCityName},{" "}
              {profilee.profileData[0]?.paDistrictName},{" "}
              {profilee.profileData[0]?.paCountryName}
            </Typography>
          </Stack>
          <Typography variant="body2" color="textSecondary">
          Hostel: {profilee.profileData[0]?.hostelName || "Non-Hostler"}
          </Typography>
        </ChildCard>
      </Grid>

      <Grid size={{ xs: 12, md: 4, lg: 4 }} >
        <Percentage />
      </Grid>

      <Grid size={{ xs: 12, md: 4, lg: 4 }}>
        <Attendence />
      </Grid>
    </Grid>
  );
};

export default IntroCard;
