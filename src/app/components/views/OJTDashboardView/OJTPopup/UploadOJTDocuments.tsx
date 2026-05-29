

"use client";

import React, {  useState } from "react";
import ArticleIcon from "@mui/icons-material/Article";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  FormControlLabel,
  Switch,
  Divider,
  TextField,
  Tooltip,
  Chip,
  Dialog,
  IconButton,
  Modal,
  Snackbar,
  Alert,
} from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BusinessIcon from "@mui/icons-material/Business";
import HistoryIcon from "@mui/icons-material/History";
import CloseIcon from "@mui/icons-material/Close";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import Scrollbar from "@/app/components/custom-scroll/Scrollbar";
import { IconX } from "@tabler/icons-react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  width: { xs: '90%', sm: 500 },
  height: 'auto',
};
const ojtMonthsData = [
  {
    id: 1,
    name: "January",
    category: "Approved",
    time: "2 hours ago",
    message: "N/A",
    year: 2025,
  },
  {
    id: 2,
    name: "February",
    category: "Disapproved",
    time: "1 day ago",
    message:
      "Literature from 45 BC, making lorem kffwjew kjwijwiuwiuti wit iuwibw ",
    year: 2025,
  },
  {
    id: 3,
    name: "March",
    category: "Pending",
    time: "1 day ago",
    message: "Latin professor at Hampden-Sy...",
    year: 2025,
  },
  {
    id: 4,
    name: "April",
    category: "Exemption",
    time: "1 day ago",
    message: "the cites of the word in classical.",
    year: 2025,
  },
  {
    id: 5,
    name: "May",
    category: "Approved",
    time: "3 days ago",
    message: "Documents verified successfully.",
    year: 2025,
  },
  {
    id: 6,
    name: "June",
    category: "Pending",
    time: "5 days ago",
    message: "Awaiting further review.",
    year: 2025,
  },

];

const ojtGuidelines = [
  {
    id: 1,
    rule: "Submit documents only in PDF format with no special characters in filenames.",
  },
  {
    id: 2,
    rule: "Ensure all scanned documents are clear, legible, and not blurry.",
  },
  {
    id: 3,
    rule: "Include required content such as attendance logs and supervisor signatures.",
  },
  { id: 4, rule: "Maintain correct order of pages in multi-page PDFs." },
  { id: 5, rule: "File size must not exceed 5MB for smooth upload." },
];

interface upload {
  title: string;
  status: string;
  time: string;
  icon: React.JSX.Element;
  color: string;
}
const uploadDocumentsByMonths: Record<string, upload[]> = {
  January: [
    {
      title: "Supporting Document",
      status: "Pending",
      time: "5 mins",
      icon: <DocumentScannerOutlinedIcon />,
      color: "#007BFF",
    },
    {
      title: "SalarySlip",
      status: "Pending",
      time: "5 mins",
      icon: <AttachMoneyIcon />,
      color: "#007BFF",
    },
    {
      title: "Bank Statement",
      status: "Pending",
      time: "10 mins",
      icon: <AccountBalanceIcon />,
      color: "#6C757D",
    },
    {
      title: "Monthly Report",
      status: "Pending",
      time: "15 mins",
      icon: <ReceiptIcon />,
      color: "#FFC107",
    },
    {
      title: "Company Attendance",
      status: "Pending",
      time: "20 mins",
      icon: <BusinessIcon />,
      color: "#FF6B6B",
    },
  ],
  February: [
    {
      title: "SalarySlip",
      status: "uploaded",
      time: "5 mins",
      icon: <AttachMoneyIcon />,
      color: "#007BFF",
    },
    {
      title: "Bank Statement",
      status: "Pending",
      time: "10 mins",
      icon: <AccountBalanceIcon />,
      color: "#6C757D",
    },
    {
      title: "Monthly Report",
      status: "Pending",
      time: "15 mins",
      icon: <ReceiptIcon />,
      color: "#FFC107",
    },
    {
      title: "Company Attendance",
      status: "Pending",
      time: "20 mins",
      icon: <BusinessIcon />,
      color: "#FF6B6B",
    },
  ],
  March: [
    {
      title: "SalarySlip",
      status: "Pending",
      time: "5 mins",
      icon: <AttachMoneyIcon />,
      color: "#007BFF",
    },
    {
      title: "Bank Statement",
      status: "Pending",
      time: "10 mins",
      icon: <AccountBalanceIcon />,
      color: "#6C757D",
    },
    {
      title: "Monthly Report",
      status: "Pending",
      time: "15 mins",
      icon: <ReceiptIcon />,
      color: "#FFC107",
    },
    {
      title: "Company Attendance",
      status: "Pending",
      time: "20 mins",
      icon: <BusinessIcon />,
      color: "#FF6B6B",
    },
  ],
  April: [
    {
      title: "SalarySlip",
      status: "Pending",
      time: "5 mins",
      icon: <AttachMoneyIcon />,
      color: "#007BFF",
    },
    {
      title: "Bank Statement",
      status: "Pending",
      time: "10 mins",
      icon: <AccountBalanceIcon />,
      color: "#6C757D",
    },
    {
      title: "Monthly Report",
      status: "Pending",
      time: "15 mins",
      icon: <ReceiptIcon />,
      color: "#FFC107",
    },
    {
      title: "Company Attendance",
      status: "Pending",
      time: "20 mins",
      icon: <BusinessIcon />,
      color: "#FF6B6B",
    },
  ],
  May: [
    {
      title: "SalarySlip",
      status: "Pending",
      time: "5 mins",
      icon: <AttachMoneyIcon />,
      color: "#007BFF",
    },
    {
      title: "Bank Statement",
      status: "Pending",
      time: "10 mins",
      icon: <AccountBalanceIcon />,
      color: "#6C757D",
    },
    {
      title: "Monthly Report",
      status: "Pending",
      time: "15 mins",
      icon: <ReceiptIcon />,
      color: "#FFC107",
    },
    {
      title: "Company Attendance",
      status: "Pending",
      time: "20 mins",
      icon: <BusinessIcon />,
      color: "#FF6B6B",
    },
  ],
  June: [
    {
      title: "SalarySlip",
      status: "Pending",
      time: "5 mins",
      icon: <AttachMoneyIcon />,
      color: "#007BFF",
    },
    {
      title: "Bank Statement",
      status: "Pending",
      time: "10 mins",
      icon: <AccountBalanceIcon />,
      color: "#6C757D",
    },
    {
      title: "Monthly Report",
      status: "Pending",
      time: "15 mins",
      icon: <ReceiptIcon />,
      color: "#FFC107",
    },
    {
      title: "Company Attendance",
      status: "Pending",
      time: "20 mins",
      icon: <BusinessIcon />,
      color: "#FF6B6B",
    },
  ],
};





interface Documents {
  SalarySlip: string | null;
  bankStatement: string | null;
  monthlyReport: string | null;
  companyAttendance: string | null;
  salaryAmount: string;
  [key: string]: string | null | false;

}




// Sample documents object using that type


interface UploadDocumentsProps {
  isOpen: boolean;
  closeModal: (data?: boolean) => void;

}

const UploadDocuments: React.FC<UploadDocumentsProps> = ({ isOpen, closeModal }) => {

  if (!isOpen) return null;
  const [openUploadDocuments, setOpenUploadFiles] = React.useState(false);

  const handleClose = () => {
    closeModal(false)
    setOpenUploadFiles(false);
    //console.log("show",show);
    //setShow(false);
    setShow(!show);
  };




  const [show, setShow] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectMonth, setSelectMonth] = useState<string>("January");
  const [submitData, setSubmitData] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showMonthHistory, setShowMonthHistory] = useState<boolean>(false);
  const [stipend, setStipend] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [showFileInput, setShowFileInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [exemptionReason, setExemptionReason] = useState("");
  const [openToast, setOpenToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [ErroropenToast, setErrorOpenToast] = useState(false);




  // const handleUploadClick = () => {
  //   setShowFileInput(true); // show input field
  //   fileInputRef.current?.click(); // auto-open file dialog (optional)
  // };

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const [salaryMode, setSalaryMode] = useState<string>("Online"); // state to track selected value
  // console.log(salaryMode);

  const handleSalaryModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSalaryMode(event.target.value);
  };


  //^ Open Modal for uploading Id Card
  const [open, setOpen] = useState(false);
  const [idCardIssued, setIdCardIssued] = useState<string | null>(null);

  const handleOpen = () => setOpen(true);

  const handleCloseModal = () => {
    setOpen(false);
    //setIdCardIssued(null); // reset on close
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const [documents, setDocuments] = useState<Documents>({
    SalarySlip: null,
    bankStatement: null,
    monthlyReport: null,
    companyAttendance: null,
    salaryAmount: stipend || "",
  });






  //^ Handle Change for File Uploading
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    const fieldName = e.target.name; // This will be the activity.title
    // console.log(fieldName);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setSelectedFile(selectedFile || null);
        setUploadedImage(base64String); // If you're previewing the uploaded image
        setDocuments((prevDocuments) => ({
          ...prevDocuments,
          [fieldName]: base64String, // Dynamically set the correct document
        }));
      };
      reader.readAsDataURL(selectedFile); // Convert to base64
    }
  };

  //^ Submit Function
  const handleSubmit = () => {
    setOpenToast(true);
    return;
    // setSubmitData(true);
  };

  //^ Ojt Category Filter
  const filteringStatus = ojtMonthsData.filter((email) =>
    filterStatus
      ? email.category.toLowerCase() === filterStatus.toLowerCase()
      : true
  );



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      if (file.type !== "application/pdf") {

        setErrorOpenToast(true);
        setUploadedFile(null);
        return;
      }

      setErrorMessage(""); // Clear previous error
      setUploadedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleDelete = () => {
    setUploadedFile(null);
    setPreviewURL(null);
  };

  const handleView = () => {
    if (previewURL) window.open(previewURL, "_blank");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Approved":
        return "success";
      case "Disapproved":
        return "error";
      case "Pending":
        return "primary";
      case "Exemption":
        return "default";
      default:
        return "default";
    }
  };


  // const filteredActivities = uploadDocumentsByMonths[selectMonth]?.filter((activity) => {
  //   if (showInput) {
  //     return (
  //       activity.title !== "SalarySlip" &&
  //       activity.title !== "Bank Statement" &&
  //       activity.title !== "Supporting Document"
  //     );
  //   }
  //   if (salaryMode !== "Online") {
  //     return (
  //       activity.title !== "SalarySlip" &&
  //       activity.title !== "Bank Statement"
  //     );
  //   }
  //   if (activity.title === "Supporting Document") {
  //     return false;
  //   }
  //   return true;
  // }) || [];

  // const requiredDocs = filteredActivities.map((activity) => activity.title);

  // const allFilesUploaded = requiredDocs.every(
  //   (title) => documents[title] && documents[title] !== ""
  // );

  // const isSalaryFilled = documents.salaryAmount.trim() !== "";
  // const isExemptionReasonValid = !showInput || exemptionReason.trim() !== "";

  // const isSubmitDisabled = !allFilesUploaded || !isSalaryFilled || !isExemptionReasonValid;


  // const isSubmitdisabled = !allFilesUploaded 

  const filteredActivities = uploadDocumentsByMonths[selectMonth]?.filter((activity) => {
    if (showInput) {
      return (
        activity.title !== "SalarySlip" &&
        activity.title !== "Bank Statement" &&
        activity.title !== "Supporting Document"
      );
    }
    if (salaryMode !== "Online") {
      return (
        activity.title !== "SalarySlip" &&
        activity.title !== "Bank Statement"
      );
    }
    if (activity.title === "Supporting Document") {
      return false;
    }
    return true;
  }) || [];

  const requiredDocs = filteredActivities.map((activity) => activity.title);

  const allFilesUploaded = requiredDocs.every(
    (title) => documents[title] && documents[title] !== ""
  );

  const isSalaryFilled = documents.salaryAmount.trim() !== "";
  const isExemptionReasonValid = !showInput || exemptionReason.trim() !== "";



  const isSubmitDisabled = !allFilesUploaded || !isSalaryFilled || !isExemptionReasonValid

  const isIDCardUploaded = !!uploadedFile;

  const isdocumentuploaded = !isIDCardUploaded;



  return (
    // show && (
    <>
      {/* {uploadedImage && (
        <div>
          <Image src={uploadedImage} alt="Uploaded Image" width={500} height={500} />
        </div>
      )  
      } */}
      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={() => setOpenToast(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenToast(false)} severity="error" sx={{ width: "150%" }}>
          All the documents submitted successfully.
        </Alert>

      </Snackbar>
      <Snackbar
        open={ErroropenToast}
        autoHideDuration={3000}
        onClose={() => setErrorOpenToast(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setErrorOpenToast(false)} severity="error" sx={{ width: "150%" }}>
          Please choose a PDF file only.
        </Alert>

      </Snackbar>

      <Box
        sx={{
          maxWidth: 900,
          margin: "20px auto",
          padding: 0,
          border: "1px solid #f0f0f0",
          borderRadius: 1,
          marginTop: 5
        }}
      >


        <Dialog
          open={isOpen}
          onClose={handleClose}
          scroll="paper"
          fullWidth
          maxWidth="lg"
          PaperProps={{
            sx: {
              width: { xs: "90%", md: "40%" },
              height: { md: "85%" },
            },
          }}
        >
          <Scrollbar
            sx={{
              height: { xs: '200px', md: '638px' }
            }}
          >


            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center", // Ensures vertical alignment
                color: (theme: {
                  palette: { mode: string; text: { primary: string } };
                }) => theme.palette.text.primary,
                fontSize: { xs: "1.2rem", sm: "1.2rem", md: "1rem" },
                m: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                Upload Documents
                <Chip
                  label="Upload Id Card"
                  size="small"
                  onClick={handleOpen}
                  sx={{ borderColor: "2px solid green", ml: 1 }}
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Tooltip title="Month History">
                  <HistoryIcon
                    onClick={() => setShowMonthHistory(!showMonthHistory)}
                    sx={{ cursor: "pointer" }}
                  />
                </Tooltip>
                <IconButton onClick={handleClose} size="small" sx={{ ml: 2 }}>
                  <IconX size={24} />
                </IconButton>
              </Box>
            </Typography>

            <Modal open={open} onClose={handleClose} >
              <Box sx={style}>
                <IconButton
                  onClick={handleCloseModal}
                  sx={{ position: "absolute", top: 8, right: 8, }}
                >
                  <CloseIcon sx={{ m: 6 }} />
                </IconButton>

                <Typography variant="h6" gutterBottom>
                  Is ID Card Issued?
                </Typography>
                <Box>
                  <Typography>
                    {idCardIssued === 'yes' ? 'Upload ID Card' : 'Any Supporting Document?'}
                  </Typography>
                  <Box
                    display="flex"
                    gap={2}
                    mb={2}
                    alignItems="center"
                    justifyContent="center"
                  >
                    Choose One :{" "}
                    <RadioGroup
                      row
                      value={idCardIssued}
                      onChange={(e) => {
                        setIdCardIssued(e.target.value);
                        setUploadedFile(null);
                        setPreviewURL(null);
                      }}
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  </Box>
                  {idCardIssued && (
                    <Box mt={2}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        {/* Left: Label with icon */}
                        <Box display="flex" alignItems="center">
                          <UploadFileIcon sx={{ mr: 1 }} color="primary" />
                          <Typography>
                            {idCardIssued === 'yes'
                              ? 'Upload ID Card'
                              : 'Any Supporting Document?'}
                          </Typography>
                        </Box>

                        {/* Right: Choose File Button */}
                        {!uploadedFile && (
                          <label htmlFor="upload">
                            <Typography
                              component="span"
                              sx={{
                                cursor: 'pointer',
                                color: '#007BFF',
                                border: '1px solid #007BFF',
                                borderRadius: '30px',
                                padding: '4px 12px',
                                textAlign: 'center',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  backgroundColor: '#007BFF',
                                  color: '#fff',
                                },
                              }}
                            >
                              Choose File
                            </Typography>
                          </label>
                        )}

                        <input
                          id="upload"
                          name="file"
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />

                      </Box>
                      {errorMessage && (
                        <Typography sx={{ color: "red", mt: 5 }}>{errorMessage}</Typography>
                      )}


                    </Box>
                  )}

                  {/* File Uploaded View */}
                  {uploadedFile && (
                    <Box mt={2}>
                      {previewURL && uploadedFile.type.startsWith('image/') && (
                        <Box mt={1}>
                          <img
                            src={previewURL}
                            alt="Preview"
                            style={{
                              maxWidth: '100%',
                              maxHeight: '200px',
                              borderRadius: 4,
                              objectFit: 'contain',
                            }}
                          />
                        </Box>
                      )}

                      <Box display="flex" justifyContent="space-between">
                        <Button variant="outlined" onClick={handleView} sx={{ mt: "5px" }}>
                          View Full
                        </Button>
                        <Button variant="outlined" color="error" onClick={handleDelete}>
                          Delete
                        </Button>
                      </Box>
                    </Box>
                  )}

                </Box>

                {/* Conditional Upload Fields */}


                {/* Submit Button */}
                <Button
                  disabled={isdocumentuploaded}

                  onClick={handleSubmit}
                  sx={{ mt: '12px' }}
                >
                  Submit
                </Button>


              </Box>
            </Modal>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                mb: 2,
                color: (theme: {
                  palette: { mode: string; text: { primary: string } };
                }) =>
                  theme.palette.mode === "dark"
                    ? theme.palette.text.primary
                    : theme.palette.text.primary,
                fontSize: { xs: "0.8rem", sm: "1rem", md: "0.8rem" },
              }}
            >
              {selectMonth} -{" "}
              {ojtMonthsData.find((month) => month.name === selectMonth)?.year ||
                "N/A"}
            </Typography>


            <Box
              sx={{
                display: "flex",

                gap: 2,
                flexDirection: showMonthHistory ? "column" : "row",
                alignItems: showMonthHistory ? "flex-start" : "center",
              }}
            >
              {/* Left Section */}
              <Box sx={{ width: showMonthHistory ? "100%" : "80%" }}></Box>
              {showMonthHistory && (
                <Box
                  sx={{
                    width: "100%",


                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      mb: 2,
                      textAlign: "center",
                      color: (theme) =>
                        theme.palette.mode === "dark" ? "#fff" : "#000",
                    }}
                  >
                    Ojt Documents History
                  </Typography>
                  <Box
                    sx={{
                      display: { xs: "none", sm: "flex" },
                      gap: 1,
                      mb: 2,
                      justifyContent: "center",
                    }}
                  >
                    {["Approved", "Disapproved", "Pending", "Exemption",].map(
                      (filter) => (
                        <Chip
                          onClick={() =>
                            filter === "X"
                              ? setFilterStatus("")
                              : setFilterStatus(filter)
                          }
                          key={filter}
                          label={filter}
                          color={
                            getCategoryColor(filter) as
                            | "default"
                            | "success"
                            | "error"
                            | "primary"
                            | "secondary"
                            | "info"
                            | "warning"
                          }
                          sx={{
                            cursor: "pointer",
                            fontWeight: "bold",
                            color: (theme) =>
                              theme.palette.mode === "dark" ? "white" : "#",
                          }}
                        />
                      )
                    )}
                  </Box>

                  <List>
                    {filteringStatus.map((email) => (
                      <ListItem
                        key={email.id}
                        sx={{ borderBottom: "1px solid #ddd" }}
                        onClick={() => {
                          setSelectMonth(email.name);
                          setShowMonthHistory(false);
                        }}
                      >
                        <ListItemText
                          sx={{ cursor: "pointer" }}
                          primary={
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Typography fontWeight="bold">
                                {email.name} {email.year}
                              </Typography>
                              <Chip
                                label={email.category}
                                color={getCategoryColor(email.category)}
                                size="small"
                              />
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" color="textSecondary">
                              <br />
                              <b>Remarks:</b> {email.message}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
            {!showMonthHistory && (
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    pr: 2,
                    mb: 2,
                  }}
                >
                  <ArticleIcon sx={{
                    color: "brown", mr: "2px",
                    ml: "8px"
                  }} />
                  OJT Guidelines
                  <Typography sx={{ color: "red", ml: 1, fontWeight: "bold" }}>
                    {" "}
                    ( Please read it before uploading Documents ! )
                  </Typography>
                  <IconButton onClick={handleToggle} sx={{ p: 0, float: "right" }}>
                    {expanded ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  </IconButton>
                </Typography>

                {expanded && (
                  <List>
                    {ojtGuidelines.map((item, index) => (
                      <ListItem key={index}>
                        {index + 1}. {item.rule}
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            )}
            {/* <br /> */}


            {/* Updated */}


            {!showInput && !showMonthHistory && (
              <Box
                sx={{
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "#fff" : "#000",
                  fontWeight: "bold",
                  textAlign: { xs: "center", sm: "center" },
                  display: "flex",
                  alignItems: "center",
                  gap: 2, // spacing between label and radio buttons
                  flexWrap: "wrap", // optional for responsiveness
                  justifyContent: "center", // center on smaller screens
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  <CurrencyExchangeIcon
                    sx={{ marginRight: 1, color: "goldenrod" }}
                  />{" "}
                  Mode of Salary:
                </Typography>

                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={salaryMode}
                    onChange={handleSalaryModeChange}
                  >
                    <FormControlLabel
                      value="Online"
                      control={<Radio />}
                      label="Online"
                    />
                    <FormControlLabel
                      value="Offline"
                      control={<Radio />}
                      label="Offline"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>)}



            {salaryMode === "Offline" && (
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <Typography component="span" sx={{ color: "red", m: "10px" }}>
                    Note: In case of offline, you have to upload supporting
                    documents instead of salary slip & bank statement.
                  </Typography>
                </Typography>
              </Box>

            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                float: "",
                cursor: "pointer",
                margin: "0 auto",
              }}
            >
              {showSearch && (
                <>
                  <TextField
                    label="Select Month"
                    variant="outlined"
                    sx={{
                      width: "120px",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "0px", // Remove border-radius
                      },
                    }}
                  />

                  <TextField
                    label="Select Year"
                    variant="outlined"
                    sx={{
                      width: "120px",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "0px", // Remove border-radius
                      },
                    }}
                  />

                  <Button
                    variant="contained"
                    sx={{
                      borderRadius: "50px", // Remove border-radius
                      height: "36px", // Align height with TextField
                    }}
                  >
                    Search
                  </Button>
                </>
              )}
            </Box>

            {!showMonthHistory && (
              <>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ width: "100%" }}>
                    <List>
                      {uploadDocumentsByMonths[selectMonth]
                        ?.filter((activity) => {
                          if (showInput) {
                            return (
                              activity.title !== "SalarySlip" &&
                              activity.title !== "Bank Statement" &&
                              activity.title !== "Supporting Document"

                            ); // show everything when input is hidden
                          }

                          if (salaryMode !== "Online") {
                            return (
                              activity.title !== "SalarySlip" &&
                              activity.title !== "Bank Statement"
                            );
                          }
                          if (
                            activity.title === "Supporting Document"
                          ) {
                            return false;
                          }

                          return true;
                        })
                        .map((activity, index) => (
                          <ListItem
                            key={index}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              flexDirection: { xs: "column", sm: "row" },
                              alignItems: { xs: "center", sm: "flex-start" },
                              color: (theme) =>
                                theme.palette.mode === "dark" ? "#fff" : "#000",
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar
                                sx={{
                                  backgroundColor: activity.color,
                                  color: "white",
                                }}
                              >
                                {activity.icon}
                              </Avatar>
                            </ListItemAvatar>

                            <ListItemText
                              primary={activity.title}
                              secondary={activity.status}
                              primaryTypographyProps={{ fontWeight: "bold" }}
                              secondaryTypographyProps={
                                {
                                  // color: (theme) =>
                                  //   theme.palette.mode === "dark" ? "#fff" : "#000",
                                }
                              }
                              sx={{
                                textAlign: { xs: "center", sm: "left" },
                              }}
                            />

                            <Box
                              textAlign={{ xs: "center", sm: "left" }}
                              mt={{ xs: 1, sm: 0 }}
                            >
                              {documents[activity.title as keyof Documents] ? (
                                <>
                                  <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    onClick={() => {
                                      const uploadedFile = documents[activity.title as keyof Documents];
                                      if (typeof uploadedFile === "string") {
                                        const newTab = window.open();
                                        if (newTab) {
                                          newTab.document.write(`
              <iframe src="${uploadedFile}" width="100%" height="100%" style="border:none;"></iframe>
            `);
                                        }
                                      }
                                    }}
                                  >
                                    View
                                  </Button>

                                  {!submitData && (
                                    <Button
                                      variant="outlined"
                                      color="primary"
                                      size="small"
                                      sx={{
                                        ml: 1,
                                        color: (theme) =>
                                          theme.palette.mode === "dark" ? "#fff" : "#000",
                                      }}
                                      onClick={() => {
                                        setDocuments((prev) => ({
                                          ...prev,
                                          [activity.title]: false,
                                        }));
                                      }}
                                    >
                                      Remove
                                    </Button>
                                  )}
                                </>
                              ) : (
                                <>
                                  <label htmlFor={`upload-${index}`}>
                                    <Typography
                                      component="span"
                                      sx={{
                                        cursor: "pointer",
                                        color: "#007BFF",
                                      }}
                                    >
                                      Choose File
                                    </Typography>
                                  </label>

                                  <input
                                    id={`upload-${index}`}
                                    name={activity.title}
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        if (file.type === "application/pdf") {
                                          const fileURL = URL.createObjectURL(file);
                                          setDocuments((prev) => ({
                                            ...prev,
                                            [activity.title]: fileURL,
                                          }));
                                        } else {
                                          setErrorOpenToast(true); // 👈 show error snackbar
                                          e.target.value = ""; // Clear invalid file
                                        }
                                      }
                                    }}
                                    style={{ display: "none" }}
                                  />

                                </>
                              )}

                            </Box>



                          </ListItem>
                        ))}
                    </List>

                    {/* Salary Amount */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 2,
                        justifyContent: "center",
                        width: "90%",
                        margin: "0 auto",
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: "#007BFF",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: { xs: 30, sm: 40 },
                          height: { xs: 30, sm: 40 },
                        }}
                      >
                        <CurrencyRupeeIcon
                          sx={{ color: "white", fontSize: { xs: 20, sm: 24 } }}
                        />
                      </Box>

                      <Typography
                        sx={{
                          color: (theme) =>
                            theme.palette.mode === "dark" ? "#fff" : "#000",
                          fontWeight: "bold",
                          textAlign: { xs: "center", sm: "left" }, // Center text on mobile
                        }}
                      >
                        Stipend/Salary Amount:
                      </Typography>
                      <TextField
                        label="Salary Amount"
                        variant="outlined"
                        name="salaryAmount"
                        value={documents.salaryAmount || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (!/^\d*$/.test(value)) return;
                          setDocuments((prev) => ({
                            ...prev,
                            salaryAmount: value,
                          }));
                        }}
                        sx={{
                          width: { xs: "100%", sm: "auto" }, // Full width on mobile
                        }}
                      />
                    </Box>

                    <Divider sx={{ mt: 2 }} />

                    {/* Exemption Section */}
                    {/* {salaryMode === "Online" && ( */}
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexDirection: { xs: "column", sm: "row" }, // Responsive layout for mobile
                      }}
                    >
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: (theme) =>
                            theme.palette.mode === "dark" ? "#fff" : "#000",
                          textAlign: { xs: "center", sm: "left" }, // Center text on mobile
                        }}
                      >
                        Exemption
                        <FormControlLabel
                          control={
                            <Switch
                              onChange={(e) => setShowInput(e.target.checked)}
                            />
                          }
                          label=""
                        />
                      </Typography>

                      {showInput && (
                        <TextField
                          fullWidth
                          label="Reason for exemption"
                          variant="outlined"
                          name="LeaveReason"
                          sx={{
                            width: { xs: "100%", sm: "100%" },
                          }}
                          onChange={(e) => setExemptionReason(e.target.value)}
                        />
                      )}
                    </Box>
                    {/* )} */}
                    {/* Submit Button */}
                    <Button
                      disabled={isSubmitDisabled}
                      onClick={handleSubmit}
                      sx={{
                        display: "block",
                        margin: "0 auto",
                        borderRadius: 0,
                        backgroundColor: "#007BFF",
                        color: "white",
                        width: "30%",
                        mt: 3,
                      }}
                    >
                      Submit
                    </Button>
                  </Box>
                </Box>
              </>
            )}\


            {/* </Box> */}
          </Scrollbar>



        </Dialog>
      </Box>
    </>

  )

};

export default UploadDocuments;


