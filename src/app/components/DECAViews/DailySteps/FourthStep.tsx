"use client";
import * as React from "react";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  Stack,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Switch,
  Button,
  TextField,
  InputAdornment,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  MeetingRoom as RoomIcon,
  People as PeopleIcon,
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  HourglassEmpty as PendingIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  CheckCircle,
  School as SchoolIcon,
} from "@mui/icons-material";
import { IconSearch, IconDownload } from "@tabler/icons-react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import customscroll from "../../custom-scroll/Scrollbar";
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import { theoryRooms } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/AttendanceMarking/theoryRooms";
import { GetPracticalAwardList } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/AttendanceMarking/Practical/practicalAwardList";
import { practicalCourses } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/AttendanceMarking/Practical/practicalCourses";
import { practicalstudentlist } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/AttendanceMarking/Practical/practicalstudentlist";
import { saveUpdateStudentAttendance } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/AttendanceMarking/saveUpdateStudentAttendance";
import { saveAttendancePractical } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/AttendanceMarking/Practical/saveAttendancePractical";
import { saveUpdatePracticalMarks } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/AttendanceMarking/Practical/saveUpdatePracticalMarks";
import { getFacultyProfile } from "@/app/actions/DECAActions/DistanceExamination/dummy/facultyProfile";
import { activityCompletePractical } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/AttendanceMarking/Practical/activityCompletePractical";
import { theoryStudentList } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/AttendanceMarking/theoryStudentList";
import { neutralID } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/AttendanceMarking/Practical/neutralID";

// Import API actions and encryption utilities
interface FourthStepProps {
  selectedDate: Date | null;
  selectedTime: string;
  examType: number; // 5 for Theory, 6 for Practical
  setFourthStepDone: (done: boolean) => void;
}
interface TheoryRoom {
  Id: string;
  RoomId: number;
  Total: number;
  Present: number;
  Absent: number;
  Status: string;
}

interface TheoryStudent {
  Id: number;
  SMSID: number;
  ECode: string;
  RegdNo: string;
  CourseCode: string;
  Name: string;
  AttendanceCode: string;
}

interface PracticalStudent {
  ECode?: string; // Added for PDF generation
  RegdNo: number;
  Section: string;
  StudentGroup: number;
  TermId: string;
  CourseCode: string;
  StudentName: string;
  RollNumber: string;
  Experiment: string | null;
  "GD Topic": string | null;
  [key: string]: any;
}

interface NeutralProfile {
  employeeCode: number;
  name: string;
  dateOfBirth: string;
  gender: string | null;
  mobileNo: string;
  email: string | null;
  snap: string | null;
}

const FourthStep: React.FC<FourthStepProps> = ({ selectedDate, selectedTime, examType, setFourthStepDone }) => {
  const { data: session } = useSession();
  const username = useSelector((state: any) => state.user?.username);
  const centerNo = useSelector((state: any) => state.center.centerNumber);
  const isDataFetched = React.useRef({ theory: false, practical: false });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [dialogLoading, setDialogLoading] = React.useState(false);
  const [dialogError, setDialogError] = React.useState<string | null>(null);
  const [profileLoading, setProfileLoading] = React.useState(true); // Added: Profile loading state

  // Theory states
  const [theoryRoomsData, setTheoryRoomsData] = React.useState<TheoryRoom[]>([]);
  const [theoryStudents, setTheoryStudents] = React.useState<TheoryStudent[]>([]);
  const [selectedRoom, setSelectedRoom] = React.useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = React.useState<number | null>(null);
  const [roomSearch, setRoomSearch] = React.useState("");
  const [studentSearch, setStudentSearch] = React.useState("");
  const [courseFilter, setCourseFilter] = React.useState("");
  const [attendance, setAttendance] = React.useState<{
    [key: string]: "Present" | "Absent" | "Pending";
  }>({});
  const [tempAttendance, setTempAttendance] = React.useState<{
    [key: string]: "Present" | "Absent" | "Pending";
  }>({});
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);

  // Practical states
  const [neutralProfile, setNeutralProfile] = React.useState<NeutralProfile | null>(null);
  const [awardListData, setAwardListData] = React.useState<any[]>([]); // Added for PDF data
  const [selectedExamDate, setSelectedExamDate] = React.useState<string>("");
  const [selectedSession, setSelectedSession] = React.useState<string>("");
  const [courseCodes, setCourseCodes] = React.useState<string[]>([]);
  const [selectedCourseCode, setSelectedCourseCode] = React.useState<string>("");
  const [practicalStudents, setPracticalStudents] = React.useState<PracticalStudent[]>([]);
  const [practicalAttendance, setPracticalAttendance] = React.useState<{
    [key: string]: boolean;
  }>({});
  const [practicalMarks, setPracticalMarks] = React.useState<{
    [key: string]: { [compId: string]: number | null };
  }>({});
  const [completedCourses, setCompletedCourses] = React.useState<string[]>([]);

  // Format date for API
  const formatDateForAPI = (date: Date | null): string => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  // Format exam date like "09 Sep 2025"
  const formatExamDate = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Format print date like "22-09-2025"
  const formatPrintDate = (): string => {
    const now = new Date();
    return now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
  };

  // Safe decryption wrapper with validation
  const safeDecrypt = (response: any, key: string): any => {
    try {
      if (!response) {
        // console.error("Response is undefined or null");
        return null;
      }
      const decryptedData = decryptDataforResponse(response, key);
      if (!decryptedData) {
        console.error("Decrypted data is empty");
        return null;
      }
      const parsed = JSON.parse(decryptedData);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        console.error("Parsed data is not a non-empty array");
        return null;
      }
      return parsed;
    } catch (error) {
      console.error("Error in decryption or parsing:", error);
      return null;
    }
  };

  // Fetch Theory data
  const fetchTheoryData = React.useCallback(async () => {
    if (!session?.user?.token || !centerNo) {
      console.error("Missing token or centerNo for theory data fetch");
      return;
    }

    setLoading(true);

    try {
      const splitValue = session?.user?.token?.split("NEXT2121ANG");
      const formfields = {
        CenterNo: centerNo,
        ExamDate: formatDateForAPI(selectedDate),
        ExamTime: selectedTime,
        Param: 1,
      };
      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const response = await theoryRooms(Data);
      if (!response?.status) return
      const parsedData = safeDecrypt(response?.data, splitValue[1]);
      setTheoryRoomsData(parsedData || []);

    } catch (error) {
      console.error("🚫 Error fetching theory rooms:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch theory rooms");
      setTheoryRoomsData([]);
    } finally {
      setLoading(false);
      isDataFetched.current.theory = true;
    }
  }, [session?.user?.token, centerNo, selectedDate, selectedTime]);

  // Fetch Theory students for selected room
  const fetchTheoryStudents = React.useCallback(async (roomId: number) => {
    if (!session?.user?.token || !centerNo) {
      console.error("🚫 Missing session token or center number:", {
        hasToken: !session?.user?.token,
        centerNo,
      });
      setDialogError("Missing session token or center number");
      return;
    }

    setDialogLoading(true);
    setDialogError(null);

    try {
      const splitValue = session?.user?.token?.split("NEXT2121ANG");
      const formfields = {
        CenterNo: centerNo,
        ExamDate: formatDateForAPI(selectedDate),
        ExamTime: selectedTime,
        Param: 2,
        RoomId: roomId,
      };
      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const response = await theoryStudentList(Data);
      console.log("Raw Response for Theory Students:", response?.status);
       if(!response?.status) return
      const parsedData = safeDecrypt(response.data, splitValue[1]);
      console.log("Fetched Theory Students:", parsedData);
      setTheoryStudents(parsedData || []);

      const initialAttendance = (parsedData || []).reduce(
        (acc: { [key: string]: "Present" | "Absent" | "Pending" }, student: TheoryStudent) => {
          const code = student.AttendanceCode?.trim() || ''; // safely handle null
          acc[student.Id.toString()] =
            !code || code === "P" ? "Present" : "Absent";
          return acc;
        },
        {}
      );
      setAttendance(initialAttendance);
      setTempAttendance(initialAttendance);
    } catch (error) {
      console.error("🚫 Error fetching theory students:", error);
      setDialogError(error instanceof Error ? error.message : "Failed to fetch students");
      setTheoryStudents([]);
    } finally {
      setDialogLoading(false);
    }
  }, [session?.user?.token, centerNo, selectedDate, selectedTime]);

  // Fetch Observer Profile for Theory Exams
  const fetchObserverProfile = React.useCallback(async () => {
    if (session?.user?.token || !username) return;

    setProfileLoading(true); // Added: Set profile loading state
    try {
      const formfields = {
        EmpId: Number(username),
      };
      const splitValue = String(session?.user?.token).split("NEXT2121ANG");
      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const response = await getFacultyProfile(Data);
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
      const parsedData = JSON.parse(decryptedData);

      if (parsedData && parsedData.length > 0) {
        const rawProfile = parsedData[0];
        const normalizedProfile: NeutralProfile = {
          employeeCode: rawProfile.EmployeeCode || rawProfile.employeeCode || 0,
          name: rawProfile.Name || rawProfile.name || '',
          dateOfBirth: rawProfile.DateOfBirth || rawProfile.dateOfBirth || '',
          gender: rawProfile.Gender || rawProfile.gender || null,
          mobileNo: rawProfile.MobileNo || rawProfile.mobileNo || '',
          email: rawProfile.Email || rawProfile.email || null,
          snap: rawProfile.Snap || rawProfile.snap || null,
        };
        setNeutralProfile(normalizedProfile);
      } else {
        console.warn("No profile data found in observer response");
        setNeutralProfile(null);
      }
    } catch (error) {
      console.error("🚫 Error fetching observer profile:", error);
      setNeutralProfile(null);
    } finally {
      setProfileLoading(false); // Added: Clear profile loading state
    }
  }, [session?.user?.token, username]);

  // Fetch Practical data
  const fetchPracticalData = React.useCallback(async () => {
    if (!session?.user?.token || !centerNo) {
      console.error("Missing token or centerNo for practical data fetch");
      return;
    }

    setLoading(true);
    setProfileLoading(true);

    try {
      const splitValue = session?.user?.token?.split("NEXT2121ANG");
      let profile: NeutralProfile | null = null;

      // Try fetching neutral profile first
      try {
        const neutralFormfields = {
          CenterNo: centerNo,
          EDate: formatDateForAPI(selectedDate),
        };
        const neutralCredentialsJson = JSON.stringify(neutralFormfields);
        const { Data: neutralData } = encryptData(neutralCredentialsJson, splitValue[1]);
        const neutralResponse = await neutralID(neutralData);
        const parsedNeutral = safeDecrypt(neutralResponse?.data ?? neutralResponse?.data, splitValue[1]);

        if (neutralResponse?.status === "success" && Array.isArray(parsedNeutral) && parsedNeutral.length > 0) {
          const rawProfile = parsedNeutral[0];
          profile = {
            employeeCode: rawProfile.EmployeeCode || rawProfile.employeeCode || 0,
            name: rawProfile.Name || rawProfile.name || '',
            dateOfBirth: rawProfile.DateOfBirth || rawProfile.dateOfBirth || '',
            gender: rawProfile.Gender || rawProfile.gender || null,
            mobileNo: rawProfile.MobileNo || rawProfile.mobileNo || '',
            email: rawProfile.Email || rawProfile.email || null,
            snap: rawProfile.Snap || rawProfile.snap || null,
          };
        } else {
          console.warn("No neutral profile data found");

        }
      } catch (neutralError) {
        console.error("🚫 Error fetching neutral profile:", neutralError);
      }

      // Fallback to observer profile if neutral profile is not found
      if (!profile) {
        const profileFormfields = { EmpId: parseInt(username) || username };
        const profileCredentialsJson = JSON.stringify(profileFormfields);
        const { Data: profileData } = encryptData(profileCredentialsJson, splitValue[1]);
        // ("Encrypted Data for getprofileAction (fallback):", profileData);
        const profileResponse = await getFacultyProfile(profileData);
        const parsedProfile = safeDecrypt(profileResponse?.data, splitValue[1]);
        if (parsedProfile && parsedProfile.length > 0) {
          const rawProfile = parsedProfile[0];
          profile = {
            employeeCode: rawProfile.EmployeeCode || rawProfile.employeeCode || 0,
            name: rawProfile.Name || rawProfile.name || '',
            dateOfBirth: rawProfile.DateOfBirth || rawProfile.dateOfBirth || '',
            gender: rawProfile.Gender || rawProfile.gender || null,
            mobileNo: rawProfile.MobileNo || rawProfile.mobileNo || '',
            email: rawProfile.Email || rawProfile.email || null,
            snap: rawProfile.Snap || rawProfile.snap || null,
          };
        }
      }

      if (profile) {
        setNeutralProfile(profile);

        setSelectedExamDate(formatDateForAPI(selectedDate));
        setSelectedSession(selectedTime);

        // Fetch award list data for PDF generation
        const awardFormfields = {
          Neutral: profile.employeeCode.toString(),
          ExamDate: formatDateForAPI(selectedDate),
          Session: selectedTime,
        };
        const awardCredentialsJson = JSON.stringify(awardFormfields);
        const { Data: awardData } = encryptData(awardCredentialsJson, splitValue[1]);
        const awardResponse = await GetPracticalAwardList(awardData);
        const parsedAward = safeDecrypt(awardResponse?.data, splitValue[1]);
        setAwardListData(parsedAward || []);

        // Directly fetch courses using selected date and time
        const formfields = {
          Neutral: profile.employeeCode.toString(),
          ExamDate: formatDateForAPI(selectedDate),
          Session: selectedTime,
        };
        const credentialsJson = JSON.stringify(formfields);
        const { Data } = encryptData(credentialsJson, splitValue[1]);
        const response = await practicalCourses(Data);
        if (!response?.status) {
          throw new Error(response?.message || "Failed to fetch practical courses");
        }
        const parsedData = safeDecrypt(response?.data, splitValue[1]);
        const codes = (parsedData || []).map((c: any) => c.CourseCode);
        setCourseCodes(codes);
        if (codes.length === 0) {
          setFourthStepDone(true);
          setCourseCodes([]);
          setSelectedCourseCode("");
        }
      } else {
        console.error("No profile could be fetched for practical");
      }
    } catch (error) {
      console.error("🚫 Error fetching practical data:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch practical data");
    } finally {
      setLoading(false);
      setProfileLoading(false);
      isDataFetched.current.practical = true;
    }
  }, [session?.user?.token, centerNo, username, selectedDate, selectedTime]);
  // Fetch practical students
  const fetchPracticalStudents = React.useCallback(async (courseCode: string) => {
    if (!neutralProfile || !selectedExamDate || !selectedSession || !courseCode || !session?.user?.token) {
      console.error("Missing params for practical students fetch");
      return;
    }

    setLoading(true);

    try {
      const splitValue = session?.user?.token?.split("NEXT2121ANG");
      const formfields = {
        Neutral: neutralProfile.employeeCode.toString(),
        ExamDate: selectedExamDate,
        Session: selectedSession,
        CourseCode: courseCode,
      };
      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const response = await practicalstudentlist(Data);
      const parsedData = safeDecrypt(response?.data, splitValue[1]);
      setPracticalStudents(parsedData || []);

      const initialAttendance = (parsedData || []).reduce((acc: { [key: string]: boolean }, student: PracticalStudent) => {
        const markKeys = Object.keys(student).filter(key => key.includes(';'));
        const isAbsent = markKeys.length > 0 && markKeys.every(key => student[key] === 777);
        acc[student.RegdNo.toString()] = !isAbsent;
        return acc;
      }, {});

      setPracticalAttendance(initialAttendance);

      const initialMarks = (parsedData || []).reduce((acc: { [key: string]: { [compId: string]: number | null } }, student: PracticalStudent) => {
        acc[student.RegdNo.toString()] = {};
        Object.keys(student).forEach((key) => {
          if (key.includes(";")) {
            const compId = key.split(";")[0];
            const value = student[key];
            acc[student.RegdNo.toString()][compId] = value === 777 ? null : value;
          }
        });
        return acc;
      }, {});

      setPracticalMarks(initialMarks);
    } catch (error) {
      console.error("🚫 Error fetching practical students:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch practical students");
    } finally {
      setLoading(false);
    }
  }, [neutralProfile, selectedExamDate, selectedSession, session?.user?.token]);

  // Helper to compute attendance and marks
  const getStudentData = (student: any) => {
    const markKeys = Object.keys(student).filter(k => k.includes(';'));
    const isAbsent = markKeys.length > 0 && markKeys.every(k => student[k] === null || student[k] === 777);
    const att = isAbsent ? 'A' : 'P';
    let written = 0, lab = 0, viva = 0;
    markKeys.forEach(k => {
      const parts = k.split(';');
      const type = parts[2].toLowerCase();
      const val = student[k];
      if (val !== null && val !== 777 && typeof val === 'number') {
        if (type.includes('written')) written = val;
        else if (type.includes('lab')) lab = val;
        else if (type.includes('viva')) viva = val;
      }
    });
    const total = written + lab + viva;
    const expNo = student.Experiment || student['GD Topic'] || '';
    return { att, written, lab, viva, total, expNo, isAbsent };
  };

  // Generate Attendance Sheet PDF
  const generateAttendanceSheetPDF = React.useCallback(() => {
    if (awardListData.length === 0) return;

    const doc = new jsPDF('landscape', 'mm', 'a4');
    const centerCode = centerNo || '556';
    const examDateFormatted = formatExamDate(selectedExamDate);
    const printDate = formatPrintDate();
    const pageWidth = 297;
    const centerX = pageWidth / 2;

    // Line 1: Center Code (left), University name (center), Page info (right)
    doc.setFontSize(10);
    doc.text(`Center Code: ${centerCode}`, 14, 15);
    doc.setFontSize(16);
    doc.text('Lovely Professional University', centerX, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Page 1 of 1', pageWidth - 14, 15, { align: 'right' });

    // Line 2: Exam Date (left), Document type (center), Exam Time (right)
    doc.setFontSize(10);
    doc.text(`Exam Date: ${examDateFormatted}`, 14, 21);
    doc.setFontSize(14);
    doc.text('Attendance Sheet', centerX, 21, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Exam Time:- ${selectedSession}`, pageWidth - 14, 21, { align: 'right' });

    // Line 3: Exam type (center)
    doc.setFontSize(14);
    doc.text('Practical End Term Exam', centerX, 27, { align: 'center' });
    // Group by course
    // Group by course
    const grouped = awardListData.reduce((acc: { [key: string]: any[] }, student: any) => {
      const course = student.CourseCode;
      if (!acc[course]) acc[course] = [];
      acc[course].push(student);
      return acc;
    }, {});

    let y = 33;
    let ecodeCounter = 61; // Start to generate ECode like 5560061 etc.
    let overallT = 0;
    let overallP = 0;
    let overallA = 0;

    Object.entries(grouped).forEach(([course, students]: [string, any[]]) => {
      // Course header - minimal spacing
      doc.setFontSize(10);
      doc.text(`Course Code: ${course}`, 14, y);
      y += 4; // Reduced gap

      // Compute present/absent for this course
      const presentCount = students.filter((s: any) => {
        const { isAbsent } = getStudentData(s);
        return !isAbsent;
      }).length;
      const absentCount = students.length - presentCount;
      overallT += students.length;
      overallP += presentCount;
      overallA += absentCount;

      // Table data for this course
      const tableData = students.map((student: any, index: number) => {
        const { att, expNo } = getStudentData(student);
        const ecode = `${centerCode}00${ecodeCounter}`;
        ecodeCounter++;
        return [
          index + 1,
          ecode,
          student.RegdNo,
          student.TermId,
          student.StudentName,
          expNo,
          '', // AnsSheetNo
          ''  // Signature
        ];
      });

      const tableResult = autoTable(doc, {
        head: [['Sr No', 'ECode', 'Regdno', 'TermId', 'Name', 'ExpNo', 'AnsSheetNo', 'Signature']],
        body: tableData,
        startY: y,
        theme: 'grid',
        styles: {
          fontSize: 7,
          cellPadding: 0.5,
          textColor: [0, 0, 0] // Black text for body
        },
        headStyles: {
          fillColor: [200, 200, 200],
          fontSize: 7,
          textColor: [0, 0, 0] // Black text for headers
        },
        margin: { left: 14, right: 14 }
      }) as any;

      y = (tableResult?.finalY || y + 18); // Further reduced gap after table
    });

    // Course wise strength - Attendance Sheet with Total on same line
    doc.setFontSize(8);
    doc.text('Course Wise Strength:', 14, y);

    // Overall strength on the right side of same line with empty input lines
    doc.text(`Total - T: ${overallT}   P: _______   A: _______`, 200, y, { align: 'right' });

    y += 5;

    Object.entries(grouped).forEach(([course, students]: [string, any[]]) => {
      doc.text(`[${course}:  T: ${students.length}   P: _______   A: _______]`, 14, y);
      y += 4;
    });

    y += 2;
    // No signatures for Attendance Sheet

    doc.save(`Attendance_Sheet.pdf`);
  }, [awardListData, neutralProfile, centerNo, selectedExamDate, selectedSession]);

  // Generate Award List PDF
  const generateAwardListPDF = React.useCallback(() => {
    if (awardListData.length === 0) return;

    const doc = new jsPDF('landscape', 'mm', 'a4');
    const centerCode = centerNo || '556';
    const examDateFormatted = formatExamDate(selectedExamDate);
    const printDate = formatPrintDate();
    const pageWidth = 297;
    const centerX = pageWidth / 2;

    // Line 1: Center Code (left), University name (center), Page info (right)
    doc.setFontSize(10);
    doc.text(`Center Code: ${centerCode}`, 14, 15);
    doc.setFontSize(16);
    doc.text('Lovely Professional University', centerX, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Page 1 of 1', pageWidth - 14, 15, { align: 'right' });

    // Line 2: Exam Date (left), Document type (center), Exam Time (right)
    doc.setFontSize(10);
    doc.text(`Exam Date: ${examDateFormatted}`, 14, 21);
    doc.setFontSize(14);
    doc.text('Award List', centerX, 21, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Exam Time:- ${selectedSession}`, pageWidth - 14, 21, { align: 'right' });

    // Line 3: Exam type (center)
    doc.setFontSize(14);
    doc.text('Practical End Term Exam', centerX, 27, { align: 'center' });
    // Group by course
    const grouped = awardListData.reduce((acc: { [key: string]: any[] }, student: any) => {
      const course = student.CourseCode;
      if (!acc[course]) acc[course] = [];
      acc[course].push(student);
      return acc;
    }, {});

    let y = 33;
    let overallT = 0;
    let overallP = 0;
    let overallA = 0;

    Object.entries(grouped).forEach(([course, students]: [string, any[]]) => {
      // Course header - minimal spacing
      doc.setFontSize(10);
      doc.text(`Course Code: ${course}`, 14, y);
      y += 4; // Reduced gap

      // Compute present/absent for this course
      const presentCount = students.filter((s: any) => {
        const { isAbsent } = getStudentData(s);
        return !isAbsent;
      }).length;
      const absentCount = students.length - presentCount;
      overallT += students.length;
      overallP += presentCount;
      overallA += absentCount;

      // Table data for this course
      const tableData = students.map((student: any, index: number) => {
        const { att, written, lab, viva, total, expNo } = getStudentData(student);
        return [
          index + 1,
          student.RegdNo,
          student.TermId,
          student.StudentName,
          expNo,
          att,
          written,
          lab,
          viva,
          total
        ];
      });

      const tableResult = autoTable(doc, {
        head: [['Sr No', 'Regdno', 'Termid', 'Name', 'ExpNo', 'Attendance', 'written', 'lab', 'viva', 'Total']],
        body: tableData,
        startY: y,
        theme: 'grid',
        styles: {
          fontSize: 7,
          cellPadding: 0.5,
          textColor: [0, 0, 0] // Black text for body
        },
        headStyles: {
          fillColor: [200, 200, 200],
          fontSize: 7,
          textColor: [0, 0, 0] // Black text for headers
        },
        margin: { left: 14, right: 14 }
      }) as any;

      y = (tableResult?.finalY || y + 20) + 1; // Reduced gap after table
    });

    // Course wise strength - Award List with Total on same line
    doc.setFontSize(8);
    doc.text('Course Wise Strength:', 14, y);

    // Overall strength on the right side of same line with actual counts
    doc.text(`Total - T: ${overallT}   P: ${overallP}   A: ${overallA}`, 200, y, { align: 'right' });

    y += 5;

    Object.entries(grouped).forEach(([course, students]: [string, any[]]) => {
      const presentCount = students.filter((s: any) => {
        const { isAbsent } = getStudentData(s);
        return !isAbsent;
      }).length;
      const absentCount = students.length - presentCount;

      doc.text(`[${course}:  T: ${students.length}   P: ${presentCount}   A: ${absentCount}]`, 14, y);
      y += 4;
    });

    y += 2;
    // Signatures - side by side on same lines
    const sigY = y;
    doc.setFontSize(9);

    // First line: Left and Right signatures
    doc.text('Name & UID of Neutral Examiner ________________', 14, sigY);
    doc.text('Signature of Neutral Examiner ________________', 150, sigY);

    // Second line: Left and Right signatures  
    doc.text('Name & UID of Observer ________________', 14, sigY + 6);
    doc.text('Signature of Observer ________________', 150, sigY + 6);

    // Timestamp
    doc.text(`${printDate} 17:17:56`, pageWidth - 14, sigY + 6, { align: 'right' });

    doc.save(`Award_List.pdf`);
  }, [awardListData, neutralProfile, centerNo, selectedExamDate, selectedSession]);

  // Save theory attendance
  const saveTheoryAttendance = React.useCallback(async () => {
    if (!session?.user?.token) {
      console.error("🚫 Missing session token for saving attendance");
      return;
    }

    setLoading(true);
    try {
      const splitValue = session?.user?.token?.split("NEXT2121ANG");
      const attendanceData = theoryStudents.map((student) => ({
        Id: student.Id.toString(),
        AttCode: tempAttendance[student.Id.toString()] === "Present" ? "P" : "A",
        Smsid: student.SMSID.toString(),
        EntryBy: username.toString(),
      }));

      const credentialsJson = JSON.stringify(attendanceData);
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const response = await saveUpdateStudentAttendance(Data);
      const result = safeDecrypt(response?.data, splitValue[1]);

      if (
        result &&
        (
          result.message === "Attendance Updated Successfully" ||
          result.Message === "Attendance Updated Successfully" ||
          result[0]?.message === "Attendance Updated Successfully" ||
          result[0]?.Message === "Attendance Updated Successfully"
        )
      ) {
        setAttendance(tempAttendance);
        setConfirmDialogOpen(false);
        handleCloseRoomDialog();
        alert("Attendance updated successfully");
        isDataFetched.current.theory = false;
        fetchTheoryData();
      } else {
        const errorMsg =
          result?.message ||
          result?.Message ||
          result?.[0]?.message ||
          result?.[0]?.Message ||
          "Failed to save attendance";
        setError(errorMsg);
        console.error("API Error in save:", result);
      }
    } catch (error) {
      console.error("🚫 Error saving attendance:", error);
      setError(error instanceof Error ? error.message : "Failed to save attendance");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.token, theoryStudents, tempAttendance, username, fetchTheoryData]);

  // Save practical attendance
  const savePracticalAttendance = React.useCallback(async (studentRegdNo: string, status: "Present" | "Absent") => {
    if (!neutralProfile || !session?.user?.token) {
      console.error("🚫 Missing neutral profile or session token for saving attendance");
      return;
    }

    try {
      const splitValue = session?.user?.token?.split("NEXT2121ANG");
      const student = practicalStudents.find((s) => s.RegdNo.toString() === studentRegdNo);
      if (!student) {
        console.error("🚫 Student not found for RegdNo:", studentRegdNo);
        return;
      }

      const formfields = {
        Neutral: neutralProfile.employeeCode.toString(),
        ExamDate: selectedExamDate,
        Session: selectedSession,
        CourseCode: selectedCourseCode,
        TermId: student.TermId,
        ExamType: 6,
        RegNo: Number(studentRegdNo),
        Section: student.Section,
        StudentGroup: student.StudentGroup.toString(),
        MaxMarks: 5,
        Marks: status,
      };
      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const response = await saveAttendancePractical(Data);
      const decrypted = decryptDataforResponse(response?.data, splitValue[1]);
      const result = JSON.parse(decrypted);

      let success = false;
      if (Array.isArray(result) && result[0]?.Message?.includes("successfully")) {
        success = true;
      } else if (result?.Message?.includes("successfully")) {
        success = true;
      }

      if (success) {
        setPracticalAttendance((prev) => ({
          ...prev,
          [studentRegdNo]: status === "Present",
        }));
      } else {
        console.error("Failed to save attendance, result:", result);
      }
    } catch (error) {
      console.error("🚫 Failed to save attendance:", error);
    }
  }, [neutralProfile, practicalStudents, selectedExamDate, selectedSession, selectedCourseCode, session?.user?.token]);

  // Save practical marks
  const savePracticalMarks = React.useCallback(async (studentRegdNo: string, compId: string, marks: number | null, maxMarks: number) => {
    if (!neutralProfile || !session?.user?.token) {
      console.error("🚫 Missing neutral profile or session token for saving marks");
      return;
    }

    try {
      const splitValue = session?.user?.token?.split("NEXT2121ANG");
      const student = practicalStudents.find((s) => s.RegdNo.toString() === studentRegdNo);
      if (!student) {
        console.error("🚫 Student not found for RegdNo:", studentRegdNo);
        return;
      }

      const formfields = {
        Neutral: neutralProfile.employeeCode.toString(),
        ExamDate: selectedExamDate,
        Session: selectedSession,
        CourseCode: selectedCourseCode,
        TermId: student.TermId,
        CompID: compId,
        ExamType: 6,
        RegNo: Number(studentRegdNo),
        Section: student.Section,
        StudentGroup: student.StudentGroup.toString(),
        MaxMarks: maxMarks,
        Marks: `${marks ?? 0}`,
      };
      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const response = await saveUpdatePracticalMarks(Data);
      const decrypted = decryptDataforResponse(response?.data, splitValue[1]);
      const result = JSON.parse(decrypted);

      let success = false;
      if (Array.isArray(result) && result[0]?.Message?.includes("successfully")) {
        success = true;
      } else if (result?.Message?.includes("successfully")) {
        success = true;
      } else if (result?.status === "success" || result?.Status === "Success") {
        success = true;
      }

      if (success) {
        setPracticalMarks((prev) => ({
          ...prev,
          [studentRegdNo]: {
            ...prev[studentRegdNo],
            [compId]: typeof marks === 'number' ? marks : null,
          },
        }));
      } else {
        console.error("Failed to save marks, result:", result);
      }
    } catch (error) {
      console.error("🚫 Failed to save marks:", error);
    }
  }, [neutralProfile, practicalStudents, selectedExamDate, selectedSession, selectedCourseCode, session?.user?.token]);

  // Complete practical activity
  const completePracticalActivity = React.useCallback(async (courseCode: string) => {
    if (!neutralProfile || !session?.user?.token) {
      console.error("🚫 Missing neutral profile or session token for completing activity");
      return;
    }

    setLoading(true);

    // Check if all marks are entered for present students
    const allMarksEntered = practicalStudents.every((student) => {
      const isPresent = practicalAttendance[student.RegdNo.toString()];
      if (!isPresent) return true;
      const markFields = Object.keys(student).filter((key) => key.includes(";"));
      return markFields.every((field) => {
        const compId = field.split(";")[0];
        return practicalMarks[student.RegdNo.toString()]?.[compId] != null;
      });
    });

    if (!allMarksEntered) {
      alert("Please enter marks for all components for all present students before completing.");
      setLoading(false);
      return;
    }

    try {
      const splitValue = session?.user?.token?.split("NEXT2121ANG");
      const formfields = {
        Neutral: neutralProfile.employeeCode.toString(),
        ExamDate: selectedExamDate,
        Session: selectedSession,
        CourseCode: courseCode,
      };
      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const response = await activityCompletePractical(Data);
      if (!response?.status) return

      const decrypted = decryptDataforResponse(response?.data, splitValue[1]);
      const result = JSON.parse(decrypted);

      let success = false;
      if (Array.isArray(result) && result[0]?.Message?.includes("Activity marked as complete")) {
        success = true;
      } else if (result?.Message?.includes("Activity marked as complete")) {
        success = true;
      } else if (result?.status === "success" || result?.Status === "Success") {
        success = true;
      }

      if (success) {
        setCompletedCourses((prev) => [...prev, courseCode]);
        alert("Activity completed successfully");
      } else {
        console.error("Failed to complete activity, result:", result);
      }
    } catch (error) {
      console.error("🚫 Error completing activity:", error);
      setError(error instanceof Error ? error.message : "Failed to complete activity");
    } finally {
      setLoading(false);
    }
  }, [neutralProfile, selectedExamDate, selectedSession, session?.user?.token, practicalStudents, practicalAttendance, practicalMarks]);

  // Event handlers
  const handleRoomClick = (roomId: string, roomIdNum: number) => {
    setSelectedRoom(roomId);
    setSelectedRoomId(roomIdNum);
    setTheoryStudents([]);
    setStudentSearch("");
    setCourseFilter("");
    setDialogError(null);
    fetchTheoryStudents(roomIdNum);
  };

  const handleCloseRoomDialog = () => {
    setSelectedRoom(null);
    setSelectedRoomId(null);
    setTheoryStudents([]);
    setStudentSearch("");
    setCourseFilter("");
    setDialogError(null);
    setDialogLoading(false);
  };

  const handleCourseClick = (courseCode: string) => {
    setSelectedCourseCode(courseCode);
  };

  const handleAttendanceChange = (studentId: string) => {
    setTempAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "Present" ? "Absent" : "Present",
    }));
  };

  const openConfirmDialog = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = () => {
    if (examType === 5) {
      saveTheoryAttendance();
    }
  };

  const handleCancelSubmit = () => {
    setConfirmDialogOpen(false);
  };

  const handlePracticalAttendanceChange = async (studentRegdNo: string) => {
    const newPresent = !practicalAttendance[studentRegdNo];
    setPracticalAttendance((prev) => ({
      ...prev,
      [studentRegdNo]: newPresent,
    }));
    await savePracticalAttendance(studentRegdNo, newPresent ? "Present" : "Absent");
  };

  const handlePracticalMarksChange = async (studentRegdNo: string, compId: string, value: number | null, maxMarks: number) => {
    setPracticalMarks((prev) => ({
      ...prev,
      [studentRegdNo]: {
        ...prev[studentRegdNo],
        [compId]: value,
      },
    }));
    await savePracticalMarks(
      studentRegdNo,
      compId,
      value,
      maxMarks
    );
  };

  // Filter functions
  const filteredTheoryRooms = theoryRoomsData.filter((room) =>
    room.Id.toLowerCase().includes(roomSearch.toLowerCase())

  );

  const filteredTheoryStudents = theoryStudents.filter(
    (student) =>
      (student.ECode.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.RegdNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.Name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.CourseCode.toLowerCase().includes(studentSearch.toLowerCase())) &&
      (courseFilter === "" || student.CourseCode === courseFilter)
  );

  const filteredPracticalStudents = practicalStudents.filter((student) =>
    student.RegdNo.toString().includes(studentSearch.toLowerCase()) ||
    student.StudentName.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.RollNumber.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.CourseCode.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const canComplete = React.useMemo(() => {
    return practicalStudents.every((student) => {
      const isPresent = practicalAttendance[student.RegdNo.toString()];
      if (!isPresent) return true;
      const markFields = Object.keys(student).filter((key) => key.includes(";"));
      return markFields.every((field) => {
        const compId = field.split(";")[0];
        return practicalMarks[student.RegdNo.toString()]?.[compId] != null;
      });
    });
  }, [practicalStudents, practicalAttendance, practicalMarks]);

  React.useEffect(() => {
    const hasDone = filteredTheoryRooms.some((room) => room.Status === "Done");
    if (hasDone) {
      setFourthStepDone(true);
    } else {
      setFourthStepDone(false);
    }
  }, [theoryRoomsData]);

  // Effects
  React.useEffect(() => {
    if (examType === 5) {
      fetchTheoryData();
      fetchObserverProfile();
    } else {
      fetchPracticalData();
    }
  }, [examType, fetchTheoryData, fetchPracticalData, fetchObserverProfile]);

  React.useEffect(() => {
    if (examType === 6 && selectedCourseCode) {
      fetchPracticalStudents(selectedCourseCode);
    }
  }, [selectedCourseCode, fetchPracticalStudents, examType]);

  if (loading && !theoryRoomsData.length && !practicalStudents.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
        <Button
          onClick={() => {
            setError(null);
            isDataFetched.current = { theory: false, practical: false };
            if (examType === 5) {
              fetchTheoryData();
              fetchObserverProfile();
            } else {
              fetchPracticalData();
            }
          }}
          sx={{ ml: 2 }}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  // Theory Exam UI
  if (examType === 5) {
    return (
      <Box>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search Rooms"
          value={roomSearch}
          onChange={(e) => setRoomSearch(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch />
              </InputAdornment>
            ),
          }}
        />

        <Grid container spacing={1}>
          {filteredTheoryRooms.map((room , index ) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card
                onClick={() => handleRoomClick(room.Id, room.RoomId)}
                sx={{
                  cursor: "pointer",
                  height: "100%",
                  boxShadow: 1,
                  padding: "10px",
                  "&:hover": { boxShadow: 3 },
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Stack spacing={1}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: room.Status === "Done" ? "primary.main" : "warning.main",
                            width: 40,
                            height: 40,
                          }}
                        >
                          <RoomIcon sx={{ color: "white", fontSize: 20 }} />
                        </Avatar>
                        <Typography variant="h6">Room {room.Id}</Typography>
                      </Stack>
                      <Box sx={{ flexGrow: 1 }} />
                      <Chip
                        icon={
                          room.Status === "Done" ? (
                            <CheckCircle fontSize="small" />
                          ) : (
                            <PendingIcon fontSize="small" />
                          )
                        }
                        label={room.Status}
                        color={room.Status === "Done" ? "primary" : "warning"}
                        variant="filled"
                        size="small"
                      />
                    </Stack>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
                      <Chip
                        icon={<PeopleIcon fontSize="small" />}
                        label={`Total: ${room.Total}`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        icon={<PresentIcon fontSize="small" />}
                        label={`Present: ${room.Present}`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                      <Chip
                        icon={<AbsentIcon fontSize="small" />}
                        label={`Absent: ${room.Absent}`}
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Theory Student Attendance Dialog */}
        <Dialog open={!!selectedRoom} onClose={handleCloseRoomDialog} maxWidth="md" fullWidth>
          <Box sx={{ display: "flex", flexDirection: "column", height: "80vh" }}>
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "primary.main",
                color: "white",
                py: 1.5,
                px: 3,
                m: 0,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <RoomIcon />
                <Typography variant="subtitle1" fontWeight="500">
                  Room {selectedRoom} Attendance
                </Typography>
              </Box>
              <IconButton onClick={handleCloseRoomDialog} color="inherit" size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <Box sx={{ px: 3, pt: 3, pb: 2 }}>
              {dialogLoading && (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <CircularProgress />
                </Box>
              )}
              {dialogError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {dialogError}
                  <Button onClick={() => selectedRoomId && fetchTheoryStudents(selectedRoomId)} sx={{ ml: 2 }}>
                    Retry
                  </Button>
                </Alert>
              )}
              {!dialogLoading && !dialogError && (
                <>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, gap: 2, flexWrap: "wrap" }}>
                    <Chip
                      icon={<PeopleIcon />}
                      label={`Total Students: ${filteredTheoryStudents.length}`}
                      variant="filled"
                      color="default"
                    />
                    <Chip
                      icon={<PresentIcon />}
                      label={`Present: ${filteredTheoryStudents.filter(
                        (student) => tempAttendance[student.Id.toString()] === "Present"
                      ).length
                        }`}
                      variant="filled"
                      color="success"
                    />
                    <Chip
                      icon={<AbsentIcon />}
                      label={`Absent: ${filteredTheoryStudents.filter(
                        (student) => tempAttendance[student.Id.toString()] === "Absent"
                      ).length
                        }`}
                      variant="filled"
                      color="error"
                    />
                  </Box>

                  <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                      <TextField
                        variant="outlined"
                        placeholder="Search Students"
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <IconSearch />
                            </InputAdornment>
                          ),
                        }}
                        size="small"
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="course-filter-label">Course</InputLabel>
                        <Select
                          labelId="course-filter-label"
                          value={courseFilter}
                          onChange={(e) => setCourseFilter(e.target.value)}
                          label="Course"
                        >
                          <MenuItem value="">All Courses</MenuItem>
                          {Array.from(new Set(theoryStudents.map((student) => student.CourseCode))).map((code) => (
                            <MenuItem key={code} value={code}>
                              {code}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </>
              )}
            </Box>

            {!dialogLoading && !dialogError && (
              <Box
                component={customscroll}
                sx={{
                  flex: "1 1 auto",
                  overflowY: "auto",
                  px: 3,
                  pb: 2,
                }}
              >
                {filteredTheoryStudents.length > 0 ? (
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>ECode</TableCell>
                        <TableCell>Regd No</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Course Code</TableCell>
                        <TableCell align="center">Attendance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredTheoryStudents.map((student) => (
                        <TableRow key={student.Id}>
                          <TableCell>{student.ECode}</TableCell>
                          <TableCell>{student.RegdNo}</TableCell>
                          <TableCell>{student.Name}</TableCell>
                          <TableCell>{student.CourseCode}</TableCell>
                          <TableCell align="center">
                            <Switch
                              checked={tempAttendance[student.Id.toString()] === "Present"}
                              onChange={() => handleAttendanceChange(student.Id.toString())}
                              color={tempAttendance[student.Id.toString()] === "Present" ? "success" : "error"}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography variant="body1" align="center" sx={{ py: 2 }}>
                    No students found for this room.
                  </Typography>
                )}
              </Box>
            )}

            <DialogActions sx={{ p: 3, justifyContent: "center" }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={openConfirmDialog}
                sx={{ minWidth: 200 }}
                disabled={loading || dialogLoading || filteredTheoryStudents.length === 0}
              >
                {loading ? <CircularProgress size={20} /> : "Submit Attendance"}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        {/* Theory Confirmation Dialog */}
        <Dialog open={confirmDialogOpen} onClose={handleCancelSubmit} maxWidth="sm" fullWidth>
          <DialogTitle
            sx={{
              backgroundColor: "success.main",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CheckCircle />
            Confirm Attendance Submission
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Please review the attendance details before submitting:
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={{ xs: 4 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "grey.200",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" color="text.primary" fontWeight="bold">
                    {filteredTheoryStudents.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Students
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "grey.200",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    {
                      filteredTheoryStudents.filter(
                        (student) => tempAttendance[student.Id.toString()] === "Present"
                      ).length
                    }
                  </Typography>
                  <Typography variant="caption" color="success.dark">
                    Present
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "grey.200",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" color="error.main" fontWeight="bold">
                    {
                      filteredTheoryStudents.filter(
                        (student) => tempAttendance[student.Id.toString()] === "Absent"
                      ).length
                    }
                  </Typography>
                  <Typography variant="caption" color="error.dark">
                    Absent
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", textAlign: "center" }}
            >
              This action cannot be undone after submission.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCancelSubmit} variant="outlined" color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              variant="contained"
              color="success"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : <CheckCircle />}
            >
              {loading ? "Submitting..." : "Submit Attendance"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  // Practical Exam UI
  return (
    <Box>
      {profileLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
          <CircularProgress size={24} />
        </Box>
      ) : neutralProfile ? (
        <Card sx={{ mb: 3, p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={neutralProfile.snap ? `data:image/jpeg;base64,${neutralProfile.snap}` : undefined}
              sx={{ width: 60, height: 60 }}
            >
              {!neutralProfile.snap && neutralProfile.name && typeof neutralProfile.name === 'string' && neutralProfile.name.length > 0
                ? neutralProfile.name.charAt(0)
                : '?'}
            </Avatar>
            <Box>
              <Typography variant="h6">{neutralProfile.name || 'Unknown'}</Typography>
              <Typography variant="body2" color="text.secondary">
                UID: {neutralProfile.employeeCode || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mobile: {neutralProfile.mobileNo || 'N/A'}
              </Typography>
            </Box>
          </Stack>
        </Card>
      ) : (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Profile data could not be loaded.
        </Alert>
      )}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">
          Available Course Codes
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<IconDownload />}
            onClick={generateAttendanceSheetPDF}
            disabled={awardListData.length === 0}
            size="small"
          >
            Attendance Sheet
          </Button>
          <Button
            variant="outlined"
            startIcon={<IconDownload />}
            onClick={generateAwardListPDF}
            disabled={awardListData.length === 0}
            size="small"
          >
            Award List
          </Button>
        </Stack>
      </Stack>
      {courseCodes.length > 0 ? (
        <>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {courseCodes.map((courseCode) => (
              <Grid key={courseCode} size={{ xs: 12, sm: 4, md: 3 }}>
                <Card
                  onClick={() => handleCourseClick(courseCode)}
                  sx={{
                    cursor: "pointer",
                    p: 1,
                    "&:hover": { boxShadow: 3 },
                    border: selectedCourseCode === courseCode ? 2 : 1,
                    borderColor: selectedCourseCode === courseCode ? "primary.main" : "divider",
                  }}
                >
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar
                        sx={{
                          bgcolor: completedCourses.includes(courseCode) ? "success.main" : "primary.main",
                          width: 40,
                          height: 40,
                        }}
                      >
                        <SchoolIcon />
                      </Avatar>
                      <Typography variant="h6">{courseCode}</Typography>
                    </Stack>
                    <Chip
                      label={completedCourses.includes(courseCode) ? "Completed" : "Pending"}
                      color={completedCourses.includes(courseCode) ? "success" : "warning"}
                      size="small"
                    />
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Typography variant="h6" sx={{ mb: 2 }}>
          No more courses pending
        </Typography>
      )}

      <Dialog
        open={!!selectedCourseCode && practicalStudents.length > 0}
        onClose={() => setSelectedCourseCode("")}
        maxWidth="lg"
        fullWidth
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "85vh" }}>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "primary.main",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SchoolIcon />
              <Typography variant="h6">{selectedCourseCode} - Practical Marks Entry</Typography>
            </Box>
            <IconButton onClick={() => setSelectedCourseCode("")} color="inherit">
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <Box sx={{ p: 3 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Mark attendance and enter marks for each component. All fields are required.
              </Typography>
            </Alert>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, gap: 2, flexWrap: "wrap" }}>
              <Chip
                icon={<PeopleIcon />}
                label={`Total Students: ${filteredPracticalStudents.length}`}
                variant="filled"
                color="default"
              />
              <Chip
                icon={<PresentIcon />}
                label={`Present: ${filteredPracticalStudents.filter(
                  (student) => practicalAttendance[student.RegdNo.toString()]
                ).length
                  }`}
                variant="filled"
                color="success"
              />
              <Chip
                icon={<AbsentIcon />}
                label={`Absent: ${filteredPracticalStudents.filter(
                  (student) => !practicalAttendance[student.RegdNo.toString()]
                ).length
                  }`}
                variant="filled"
                color="error"
              />
              <Chip
                icon={<CheckCircle />}
                label={`Completed: ${filteredPracticalStudents.filter(
                  (student) => {
                    const isPresent = practicalAttendance[student.RegdNo.toString()];
                    if (!isPresent) return false;
                    const markFields = Object.keys(student).filter((key) => key.includes(";"));
                    return markFields.every((field) => {
                      const compId = field.split(";")[0];
                      return practicalMarks[student.RegdNo.toString()]?.[compId] != null;
                    });
                  }
                ).length
                  }`}
                variant="filled"
                color="primary"
              />
              <Chip
                icon={<PendingIcon />}
                label={`Pending: ${filteredPracticalStudents.filter(
                  (student) => {
                    const isPresent = practicalAttendance[student.RegdNo.toString()];
                    if (!isPresent) return false;
                    const markFields = Object.keys(student).filter((key) => key.includes(";"));
                    return markFields.some((field) => {
                      const compId = field.split(";")[0];
                      return practicalMarks[student.RegdNo.toString()]?.[compId] == null;
                    });
                  }
                ).length
                  }`}
                variant="filled"
                color="warning"
              />
            </Box>

            <TextField
              fullWidth
              placeholder="Search Students"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch />
                  </InputAdornment>
                ),
              }}
              size="small"
              sx={{ mb: 2 }}
            />
          </Box>

          <Box component={customscroll} sx={{ flex: 1, overflowY: "auto", px: 3 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Regd No</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Roll Number</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell align="center">Present</TableCell>
                  <TableCell>Marks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPracticalStudents.map((student) => {
                  const isPresent = practicalAttendance[student.RegdNo.toString()];
                  const markFields = Object.keys(student).filter((key) => key.includes(";"));

                  return (
                    <TableRow key={student.RegdNo}>
                      <TableCell>{student.RegdNo}</TableCell>
                      <TableCell>{student.StudentName}</TableCell>
                      <TableCell>{student.RollNumber}</TableCell>
                      <TableCell>{student.Section}</TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={isPresent}
                          onChange={() => handlePracticalAttendanceChange(student.RegdNo.toString())}
                          color={isPresent ? "success" : "error"}
                        />
                      </TableCell>
                      <TableCell>
                        {isPresent ? (
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {markFields.map((field) => {
                              const parts = field.split(";");
                              const compId = parts[0];
                              const componentName = parts[2];
                              const maxMarks = parseInt(parts[3]) || 0;
                              const currentMarks =
                                practicalMarks[student.RegdNo.toString()]?.[compId] || student[field];

                              return (
                                <TextField
                                  key={compId}
                                  id={`marks-${student.RegdNo}-${compId}`}
                                  type="number"
                                  label={`${componentName}(${maxMarks})`}
                                  value={currentMarks || ""}
                                  onChange={(e) => {
                                    const value =
                                      e.target.value === "" ? null : Math.min(Number(e.target.value), maxMarks);
                                    handlePracticalMarksChange(student.RegdNo.toString(), compId, value, maxMarks);
                                  }}
                                  inputProps={{ min: 0, max: maxMarks }}
                                  size="small"
                                  sx={{ width: 150, mb: 1 }}
                                />
                              );
                            })}
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="error.main" fontWeight="bold">
                            ABSENT
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>

          <DialogActions sx={{ p: 3, justifyContent: "center" }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => completePracticalActivity(selectedCourseCode)}
              disabled={loading || completedCourses.includes(selectedCourseCode) || !canComplete}
              startIcon={loading ? <CircularProgress size={16} /> : <CheckCircle />}
              sx={{ minWidth: 200 }}
            >
              {loading
                ? "Completing..."
                : completedCourses.includes(selectedCourseCode)
                  ? "Completed"
                  : "Complete Activity"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default FourthStep;