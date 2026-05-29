"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Container,
  Link,
  Grid,
  Avatar,
  useTheme,
} from "@mui/material";
import {
  School as SchoolIcon,
  ArrowForward as ArrowForwardIcon,
  Groups as GroupsIcon,
  CheckCircle as CheckCircleIcon,
  WorkspacePremium as WorkspacePremiumIcon,
  Accessibility as AccessibilityIcon,
  ArrowBack as ArrowBackIcon,
  MenuBook as MenuBookIcon,
} from "@mui/icons-material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Circular Progress Component with animation
const CircularProgressBar = ({ percentage, color }: { percentage: number; color: string }) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <Box sx={{ position: "relative", width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 1.5s ease-in-out" }}
        />
      </svg>
      <Box sx={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1 }}>
          {Math.round(animatedPercentage)}%
        </Typography>
      </Box>
    </Box>
  );
};

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`edu-tabpanel-${index}`}
      aria-labelledby={`edu-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
};

// Card color palette using theme
const cardColors = [
  { primary: "#667eea", secondary: "#764ba2", accent: "#a78bfa", bg: "#f5f3ff", progress: "#c4b5fd" },
  { primary: "#06b6d4", secondary: "#0891b2", accent: "#22d3ee", bg: "#ecfeff", progress: "#67e8f9" },
  { primary: "#10b981", secondary: "#059669", accent: "#34d399", bg: "#ecfdf5", progress: "#6ee7b7" },
  { primary: "#f59e0b", secondary: "#d97706", accent: "#fbbf24", bg: "#fffbeb", progress: "#fcd34d" },
  { primary: "#ef4444", secondary: "#dc2626", accent: "#f87171", bg: "#fef2f2", progress: "#fca5a5" },
  { primary: "#8b5cf6", secondary: "#7c3aed", accent: "#a78bfa", bg: "#f5f3ff", progress: "#c4b5fd" },
  { primary: "#ec4899", secondary: "#db2777", accent: "#f472b6", bg: "#fdf2f8", progress: "#f9a8d4" },
  { primary: "#14b8a6", secondary: "#0d9488", accent: "#2dd4bf", bg: "#f0fdfa", progress: "#5eead4" },
  { primary: "#6366f1", secondary: "#4f46e5", accent: "#818cf8", bg: "#eef2ff", progress: "#a5b4fc" },
  { primary: "#f97316", secondary: "#ea580c", accent: "#fb923c", bg: "#fff7ed", progress: "#fdba74" },
];

// Border left colors using theme palette colors (warning=orange, error=red, success=green)
const borderLeftColors = ["#f97316", "#ef4444", "#10b981"];

const getBorderColor = (index: number) => borderLeftColors[index % 3];

const cardData = [
  { id: 1, percentage: 73.06, divisionCode: "E", divisionName: "School of Electronics and Electrical Engineering", totalStudents: 1095, enrolledStudents: 800 },
  { id: 2, percentage: 82.4, divisionCode: "C", divisionName: "School of Computer Science and Engineering", totalStudents: 2150, enrolledStudents: 1850 },
  { id: 3, percentage: 68.9, divisionCode: "M", divisionName: "School of Mechanical Engineering", totalStudents: 980, enrolledStudents: 720 },
  { id: 4, percentage: 91.2, divisionCode: "B", divisionName: "School of Business and Management", totalStudents: 3200, enrolledStudents: 2950 },
  { id: 5, percentage: 77.5, divisionCode: "A", divisionName: "School of Architecture and Design", totalStudents: 750, enrolledStudents: 580 },
  { id: 6, percentage: 85.3, divisionCode: "P", divisionName: "School of Pharmacy and Healthcare", totalStudents: 1100, enrolledStudents: 940 },
  { id: 7, percentage: 62.1, divisionCode: "L", divisionName: "School of Law and Justice", totalStudents: 650, enrolledStudents: 420 },
  { id: 8, percentage: 88.7, divisionCode: "S", divisionName: "School of Sciences and Research", totalStudents: 1800, enrolledStudents: 1600 },
  { id: 9, percentage: 74.8, divisionCode: "H", divisionName: "School of Humanities and Social Sciences", totalStudents: 920, enrolledStudents: 710 },
  { id: 10, percentage: 69.5, divisionCode: "D", divisionName: "School of Dental Sciences", totalStudents: 480, enrolledStudents: 340 },
];

// Mock data for expanded cards (faculty/subject details)
const expandedCardData = [
  {
    parentId: 1,
    facultyName: "Dr. Krishan Arora",
    course: "Power Systems",
    totalStudents: 185,
    enrolledStudents: 151,
    appliedStudents: 93,
    percentage: 100,
  },
  {
    parentId: 1,
    facultyName: "Dr. Rajesh Kumar",
    course: "Digital Electronics",
    totalStudents: 200,
    enrolledStudents: 180,
    appliedStudents: 120,
    percentage: 90,
  },
  {
    parentId: 2,
    facultyName: "Dr. Amit Sharma",
    course: "Data Structures",
    totalStudents: 250,
    enrolledStudents: 240,
    appliedStudents: 200,
    percentage: 96,
  },
  {
    parentId: 3,
    facultyName: "Dr. Suresh Patel",
    course: "Thermodynamics",
    totalStudents: 150,
    enrolledStudents: 130,
    appliedStudents: 100,
    percentage: 87,
  },
];

const EduRevDashboard = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const facultyParam = searchParams.get('faculty');

  // Get faculty display name based on parameter
  const getFacultyName = () => {
    switch(facultyParam) {
      case 'technology':
        return 'Lovely Faculty of Technology and Sciences';
      case 'business':
        return 'Lovely Faculty of Business and Arts';
      case 'medical':
        return 'Lovely Faculty of Applied Medical Sciences';
      default:
        return 'Edu Revolution Dashboard';
    }
  };

  const primaryColor = theme.palette.primary.main;
  const primaryLight = theme.palette.primary.light;
  const primaryContrast = theme.palette.primary.contrastText;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCardClick = (cardId: number) => {
    setSelectedCardId(selectedCardId === cardId ? null : cardId);
  };

  const handleBackClick = () => {
    setSelectedCardId(null);
  };

  const getExpandedCards = (parentId: number) => {
    return expandedCardData.filter((card) => card.parentId === parentId);
  };

  const selectedCard = selectedCardId ? cardData.find(card => card.id === selectedCardId) : null;
  const expandedCards = selectedCardId ? getExpandedCards(selectedCardId) : [];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: theme.palette.grey[100], py: 2 }}>
      {/* Header - using theme palette */}
      <Box sx={{ bgcolor: primaryColor, color: primaryContrast, py: 3, px: 3, borderRadius: "0 0 30px 30px", boxShadow: "0 10px 40px rgba(102, 126, 234, 0.3)", mb: 3, position: "relative", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", top: -30, left: -30, width: 120, height: 120, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.1)" }} />
        <Box sx={{ position: "absolute", bottom: -50, right: -50, width: 150, height: 150, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.08)" }} />
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          {/* Back Button - shown when a card is selected */}
          {selectedCardId && (
            <Box 
              onClick={handleBackClick}
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 0.5, 
                cursor: "pointer",
                mb: 2,
                width: "fit-content",
                p: 1,
                borderRadius: 1,
                transition: "all 0.2s ease",
                "&:hover": { bgcolor: "rgba(255,255,255,0.15)" }
              }}
            >
              <ArrowBackIcon />
              <Typography variant="body2" fontWeight={600}>Back</Typography>
            </Box>
          )}
          <Typography variant="h5" sx={{ fontWeight: 800, textAlign: "center", letterSpacing: "1px", textShadow: "2px 2px 4px rgba(0,0,0,0.2)", fontSize: { xs: "1.5rem", md: "2rem" } }}>
            {getFacultyName()}
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", mt: 1, opacity: 0.9, fontWeight: 500 }}>
            {selectedCardId && selectedCard ? selectedCard.divisionName : "School of Electronics and Electrical Engineering"}
          </Typography>
        </Container>
      </Box>

      {/* Tabs - using theme palette */}
      <Container maxWidth="xl">
        <Box sx={{ bgcolor: theme.palette.background.paper, borderRadius: 2, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", mb: 3, overflow: "hidden" }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="Edu Rev tabs" centered sx={{ 
            "& .MuiTab-root": { fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", py: 1.5, px: 3 }, 
            "& .Mui-selected": { color: primaryColor, bgcolor: primaryLight }, 
            "& .MuiTabs-indicator": { bgcolor: primaryColor, height: 3, borderRadius: "3px 3px 0 0" } 
          }}>
            <Tab label="Overview" />
            <Tab label="Analytics" />
            <Tab label="Settings" />
          </Tabs>
        </Box>

        {/* First Tab */}
        <TabPanel value={tabValue} index={0}>
          {/* Faculty View - shown when a card is selected */}
          {selectedCardId && selectedCard && (
            <Box 
              sx={{ 
                animation: "fadeIn 0.4s ease-out",
                "@keyframes fadeIn": {
                  from: { opacity: 0, transform: "translateY(20px)" },
                  to: { opacity: 1, transform: "translateY(0)" },
                }
              }}
            >
              <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: primaryColor, color: primaryContrast }}>
                  <SchoolIcon fontSize="large" />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={800} color={theme.palette.text.primary}>{selectedCard.divisionName}</Typography>
                  <Typography variant="body2" color={theme.palette.text.secondary}>Faculty Details</Typography>
                </Box>
              </Box>
              <Grid container spacing={3}>
                {expandedCards.length > 0 ? (
                  expandedCards.map((expandedCard, expIndex) => {
                    const expColors = cardColors[(selectedCard.id + expIndex) % cardColors.length];
                    return (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={expIndex}>
                        <Card 
                          sx={{ 
                            borderRadius: 3, 
                            boxShadow: "0 8px 30px rgba(0,0,0,0.12)", 
                            overflow: "hidden",
                            transition: "all 0.3s ease",
                            "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 40px rgba(0,0,0,0.18)" }
                          }}
                        >
                          <Box sx={{ bgcolor: primaryColor, color: primaryContrast, py: 2, px: 2, position: "relative", overflow: "hidden" }}>
                            <Box sx={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.1)" }} />
                            <Typography variant="h6" fontWeight={800} sx={{ position: "relative", zIndex: 1 }}>Edu Rev</Typography>
                          </Box>
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                              <Avatar
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(expandedCard.facultyName)}&background=${expColors.primary.replace('#', '')}&color=fff&size=64`}
                                alt={expandedCard.facultyName}
                                sx={{ width: 56, height: 56, border: `3px solid ${expColors.primary}` }}
                              />
                              <Box>
                                <Typography variant="body1" fontWeight={700} color={theme.palette.text.primary}>
                                  {expandedCard.facultyName}
                                </Typography>
                                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>
                                  {expandedCard.course}
                                </Typography>
                              </Box>
                            </Box>
                            <Grid container spacing={2}>
                              <Grid size={{ xs: 6 }}>
                                <Box sx={{ p: 1.5, bgcolor: theme.palette.grey[100], borderRadius: 1, borderLeft: `3px solid ${expColors.primary}` }}>
                                  <Typography variant="caption" color={theme.palette.text.secondary}>Total</Typography>
                                  <Typography variant="body2" fontWeight={700}>{expandedCard.totalStudents}</Typography>
                                </Box>
                              </Grid>
                              <Grid size={{ xs: 6 }}>
                                <Box sx={{ p: 1.5, bgcolor: theme.palette.grey[100], borderRadius: 1, borderLeft: `3px solid ${expColors.secondary}` }}>
                                  <Typography variant="caption" color={theme.palette.text.secondary}>Enrolled</Typography>
                                  <Typography variant="body2" fontWeight={700}>{expandedCard.enrolledStudents}/{expandedCard.appliedStudents}</Typography>
                                </Box>
                              </Grid>
                            </Grid>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2 }}>
                              <Typography variant="caption" fontWeight={700} color={expColors.primary} textTransform="uppercase" letterSpacing="0.5px">Percentage</Typography>
                              <Typography variant="h5" fontWeight={800} sx={{ color: expColors.primary }}>{expandedCard.percentage}%</Typography>
                            </Box>
                            <Link 
                              href="/dashboard/staff/EduRev/student-enrollment-status"
                              sx={{ 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                gap: 0.5, 
                                color: primaryContrast, 
                                textDecoration: "none", 
                                fontWeight: 700, 
                                fontSize: "0.75rem", 
                                textTransform: "uppercase", 
                                letterSpacing: "0.5px", 
                                py: 1.5, 
                                mt: 2,
                                borderRadius: 1, 
                                bgcolor: primaryColor,
                                transition: "all 0.2s ease",
                                "&:hover": { gap: 1, bgcolor: theme.palette.primary.dark }
                              }}
                            >
                              Student Enrolment Status <ArrowForwardIcon fontSize="small" />
                            </Link>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })
                ) : (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ p: 4, textAlign: "center", bgcolor: theme.palette.background.paper, borderRadius: 2 }}>
                      <Typography variant="body1" color={theme.palette.text.secondary}>No faculty data available for this division</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}

          {/* Cards Grid - fades out when a card is selected */}
          <Box sx={{ 
            opacity: selectedCardId ? 0 : 1, 
            transition: "opacity 0.3s ease-in-out",
            pointerEvents: selectedCardId ? "none" : "auto"
          }}>
          <Grid container spacing={2}>
            {cardData.map((card, index) => {
              const colors = cardColors[index % cardColors.length];
              const isSelected = selectedCardId === card.id;
              const borderColor = getBorderColor(index);

              return (
                <React.Fragment key={card.id}>
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <Card 
                      sx={{ 
                        borderRadius: 2, 
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)", 
                        overflow: "hidden", 
                        height: "100%", 
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
                        cursor: "pointer",
                        borderLeft: `6px solid ${borderColor}`,
                        "&:hover": { transform: "translateY(-6px)", boxShadow: "0 12px 30px rgba(0,0,0,0.15)" },
                        border: isSelected ? `2px solid ${colors.primary}` : "2px solid transparent",
                      }}
                      onClick={() => handleCardClick(card.id)}
                    >
                      {/* Card Header - using theme palette */}
                      <Box sx={{ bgcolor: primaryColor, color: primaryContrast, py: 1.5, px: 2, position: "relative", overflow: "hidden", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ position: "relative", zIndex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "calc(100% - 80px)", display: "flex", alignItems: "center", gap: 1 }}>
                          <Link 
                            href={`/dashboard/staff/EduRev/course-details?school=${encodeURIComponent(card.divisionName)}`}
                            onClick={(e) => e.stopPropagation()}
                            sx={{ 
                              display: "flex", 
                              alignItems: "center", 
                              justifyContent: "center",
                              color: "white",
                              opacity: 0.9,
                              transition: "all 0.2s ease",
                              "&:hover": { opacity: 1, transform: "scale(1.15)" }
                            }}
                          >
                            <MenuBookIcon fontSize="medium" />
                          </Link>
                          <Typography variant="subtitle2" fontWeight={800} sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.divisionName}</Typography>
                        </Box>
                        <Link 
                          href="/dashboard/staff/EduRev/metric-details"
                          sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            color: "white",
                            opacity: 0.9,
                            transition: "all 0.2s ease",
                            "&:hover": { opacity: 1, transform: "scale(1.15)" }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <AccessibilityIcon fontSize="medium" />
                        </Link>
                        <Box sx={{ position: "absolute", top: -15, right: -15, width: 50, height: 50, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.15)" }} />
                      </Box>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                          <CircularProgressBar percentage={card.percentage} color={primaryColor} />
                        </Box>
                        <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                          <Box sx={{ flex: 1, p: 1, bgcolor: colors.bg, borderRadius: 1, borderLeft: `3px solid ${colors.primary}` }}>
                            <Typography variant="caption" color={theme.palette.text.secondary}>Total</Typography>
                            <Typography variant="body2" fontWeight={700}>{card.totalStudents}</Typography>
                          </Box>
                          <Box sx={{ flex: 1, p: 1, bgcolor: colors.bg, borderRadius: 1, borderLeft: `3px solid ${colors.secondary}` }}>
                            <Typography variant="caption" color={theme.palette.text.secondary}>Enrolled</Typography>
                            <Typography variant="body2" fontWeight={700}>{card.enrolledStudents}</Typography>
                          </Box>
                        </Box>
                        {/* Student Enrollment Status Button - using theme palette */}
                        <Link 
                          href="/dashboard/staff/EduRev/student-enrollment-status"
                          onClick={(e) => e.stopPropagation()}
                          sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            gap: 0.5, 
                            color: primaryContrast, 
                            textDecoration: "none", 
                            fontWeight: 700, 
                            fontSize: "0.75rem", 
                            textTransform: "uppercase", 
                            letterSpacing: "0.5px", 
                            py: 1, 
                            borderRadius: 1, 
                            bgcolor: primaryColor,
                            transition: "all 0.2s ease",
                            "&:hover": { gap: 1, bgcolor: theme.palette.primary.dark }
                          }}
                        >
                          Student Enrollment Status <ArrowForwardIcon fontSize="small" />
                        </Link>
                      </CardContent>
                    </Card>
                  </Grid>
                </React.Fragment>
              );
            })}
          </Grid>
          </Box>
        </TabPanel>

        {/* Second Tab - using theme palette */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "300px", bgcolor: theme.palette.background.paper, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: primaryColor, mb: 1 }}>Coming Soon</Typography>
            <Typography variant="body1" color={theme.palette.text.secondary} fontWeight={500}>Analytics features are under development</Typography>
          </Box>
        </TabPanel>

        {/* Third Tab - using theme palette */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "300px", bgcolor: theme.palette.background.paper, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: primaryColor, mb: 1 }}>Coming Soon</Typography>
            <Typography variant="body1" color={theme.palette.text.secondary} fontWeight={500}>Settings options are under development</Typography>
          </Box>
        </TabPanel>
      </Container>
    </Box>
  );
};

export default EduRevDashboard;
