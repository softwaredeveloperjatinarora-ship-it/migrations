"use client";

import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  Alert,
  Snackbar,
  CircularProgress
} from "@mui/material";
import { RootState } from "@/store/store";  // 👈 import your store types

import ParentCard from "@/app/components/shared/ParentCard";
import BlankCard from "@/app/components/shared/BlankCard";
import {
  IconEdit,
  IconDoorEnter,
  IconLayoutRows,
  IconLayoutColumns,
  IconUsers
} from "@tabler/icons-react";
import { Stack } from "@mui/system";
import { useSelector } from 'react-redux';
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import { useSession } from "next-auth/react";
import { getRoomsAction } from "@/app/actions/DECAActions/DistanceExamination/roomMaster/getRooms";
import { updateRoomAction } from "@/app/actions/DECAActions/DistanceExamination/roomMaster/updateRoom";
interface Room {
  Id: string;
  RoomNo: string;
  Row: number;
  Col: number;
  CenterNo: string | null;
  AddBy: string | null;
  IsActive: string;
}

interface FormData {
  id: string;
  roomNo: string;
  row: number;
  col: number;
}

const columns = [
  // { id: "srNo", label: "Sr.No", minWidth: 5 },
  { id: "roomNo", label: "Room No", minWidth: 5 },
  { id: "row", label: "Row", minWidth: 5 },
  { id: "col", label: "Column", minWidth: 5 },
  { id: "capacity", label: "Capacity", minWidth: 5 },
  {
    id: "action",
    label: "Action",
    minWidth: 10,
  },
];


const CenterRooms = () => {
  const username = useSelector((state: any) => state.user?.username);
  const { data: session } = useSession();
  const centerNumber = useSelector((state: any) => state.center.centerNumber)
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const roomsData = useSelector((state: any) => state.rooms);
  
  useEffect(() => {
    setRooms(roomsData as unknown as Room[]);
  }, [roomsData]);
  
  const [formData, setFormData] = useState<FormData>({
    id: "",
    roomNo: "",
    row: 0,
    col: 0
  });
  const [updateDialogOpen, setUpdateDialogOpen] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning"
  });

  // Fetch School staff
  const fetchRooms = async () => {
    try {
    if (!session?.user?.token) {
        console.warn("Session or token missing during fetch");
        return;
      }

    const splitValue = session?.user?.token?.split('NEXT2121ANG');

      const formfields = {
        CenterNo: centerNumber,
      };

      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);

      const response = await getRoomsAction(Data);
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);

      let parsedData;
      parsedData = JSON.parse(decryptedData);
      setRooms(parsedData);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching school staff:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (centerNumber) {
      fetchRooms();
    }
  }, [])

  const showSnackbar = (message: string, severity: "success" | "error" | "info" | "warning") => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleUpdateRoom = async () => {
    if (!currentRoom) return;
    setUpdateDialogOpen(true);
  };

  // Update room
  const confirmUpdateRoom = async () => {
    if (!currentRoom) return;

    try {
      if (!session?.user?.token) {
        console.warn("Session or token missing during fetch");
        return;
      }

      const splitValue = session.user?.token.split("NEXT2121ANG");

      const formfields = {
        "Id": Number(currentRoom.Id),
        "CenterNo": centerNumber,
        "RoomNo": formData.roomNo.toString(),
        "Row": formData.row,
        "Col": formData.col,
        "AddBy": username
      };

      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1])

      const response = await updateRoomAction(Data);

      if (response) {
        fetchRooms();
        setUpdateDialogOpen(false);
        setEditDialogOpen(false);
        showSnackbar("Room updated successfully!", "success");
      } else {
        console.error("Failed to update room", response);
        showSnackbar("Failed to update room", "error");
      }
    } catch (error) {
      console.error("Error updating room:", error);
      showSnackbar("Error updating room", "error");
    }
  };

  const handleOpenEditDialog = (room: Room) => {
    setCurrentRoom(room);
    setFormData({
      id: room.Id,
      roomNo: room.RoomNo || "",
      row: room.Row,
      col: room.Col
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'roomNo' ? value : parseInt(value) || 0
    }));
  };

  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
        <Typography ml={2}>Loading rooms...</Typography>
      </Box>
    );
  }

  return (
    <>
      <ParentCard title={"Room Information"}>
        <Box>
          {roomsData?.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              No rooms found. Please add rooms.
            </Alert>
          ) : (
            <BlankCard>
              <TableContainer sx={{ maxHeight: 310 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          style={{ minWidth: column.minWidth }}
                          sx={{
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText'
                          }}
                        >
                          <Typography variant="subtitle1" textAlign="center" fontWeight="500">
                            {column.label}
                          </Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rooms.map((room, index) => {
                      const capacity = room.Row * room.Col;

                      return (
                        <TableRow
                          hover
                          key={room.Id}
                          sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
                        >
                          {/* <TableCell>
                            <Typography textAlign="center" variant="body2">
                              {index + 1}
                            </Typography>
                          </TableCell> */}
                          <TableCell>
                            <Box display="flex" alignItems="center" justifyContent="center">
                              <IconDoorEnter size={16} style={{ marginRight: '4px' }} />
                              <Typography textAlign="center" variant="body1" fontWeight="500">
                                {room.RoomNo}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" justifyContent="center">
                              <Chip
                                icon={<IconLayoutRows size={16} />}
                                label={room.Row}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" justifyContent="center">
                              <Chip
                                icon={<IconLayoutColumns size={16} />}
                                label={room.Col}
                                size="small"
                                color="secondary"
                                variant="outlined"
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" justifyContent="center">
                              <Chip
                                icon={<IconUsers size={16} />}
                                label={capacity}
                                size="small"
                                color="info"
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <IconButton
                                color="primary"
                                onClick={() => handleOpenEditDialog(room)}
                                size="small"
                                sx={{
                                  backgroundColor: 'primary.light',
                                  '&:hover': { backgroundColor: 'primary.main', color: 'white' }
                                }}
                              >
                                <IconEdit size="18" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </BlankCard>
          )}
        </Box>
      </ParentCard>

      {/* Edit Room Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: "primary.main", color: "white" }}>
          <Box display="flex" alignItems="center" gap={1}>
            <IconEdit size={24} />
            <Typography variant="h5">Edit Room</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Room Number"
              name="roomNo"
              value={formData.roomNo}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: <IconDoorEnter size={20} style={{ marginRight: '8px' }} />,
              }}
            />
            <TextField
              fullWidth
              label="Rows"
              name="row"
              type="number"
              value={formData.row}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: <IconLayoutRows size={20} style={{ marginRight: '8px' }} />,
              }}
            />
            <TextField
              fullWidth
              label="Columns"
              name="col"
              type="number"
              value={formData.col}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: <IconLayoutColumns size={20} style={{ marginRight: '8px' }} />,
              }}
            />
            <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="subtitle2">
                Total Capacity: {formData.row * formData.col} seats
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} variant="contained" color="secondary">Cancel</Button>
          <Button onClick={handleUpdateRoom} variant="contained" color="primary">
            Update Room
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Confirmation Dialog */}
      <Dialog open={updateDialogOpen} onClose={handleCloseUpdateDialog}>
        <DialogTitle sx={{ backgroundColor: "primary.main", color: "white" }}>
          <Box display="flex" alignItems="center" gap={1}>
            <IconEdit size={24} color="#1976d2" />
            <Typography variant="h6">Confirm Room Update</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to update room <b>{currentRoom?.RoomNo}</b>?
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
            <Typography variant="body2">
              <b>Room Number:</b> {formData.roomNo}
            </Typography>
            <Typography variant="body2">
              <b>Rows:</b> {formData.row}
            </Typography>
            <Typography variant="body2">
              <b>Columns:</b> {formData.col}
            </Typography>
            <Typography variant="body2">
              <b>Total Capacity:</b> {formData.row * formData.col} seats
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog} variant="contained" color="secondary">Cancel</Button>
          <Button onClick={confirmUpdateRoom} variant="contained" color="primary">
            Yes, Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CenterRooms;