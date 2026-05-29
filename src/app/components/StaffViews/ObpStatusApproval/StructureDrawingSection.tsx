"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Tabs,
  Tab,
  Autocomplete,
  TextField,
  Button,
  useTheme,
  Alert,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  Apartment,
  Architecture as ArchitectureIcon,
  TableChart as TableChartIcon,
  Upload as UploadIcon,
  Save as SaveIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import DrawingDataTable, { DrawingTableRow } from "./DrawingDataTable";

interface ProjectOption {
  value: string;
  label: string;
}

interface StructureDrawingSectionProps {
  hasAccess: boolean;
  hasBothModules: boolean;
  hasProjectInfo: boolean;
  hasOnlyStructure: boolean;
  drawingProjectId: string;
  setDrawingProjectId: (id: string) => void;
  projectIdOptions: ProjectOption[];
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  selectedFileName: string;
  setSelectedFileName: (name: string) => void;
  fileError: string;
  setFileError: (error: string) => void;
  structureTab: number;
  setStructureTab: (tab: number) => void;
  masterLogSearch: string;
  setMasterLogSearch: (search: string) => void;
  structureSortOrder: string;
  setStructureSortOrder: (order: string) => void;
  masterLogPage: number;
  setMasterLogPage: (page: number) => void;
  masterLogPageSize?: number;
  structureMasterData: DrawingTableRow[];
  structureTotalEntries: number;
  structureTotalPages: number;
  // New props for selected project data
  selectedProjectData: DrawingTableRow | null;
  selectedProjectStructureData: DrawingTableRow[];
  onDownload: (fileName: string) => void;
  onViewFile: (fileName: string) => void;
  // Submit button props
  loading: boolean;
  onSubmit: () => void;
  submitDisabled?: boolean;
  structureDrawingError?: string | null;
}

export default function StructureDrawingSection({
  hasAccess,
  hasBothModules,
  hasProjectInfo,
  hasOnlyStructure,
  drawingProjectId,
  setDrawingProjectId,
  projectIdOptions,
  selectedFile,
  setSelectedFile,
  selectedFileName,
  setSelectedFileName,
  fileError,
  setFileError,
  structureTab,
  setStructureTab,
  masterLogSearch,
  setMasterLogSearch,
  structureSortOrder,
  setStructureSortOrder,
  masterLogPage,
  setMasterLogPage,
  masterLogPageSize = 20,
  structureMasterData,
  structureTotalEntries,
  structureTotalPages,
  selectedProjectData,
  selectedProjectStructureData,
  onDownload,
  onViewFile,
  loading,
  onSubmit,
  submitDisabled = false,
  structureDrawingError,
}: StructureDrawingSectionProps) {
  const theme = useTheme();

  if (!hasAccess) {
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0] || null;

    if (file && file.size > 10148576) {
      setFileError("File size exceeds 10 MB. Please upload a smaller file.");
      return;
    }

    setFileError("");
    setSelectedFile(file);
    setSelectedFileName(file?.name || "");
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
          Structure Drawing
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
          value={structureTab}
          onChange={(e, newValue) => setStructureTab(newValue)}
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
          <Tab icon={<UploadIcon />} iconPosition="start" label="Upload Structure File" />
        </Tabs>
      </Box>

      <Stack spacing={2}>
        {/* Tab 1: Master Data Table */}
        <Box sx={{ display: structureTab === 0 ? "block" : "none" }}>
          <DrawingDataTable
            title="Structure Drawing Records"
            data={structureMasterData}
            searchValue={masterLogSearch}
            onSearchChange={setMasterLogSearch}
            sortValue={structureSortOrder}
            onSortChange={setStructureSortOrder}
            page={masterLogPage}
            onPageChange={setMasterLogPage}
            totalPages={structureTotalPages}
            totalEntries={structureTotalEntries}
            pageSize={masterLogPageSize}
            onViewFile={onViewFile}
            onDownloadFile={onDownload}
            icon={<ArchitectureIcon sx={{ fontSize: 24, color: "white" }} />}
            searchPlaceholder="Search..."
          />
        </Box>

        {/* Tab 2: Upload */}
        <Box sx={{ display: structureTab === 1 ? "block" : "none" }}>
          {/* Project ID Selection - Only for single module */}
          {!hasBothModules && (
            <Autocomplete
              fullWidth
              sx={{ mb: 3 }}
              id="structureDrawingProjectId"
              options={projectIdOptions}
              getOptionLabel={(option) => option.label}
              value={
                projectIdOptions.find(
                  (option) => option.value === drawingProjectId
                ) || null
              }
              onChange={(event, newValue) => {
                setDrawingProjectId(newValue?.value || "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Project ID - Structure Drawing"
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

          {/* Upload Card */}
          <Card
            sx={{
              p: 3,
              border: "2px dashed #ccc",
              borderRadius: 2,
              backgroundColor: "#fafafa",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: theme.palette.primary.main,
                backgroundColor: "#f0f7ff",
              },
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
                <Apartment
                  sx={{
                    fontSize: 28,
                    color: theme.palette.primary.main,
                  }}
                />
                <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                  Structure Drawing
                </Typography>
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center" }}
              >
                {drawingProjectId
                  ? "Upload your structure drawing file here"
                  : "Select a Project ID above to enable upload"}
              </Typography>

              {fileError && (
                <Typography variant="body2" color="error" sx={{ fontWeight: "medium" }}>
                  {fileError}
                </Typography>
              )}

              {/* Show file selected */}
              {selectedFileName && !fileError && (
                <>
                  <Typography
                    variant="body2"
                    color="success.main"
                    sx={{ fontWeight: "medium" }}
                  >
                    Selected: {selectedFileName}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    {/* Change File Button */}
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
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        },
                      }}
                    >
                      Change File
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png,.zip,.rar,.7z"
                        onChange={handleFileChange}
                      />
                    </Button>

                    {/* Download Button */}
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={() => onDownload(selectedFileName)}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: "medium",
                      }}
                    >
                      Download Selected ({selectedFileName})
                    </Button>
                  </Box>
                </>
              )}

              {/* Show choose file button when no file is selected */}
              {!selectedFileName && !fileError && (
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
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  Choose File
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png,.zip,.rar,.7z"
                    onChange={handleFileChange}
                  />
                </Button>
              )}

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
              >
                Supported formats: PDF, DWG, DXF, JPG, PNG, ZIP, RAR, 7Z
              </Typography>
            </Box>
          </Card>

          {/* Submit Button - Show when user has Structure Drawing access */}
          {hasAccess && (!hasProjectInfo || hasOnlyStructure || hasBothModules) && (
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
              {structureDrawingError && (
                <Alert severity="error" sx={{ width: "100%" }}>
                  {structureDrawingError}
                </Alert>
              )}
              <LoadingButton
                type="button"
                variant="contained"
                loading={loading}
                disabled={submitDisabled}
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
                Submit Structure Drawing
              </LoadingButton>
            </Box>
          )}

          {/* Selected Project Table - Only show when project is selected in Tab 2 */}
          {drawingProjectId && selectedProjectStructureData && selectedProjectStructureData.length > 0 && (
            <DrawingDataTable
              title="Structure Drawing Records"
              data={selectedProjectStructureData}
              searchValue=""
              onSearchChange={() => {}}
              sortValue=""
              onSortChange={() => {}}
              page={0}
              onPageChange={() => {}}
              totalPages={1}
              totalEntries={selectedProjectStructureData.length}
              pageSize={10}
              onViewFile={onViewFile}
              onDownloadFile={onDownload}
              showUploadButton={false}
              icon={<ArchitectureIcon sx={{ fontSize: 24, color: "white" }} />}
            />
          )}

          {/* Show no records message when project is selected but no data */}
          {drawingProjectId && (!selectedProjectStructureData || selectedProjectStructureData.length === 0) && (
            <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
              <Typography variant="body1">No structure drawing records found for this project</Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </Card>
  );
}
