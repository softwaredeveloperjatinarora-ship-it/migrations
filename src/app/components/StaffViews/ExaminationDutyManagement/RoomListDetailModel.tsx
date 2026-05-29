
import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    AccordionDetails,
    Grid,
    Accordion,
    Paper,
    AccordionSummary,
    Box,
    CircularProgress,
    useTheme,
    TableBody,
    TableContainer,
    Table,
    TableCell,
    TableRow,
    TableHead,
} from "@mui/material";
import { getExamDutyCenterRoomsListAction } from "@/app/actions/StaffActions/ExamDutyManagementActions/getexamdutydashboard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
interface RoomListModalProps {
    open: boolean;
    onClose: () => void;
    examDate?: string;
    selectedTime?: string;
    selectedType?: string;
}

const RoomListDetailModal: React.FC<RoomListModalProps> = ({ open, onClose, examDate, selectedTime, selectedType, }) => {
    const [loading, setLoading] = useState(false);
    const [groupedData, setGroupedData] = useState<{ [key: string]: any[] }>({});
    const theme = useTheme();
    useEffect(() => {
        debugger;
        if (examDate && selectedTime && selectedType) {
            const fetchData = async () => {
                const requestbody = {
                    ExamHeldDate: examDate,
                    TM: selectedTime,
                    EType: selectedType,
                };
                setLoading(true);
                try {
                    const response = await getExamDutyCenterRoomsListAction(requestbody);
                    console.log("Response from API is", response.ApiData);
                    const data = response.ApiData?.item1 || [];

                    // Group by centerNo
                    const grouped: { [key: string]: any[] } = {};
                    data.forEach((item: any) => {
                        if (!grouped[item.centerNo]) {
                            grouped[item.centerNo] = [];
                        }
                        grouped[item.centerNo].push(item.roomNo);
                    });

                    setGroupedData(grouped);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching centers:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();

        }
    }, [examDate, selectedTime, selectedType]);


    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3, p: 1 },
            }}
        >
            {/* <DialogTitle sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
                Room Details
            </DialogTitle> */}
            <DialogTitle
                sx={{
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    backgroundColor: "#f5f5f5",
                    borderBottom: "1px solid #ddd",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    color: "#333",
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "1.2rem", fontWeight: 300 }}>Room Details</span>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            fontSize: "0.9rem",
                            color: "#000000ff",
                            mt: 0.5,
                        }}
                    >
                        <span><strong>Exam Date:</strong> {examDate}</span>
                        <span><strong>Exam Type:</strong> {selectedType}</span>
                        <span><strong>Time:</strong> {selectedTime}</span>
                    </Box>
                </Box>


                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>

                </Box>
            </DialogTitle>

            <DialogContent dividers>
                {loading ? (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                        <CircularProgress />
                        <Typography sx={{ mt: 2 }}>Loading room data...</Typography>
                    </Box>
                ) : Object.keys(groupedData).length === 0 ? (
                    <Typography>No data available for selected filters.</Typography>
                ) : (
                    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "primary.light" }}>
                                    <TableCell sx={{ fontWeight: 700, color:theme.palette.primary.main }}>
                                        Center No
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                                        Room Numbers
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {Object.entries(groupedData).map(([centerNo, rooms]) => (
                                    <TableRow
                                        key={centerNo}
                                        sx={{
                                            "&:nth-of-type(odd)": { backgroundColor: "rgba(0,0,0,0.02)" },
                                            "&:hover": { backgroundColor: "rgba(0,0,0,0.08)" },
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 600 }}>{centerNo}</TableCell>
                                        <TableCell>{(rooms as string[]).join(", ")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        px: 3,
                        backgroundColor: theme.palette.primary.main,
                        "&:hover": { backgroundColor: theme.palette.primary.light, },
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};


export default RoomListDetailModal;
