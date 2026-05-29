"use client"
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";

import CardMedia from "@mui/material/CardMedia";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import React, { Fragment, useEffect, useRef, useState } from "react";
import BlankCard from "@/app/components/shared/BlankCard";
import { ProfileState } from "@/store/store";
import { useSelector } from "@/store/hooks";
import ProfileTab from "./ProfileTab";
 
import { Icon } from "@iconify/react";
import Breadcrumb from "@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
const BCrumb = [
  {
    title: "Home",
    to: "/dashboard",
    icon: "ic:baseline-home", // Optional
  },
  {
    title: "Profile", // No icon for this
  }
];
const ProfileBanner = () => {
  const ProfileImage = styled(Box)(() => ({
    backgroundImage: "linear-gradient(#50b2fc,#f44c66)",
    borderRadius: "50%",
    width: "110px",
    height: "110px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const profilee = useSelector((state: ProfileState) => state.profile) as {
    profileData: {
      studentSection: any;
      programName: any;
      snap: string;
      name: string;
      studentEmail: any;
      cgpa: number;
      aggrAttendance: number;
    }[];
  };

  return (
    <>


<Breadcrumb title="My Profile" items={BCrumb}  titleIcon="mdi:account-circle-outline" />
      <Grid container spacing={3}>
        <Grid
          size={{
            sm: 12,
          }}
        >
           <BlankCard>
        <CardMedia
          component="img"
          image={"/images/backgrounds/profilebg-3.jpg"}
          alt={"profilecover"}
          width="100%"
          height="130px"
        />
        <Grid container spacing={0} justifyContent="center" alignItems="center">
          <Fragment key={0}>
            <Grid
              sx={{
                order: {
                  xs: "2",
                  sm: "2",
                  lg: "1",
                },
              }}
              size={{
                lg: 4,
                sm: 12,
                md: 5,
                xs: 12,
              }}
            >
              <Stack
                direction="row"
                textAlign="center"
                justifyContent="center"
                gap={6}
                m={3}
              >
                <Box>
                  <Typography color="text.secondary"></Typography>
                  <Typography variant="h4" fontWeight="600">
                    {profilee.profileData[0]?.cgpa}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight={400}
                  >
                    CGPA
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid
              sx={{
                order: {
                  xs: "1",
                  sm: "1",
                  lg: "2",
                },
              }}
              size={{
                lg: 4,
                sm: 12,
                xs: 12,
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                textAlign="center"
                justifyContent="center"
                sx={{
                  mt: "-85px",
                }}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                >
                  <ProfileImage>
                    <Avatar
                      src={`data:image/jpg;base64,${profilee.profileData[0]?.snap}`}
                      alt="profileImage"
                      sx={{
                        borderRadius: "50%",
                        width: "100px",
                        height: "100px",
                        border: "4px solid #fff",
                      }}
                    />
                  </ProfileImage>
                  <Box mt={1}>
                    <Typography fontWeight={600} variant="h5">
                      {profilee.profileData[0]?.name}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="h6"
                      fontWeight={400}
                    >
                      {profilee.profileData[0]?.programName} <b>|</b>{" "}
                      {profilee.profileData[0]?.studentSection}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Fragment>
          <Grid
            sx={{
              order: {
                xs: "3",
                sm: "3",
                lg: "3",
              },
            }}
            size={{
              lg: 4,
              sm: 12,
              xs: 12,
            }}
          >
            <Stack
              direction={"row"}
              gap={2}
              alignItems="center"
              justifyContent="center"
              my={2}
            >
              <Box>
                <Typography color="text.secondary"></Typography>
                <Typography variant="h4" fontWeight="600">
                  {profilee.profileData[0]?.aggrAttendance|| 0 } %
                </Typography>
                <Typography color="textSecondary" variant="h6" fontWeight={400}>
                  Attendance
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <ProfileTab />
      </BlankCard>
        </Grid>
      </Grid>
     
    </>
  );
};

export default ProfileBanner;
