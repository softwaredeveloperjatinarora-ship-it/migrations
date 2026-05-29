"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Rating,
  TextField,
  Button,
  Chip,
  Paper,
  Divider,
  Card,
  CardContent,
  CardActions,
  Container,
  IconButton,
  Fade,
  Grow,
  Avatar,
  Stack,
  LinearProgress,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Business,
  School,
  MenuBook,
  RateReview,
  Download,
  Visibility,
  Star,
  BookmarkBorder,
  Bookmark,
  ExpandMore,
  Analytics,
  Timeline,
  Assignment,
  CheckCircle,
  Circle,
} from "@mui/icons-material";
 
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CloseIcon from "@mui/icons-material/Close";
import Loading from "@/app/loading";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Breadcrumb from "@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";

interface Course {
  code: string;
  name: string;
}

interface Unit {
  code: string;
  progress: number;
  isCompleted: boolean;
}

interface LearningMaterial {
  id: string;
  title: string;
  description: string;
  docType: string;
  isBookmarked: boolean;
}

const SelfLearningMaterial = () => {
  const courseOptions: Course[] = [
    {
      code: "AEE101",
      name: "FUNDAMENTAL SCIENCE",
    },
    {
      code: "MTH102",
      name: "CALCULUS AND ALGEBRA",
    },
    {
      code: "PHY101",
      name: "PHYSICS FOR ENGINEERS",
    },
    {
      code: "CSE201",
      name: "DATA STRUCTURES",
    },
  ];

  const unitOptions: Unit[] = [
    { code: "Unit 1", progress: 100, isCompleted: true },
    { code: "Unit 2", progress: 100, isCompleted: false },
    { code: "Unit 3", progress: 100, isCompleted: false },
    { code: "Unit 4", progress: 100, isCompleted: false },
    { code: "Unit 5", progress: 100, isCompleted: false },
    { code: "Unit 6", progress: 100, isCompleted: false },
  ];

  const learningMaterials: LearningMaterial[] = [
    {
      id: "1",
      title: "Economics - Its Subject Matter",
      description:
        "Meaning, scope and subject matter, definitions, activities, rationality assumption, concept of equilibrium, economic laws as generalization of human behavior",
      docType: "PDF",

      isBookmarked: false,
    },
    {
      id: "2",
      title: "Market Economics & Pricing",
      description:
        "Understanding market dynamics, supply and demand, price elasticity, and market equilibrium concepts",
      docType: "DOC",

      isBookmarked: true,
    },
    {
      id: "3",
      title: "Agricultural Policy Analysis",
      description:
        "Comprehensive analysis of agricultural policies, government interventions, and their economic impacts",
      docType: "PPT",
      isBookmarked: false,
    },
  ];
  const bcrumb = [
    {
      to: "/dashboard",
      title: "Dashboard",
      icon: "ic:baseline-home",
    },
    {
      title: "SelfLearningMaterial",
    },
  ];

  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>("Unit 1");
  const [conditionalUnit, setConditionalUnit] = useState<string | null>(null);
  const [remarks, setRemarks] = useState("");
  const [rating, setRating] = useState<number | null>(4);
  const [materials, setMaterials] = useState(learningMaterials);
  const [openModal, setOpenModal] = useState<any>(false);
  const [docUrl, setdocUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const handleSelectedCourse = (code: string) => {
    setSelectedCourse(code);
    // console.log("Selected course:", code);
  };

  const handleSelectedUnit = (code: string) => {
    setSelectedUnit(code);
    setConditionalUnit(code);
    // console.log("Selected unit:", code);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setdocUrl("");
    setLoading(true);
  };

  const handleViewDocument = (url: string) => {
    setdocUrl(url);
    setLoading(true);
    setOpenModal(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "#4caf50";
      case "Intermediate":
        return "#ff9800";
      case "Advanced":
        return "#f44336";
      default:
        return "#757575";
    }
  };

  const getDocTypeIcon = (docType: string) => {
    switch (docType.toLowerCase()) {
      case "pdf":
        return "📄";
      case "doc":
        return "📝";
      case "ppt":
        return "📊";
      default:
        return "📋";
    }
  };

  return (
    <Box
      sx={{
        // bgcolor: "#f8fafc",
        py: 4,
        px: 4,
      }}
    >
      {/* Header Section */}
      <Box sx={{ mb: 0 }}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12 }}>
            <Breadcrumb title="Online student support system" items={bcrumb} />
          </Grid>
        </Grid>
      </Box>

      {/* Course Selection */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <School sx={{ mr: 2, color: "#0085DB" }} />
          <Typography variant="h5" fontWeight={600}>
            Select Course
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {courseOptions.map((course, idx) => (
            <Grid size={{ xs: 12, md: 3 }} key={idx}>
              <Grow in={true} timeout={300 * (idx + 1)}>
                <Card
                  elevation={selectedCourse === course.code ? 8 : 2}
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    border:
                      selectedCourse === course.code
                        ? "2px solid #0085DB"
                        : "2px solid transparent",
                    transform:
                      selectedCourse === course.code
                        ? "scale(1.02)"
                        : "scale(1)",
                    "&:hover": {
                      elevation: 6,
                      transform: "scale(1.01)",
                    },
                  }}
                  onClick={() => handleSelectedCourse(course.code)}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" fontWeight={600} color="primary">
                        {course.code}
                      </Typography>
                      {selectedCourse === course.code && (
                        <CheckCircle sx={{ color: "#4caf50" }} />
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      {course.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
        {/* <Divider sx={{ my: 2, borderColor: "#ccc" }} /> */}
        {/* Unit Selection */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
            flexWrap: "wrap", // Responsive for smaller screens
            gap: 2,
          }}
        >
          {/* Left Section: Icon + Title */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <MenuBook sx={{ mr: 1, color: "#0085DB" }} />
            <Typography variant="h5" fontWeight={600}>
              Select Unit
            </Typography>
          </Box>

          {/* Right Section: Syllabus Info */}
       <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  <Typography
    component="span"
    sx={{
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      gap: 1,
    }}
  >
    <Chip label="Syllabus" color="primary" variant="outlined" />
    <Chip label="Worksheet" color="error" variant="outlined" />
  </Typography>
</Box>
        </Box>
        {selectedCourse ? (
          <Grid container spacing={2}>
            {unitOptions.map((unit, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={idx}>
                <Fade in={true} timeout={200 * (idx + 1)}>
                  <Card
                    elevation={selectedUnit === unit.code ? 6 : 1}
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      border:
                        selectedUnit === unit.code
                          ? "2px solid #0085DB"
                          : "1px solid #e0e0e0",
                      "&:hover": {
                        elevation: 4,
                        transform: "translateY(-2px)",
                      },
                    }}
                    onClick={() => handleSelectedUnit(unit.code)}
                  >
                    <CardContent sx={{ p: 2, textAlign: "center" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mb: 1,
                        }}
                      >
                        {selectedUnit === unit.code ? (
                          <CheckCircle
                            sx={{ color: "#4caf50", fontSize: 32 }}
                          />
                        ) : (
                          <Circle sx={{ color: "#e0e0e0", fontSize: 32 }} />
                        )}
                      </Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {unit.code}
                      </Typography>

                      <LinearProgress
                        variant="determinate"
                        value={unit.progress}
                        sx={{
                          mt: 1,
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: "#e0e0e0",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 2,
                            backgroundColor: unit.isCompleted
                              ? "#4caf50"
                              : "#4caf50",
                          },
                        }}
                      />
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", mt: 2, mb: 4 }}>
            <Analytics sx={{ mr: 2, color: "#ff9800" }} />
            <Typography variant="subtitle1" color="textSecondary">
              Please select a course first to view and select units.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Learning Materials */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Assignment sx={{ mr: 2, color: "#0085DB" }} />
          <Typography variant="h5" fontWeight={600}>
            Available Learning Materials
          </Typography>
        </Box>
        {selectedCourse ? (
          <Grid container spacing={3}>
            {materials.map((material, idx) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={material.id}>
                <Grow in={true} timeout={300 * (idx + 1)}>
                  <Card
                    elevation={3}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        elevation: 8,
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="h4" sx={{ mr: 1 }}>
                            {getDocTypeIcon(material.docType)}
                          </Typography>
                          <Chip
                            label={material.docType}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                        {/* <IconButton
                          onClick={() => toggleBookmark(material.id)}
                          sx={{
                            color: material.isBookmarked
                              ? "#ff6b6b"
                              : "#757575",
                          }}
                        >
                          {material.isBookmarked ? (
                            <Bookmark />
                          ) : (
                            <BookmarkBorder />
                          )}
                        </IconButton> */}
                      </Box>

                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {material.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mb: 2 }}
                      >
                        {material.description}
                      </Typography>
                    </CardContent>

                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Stack direction="row" spacing={1} width="100%">
                        <Button
                          variant="contained"
                          startIcon={<Visibility />}
                          fullWidth
                          onClick={() => {
                            handleViewDocument(
                              "https://docs.google.com/spreadsheets/d/11LOIsg7VuYY1YGUYXbZyvFH-FibpQ6bO5WX_6hNIra4/edit?usp=sharing"
                            );
                          }}
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                          }}
                        >
                          View
                        </Button>
                        <Dialog
                          open={openModal}
                          onClose={handleCloseModal}
                          fullWidth
                          maxWidth="lg"
                        >
                          <DialogTitle
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            Document Preview
                            <IconButton onClick={handleCloseModal}>
                              <CloseIcon />
                            </IconButton>
                          </DialogTitle>

                          <DialogContent dividers sx={{ position: "relative" }}>
                            {/* Loader */}
                            {loading && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  zIndex: 2,
                                }}
                              >
                                <Loading />
                              </Box>
                            )}

                            {/* Iframe */}
                            <Box
                              sx={{
                                height: "80vh",
                                opacity: loading ? 0.5 : 1,
                              }}
                            >
                              <iframe
                                src={docUrl ?? undefined}
                                width="100%"
                                height="100%"
                                style={{ border: "none" }}
                                allow="autoplay"
                                title="Document Viewer"
                                onLoad={() => setLoading(false)}
                              />
                            </Box>
                          </DialogContent>
                        </Dialog>
                      </Stack>
                    </CardActions>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", mt: 2, mb: 2 }}>
            <Analytics sx={{ mr: 2, color: "#ff9800" }} />
            <Typography variant="subtitle1" color="textSecondary">
              Please select a course first to view and select units.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Rating & Feedback */}
      <Accordion
        elevation={2}
        sx={{
          mb: 4,
          borderRadius: 2,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: "#f8f9fb",
            borderBottom: "1px solid #e0e0e0",
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <RateReview sx={{ mr: 2, color: "#0085DB" }} />
            <Typography variant="h6" fontWeight={600}>
              Course Feedback
            </Typography>
          </Box>
        </AccordionSummary>

        <AccordionDetails>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom>
                Rate this course
              </Typography>
              <Rating
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                size="large"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Your feedback and remarks"
                multiline
                rows={4}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                variant="outlined"
                sx={{ mb: 3 }}
              />
              <Alert severity="info" sx={{ mt: 0, mb: 2 }}>
                In case of any query/issue related to “Self Learning Material”,
                <a href="/rms" style={{ marginLeft: 4 }}>
                  Click Here.
                </a>
              </Alert>

              <Button
                variant="contained"
                size="large"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 4,
                }}
              >
                Submit Feedback
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default SelfLearningMaterial;
