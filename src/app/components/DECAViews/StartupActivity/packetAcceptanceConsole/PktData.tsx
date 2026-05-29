import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Divider,
  Tooltip,
  Button,
  Popover,
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add"; 
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTheme } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import { useSelector } from '@/store/hooks';
import { AppState } from "@/store/store";
import packetinterface from "../packetAcceptanceConsole/PackerInterface";

// Import the actions
import { decryptDataforResponse, encryptData } from '@/app/api/services/auth/Encrptdecrpt';
import { getstudentAction } from "@/app/actions/DECAActions/DistanceExamination/packetAcceptanceConsole/getMaterial";
import { addPacket } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/challanProcessing/addPacket";
import { aprovePkts } from "@/app/actions/DECAActions/DistanceExamination/packetAcceptanceConsole/approvePackets";
import { deletePkts } from "@/app/actions/DECAActions/DistanceExamination/packetAcceptanceConsole/deletePkts";


interface PktDataProps {
  selectedType: string | null;
  packetStatus: boolean;
}

// Keeping selectedType as a prop but we'll display all types
const PktData: React.FC<PktDataProps> = ({ selectedType, packetStatus }) => {

  const centerNumber = useSelector((state: any) => state.center.centerNumber)
  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();
  const borderColor = theme.palette.divider;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activePacketType, setActivePacketType] = useState<string>("Theory Sheets");
  const [formData, setFormData] = useState({
    Pktname: "",
    From: "",
    To: "",
    Count: "",
    Type: "Theory Sheets",
  });
  const [errors, setErrors] = useState<{
    Pktname?: string | null,
    From?: string | null,
    To?: string | null,
    Count?: string | null,
    general?: string | null
  }>({});
const username = useSelector((state: any) => state.user?.username);
  const [staticData, setStaticData] = useState<packetinterface[]>([]);
  const { data: session } = useSession();

  // Delete confirmation dialog state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [packetToDelete, setPacketToDelete] = useState<number | null>(null);

  // Approve confirmation dialog state
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  // Additional loading state for initial data fetch
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Snackbar notification state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("success");

  // Define fixed height for the packet sections
  const SECTION_FIXED_HEIGHT = 300; // Height in pixels for each packet type section

  // Helper function to get encryption key from session
  const getEncryptionKey = () => {
    if (session?.user?.token) {
    const splitValue = session?.user?.token?.split('NEXT2121ANG');
  
    if (!splitValue || splitValue.length < 2) {
      throw new Error('Invalid token format');
    }
    return splitValue[1];
  }
  };

  
  // Helper function to prepare encrypted form data
  const prepareEncryptedFormData = (data: any) => {
    try {
      const encryptionKey:any = getEncryptionKey();
      const dataJson = JSON.stringify(data);
      const { Data } = encryptData(dataJson, encryptionKey);
      
      const formData = new FormData();
      formData.append('data', Data);
      return formData;
    } catch (error) {
      console.error('Error preparing encrypted form data:', error);
      throw error;
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Prepare encrypted data for getMaterial
      const requestData = {
        CenterNo: centerNumber,
      };
      
      const encryptedFormData = prepareEncryptedFormData(requestData);
      const response = await getstudentAction(encryptedFormData);
      
      if (response && response.encryptedData) {
        // Decrypt the response data on client side
        const encryptionKey:any = getEncryptionKey();
        const decryptedData = JSON.parse(decryptDataforResponse(response.encryptedData, encryptionKey));

        const transformedData = decryptedData.reduce((acc: packetinterface[], item: {
          [x: string]: number; pktno: any; serialfrom: any; serialto: any; cnt: any; description: any; Status: number;
        }, index: number) => {
          const lastType = acc.length > 0 ? acc[acc.length - 1].Type : null;
          const sno = (lastType === item.description) ? acc.filter(pkt => pkt.Type === item.description).length + 1 : 1;

          acc.push({
            id: item.Id,
            Sno: sno,
            Pktname: String(item.Pktno),
            From: String(item.Serialfrom),
            To: String(item.Serialto),
            Count: String(item.Cnt),
            Type: String(item.Description),
            Status: item.Receive || 0,
          });
          return acc;
        }, []);

        setStaticData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching packet data:", error);
      setSnackbarMessage("Failed to load packet data");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Group packets by type
  const packetTypes = ["Theory Sheets", "Practical Sheets", "Library Sheets"];

  const handleAddPacketClick = (event: React.MouseEvent<HTMLElement>, type: string) => {
    setAnchorEl(event.currentTarget);
    setActivePacketType(type);
    setFormData(prev => ({ ...prev, Type: type }));
    setErrors({});
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setFormData({
      Pktname: "",
      From: "",
      To: "",
      Count: "",
      Type: "Theory Sheets"
    });
    setErrors({});
  };

  const handleFormReset = () => {
    setFormData({
      Pktname: "",
      From: "",
      To: "",
      Count: "",
      Type: activePacketType,
    });
    setErrors({});
  };

  // Calculate Count automatically when From or To changes
  useEffect(() => {
    if (formData.From && formData.To) {
      const fromNum = parseInt(formData.From);
      const toNum = parseInt(formData.To);

      if (!isNaN(fromNum) && !isNaN(toNum) && toNum >= fromNum) {
        const count = (toNum - fromNum + 1).toString();
        setFormData(prev => ({ ...prev, Count: count }));
      }
    }
  }, [formData.From, formData.To]);

  const validateForm = () => {
    const newErrors: any = {};

    // Check for empty fields
    if (!formData.Pktname.trim()) {
      newErrors.Pktname = "Packet Name is required";
    }

    if (!formData.From.trim()) {
      newErrors.From = "Serial From is required";
    }

    if (!formData.To.trim()) {
      newErrors.To = "Serial To is required";
    }

    // Check if Pkt Name exists
    const isPktNameExist = staticData.some((pkt) => pkt.Pktname === formData.Pktname);
    if (isPktNameExist) {
      newErrors.Pktname = `Packet Name ${formData.Pktname} already exists`;
    }

    // Check if From and To are valid numbers
    const fromNum = parseInt(formData.From);
    const toNum = parseInt(formData.To);

    if (formData.From && isNaN(fromNum)) {
      newErrors.From = "Serial From must be a valid number";
    }

    if (formData.To && isNaN(toNum)) {
      newErrors.To = "Serial To must be a valid number";
    }

    // Fix: Check if To is greater than or equal to From - make sure error is on the right field
    if (!isNaN(fromNum) && !isNaN(toNum) && toNum < fromNum) {
      // This error should be on the "To" field
      newErrors.To = "Serial To must be greater than or equal to Serial From";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      // Prepare data for encryption
      const submitData = {
        CenterNo: String(centerNumber),
        EmpId: username,
        PktNo: formData.Pktname,
        PktFrom: Number(formData.From),
        PktTo: Number(formData.To),
        PktType: formData.Type,

      };
 
      // Encrypt the data on client side
      const encryptedFormData = prepareEncryptedFormData(submitData);

      // Call the addPkts action with encrypted data
      const response = await addPacket(encryptedFormData);
//&& response.success
      if (response ) {
        // Show success message
        setSnackbarMessage("Packet added successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Close the popover and reset form
        handlePopoverClose();

        // Refresh data from server
        await fetchData();
      } else {
        // Show error message
        setSnackbarMessage("Failed to add packet");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error adding packet:", error);
      setSnackbarMessage("An error occurred while adding the packet");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const isPopoverOpen = Boolean(anchorEl);

  // Function to handle delete button click
  const handleDeleteClick = (id: number) => {
    setPacketToDelete(id);
    setDeleteConfirmOpen(true);
  };

  // Handle confirmation dialog close
  const handleConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setPacketToDelete(null);
  };

  // Handle approve confirmation dialog close
  const handleApproveConfirmClose = () => {
    setApproveConfirmOpen(false);
  };

  // Actual delete function to be called after confirmation
  const handleConfirmDelete = async () => {
    if (packetToDelete === null) return;

    try {
      setIsLoading(true);

      // Prepare encrypted data for delete
      const deleteData = {
        Id: Number(packetToDelete)
      };
      console.log("Delete Data:", deleteData);
      const encryptedFormData = prepareEncryptedFormData(deleteData);
      const response = await deletePkts(encryptedFormData);
      console.log("Delete Response:", response);

      if (response && response.success) {
        // Show success message
        setSnackbarMessage("Packet deleted successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Update local state to remove the deleted packet
        setStaticData(prevData => prevData.filter(pkt => pkt.id !== packetToDelete));

        // Close dialog
        setDeleteConfirmOpen(false);
        setPacketToDelete(null);

        // Refresh data from server
        await fetchData();
      } else {
        // Show error message
        setSnackbarMessage(response?.message || "Failed to delete packet");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);

        // Close dialog
        setDeleteConfirmOpen(false);
        setPacketToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting packet:", error);

      // Show error message
      setSnackbarMessage("An error occurred while deleting the packet");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);

      // Close dialog
      setDeleteConfirmOpen(false);
      setPacketToDelete(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleApproveAllPackets = () => {
    setApproveConfirmOpen(true);
  };

  // Actual approve function to be called after confirmation
  const handleConfirmApprove = async () => {
    try {
      setIsLoading(true);

      // Prepare encrypted data for approve (empty data or any required fields)
      const approveData = {};
      const encryptedFormData = prepareEncryptedFormData(approveData);

      // Call the aprovePkts action
      const response = await aprovePkts(encryptedFormData);

      if (response && response.success) {
        // Show success message
        setSnackbarMessage("All packets have been approved successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Close dialog
        setApproveConfirmOpen(false);

        // Refresh data from server
        await fetchData();
      } else {
        // Show error message
        setSnackbarMessage(response?.message || "Failed to approve packets");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);

        // Close dialog
        setApproveConfirmOpen(false);
      }
    } catch (error) {
      console.error("Error approving packets:", error);

      // Show error message
      setSnackbarMessage("An error occurred while approving packets");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);

      // Close dialog
      setApproveConfirmOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Main loading indicator for initial data fetch
  if (isInitialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column', gap: 2 }}>
        <CircularProgress size={60} thickness={4} color="primary" />
        <Typography variant="h6" color="textSecondary">
          Loading packet data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3, padding: 0 }}>
      {/* Display each packet type in a separate section */}
      {packetTypes.map((type) => {
        const filteredData = staticData.filter((pkt) => pkt.Type === type);

        // If no packets of this type, still show section but with no data
        const bgColor =
          type === "Theory Sheets"
            ? theme.palette.primary.light
            : type === "Practical Sheets"
              ? theme.palette.secondary.light
              : theme.palette.success.light;

        const borderColor =
          type === "Theory Sheets"
            ? theme.palette.primary.main
            : type === "Practical Sheets"
              ? theme.palette.secondary.main
              : theme.palette.success.main;

        const buttonColor =
          type === "Theory Sheets"
            ? "primary"
            : type === "Practical Sheets"
              ? "secondary"
              : "success";

        return (
          <Card sx={{ mt: 2, padding: 1 }} key={type}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" p={1}>
              <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                {type}
              </Typography>
              <Box>
                {/* Only show Add Packets button if packetStatus is false */}
                {!packetStatus && (
                  <Tooltip title="Add new packet" arrow>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      color={buttonColor}
                      onClick={(e) => handleAddPacketClick(e, type)}
                      size="small"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                      ) : null}
                      Add Packets
                    </Button>
                  </Tooltip>
                )}
              </Box>
            </Stack>
            <Divider />

            {/* Add fixed height container with scrollable content */}
            <CardContent
              sx={{
                p: 1,
                maxHeight: `${SECTION_FIXED_HEIGHT}px`,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Scrollable area for packet cards */}
              <Box
                sx={{
                  overflowY: 'auto',
                  flex: 1,
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: borderColor,
                    borderRadius: '4px',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.3)',
                    },
                  },
                }}
              >
                <Grid container spacing={1}>
                  {isLoading && filteredData.length === 0 ? (
                    <Grid size={{xs:12}}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3 }}>
                        <CircularProgress size={32} thickness={4} color={buttonColor} />
                        <Typography variant="body2" sx={{ ml: 2 }}>
                          Loading {type}...
                        </Typography>
                      </Box>
                    </Grid>
                  ) : filteredData.length > 0 ? (
                    filteredData.map((pkt) => (
                      <Grid key={pkt.id} size={{xs:12,sm:6,md:3,lg:2}}>
                        <Card
                          sx={{
                            padding: 0,
                            border: `1px solid ${borderColor}`,
                            position: "relative",
                            bgcolor: bgColor,
                            transition: "transform 0.2s, box-shadow 0.2s",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: theme.shadows[4],
                            },
                          }}
                        >
                          {/* Only show Delete button if packetStatus is false */}
                          {!packetStatus && (
                            <Tooltip title="Delete Packet" arrow>
                              <IconButton
                                color="error"
                                sx={{
                                  position: "absolute",
                                  top: 1,
                                  right: 1,
                                  padding: "4px",
                                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                                  "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                  }
                                }}
                                onClick={() => handleDeleteClick(pkt.id)}
                                size="small"
                                disabled={isLoading}
                              >
                                {isLoading && packetToDelete === pkt.id ? (
                                  <CircularProgress size={16} color="error" />
                                ) : (
                                  <DeleteIcon fontSize="small" />
                                )}
                              </IconButton>
                            </Tooltip>
                          )}
                          <Box
                            sx={{
                              padding: "0px",
                              borderWidth: "0 0 0 5px",
                              borderStyle: "solid",
                              borderColor: borderColor,
                            }}
                          >
                            <CardContent sx={{ p: 1, pb: 1, '&:last-child': { pb: 1 } }}>
                              <Typography variant="subtitle1" fontSize="14px" fontWeight="bold">{pkt.Pktname}</Typography>
                              <Typography variant="body2" fontSize="12px">
                                Serial no :{" "}
                                <Typography component="span" sx={{ color: "primary.main", fontSize: "12px", fontWeight: "medium" }}>
                                  {pkt.From}
                                </Typography>{" "}
                                -   {" "}
                                <Typography component="span" sx={{ color: "primary.main", fontSize: "12px", fontWeight: "medium" }}>
                                  {pkt.To}
                                </Typography>
                              </Typography>
                              <Typography variant="body2" fontSize="12px">
                                Total Count:{" "}
                                <Typography component="span" sx={{ color: "primary.main", fontSize: "12px", fontWeight: "medium" }}>
                                  {pkt.Count}
                                </Typography>
                              </Typography>
                            </CardContent>
                          </Box>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Grid  size={{xs:12}}>
                      <Typography variant="body2" align="center" sx={{ py: 1 }}>
                        No {type} packets available. {!packetStatus && 'Click "Add Packets" to create some.'}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        );
      })}

      {/* Only show Accept All Packets button if packetStatus is false */}
      {staticData.length > 0 && !packetStatus && (
        <Box display="flex" justifyContent="center" mt={3} mb={2}>
          <Tooltip title="Accept all packets across all types" arrow>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleApproveAllPackets}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <CheckCircleIcon />}
              sx={{
                px: 6,
                py: 1.5,
                borderRadius: 2,
                boxShadow: theme.shadows[5],
                '&:hover': {
                  boxShadow: theme.shadows[8],
                  transform: "translateY(-2px)",
                },
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              Accept All Packets
            </Button>
          </Tooltip>
        </Box>
      )}
      {/* Add Packet Popover */}
      <Popover
        open={isPopoverOpen}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box p={2} width={300} bgcolor={theme.palette.background.paper} borderRadius={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" fontWeight="bold">
              Add New {activePacketType} Packet
            </Typography>
            <IconButton
              color="error"
              onClick={handlePopoverClose}
              size="small"
              sx={{
                backgroundColor: "lightcoral",
                color: "white",
                '&:hover': {
                  backgroundColor: "red",
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <form onSubmit={handleFormSubmit}>
            {/* Using a read-only field for packet type */}
            <TextField
              label="Packet Type"
              variant="outlined"
              fullWidth
              margin="normal"
              value={activePacketType}
              InputProps={{
                readOnly: true,
              }}
              size="small"
            />

            <TextField
              label="Pkt Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.Pktname}
              onChange={(e) => setFormData({ ...formData, Pktname: e.target.value })}
              required
              error={Boolean(errors.Pktname)}
              helperText={errors.Pktname}
              size="small"
              disabled={isLoading}
            />
            <TextField
              label="Serial From"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.From}
              onChange={(e) => setFormData({ ...formData, From: e.target.value })}
              required
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              error={Boolean(errors.From)}
              helperText={errors.From}
              size="small"
              disabled={isLoading}
            />
            <TextField
              label="Serial To"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.To}
              onChange={(e) => setFormData({ ...formData, To: e.target.value })}
              required
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              error={Boolean(errors.To)}
              helperText={errors.To}
              size="small"
              disabled={isLoading}
            />
            <TextField
              label="Total Sheets"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.Count}
              onChange={(e) => setFormData({ ...formData, Count: e.target.value })}
              required
              type="number"
              InputProps={{
                readOnly: true,
              }}
              helperText="Auto-calculated from Serial range"
              size="small"
            />
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleFormReset}
                disabled={isLoading}
              >
                Reset
              </Button>
            </Box>
          </form>
        </Box>
      </Popover>

      {/* Delete Confirmation Dialog - Updated styling to match Approve dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleConfirmClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          elevation: 8,
          sx: {
            borderRadius: 2,
            padding: 0
          }
        }}
      >
        <DialogTitle id="delete-dialog-title" sx={{ bgcolor: 'error.main', color: 'error.contrastText', borderRadius: '8px 8px 0 0' }}>
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this packet? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button
            onClick={handleConfirmClose}
            color="primary"
            variant="outlined"
            sx={{ borderRadius: 1 }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
            sx={{ borderRadius: 1 }}
            disabled={isLoading}
            autoFocus
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <Dialog
        open={approveConfirmOpen}
        onClose={handleApproveConfirmClose}
        aria-labelledby="approve-dialog-title"
        aria-describedby="approve-dialog-description"
        PaperProps={{
          elevation: 8,
          sx: {
            borderRadius: 2,
            padding: 0
          }
        }}
      >
        <DialogTitle id="approve-dialog-title" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: '8px 8px 0 0' }}>
          {"Confirm Approval"}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText id="approve-dialog-description">
            Are you sure you want to approve all packets? This action will mark all packets as accepted.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button
            onClick={handleApproveConfirmClose}
            color="inherit"
            variant="outlined"
            sx={{ borderRadius: 1 }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmApprove}
            color="primary"
            variant="contained"
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
            sx={{ borderRadius: 1 }}
            disabled={isLoading}
            autoFocus
          >
            {isLoading ? "Approving..." : "Approve All"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%', borderRadius: 2, boxShadow: theme.shadows[3] }}
          variant="filled" // More visible notification
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Overlay loading indicator for operations */}
      {isLoading && !isInitialLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <Card sx={{ p: 3, borderRadius: 2, minWidth: 200, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularProgress size={48} color="primary" thickness={4} sx={{ mb: 2 }} />
            <Typography variant="body1" fontWeight="medium">Processing...</Typography>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default PktData;