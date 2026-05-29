"use client";

import React from "react";
import {
  Alert,
  Box,
  Card,
  Typography,
  Stack,
  Tabs,
  Tab,
  Autocomplete,
  TextField,
  Button,
  useTheme,
  Paper,
  MenuItem,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  Apartment,
  VerifiedUser as VerifiedUserIcon,
  TableChart as TableChartIcon,
  Upload as UploadIcon,
  CloudUpload as CloudUploadIcon,
  Save as SaveIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import DrawingDataTable, { DrawingTableRow } from "./DrawingDataTable";

interface ProjectOption {
  value: string;
  label: string;
}

interface VerificationSectionProps {
  hasAccess: boolean;
  hasBothModules: boolean;
  hasProjectInfo: boolean;
  hasOnlyVerification: boolean;
  drawingProjectId: string;
  setDrawingProjectId: (id: string) => void;
  projectIdOptions: ProjectOption[];
  verificationTab: number;
  setVerificationTab: (tab: number) => void;
  masterLogSearch: string;
  setMasterLogSearch: (search: string) => void;
  verificationSortOrder: string;
  setVerificationSortOrder: (order: string) => void;
  masterLogPage: number;
  setMasterLogPage: (page: number) => void;
  masterLogPageSize?: number;
  verificationMasterData: DrawingTableRow[];
  verificationTotalEntries: number;
  verificationTotalPages: number;
  // New props for selected project data
  selectedProjectData: DrawingTableRow | null;
  // Prop for filtered data when project is selected in Tab 2
  selectedProjectVerificationData: DrawingTableRow[];
  showVerificationDropzone: boolean;
  setShowVerificationDropzone: (show: boolean) => void;
  selectedVerificationFile: File | null;
  setSelectedVerificationFile: (file: File | null) => void;
  selectedVerificationFileName: string;
  setSelectedVerificationFileName: (name: string) => void;
  verificationFileError: string;
  setVerificationFileError: (error: string) => void;
  formik: any;
  onOpenRemarksModal: (field: string, title: string) => void;
  onDownload: (fileName: string) => void;
  onViewFile: (fileName: string) => void;
  onUploadNew?: (projectId?: string) => void;
  // Submit button props
  loading: boolean;
  onSubmit: () => void;
  verificationError?: string | null;
}

export default function VerificationSection({
  hasAccess,
  hasBothModules,
  hasProjectInfo,
  hasOnlyVerification,
  drawingProjectId,
  setDrawingProjectId,
  projectIdOptions,
  verificationTab,
  setVerificationTab,
  masterLogSearch,
  setMasterLogSearch,
  verificationSortOrder,
  setVerificationSortOrder,
  masterLogPage,
  setMasterLogPage,
  masterLogPageSize = 20,
  verificationMasterData,
  verificationTotalEntries,
  verificationTotalPages,
  selectedProjectData,
  selectedProjectVerificationData,
  showVerificationDropzone,
  setShowVerificationDropzone,
  selectedVerificationFile,
  setSelectedVerificationFile,
  selectedVerificationFileName,
  setSelectedVerificationFileName,
  verificationFileError,
  setVerificationFileError,
  formik,
  onOpenRemarksModal,
  onDownload,
  onViewFile,
  onUploadNew,
  loading,
  onSubmit,
  verificationError,
}: VerificationSectionProps) {
  const theme = useTheme();

  if (!hasAccess) {
    return null;
  }

  const statusOptions = [
    { value: "", label: "Select Status", color: "default" },
    { value: "new", label: "New", color: "warning" },
    { value: "approved", label: "Approved", color: "success" },
    { value: "revision", label: "Revision", color: "error" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0] || null;

    if (file && file.size > 10148576) {
      setVerificationFileError("File size exceeds 10 MB. Please upload a smaller file.");
      return;
    }

    setVerificationFileError("");
    setSelectedVerificationFile(file);
    setSelectedVerificationFileName(file?.name || "");
  };

  return (
    <Card
      sx={{
        p: 2,
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        backgroundColor: "#fafafa",
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: "white",
          p: 1.5,
          borderRadius: 1,
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="white">
          Verification of Structure & Architect
        </Typography>
      </Box>

      {/* Tabs */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 2,
        }}
      >
        <Tabs
          value={verificationTab}
          onChange={(e, newValue) => setVerificationTab(newValue)}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              minHeight: 48,
            },
            "& .Mui-selected": {
              fontWeight: 700,
            },
          }}
        >
          <Tab icon={<TableChartIcon />} iconPosition="start" label="Master Data" />
          <Tab icon={<UploadIcon />} iconPosition="start" label="Upload Verification File" />
        </Tabs>
      </Box>

      <Stack spacing={2}>
        {/* Tab 1: Master Data Table */}
        <Box sx={{ display: verificationTab === 0 ? "block" : "none" }}>
          <DrawingDataTable
            title="Verification Records"
            data={verificationMasterData}
            searchValue={masterLogSearch}
            onSearchChange={setMasterLogSearch}
            sortValue={verificationSortOrder}
            onSortChange={setVerificationSortOrder}
            page={masterLogPage}
            onPageChange={setMasterLogPage}
            totalPages={verificationTotalPages}
            totalEntries={verificationTotalEntries}
            pageSize={masterLogPageSize}
            onViewFile={onViewFile}
            onDownloadFile={onDownload}
            showUploadButton={true}
            onUploadNew={onUploadNew}
            icon={<VerifiedUserIcon sx={{ fontSize: 24, color: "white" }} />}
            searchPlaceholder="Search..."
          />
        </Box>

        {/* Tab 2: Upload Verification */}
        <Box sx={{ display: verificationTab === 1 ? "block" : "none" }}>
          {/* Instructions Paper */}
          <Paper
            elevation={2}
            sx={{
              mb: 3,
              borderRadius: 2,
              background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
              border: "1px solid #90caf9",
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#1565c0", mb: 1 }}>
                Steps for Uploading Verification File
              </Typography>
              <Box component="ol" sx={{ m: 0, pl: 2, "& li": { mb: 0.75, color: "text.secondary", fontSize: "0.9rem" } }}>
                <li>Select the appropriate Project ID from the dropdown list</li>
                <li>Download the Structure Drawing to view</li>
                <li>Verify the structure and architect details as per the drawing and project information</li>
                <li>Click on "Upload File" to select your verification document (PDF, DWG, DXF, JPG, PNG)</li>
                <li>After selecting the file, click "Submit Verification" to save your verification details and upload the file</li>
              </Box>
            </Box>
          </Paper>

          {/* Project ID Selection - Only for single module */}
          {!hasBothModules && (
            <Autocomplete
              fullWidth
              sx={{ mb: 3 }}
              id="verificationProjectId"
              options={projectIdOptions}
              getOptionLabel={(option) => option.label}
              value={
                projectIdOptions.find(
                  (option) => option.value?.toString() === drawingProjectId?.toString()
                ) || null
              }
              onChange={(event, newValue) => {
                setDrawingProjectId(newValue?.value || "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Project ID - Verification"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "white",
                    },
                  }}
                />
              )}
            />
          )}

          {/* Status Card */}
          <Card
            sx={{
              p: 3,
              mb: 3,
              border: "2px solid #e0e0e0",
              borderRadius: 2,
              backgroundColor: "#fafafa",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "text.secondary",
                  width: "100%",
                }}
              >
                <Apartment sx={{ fontSize: 28, color: theme.palette.primary.main }} />
                <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                  Verification of Structure & Architect
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  width: "100%",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                {/* Download File Button */}
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => onDownload(selectedProjectData?.fileName && selectedProjectData.fileName !== 'N/A' ? selectedProjectData.fileName : '')}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    alignSelf: "center",
                    minWidth: "120px",
                  }}
                >
                  Download File{" "}
                  {selectedProjectData?.fileName && selectedProjectData?.fileName !== "N/A"
                    ? `(${selectedProjectData.fileName})`
                    : ""}
                </Button>

                {/* Upload File Button */}
                <Button
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  onClick={() => setShowVerificationDropzone(!showVerificationDropzone)}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    alignSelf: "center",
                    minWidth: "100px",
                  }}
                >
                  {showVerificationDropzone ? "Hide Upload" : "Upload File"}
                </Button>

                {/* Status Dropdown */}
                <TextField
                  select
                  fullWidth
                  id="verificationStatus"
                  name="verificationStatus"
                  label="Status"
                  value={formik.values.verificationStatus}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "white",
                    },
                    minWidth: "200px",
                    flex: 1,
                  }}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                {/* Remarks Button */}
                <Button
                  variant="outlined"
                  onClick={() => onOpenRemarksModal("verificationRemarks", "Verification Remarks")}
                  startIcon={<EditIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "medium",
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    whiteSpace: "nowrap",
                    alignSelf: "center",
                  }}
                >
                  {formik.values.verificationRemarks ? "Edit Remarks" : "Add Remarks"}
                </Button>
              </Box>

              {/* Remarks Display */}
              {formik.values.verificationRemarks && (
                <Box
                  sx={{
                    width: "100%",
                    p: 2,
                    backgroundColor: "white",
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    <strong>Remarks:</strong> {formik.values.verificationRemarks}
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>

          {/* Verification Dropzone */}
          {showVerificationDropzone && (
            <Card
              sx={{
                p: 3,
                border: "2px solid #e0e0e0",
                borderRadius: 2,
                backgroundColor: "#fafafa",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "text.secondary",
                  }}
                >
                  <Apartment sx={{ fontSize: 28, color: theme.palette.primary.main }} />
                  <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                    Verification File Upload
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
                  {drawingProjectId
                    ? "Upload your verification file here"
                    : "Select a Project ID above to enable upload"}
                </Typography>

                {verificationFileError && (
                  <Typography variant="body2" color="error" sx={{ fontWeight: "medium" }}>
                    {verificationFileError}
                  </Typography>
                )}

                {/* Show file selected */}
                {selectedVerificationFileName && !verificationFileError && (
                  <>
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: "medium" }}>
                      Selected: {selectedVerificationFileName}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      <Button
                        variant="contained"
                        component="label"
                        disabled={!drawingProjectId}
                        startIcon={<SaveIcon />}
                      >
                        Change File
                        <input type="file" hidden accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png,.zip,.rar,.7z" onChange={handleFileChange} />
                      </Button>
                    </Box>
                  </>
                )}

                {/* Show choose file button when no file is selected */}
                {!selectedVerificationFileName && !verificationFileError && (
                  <Button
                    variant="contained"
                    component="label"
                    disabled={!drawingProjectId}
                    startIcon={<SaveIcon />}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1,
                      textTransform: "none",
                      fontWeight: "medium",
                    }}
                  >
                    Choose File
                    <input type="file" hidden accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png,.zip,.rar,.7z" onChange={handleFileChange} />
                  </Button>
                )}

                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
                  Supported formats: PDF, DWG, DXF, JPG, PNG, ZIP, RAR, 7Z
                </Typography>
              </Box>
            </Card>
          )}

          {/* Submit Button - Show when user has Verification access */}
          {hasAccess && (!hasProjectInfo || hasOnlyVerification || hasBothModules) && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                mt: 3,
                mb: 2,
              }}
            >
              {verificationError && (
                <Alert severity="error" sx={{ width: "100%" }}>
                  {verificationError}
                </Alert>
              )}
              <LoadingButton
                type="button"
                variant="contained"
                loading={loading}
                startIcon={<SaveIcon />}
                onClick={onSubmit}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                  },
                }}
              >
                Submit Verification
              </LoadingButton>
            </Box>
          )}

          {/* Selected Project Table - Only show when project is selected in Tab 2 */}
          {drawingProjectId && selectedProjectVerificationData && selectedProjectVerificationData.length > 0 && (
            <DrawingDataTable
              title="Verification Records"
              data={selectedProjectVerificationData}
              searchValue=""
              onSearchChange={() => {}}
              sortValue=""
              onSortChange={() => {}}
              page={0}
              onPageChange={() => {}}
              totalPages={1}
              totalEntries={selectedProjectVerificationData.length}
              pageSize={10}
              onViewFile={onViewFile}
              onDownloadFile={onDownload}
              showUploadButton={false}
              icon={<VerifiedUserIcon sx={{ fontSize: 24, color: "white" }} />}
              searchPlaceholder="Search..."
            />
          )}

          {/* Show no records message when project is selected but no data */}
          {drawingProjectId && (!selectedProjectVerificationData || selectedProjectVerificationData.length === 0) && (
            <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
              <Typography variant="body1">No verification records found for this project</Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </Card>
  );
}
