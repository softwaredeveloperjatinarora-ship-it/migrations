import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { UploadAssignmentAction } from "@/app/actions/homeAction/Assignment/UploadAssignmentAction";

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  course: string | null;
  type: string | null;
}

const UploadDialog: React.FC<UploadDialogProps> = ({ open, onClose, course, type }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [noFileError, setNoFileError] = useState(false);
  const [fileTooLarge, setFileTooLarge] = useState(false);
  const [uploadError, setUploadError] = useState({ open: false, message: "" });

  useEffect(() => {
    if (!open) {
      // Reset all state when the dialog is closed
      setSelectedFile(null);
      setUploadSuccess(false);
      setNoFileError(false);
      setFileTooLarge(false);
      setUploadError({ open: false, message: "" });
    }
  }, [open]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setSelectedFile(event.dataTransfer.files[0]);
    }
  };

  const sanitize = (str: string | null) => {
    if (!str) return "";
    return str.replace(/[^\w\s.-]/g, "").replace(/\s+/g, "");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setNoFileError(true);
      return;
    }

    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSizeInBytes) {
      setFileTooLarge(true);
      return;
    }

    const originalName = selectedFile.name;
    const extension = originalName.substring(originalName.lastIndexOf("."));
    const baseName = originalName.substring(0, originalName.lastIndexOf("."));

    const newFileName = `${sanitize(course)}${sanitize(type)}${sanitize(baseName)}${extension}`;
    const renamedFile = new File([selectedFile], newFileName, {
      type: selectedFile.type,
      lastModified: selectedFile.lastModified,
    });

    const result = await UploadAssignmentAction(renamedFile);

   if (result.status === "success") {
  setUploadSuccess(true);
  setTimeout(() => {
    onClose(); // Close dialog after success message is shown
  }, 500); // Delay for the duration of the snackbar
}

    else {
      setUploadError({ open: true, message: result.message || "Upload failed" });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Upload Assignment</DialogTitle>
        <DialogContent>
          <Typography><b>Course:</b> {course}</Typography>
          <Typography><b>Type:</b> {type}</Typography>
          <Box
            mt={2}
            sx={{
              backgroundColor: "primary.light",
              color: "primary.main",
              padding: "20px",
              textAlign: "center",
              border: "1px dashed",
              borderColor: "primary.main",
              cursor: "pointer",
            }}
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Typography>Drag &apos;n&apos; drop, or click to select a file</Typography>
            {selectedFile && (
              <Typography variant="body2" mt={1}>
                {selectedFile.name}
              </Typography>
            )}
          </Box>
          <Typography fontSize={15} color="secondary" mt={1}>
            File must be smaller than 10MB.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpload} color="primary" variant="contained">
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={uploadSuccess}
        autoHideDuration={3000}
        onClose={() => setUploadSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Upload successful!
        </Alert>
      </Snackbar>

      <Snackbar
        open={uploadError.open}
        autoHideDuration={6000}
        onClose={() => setUploadError({ open: false, message: "" })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {uploadError.message}
        </Alert>
      </Snackbar>

      <Snackbar
        open={noFileError}
        autoHideDuration={3000}
        onClose={() => setNoFileError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="warning" sx={{ width: "100%" }}>
          Please select a file to upload.
        </Alert>
      </Snackbar>

      <Snackbar
        open={fileTooLarge}
        autoHideDuration={3000}
        onClose={() => setFileTooLarge(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          File must be smaller than 10MB.
        </Alert>
      </Snackbar>
    </>
  );
};

export default UploadDialog;
