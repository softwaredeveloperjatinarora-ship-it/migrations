"use client";
import { AppState } from "@/store/store";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import {
  IconChecks,
  IconCheck,
} from "@tabler/icons-react";
import Link from "next/link";
import FacultyRanking from "./Step/FacultyRanking";
import CredentialVerification from "./Step/CredentialVerification";
import StudentDues from "./Step/StudentDues";
import CertificateInstruction from "./Step/CertificateInstruction";
import CloseIcon from '@mui/icons-material/Close';
import { display } from "html2canvas/dist/types/css/property-descriptors/display";

const CertificateSummary = () => {
  const [selectedStep, setSelectedStep] = React.useState("CertificateInstruction");
  const theme = useTheme();
  const customizer = useSelector((state: AppState) => state.customizer);
  const borderColor = theme.palette.divider;
  const success = theme.palette.success.main;
  const successlight = theme.palette.success.light;
  const info = theme.palette.info.main;
  const infolight = theme.palette.info.light;
  const warning = theme.palette.warning.main;
  const warninglight = theme.palette.warning.light;

  const [steps, setSteps] = useState([
    {
      title: "Read Instruction",
      subtitle: "See Instructions",
      color: success,
      lightcolor: successlight,
      icon: "cart-3-line-duotone",
      componentKey: "CertificateInstruction",
      completed: false,
    },
    {
      title: "Faculty Ranking",
      subtitle: "Start Now",
      color: warning,
      lightcolor: warninglight,
      icon: "pause-linear",
      componentKey: "FacultyRanking",
      completed: false,
    },
    {
      title: "Credential Verification",
      subtitle: "Show Info",
      componentKey: "CredentialVerification",
      color: info,
      lightcolor: infolight,
      icon: "delivery-linear",
      completed: false,
    },
    {
      title: "No Dues",
      subtitle: "Show Dues",
      componentKey: "StudentDues",
      color: info,
      lightcolor: infolight,
      icon: "delivery-linear",
      completed: false,
    },
  ]);

  const stats = [
    {
      subtitle: "Total Certificate",
      icon: "/images/Homepageimage/top-warning-shape.png",
      iconsm: <Icon icon="hugeicons:student" width="30" height="30" />,
    },
    {
      subtitle: "Applied Certificate",
      icon: "/images/Homepageimage/top-error-shape.png",
      iconsm: <Icon icon="hugeicons:note" width="30" height="30" />,
    },
    {
      subtitle: "Inprocess Certificate",
      icon: "/images/Homepageimage/top-info-shape.png",
      iconsm: <Icon icon="carbon:result" width="30" height="30" />,
    },
    {
      subtitle: "Pending Collection",
      icon: "/images/Homepageimage/top-info-shape.png",
      iconsm: (
        <Icon icon="academicons:semantic-scholar" width="30" height="30" />
      ),
    },
    {
      subtitle: "Request for PC Mark",
      icon: "/images/Homepageimage/top-error-shape.png",
      iconsm: (
        <Icon icon="solar:card-transfer-outline" width="30" height="30" />
      ),
    },
    {
      subtitle: "Pending",
      icon: "/images/Homepageimage/top-warning-shape.png",
      iconsm: <Icon icon="lucide-lab:elephant-face" width="30" height="30" />,
    },
  ];
  const markStepComplete = (componentKey: string) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.componentKey === componentKey
          ? { ...step, completed: true }
          : step
      )
    );
  };
  const handleConfirmed = (nextStep: string,currentStep:string) => {
    setSelectedStep(nextStep);
     markStepComplete(currentStep)
    
  };
  return (
    <>
      <Grid container spacing={3}>
        <Grid size={{xs:12,sm:12,md:6}} sx={{ display: "flex" }}>
          <Grid container spacing={3}>
            {stats.map((stat, i) => (
              <Grid key={i} size={{ sm: 6, xs: 6, md: 4 }}>
                <Card
                  sx={{
                    height: "150px",
                    padding: 0,
                    border: !customizer.isCardShadow
                      ? `1px solid ${borderColor}`
                      : "none",
                    backgroundColor: "primary.main",
                    color: "white",
                    position: "relative",
                  }}
                  elevation={customizer.isCardShadow ? 9 : 0}
                  variant={!customizer.isCardShadow ? "outlined" : undefined}
                >
                  <Image
                    src={stat.icon}
                    alt="img"
                    className="top-img"
                    width={59}
                    height={81}
                  />
                  <CardContent sx={{ textAlign: "center" }}>
                    <Box mb={1}>{stat.iconsm}</Box>
                    <Typography
                      variant="h4"
                      mb={1}
                      sx={{
                        whiteSpace: "nowrap",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {"0"}
                    </Typography>
                    <Typography
                      mb={2}
                      component="span"
                      variant="subtitle2"
                      sx={{
                        whiteSpace: "nowrap",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {stat.subtitle}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid size={{xs:12,sm:12,md:6}} sx={{ display: "flex" }}>
          <Card
            sx={{
              padding: 0,
              border: !customizer.isCardShadow
                ? `1px solid ${borderColor}`
                : "none",
            }}
            elevation={customizer.isCardShadow ? 9 : 0}
            variant={!customizer.isCardShadow ? "outlined" : undefined}
          >
            <CardContent sx={{ position: "relative" }}>
              <Typography variant="h5"> Steps to Follow</Typography>

              <Grid container spacing={2}>
                <Grid size={12}>
                  <Stack spacing={3} mt={3}>
                    {steps.map((stat, i) => (
                      <Box key={i} sx={{ position: 'relative' }}>
                        {/* Vertical connector line */}
                        {i < steps.length - 1 && (
                          <Box
                            sx={{
                              position: 'absolute',
                              left: 23,
                              top: 46,
                              bottom: -24,
                              width: 2,
                              backgroundColor: i === i && steps[i].completed 
                                ? theme.palette.success.main 
                                : theme.palette.grey[300],
                              zIndex: 1
                            }}
                          />
                        )}
                        
                        <Stack
                          direction="row"
                          spacing={2}
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar
                              sx={{
                                bgcolor: stat.completed ? theme.palette.success.light : theme.palette.warning.light,
                                color: stat.completed ? theme.palette.success.main : theme.palette.warning.main,
                                width: 46,
                                height: 46,
                                zIndex: 2,
                                position: 'relative'
                              }}
                            >
                              {stat.completed ? (
                                <IconChecks size={25} />
                              ) : (
                                <CloseIcon sx={{width:25}} />
                              )}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" mb="4px">
                                {stat.title}
                              </Typography>
                              <Typography
                                variant="subtitle2"
                                color="textSecondary"
                              >
                                <Link
                                  href={"#"}
                                  style={{ color: "inherit" }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedStep(stat.componentKey);
                                  }}
                                >
                                  {stat.subtitle}
                                </Link>
                              </Typography>
                            </Box>
                          </Stack>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
              <Box  sx={{display: { xs: 'none',  sm: 'none',  md: 'block',  },   }} >
              <Image
                src="/images/backgrounds/studentsetps.png"
                alt="img"
                className="welcome-bg"
                width={340}
                height={240}
               
              />
               </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={12}>
          {/* <CertificateInstruction />    */}
          {/* <FacultyRanking/>  */}
          {/* <CredentialVerification/> */}
          {/* <StudentDues/>   */}
          {selectedStep === "CertificateInstruction" && ( <CertificateInstruction  onConfirmed={handleConfirmed}/>  )}
          {selectedStep === "FacultyRanking" && <FacultyRanking  onConfirmed={handleConfirmed} />}
          {selectedStep === "CredentialVerification" && ( <CredentialVerification onConfirmed={handleConfirmed} /> )}
          {selectedStep === "StudentDues" && <StudentDues />}
        </Grid>
      </Grid>
    </>
  );
};

export default CertificateSummary;