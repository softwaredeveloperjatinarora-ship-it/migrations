"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  InputAdornment,
  CircularProgress,
  Alert,
  Fade,
  Paper,
  Grid,
  SelectChangeEvent,
  Autocomplete,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
  Search as SearchIcon,
  NoteAdd as NoteAddIcon,
  ErrorOutline as ErrorOutlineIcon,
} from "@mui/icons-material";
import BlankCard from "../../shared/BlankCard";
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { getDiscrepancy } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/discrepancyMaking/getDiscrepancy";
import { addDiscrepancy } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/discrepancyMaking/addDiscrepancy";

// Styled component for stats cards
const BoxStyled = styled(Box)(({ theme }) => ({
  padding: "16px",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
}));

// Types for discrepancy data
interface DiscrepancyData {
  courseCode: string;
  questionNo: string;
  discrepancyDetail: string;
  entryDate: string;
}

// Props interface
interface SixthStepProps {
  selectedDate?: string | null;
  selectedTime?: string;
  selectedExamType?: number;
  distinctCourses?: string[];
}

// Column definition for the table
interface HeadCell {
  id: keyof DiscrepancyData;
  label: string;
}

const headCells: HeadCell[] = [
  { id: "courseCode", label: "Course Code" },
  { id: "questionNo", label: "Question No" },
  { id: "discrepancyDetail", label: "Discrepancy Detail" },
  { id: "entryDate", label: "Entry Date" },
];

// Table toolbar component
function EnhancedTableToolbar(props: { onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void; searchTerm: string }) {
  const { onSearch, searchTerm } = props;
  const theme = useTheme();

  return (
    <Toolbar
      sx={{
        pl: { sm: 1 },
        pr: { xs: 1, sm: 1 },
        display: "flex",
        justifyContent: "space-between",
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
      }}
    >
      <Typography variant="h6" id="tableTitle" component="div">
        Discrepancy Records
      </Typography>
      <TextField
        size="small"
        variant="outlined"
        placeholder="Search..."
        value={searchTerm}
        onChange={onSearch}
        sx={{ width: 200, backgroundColor: theme.palette.mode === "light" ? "white" : "#111c2d" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
    </Toolbar>
  );
}

// Empty state component
const EmptyState = () => {
  return (
    <Box sx={{ textAlign: "center", py: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
      <Typography variant="h6">No Discrepancies Found</Typography>
      <Typography variant="body2" color="text.secondary">
        No discrepancy records available. Add a new discrepancy to get started.
      </Typography>
    </Box>
  );
};

// Main component
const SixthStep: React.FC<SixthStepProps> = ({ selectedDate, selectedTime, selectedExamType, distinctCourses }) => {
  const theme = useTheme();
  const { data: session } = useSession();
  const centerNumber = useSelector((state: any) => state.center.centerNumber);

  // State management
  const [tabIndex, setTabIndex] = useState(0);
  const [discrepancies, setDiscrepancies] = useState<DiscrepancyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successAlert, setSuccessAlert] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    courseCode: "",
    questionNo: "",
    discrepancyType: "",
    discrepancyDetail: "",
  });

  // Refs to prevent infinite loops
  const lastApiCall = useRef({ selectedDate: '', selectedTime: '', centerNumber: '' });
  const fetchDebounce = useRef<NodeJS.Timeout | null>(null);

  // Helper function to format date consistently
  const formatDate = useCallback((dateString: string): string => {
    if (!dateString) return '';

    // Handle both ISO format and simple date format
    if (dateString.includes('T')) {
      return dateString.split('T')[0];
    }

    // If it's already in YYYY-MM-DD format, return as is
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }

    // Try to parse and format
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }, []);

  // Get today's date in YYYY-MM-DD format
  const getTodaysDate = useCallback((): string => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Fetch discrepancies with proper error handling and deduplication
  const fetchDiscrepancy = useCallback(async (date: string, time: string, center: string) => {
    if (!session?.user?.token || !center) {
      console.warn("Session, token, or center number missing during fetch");
      return;
    }

    try {
      setLoading(true);
      const splitValue = session.user?.token.split("NEXT2121ANG");

      const formfields = {
        Edate: formatDate(date),
        Etime: time,
        CenterNo: center,
      };


      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);

      const response = await getDiscrepancy(Data);
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
      const parsedData = JSON.parse(decryptedData);

      if (Array.isArray(parsedData)) {
        const formattedData = parsedData.map((item: any) => ({
          courseCode: item.CourseCode || item.courseCode || '',
          questionNo: item.QuestionNo || item.questionNo || '',
          discrepancyDetail: item.DiscrepancyDetail || item.discrepancyDetail || '',
          entryDate: item.EntryDate || item.entryDate || '',
        }));

        setDiscrepancies(formattedData);
      } else {
        setDiscrepancies([]);
      }
    } catch (error) {
      console.error("Error fetching discrepancies:", error);
      setDiscrepancies([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.token, formatDate]);

  // Debounced effect for fetching data
  useEffect(() => {
    if (selectedDate && selectedTime && centerNumber) {
      const currentCall = {
        selectedDate: selectedDate || '',
        selectedTime: selectedTime || '',
        centerNumber: centerNumber || ''
      };
      const lastCall = lastApiCall.current;

      // Only make API call if parameters have actually changed
      if (
        currentCall.selectedDate !== lastCall.selectedDate ||
        currentCall.selectedTime !== lastCall.selectedTime ||
        currentCall.centerNumber !== lastCall.centerNumber
      ) {
        // Clear existing timeout
        if (fetchDebounce.current) {
          clearTimeout(fetchDebounce.current);
        }

        // Set new timeout to debounce API calls
        fetchDebounce.current = setTimeout(() => {
          lastApiCall.current = currentCall;
          fetchDiscrepancy(selectedDate, selectedTime, centerNumber);
        }, 300);
      }
    }

    // Cleanup timeout on unmount
    return () => {
      if (fetchDebounce.current) {
        clearTimeout(fetchDebounce.current);
      }
    };
  }, [selectedDate, selectedTime, centerNumber, fetchDiscrepancy]);

  // Add discrepancy with proper validation and error handling
  const handleSubmit = useCallback(async () => {
    if (!session?.user?.token || !selectedDate || !selectedTime || !centerNumber) {
      console.warn("Missing required data for submission");
      setSuccessAlert("Error: Missing required information");
      setTimeout(() => setSuccessAlert(null), 3000);
      return;
    }

    // Validate form data
    if (!formData.courseCode || !formData.questionNo || !formData.discrepancyType || !formData.discrepancyDetail) {
      setSuccessAlert("Error: Please fill in all required fields");
      setTimeout(() => setSuccessAlert(null), 3000);
      return;
    }

    setSubmitting(true);
    try {
      const splitValue = session.user?.token.split("NEXT2121ANG");

      const formfields = {
        ExamDate: formatDate(selectedDate),
        Session: selectedTime,
        CourseCode: formData.courseCode.trim(),
        QuestionNo: formData.questionNo.trim(),
        DiscrepancyDetail: `${formData.discrepancyType}: ${formData.discrepancyDetail.trim()}`,
        EntryBy: centerNumber.toString(),
        EntryDate: getTodaysDate(),
        CenterNo: centerNumber,
      };


      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);

      const response = await addDiscrepancy(Data);
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
      const parsedResponse = JSON.parse(decryptedData);


      setSuccessAlert("Discrepancy added successfully!");
      setTimeout(() => setSuccessAlert(null), 3000);

      // Reset form
      handleReset();

      // Refresh the list after a short delay
      setTimeout(() => {
        fetchDiscrepancy(selectedDate, selectedTime, centerNumber);
      }, 500);

    } catch (error) {
      console.error("Error adding discrepancy:", error);
      setSuccessAlert("Error adding discrepancy. Please try again.");
      setTimeout(() => setSuccessAlert(null), 3000);
    } finally {
      setSubmitting(false);
    }
  }, [session?.user?.token, selectedDate, selectedTime, centerNumber, formData, formatDate, getTodaysDate, fetchDiscrepancy]);

  // Handle search input change
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  // Handle tab change
  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  }, []);

  // Handle form input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  }, []);

  // Handle form reset
  const handleReset = useCallback(() => {
    setFormData({
      courseCode: "",
      questionNo: "",
      discrepancyType: "",
      discrepancyDetail: "",
    });
  }, []);

  // Filter discrepancies based on search term and today's date
  const filteredDiscrepancies = React.useMemo(() => {
    const todaysDate = getTodaysDate();

    return discrepancies.filter((disc) => {
      // Filter by today's date first
      const discDate = formatDate(disc.entryDate);
      const isTodaysDiscrepancy = discDate === todaysDate;

      // Then filter by search term if provided
      const matchesSearch = !searchTerm ||
        disc.courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disc.questionNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disc.discrepancyDetail?.toLowerCase().includes(searchTerm.toLowerCase());

      return isTodaysDiscrepancy && matchesSearch;
    });
  }, [discrepancies, searchTerm, getTodaysDate, formatDate]);

  // Calculate today's discrepancy count
  const todaysDiscrepancyCount = React.useMemo(() => {
    const todaysDate = getTodaysDate();
    return discrepancies.filter(disc => {
      const discDate = formatDate(disc.entryDate);
      return discDate === todaysDate;
    }).length;
  }, [discrepancies, getTodaysDate, formatDate]);

  // Discrepancy type options
  const discrepancyTypes = [
    "Missing Question",
    "Incorrect Marking",
    "Out-of-Syllabus Question",
    "Ambiguous Question",
    "Multiple Correct Answers",
    "No Correct Answer",
    "Question Misprint",
    "Wrong Question Numbering",
  ];

  return (
    <Box sx={{ position: "relative", px: { xs: 1, sm: 2 }, py: 2 }}>
      {/* Success Alert */}
      {successAlert && (
        <Fade in={Boolean(successAlert)}>
          <Alert
            severity={successAlert.includes("Error") ? "error" : "success"}
            sx={{
              position: "absolute",
              top: -16,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              boxShadow: theme.shadows[3],
              width: "fit-content",
              minWidth: 300,
              borderRadius: 2,
            }}
            onClose={() => setSuccessAlert(null)}
          >
            {successAlert}
          </Alert>
        </Fade>
      )}

      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ErrorOutlineIcon color="primary" />
            Discrepancy Marking
          </Typography>
          {selectedDate && selectedTime && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {selectedDate ? new Date(selectedDate).toLocaleDateString() : ""} | {selectedTime} | Exam Type: {selectedExamType}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Stats Card - showing only today's count */}
      <Box mb={3}>
        <Grid container spacing={2} textAlign="center">
          <Grid size={{ xs: 12, sm: 12 }}>
            <BoxStyled
              sx={{ backgroundColor: theme.palette.primary.light, color: theme.palette.primary.main }}
            >
              <Typography variant="h3">{todaysDiscrepancyCount}</Typography>
              <Typography variant="h6">Today's Discrepancies</Typography>
              {/* <Typography variant="caption" color="text.secondary">
                {selectedDate}
              </Typography> */}
            </BoxStyled>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs */}
      <Box sx={{ mb: 2 }}>
        <BlankCard sx={{ borderRadius: 2, overflow: "hidden", boxShadow: theme.shadows[2] }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: theme.palette.background.paper }}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              aria-label="discrepancy tabs"
              sx={{
                "& .MuiTab-root": {
                  minHeight: 48,
                  py: 1,
                  px: 2,
                  fontWeight: 500,
                  textTransform: "none",
                  "&.Mui-selected": {
                    color: theme.palette.primary.main,
                    bgcolor: theme.palette.primary.light,
                    fontWeight: 600,
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: theme.palette.primary.main,
                  height: 3,
                },
              }}
            >
              <Tab
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <NoteAddIcon fontSize="small" />
                    <Typography variant="subtitle2">Enter Discrepancy</Typography>
                  </Stack>
                }
              />
              <Tab label="View Today's Discrepancies" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ p: 2 }}>
            {tabIndex === 0 ? (
              <Box component="form">
                <Typography variant="h6" fontWeight="500" sx={{ mb: 2 }}>
                  Report New Discrepancy
                </Typography>
                <Paper elevation={0} sx={{ mb: 2, borderRadius: 2 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Autocomplete
                        options={distinctCourses || []}  // your course codes
                        value={formData.courseCode || ""}
                        onChange={(_, newValue) =>
                          setFormData((prev) => ({ ...prev, courseCode: newValue || "" }))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Course Code"
                            size="small"
                            required
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 1,
                                backgroundColor:
                                  theme.palette.mode === "light" ? "white" : "#111c2d",
                                "&:hover fieldset": { borderColor: theme.palette.primary.main },
                              },
                            }}
                          />
                        )}
                        fullWidth
                        autoHighlight
                        disableClearable
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        name="questionNo"
                        label="Question No"
                        value={formData.questionNo}
                        onChange={handleInputChange}
                        required
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1,
                            backgroundColor: theme.palette.mode === "light" ? "white" : "#111c2d",
                            "&:hover fieldset": { borderColor: theme.palette.primary.main },
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="discrepancy-type-label">Discrepancy Type</InputLabel>
                        <Select
                          labelId="discrepancy-type-label"
                          name="discrepancyType"
                          value={formData.discrepancyType}
                          label="Discrepancy Type"
                          onChange={handleInputChange}
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 1,
                              backgroundColor: theme.palette.mode === "light" ? "white" : "#111c2d",
                              "&:hover fieldset": { borderColor: theme.palette.primary.main },
                            },
                          }}
                        >
                          <MenuItem value="">
                            <em>Select Discrepancy Type</em>
                          </MenuItem>
                          {discrepancyTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        name="discrepancyDetail"
                        label="Discrepancy Detail"
                        multiline
                        rows={4}
                        value={formData.discrepancyDetail}
                        onChange={handleInputChange}
                        placeholder="Provide more details about the discrepancy..."
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1,
                            backgroundColor: theme.palette.mode === "light" ? "white" : "#111c2d",
                            "&:hover fieldset": { borderColor: theme.palette.primary.main },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleReset}
                    disabled={submitting}
                    sx={{
                      borderRadius: 1,
                      px: 2,
                      "&:hover": { bgcolor: theme.palette.grey[100] },
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={
                      submitting ||
                      !formData.courseCode ||
                      !formData.questionNo ||
                      !formData.discrepancyType ||
                      !formData.discrepancyDetail
                    }
                    sx={{
                      borderRadius: 1,
                      px: 2,
                      "&:hover": { bgcolor: theme.palette.primary.dark },
                    }}
                  >
                    {submitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Submit Discrepancy"
                    )}
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Paper elevation={1} sx={{ borderRadius: 2, overflow: "hidden" }}>
                  <EnhancedTableToolbar onSearch={handleSearchChange} searchTerm={searchTerm} />
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader size="medium">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                          {headCells.map((headCell) => (
                            <TableCell key={headCell.id} sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                              <Typography variant="subtitle2" fontWeight="600">
                                {headCell.label}
                              </Typography>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                              <CircularProgress />
                            </TableCell>
                          </TableRow>
                        ) : filteredDiscrepancies.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4}>
                              <EmptyState />
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredDiscrepancies.map((row, index) => (
                            <TableRow
                              key={`${row.courseCode}-${row.questionNo}-${index}`}
                              sx={{
                                "&:hover": { bgcolor: theme.palette.action.hover },
                                transition: "background-color 0.2s ease",
                              }}
                            >
                              <TableCell>
                                <Typography variant="body2">{row.courseCode}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{row.questionNo}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ maxWidth: 300, wordBreak: 'break-word' }}>
                                  {row.discrepancyDetail}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {new Date(row.entryDate).toLocaleDateString()}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Box>
            )}
          </Box>
        </BlankCard>
      </Box>
    </Box>
  );
};

export default SixthStep;