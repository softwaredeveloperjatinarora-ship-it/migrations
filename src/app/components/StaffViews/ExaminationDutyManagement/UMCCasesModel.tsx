
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
    TableRow,
    TableCell,
    TableHead,
    TableContainer,
    Table,
} from "@mui/material";
import { getExamDutyCenterRoomsListAction, getExamDutyCenterUMCCasesListAction } from "@/app/actions/StaffActions/ExamDutyManagementActions/getexamdutydashboard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
interface UMCCasesModalProps {
    open: boolean;
    onClose: () => void;
    examDate?: string;
    selectedTime?: string;
    selectedType?: string;
}

const UMCCasesModal: React.FC<UMCCasesModalProps> = ({ open, onClose, examDate, selectedTime, selectedType, }) => {
    const [loading, setLoading] = useState(false);
    const [groupedData, setGroupedData] = useState<{ [key: string]: any[] }>({});
    const [umcCases, setUMCCases] = useState([]);
    const columnNameMap: Record<string, string> = {
        centerNo: "Center No",
        controlRoom: "Control Room",
        courseCode: "Course Code",
        omrid: "OMR ID",
        umcReason:"UMC Reason",
        paperType: "Paper Type",
        programCode: "Program Code",
        registerationNumber: "Registeration Number",
        rollNo: "Roll No",
        seatNo: "Seat Number",
        studentFirstName: "Student Name",
        termId: "Term Id"
        
    };
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
                    const response = await getExamDutyCenterUMCCasesListAction(requestbody);
                    console.log("Response from API is", response.ApiData);
                    setUMCCases(response.ApiData.item1);
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

    const getDisplayName = (key: string): string => {
        return columnNameMap[key] || key;
    };
    const renderArrayTable = (data: any[]) => {
        if (!data || data.length === 0) {
            return <Typography>No records available.</Typography>;
        }

        return (
            <TableContainer
                component={Paper}
                sx={{
                    maxHeight: 800,
                    overflowX: "auto",
                    borderRadius: 2,
                    boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
                }}
            >
                <Table
                    size="small"
                    stickyHeader
                    sx={{
                        "& th": {
                            backgroundColor: "#fafafa",
                            fontWeight: 600,
                            borderBottom: "2px solid #e0e0e0",
                            whiteSpace: "nowrap",
                        },
                        "& td": {
                            borderBottom: "1px solid #eee",
                            whiteSpace: "nowrap",
                        },
                        "& tbody tr:nth-of-type(odd)": {
                            backgroundColor: "#fafafa",
                        },
                    }}
                >
                    <TableHead>
                        <TableRow>
                            {Object.keys(data[0]).map((col) => (
                                <TableCell key={col}>{getDisplayName(col)}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {Object.values(row).map((val, colIndex) => (
                                    <TableCell key={colIndex}>
                                        {val !== null && val !== undefined
                                            ? typeof val === "object"
                                                ? JSON.stringify(val)
                                                : String(val)
                                            : "-"}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>);
    };

    const renderObjectTable = (data: Record<string, any>) => (
        <TableContainer
            component={Paper}
            sx={{
                maxHeight: 400,
                borderRadius: 2,
                boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
                overflowX: "auto",
            }}
        >
            <Table
                size="small"
                stickyHeader
                sx={{
                    "& th": {
                        backgroundColor: "#fafafa",
                        fontWeight: 600,
                        borderBottom: "2px solid #e0e0e0",
                    },
                    "& td": {
                        borderBottom: "1px solid #eee",
                    },
                    "& tbody tr:nth-of-type(odd)": {
                        backgroundColor: "#fafafa",
                    },
                }}
            >
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Field</strong></TableCell>
                        <TableCell><strong>Value</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(data).map(([key, value]) => (
                        <TableRow key={key}>
                            <TableCell>{getDisplayName(key)}</TableCell>
                            <TableCell>
                                {value !== null && value !== undefined
                                    ? typeof value === "object"
                                        ? JSON.stringify(value)
                                        : String(value)
                                    : "-"}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
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
                    <span style={{ fontSize: "1.2rem", fontWeight: 600 }}>UMC Case Details</span>
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
                {umcCases ? (
                    Array.isArray(umcCases)
                        ? renderArrayTable(umcCases)
                        : renderObjectTable(umcCases)
                ) : (
                    <Typography>No data available.</Typography>
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
                        "&:hover": { backgroundColor: theme.palette.primary.light },
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UMCCasesModal;

