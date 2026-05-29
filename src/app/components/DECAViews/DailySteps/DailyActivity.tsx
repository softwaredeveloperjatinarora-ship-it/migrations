"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  Chip,
  useTheme,
  TextField,
  InputAdornment,
  Grid,
  CardContent,
} from "@mui/material";
import { useMemo } from "react";
import { CircularProgress } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useRouter } from "next/navigation";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Chair as ChairIcon, Send as SendIcon } from "@mui/icons-material";
import HorizontalStepper from "./HorizontalStepper";
import TabVertical from "./FirstStep";
import SecondStep from "./SecondStep";
import ThirdStep from "./ThirdStep";
import FourthStep from "./FourthStep";
import FifthStep from "./FifthStep";
import SixthStep from "./SixthStep";
import SeventhStep from "./SeventhStep";
import { Alert } from "@mui/material";
import BlankCard from "../../shared/BlankCard";
import { useSelector } from "react-redux";

import {
  decryptDataforResponse,
  encryptData,
} from "@/app/api/services/auth/Encrptdecrpt";
import { useSession } from "next-auth/react";

import {
  addDays,
  isToday,
  isSameDay,
  format,
  isWithinInterval,
  startOfDay,
  parseISO,
  min,
  max,
  parse,
  isValid,
  differenceInDays,
} from "date-fns";
import { getExamDates } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/sheetConsumption/getExamDates";
import { getExamSheetConsumption } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/challanProcessing/examSheetConsumption";
import { approveDailyConsumption } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/challanProcessing/approveDailyConsumption";
import { deInsertChallanDataAction } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/challanProcessing/insertChallanData";
import { addPacket } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/challanProcessing/addPacket";
import { getMaterialData } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/sheetConsumption/getMaterial";
import { consumeSheetsAction } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/sheetConsumption/consumeSheet";
import { getSheetCount } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/sheetConsumption/getSheetCount";
import { saveStepsAction } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/sheetConsumption/saveSteps";
import { getStepsAction } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/sheetConsumption/getSteps";
import { DatePicker } from "@mui/x-date-pickers";

interface ExamDate {
  Date: string;
  Session: string;
  ExamType: number;
  [key: string]: any;
}

interface SheetConsumptionCount {
  th?: number;
  libTheory?: number;
  pr?: number;
  libPractical?: number;
}

interface ExamSheetSummary {
  courseCode: string;
  examTiming: string;
  examDate: string;
  CenterNo: string;
  appeared: number;
  absent: number;
  umc: number;
  umcExtraSheet: number;
  newStudent: number;
  totalSheet: number;
  sheetConsumed: number;
  noOfPacket: number;
  noOfUMCPacket: number;
  EntryBy: string;
}

interface ExamSheetSummaryLoose {
  type: string;
  looseSheets: number;
  [key: string]: any;
}

const DailyActivity = ({
  initialSession = "",
}: {
  initialSession?: string;
}) => {
  const centerNumber = useSelector((state: any) => state.center.centerNumber);
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>("");
  const [examSheetConsumptionData, setExamSheetConsumptionData] = useState<any[]>([]);
  const [examSheetConsumption, setExamSheetConsumption] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [fourthStepDone, setFourthStepDone] = useState(false);
  const [examSheetSummaryData, setExamSheetSummaryData] = useState<any[]>([]);
  const [examSheetSummary, setExamSheetSummary] = useState<ExamSheetSummaryLoose[]>([]);
  const username = useSelector((state: any) => state.user?.username);
  const [transformedData, setTransformedData] = useState<any[]>([]);
  const [examDates, setExamDates] = useState<ExamDate[]>([]);
  const [getMaterial, setMaterial] = useState([]);
  const [sheetConsumptionCount, setSheetConsumptionCount] = useState<SheetConsumptionCount>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [examType, setExamType] = useState(6);
  const [activeStep, setActiveStep] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [error, setError] = useState("");
  const [seatingPlanGenerated, setSeatingPlanGenerated] = useState(false);
  const [staffAllocation, setStaffAllocation] = useState(false);
  const [fifthStepDone, setFifthStepDone] = useState(false);
  const [sixthStepDone, setSixthStepDone] = useState(false);
  const [seventhStepDone, setSeventhStepDone] = useState(false);
  const [selectedPacketIds, setSelectedPacketIds] = useState<number[]>([]);
  const [filteredData, setFilteredData] = useState({});
  const [loadingSaveSteps, setLoadingSaveSteps] = useState(false);
  const [loadingGetSteps, setLoadingGetSteps] = useState(false);
  const [loadingConsume, setLoadingConsume] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<boolean[] | null>([]);
  const [requiredCapacity, setRequiredCapacity] = useState(0);
  const [selectedCapacity, setSelectedCapacity] = useState(0);
  const [saveStepsRes, setSaveStepRes] = useState("");
  const [getStepsRes, setGetStepsRes] = useState<any[]>([]);
  const [addPacketRes, setAddPacketRes] = useState("");
  const [insertChallanRes, setInsertChallanRes] = useState("");
  const [approveDailyConsumptionRes, setApproveDailyConsumptionRes] = useState("");
  const [processingDailyConsumption, setProcessingDailyConsumption] = useState(false);
  const [dataSaved, setDataSaved] = useState(false);
  const [distinctCourses, setDistinctCourses] = useState<string[]>([]);
  const [isFinalStepCompleted, setIsFinalStepCompleted] = useState(false);

  useEffect(() => {
    setActiveStep(0);
    setDataSaved(false);
    setAddPacketRes("");
    setInsertChallanRes("");
    setApproveDailyConsumptionRes("");
    setGetStepsRes([]);
    setIsFinalStepCompleted(false);
    setSubmitted(false)
    setSeatingPlanGenerated(false)
    // Reset others like submitted, examSheetSummary if needed
  }, [selectedDate, selectedSession]);

  const fetchExamSheetConsumption = async () => {
    try {
      if (!session?.user?.token) {
        return;
      }

      const splitValue = session?.user?.token.split("NEXT2121ANG");

      const formfields = {
        EDate: selectedDate,
        CenterNo: String(centerNumber),
        SheetType: "theory",
      };

      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);

      const response = await getExamSheetConsumption(Data);
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
      const parsedData = JSON.parse(decryptedData);
      setExamSheetConsumption(parsedData);
    } catch (error) {
      console.log("error in getting exam sheet consumption data", error);
    }
  };

  useEffect(() => {
    fetchExamSheetConsumption();
  }, [selectedDate, selectedSession]);

  useEffect(() => {
    if (examSheetConsumption?.length && selectedSession) {
      const courses = Array.from(
        new Set(
          examSheetConsumption
            .filter((item) => item.ExamTiming === selectedSession)
            .map((item) => item.CourseCode)
        )
      );
      setDistinctCourses(courses);
    } else {
      setDistinctCourses([]);
    }
  }, [examSheetConsumption, selectedSession]);

  const [selectedCounts, setSelectedCounts] = useState({
    theory: 0,
    libraryTheory: 0,
    practical: 0,
    libraryPractical: 0,
  });
  const examDate = selectedDate;
  const centerNo = centerNumber;
  const entryBy = username;

  const saveNonZeroValues = (data: any) => {
    const nonZeroEntries = Object.entries(data).filter(
      ([, value]) => (value as number) > 0
    );
    const result = Object.fromEntries(nonZeroEntries) as Record<string, number>;
    setFilteredData(result);
    return result;
  };

  useEffect(() => {
    const mapped = examSheetSummaryData?.map((item) => ({
      courseCode: item.CourseCode,
      examTiming: item.ExamTiming,
      examDate: examDate,
      CenterNo: centerNo,
      appeared: item.Appeared,
      absent: item.Absent,
      umc: item.UMC,
      umcExtraSheet: item.UMCExtraSheet,
      newStudent: item.NewStudent,
      totalSheet: item.TotalSheet,
      sheetConsumed: item.SheetConsumed,
      noOfPacket: item.NoOfPacket,
      noOfUMCPacket: item.NoOfUMCPacket,
      EntryBy: entryBy,
    }));

    setTransformedData(mapped);
  }, [examSheetSummaryData, examDate, centerNo, entryBy]);

  useEffect(() => {
    if (sheetConsumptionCount) {
      saveNonZeroValues(sheetConsumptionCount);
    }
  }, [sheetConsumptionCount]);

  const { data: session } = useSession();
  const router = useRouter();
  const theme = useTheme();

  const isDataFetched = useRef({
    examDates: false,
    material: false,
    sheetCount: false,
    steps: false,
  });

  const lastApiCall = useRef({
    selectedDate: "",
    selectedSession: "",
    centerNumber: "",
  });

  const normalizedDateSet = useMemo(() => {
    if (!examDates?.length) return new Set<string>();

    const dateSet = new Set<string>();
    examDates.forEach((item) => {
      try {
        let date: Date;
        if (item.Date.includes("T")) {
          date = new Date(item.Date);
        } else {
          date = new Date(item.Date + "T00:00:00");
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const normalizedDate = `${year}-${month}-${day}`;
        if (normalizedDate) {
          dateSet.add(normalizedDate);
        }
      } catch (error) {
        console.warn("Invalid date format:", item.Date);
      }
    });
    return dateSet;
  }, [examDates]);

  const minMaxDates = useMemo(() => {
    if (!examDates.length) return { minDate: undefined, maxDate: undefined };

    const dates = examDates
      .map((e) => new Date(e.Date))
      .filter((date) => !isNaN(date.getTime()));

    return {
      minDate: dates.length ? min(dates) : undefined,
      maxDate: dates.length ? max(dates) : undefined,
    };
  }, [examDates]);

  const parseSessionToMinutes = (session: string): number => {
    try {
      const startTime = session.split("-")[0]; // Get "09:30" or "02:30"
      const [hours, minutes] = startTime.split(":").map(Number);
      return hours * 60 + minutes; // E.g., "02:30" → 2*60 + 30 = 150, "09:30" → 9*60 + 30 = 570
    } catch (error) {
      console.warn(`Invalid session format: ${session}`, error);
      return Infinity;
    }
  };

  const filteredSessions = useMemo(() => {
    if (!selectedDate || !examDates.length) return [];
    const sessions = examDates
      .filter((item) => {
        try {
          let date: Date;
          if (item.Date.includes("T")) {
            date = new Date(item.Date);
          } else {
            date = new Date(item.Date + "T00:00:00");
          }
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const itemDate = `${year}-${month}-${day}`;
          return itemDate === selectedDate;
        } catch (error) {
          return false;
        }
      })
      .map((item) => item.Session);
    // Deduplicate and sort sessions by start time
    return [...new Set(sessions)].sort((a, b) => {
      const timeA = parseSessionToMinutes(a);
      const timeB = parseSessionToMinutes(b);
      return timeA - timeB; // Sort in ascending order
    });
  }, [examDates, selectedDate]);

  const currentExamData = useMemo(() => {
    if (!selectedDate || !selectedSession || !examDates.length) return null;

    return examDates.find((item) => {
      try {
        let date: Date;
        if (item.Date.includes("T")) {
          date = new Date(item.Date);
        } else {
          date = new Date(item.Date + "T00:00:00");
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const itemDate = `${year}-${month}-${day}`;
        return itemDate === selectedDate && item.Session === selectedSession;
      } catch (error) {
        return false;
      }
    });
  }, [examDates, selectedDate, selectedSession]);

  const steps = useMemo(() => {
    if (examType === 6) {
      return [
        "Sheet Consumption",
        "Attendance Marking",
        "UMC Marking",
        "Discrepancy Marking",
        "Challan Processing",
      ];
    } else {
      return [
        "Sheet Consumption",
        "Seating Plan Generation",
        "Staff Allocation",
        "Attendance Marking",
        "UMC Marking",
        "Discrepancy Marking",
        "Challan Processing",
      ];
    }
  }, [examType]);

  const strength = useMemo(
    () => ({
      Theory: sheetConsumptionCount.th || 0,
      LibraryTheory: sheetConsumptionCount.libTheory || 0,
      Practical: sheetConsumptionCount.pr || 0,
      LibraryPractical: sheetConsumptionCount.libPractical || 0,
    }),
    [sheetConsumptionCount]
  );

  const requiredCounts = useMemo(
    () => ({
      theory: strength.Theory || 0,
      libraryTheory: strength.LibraryTheory || 0,
      practical: strength.Practical || 0,
      libraryPractical: strength.LibraryPractical || 0,
    }),
    [strength]
  );

  const findNearestAllowedDate = useCallback(
    (dateSet: Set<string>): string | null => {
      const today = new Date();
      const todayStr = format(today, "yyyy-MM-dd");

      if (dateSet.has(todayStr)) {
        return todayStr;
      }

      const allowedDates: Date[] = Array.from(dateSet).map((d) => parseISO(d));
      if (allowedDates.length === 0) return null;

      allowedDates.sort(
        (a, b) =>
          Math.abs(differenceInDays(a, today)) -
          Math.abs(differenceInDays(b, today))
      );

      return format(allowedDates[0], "yyyy-MM-dd");
    },
    []
  );

  // API functions
  const fetchExamDates = useCallback(async () => {
    if (
      !session?.user?.token ||
      !centerNumber ||
      isDataFetched.current.examDates
    )
      return;

    try {
      setLoading(true);
      const splitValue = session?.user?.token.split("NEXT2121ANG");
      const formfields = { CenterNo: centerNumber };
      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const response = await getExamDates(Data);


      const decryptedData = decryptDataforResponse(
        response?.data,
        splitValue[1]
      );
      const parsedData = JSON.parse(decryptedData);
      setExamDates(parsedData || []);
    } catch (error) {
      console.error("Error fetching exam dates:", error);
      setExamDates([]);
    } finally {
      setLoading(false);
      isDataFetched.current.examDates = true;
    }
  }, [session?.user?.token, centerNumber]);

  // Approve daily consumption

  const approveDailyConsumptionData = async () => {
    try {
      if (!session?.user?.token) {
        return;
      }

      const splitValue = session.user?.token.split("NEXT2121ANG");

      const formfields = {
        ConsumedDatetime: selectedDate,
        ConsumeSession: selectedSession,
        CenterNo: centerNumber,
      };

      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);

      const response = await approveDailyConsumption(Data);
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
      let parsedData;
      parsedData = JSON.parse(decryptedData);
      setApproveDailyConsumptionRes(parsedData);

      // setLoading(false);
    } catch (error) {
      // setLoading(false);
      console.log("error in approve daily consumption", error);
    }
  };

  const insertChallanData = async () => {
    try {
      if (!session?.user?.token) {
        return;
      }

      const splitValue = session.user?.token.split("NEXT2121ANG");

      const formfields = examSheetConsumptionData.map((item: any) => ({
        CourseCode: item.CourseCode, // already PascalCase
        ExamTiming: item.ExamTiming,
        ExamDate: selectedDate, // added
        EntryBy: String(centerNumber), // added
        CenterNo: String(centerNumber), // added
        Appeared: item.Appeared,
        Absent: item.Absent,
        UMC: item.UMC,
        UMCExtraSheet: item.UMCExtraSheet,
        NewStudent: item.NewStudent,
        TotalSheet: item.TotalSheet,
        SheetConsumed: item.SheetConsumed,
        NoOfPacket: item.NoOfPacket,
        NoOfUMCPacket: item.NoOfUMCPacket,
      }));

      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);

      const response = await deInsertChallanDataAction(Data);
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
      const parsedData = JSON.parse(decryptedData);
      setInsertChallanRes(parsedData);
      setApproveDailyConsumptionRes(parsedData);
    } catch (error) {
      console.log("error in approve daily consumption", error);
    }
  };

  const addPacketChallan = async () => {
    try {
      if (!session?.user?.token) {
        return;
      }
      const splitValue = session.user?.token.split("NEXT2121ANG");
      const pktfromData = 1;
      // Loop through each summary object
      for (const summary of examSheetSummary) {
        const formfields = {
          CenterNo: String(centerNumber),
          EmpId: username,
          PktType: `${summary.type} Sheets`, // dynamic per object
          PktFrom: pktfromData,
          PktTo: summary.looseSheets,
          PktNo: "LS0001",
        };

        const credentialsJson = JSON.stringify(formfields);
        const { Data } = encryptData(credentialsJson, splitValue[1]);
        const response = await addPacket(Data);
        const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
        const parsedData = JSON.parse(decryptedData);
        setAddPacketRes(parsedData);
      }
    } catch (error) {
      console.log("error in add packet", error);
    }
  };

  const handleDailyConsumption = async () => {
    try {
      setProcessingDailyConsumption(true);

      // Run all API calls
      await Promise.all([
        approveDailyConsumptionData(),
        insertChallanData(),
        addPacketChallan(),
      ]);

      if (examType === 5) {
        saveSteps(7, "Challan Processing");
      } else if (examType === 6) {
        saveSteps(5, "Challan Processing");
      }
    } catch (error) {
      console.error("Error in handleDailyConsumption:", error);
      setError("Failed to process daily consumption. Please try again.");
    } finally {
      setProcessingDailyConsumption(false);
    }
  };

  const saveSteps = useCallback(
    async (StepNo: number, StepDescription: string) => {
      if (!session?.user?.token) {
        setError("User session expired. Please log in again.");
        return;
      }
      if (!selectedDate || !selectedSession || !centerNumber) {
        setError(
          "Required fields (date, session, or center number) are missing."
        );
        return;
      }
      let lockedSteps: number[] = [];

      if (examType === 5) {
        lockedSteps = [1, 2, 6];
      } else if (examType === 6) {
        lockedSteps = [1, 4];
      }

      try {
        setLoadingSaveSteps(true);
        const splitValue = session.user?.token.split("NEXT2121ANG");
        const formfields = {
          ExamDate: selectedDate,
          ExamTiming: selectedSession,
          CenterNo: centerNumber,
          StepNo: StepNo,
          StepDescription: StepDescription,
          IsLocked: lockedSteps.includes(activeStep) ? 1 : 0,
          EntryBy: username, // Consider making this dynamic if possible
          IsActive: 1,
        };

        const credentialsJson = JSON.stringify(formfields);
        const { Data } = encryptData(credentialsJson, splitValue[1]);
        const response = await saveStepsAction(Data);
        const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
        console.group("savestepsres", decryptedData)
        const parsedData = JSON.parse(decryptedData);
        setSaveStepRes(parsedData);
        // Check if the response indicates success
        if (!parsedData) {
          console.log(
            "Failed to save step: " + (parsedData.message || "Unknown error")
          );
        }
      } catch (error) {
        console.error("Error saving steps:", error);
        setError("An error occurred while saving the step. Please try again.");
      } finally {
        setLoadingSaveSteps(false);
      }
    },
    [
      session?.user?.token,
      selectedDate,
      selectedSession,
      centerNumber,
      activeStep,
    ]
  );

  const fetchMaterial = useCallback(async () => {
    if (
      !session?.user?.token ||
      !centerNumber ||
      isDataFetched.current.material
    )
      return;

    try {
      const splitValue = session.user?.token.split("NEXT2121ANG");
      const formfields = { CenterNo: centerNumber };
      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const response = await getMaterialData(Data);
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
      const parsedData = JSON.parse(decryptedData);
      setMaterial(parsedData || []);
    } catch (error) {
      console.error("Error fetching material:", error);
      setMaterial([]);
    } finally {
      isDataFetched.current.material = true;
    }
  }, [session?.user?.token, centerNumber]);


  // helper function for step capping
  const getCappedStep = (lastStepNum: number, examType: number) => {
    let maxAllowedStep = 7; // default max

    if (examType === 5) {
      maxAllowedStep = 6;
    } else if (examType === 6) {
      maxAllowedStep = 5;
    }

    return Math.min(lastStepNum, maxAllowedStep);
  };

  const fetchSheetCountAndSteps = useCallback(
    async (date: string, sessionTime: string, center: string) => {
      if (!session?.user?.token) return;

      const currentCall = {
        selectedDate: date,
        selectedSession: sessionTime,
        centerNumber: center,
      };
      const lastCall = lastApiCall.current;

      if (
        currentCall.selectedDate === lastCall.selectedDate &&
        currentCall.selectedSession === lastCall.selectedSession &&
        currentCall.centerNumber === lastCall.centerNumber
      ) {
        return;
      }

      try {
        lastApiCall.current = currentCall;
        const splitValue = session?.user?.token?.split("NEXT2121ANG");

        // ✅ Only Fetch sheet count here
        const sheetFormfields = {
          Edate: date,
          Etime: sessionTime,
          CenterNo: center,
        };
        const sheetCredentialsJson = JSON.stringify(sheetFormfields);
        const { Data: sheetData } = encryptData(sheetCredentialsJson, splitValue[1]);
        const sheetResponse = await getSheetCount(sheetData);
        if(!sheetResponse?.status) return 
        const sheetDecryptedData = decryptDataforResponse(sheetResponse?.data, splitValue[1]);
        const sheetParsedData = JSON.parse(sheetDecryptedData);
        if (sheetParsedData && sheetParsedData.length > 0) {
          const data = sheetParsedData[0];
          setSheetConsumptionCount({
            th: data.Th || 0,
            libTheory: data.libTheory || 0,
            pr: data.Pr || 0,
            libPractical: data.libPractical || 0,
          });
        } else {
          setSheetConsumptionCount({
            th: 0,
            libTheory: 0,
            pr: 0,
            libPractical: 0,
          });
        }

        // 🚫 removed steps fetching from here

      } catch (error) {
        console.error("Error fetching sheet count:", error);
        setSheetConsumptionCount({
          th: 0,
          libTheory: 0,
          pr: 0,
          libPractical: 0,
        });
      }
    },
    [session?.user?.token]
  );


  const getSteps = useCallback(async () => {
    if (!session?.user?.token || !selectedDate || !selectedSession || !centerNumber)
      return;

    try {
      setLoadingGetSteps(true);
      const splitValue = session.user?.token.split("NEXT2121ANG");

      const formfields = {
        Edate: selectedDate,
        Etime: selectedSession,
        CenterNo: centerNumber,
      };

      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const response = await getStepsAction(Data);
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
      const parsedData = JSON.parse(decryptedData);

      setGetStepsRes(parsedData);

      if (parsedData && Array.isArray(parsedData) && parsedData.length > 0) {
        const lastStepStr = parsedData[0].LastStep;
        const lastStepNum = Number(lastStepStr);

        if (!isNaN(lastStepNum)) {
          setActiveStep(getCappedStep(lastStepNum, examType));
        } else {
          setActiveStep(0);
        }
      } else {
        setActiveStep(0);
      }
    } catch (error) {
      console.error("Error getting steps:", error);
      setActiveStep(0);
      setGetStepsRes([]);
    } finally {
      setLoadingGetSteps(false);
    }
  }, [session?.user?.token, selectedDate, selectedSession, centerNumber, examType]);

  const handleBack = useCallback(() => {
    if (
      typeof getStepsRes === "object" &&
      getStepsRes !== null &&
      "IsLocked" in getStepsRes &&
      (getStepsRes as { IsLocked?: string }).IsLocked === "1" // block if locked
    ) {
      return; // stop back navigation
    }
console.log("Handling back, current step 1:", activeStep);

    setActiveStep((prev) => Math.max(0, prev - 1));
    console.log("Handling back, current step:", activeStep);
    setError(""); // clear errors
  }, [getStepsRes]);

  const handleReset = useCallback(() => {
    setActiveStep(0);
    setSeatingPlanGenerated(false);
  }, []);

  const handleSelectionChange = useCallback((counts: typeof selectedCounts) => {
    setSelectedCounts(counts);
  }, []);

  const handleRequiredCountsChange = useCallback(
    (counts: typeof requiredCounts) => {
      // This callback is now empty to prevent infinite loops
    },
    []
  );

  const handlePacketSelectionIds = useCallback((ids: number[]) => {
    setSelectedPacketIds(ids);
  }, []);

  const handleStaffAllocation = useCallback((data: boolean) => {
    setStaffAllocation(data);
  }, []);

  const handleSeatingPlanGenerated = useCallback(
    (generatedStatus: boolean, roomsData?: boolean[], capacity?: number) => {
      setSeatingPlanGenerated(generatedStatus);
      setSelectedRooms(roomsData ?? []);
      setSelectedCapacity(capacity ?? 0);
    },
    []
  );

  // const getSteps = useCallback(async () => {
  //   if (
  //     !session?.user?.token ||
  //     !selectedDate ||
  //     !selectedSession ||
  //     !centerNumber
  //   )
  //     return;

  //   try {
  //     setLoadingGetSteps(true);
  //     const splitValue = session.user.token.split("NEXT2121ANG");
  //     const formfields = {
  //       Edate: selectedDate,
  //       Etime: selectedSession,
  //       CenterNo: centerNumber,
  //     };

  //     const credentialsJson = JSON.stringify(formfields);
  //     const { Data } = encryptData(credentialsJson, splitValue[1]);
  //     const response = await getStepsAction(Data);
  //     const decryptedData = decryptDataforResponse(response, splitValue[1]);
  //     const parsedData = JSON.parse(decryptedData);
  //     setGetStepsRes(parsedData);

  //     if (parsedData && Array.isArray(parsedData) && parsedData.length > 0) {
  //       const lastStepStr = parsedData[0].LastStep;
  //       const lastStepNum = Number(lastStepStr);
  //       const nextStep = Math.min(lastStepNum);
  //       setActiveStep(nextStep);
  //     } else {
  //       setActiveStep(0);
  //     }
  //   } catch (error) {
  //     console.error("Error getting steps:", error);
  //     setActiveStep(0);
  //   } finally {
  //     setLoadingGetSteps(false);
  //   }
  // }, [
  //   session?.user?.token,
  //   selectedDate,
  //   selectedSession,
  //   centerNumber,
  //   steps.length,
  // ]);

  const handleConsumeSheets = useCallback(async () => {
    if (!session?.user?.token) {
      setError("User session expired. Please log in again.");
      return;
    }

    if (selectedPacketIds.length === 0) {
      setError("Please select at least one packet to consume.");
      return;
    }

    try {
      setLoadingConsume(true);
      const splitValue = session.user?.token.split("NEXT2121ANG");

      // await saveSteps();

      const formfields = {
        Id: selectedPacketIds.join(","),
        Date: selectedDate,
        ETime: selectedSession,
      };
      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const response = await consumeSheetsAction(Data);



      // decrypt from response.data instead of response
      const decryptedData = decryptDataforResponse(
        response?.data,
        splitValue[1]
      );
      const parsedData = JSON.parse(decryptedData);

      if (!parsedData) {
        setError("Failed to consume sheets.");
        return;
      }
    } catch (error) {
      console.error("Error consuming sheets:", error);
      setError("An unexpected error occurred.");
    } finally {
      setLoadingConsume(false);
    }
  }, [
    session?.user?.token,
    selectedPacketIds,
    selectedDate,
    selectedSession,
    saveSteps,
  ]);

  const areRequiredPacketsSelected = useCallback(() => {
    return (
      (requiredCounts.theory === 0 ||
        selectedCounts.theory >= requiredCounts.theory) &&
      (requiredCounts.libraryTheory === 0 ||
        selectedCounts.libraryTheory >= requiredCounts.libraryTheory) &&
      (requiredCounts.practical === 0 ||
        selectedCounts.practical >= requiredCounts.practical) &&
      (requiredCounts.libraryPractical === 0 ||
        selectedCounts.libraryPractical >= requiredCounts.libraryPractical)
    );
  }, [requiredCounts, selectedCounts]);

  useEffect(() => {
    const initData = async () => {
      if (centerNumber && session?.user?.token) {
        await Promise.all([fetchExamDates(), fetchMaterial()]);
      }
    };
    initData();
  }, [centerNumber, session?.user?.token, fetchExamDates, fetchMaterial]);

  // 2. Set initial date when exam dates are loaded
  useEffect(() => {
    const setInitialDate = async () => {
      if (examDates.length > 0 && !selectedDate && normalizedDateSet.size > 0) {
        const nearestDate = findNearestAllowedDate(normalizedDateSet);
        if (nearestDate) {
          setSelectedDate(nearestDate);
        }
      }
    };
    setInitialDate();
  }, [
    examDates.length,
    selectedDate,
    normalizedDateSet,
    findNearestAllowedDate,
  ]);

  // 3. Set initial session when filtered sessions change
  useEffect(() => {
    if (filteredSessions.length > 0) {
      const sortedSessions = [...filteredSessions].sort((a, b) => {
        const getMinutes = (s: string) => {
          let [h, m] = s.split("-")[0].split(":").map(Number);
          if (h < 8) h += 12; // treat <8 as PM
          return h * 60 + m;
        };
        return getMinutes(a) - getMinutes(b);
      });

      // Always pick earliest one after sorting
      setSelectedSession(sortedSessions[0]);
    }
  }, [filteredSessions]);

  // 4. Update exam type when current exam data changes (FIX FOR EXAM TYPE ISSUE)
  useEffect(() => {
    const updateExamType = async () => {
      if (currentExamData && currentExamData.ExamType !== undefined) {
        setExamType(currentExamData.ExamType);
      }
    };
    updateExamType();
  }, [currentExamData, examType]);

  // 5. Update required capacity based on strength
  useEffect(() => {
    const updateCapacity = async () => {
      const totalRequiredCapacity = Object.values(strength).reduce(
        (sum, val) => sum + (val || 0),
        0
      );
      setRequiredCapacity(totalRequiredCapacity);
    };
    updateCapacity();
  }, [strength]);

  // 6. Load sheet count and steps when date/session/center changes
  useEffect(() => {
    const loadData = async () => {
      if (selectedDate && selectedSession) {
        await fetchSheetCountAndSteps(
          selectedDate,
          selectedSession,
          centerNumber
        );
      }
    };
    loadData();
  }, [selectedDate,selectedSession]);

 useEffect(() => {
    if (!centerNumber) return;
     getSteps();
  }, [selectedDate, selectedSession, examType, centerNumber]);
//Removed activestep
  // Render functions
 const shouldDisableDate = useCallback(
  // accept Dayjs OR native Date
  (day: Date | import('dayjs').Dayjs) => {
    const dateStr = format(day instanceof Date ? day : day.toDate(), "yyyy-MM-dd");
    return !normalizedDateSet.has(dateStr);
  },
  [normalizedDateSet]
);

  const handleNext = useCallback(async () => {
    if (!selectedDate || !selectedSession) {
      setError("Please select a date and session.");
      return;
    }

    // Fetch the latest steps to ensure we have the correct state
    await getSteps();

    const maxSteps = examType === 6 ? 5 : 7;
    const currentLastStep =
      Array.isArray(getStepsRes) &&
        getStepsRes.length > 0 &&
        getStepsRes[0]?.LastStep
        ? Number(getStepsRes[0].LastStep)
        : 0;

    // Prevent advancing beyond the last completed step or max steps
    if (activeStep >= currentLastStep && activeStep < maxSteps - 1) {
      if (examType === 6) {
        if (activeStep === 0) {
          const insufficientTypes: string[] = [];
          if (
            requiredCounts.theory > 0 &&
            selectedCounts.theory < requiredCounts.theory
          ) {
            insufficientTypes.push("Theory");
          }
          if (
            requiredCounts.libraryTheory > 0 &&
            selectedCounts.libraryTheory < requiredCounts.libraryTheory
          ) {
            insufficientTypes.push("Library Theory");
          }
          if (
            requiredCounts.practical > 0 &&
            selectedCounts.practical < requiredCounts.practical
          ) {
            insufficientTypes.push("Practical");
          }
          if (
            requiredCounts.libraryPractical > 0 &&
            selectedCounts.libraryPractical < requiredCounts.libraryPractical
          ) {
            insufficientTypes.push("Library Practical");
          }

          if (insufficientTypes.length > 0) {
            setError(
              `Please select the minimum required packets for: ${insufficientTypes.join(
                ", "
              )}`
            );
            return;
          }

          await handleConsumeSheets();
          await saveSteps(1, "Sheet Consumption");
          setActiveStep(1);
        } else if (activeStep === 1) {
          await saveSteps(2, "Attendance Marking");
          setActiveStep(2);
        } else if (activeStep === 2) {
          await saveSteps(3, "UMC Marking");
          setActiveStep(3);
        } else if (activeStep === 3) {
          await saveSteps(4, "Discrepancy Marking");
          setActiveStep(4);
        } else if (activeStep === 4) {
          await saveSteps(5, "Challan Processing");
          setActiveStep(5);
        }
      } else if (examType === 5) {
        if (activeStep === 0) {
          const insufficientTypes: string[] = [];
          if (
            requiredCounts.theory > 0 &&
            selectedCounts.theory < requiredCounts.theory
          ) {
            insufficientTypes.push("Theory");
          }
          if (
            requiredCounts.libraryTheory > 0 &&
            selectedCounts.libraryTheory < requiredCounts.libraryTheory
          ) {
            insufficientTypes.push("Library Theory");
          }
          if (
            requiredCounts.practical > 0 &&
            selectedCounts.practical < requiredCounts.practical
          ) {
            insufficientTypes.push("Practical");
          }
          if (
            requiredCounts.libraryPractical > 0 &&
            selectedCounts.libraryPractical < requiredCounts.libraryPractical
          ) {
            insufficientTypes.push("Library Practical");
          }

          if (insufficientTypes.length > 0) {
            setError(
              `Please select the minimum required packets for: ${insufficientTypes.join(
                ", "
              )}`
            );
            return;
          }

          await handleConsumeSheets();
          await saveSteps(1, "Sheet Consumption");
          setActiveStep(1);
        } else if (activeStep === 1) {
          if (!seatingPlanGenerated) {
            setError("Please generate the seating plan before proceeding.");
            return;
          }
          await saveSteps(2, "Seating Plan Generation");
          setActiveStep(2);
        } else if (activeStep === 2) {
          if (!staffAllocation) {
            setError("Please complete staff allocation before proceeding.");
            return;
          }
          await saveSteps(3, "Staff Allocation");
          setActiveStep(3);
        } else if (activeStep === 3) {
          if (!fourthStepDone) {
            setError("Please complete attendance marking before proceeding.");
            return;
          }
          await saveSteps(4, "Attendance Marking");
          setActiveStep(4);
        } else if (activeStep === 4) {
          await saveSteps(5, "UMC Marking");
          setActiveStep(5);
        } else if (activeStep === 5) {
          await saveSteps(6, "Discrepancy Marking");
          setActiveStep(6);
        } else if (activeStep === 6) {
          await saveSteps(7, "Challan Processing");
          setActiveStep(7);
        }
      }
    } else if (activeStep < currentLastStep) {
      // If the current step is less than the last completed step, move to the next uncompleted step
      setActiveStep(Math.min(currentLastStep, maxSteps - 1));
    }

    setError("");
  }, [
    activeStep,
    examType,
    requiredCounts,
    selectedCounts,
    fourthStepDone,
    seatingPlanGenerated,
    staffAllocation,
    saveSteps,
    handleConsumeSheets,
    getSteps,
    getStepsRes,
    selectedDate,
    selectedSession,
  ]);

  useEffect(() => {
    setIsFinalStepCompleted(false);
    if (
      Array.isArray(getStepsRes) &&
      getStepsRes.length > 0 &&
      typeof getStepsRes[0] === "object" &&
      examType === 5 &&
      getStepsRes[0]?.LastStep === "7"
    ) {
      setIsFinalStepCompleted(true);
    } else if (
      Array.isArray(getStepsRes) &&
      getStepsRes.length > 0 &&
      typeof getStepsRes[0] === "object" &&
      examType === 6 &&
      getStepsRes[0]?.LastStep === "5"
    ) {
      setIsFinalStepCompleted(true);
    }
  }, [getStepsRes, examType, selectedDate, selectedSession]);

  // Update dataSaved based on API responses
  useEffect(() => {
    if (addPacketRes && insertChallanRes && approveDailyConsumptionRes) {
      setDataSaved(true);
    } else {
      setDataSaved(false);
    }
  }, [addPacketRes, insertChallanRes, approveDailyConsumptionRes]);

 const renderDay = useCallback(
  // accept the exact props the picker gives us
  (props: import('@mui/x-date-pickers').PickersDayProps) => {
    const { day, outsideCurrentMonth } = props;
    const dateObj = day instanceof Date ? day : day.toDate();
    const dayStr = format(dateObj, "yyyy-MM-dd");
    const isAllowedDate = normalizedDateSet.has(dayStr);
    const isSelectedDate = selectedDate ? dayStr === selectedDate : false;
    const isTodayDate = isToday(dateObj);

    if (outsideCurrentMonth) {
      return <Box sx={{ width: 40, height: 40 }} />;
    }

    const buttonStyles = {
      minWidth: 40,
      width: 40,
      height: 40,
      m: 0.25,
      ...(isSelectedDate
        ? {
            backgroundColor: theme.palette.success.main + " !important",
            color: theme.palette.common.white + " !important",
          }
        : isTodayDate
          ? {
              backgroundColor: theme.palette.primary.main + " !important",
              color: theme.palette.common.white + " !important",
            }
          : isAllowedDate
            ? {
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                color: theme.palette.primary.main,
              }
            : {
                color: theme.palette.text.disabled,
              }),
      "&:disabled": {
        backgroundColor: "transparent !important",
        color: theme.palette.text.disabled + " !important",
      },
    };

    return (
      <Button
        sx={buttonStyles}
        disabled={!isAllowedDate}
        onClick={() => {
          if (isAllowedDate) {
            setSelectedDate(dayStr);
            setIsCalendarOpen(false);
          }
        }}
      >
        {dateObj.getDate()}
      </Button>
    );
  },
  [normalizedDateSet, selectedDate, theme.palette]
);

  const renderDateSessionComponent = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={2} mb={0}>
        <Typography variant="h5" mb={2}>
          Select Date and Session
        </Typography>
        <DatePicker
          label="Select Exam Date"
          open={isCalendarOpen}
          onOpen={() => setIsCalendarOpen(true)}
          onClose={() => setIsCalendarOpen(false)}
          value={selectedDate ? new Date(selectedDate + "T00:00:00") : null}
          onChange={(newValue) => {
            if (newValue) {
              // convert Dayjs (if provided by picker) to native Date before using date-fns
              const dateObj: Date =
                (newValue as any)?.toDate ? (newValue as any).toDate() : (newValue as Date);
              const formattedDate = format(dateObj, "yyyy-MM-dd");
              if (normalizedDateSet.has(formattedDate)) {
                setSelectedDate(formattedDate);
              }
            }
            setIsCalendarOpen(false);
          }}
          minDate={minMaxDates.minDate}
          maxDate={minMaxDates.maxDate}
          shouldDisableDate={shouldDisableDate}
          slots={{
            day: renderDay,
          }}
          slotProps={{
            textField: {
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarMonthIcon
                      onClick={() => setIsCalendarOpen(true)}
                      sx={{ cursor: "pointer" }}
                    />
                  </InputAdornment>
                ),
              },
              fullWidth: true,
              variant: "outlined",
            },
          }}
        />

        {filteredSessions.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No sessions available for selected date
          </Typography>
        ) : (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              overflowX: "auto",
              paddingBottom: 1,
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {[...filteredSessions]
              .sort((a, b) => {
                const getMinutes = (s: string) => {
                  let [h, m] = s.split("-")[0].split(":").map(Number);
                  // Rule: assume times < 8 are PM sessions, others are AM
                  if (h < 8) h += 12; // "02:30" → 14:30 (2:30 PM)
                  return h * 60 + m;
                };
                return getMinutes(a) - getMinutes(b);
              })
              .map((session) => (
                <Chip
                  key={session}
                  label={session}
                  onClick={() => setSelectedSession(session)}
                  color={selectedSession === session ? "success" : "default"}
                  sx={{
                    minWidth: 120,
                    justifyContent: "center",
                    ...(selectedSession === session
                      ? {
                        backgroundColor: theme.palette.success.main,
                        color: theme.palette.common.white,
                        "&:hover": {
                          backgroundColor: theme.palette.success.dark,
                        },
                      }
                      : {}),
                  }}
                />
              ))}
          </Stack>
        )}
      </Stack>
    </LocalizationProvider>
  );

  const renderStepperComponent = () => (
    <HorizontalStepper
      steps={steps}
      handleReset={handleReset}
      activeStep={activeStep}
    >
      {activeStep === 0 ? (
        // Step 0: Sheet Consumption

        <Box my={3}>
          <TabVertical
            saveSteps={saveSteps}
            onSelectionChange={handleSelectionChange}
            onRequiredCountsChange={handleRequiredCountsChange}
            onConsumeSheets={handleNext}
            selectedDate={selectedDate}
            selectedTime={selectedSession}
            onPacketSelectionIds={handlePacketSelectionIds}
            examType={examType}
            strengthData={{
              th: sheetConsumptionCount.th,
              libTheory: sheetConsumptionCount.libTheory,
              pr: sheetConsumptionCount.pr,
              libPractical: sheetConsumptionCount.libPractical,
            }}
            material={getMaterial}
          />

          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!areRequiredPacketsSelected() || loadingConsume}
            >
              {loadingConsume ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Consume Sheets"
              )}
            </Button>
          </Stack>
        </Box>
      ) : activeStep === 1 && examType === 5 ? (
        // Step 1: Seating Plan Generation (examType 5)
        <Box my={3}>
          {selectedDate && (
            <SecondStep
              selectedDate={selectedDate}
              selectedTime={selectedSession}
              examType={examType}
              strength={{
                Theory: sheetConsumptionCount.th ?? 0,
                LibraryTheory: sheetConsumptionCount.libTheory ?? 0,
                Practical: sheetConsumptionCount.pr ?? 0,
                LibraryPractical: sheetConsumptionCount.libPractical ?? 0,
              }}
              onSeatingPlanGenerated={handleSeatingPlanGenerated}
            />
          )}
          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Button color="secondary" variant="contained" onClick={handleBack}>
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={!seatingPlanGenerated}
            >
              Next
            </Button>
          </Stack>
        </Box>
      ) : activeStep === 1 && examType === 6 ? (
        // Step 1: Attendance Marking (examType 6)
        <Box my={3}>
          <FourthStep
            selectedDate={selectedDate ? new Date(selectedDate) : null}
            selectedTime={selectedSession}
            examType={examType}
            setFourthStepDone={setFourthStepDone}
          />
          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Button
              color="secondary"
              variant="contained"
              onClick={handleBack}
              disabled={
                Array.isArray(getStepsRes) &&
                getStepsRes.length > 0 &&
                typeof getStepsRes[0] === "object" &&
                getStepsRes[0]?.IsLocked === "1"
              }
            >
              Back
            </Button>
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          </Stack>
        </Box>
      ) : activeStep === 2 && examType === 5 ? (
        // Step 2: Staff Allocation (examType 5)
        <Box my={3}>
          <ThirdStep
            selectedDate={selectedDate ? new Date(selectedDate) : null}
            selectedTime={selectedSession}
            examType={examType}
            handleStaffAllocation={handleStaffAllocation}
            staffAllocation={staffAllocation}
          />
          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Button
              color="secondary"
              variant="contained"
              onClick={handleBack}
              disabled={
                Array.isArray(getStepsRes) &&
                getStepsRes.length > 0 &&
                typeof getStepsRes[0] === "object" &&
                getStepsRes[0]?.IsLocked === "1"
              }
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!staffAllocation}
            >
              Next
            </Button>
          </Stack>
        </Box>
      ) : activeStep === 2 && examType === 6 ? (
        // Step 2: UMC Marking (examType 6)
        <Box my={3}>
          <FifthStep
            selectedDate={selectedDate}
            selectedTime={selectedSession}
            examTypeInitial={examType}
            setFifthStepDone={setFifthStepDone}
          />
          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Button color="secondary" variant="contained" onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          </Stack>
        </Box>
      ) : activeStep === 3 && examType === 5 ? (
        // Step 3: Attendance Marking (examType 5)
        <Box my={3}>
          <FourthStep
            selectedDate={selectedDate ? new Date(selectedDate) : null}
            selectedTime={selectedSession}
            examType={examType}
            setFourthStepDone={setFourthStepDone}
          />
          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Button
              color="secondary"
              variant="contained"
              onClick={handleBack}
              disabled={
                Array.isArray(getStepsRes) &&
                getStepsRes.length > 0 &&
                typeof getStepsRes[0] === "object" &&
                getStepsRes[0]?.IsLocked === "1"
              }
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!fourthStepDone}
            >
              Next
            </Button>
          </Stack>
        </Box>
      ) : activeStep === 3 && examType === 6 ? (
        // Step 3: Discrepancy Marking (examType 6)
        <Box my={3}>
          <SixthStep
            selectedDate={selectedDate}
            selectedTime={selectedSession}
            selectedExamType={examType}
            distinctCourses={distinctCourses}
          />
          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Button color="secondary" variant="contained" onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          </Stack>
        </Box>
      ) : activeStep === 4 && examType === 5 ? (
        // Step 4: UMC Marking (examType 5)
        <Box my={3}>
          <FifthStep
            selectedDate={selectedDate}
            selectedTime={selectedSession}
            setFifthStepDone={setFifthStepDone}
            examTypeInitial={examType}
          />
          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Button color="secondary" variant="contained" onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          </Stack>
        </Box>
      ) : activeStep >= 4 && examType === 6 ? (
        // Step 4: Challan Processing (examType 6)
        <Box my={3}>
          <SeventhStep
            dataSaved={dataSaved}
            selectedDate={selectedDate ?? ""}
            selectedTime={selectedSession}
            examType={examType}
            material={getMaterial}
            sheetConsumptionCount={filteredData}
            submitted={submitted}
            onChangeSubmitted={setSubmitted}
            setExamSheetSummary={setExamSheetSummary}
            setExamSheetConsumptionCourseData={setExamSheetConsumptionData}
            isLastStepSeven={isFinalStepCompleted}
          />
          {/* Render buttons only if data is not saved and final step is not completed */}
          {!dataSaved && !isFinalStepCompleted && (
            <Stack direction="row" justifyContent="space-between" mt={2}>
              <Button
                color="secondary"
                variant="contained"
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={!processingDailyConsumption ? <SendIcon /> : null}
                onClick={handleDailyConsumption}
                disabled={!submitted || processingDailyConsumption}
              >
                {processingDailyConsumption ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Approve Consumption and Challan"
                )}
              </Button>
            </Stack>
          )}
          {/* Always render the success message when final step is completed or data is saved */}
          {(dataSaved || isFinalStepCompleted) && (
            <Typography
              variant="h6"
              color="success.main"
              mt={2}
              sx={{ textAlign: "center" }}
            >
              Challan for today has been approved!
            </Typography>
          )}
        </Box>
      ) : activeStep === 5 && examType === 5 ? (
        // Step 5: Discrepancy Marking (examType 5)
        <Box my={3}>
          <SixthStep
            selectedDate={selectedDate}
            selectedTime={selectedSession}
            selectedExamType={examType}
            distinctCourses={distinctCourses}
          />
          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Button color="secondary" variant="contained" onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          </Stack>
        </Box>
      ) : activeStep >= 6 && examType === 5 ? (
        // Step 6: Challan Processing (examType 5)
        <Box my={3}>
          <SeventhStep
            dataSaved={dataSaved}
            selectedDate={selectedDate ?? ""}
            selectedTime={selectedSession}
            examType={examType}
            material={getMaterial}
            sheetConsumptionCount={filteredData}
            submitted={submitted}
            onChangeSubmitted={setSubmitted}
            setExamSheetSummary={setExamSheetSummary}
            setExamSheetConsumptionCourseData={setExamSheetConsumptionData}
            isLastStepSeven={isFinalStepCompleted}
          />
          {/* Render buttons only if data is not saved and final step is not completed */}
          {!dataSaved && !isFinalStepCompleted && (
            <Stack direction="row" justifyContent="space-between" mt={2}>
              <Button
                color="secondary"
                variant="contained"
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={!processingDailyConsumption ? <SendIcon /> : null}
                onClick={handleDailyConsumption}
                disabled={!submitted || processingDailyConsumption}
              >
                {processingDailyConsumption ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Approve Consumption and Challan"
                )}
              </Button>
            </Stack>
          )}
          {/* Always render the success message when final step is completed or data is saved */}
          {(dataSaved || isFinalStepCompleted) && (
            <Typography
              variant="h6"
              color="success.main"
              mt={2}
              sx={{ textAlign: "center" }}
            >
              Challan for today has been approved!
            </Typography>
          )}
        </Box>
      ) : (
        <div></div>
      )}
    </HorizontalStepper>
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <BlankCard>
            <CardContent>{renderDateSessionComponent()}</CardContent>
            { }
          </BlankCard>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <BlankCard>
            <CardContent>{renderStepperComponent()}</CardContent>
          </BlankCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DailyActivity;
