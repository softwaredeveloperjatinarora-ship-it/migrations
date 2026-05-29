"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  Grid,
  Link,
  useTheme,
} from "@mui/material";
import {
  School as SchoolIcon,
  ArrowForward as ArrowForwardIcon,
  Science as ScienceIcon,
  Business as BusinessIcon,
  MedicalServices as MedicalIcon,
} from "@mui/icons-material";

interface FacultyCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const FacultyCard = ({ title, description, icon, href, color }: FacultyCardProps) => {
  const theme = useTheme();
  
  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Link 
        href={href}
        underline="none"
        sx={{ display: "block", height: "100%" }}
      >
        <Card 
          sx={{ 
            height: "100%", 
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: "pointer",
            overflow: "hidden",
            "&:hover": { 
              transform: "translateY(-8px)", 
              boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
              "& .arrow-icon": {
                transform: "translateX(8px)",
              }
            }
          }}
        >
          <Box 
            sx={{ 
              bgcolor: color, 
              py: 4, 
              px: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <Box 
              sx={{ 
                position: "absolute",
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.15)",
              }}
            />
            <Box 
              sx={{ 
                position: "absolute",
                bottom: -30,
                left: -30,
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.1)",
              }}
            />
            <Box 
              sx={{ 
                bgcolor: "rgba(255,255,255,0.2)", 
                borderRadius: "50%", 
                p: 2,
                mb: 2,
                position: "relative",
                zIndex: 1
              }}
            >
              {icon}
            </Box>
            <Typography 
              variant="h5" 
              sx={{ 
                color: "white", 
                fontWeight: 800, 
                textAlign: "center",
                position: "relative",
                zIndex: 1,
                textShadow: "0 2px 4px rgba(0,0,0,0.2)"
              }}
            >
              {title}
            </Typography>
          </Box>
          <CardContent sx={{ p: 3, textAlign: "center" }}>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              {description}
            </Typography>
            <Box 
              className="arrow-icon"
              sx={{ 
                display: "inline-flex", 
                alignItems: "center",
                color: color,
                fontWeight: 700,
                transition: "transform 0.3s ease"
              }}
            >
              <Typography variant="button" sx={{ fontWeight: 700, mr: 1 }}>
                VIEW DASHBOARD
              </Typography>
              <ArrowForwardIcon />
            </Box>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
};

const EduRevLandingPage = () => {
  const theme = useTheme();

  const faculties = [
    {
      title: "Lovely Faculty of Technology and Sciences",
      description: "View enrollment metrics, course details, and student progress for Technology and Sciences division",
      icon: <ScienceIcon sx={{ fontSize: 48, color: "white" }} />,
      href: "/dashboard/staff/EduRev/dashboard?faculty=technology",
      color: theme.palette.primary.main
    },
    {
      title: "Lovely Faculty of Business and Arts",
      description: "Access dashboard for Business and Arts programs, track enrollment status and metrics",
      icon: <BusinessIcon sx={{ fontSize: 48, color: "white" }} />,
      href: "/dashboard/staff/EduRev/dashboard?faculty=business",
      color: theme.palette.secondary.main
    },
    {
      title: "Lovely Faculty of Applied Medical Sciences",
      description: "Monitor student enrollment, course details, and performance metrics for Medical Sciences",
      icon: <MedicalIcon sx={{ fontSize: 48, color: "white" }} />,
      href: "/dashboard/staff/EduRev/dashboard?faculty=medical",
      color: "#9c27b0"
    }
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: theme.palette.grey[50], py: 4 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 2 }}>
            <SchoolIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
            <Typography variant="h3" fontWeight={800} sx={{ color: theme.palette.primary.main }}>
              EduRev
            </Typography>
          </Box>
          <Typography variant="h5" color="text.secondary" fontWeight={500}>
            Select a Faculty to View Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Choose from the faculties below to access their respective enrollment dashboards
          </Typography>
        </Box>

        {/* Faculty Cards Grid */}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {faculties.map((faculty, index) => (
            <FacultyCard key={index} {...faculty} />
          ))}
        </Grid>

        {/* Info Section */}
        <Box sx={{ mt: 8, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Click on any faculty card to view its complete dashboard with enrollment metrics, 
            course details, and student status information.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default EduRevLandingPage;
