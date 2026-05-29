"use client";
 
import * as Yup from "yup";
import {
  Box,
  Fade,
  Grid,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Alert,
  LinearProgress,
  IconButton,
  Tooltip,
  Avatar,
  ListItemText,
  ListItemIcon,
  List,
  ListItem,
} from "@mui/material";
import React, { useState } from "react";
import BuildIcon from "@mui/icons-material/Build";
import SchoolIcon from "@mui/icons-material/School";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import { useFormik } from "formik";
import Breadcrumb from "@/app/dashboard/staff/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";

const ScholarCreditCardScheme = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [formData, setFormData] = useState({
    aadhaarCardNo: "",
    bankName: "",
    bankAccountNo: "",
    transactionDate: "",
    loanRegistrationNumber: "",
    loanAmount: "",
    utrTransactionNo: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState<{
    [key: string]: File | null;
  }>({
    disbursementDetails: null,
    academicTranscript: null,
    sanctionLetter: null,
    bonafideCertificate: null,
    universityIdCard: null,
    aadhaarCard: null,
    signature: null,
  });
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});

  const bcrumb = [
    {
      to: "/dashboard",
      title: "Dashboard",
      icon: "ic:baseline-home",
    },
    {
      title: "Students Credit Card Scheme",
    },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    if (file) {
      // Simulate upload progress
      setUploadProgress((prev) => ({ ...prev, [field]: 0 }));
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = (prev[field] || 0) + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            setUploadedFiles((prevFiles) => ({
              ...prevFiles,
              [field]: file,
            }));
            return { ...prev, [field]: 100 };
          }
          return { ...prev, [field]: newProgress };
        });
      }, 100);
    }
  };

  const handleFileDelete = (field: string) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [field]: null,
    }));
    setUploadProgress((prev) => ({
      ...prev,
      [field]: 0,
    }));
  };

  const documentFields = [
    {
      key: "disbursementDetails",
      label: "Disbursement details copy from Bihar Govt. Portal",
      icon: <DocumentScannerIcon />,
      required: true,
      color: "#1976d2",
    },
    {
      key: "academicTranscript",
      label:
        "Provisional Academic Transcript/Promotion Letter/Qualifying Exam Certificate(s)",
      icon: <SchoolIcon />,
      required: true,
      color: "#388e3c",
    },
    {
      key: "sanctionLetter",
      label: "Sanction Letter issued by state govt.",
      icon: <BadgeIcon />,
      required: true,
      color: "#f57c00",
    },
    {
      key: "bonafideCertificate",
      label:
        "Bonafide Certificate/Fee Structure/Demand Letter (issued by Account Deptt.)",
      icon: <ReceiptIcon />,
      required: true,
      color: "#7b1fa2",
    },
    {
      key: "universityIdCard",
      label: "University ID Card",
      icon: <BadgeIcon />,
      required: true,
      color: "#d32f2f",
    },
    {
      key: "aadhaarCard",
      label: "Aadhaar Card",
      icon: <PersonIcon />,
      required: true,
      color: "#0288d1",
    },
    {
      key: "signature",
      label: "Signature",
      icon: <PersonIcon />,
      required: true,
      color: "#5d4037",
    },
  ];

  const bankOptions = [
    "State Bank of India",
    "Punjab National Bank",
    "Bank of Baroda",
    "Indian Bank",
    "Central Bank of India",
    "Union Bank of India",
    "Canara Bank",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
  ];

  const accountOptions = [
    "10291092471908",
    "21913481902410",
    "49102410904194",
    "89479085759835",
  ];
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const validationSchema = Yup.object().shape({
    aadharCardNo: Yup.string()
      .required("Aadhaar Card No. is required")
      .matches(/^\d{12}$/, "Aadhaar Card No. must be 12 digits"),
    bankName: Yup.string().required("Bank Name is required"),
    bankAccountNo: Yup.string()
      .required("Bank Account No. is required")
      .matches(
        /^\d{10,16}$/,
        "Bank Account No. must be between 10 to 16 digits"
      ),
    transactionDate: Yup.date()
      .required("Transaction Date is required")
      .nullable(),
    loanRegistrationNumber: Yup.string().required(
      "Loan Registration Number is required"
    ),
    loanAmount: Yup.number()
      .required("Loan Amount is required")
      .positive("Loan Amount must be a positive number"),
    utrTransactionNo: Yup.string().required("UTR/Transaction No. is required"),
  });

  const formik = useFormik({
    initialValues: {
      aadharCardNo: "",
      bankName: "",
      bankAccountNo: "",
      transactionDate: "",
      loanRegistrationNumber: "",
      loanAmount: "",
      utrTransactionNo: "",

    },
    validationSchema,
    onSubmit: (values) => {
      // console.log("Form submitted", values);
    },
  });
  return (
    <Box>
      {/* BreeadCrumb */}
      <Box sx={{ mb: 0 }}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12 }}>
            <Breadcrumb title="ScholarShip Credit Card Scheme" items={bcrumb} />
          </Grid>
        </Grid>
      </Box>

      <Paper elevation={1} sx={{ borderRadius: 2, mb: 4, overflow: "hidden" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              py: 2.5,
              transition: "all 0.3s ease",
              fontWeight: 500,
            },
            "& .Mui-selected": {
              fontWeight: 600,
              color: "#1976d2",
            },
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px 3px 0 0",
              background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
            },
          }}
        >
          <Tab
            icon={<SchoolIcon />}
            label="New Application"
            iconPosition="start"
            sx={{ flexDirection: "row", gap: 1 }}
          />
          <Tab
            icon={<BuildIcon />}
            label="Application Status"
            iconPosition="start"
            sx={{ flexDirection: "row", gap: 1 }}
          />
        </Tabs>
      </Paper>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: activeTab === 0 ? "block" : "none" }}>
          <Fade in={activeTab === 0} timeout={800}>
            <Box>
              {/* Transaction Details Section */}
              <Card sx={{ mb: 4, borderRadius: 3 }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "#1976d2", width: 48, height: 48 }}>
                      <CreditCardIcon />
                    </Avatar>
                  }
                  title={
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 600, color: "#1976d2" }}
                    >
                      Transaction Details
                    </Typography>
                  }
                  subheader={
                    <Typography variant="body2" color="text.secondary">
                      Please provide your banking and transaction information
                    </Typography>
                  }
                  sx={{ pb: 1 }}
                />
                <Divider sx={{ mx: 2 }} />
                <CardContent sx={{ pt: 3 }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Aadhaar Card No."
                        name="aadharCardNo"
                        value={formik.values.aadharCardNo}
                        // onChange={(e) => handleInputChange('aadhaarCardNo', e.target.value)}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.aadharCardNo &&
                          Boolean(formik.errors.aadharCardNo)
                        }
                        helperText={
                          formik.touched.aadharCardNo &&
                          formik.errors.aadharCardNo
                        }
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <PersonIcon sx={{ mr: 1, color: "#666" }} />
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.15)",
                            },
                          },
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        name="loanRegistrationNumber"
                        label="Loan Registration Number"
                        value={formik.values.loanRegistrationNumber}
                        // onChange={(e) => handleInputChange('loanRegistrationNumber', e.target.value)}
                        onChange={formik.handleChange}
                        variant="outlined"
                        error={
                          formik.touched.loanRegistrationNumber &&
                          Boolean(formik.errors.loanRegistrationNumber)
                        }
                        helperText={
                          formik.touched.loanRegistrationNumber &&
                          formik.errors.loanRegistrationNumber
                        }
                        InputProps={{
                          startAdornment: (
                            <ReceiptIcon sx={{ mr: 1, color: "#666" }} />
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.15)",
                            },
                          },
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Bank Name</InputLabel>
                        <Select
                          value={formik.values.bankName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.bankName &&
                            Boolean(formik.errors.bankName)
                          }
                          // helperText={
                          //   formik.touched.bankName && formik.errors.bankName
                          // }
                          name="bankName"
                          // onChange={(e) =>
                          //   handleInputChange("bankName", e.target.value)
                          // }
                          label="Bank Name"
                          startAdornment={
                            <AccountBalanceIcon sx={{ mr: 1, color: "#666" }} />
                          }
                          sx={{
                            borderRadius: 2,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.15)",
                            },
                          }}
                        >
                          {bankOptions.map((bank) => (
                            <MenuItem key={bank} value={bank}>
                              <ListItemIcon>
                                <AccountBalanceIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary={bank} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Loan Amount"
                        name="loanAmount"
                        value={formik.values.loanAmount}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        variant="outlined"
                        error={
                          formik.touched.loanAmount &&
                          Boolean(formik.errors.loanAmount)
                        }
                        helperText={
                          formik.touched.loanAmount && formik.errors.loanAmount
                        }
                        type="number"
                        InputProps={{
                          startAdornment: (
                            <Typography sx={{ mr: 1, color: "#666" }}>
                              ₹
                            </Typography>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.15)",
                            },
                          },
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Bank Account No.</InputLabel>
                        <Select
                          value={formik.values.bankAccountNo}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.bankAccountNo &&
                            Boolean(formik.errors.bankAccountNo)
                          }
                          // helperText={
                          //   formik.touched.bankAccountNo &&
                          //   formik.errors.bankAccountNo
                          // }
                          label="Bank Account No."
                          name="bankAccountNo"
                          startAdornment={
                            <CreditCardIcon sx={{ mr: 1, color: "#666" }} />
                          }
                          sx={{
                            borderRadius: 2,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.15)",
                            },
                          }}
                        >
                          {accountOptions.map((account) => (
                            <MenuItem key={account} value={account}>
                              <ListItemIcon></ListItemIcon>
                              <ListItemText primary={account} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="UTR/Transaction No."
                        name="utrTransactionNo"
                        value={formik.values.utrTransactionNo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.utrTransactionNo &&
                          Boolean(formik.errors.utrTransactionNo)
                        }
                        helperText={
                          formik.touched.utrTransactionNo &&
                          formik.errors.utrTransactionNo
                        }
                        // onChange={(e) =>
                        //   handleInputChange("utrTransactionNo", e.target.value)
                        // }
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <ReceiptIcon sx={{ mr: 1, color: "#666" }} />
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.15)",
                            },
                          },
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Transaction Date"
                        type="date"
                        name="transactionDate"
                        value={formik.values.transactionDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.transactionDate &&
                          Boolean(formik.errors.transactionDate)
                        }
                        helperText={
                          formik.touched.transactionDate &&
                          formik.errors.transactionDate
                        }
                        // onChange={(e) =>
                        //   handleInputChange("transactionDate", e.target.value)
                        // }
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          startAdornment: (
                            <CalendarTodayIcon sx={{ mr: 1, color: "#666" }} />
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.15)",
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Documents Section */}
              <Card
                sx={{
                  mb: 4,
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "#1976D2", width: 48, height: 48 }}>
                      <AttachFileIcon />
                    </Avatar>
                  }
                  title={
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 600, color: "#1976D2" }}
                    >
                      Documents Upload
                    </Typography>
                  }
                  subheader={
                    <Typography variant="body2" color="text.secondary">
                      Please upload all required documents (Max 500KB, JPG/PDF
                      format)
                    </Typography>
                  }
                  sx={{ pb: 1 }}
                />
                <Divider sx={{ mx: 2 }} />
                <CardContent sx={{ pt: 3 }}>
                  <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                    <Typography variant="body2">
                      <strong>Important:</strong> File size should not exceed
                      500 KB and must be in JPG/PDF format. The dimensions of
                      the signature should be less than 150 x 150 and must be in
                      JPG format.
                    </Typography>
                  </Alert>

                  <Grid container spacing={3}>
                    {documentFields.map((doc) => (
                      <Grid size={{ xs: 12, md: 6 }} key={doc.key}>
                        <Paper
                          elevation={2}
                          sx={{
                            p: 3,
                            borderRadius: 3,
                            border: `2px solid ${
                              uploadedFiles[doc.key] ? "#4caf50" : "#e0e0e0"
                            }`,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                              transform: "translateY(-2px)",
                            },
                          }}
                        >
                          <Stack spacing={2}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Avatar
                                sx={{
                                  bgcolor: doc.color,
                                  width: 32,
                                  height: 32,
                                }}
                              >
                                {doc.icon}
                              </Avatar>
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: 500, fontSize: "0.95rem" }}
                              >
                                {doc.label}
                              </Typography>
                              {doc.required && (
                                <Chip
                                  label="Required"
                                  size="small"
                                  color="error"
                                  sx={{ ml: "auto" }}
                                />
                              )}
                            </Box>

                            {uploadedFiles[doc.key] ? (
                              <Box>
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  gap={1}
                                  sx={{
                                    p: 2,
                                    bgcolor: "#f8f9fa",
                                    borderRadius: 2,
                                    border: "1px solid #e9ecef",
                                  }}
                                >
                                  <CheckCircleIcon sx={{ color: "#4caf50" }} />
                                  <Typography
                                    variant="body2"
                                    sx={{ flex: 1, fontWeight: 500 }}
                                  >
                                    {uploadedFiles[doc.key]?.name}
                                  </Typography>
                                  <Stack direction="row" spacing={1}>
                                    <Tooltip title="View File">
                                      <IconButton size="small" color="primary">
                                        <VisibilityIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Delete File">
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() =>
                                          handleFileDelete(doc.key)
                                        }
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Stack>
                                </Box>
                              </Box>
                            ) : (
                              <Box>
                                {uploadProgress[doc.key] > 0 &&
                                  uploadProgress[doc.key] < 100 && (
                                    <Box sx={{ mb: 2 }}>
                                      <LinearProgress
                                        variant="determinate"
                                        value={uploadProgress[doc.key]}
                                        sx={{ borderRadius: 1, height: 6 }}
                                      />
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        Uploading... {uploadProgress[doc.key]}%
                                      </Typography>
                                    </Box>
                                  )}
                                <Button
                                  variant="outlined"
                                  component="label"
                                  startIcon={<CloudUploadIcon />}
                                  fullWidth
                                  sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    borderStyle: "dashed",
                                    borderWidth: 2,
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                      borderStyle: "solid",
                                      bgcolor: "primary.main",
                                      color: "white",
                                    },
                                  }}
                                >
                                  Choose File
                                  <input
                                    type="file"
                                    hidden
                                    accept=".jpg,.jpeg,.pdf"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0] || null;
                                      handleFileUpload(doc.key, file);
                                    }}
                                  />
                                </Button>
                              </Box>
                            )}
                          </Stack>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                  {/* Submit Button */}
                  <Box
                    display="flex"
                    justifyContent="center"
                    sx={{ mt: 4, mb: 2 }}
                  >
                    <Button
                      variant="contained"
                      size="medium"
                      type="submit"
                      disabled={!formik.isValid || formik.isSubmitting}

                      startIcon={<CheckCircleIcon />}
                      sx={{
                        px: 6,
                        py: 1.5,
                        borderRadius: 3,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        background: "#1976D2",
                      }}
                    >
                      Submit Application
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Fade>
        </Box>
      </form>
    </Box>
  );
};

export default ScholarCreditCardScheme;
