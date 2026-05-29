"use client";

import * as React from "react";
import {
    Box,
    Typography,
    Grid,
    TextField,
    Button,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Paper,
    Switch,
    FormControlLabel,
    Radio,
    RadioGroup,
    FormLabel,
    Badge,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    TablePagination,
    Chip,
    TableSortLabel,
    Toolbar,
    FormControlLabel as MuiFormControlLabel,
    Avatar,
    Autocomplete,
    useTheme,
    Backdrop,
    CircularProgress
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import {
    LibraryBooks as LibraryBooksIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Description as DescriptionIcon,
    Save as SaveIcon,
    NoteAdd as NoteAddIcon,
    AssignmentInd as AssignmentIndIcon,
    Visibility as VisibilityIcon,
    Numbers as NumbersIcon,
    Comment as CommentIcon,
    FileCopy as FileCopyIcon,
    AddCircleOutline as AddCircleOutlineIcon,
    ContactPage as ContactPageIcon,
    Info as InfoIcon,
    Close as CloseIcon,
    BarChart as BarChartIcon,
    List as ListIcon,
    FilterList as FilterListIcon,
} from "@mui/icons-material";
import BlankCard from "../../shared/BlankCard";
import UmcStats from "./UmcStats";
import CustomSwitch from "../../forms/theme-elements/CustomSwitch";
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { getStudentProfileData } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/umcMaking/getProfileData";
import { insertUmcRecord } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/umcMaking/insertUmcRecord";
import { getUmcReasons } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/umcMaking/getUmcReason";
import { getAllUmcCases } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/umcMaking/getAllUmc";
import { getSchoolStaffAction } from "@/app/actions/DECAActions/DistanceExamination/schoolStaff/getSchoolStaff";
import CustomSnackbar from "../Snackbar";


// [Interfaces and utility functions remain unchanged]
interface UmcRecord {
    RegistrationNumber: string;
    CourseCode: string;
    TermId: string;
    ExamType: string;
    UmcReason: string;
    OLDSheetNo: string;
    NewSheetNo: string;
    UmcMarkedBy: string | null;
    UmcMarkedDateTime: string | null;
    UmcCaughtBy: string;
    PrintedSlips: number;
    HandwrittenSlips: number;
    Remarks: string;
    ExamSession: string;
}

interface SchoolStaff {
    id: string;
    CenterNo: string;
    Name: string | null;
    PhoneNo: string | null;
    AddedBy: string | null;
    IsActive: string;
}

interface UmcCase {
    RegdNo: string;
    ExamType: string;
    CourseCode: string;
    UmcReason: string;
    TermId: string;
    PrintedSlips: number;
    HandwrittenSlips: number;
    NewSheetNo: boolean;
    SheetNo: string;
    UmcCaughtBy: string;
    UmcRemarks: string;
    OLDSheetNo?: string;
    RegistrationNumber?: string | number;
    Remarks?: string;
}

interface FifthStepProps {
    selectedDate: string | null;
    selectedTime: string;
    examTypeInitial: number;
    setFifthStepDone: any
}

interface EnhancedTableProps {
    order: Order;
    orderBy: string;
    onRequestSort: (
        event: React.MouseEvent<unknown>,
        property: keyof UmcCase
    ) => void;
    rowCount: number;
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof UmcCase;
    label: string;
    numeric: boolean;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (bValue < aValue) {
        return -1;
    }
    if (bValue > aValue) {
        return 1;
    }
    return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof UmcCase>(
    order: Order,
    orderBy: Key
): (
    a: { [key in Key]: number | string | boolean },
    b: { [key in Key]: number | string | boolean }
) => number {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
    array: T[],
    comparator: (a: T, b: T) => number
) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells: HeadCell[] = [
    {
        id: "RegdNo",
        numeric: false,
        disablePadding: false,
        label: "Registration No.",
    },
    {
        id: "ExamType",
        numeric: false,
        disablePadding: false,
        label: "Exam Type",
    },
    {
        id: "CourseCode",
        numeric: false,
        disablePadding: false,
        label: "Course Code",
    },
    {
        id: "TermId",
        numeric: false,
        disablePadding: false,
        label: "Term ID",
    },
    {
        id: "UmcReason",
        numeric: false,
        disablePadding: false,
        label: "UMC Reason",
    },
];

function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, rowCount, onRequestSort } = props;
    const createSortHandler =
        (property: keyof UmcCase) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            <Typography variant="subtitle1" fontWeight="500">
                                {headCell.label}
                            </Typography>
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell align="center">Actions</TableCell>
            </TableRow>
        </TableHead>
    );
}

function EnhancedTableToolbar() {
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
            }}
        >
            <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                UMC Cases
            </Typography>
        </Toolbar>
    );
}

const FifthStep: React.FC<FifthStepProps> = ({ selectedDate, selectedTime, setFifthStepDone }) => {
    const [examType, setExamType] = React.useState("");
    const [filteredProfileObj, setFilteredProfileObj] = React.useState<any>(null);
    const [regNo, setRegNo] = React.useState("");
    const [studentName, setStudentName] = React.useState("");
    const [fatherName, setFatherName] = React.useState("");
    const [courseCode, setCourseCode] = React.useState<any>(filteredProfileObj?.CourseCode || "");
    const [termId, setTermId] = React.useState(filteredProfileObj?.TermId);
    const [reason, setReason] = React.useState("");
    const [oldSheetNo, setOldSheetNo] = React.useState("");
    const [newSheet, setNewSheet] = React.useState(false);
    const [newSheetNo, setNewSheetNo] = React.useState("");
    const [invigilator, setInvigilator] = React.useState("");
    const [caughtBy, setCaughtBy] = React.useState("");
    const [studentStatement, setStudentStatement] = React.useState("");
    const [invigilatorStatement, setInvigilatorStatement] = React.useState("");
    const [socStatement, setSocStatement] = React.useState("");
    const [seatingPlan, setSeatingPlan] = React.useState("");
    const [questionPaper, setQuestionPaper] = React.useState("");
    const [totalPages, setTotalPages] = React.useState("");
    const [remarks, setRemarks] = React.useState("");
    const [courses, setCourses] = React.useState<any[]>([]);
    const [profileData, setProfileData] = React.useState<any[]>([]);
    const centerNumber = useSelector((state: any) => state.center.centerNumber);
    const [error, setError] = React.useState("");
    const [umcErrors, setUmcErrors] = React.useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [schoolStaff, setSchoolStaff] = React.useState<SchoolStaff[]>([]);
    const [allUmcCases, setAllUmcCases] = React.useState([]);
    const [printedSlips, setPrintedSlips] = React.useState("");
    const [handwrittenSlips, setHandwrittenSlips] = React.useState("");
    const [umcPunchRes, setUmcPunchRes] = React.useState<any>("");
    const [loading, setLoading] = React.useState(true);
    const { data: session } = useSession();
    const [studentImage, setStudentImage] = React.useState("");
    const theme = useTheme();
    const [studentFetched, setStudentFetched] = React.useState(false);
    const [searchError, setSearchError] = React.useState("");
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [statsDialogOpen, setStatsDialogOpen] = React.useState(false);
    const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false);
    const [casesDialogOpen, setCasesDialogOpen] = React.useState(false);
    const [selectedUmc, setSelectedUmc] = React.useState<UmcRecord | null>(null);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<keyof UmcCase>("RegdNo");
    const [dense, setDense] = React.useState(false);
    const [umcCases, setUmcCases] = React.useState<UmcCase[]>();
    const [umcReason, setUmcReason] = React.useState<any[]>([]);
    const [studentLoading, setStudentLoading] = React.useState(false);
    const isSaveDisabled =
        isSubmitting ||
        !regNo ||
        !courseCode ||
        !termId ||
        !reason ||
        !invigilator ||
        !caughtBy ||
        !remarks ||
        Object.values(umcErrors).some((err) => err);
    const username = useSelector((state: any) => state.user?.username);

    const fetchStudentProfile = async (regNo: any) => {
        if (!regNo.trim()) {
            setError("Please enter a registration number");
            return;
        }
        if (!session?.user?.token || !centerNumber) return;

        try {
            setStudentLoading(true);
            setError("");
            setProfileData([]);

            const splitValue = session.user?.token.split("NEXT2121ANG");
            const formfields = {
                CenterNo: Number(centerNumber),
                RegdNo: Number(regNo),
            };

            const credentialsJson = JSON.stringify(formfields);
            const { Data } = encryptData(credentialsJson, splitValue[1]);

            const response = await getStudentProfileData(Data);

            let decryptedData: string | null = null;
            console.log("decryptedData in profile", decryptedData)
            try {
                decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
            } catch (e) {
                setError("No Student found ! ");
                setProfileData([]);
                return;
            }

            if (!decryptedData) {
                setError("No Student found");
                setProfileData([]);
                return;
            }

            let parsedData: any;
            try {
                parsedData = JSON.parse(decryptedData);
            } catch (e) {
                setError("Invalid data format");
                setProfileData([]);
                return;
            }

            if (!parsedData || parsedData.length === 0) {
                setError("No Student found");
                setProfileData([]);
                return;
            }

            setProfileData(parsedData);
        } catch (error) {
            setError("No Student found");
            console.error("Error fetching student profile:", error);
            setProfileData([]);
        } finally {
            setStudentLoading(false);
        }
    };

    const fetchAllUmcCases = async () => {
        if (!session?.user?.token || !centerNumber) return;
        try {
            setError("");

            const splitValue = session?.user?.token.split("NEXT2121ANG");
            const formfields = {
                CenterNo: centerNumber
            };

            const credentialsJson = JSON.stringify(formfields);
            const { Data } = encryptData(credentialsJson, splitValue[1]);
            const response = await getAllUmcCases(Data);
            const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);

            const parsedData = JSON.parse(decryptedData);
            setAllUmcCases(parsedData || []);
        } catch (error) {
            setError("No Student found");
            console.error("Error fetching all umc cases:", error);
        }
    };

    const fetchSchoolStaff = async () => {
        try {
            if (!session?.user?.token) {
                console.warn("Session or token missing during fetch");
                return;
            }

            const splitValue = session.user?.token.split("NEXT2121ANG");
            const formfields = { CenterNo: centerNumber };

            const credentialsJson = JSON.stringify(formfields);
            const { Data } = encryptData(credentialsJson, splitValue[1]);

            const response = await getSchoolStaffAction(Data);
            const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);

            const parsedData = JSON.parse(decryptedData);

            setSchoolStaff(parsedData);
        } catch (error) {
            console.error("Error fetching school staff:", error);
        } finally {
            setLoading(false);
        }
    };

    const [snackbarOpen, setSnackbarOpen] = React.useState(false);

    const handleInsertUmcRecord = async () => {
        try {
            const newErrors: { [key: string]: string } = {};

            if (!regNo) newErrors.regNo = "Registration number is required";
            if (!courseCode) newErrors.courseCode = "Course Code is required";
            if (!termId) newErrors.termId = "Term Id is required";
            if (!reason) newErrors.reason = "Reason is required";
            if (!oldSheetNo) newErrors.oldSheetNo = "Old Sheet No is required";
            if (!centerNumber) newErrors.centerNumber = "Center Number (UMC Marked By) is required";
            if (!examType && !filteredProfileObj?.ExamType) newErrors.examType = "Exam Type is required";
            if (!caughtBy) newErrors.caughtBy = "Caught By staff ID is required";
            if (!printedSlips) newErrors.printedSlips = "Printed Slips count is required";
            if (!handwrittenSlips) newErrors.handwrittenSlips = "Handwritten Slips count is required";
            if (!remarks) newErrors.remarks = "Remarks are required";

            if (Object.keys(newErrors).length > 0) {
                setUmcErrors(newErrors);
                setIsSubmitting(false);
                return;
            }

            setUmcErrors({});
            setIsSubmitting(true);

            if (!session?.user?.token) {
                console.warn("Session or token missing during fetch");
                return;
            }

            const splitValue = session.user?.token.split("NEXT2121ANG");

            const formfields = {
                RegdNo: Number(regNo),
                CourseCode: courseCode,
                TermId: termId,
                UmcReason: reason,
                SheetNo: oldSheetNo,
                NewSheetNo: newSheetNo ?? 0,
                UmcMarkedBy: centerNumber,
                ExamType: String(filteredProfileObj?.ExamType || examType),
                UmcCaughtBy: caughtBy,
                PrintedSlips: Number(printedSlips),
                HandwrittenSlips: Number(handwrittenSlips),
                UmcRemarks: remarks,
            };
            console.log("formfield in umc", formfields)
            const credentialsJson = JSON.stringify(formfields);
            const { Data } = encryptData(credentialsJson, splitValue[1]);

            const response = await insertUmcRecord(Data);
            const decryptedData = decryptDataforResponse(response, splitValue[1]);
            console.log("decryptedData handleInsertUmcRecord", decryptedData)
            const parsedData = JSON.parse(decryptedData);
            console.log("parsedData", parsedData)
            setIsSubmitting(false);
            setSnackbarOpen(true);
            setUmcPunchRes(parsedData[0]?.Message);
            <CustomSnackbar
                open={snackbarOpen}
                message={parsedData[0]?.Message || "UMC punched successfully"}
                severity="success"
                onClose={() => setSnackbarOpen(false)}
            />
            setFifthStepDone(true);
            await fetchAllUmcCases();
        } catch (error) {
            setIsSubmitting(false);
            console.error("Insert Failed:", error);
            setSnackbarOpen(true);

        }
    };

    const fetchUmcReason = async () => {
        try {
            if (!session?.user?.token) {
                console.warn("Session or token missing during fetch");
                return;
            }

            const splitValue = session.user?.token.split("NEXT2121ANG");
            const formfields = {
                EmpId: Number(username)
            };

            const credentialsJson = JSON.stringify(formfields);
            const { Data } = encryptData(credentialsJson, splitValue[1]);

            const response = await getUmcReasons(Data);
            const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);

            const parsedData = JSON.parse(decryptedData);

            setUmcReason(parsedData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching umc reason:", error);
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        const newErrors: { [key: string]: string } = {};

        if (!regNo) newErrors.regNo = "Registration number is required";
        if (!courseCode) newErrors.courseCode = "Course Code is required";
        if (!termId) newErrors.termId = "Term Id is required";
        if (!reason) newErrors.reason = "Reason is required";
        if (!oldSheetNo) newErrors.oldSheetNo = "Old Sheet No is required";
        if (!centerNumber) newErrors.centerNumber = "Center Number is required";
        if (!caughtBy) newErrors.caughtBy = "Caught By staff ID is required";
        if (!printedSlips) newErrors.printedSlips = "Printed Slips count is required";
        if (!handwrittenSlips) newErrors.handwrittenSlips = "Handwritten Slips count is required";
        if (!remarks) newErrors.remarks = "Remarks are required";

        if (Object.keys(newErrors).length > 0) {
            setUmcErrors(newErrors);
            return;
        }

        setUmcErrors({});
        await handleInsertUmcRecord();
        handleReset();
    };

    const handleReset = () => {
        setExamType("");
        setRegNo("");
        setStudentName("");
        setFatherName("");
        setCourseCode("");
        setTermId("");
        setReason("");
        setOldSheetNo("");
        setNewSheet(false);
        setNewSheetNo("");
        setInvigilator("");
        setCaughtBy("");
        setStudentStatement("");
        setInvigilatorStatement("");
        setSocStatement("");
        setSeatingPlan("");
        setQuestionPaper("");
        setTotalPages("");
        setRemarks("");
        setStudentImage("/images/profile/placeholder.jpg");
        setStudentFetched(false);
        setIsSubmitted(false);
        setSearchError("");
        setHandwrittenSlips("");
        setPrintedSlips("");
    };

    const handleViewDetails = (umc: any) => {
        setSelectedUmc(umc);
        setDetailsDialogOpen(true);
    };

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof UmcCase
    ) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const emptyRows =
        page > 0
            ? Math.max(0, (1 + page) * rowsPerPage - (umcCases?.length ?? 0))
            : 0;

    React.useEffect(() => {
        fetchUmcReason();
        fetchSchoolStaff();
        fetchAllUmcCases();
    }, []);

    React.useEffect(() => {
        if (umcPunchRes) {
            fetchAllUmcCases();
        }
    }, [umcPunchRes]);

    React.useEffect(() => {
        if (filteredProfileObj) {
            setCourseCode(filteredProfileObj.CourseCode || "");
            setTermId(filteredProfileObj.TermId || "");
        }
    }, [filteredProfileObj]);

    React.useEffect(() => {
        if (umcPunchRes) {
            const timer = setTimeout(() => {
                setUmcPunchRes(null);
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [umcPunchRes]);

    React.useEffect(() => {
        const found = profileData?.find(item => {
            const itemDate = item.Date.split("T")[0];
            return (
                itemDate === selectedDate &&
                item.Session === selectedTime &&
                item.RegdNo === Number(regNo)
            );
        });

        setFilteredProfileObj(found || null);
        setStudentFetched(!!found);
    }, [selectedDate, selectedTime, regNo, profileData]);

    return (
        <Box>
            <CustomSnackbar
                open={snackbarOpen}
                message={umcPunchRes}
                severity="error"
                onClose={() => setSnackbarOpen(false)}
            />

            <CustomSnackbar
                open={snackbarOpen}
                message={umcPunchRes}
                severity="error"
                onClose={() => setSnackbarOpen(false)}
            />

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={4}
                sx={{
                    backgroundColor: (theme: any) => theme.palette.mode === "light" ? "white" : "#111c2d",
                    p: 3,
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#1565c0" }}>
                    Unfair Means Case (UMC) Marking
                </Typography>
                <Box display="flex" gap={2}>
                    <Badge badgeContent={allUmcCases?.length} color="error">
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<ListIcon />}
                            onClick={() => setCasesDialogOpen(true)}
                            sx={{
                                borderRadius: 1,
                                px: 3,
                                py: 1,
                                transition: "all 0.3s",
                                "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                },
                            }}
                        >
                            View UMC Cases
                        </Button>
                    </Badge>
                </Box>
            </Box>

            <Paper elevation={3} sx={{ p: 3, backgroundColor: (theme: any) => theme.palette.mode === "light" ? "white" : "#111c2d", mb: 4 }}>
                <Box component="form" onSubmit={handleSubmit} onReset={handleReset}></Box>
                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="primary"
                    gutterBottom
                    sx={{ mb: 2 }}
                >
                    Exam Details
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 5 }}>
                        <FormControl fullWidth disabled>
                            <FormLabel id="exam-type-label">Exam Type</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="exam-type-label"
                                name="exam-type"
                                value={
                                    filteredProfileObj?.ExamType === 5
                                        ? "theory"
                                        : filteredProfileObj?.ExamType === 6
                                            ? "practical"
                                            : examType
                                }
                                onChange={(e) => setExamType(e.target.value)}
                            >
                                <FormControlLabel value="theory" control={<Radio />} label="Theory" />
                                <FormControlLabel value="practical" control={<Radio />} label="Practical" />
                            </RadioGroup>
                            {umcErrors.examType && (
                                <Typography color="error" variant="caption">
                                    {umcErrors.examType}
                                </Typography>
                            )}
                        </FormControl>
                    </Grid>
                </Grid>

                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="primary"
                    gutterBottom
                    sx={{ mb: 2 }}
                >
                    Student Information
                </Typography>
                {searchError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {searchError}
                    </Alert>
                )}
                <Grid container spacing={2} sx={{ mb: 3, alignItems: "center" }}>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <TextField
                            fullWidth
                            label="Search Student (Reg No.)"
                            size="small"
                            value={regNo}
                            onChange={(e) => {
                                setRegNo(e.target.value);
                                setError("");
                                setUmcErrors(prev => ({ ...prev, regNo: "" }));
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && regNo.trim()) {
                                    fetchStudentProfile(regNo);
                                }
                            }}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                            error={!!umcErrors.regNo}
                            helperText={umcErrors.regNo}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <ContactPageIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            edge="end"
                                            onClick={() => {
                                                if (regNo.trim()) {
                                                    fetchStudentProfile(regNo);
                                                } else {
                                                    setError("Please enter a registration number");
                                                }
                                            }}
                                        >
                                            <SearchIcon />
                                        </IconButton>


                                        {regNo && (
                                            <IconButton
                                                edge="end"
                                                onClick={() => {
                                                    setRegNo("");
                                                    setFilteredProfileObj(null);
                                                    setStudentFetched(false);
                                                    setError("");
                                                    setUmcErrors(prev => ({ ...prev, regNo: "" }));
                                                }}
                                            >
                                                <ClearIcon />
                                            </IconButton>
                                        )}
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {error && (
                            <Typography color="error" variant="body2" sx={{ ml: 5, mt: 1 }}>
                                {error}
                            </Typography>
                        )}
                    </Grid>

                    <Grid size={{ xs: 12, sm: 3 }}>
                        <TextField
                            fullWidth
                            label="Student Name"
                            value={filteredProfileObj?.Name || ""}
                            size="small"
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon />
                                    </InputAdornment>
                                ),
                            }}
                            disabled={!studentFetched}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <TextField
                            fullWidth
                            label="Father's Name"
                            value={filteredProfileObj?.FatherName || ""}
                            size="small"
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon />
                                    </InputAdornment>
                                ),
                            }}
                            disabled={!studentFetched}
                        />
                    </Grid>
                    <Grid sx={{ textAlign: "center" }} size={{ xs: 12, sm: 3 }}>
                        <Avatar
                            src={filteredProfileObj?.Snap ? `data:image/jpg;base64,${filteredProfileObj.Snap}` : studentImage}
                            alt="Student Image"
                            sx={{
                                width: 80,
                                height: 80,
                                mx: "auto",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                            }}
                        />
                    </Grid>
                </Grid>

                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="primary"
                    gutterBottom
                    sx={{ mb: 2 }}
                >
                    Course Information
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            fullWidth
                            label="Course Code"
                            value={courseCode || ""}
                            name="courseCode"
                            size="small"
                            onChange={(e) => {
                                setCourseCode(e.target.value);
                                setUmcErrors(prev => ({ ...prev, courseCode: "" }));
                            }}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon />
                                    </InputAdornment>
                                ),
                            }}
                            disabled={!studentFetched}
                            error={!!umcErrors.courseCode}
                            helperText={umcErrors.courseCode}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            fullWidth
                            label="Term Id"
                            value={termId || ""}
                            name="termId"
                            size="small"
                            onChange={(e) => {
                                setTermId(e.target.value);
                                setUmcErrors(prev => ({ ...prev, termId: "" }));
                            }}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon />
                                    </InputAdornment>
                                ),
                            }}
                            disabled={!studentFetched}
                            error={!!umcErrors.termId}
                            helperText={umcErrors.termId}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <FormControl
                            fullWidth
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                        >
                            <InputLabel id="reason-label">UMC Reason</InputLabel>
                            <Select
                                labelId="reason-label"
                                id="reason"
                                value={reason}
                                label="UMC Reason"
                                onChange={(e) => {
                                    setReason(e.target.value);
                                    setUmcErrors(prev => ({ ...prev, reason: "" }));
                                }}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <DescriptionIcon />
                                    </InputAdornment>
                                }
                                size="small"
                            >
                                {/* <MenuItem value="">
                                    <em>Select Reason</em>
                                </MenuItem> */}
                                {umcReason?.map((option, index) => (
                                    <MenuItem key={index} value={option.UmcReasons}>
                                        {option.UmcReasons}
                                    </MenuItem>
                                ))}
                            </Select>
                            {umcErrors.reason && (
                                <Typography color="error" variant="caption">
                                    {umcErrors.reason}
                                </Typography>
                            )}
                        </FormControl>
                    </Grid>
                </Grid>

                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="primary"
                    gutterBottom
                    sx={{ mb: 2 }}
                >
                    Sheet Information
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            fullWidth
                            label="Old Sheet No."
                            type="number"
                            value={oldSheetNo}
                            onChange={(e) => {
                                setOldSheetNo(e.target.value);
                                setUmcErrors(prev => ({ ...prev, oldSheetNo: "" }));
                            }}
                            size="small"
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <NumbersIcon />
                                    </InputAdornment>
                                ),
                            }}
                            error={!!umcErrors.oldSheetNo}
                            helperText={umcErrors.oldSheetNo}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={newSheet}
                                    onChange={(e) => setNewSheet(e.target.checked)}
                                />
                            }
                            label="Given New Sheet?"
                            sx={{ mt: 1 }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            fullWidth
                            label="New Sheet No."
                            type="number"
                            name="newSheetNo"
                            value={newSheetNo}
                            onChange={(e) => setNewSheetNo(e.target.value)}
                            disabled={!newSheet}
                            size="small"
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <NoteAddIcon />
                                    </InputAdornment>
                                ),
                            }}
                            error={!!umcErrors.newSheetNo}
                            helperText={umcErrors.newSheetNo}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            fullWidth
                            label="Handwritten Slips"
                            type="number"
                            value={handwrittenSlips}
                            onChange={(e) => {
                                setHandwrittenSlips(e.target.value);
                                setUmcErrors(prev => ({ ...prev, handwrittenSlips: "" }));
                            }}
                            size="small"
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <NoteAddIcon />
                                    </InputAdornment>
                                ),
                            }}
                            error={!!umcErrors.handwrittenSlips}
                            helperText={umcErrors.handwrittenSlips}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            fullWidth
                            label="Printed Slips"
                            type="number"
                            value={printedSlips}
                            onChange={(e) => {
                                setPrintedSlips(e.target.value);
                                setUmcErrors(prev => ({ ...prev, printedSlips: "" }));
                            }}
                            size="small"
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <NoteAddIcon />
                                    </InputAdornment>
                                ),
                            }}
                            error={!!umcErrors.printedSlips}
                            helperText={umcErrors.printedSlips}
                        />
                    </Grid>
                </Grid>

                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="primary"
                    gutterBottom
                    sx={{ mb: 2 }}
                >
                    Staff Information
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl
                            fullWidth
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                            size="small"
                        >
                            <InputLabel id="invigilator-label">Invigilator</InputLabel>
                            <Select
                                labelId="invigilator-label"
                                id="invigilator"
                                value={invigilator}
                                onChange={(e) => {
                                    setInvigilator(e.target.value);
                                    setUmcErrors(prev => ({ ...prev, invigilator: "" }));
                                }}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <AssignmentIndIcon />
                                    </InputAdornment>
                                }
                                label="Invigilator"
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            width: 180, // 👈 Set custom dropdown width (adjust as needed)
                                            maxHeight: 200, // optional: limit height with scroll
                                        },
                                    },
                                }}
                            >
                                {/* <MenuItem value="">
                                    <em>Select Invigilator</em>
                                </MenuItem> */}
                                {schoolStaff
                                    ?.filter((staff) => typeof staff?.Name === "string" && staff.Name.trim() !== "")
                                    .map((staff, idx) => (
                                        <MenuItem key={idx} value={(staff.Name as string).trim()}>
                                            {(staff.Name as string).trim()}
                                        </MenuItem>
                                    ))}
                            </Select>

                            {umcErrors.invigilator && (
                                <Typography color="error" variant="caption">
                                    {umcErrors.invigilator}
                                </Typography>
                            )}
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="UMC caught by"
                            type="text"
                            value={caughtBy}
                            onChange={(e) => {
                                setCaughtBy(e.target.value);
                                setUmcErrors(prev => ({ ...prev, caughtBy: "" }));
                            }}
                            size="small"
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <NoteAddIcon />
                                    </InputAdornment>
                                ),
                            }}
                            error={!!umcErrors.caughtBy}
                            helperText={umcErrors.caughtBy}
                        />
                    </Grid>
                </Grid>

                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="primary"
                    gutterBottom
                    sx={{ mb: 2 }}
                >
                    Additional Information
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Any other remarks"
                            multiline
                            rows={3}
                            value={remarks}
                            onChange={(e) => {
                                setRemarks(e.target.value);
                                setUmcErrors(prev => ({ ...prev, remarks: "" }));
                            }}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment
                                        position="start"
                                        sx={{ alignSelf: "flex-start", mt: 1 }}
                                    >
                                        <CommentIcon />
                                    </InputAdornment>
                                ),
                            }}
                            error={!!umcErrors.remarks}
                            helperText={umcErrors.remarks}
                        />
                    </Grid>
                </Grid>

                <Box mt={4} display="flex" justifyContent="center" gap={2} flexDirection="column" alignItems="center">
                    <Box display="flex" gap={2}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={!isSubmitting ? <SaveIcon /> : null}
                            sx={{ borderRadius: 1, px: 4, py: 1 }}
                            onClick={handleSubmit}
                            disabled={isSaveDisabled || isSubmitting}
                        >
                            {isSubmitting ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Save UMC"
                            )}
                        </Button>
                        <Button
                            type="reset"
                            variant="outlined"
                            color="secondary"
                            size="large"
                            sx={{ borderRadius: 1, px: 4, py: 1 }}
                            onClick={handleReset}
                        >
                            Reset Form
                        </Button>
                    </Box>
                    {/* <Box display="flex" flexDirection="column" alignItems="center" width="100%">
                        {umcPunchRes && (
                            <Alert
                                severity={
                                    umcPunchRes.toLowerCase().includes("already marked")
                                        ? "error"
                                        : "success"
                                }
                                sx={{ mb: 3, width: "100%" }}
                            >
                                {umcPunchRes}
                            </Alert>
                        )}
                    </Box> */}
                </Box>
            </Paper>

            <Dialog
                open={casesDialogOpen}
                onClose={() => setCasesDialogOpen(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle
                    sx={{
                        bgcolor: "#1976d2",
                        color: "white",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Box display="flex" alignItems="center">
                        <ListIcon sx={{ mr: 1 }} />
                        Registered UMC Cases
                    </Box>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => setCasesDialogOpen(false)}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <BlankCard>
                        <EnhancedTableToolbar />
                        <TableContainer>
                            <Table
                                sx={{ minWidth: 750 }}
                                aria-labelledby="umc-cases-table"
                                size={dense ? "small" : "medium"}
                            >
                                <EnhancedTableHead
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                    rowCount={allUmcCases?.length}
                                />
                                <TableBody>
                                    {stableSort(allUmcCases, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((umc, index) => {
                                            const labelId = `enhanced-table-row-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    tabIndex={-1}
                                                    key={index}
                                                    sx={{
                                                        "& td": {
                                                            backgroundColor: (theme: any) =>
                                                                theme.palette.mode === "light" ? "white" : "#111c2d",
                                                        },
                                                    }}
                                                >
                                                    <TableCell>{umc?.RegistrationNumber}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={umc.ExamType == "5" ? "Theory" : "Practical"}
                                                            size="small"
                                                            color={
                                                                umc.ExamType === "Theory"
                                                                    ? "primary"
                                                                    : "secondary"
                                                            }
                                                            sx={{ fontWeight: "bold" }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{umc.CourseCode}</TableCell>
                                                    <TableCell>{umc.TermId}</TableCell>
                                                    <TableCell>
                                                        <Tooltip title={umc.Remarks}>
                                                            <Typography noWrap sx={{ maxWidth: 150 }}>
                                                                {umc.Remarks}
                                                            </Typography>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Tooltip title="View Details">
                                                            <IconButton
                                                                size="small"
                                                                color="info"
                                                                onClick={() => handleViewDetails(umc)}
                                                            >
                                                                <InfoIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow
                                            style={{
                                                height: (dense ? 33 : 53) * emptyRows,
                                            }}
                                        >
                                            <TableCell colSpan={8} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={allUmcCases?.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        <Box p={2}>
                            <MuiFormControlLabel
                                control={
                                    <CustomSwitch
                                        checked={dense}
                                        onChange={handleChangeDense}
                                    />
                                }
                                label="Dense padding"
                            />
                        </Box>
                    </BlankCard>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCasesDialogOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={detailsDialogOpen}
                onClose={() => setDetailsDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                {selectedUmc && (
                    <>
                        <DialogTitle
                            sx={{
                                bgcolor: "#1976d2",
                                color: "white",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Box display="flex" alignItems="center">
                                <DescriptionIcon sx={{ mr: 1 }} />
                                UMC Case Details: {selectedUmc.RegistrationNumber}
                            </Box>
                            <IconButton
                                edge="end"
                                color="inherit"
                                onClick={() => setDetailsDialogOpen(false)}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12 }}>
                                    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                            color="primary"
                                            gutterBottom
                                        >
                                            Exam Information
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 3 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Exam Type
                                                </Typography>
                                                <Chip
                                                    label={selectedUmc.ExamType === "5" ? "Theory" : "Practical"}
                                                    size="small"
                                                    color={
                                                        selectedUmc.ExamType === "Theory"
                                                            ? "primary"
                                                            : "secondary"
                                                    }
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 3 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Course Code
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {selectedUmc.CourseCode}
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 3 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Term ID
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {selectedUmc.TermId}
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 3 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    UMC Reason
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {selectedUmc.Remarks}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Paper variant="outlined" sx={{ p: 2, mb: 2, height: "100%" }}>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                            color="primary"
                                            gutterBottom
                                        >
                                            Sheet Information
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Old Sheet No.
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {selectedUmc.OLDSheetNo}
                                                </Typography>
                                            </Grid>
                                            {selectedUmc.NewSheetNo && (
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        New Sheet No.
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {selectedUmc.NewSheetNo}
                                                    </Typography>
                                                </Grid>
                                            )}
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Printed Slips
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {selectedUmc.PrintedSlips}
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Handwritten Slips
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {selectedUmc.HandwrittenSlips}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Paper variant="outlined" sx={{ p: 2, mb: 2, height: "100%" }}>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                            color="primary"
                                            gutterBottom
                                        >
                                            Staff Information
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    UMC Caught By
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {selectedUmc.UmcCaughtBy}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                                {selectedUmc.Remarks && (
                                    <Grid size={{ xs: 12 }}>
                                        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                                            <Typography
                                                variant="subtitle1"
                                                fontWeight="bold"
                                                color="primary"
                                                gutterBottom
                                            >
                                                Additional Remarks
                                            </Typography>
                                            <Typography variant="body1">
                                                {selectedUmc.Remarks}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                )}
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => setDetailsDialogOpen(false)}
                                color="primary"
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
                open={studentLoading || isSubmitting}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
};

export default FifthStep;