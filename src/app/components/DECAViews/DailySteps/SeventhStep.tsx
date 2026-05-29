// "use client";
// import * as React from "react";
// import {
//   Box,
//   Typography,
//   Grid,
//   Stack,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   TextField,
//   MenuItem,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Alert,
//   Badge,
//   Avatar, Checkbox
// } from "@mui/material";
// import {
//   Receipt as ReceiptIcon,
//   LibraryBooks as LibraryBooksIcon,
//   Science as ScienceIcon,
//   Warning as WarningIcon,
//   CheckCircle as CheckCircleIcon,
//   Error as ErrorIcon,
//   Send as SendIcon,
//   ViewList as ViewListIcon,
//   Assignment as AssignmentIcon,
//   Add as AddIcon,
//   Close as CloseIcon,
//   Info as InfoIcon,
//   Padding
// } from "@mui/icons-material";
// import { format } from "date-fns";
// import AttendanceData from "../Staff Attendance/attendanceData";
// import { useSelector } from "react-redux";
// import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
// import { useSession } from "next-auth/react";
// import CircularProgress from "@mui/material/CircularProgress";
// import RemoveIcon from "@mui/icons-material/Remove";
// import CheckIcon from "@mui/icons-material/Check";
// import { da } from "date-fns/locale";
// import { getDamageSheetsdetails } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/challanProcessing/getDamageSheets";
// import { getCollectionGridView } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/challanProcessing/getCollectionGridView";
// import { getExamSheetSummary } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/challanProcessing/examSheetSummary";
// import { getExamSheetConsumption } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/challanProcessing/examSheetConsumption";
// import { insertDamageSheets } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/challanProcessing/insertDamageSheets";
// import { getMajorMinorPacket } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/challanProcessing/getMajorMinorPacket";
// import { updateMajorPacketAction } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/challanProcessing/updateMjorPacket";


// interface SheetsConsumption {
//   type: string;
//   totalSheets: number;
//   presentStudents: number;
//   umcStudents: number;
//   consumed: number;
//   damaged: number;
//   looseSheets: number;
//   umcSheets: number;
// }

// interface DamagedSheet {
//   Id: string;
//   ConsumedDatetime: string;
//   ConsumeSession: string,
//   CenterNo: string;
//   DamageCount: number;
//   DamageSerials: string;
//   DamageType: string;
// }

// interface ChallanDetail {
//   courseCode: string;
//   appeared: number;
//   absent: number;
//   umc: number;
//   umcExtraSheet: number;
//   newStudent: number;
//   totalSheet: number;
//   noOfPacket: number;
//   noOfUmcPacket: number;
//   totalCount: number;
// }

// interface SeventhStepProps {
//   selectedDate: string;
//   selectedTime: string;
//   examType: number;
//   onCompleteProcess?: () => void;
//   material: any[],
//   sheetConsumptionCount: any,
//   submitted: boolean;
//   onChangeSubmitted: (val: boolean) => void;
//   setExamSheetSummary: any;
//   setExamSheetConsumptionCourseData: any;
//   dataSaved: boolean,
//   isLastStepSeven?: boolean;
// }

// interface DamagedSheet {
//   PktNo: string | number;
//   DamageType: string;
//   Description: string;
//   DamageCount: number;
//   DamageSerials: string;
//   timestamp?: string; // optional if sometimes missing
// }

// interface ExamSheetConsumption {
//   CourseCode: string;
//   ExamTiming: string;
//   Appeared: number;
//   Absent: number;
//   UMC: number;
//   UMCExtraSheet: number;
//   NewStudent: number;
//   TotalSheet: number;
//   SheetConsumed: number;
//   NoOfPacket: number;
//   NoOfUMCPacket: number;
// }

// // const getInitialSheetsData = () => {

// //   // Default data (examType 0 - Regular)
// //   let data = [
// //     {
// //       type: "Theory",
// //       totalSheets: 100,
// //       presentStudents: 19,
// //       umcStudents: 0,
// //       consumed: 19,
// //       damaged: 0,
// //       looseSheets: 81,
// //       umcSheets: 0
// //     },
// //     {
// //       type: "Library Theory",
// //       totalSheets: 50,
// //       presentStudents: 10,
// //       umcStudents: 0,
// //       consumed: 10,
// //       damaged: 0,
// //       looseSheets: 40,
// //       umcSheets: 0
// //     },
// //     {
// //       type: "Practical",
// //       totalSheets: 30,
// //       presentStudents: 5,
// //       umcStudents: 0,
// //       consumed: 5,
// //       damaged: 0,
// //       looseSheets: 25,
// //       umcSheets: 0
// //     },
// //     {
// //       type: "Library Practical",
// //       totalSheets: 30,
// //       presentStudents: 5,
// //       umcStudents: 0,
// //       consumed: 5,
// //       damaged: 0,
// //       looseSheets: 25,
// //       umcSheets: 0
// //     }
// //   ];

// //   // Special exam type
// //   if (examType === 1) {
// //     data = [
// //       {
// //         type: "Theory",
// //         totalSheets: 80,
// //         presentStudents: 14,
// //         umcStudents: 2,
// //         consumed: 16,
// //         damaged: 0,
// //         looseSheets: 64,
// //         umcSheets: 2
// //       },
// //       {
// //         type: "Library",
// //         totalSheets: 40,
// //         presentStudents: 8,
// //         umcStudents: 1,
// //         consumed: 9,
// //         damaged: 0,
// //         looseSheets: 31,
// //         umcSheets: 1
// //       },
// //       {
// //         type: "Practical",
// //         totalSheets: 30,
// //         presentStudents: 12,
// //         umcStudents: 0,
// //         consumed: 12,
// //         damaged: 0,
// //         looseSheets: 18,
// //         umcSheets: 0
// //       }
// //     ];
// //   }

// //   // Practical exam type
// //   if (examType === 2) {
// //     data = [
// //       {
// //         type: "Practical",
// //         totalSheets: 80,
// //         presentStudents: 25,
// //         umcStudents: 1,
// //         consumed: 26,
// //         damaged: 0,
// //         looseSheets: 54,
// //         umcSheets: 1
// //       },
// //       {
// //         type: "Theory",
// //         totalSheets: 20,
// //         presentStudents: 5,
// //         umcStudents: 0,
// //         consumed: 5,
// //         damaged: 0,
// //         looseSheets: 15,
// //         umcSheets: 0
// //       }
// //     ];
// //   }

// //   return data;
// // };


// type ExamSheetSummaryResponse = any[]; // replace `any` with actual API response shape

// const SeventhStep: React.FC<SeventhStepProps> = ({
//   selectedDate,
//   selectedTime,
//   examType,
//   onCompleteProcess,
//   material,
//   sheetConsumptionCount,
//   submitted, onChangeSubmitted, setExamSheetSummary, setExamSheetConsumptionCourseData, dataSaved, isLastStepSeven
// }) => {

//   const centerNumber = useSelector((state: any) => state.center.centerNumber)
//   const { data: session } = useSession();
//   const [insertSheetsRes, setInsertSheetsRes] = React.useState<any>('')
//   const [damageSheets, setDamageSheets] = React.useState([])
//   const [updateMajorPacket, setMajorPackets] = React.useState(0)
//   const [isEditing, setIsEditing] = React.useState(false);
//   const [majorMinorPacketData, setMajorMinorPacketData] = React.useState<any[]>([])
//   const [tempValue, setTempValue] = React.useState<number>(0);
//   const [majorPacketRes, setMajorPacketRes] = React.useState("");
//   const [examSheetConsumptionData, setExamSheetConsumptionData] = React.useState<ExamSheetConsumption[]>([]);
//   const [damagedSheets, setDamagedSheets] = React.useState<DamagedSheet[]>([]);
//   const [collectionGridData, setCollectionGridData] = React.useState();
//   const [examSheetSummaryData, setExamSheetSummaryData] = React.useState<Record<string, ExamSheetSummaryResponse>>({});
//   const [loadingAddDamageSheets, setLoadingAddDamageSheets] = React.useState(false);
//   const [viewDamagedSheetsOpen, setViewDamagedSheetsOpen] = React.useState(false);
//   const [confirmChecked, setConfirmChecked] = React.useState(false);
//   const [isModalOpen, setIsModalOpen] = React.useState(false);

//   // State for damage sheet form
//   const [damageSheet, setDamageSheet] = React.useState({
//     type: "Theory",
//     packetsId: "",
//     sheetType: "",
//     count: "",
//     serialNo: ""
//   });

//   const getInitialChallanData = () => {
//     // Default data (examType 0 - Regular)
//     let data = [
//       {
//         courseCode: "CS101",
//         appeared: 12,
//         absent: 3,
//         umc: 0,
//         umcExtraSheet: 0,
//         newStudent: 0,
//         totalSheet: 12,
//         noOfPacket: 1,
//         noOfUmcPacket: 0,
//         totalCount: 12
//       },
//       {
//         courseCode: "CS102",
//         appeared: 7,
//         absent: 2,
//         umc: 0,
//         umcExtraSheet: 0,
//         newStudent: 0,
//         totalSheet: 7,
//         noOfPacket: 1,
//         noOfUmcPacket: 0,
//         totalCount: 7
//       }
//     ];

//     // Special exam type
//     if (examType === 1) {
//       data = [
//         {
//           courseCode: "MATH201",
//           appeared: 8,
//           absent: 2,
//           umc: 1,
//           umcExtraSheet: 1,
//           newStudent: 1,
//           totalSheet: 10,
//           noOfPacket: 1,
//           noOfUmcPacket: 1,
//           totalCount: 10
//         },
//         {
//           courseCode: "PHY101",
//           appeared: 6,
//           absent: 1,
//           umc: 1,
//           umcExtraSheet: 0,
//           newStudent: 0,
//           totalSheet: 6,
//           noOfPacket: 1,
//           noOfUmcPacket: 1,
//           totalCount: 6
//         },
//         {
//           courseCode: "CHEM102",
//           appeared: 12,
//           absent: 3,
//           umc: 0,
//           umcExtraSheet: 0,
//           newStudent: 2,
//           totalSheet: 12,
//           noOfPacket: 1,
//           noOfUmcPacket: 0,
//           totalCount: 12
//         }
//       ];
//     }

//     // Practical exam type
//     if (examType === 2) {
//       data = [
//         {
//           courseCode: "CS301",
//           appeared: 15,
//           absent: 5,
//           umc: 1,
//           umcExtraSheet: 0,
//           newStudent: 0,
//           totalSheet: 15,
//           noOfPacket: 1,
//           noOfUmcPacket: 1,
//           totalCount: 15
//         },
//         {
//           courseCode: "CS302",
//           appeared: 10,
//           absent: 2,
//           umc: 0,
//           umcExtraSheet: 0,
//           newStudent: 0,
//           totalSheet: 10,
//           noOfPacket: 1,
//           noOfUmcPacket: 0,
//           totalCount: 10
//         }
//       ];
//     }

//     return data;
//   };
//   const [challanDetails, setChallanDetails] = React.useState<ChallanDetail[]>(getInitialChallanData());

//   const handleStartEdit = () => {
//     setTempValue(updateMajorPacket);
//     setIsEditing(true);
//     handleEdit()

//   };
//   const handleEdit = () => {
//     setTempValue(majorMinorPacketData?.filter(item => item.ExamTime === selectedTime)[0]?.MajorPacket ?? 0);
//     setIsEditing(true);
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//   };

//   const handleSave = async () => {
//     setMajorPackets(tempValue);
//     setIsEditing(false);
//     await updateMajorPacketData()
//   };

//   // Handle damage sheet form changes
//   const handleDamageSheetChange = (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
//     setDamageSheet({ ...damageSheet, [prop]: event.target.value });
//   };

//   const fetchDamageSheets = async () => {
//     try {
//       if (!session?.user?.token) {
//         return;
//       }

//       const splitValue = session.user?.token.split("NEXT2121ANG");

//       const formfields = {
//         "ConsumedDatetime": selectedDate,
//         "ConsumeSession": selectedTime,
//         CenterNo: centerNumber,
//       };

//       const credentialsJson = JSON.stringify(formfields);
//       const { Data } = encryptData(credentialsJson, splitValue[1]);

//       const response = await getDamageSheetsdetails(Data);
//       const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
//       let parsedData;
//       parsedData = JSON.parse(decryptedData);
//       setDamagedSheets(parsedData);

//     } catch (error) {
//       console.log("error in getting damage sheets", error)
//     }
//   };

//   const fetchCollectionGrid = async () => {
//     try {
//       if (!session?.user?.token) {
//         return;
//       }

//       const splitValue = session.user?.token.split("NEXT2121ANG");

//       const formfields = {
//         "EDate": "2025-06-10",
//         "ETime": "02:30-05:30",
//         "CenterNo": String(centerNumber)
//       }

//       const credentialsJson = JSON.stringify(formfields);
//       const { Data } = encryptData(credentialsJson, splitValue[1]);

//       const response = await getCollectionGridView(Data);
//       const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
//       let parsedData;
//       parsedData = JSON.parse(decryptedData);
//       setCollectionGridData(parsedData);

//       // setLoading(false);
//     } catch (error) {
//       // setLoading(false);
//       console.log("error in getting collection grid data", error)
//     }
//   };

//   const keyMap: Record<string, string> = {
//     th: "Theory",
//     pr: "Practical",
//     libTheory: "LibraryTheory",
//     libPractical: "LibraryPractical",
//   };

//   const fetchExamSheetsummary = async () => {
//     try {
//       if (!session?.user?.token) {
//         return;
//       }

//       const splitValue = session.user?.token.split("NEXT2121ANG");

//       // Loop over keys of sheetConsumptionCount
//       for (const [key, value] of Object.entries(sheetConsumptionCount)) {
//         if ((value as number) > 0) {
//           const sheetType = keyMap[key] || key; // map key to readable SheetType

//           const formfields = {
//             EDate: selectedDate,
//             SheetType: sheetType, // dynamic
//             CenterNo: centerNumber,
//           };



//           const credentialsJson = JSON.stringify(formfields);
//           const { Data } = encryptData(credentialsJson, splitValue[1]);

//           const response = await getExamSheetSummary(Data);
//           const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
//           const parsedData = JSON.parse(decryptedData);

//           setExamSheetSummaryData((prev) => ({
//             ...prev,
//             [sheetType]: parsedData,
//           }));
//         }
//       }
//     } catch (error) {
//       console.log("error in getting exam sheet summary data", error);
//     }
//   };

//   const totalUmcPackets = examSheetConsumptionData.filter(item => item.ExamTiming === selectedTime).reduce(
//     (sum, item) => sum + item.NoOfUMCPacket,
//     0
//   );

//   const fetchExamSheetConsumption = async () => {
//     try {
//       if (!session?.user?.token) {
//         return;
//       }

//       const splitValue = session.user?.token.split("NEXT2121ANG");


//       const formfields = {
//         "EDate": selectedDate,
//         "CenterNo": String(centerNumber),
//         "SheetType": "theory"
//       };


//       const credentialsJson = JSON.stringify(formfields);
//       const { Data } = encryptData(credentialsJson, splitValue[1]);

//       const response = await getExamSheetConsumption(Data);
//       const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
//       const parsedData = JSON.parse(decryptedData);
//       setExamSheetConsumptionData(parsedData)


//     } catch (error) {
//       console.log("error in getting exam sheet consumption data", error);
//     }
//   };

//   const fetchMajorMinorPacketData = async () => {
//     try {
//       if (!session?.user?.token) {
//         return;
//       }

//       const splitValue = session.user?.token.split("NEXT2121ANG");

//       const formfields = {
//         "Edate": selectedDate,
//         "CenterNo": String(centerNumber)
//       };

//       const credentialsJson = JSON.stringify(formfields);
//       const { Data } = encryptData(credentialsJson, splitValue[1]);

//       const response = await getMajorMinorPacket(Data);
//       const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
//       const parsedData = JSON.parse(decryptedData);

//       setMajorMinorPacketData(parsedData)
//     } catch (error) {
//       console.log("error in getting major minor packet data", error);
//     }
//   };
//   // Update Major Packet
//   const updateMajorPacketData = async () => {
//     try {
//       if (!session?.user?.token) {
//         return;
//       }

//       const splitValue = session.user?.token.split("NEXT2121ANG");

//       const formfields = {
//         "Id": majorMinorPacketData[0].Id,
//         "MajorPacketCount": tempValue
//       }

//       const credentialsJson = JSON.stringify(formfields);
//       const { Data } = encryptData(credentialsJson, splitValue[1]);

//       const response = await updateMajorPacketAction(Data);
//       const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
//       const parsedData = JSON.parse(decryptedData);
//       setMajorPacketRes(parsedData)
//     } catch (error) {
//       console.log("error in updating majr packet", error);
//     }
//   };

//   const handleDamageSheetSubmit = async () => {
//     if (Number(damageSheet.count) <= 0) {
//       return;
//     }
//     if (!session?.user?.token) {
//       console.error("User session expired. Please log in again.");
//       return;
//     }

//     const splitValue = session.user?.token.split("NEXT2121ANG");

//     const formfields = {
//       Id: Number(damageSheet.packetsId),
//       ConsumedDatetime: selectedDate,
//       ConsumeSession: selectedTime,
//       CenterNo: centerNumber,
//       DamageCount: Number(damageSheet.count),
//       DamageSerials: damageSheet.serialNo,
//       DamageType: damageSheet.sheetType,
//     };


//     const credentialsJson = JSON.stringify(formfields);
//     const { Data } = encryptData(credentialsJson, splitValue[1]);

//     try {
//       setLoadingAddDamageSheets(true);
//       const response = await insertDamageSheets(Data);

//       if (response) {
//         const decryptedData = decryptDataforResponse(response.data, splitValue[1]);
//         const parsedData = JSON.parse(decryptedData);
//         console.log("parsedData", parsedData)
//         setInsertSheetsRes(parsedData);

//         await fetchDamageSheets();


//         setDamageSheet({
//           type: "Theory",
//           packetsId: "",
//           sheetType: "Damaged",
//           count: "",
//           serialNo: "",
//         });
//       }

//       setLoadingAddDamageSheets(false);
//     } catch (error) {
//       console.error("Error inserting damaged sheets:", error);
//     }
//   };

//   const totalPackets = challanDetails.reduce((sum, item) => sum + item.noOfPacket, 0);

//   const getExamTypeLabel = () => {
//     switch (examType) {
//       case 0: return "Regular";
//       case 1: return "Special";
//       case 2: return "Practical";
//       default: return "Regular";
//     }
//   };

//   // Get appropriate icon based on sheet type
//   const getSheetIcon = (type: string) => {
//     switch (type) {
//       case "Theory": return <LibraryBooksIcon fontSize="small" color="primary" />;
//       case "Library": return <LibraryBooksIcon fontSize="small" color="secondary" />;
//       case "Practical": return <ScienceIcon fontSize="small" color="warning" />;
//       default: return <LibraryBooksIcon fontSize="small" color="primary" />;
//     }
//   };

//   // Filter packets by selected date and time
//   const displayData =
//     material?.filter(
//       (entry) =>
//         entry?.ConsumeDatetime &&
//         entry?.ConsumeSession &&
//         entry.ConsumeDatetime.slice(0, 10) === selectedDate &&
//         entry.ConsumeSession === selectedTime
//     ) || [];


//   // Get background color based on sheet type
//   const getSheetBackgroundColor = (type: string) => {
//     switch (type) {
//       case "Theory": return "primary.light";
//       case "LibraryTheory": return "secondary.light";
//       case "Practical": return "warning.light";
//       case "LibraryPractical": return ".light";

//       default: return "primary.light";
//     }
//   };

//   const transformedData = Object.entries(examSheetSummaryData).flatMap(
//     ([type, summaries]) =>
//       summaries
//         .filter((summary) => summary.ExamTiming === selectedTime) // filter by selectedTime
//         .map((summary) => ({
//           type, // "Theory", "Practical", etc.
//           totalSheets: summary.Sheets,
//           presentStudents: summary.Present,
//           umcStudents: summary.UMC,
//           consumed: summary.Consumed,
//           damaged: summary.DamageSheets,
//           looseSheets: summary.LooseSheets,
//         }))
//   );

//   React.useEffect(() => {
//     fetchExamSheetsummary(),
//       fetchDamageSheets(),
//       fetchCollectionGrid(),
//       fetchExamSheetConsumption(),
//       fetchMajorMinorPacketData()
//   }, []);

//   React.useEffect(() => {
//     fetchMajorMinorPacketData()
//   }, [selectedDate, majorPacketRes]);

//   React.useEffect(() => {
//     if (transformedData.length > 0) {
//       setExamSheetSummary(transformedData);
//     }
//   }, [examSheetSummaryData]);

//   // Update data when exam type changes
//   React.useEffect(() => {
//     // setSheetsConsumption(getInitialSheetsData());
//     setChallanDetails(getInitialChallanData());
//   }, [examType]);

//   React.useEffect(() => {
//     if (majorMinorPacketData?.[0]?.MajorPacket != null) {
//       setTempValue(majorMinorPacketData?.filter(item => item.ExamTime === selectedTime)[0]?.MajorPacket ?? 0);
//     }
//   }, [majorMinorPacketData, examType]);

//   React.useEffect(() => {
//     setExamSheetConsumptionCourseData(examSheetConsumptionData);
//   }, [examSheetConsumptionData]);

//   const handlePrintChallan = () => {

//   }
//   return (
//     <>

//       <Box sx={{ padding: '0px !important' }}>
//         <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
//             <ReceiptIcon sx={{ verticalAlign: "middle", mr: 1 }} />
//             Challan Process
//           </Typography>
//           {/* Collection Grid Modal */}
//           {isModalOpen && (
//             <AttendanceData
//               selectedDate={selectedDate}
//               selectedTime={selectedTime}
//               data={collectionGridData}
//               open={isModalOpen}
//               onClose={() => setIsModalOpen(false)}
//             />
//           )}
//           <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 2 }}>
//             <Chip
//               color="primary"
//               variant="outlined"
//               label={"Print Challan"}
//               onClick={handlePrintChallan}
//               sx={{ p: 0 }}
//             />
//             <Chip
//               color="primary"
//               variant="outlined"
//               label={"Show Collection Grid"}
//               onClick={() => setIsModalOpen(true)}
//               sx={{ p: 0 }}
//             />
//             <Chip
//               color="primary"
//               variant="outlined"
//               icon={<InfoIcon />}
//               label={`${getExamTypeLabel()} Exam: ${selectedDate} - ${selectedTime}`}
//               sx={{ p: 0 }}
//             />
//           </Box>
//         </Box>

//         {/* Sheet Consumption Summary */}
//         <Card variant="outlined" sx={{ mb: 2 }}>
//           <CardContent sx={{ p: '0px !important' }}>
//             <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
//               <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
//                 <ReceiptIcon sx={{ mr: 1, color: 'primary.main' }} />
//                 Sheet Consumption
//               </Typography>
//               <Badge badgeContent={damagedSheets.length} color="warning" max={99}>
//                 <Button
//                   variant="outlined"
//                   size="small"
//                   startIcon={<ViewListIcon />}
//                   onClick={() => setViewDamagedSheetsOpen(true)}
//                   color="primary"
//                 >
//                   Damaged Sheets
//                 </Button>
//               </Badge>
//             </Stack>


//             <Grid container spacing={2}>
//               {transformedData?.map((item, index) => (
//                 <Grid key={index} size={{ xs: 12, sm: 3, md: 3 }}>
//                   <Card
//                     variant="outlined"
//                     sx={{
//                       backgroundColor: getSheetBackgroundColor(item.type),
//                       p: "0px !important",
//                     }}
//                   >
//                     <CardContent sx={{ p: 1.5 }}>
//                       <Stack
//                         direction="row"
//                         alignItems="center"
//                         spacing={1}
//                         sx={{ mb: 1 }}
//                       >
//                         <Avatar
//                           sx={{
//                             backgroundColor: (theme: any) =>
//                               theme.palette.mode === "light" ? "white" : "#111c2d",
//                             width: 28,
//                             height: 28,
//                           }}
//                         >
//                           {getSheetIcon(item.type)}
//                         </Avatar>
//                         <Typography
//                           variant="subtitle2"
//                           fontWeight="bold"
//                           color="primary.main"
//                         >
//                           {item.type}
//                         </Typography>
//                       </Stack>

//                       <Grid container spacing={1}>
//                         <Grid size={{ xs: 6 }}>
//                           <Box
//                             sx={{
//                               p: 0.5,
//                               backgroundColor: (theme: any) =>
//                                 theme.palette.mode === "light" ? "white" : "#111c2d",
//                               borderRadius: 1,
//                             }}
//                           >
//                             <Typography variant="caption" color="text.secondary">
//                               Total:
//                             </Typography>
//                             <Typography
//                               variant="body2"
//                               fontWeight="bold"
//                               color="primary.main"
//                             >
//                               {item.totalSheets}
//                             </Typography>
//                           </Box>
//                         </Grid>

//                         <Grid size={{ xs: 6 }}>
//                           <Box
//                             sx={{
//                               p: 0.5,
//                               backgroundColor: (theme: any) =>
//                                 theme.palette.mode === "light" ? "white" : "#111c2d",
//                               borderRadius: 1,
//                             }}
//                           >
//                             <Typography variant="caption" color="text.secondary">
//                               Present:
//                             </Typography>
//                             <Typography
//                               variant="body2"
//                               fontWeight="bold"
//                               color="success.main"
//                             >
//                               {item.presentStudents}
//                             </Typography>
//                           </Box>
//                         </Grid>

//                         <Grid size={{ xs: 6 }}>
//                           <Box
//                             sx={{
//                               p: 0.5,
//                               backgroundColor: (theme: any) =>
//                                 theme.palette.mode === "light" ? "white" : "#111c2d",
//                               borderRadius: 1,
//                             }}
//                           >
//                             <Typography variant="caption" color="text.secondary">
//                               UMC:
//                             </Typography>
//                             <Typography
//                               variant="body2"
//                               fontWeight="bold"
//                               color={
//                                 item.umcStudents > 0 ? "error.main" : "text.secondary"
//                               }
//                             >
//                               {item.umcStudents}
//                             </Typography>
//                           </Box>
//                         </Grid>

//                         <Grid size={{ xs: 6 }}>
//                           <Box
//                             sx={{
//                               p: 0.5,
//                               backgroundColor: (theme: any) =>
//                                 theme.palette.mode === "light" ? "white" : "#111c2d",
//                               borderRadius: 1,
//                             }}
//                           >
//                             <Typography variant="caption" color="text.secondary">
//                               Consumed:
//                             </Typography>
//                             <Typography
//                               variant="body2"
//                               fontWeight="bold"
//                               color="primary.main"
//                             >
//                               {item.consumed}
//                             </Typography>
//                           </Box>
//                         </Grid>

//                         <Grid size={{ xs: 6 }}>
//                           <Box
//                             sx={{
//                               p: 0.5,
//                               backgroundColor: (theme: any) =>
//                                 theme.palette.mode === "light" ? "white" : "#111c2d",
//                               borderRadius: 1,
//                             }}
//                           >
//                             <Typography variant="caption" color="text.secondary">
//                               Damaged:
//                             </Typography>
//                             <Typography
//                               variant="body2"
//                               fontWeight="bold"
//                               color={
//                                 item.damaged > 0 ? "warning.main" : "text.secondary"
//                               }
//                             >
//                               {item.damaged}
//                             </Typography>
//                           </Box>
//                         </Grid>

//                         <Grid size={{ xs: 6 }}>
//                           <Box
//                             sx={{
//                               p: 0.5,
//                               backgroundColor: (theme: any) =>
//                                 theme.palette.mode === "light" ? "white" : "#111c2d",
//                               borderRadius: 1,
//                             }}
//                           >
//                             <Typography variant="caption" color="text.secondary">
//                               Loose:
//                             </Typography>
//                             <Typography variant="body2" fontWeight="bold">
//                               {item.looseSheets}
//                             </Typography>
//                           </Box>
//                         </Grid>
//                       </Grid>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>

//           </CardContent>
//         </Card>

//         {/* Damage Sheet Reporting */}
//         <Card variant="outlined" sx={{ mb: 2 }}>
//           <CardContent sx={{ p: '0px !important' }}>
//             <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
//               <WarningIcon sx={{ verticalAlign: "middle", mr: 1, color: "warning.main" }} />
//               Report Damaged Sheets
//             </Typography>

//             <Grid container spacing={1} alignItems="center">
//               {/* <Grid size={{ xs: 12, sm: 2 }}>
//               <TextField
//                 select
//                 fullWidth
//                 variant="outlined"
//                 label="Type"
//                 value={damageSheet.type}
//                 onChange={handleDamageSheetChange("type")}
//                 size="small"
//                 margin="dense"
//               >
//                 {sheetsConsumption.map((item) => (
//                   <MenuItem key={item.type} value={item.type}>{item.type}</MenuItem>
//                 ))}
//               </TextField>
//             </Grid> */}
//               <Grid size={{ xs: 12, sm: 3 }}>
//                 <TextField
//                   select
//                   variant="outlined"
//                   label="Packets"
//                   value={damageSheet.packetsId}
//                   onChange={handleDamageSheetChange("packetsId")}
//                   size="small"
//                   margin="dense"
//                   fullWidth
//                 >
//                   {displayData?.map(item => (
//                     <MenuItem key={item.Id} value={item.Id}>
//                       {item.Pktno}
//                     </MenuItem>
//                   ))}
//                 </TextField>

//               </Grid>
//               {/* <Grid size={{xs:12,sm:3}}>
//                 <TextField
//                   select
//                   fullWidth
//                   variant="outlined"
//                   label="Sheet Type"
//                   value={damageSheet.sheetType}
//                   onChange={handleDamageSheetChange("sheetType")}
//                   size="small"
//                   margin="dense"
//                 >
//                   <MenuItem value="Missing">Missing</MenuItem>
//                   <MenuItem value="Damaged">Damaged</MenuItem>
//                 </TextField>
//               </Grid> */}
//               <Grid size={{ xs: 12, sm: 3 }}>
//                 <TextField
//                   select
//                   fullWidth
//                   variant="outlined"
//                   label="Sheet Type"
//                   value={damageSheet.sheetType}
//                   onChange={handleDamageSheetChange("sheetType")}
//                   size="small"
//                   margin="dense"
//                 >
//                   <MenuItem value="Missing">Missing</MenuItem>
//                   <MenuItem value="Damaged">Damaged</MenuItem>
//                 </TextField>
//               </Grid>
//               <Grid size={{ xs: 12, sm: 2 }}>
//                 <TextField
//                   // fullWidth
//                   variant="outlined"
//                   label="Count"
//                   type="number"
//                   value={damageSheet.count}
//                   onChange={handleDamageSheetChange("count")}
//                   size="small"
//                   margin="dense"
//                   InputProps={{
//                     inputProps: { min: 0 }
//                   }}
//                 />
//               </Grid>
//               <Grid size={{ xs: 12, sm: 2 }}>
//                 <TextField
//                   // fullWidth
//                   variant="outlined"
//                   label="Serial No"
//                   type="number"
//                   value={damageSheet.serialNo}
//                   onChange={handleDamageSheetChange("serialNo")}
//                   size="small"
//                   margin="dense"
//                   InputProps={{
//                     inputProps: { min: 0 }
//                   }}
//                 />
//               </Grid>
//               {/* <Grid size={{ xs: 12, sm: 3 }}>
//               <TextField
//                 // fullWidth
//                 variant="outlined"
//                 type="number"
//                 label="Serial No"
//                 value={damageSheet.serialNo}
//                 onChange={handleDamageSheetChange("serialNo")}
//                 size="small"
//                 margin="dense"
//                 InputProps={{
//                   inputProps: { min: 0 }
//                 }}
//               // required
//               />
//             </Grid> */}

//               <Grid size={{ xs: 12, sm: 1 }}>
//                 <Button
//                   variant="contained"
//                   onClick={handleDamageSheetSubmit}
//                   disabled={!damageSheet.serialNo || loadingAddDamageSheets}
//                   startIcon={
//                     loadingAddDamageSheets ? (
//                       <CircularProgress size={18} color="inherit" />
//                     ) : null
//                   }
//                   size="small"
//                 >
//                   Add
//                 </Button>
//               </Grid>
//             </Grid>
//           </CardContent>
//         </Card>

//         {/* Challan Details */}
//         <Card variant="outlined" sx={{ mb: 2 }}>
//           <CardContent sx={{ p: "0px !important" }}>
//             {/* Header */}
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 mb: 1,
//               }}
//             >
//               <Typography
//                 variant="h6"
//                 fontWeight="bold"
//                 sx={{ display: "flex", alignItems: "center" }}
//               >
//                 <AssignmentIcon sx={{ mr: 1, color: "primary.main" }} />
//                 Challan Details
//               </Typography>
//               {(isLastStepSeven || dataSaved) &&

//                 <Chip
//                   label="Edit major packet"
//                   color="success"
//                   variant="outlined"
//                   size="small"
//                   sx={{ cursor: "pointer" }}
//                   onClick={handleStartEdit}

//                 />
//               }
//             </Box>

//             {/* Alert */}
//             <Alert severity="error" sx={{ mb: 1 }}>
//               <Typography variant="caption" fontWeight="bold">
//                 Note: Arrange All sheets E-code wise
//               </Typography>
//             </Alert>

//             {/* Chips Section */}
//             <Grid container spacing={1} sx={{ mb: 1 }}>
//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <Chip
//                   icon={<CheckCircleIcon />}
//                   label={`Minor Packets: ${majorMinorPacketData?.filter(item => item.ExamTime === selectedTime)[0]?.MinorPackets ?? 0}`}
//                   color="primary"
//                   variant="outlined"
//                   size="small"
//                   sx={{ width: "100%" }}
//                 />
//               </Grid>

//               <Grid size={{ xs: 12, sm: 4 }}>
//                 <Chip
//                   icon={<ErrorIcon />}
//                   label={`UMC Packets: ${totalUmcPackets ?? 0}`}
//                   color="error"
//                   variant="outlined"
//                   size="small"
//                   sx={{ width: "100%" }}
//                 />
//               </Grid>

//               {/* Major Packets */}
//               <Grid size={{ xs: 12, sm: 4 }}>
//                 {!isEditing ? (
//                   <Chip
//                     icon={<AssignmentIcon />}
//                     label={`Major Packets: ${majorMinorPacketData?.filter(item => item.ExamTime === selectedTime)[0]?.MajorPacket ?? 0}`}
//                     color="success"
//                     variant="outlined"
//                     size="small"
//                     sx={{ width: "100%" }}
//                   // onClick={handleEdit} // <-- click Chip to edit
//                   />
//                 ) : (
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       border: "1px solid",
//                       borderColor: "grey.400",
//                       borderRadius: 2,
//                       p: 0.5,
//                       width: "100%",
//                       gap: 0.5,
//                     }}
//                   >
//                     <IconButton
//                       size="small"
//                       onClick={() => setTempValue((v) => Math.max(0, v - 1))}
//                     >
//                       <RemoveIcon fontSize="small" />
//                     </IconButton>

//                     <TextField
//                       value={tempValue ?? 0}
//                       size="small"
//                       type="number"
//                       onChange={(e) => setTempValue(Number(e.target.value))}
//                       inputProps={{
//                         min: 0,
//                         style: { textAlign: "center", width: 50 },
//                       }}
//                     />

//                     <IconButton
//                       size="small"
//                       onClick={() => setTempValue((v) => v + 1)}
//                     >
//                       <AddIcon fontSize="small" />
//                     </IconButton>

//                     <Box sx={{ flexGrow: 1 }} />

//                     <IconButton size="small" color="success" onClick={handleSave}>
//                       <CheckIcon fontSize="small" />
//                     </IconButton>
//                     <IconButton size="small" color="error" onClick={handleCancel}>
//                       <CloseIcon fontSize="small" />
//                     </IconButton>
//                   </Box>
//                 )}
//               </Grid>

//             </Grid>

//             {/* Table Section */}
//             <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300, overflow: "auto" }}>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow sx={{ bgcolor: "primary.light" }}>
//                     <TableCell sx={{ fontWeight: "bold" }}>Course Code</TableCell>
//                     <TableCell align="center" sx={{ fontWeight: "bold" }}>
//                       Appeared
//                     </TableCell>
//                     <TableCell align="center" sx={{ fontWeight: "bold" }}>
//                       Absent
//                     </TableCell>
//                     <TableCell align="center" sx={{ fontWeight: "bold" }}>
//                       UMC
//                     </TableCell>
//                     <TableCell align="center" sx={{ fontWeight: "bold" }}>
//                       UMC Extra
//                     </TableCell>
//                     <TableCell align="center" sx={{ fontWeight: "bold" }}>
//                       New Student
//                     </TableCell>
//                     <TableCell align="center" sx={{ fontWeight: "bold" }}>
//                       Total Sheet
//                     </TableCell>
//                     <TableCell align="center" sx={{ fontWeight: "bold" }}>
//                       No Of Packet
//                     </TableCell>
//                     <TableCell align="center" sx={{ fontWeight: "bold" }}>
//                       UMC Packet
//                     </TableCell>
//                     {/* <TableCell align="center" sx={{ fontWeight: "bold" }}>
//                     Total Count
//                   </TableCell> */}
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {examSheetConsumptionData?.filter(item => item.ExamTiming === selectedTime).map((row, index) => (
//                     <TableRow
//                       key={index}
//                       sx={{ "&:nth-of-type(odd)": { bgcolor: "action.hover" } }}
//                     >
//                       <TableCell>{row.CourseCode}</TableCell>
//                       <TableCell align="center">{row.Appeared}</TableCell>
//                       <TableCell align="center">{row.Absent}</TableCell>
//                       <TableCell align="center">{row.UMC}</TableCell>
//                       <TableCell align="center">{row.UMCExtraSheet}</TableCell>
//                       <TableCell align="center">{row.NewStudent}</TableCell>
//                       <TableCell align="center">{row.TotalSheet}</TableCell>
//                       <TableCell align="center">{row.NoOfPacket}</TableCell>
//                       <TableCell align="center">{row.NoOfUMCPacket}</TableCell>
//                       {/* <TableCell align="center">{row.totalCount}</TableCell> */}
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </CardContent>
//         </Card>

//         {/* Final Action Button */}
//         {/* <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
//           <Button
//             variant="contained"
//             color="success"
//             size="large"
//             startIcon={<SendIcon />}
//             onClick={onCompleteProcess}
//           >
//             Approve Consumption and Challan
//           </Button>
//         </Box> */}

//         {/* Damaged Sheets Dialog */}
//         <Dialog
//           open={viewDamagedSheetsOpen}
//           onClose={() => setViewDamagedSheetsOpen(false)}
//           maxWidth="md"
//           fullWidth
//         >
//           <DialogTitle sx={{ bgcolor: 'warning.light', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//               <WarningIcon sx={{ mr: 1 }} />
//               Damaged Sheets List
//             </Box>
//             <IconButton onClick={() => setViewDamagedSheetsOpen(false)} size="small">
//               <CloseIcon fontSize="small" />
//             </IconButton>
//           </DialogTitle>
//           <DialogContent dividers>
//             {damagedSheets.length === 0 ? (
//               <Typography variant="body1" align="center" sx={{ py: 2 }}>
//                 No damaged sheets reported yet
//               </Typography>
//             ) : (
//               <TableContainer>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow sx={{ bgcolor: 'action.hover' }}>
//                       <TableCell sx={{ fontWeight: 'bold' }}>Pkt No</TableCell>
//                       {/* <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell> */}
//                       <TableCell sx={{ fontWeight: 'bold' }}>Damage Type</TableCell>
//                       <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
//                       <TableCell sx={{ fontWeight: 'bold' }}>Count</TableCell>
//                       <TableCell sx={{ fontWeight: 'bold' }}>Serial No</TableCell>
//                       {/* <TableCell sx={{ fontWeight: 'bold' }}>Timestamp</TableCell> */}
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {damagedSheets.map((sheet, index) => (
//                       <TableRow key={index}>
//                         <TableCell>{sheet.PktNo}</TableCell>
//                         {/* <TableCell>{sheet.type}</TableCell> */}
//                         <TableCell>{sheet.DamageType}</TableCell>
//                         <TableCell>{sheet.Description}</TableCell>
//                         <TableCell>{sheet.DamageCount}</TableCell>
//                         <TableCell>{sheet.DamageSerials}</TableCell>
//                         {/* <TableCell>{sheet.timestamp}</TableCell> */}
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setViewDamagedSheetsOpen(false)} color="primary">
//               Close
//             </Button>
//           </DialogActions>
//         </Dialog>
//         {!dataSaved && !isLastStepSeven && <Box
//           sx={{
//             p: 1,
//             mt: 2,
//             display: "flex",
//             alignItems: "center",
//             gap: 1,
//           }}
//         >
//           <Checkbox
//             checked={submitted}
//             onChange={(e) => onChangeSubmitted(e.target.checked)}
//           />
//           <Typography flex={1}>
//             Are you sure to submit the daily approve consumption?
//           </Typography>
//         </Box>}

//       </Box>



//     </>
//   );
// };

// export default SeventhStep;



"use client";
import * as React from "react";
import {
  Box,
  Typography,
  Grid,
  Stack,
  Button,
  Card,
  CardContent,
  Chip,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Badge,
  Avatar, Checkbox
} from "@mui/material";
import {
  Receipt as ReceiptIcon,
  LibraryBooks as LibraryBooksIcon,
  Science as ScienceIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Send as SendIcon,
  ViewList as ViewListIcon,
  Assignment as AssignmentIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Padding
} from "@mui/icons-material";
import { format } from "date-fns";
import AttendanceData from "../Staff Attendance/attendanceData";
import { useSelector } from "react-redux";
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import { useSession } from "next-auth/react";
import CircularProgress from "@mui/material/CircularProgress";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckIcon from "@mui/icons-material/Check";

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { da } from "date-fns/locale";
import { deGetChallanNumber } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/challanProcessing/getChallanNumber";
import { getDamageSheetsdetails } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/challanProcessing/getDamageSheets";
import { getCollectionGridView } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/challanProcessing/getCollectionGridView";
import { getExamSheetConsumption } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/challanProcessing/examSheetConsumption";
import { updateMajorPacketAction } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/challanProcessing/updateMjorPacket";
import { getExamSheetSummary } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/challanProcessing/examSheetSummary";
import { getMajorMinorPacket } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/challanProcessing/getMajorMinorPacket";
import { insertDamageSheets } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/challanProcessing/insertDamageSheets";


interface SheetsConsumption {
  type: string;
  totalSheets: number;
  presentStudents: number;
  umcStudents: number;
  consumed: number;
  damaged: number;
  looseSheets: number;
  umcSheets: number;
}

interface DamagedSheet {
  Id: string;
  ConsumedDatetime: string;
  ConsumeSession: string,
  CenterNo: string;
  DamageCount: number;
  DamageSerials: string;
  DamageType: string;
}

interface ChallanDetail {
  courseCode: string;
  appeared: number;
  absent: number;
  umc: number;
  umcExtraSheet: number;
  newStudent: number;
  totalSheet: number;
  noOfPacket: number;
  noOfUmcPacket: number;
  totalCount: number;
}

interface SeventhStepProps {
  selectedDate: string;
  selectedTime: string;
  examType: number;
  onCompleteProcess?: () => void;
  material: any[],
  sheetConsumptionCount: any,
  submitted: boolean;
  onChangeSubmitted: (val: boolean) => void;
  setExamSheetSummary: any;
  setExamSheetConsumptionCourseData: any;
  dataSaved: boolean,
  isLastStepSeven?: boolean;
}

interface DamagedSheet {
  PktNo: string | number;
  DamageType: string;
  Description: string;
  DamageCount: number;
  DamageSerials: string;
  timestamp?: string; // optional if sometimes missing
}

interface ExamSheetConsumption {
  CourseCode: string;
  ExamTiming: string;
  Appeared: number;
  Absent: number;
  UMC: number;
  UMCExtraSheet: number;
  NewStudent: number;
  TotalSheet: number;
  SheetConsumed: number;
  NoOfPacket: number;
  NoOfUMCPacket: number;
}

interface ChallanNumberResponse {
  CenterNo: string | null;
  ExamDate: string | null;
  ExamTiming: string | null;
  ChallanNumber: string;
  ColourCode: string | null;
  staffname: string;
  phoneno: string;
}

// const getInitialSheetsData = () => {

//   // Default data (examType 0 - Regular)
//   let data = [
//     {
//       type: "Theory",
//       totalSheets: 100,
//       presentStudents: 19,
//       umcStudents: 0,
//       consumed: 19,
//       damaged: 0,
//       looseSheets: 81,
//       umcSheets: 0
//     },
//     {
//       type: "Library Theory",
//       totalSheets: 50,
//       presentStudents: 10,
//       umcStudents: 0,
//       consumed: 10,
//       damaged: 0,
//       looseSheets: 40,
//       umcSheets: 0
//     },
//     {
//       type: "Practical",
//       totalSheets: 30,
//       presentStudents: 5,
//       umcStudents: 0,
//       consumed: 5,
//       damaged: 0,
//       looseSheets: 25,
//       umcSheets: 0
//     },
//     {
//       type: "Library Practical",
//       totalSheets: 30,
//       presentStudents: 5,
//       umcStudents: 0,
//       consumed: 5,
//       damaged: 0,
//       looseSheets: 25,
//       umcSheets: 0
//     }
//   ];

//   // Special exam type
//   if (examType === 1) {
//     data = [
//       {
//         type: "Theory",
//         totalSheets: 80,
//         presentStudents: 14,
//         umcStudents: 2,
//         consumed: 16,
//         damaged: 0,
//         looseSheets: 64,
//         umcSheets: 2
//       },
//       {
//         type: "Library",
//         totalSheets: 40,
//         presentStudents: 8,
//         umcStudents: 1,
//         consumed: 9,
//         damaged: 0,
//         looseSheets: 31,
//         umcSheets: 1
//       },
//       {
//         type: "Practical",
//         totalSheets: 30,
//         presentStudents: 12,
//         umcStudents: 0,
//         consumed: 12,
//         damaged: 0,
//         looseSheets: 18,
//         umcSheets: 0
//       }
//     ];
//   }

//   // Practical exam type
//   if (examType === 2) {
//     data = [
//       {
//         type: "Practical",
//         totalSheets: 80,
//         presentStudents: 25,
//         umcStudents: 1,
//         consumed: 26,
//         damaged: 0,
//         looseSheets: 54,
//         umcSheets: 1
//       },
//       {
//         type: "Theory",
//         totalSheets: 20,
//         presentStudents: 5,
//         umcStudents: 0,
//         consumed: 5,
//         damaged: 0,
//         looseSheets: 15,
//         umcSheets: 0
//       }
//     ];
//   }

//   return data;
// };


type ExamSheetSummaryResponse = any[]; // replace `any` with actual API response shape

const SeventhStep: React.FC<SeventhStepProps> = ({
  selectedDate,
  selectedTime,
  examType,
  onCompleteProcess,
  material,
  sheetConsumptionCount,
  submitted, onChangeSubmitted, setExamSheetSummary, setExamSheetConsumptionCourseData, dataSaved, isLastStepSeven
}) => {

  const centerNumber = useSelector((state: any) => state.center.centerNumber)
  const username = useSelector((state: any) => state.user?.username);
  const { data: session } = useSession();
  const [insertSheetsRes, setInsertSheetsRes] = React.useState<any>('')
  const [damageSheets, setDamageSheets] = React.useState([])
  const [updateMajorPacket, setMajorPackets] = React.useState(0)
  const [isEditing, setIsEditing] = React.useState(false);
  const [majorMinorPacketData, setMajorMinorPacketData] = React.useState<any[]>([])
  const [tempValue, setTempValue] = React.useState<number>(0);
  const [majorPacketRes, setMajorPacketRes] = React.useState("");
  const [examSheetConsumptionData, setExamSheetConsumptionData] = React.useState<ExamSheetConsumption[]>([]);
  const [damagedSheets, setDamagedSheets] = React.useState<DamagedSheet[]>([]);
  const [collectionGridData, setCollectionGridData] = React.useState();
  const [examSheetSummaryData, setExamSheetSummaryData] = React.useState<Record<string, ExamSheetSummaryResponse>>({});
  const [loadingAddDamageSheets, setLoadingAddDamageSheets] = React.useState(false);
  const [viewDamagedSheetsOpen, setViewDamagedSheetsOpen] = React.useState(false);
  const [confirmChecked, setConfirmChecked] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [challanNumberData, setChallanNumberData] = React.useState<ChallanNumberResponse | null>(null);

  // State for damage sheet form
  const [damageSheet, setDamageSheet] = React.useState({
    type: "Theory",
    packetsId: "",
    sheetType: "",
    count: "",
    serialNo: ""
  });

  const getInitialChallanData = () => {
    // Default data (examType 0 - Regular)
    let data = [
      {
        courseCode: "CS101",
        appeared: 12,
        absent: 3,
        umc: 0,
        umcExtraSheet: 0,
        newStudent: 0,
        totalSheet: 12,
        noOfPacket: 1,
        noOfUmcPacket: 0,
        totalCount: 12
      },
      {
        courseCode: "CS102",
        appeared: 7,
        absent: 2,
        umc: 0,
        umcExtraSheet: 0,
        newStudent: 0,
        totalSheet: 7,
        noOfPacket: 1,
        noOfUmcPacket: 0,
        totalCount: 7
      }
    ];

    // Special exam type
    if (examType === 1) {
      data = [
        {
          courseCode: "MATH201",
          appeared: 8,
          absent: 2,
          umc: 1,
          umcExtraSheet: 1,
          newStudent: 1,
          totalSheet: 10,
          noOfPacket: 1,
          noOfUmcPacket: 1,
          totalCount: 10
        },
        {
          courseCode: "PHY101",
          appeared: 6,
          absent: 1,
          umc: 1,
          umcExtraSheet: 0,
          newStudent: 0,
          totalSheet: 6,
          noOfPacket: 1,
          noOfUmcPacket: 1,
          totalCount: 6
        },
        {
          courseCode: "CHEM102",
          appeared: 12,
          absent: 3,
          umc: 0,
          umcExtraSheet: 0,
          newStudent: 2,
          totalSheet: 12,
          noOfPacket: 1,
          noOfUmcPacket: 0,
          totalCount: 12
        }
      ];
    }

    // Practical exam type
    if (examType === 2) {
      data = [
        {
          courseCode: "CS301",
          appeared: 15,
          absent: 5,
          umc: 1,
          umcExtraSheet: 0,
          newStudent: 0,
          totalSheet: 15,
          noOfPacket: 1,
          noOfUmcPacket: 1,
          totalCount: 15
        },
        {
          courseCode: "CS302",
          appeared: 10,
          absent: 2,
          umc: 0,
          umcExtraSheet: 0,
          newStudent: 0,
          totalSheet: 10,
          noOfPacket: 1,
          noOfUmcPacket: 0,
          totalCount: 10
        }
      ];
    }

    return data;
  };
  const [challanDetails, setChallanDetails] = React.useState<ChallanDetail[]>(getInitialChallanData());

  const handleStartEdit = () => {
    setTempValue(updateMajorPacket);
    setIsEditing(true);
    handleEdit()

  };
  const handleEdit = () => {
    setTempValue(majorMinorPacketData?.filter(item => item.ExamTime === selectedTime)[0]?.MajorPacket ?? 0);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    setMajorPackets(tempValue);
    setIsEditing(false);
    await updateMajorPacketData()
  };

  // Handle damage sheet form changes
  const handleDamageSheetChange = (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setDamageSheet({ ...damageSheet, [prop]: event.target.value });
  };

  const fetchDamageSheets = async () => {
    try {
      if (!session?.user?.token) {
        return;
      }

      const splitValue = session?.user?.token?.split("NEXT2121ANG");

      const formfields = {
        "ConsumedDatetime": selectedDate,
        "ConsumeSession": selectedTime,
        CenterNo: centerNumber,
      };

      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);

      const response = await getDamageSheetsdetails(Data);
      if (!response?.status) return
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
      let parsedData;
      parsedData = JSON.parse(decryptedData);
      setDamagedSheets(parsedData);

      // setLoading(false);
    } catch (error) {
      // setLoading(false);
      console.log("error in getting damage sheets", error)
    }
  };

  const fetchCollectionGrid = async () => {
    try {
      if (!session?.user?.token) {
        return;
      }

      const splitValue = session?.user?.token?.split("NEXT2121ANG");

      const formfields = {
        "EDate": "2025-06-10",
        "ETime": "02:30-05:30",
        "CenterNo": String(centerNumber)
      }

      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);

      const response = await getCollectionGridView(Data);
      if (!response?.status) return
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
      let parsedData;
      parsedData = JSON.parse(decryptedData);
      setCollectionGridData(parsedData);

      // setLoading(false);
    } catch (error) {
      // setLoading(false);
      console.log("error in getting collection grid data", error)
    }
  };

  const keyMap: Record<string, string> = {
    th: "Theory",
    pr: "Practical",
    libTheory: "LibraryTheory",
    libPractical: "LibraryPractical",
  };

  const fetchExamSheetsummary = async () => {
    try {
      if (!session?.user?.token) {
        return;
      }

      const splitValue = session?.user?.token?.split("NEXT2121ANG");

      // Loop over keys of sheetConsumptionCount
      for (const [key, value] of Object.entries(sheetConsumptionCount)) {
        if ((value as number) > 0) {
          const sheetType = keyMap[key] || key; // map key to readable SheetType

          const formfields = {
            EDate: selectedDate,
            SheetType: sheetType, // dynamic
            CenterNo: centerNumber,
          };



          const credentialsJson = JSON.stringify(formfields);
          const { Data } = encryptData(credentialsJson, splitValue[1]);

          const response = await getExamSheetSummary(Data);
          console.log("response", response)
          if (!response?.status) return

          const decryptedData = decryptDataforResponse(response.data, splitValue[1]);
          const parsedData = JSON.parse(decryptedData);

          setExamSheetSummaryData((prev) => ({
            ...prev,
            [sheetType]: parsedData,
          }));
        }
      }
    } catch (error) {
      console.log("error in getting exam sheet summary data", error);
    }
  };

  const totalUmcPackets = examSheetConsumptionData.filter(item => item.ExamTiming === selectedTime).reduce(
    (sum, item) => sum + item.NoOfUMCPacket,
    0
  );

  const fetchExamSheetConsumption = async () => {
    try {
      if (!session?.user?.token) {
        return;
      }

      const splitValue = session?.user?.token?.split("NEXT2121ANG");


      const formfields = {
        "EDate": selectedDate,
        "CenterNo": String(centerNumber),
        "SheetType": "Theory"
      };


      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);

      const response = await getExamSheetConsumption(Data);
      if (!response?.status) return
      const decryptedData = decryptDataforResponse(response.data, splitValue[1]);
      const parsedData = JSON.parse(decryptedData);
      setExamSheetConsumptionData(parsedData)


    } catch (error) {
      console.log("error in getting exam sheet consumption data", error);
    }
  };

  const fetchMajorMinorPacketData = async () => {
    try {
      if (!session?.user?.token) {
        return;
      }

      const splitValue = session?.user?.token?.split("NEXT2121ANG");

      const formfields = {
        "Edate": selectedDate,
        "CenterNo": String(centerNumber)
      };

      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);

      const response = await getMajorMinorPacket(Data);
      if (!response?.status) return
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
      const parsedData = JSON.parse(decryptedData);

      setMajorMinorPacketData(parsedData)
    } catch (error) {
      console.log("error in getting major minor packet data", error);
    }
  };

  // Fetch Challan Number
  const fetchChallanNumber = async (): Promise<ChallanNumberResponse | null> => {
    try {
      if (!session?.user?.token) {
        return null;
      }

      const splitValue = session?.user?.token?.split("NEXT2121ANG");

      const formfields = {
        "Edate": selectedDate,
        "Etime": selectedTime,
        "CenterNo": String(centerNumber)
      };

      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);

      const response = await deGetChallanNumber(Data);

      if (!response?.status) return null
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
      const parsedData: ChallanNumberResponse[] = JSON.parse(decryptedData);
      const challanData = parsedData[0] || null;
      setChallanNumberData(challanData);
      return challanData;
    } catch (error) {
      console.log("error in getting challan number", error);
      return null;
    }
  };

  // Update Major Packet
  const updateMajorPacketData = async () => {
    try {
      if (!session?.user?.token) {
        return;
      }

      const splitValue = session?.user?.token?.split("NEXT2121ANG");

      const formfields = {
        "Id": majorMinorPacketData[0].Id,
        "MajorPacketCount": tempValue
      }

      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);

      const response = await updateMajorPacketAction(Data);
      if (!response?.status) return
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
      const parsedData = JSON.parse(decryptedData);
      setMajorPacketRes(parsedData)
    } catch (error) {
      console.log("error in updating majr packet", error);
    }
  };

  const handleDamageSheetSubmit = async () => {
    if (Number(damageSheet.count) <= 0) {
      return;
    }
    if (!session?.user?.token) {
      console.error("User session expired. Please log in again.");
      return;
    }

    const splitValue = session?.user?.token?.split("NEXT2121ANG");

    const formfields = {
      Id: Number(damageSheet.packetsId),
      ConsumedDatetime: selectedDate,
      ConsumeSession: selectedTime,
      CenterNo: centerNumber,
      DamageCount: Number(damageSheet.count),
      DamageSerials: damageSheet.serialNo,
      DamageType: damageSheet.sheetType,
    };


    const credentialsJson = JSON.stringify(formfields);
    const { Data } = encryptData(credentialsJson, splitValue[1]);

    try {
      setLoadingAddDamageSheets(true);
      const response = await insertDamageSheets(Data);
      if (response?.status) {
        const decryptedData = decryptDataforResponse(response.data, splitValue[1]);
        const parsedData = JSON.parse(decryptedData);

        setInsertSheetsRes(parsedData);

        await fetchDamageSheets();


        setDamageSheet({
          type: "Theory",
          packetsId: "",
          sheetType: "Damaged",
          count: "",
          serialNo: "",
        });
      }

      setLoadingAddDamageSheets(false);
    } catch (error) {
      console.error("Error inserting damaged sheets:", error);
    }
  };

  const totalPackets = challanDetails.reduce((sum, item) => sum + item.noOfPacket, 0);

  const getExamTypeLabel = () => {
    switch (examType) {
      case 0: return "Regular";
      case 1: return "Special";
      case 2: return "Practical";
      default: return "Regular";
    }
  };

  // Get appropriate icon based on sheet type
  const getSheetIcon = (type: string) => {
    switch (type) {
      case "Theory": return <LibraryBooksIcon fontSize="small" color="primary" />;
      case "Library": return <LibraryBooksIcon fontSize="small" color="secondary" />;
      case "Practical": return <ScienceIcon fontSize="small" color="warning" />;
      default: return <LibraryBooksIcon fontSize="small" color="primary" />;
    }
  };

  // Filter packets by selected date and time
  const displayData =
    material?.filter(
      (entry) =>
        entry?.ConsumeDatetime &&
        entry?.ConsumeSession &&
        entry.ConsumeDatetime.slice(0, 10) === selectedDate &&
        entry.ConsumeSession === selectedTime
    ) || [];


  // Get background color based on sheet type
  const getSheetBackgroundColor = (type: string) => {
    switch (type) {
      case "Theory": return "primary.light";
      case "LibraryTheory": return "secondary.light";
      case "Practical": return "warning.light";
      case "LibraryPractical": return ".light";

      default: return "primary.light";
    }
  };

  const transformedData = Object.entries(examSheetSummaryData).flatMap(
    ([type, summaries]) =>
      summaries
        .filter((summary) => summary.ExamTiming === selectedTime) // filter by selectedTime
        .map((summary) => ({
          type, // "Theory", "Practical", etc.
          totalSheets: summary.Sheets,
          presentStudents: summary.Present,
          umcStudents: summary.UMC,
          consumed: summary.Consumed,
          damaged: summary.DamageSheets,
          looseSheets: summary.LooseSheets,
        }))
  );

  // Filtered table data for PDF
  const pdfTableData = examSheetConsumptionData.filter(item => item.ExamTiming === selectedTime).map(item => [
    selectedDate, // Exam Date
    selectedTime, // Exam Time
    item.CourseCode, // Course Code
    item.NoOfPacket, // No of Minor Packet
    item.TotalSheet // Total No of Sheets
  ]);

  // Sum of minor packets
  const sumMinorPackets = majorMinorPacketData?.filter(item => item.ExamTime === selectedTime)[0]?.MinorPackets ?? 0;
  const sumMajorPackets = majorMinorPacketData?.filter(item => item.ExamTime === selectedTime)[0]?.MajorPacket ?? 0

  console.log("sumMajorPackets", sumMinorPackets, sumMajorPackets)
  // Sum of UMC packets
  const sumUmcPackets = examSheetConsumptionData.filter(item => item.ExamTiming === selectedTime).reduce((sum, item) => sum + item.NoOfUMCPacket, 0);

  const isTheory = examType === 5;
  const isPractical = examType === 6;

  const handlePrintChallan = async () => {
    const challanData = await fetchChallanNumber();
    if (!challanData) {
      alert('Failed to fetch challan number');
      return;
    }

    const doc = new jsPDF();
    const printDateTime = format(new Date(), 'dd-MM-yyyy HH:mm:ss');
    const examDateFormatted = format(new Date(selectedDate), 'dd MMM yyyy');

    // Header (common) - bold
    doc.setFontSize(12);
    doc.setFont(undefined as any, 'bold');

    // Adjust Y position for headers (moved up)
    const headerY = 12;

    if (isTheory) {
      doc.text(`Colour: ${challanData.ColourCode}`, 10, headerY, { align: 'left' });
    }
    doc.text('Confidential/Urgent', 105, headerY, { align: 'center' });
    // Add underline
    doc.setLineWidth(0.5);
    doc.line(85, headerY + 1, 125, headerY + 1);
    doc.text(`Challan No. ${challanData.ChallanNumber}`, 200, headerY, { align: 'right' });

    // Reduced gap below headers
    let currentY = 18;
    let noteText = '';
    let subject = '';
    let verification = '';
    // Colour and Note (conditional for theory)

    doc.setFont(undefined as any, 'normal'); // Reset after note

    // Note (bold) - only for theory
    if (isTheory) {
      doc.setFontSize(10);
      doc.setFont(undefined as any, 'bold');
      const note = 'Note: Print this challan on above mentioned Colour';
      doc.text(note, 10, currentY);
      currentY += 5;
    }
    else if (isPractical) {
      doc.setFontSize(10);
      doc.setFont(undefined as any, 'bold');
      const note = 'Note: Print this challan on white A4 sheet';
      doc.text(note, 10, currentY);
      currentY += 5;
    }

    // Subject (bold)
    doc.setFontSize(10);
    doc.setFont(undefined as any, 'bold');
    let subjectLine = '';
    let textPart1 = '';

    if (isTheory) {
      subjectLine = 'Subject: Handing over the packets of answer sheets from examination Center.';
      textPart1 = `This is to certify that the packets containing attempted answer sheets are handed over to the representative of Lovely Professional University, Jalandhar - Delhi, G.T Road (NH-1), Phagwara, Punjab by Examination Center Code ${centerNumber} on ${examDateFormatted}.`;
      verification = 'I have physically checked and verified that all packets of answer sheets have been packed and sealed properly.';
    } else if (isPractical) {
      subjectLine = 'Subject: Handing over the packets of practical answer sheets from examination Centre.';
      textPart1 = `This is to certify that the packets containing attempted practical answer sheets are handed over to the representative of Lovely Professional University, Jalandhar - Delhi, G.T Road (NH-1), Phagwara, Punjab by Examination Center Code ${centerNumber} on ${examDateFormatted}.`;
      verification = 'I have physically checked and verified that all packets of practical answer sheets have been packed and sealed properly.';
    }

    // Print subject line (bold)
    const subjectSplit = doc.splitTextToSize(subjectLine, 190);
    doc.text(subjectSplit, 10, currentY);
    currentY += subjectSplit.length * 4;

    // Print text part 1 (normal)
    doc.setFont(undefined as any, 'normal');
    const textPart1Split = doc.splitTextToSize(textPart1, 190);
    doc.text(textPart1Split, 10, currentY);
    currentY += textPart1Split.length * 4;

    // Print verification (normal)
    const verificationSplit = doc.splitTextToSize(verification, 190);
    doc.text(verificationSplit, 10, currentY);
    currentY += verificationSplit.length * 4 + 3;

    // Packet Details label (only for practical)
    let tableHeaders: string[] = [];
    if (isPractical) {
      doc.text('Packet Details:', 10, currentY);
      currentY += 5;
      tableHeaders = ['Date of Examination', 'Session', 'Course Code', 'No of Minor Packet', 'Total No of Sheets'];
    } else if (isTheory) {
      tableHeaders = ['Exam Date', 'Exam Time', 'CourseCode', 'No of Minor Packet', 'Total No of Sheets'];
    }

    // Table
    autoTable(doc, {
      startY: currentY,
      head: [tableHeaders],
      body: pdfTableData,
      theme: 'grid',
      styles: {
        fontSize: 8,
        textColor: [0, 0, 0] // Black text for body
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0] // Black text for headers
      }
    });

    const endY = (doc as any).lastAutoTable.finalY + 10;
    currentY = endY;

    // Major Packets text - empty with underline (— followed by underline for value? but per request, empty with underline)
    const majorPackets = majorMinorPacketData?.filter(item => item.ExamTime === selectedTime)[0]?.MajorPacket ?? 0;
    const majorText = '—';

    // Totals and inline signatures
    const sigX = 120; // Approximate x-position for signatures
    if (isTheory) {
      // Theory: Minor, Major, UMC
      doc.text(`Total No of Minor Packets : ${sumMinorPackets}`, 10, currentY);
      doc.text('Signature of Invigilator/DSOC ________________', sigX, currentY);
      currentY += 5;

      doc.text(`Major Packets of the Day : ${sumMajorPackets}`, 10, currentY);
      doc.text('Signature of Flying ________________', sigX, currentY);
      currentY += 5;
    } else if (isPractical) {
      // Practical: Major, UMC
      doc.text(`Major Packets of the Day : ${sumMajorPackets}`, 10, currentY);
      doc.text('Signature of Invigilator/DSOC ________________', sigX, currentY);
      currentY += 5;

      doc.text(`Total No of UMC Packets : ${sumUmcPackets}`, 10, currentY);
      doc.text('Signature of Flying ________________', sigX, currentY);
      currentY += 10;
    }

    // Observer and SOC signatures (no underlines)
    const sigY = currentY;

    doc.text('Signature/UID of Observer', 10, sigY);
    doc.text('Signature of SOC', sigX, sigY);

    if (isTheory) {
      // UID for theory - with space
      doc.text(`${username || ''}`, 10, sigY + 5);
    }
    // SOC details
    doc.text(`${challanData.staffname} (${challanData.phoneno})`, sigX, sigY + 5);

    // Print date time (right-aligned under SOC, with more space to avoid overlap)
    doc.text(printDateTime, 180, sigY + 10, { align: 'right' });

    doc.save(`Challan_${challanData.ChallanNumber}_${selectedDate}.pdf`);
  };

  React.useEffect(() => {
    fetchExamSheetsummary(),
      fetchDamageSheets(),
      fetchCollectionGrid(),
      fetchExamSheetConsumption(),
      fetchMajorMinorPacketData()
  }, []);

  React.useEffect(() => {
    fetchMajorMinorPacketData()
  }, [selectedDate, majorPacketRes]);

  React.useEffect(() => {
    if (transformedData.length > 0) {
      setExamSheetSummary(transformedData);
    }
  }, [examSheetSummaryData]);

  // Update data when exam type changes
  React.useEffect(() => {
    // setSheetsConsumption(getInitialSheetsData());
    setChallanDetails(getInitialChallanData());
  }, [examType]);

  React.useEffect(() => {
    if (majorMinorPacketData?.[0]?.MajorPacket != null) {
      setTempValue(majorMinorPacketData?.filter(item => item.ExamTime === selectedTime)[0]?.MajorPacket ?? 0);
    }
  }, [majorMinorPacketData, examType]);

  React.useEffect(() => {
    setExamSheetConsumptionCourseData(examSheetConsumptionData);
  }, [examSheetConsumptionData]);

  return (
    <>

      <Box sx={{ padding: '0px !important' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
            <ReceiptIcon sx={{ verticalAlign: "middle", mr: 1 }} />
            Challan Process
          </Typography>
          {/* Collection Grid Modal */}
          {isModalOpen && (
            <AttendanceData
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              data={collectionGridData}
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          )}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 2 }}>
            <Chip
              color="primary"
              variant="outlined"
              label={"Print Challan"}
              onClick={handlePrintChallan}
              sx={{ p: 0 }}
            />
            <Chip
              color="primary"
              variant="outlined"
              label={"Show Collection Grid"}
              onClick={() => setIsModalOpen(true)}
              sx={{ p: 0 }}
            />
            <Chip
              color="primary"
              variant="outlined"
              icon={<InfoIcon />}
              label={`${getExamTypeLabel()} Exam: ${selectedDate} - ${selectedTime}`}
              sx={{ p: 0 }}
            />
          </Box>
        </Box>

        {/* Sheet Consumption Summary */}
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent sx={{ p: '0px !important' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                <ReceiptIcon sx={{ mr: 1, color: 'primary.main' }} />
                Sheet Consumption
              </Typography>
              <Badge badgeContent={damagedSheets.length} color="warning" max={99}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ViewListIcon />}
                  onClick={() => setViewDamagedSheetsOpen(true)}
                  color="primary"
                >
                  Damaged Sheets
                </Button>
              </Badge>
            </Stack>


            <Grid container spacing={2}>
              {transformedData?.map((item, index) => (
                <Grid key={index} size={{ xs: 12, sm: 3, md: 3 }}>
                  <Card
                    variant="outlined"
                    sx={{
                      backgroundColor: getSheetBackgroundColor(item.type),
                      p: "0px !important",
                    }}
                  >
                    <CardContent sx={{ p: 1.5 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: 1 }}
                      >
                        <Avatar
                          sx={{
                            backgroundColor: (theme: any) =>
                              theme.palette.mode === "light" ? "white" : "#111c2d",
                            width: 28,
                            height: 28,
                          }}
                        >
                          {getSheetIcon(item.type)}
                        </Avatar>
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          color="primary.main"
                        >
                          {item.type}
                        </Typography>
                      </Stack>

                      <Grid container spacing={1}>
                        <Grid size={{ xs: 6 }}>
                          <Box
                            sx={{
                              p: 0.5,
                              backgroundColor: (theme: any) =>
                                theme.palette.mode === "light" ? "white" : "#111c2d",
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              Total:
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              color="primary.main"
                            >
                              {item.totalSheets}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid size={{ xs: 6 }}>
                          <Box
                            sx={{
                              p: 0.5,
                              backgroundColor: (theme: any) =>
                                theme.palette.mode === "light" ? "white" : "#111c2d",
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              Present:
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              color="success.main"
                            >
                              {item.presentStudents}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid size={{ xs: 6 }}>
                          <Box
                            sx={{
                              p: 0.5,
                              backgroundColor: (theme: any) =>
                                theme.palette.mode === "light" ? "white" : "#111c2d",
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              UMC:
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              color={
                                item.umcStudents > 0 ? "error.main" : "text.secondary"
                              }
                            >
                              {item.umcStudents}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid size={{ xs: 6 }}>
                          <Box
                            sx={{
                              p: 0.5,
                              backgroundColor: (theme: any) =>
                                theme.palette.mode === "light" ? "white" : "#111c2d",
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              Consumed:
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              color="primary.main"
                            >
                              {item.consumed}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid size={{ xs: 6 }}>
                          <Box
                            sx={{
                              p: 0.5,
                              backgroundColor: (theme: any) =>
                                theme.palette.mode === "light" ? "white" : "#111c2d",
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              Damaged:
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              color={
                                item.damaged > 0 ? "warning.main" : "text.secondary"
                              }
                            >
                              {item.damaged}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid size={{ xs: 6 }}>
                          <Box
                            sx={{
                              p: 0.5,
                              backgroundColor: (theme: any) =>
                                theme.palette.mode === "light" ? "white" : "#111c2d",
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              Loose:
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {item.looseSheets}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

          </CardContent>
        </Card>

        {/* Damage Sheet Reporting */}
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent sx={{ p: '0px !important' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              <WarningIcon sx={{ verticalAlign: "middle", mr: 1, color: "warning.main" }} />
              Report Damaged Sheets
            </Typography>

            <Grid container spacing={1} alignItems="center">
              {/* <Grid size={{ xs: 12, sm: 2 }}>
              <TextField
                select
                fullWidth
                variant="outlined"
                label="Type"
                value={damageSheet.type}
                onChange={handleDamageSheetChange("type")}
                size="small"
                margin="dense"
              >
                {sheetsConsumption.map((item) => (
                  <MenuItem key={item.type} value={item.type}>{item.type}</MenuItem>
                ))}
              </TextField>
            </Grid> */}
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  select
                  variant="outlined"
                  label="Packets"
                  value={damageSheet.packetsId}
                  onChange={handleDamageSheetChange("packetsId")}
                  size="small"
                  margin="dense"
                  fullWidth
                >
                  {displayData?.map(item => (
                    <MenuItem key={item.Id} value={item.Id}>
                      {item.Pktno}
                    </MenuItem>
                  ))}
                </TextField>

              </Grid>
              {/* <Grid size={{xs:12,sm:3}}>
                <TextField
                  select
                  fullWidth
                  variant="outlined"
                  label="Sheet Type"
                  value={damageSheet.sheetType}
                  onChange={handleDamageSheetChange("sheetType")}
                  size="small"
                  margin="dense"
                >
                  <MenuItem value="Missing">Missing</MenuItem>
                  <MenuItem value="Damaged">Damaged</MenuItem>
                </TextField>
              </Grid> */}
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  select
                  fullWidth
                  variant="outlined"
                  label="Sheet Type"
                  value={damageSheet.sheetType}
                  onChange={handleDamageSheetChange("sheetType")}
                  size="small"
                  margin="dense"
                >
                  <MenuItem value="Missing">Missing</MenuItem>
                  <MenuItem value="Damaged">Damaged</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 2 }}>
                <TextField
                  // fullWidth
                  variant="outlined"
                  label="Count"
                  type="number"
                  value={damageSheet.count}
                  onChange={handleDamageSheetChange("count")}
                  size="small"
                  margin="dense"
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 2 }}>
                <TextField
                  // fullWidth
                  variant="outlined"
                  label="Serial No"
                  type="number"
                  value={damageSheet.serialNo}
                  onChange={handleDamageSheetChange("serialNo")}
                  size="small"
                  margin="dense"
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                />
              </Grid>
              {/* <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                // fullWidth
                variant="outlined"
                type="number"
                label="Serial No"
                value={damageSheet.serialNo}
                onChange={handleDamageSheetChange("serialNo")}
                size="small"
                margin="dense"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              // required
              />
            </Grid> */}

              <Grid size={{ xs: 12, sm: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleDamageSheetSubmit}
                  disabled={!damageSheet.serialNo || loadingAddDamageSheets}
                  startIcon={
                    loadingAddDamageSheets ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : null
                  }
                  size="small"
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Challan Details */}
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent sx={{ p: "0px !important" }}>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <AssignmentIcon sx={{ mr: 1, color: "primary.main" }} />
                Challan Details
              </Typography>
              {(isLastStepSeven || dataSaved) &&

                <Chip
                  label="Edit major packet"
                  color="success"
                  variant="outlined"
                  size="small"
                  sx={{ cursor: "pointer" }}
                  onClick={handleStartEdit}

                />
              }
            </Box>

            {/* Alert */}
            <Alert severity="error" sx={{ mb: 1 }}>
              <Typography variant="caption" fontWeight="bold">
                Note: Arrange All sheets E-code wise
              </Typography>
            </Alert>

            {/* Chips Section */}
            <Grid container spacing={1} sx={{ mb: 1 }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Chip
                  icon={<CheckCircleIcon />}
                  label={`Minor Packets: ${majorMinorPacketData?.filter(item => item.ExamTime === selectedTime)[0]?.MinorPackets ?? 0}`}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ width: "100%" }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Chip
                  icon={<ErrorIcon />}
                  label={`UMC Packets: ${totalUmcPackets ?? 0}`}
                  color="error"
                  variant="outlined"
                  size="small"
                  sx={{ width: "100%" }}
                />
              </Grid>

              {/* Major Packets */}
              <Grid size={{ xs: 12, sm: 4 }}>
                {!isEditing ? (
                  <Chip
                    icon={<AssignmentIcon />}
                    label={`Major Packets: ${majorMinorPacketData?.filter(item => item.ExamTime === selectedTime)[0]?.MajorPacket ?? 0}`}
                    color="success"
                    variant="outlined"
                    size="small"
                    sx={{ width: "100%" }}
                  // onClick={handleEdit} // <-- click Chip to edit
                  />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid",
                      borderColor: "grey.400",
                      borderRadius: 2,
                      p: 0.5,
                      width: "100%",
                      gap: 0.5,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => setTempValue((v) => Math.max(0, v - 1))}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>

                    <TextField
                      value={tempValue ?? 0}
                      size="small"
                      type="number"
                      onChange={(e) => setTempValue(Number(e.target.value))}
                      inputProps={{
                        min: 0,
                        style: { textAlign: "center", width: 50 },
                      }}
                    />

                    <IconButton
                      size="small"
                      onClick={() => setTempValue((v) => v + 1)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>

                    <Box sx={{ flexGrow: 1 }} />

                    <IconButton size="small" color="success" onClick={handleSave}>
                      <CheckIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={handleCancel}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Grid>

            </Grid>

            {/* Table Section */}
            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300, overflow: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "primary.light" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>Course Code</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Appeared
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Absent
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      UMC
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      UMC Extra
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      New Student
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Total Sheet
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      No Of Packet
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      UMC Packet
                    </TableCell>
                    {/* <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Total Count
                  </TableCell> */}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {examSheetConsumptionData?.filter(item => item.ExamTiming === selectedTime).map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:nth-of-type(odd)": { bgcolor: "action.hover" } }}
                    >
                      <TableCell>{row.CourseCode}</TableCell>
                      <TableCell align="center">{row.Appeared}</TableCell>
                      <TableCell align="center">{row.Absent}</TableCell>
                      <TableCell align="center">{row.UMC}</TableCell>
                      <TableCell align="center">{row.UMCExtraSheet}</TableCell>
                      <TableCell align="center">{row.NewStudent}</TableCell>
                      <TableCell align="center">{row.TotalSheet}</TableCell>
                      <TableCell align="center">{row.NoOfPacket}</TableCell>
                      <TableCell align="center">{row.NoOfUMCPacket}</TableCell>
                      {/* <TableCell align="center">{row.totalCount}</TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Final Action Button */}
        {/* <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon={<SendIcon />}
            onClick={onCompleteProcess}
          >
            Approve Consumption and Challan
          </Button>
        </Box> */}

        {/* Damaged Sheets Dialog */}
        <Dialog
          open={viewDamagedSheetsOpen}
          onClose={() => setViewDamagedSheetsOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: 'warning.light', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WarningIcon sx={{ mr: 1 }} />
              Damaged Sheets List
            </Box>
            <IconButton onClick={() => setViewDamagedSheetsOpen(false)} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {damagedSheets.length === 0 ? (
              <Typography variant="body1" align="center" sx={{ py: 2 }}>
                No damaged sheets reported yet
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'action.hover' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Pkt No</TableCell>
                      {/* <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell> */}
                      <TableCell sx={{ fontWeight: 'bold' }}>Damage Type</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Count</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Serial No</TableCell>
                      {/* <TableCell sx={{ fontWeight: 'bold' }}>Timestamp</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {damagedSheets.map((sheet, index) => (
                      <TableRow key={index}>
                        <TableCell>{sheet.PktNo}</TableCell>
                        {/* <TableCell>{sheet.type}</TableCell> */}
                        <TableCell>{sheet.DamageType}</TableCell>
                        <TableCell>{sheet.Description}</TableCell>
                        <TableCell>{sheet.DamageCount}</TableCell>
                        <TableCell>{sheet.DamageSerials}</TableCell>
                        {/* <TableCell>{sheet.timestamp}</TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDamagedSheetsOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {!dataSaved && !isLastStepSeven && <Box
          sx={{
            p: 1,
            mt: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Checkbox
            checked={submitted}
            onChange={(e) => onChangeSubmitted(e.target.checked)}
          />
          <Typography flex={1}>
            Are you sure to submit the daily approve consumption?
          </Typography>
        </Box>}

      </Box>



    </>
  );
};

export default SeventhStep;