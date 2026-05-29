"use client";
import * as React from "react";
import {
  Box,
  Typography,
  Grid,
  Stack,
  CardContent,
  Chip,
  Card,
  LinearProgress,
  Button,
} from "@mui/material";
import "jspdf-autotable";
import {
  Event as EventIcon,
  Schedule as ScheduleIcon,
  LibraryBooks as LibraryBooksIcon,
  Chair as ChairIcon,
  Person as PersonIcon,
  Science as ScienceIcon,
} from "@mui/icons-material";
import BlankCard from "../../shared/BlankCard";
import CustomSwitch from "../../forms/theme-elements/CustomSwitch";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { keyframes } from "@mui/system";
import { useSession } from "next-auth/react";
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import CircularProgress from "@mui/material/CircularProgress";
import { updateAvailableRoom } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/seatingPlanGeneration/updateAvailableRoom";
import { seatingplanRoomWise } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/seatingPlanGeneration/seatingPlanRoomWise";
import { seatingplanGeneration } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/seatingPlanGeneration/seatingPlanGeneration";
import { seatingAttendanceSheet } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/seatingPlanGeneration/seatingAttendanceSheet";
import { getRoomsAction } from "@/app/actions/DECAActions/DistanceExamination/roomMaster/getRooms";
import { seatingplanCourseWise } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/seatingPlanGeneration/seatingPlanCourseWise";
import { questionPaperPacking } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/challanProcessing/questionPaperChecking";
interface SecondStepProps {
  selectedDate: string;
  selectedTime: string;
  examType: number;
  strength: {
    Theory: number,
    LibraryTheory: number,
    Practical: number,
    LibraryPractical: number
  };
  onSeatingPlanGenerated?: (generatedStatus: boolean, roomsData?: boolean[], capacity?: number) => void;
}
// Animation for card selection
const scaleAnimation = keyframes`
  0% { transform: scale(1);}
  50% { transform: scale(1.05); }
  100% { transform: scale(1);}
`;
type Room = {
  Id: string;
  RoomNo: string;
  Capacity?: number;
  Row: number;
  Col: number;
};
const SecondStep: React.FC<SecondStepProps> = ({
  selectedDate,
  selectedTime,
  examType,
  strength,
  onSeatingPlanGenerated
}) => {
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [selectedRoomIds, setSelectedRoomIds] = React.useState<string[]>([]);
  const [requiredCapacity, setRequiredCapacity] = React.useState<number>(0);
  const [updateRoomsRes, setUpRoomsRes] = React.useState<string>('');
  const [seatingPlanRes, setSeatingPlanRes] = React.useState<string>('')
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  interface SeatingPlanRoomWiseRow {
    CenterNo: string;
    RoomNo: string;
    [key: string]: any;
  }
  const [seatingPlanRoomWiseData, setSeatingPlanRoomWise] = React.useState<SeatingPlanRoomWiseRow[]>([])
  type CourseWiseData = {
    Date: string;
    ExamTiming: string;
    CourseCode: string;
    Starting: string;
    Ending: string;
    RoomNo: string;
  };
  const [seatingPlanCourseWiseData, setSeatingPlanCourseWise] = React.useState<CourseWiseData[]>([])
  const [attendanceSheet, setAttemdanceSheet] = React.useState([])
  const [questionPaperData, setQuestionPaperData] = React.useState<any[]>([])
  const centerNumber = useSelector((state: any) => state.center.centerNumber);
  const [loadingRooms, setLoadingRooms] = React.useState(false);
  const { data: session } = useSession();
  const displayedRooms = rooms;

  // Calculate selected capacity
  const selectedCapacity = displayedRooms
    .filter((room) => selectedRoomIds.includes(room?.Id))
    .reduce((sum, room) => sum + (room.Capacity ?? (room.Row * room.Col)), 0);
  const isDisabled = selectedCapacity < requiredCapacity;
  // Progress percentage
  const progressValue = requiredCapacity > 0
    ? Math.min((selectedCapacity / requiredCapacity) * 100, 100)
    : 0;
  // Function to update available rooms
  const updateAvailableRooms = async (updatedIds: string[]) => {
    const idsToSend = updatedIds.join(",");
    try {
      if (!session?.user?.token) {
        console.warn("Session or token missing during fetch");
        return;
      }
      const splitValue = session.user?.token.split("NEXT2121ANG");
      const formfields = {
        "Id": idsToSend,
        "CenterNo": centerNumber
      };
      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const response = await updateAvailableRoom(Data);

      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
      let parsedData = JSON.parse(decryptedData);
      setUpRoomsRes(parsedData);
      setLoading(false);
    } catch (error) {
      console.error("Error updating rooms:", error);
      setLoading(false);
    }
  };
  // Handle individual room toggle
  const handleToggleRoom = (roomId: string) => {
    setSelectedRoomIds(prev =>
      prev.includes(roomId)
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    );
  };
  // Submit selected rooms to API

  // Submit selected rooms to API
  const handleSubmit = async () => {
    setLoadingRooms(true);
    try {
      await updateAvailableRooms(selectedRoomIds); // your API call
      await seatingPlan();
      await fetchSeatingPlanRoomWise();
      await fetchSeatingPlanCourseWise();
      await fetchAttendanceSheetPlan();
      await fetchQuestionPaperPacking();
    } catch (err) {
      console.error("Failed to update rooms:", err);
    } finally {
      setLoadingRooms(false); // stop loading when done
    }
  };
  // Handle select all rooms
  const handleSelectAll = () => {
    if (displayedRooms.length > 0) {
      const allIds = displayedRooms?.map((room) => room.Id);
      setSelectedRoomIds(allIds);
      updateAvailableRooms(allIds); // sync here
    }
  };
  const handleDeselectAll = () => {
    setSelectedRoomIds([]);
    updateAvailableRooms([]); // sync here
  };
  // Fetch rooms from API
  const fetchRooms = async () => {
    try {
      if (!session?.user?.token) {
        console.warn("Session or token missing during fetch");
        return;
      }
      const splitValue = session.user?.token.split("NEXT2121ANG");
      const formfields = {
        CenterNo: centerNumber,
      };
      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const response = await getRoomsAction(Data);
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
      let parsedData = JSON.parse(decryptedData);
      setRooms(parsedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setLoading(false);
    }
  };
  const seatingPlan = async () => {
    try {
      if (!session?.user?.token) {
        console.warn("Session or token missing during fetch");
        return;
      }
      const splitValue = session.user?.token.split("NEXT2121ANG");
      const formfields = {
        "EDate": selectedDate,
        "ETime": selectedTime,
        "Param": 2,
        "CenterNo": centerNumber
      }
      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const response = await seatingplanGeneration(Data);
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
      let parsedData = JSON.parse(decryptedData);
      setSeatingPlanRes(parsedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching seating plan room wise:", error);
      setLoading(false);
    }
  };
  const fetchSeatingPlanRoomWise = async () => {
    try {
      if (!session?.user?.token) {
        console.warn("Session or token missing during fetch");
        return;
      }
      const splitValue = session.user?.token.split("NEXT2121ANG");
      const formfields = {
        "EDate": selectedDate,
        "ETime": selectedTime,
        "CenterNo": centerNumber
      }
      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const response = await seatingplanRoomWise(Data);
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
      let parsedData = JSON.parse(decryptedData);
      setSeatingPlanRoomWise(parsedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setLoading(false);
    }
  };
  const fetchSeatingPlanCourseWise = async () => {
    try {
      if (!session?.user?.token) {
        console.warn("Session or token missing during fetch");
        return;
      }
      const splitValue = session.user?.token.split("NEXT2121ANG");
      const formfields = {
        "EDate": selectedDate,
        "ETime": selectedTime,
        "CenterNo": centerNumber
      }
      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const response = await seatingplanCourseWise(Data);


      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
      let parsedData = JSON.parse(decryptedData);
      setSeatingPlanCourseWise(parsedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching seating plan course wise:", error);
      setLoading(false);
    }
  };
  const fetchAttendanceSheetPlan = async () => {
    try {
      if (!session?.user?.token) {
        console.warn("Session or token missing during fetch");
        return;
      }
      const splitValue = session.user?.token.split("NEXT2121ANG");
      const formfields = {
        "EDate": selectedDate,
        "ETime": selectedTime,
        "CenterNo": centerNumber
      }
      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const response = await seatingAttendanceSheet(Data);



      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
      let parsedData = JSON.parse(decryptedData);
      setAttemdanceSheet(parsedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching attendance sheet:", error);
      setLoading(false);
    }
  };
  const fetchQuestionPaperPacking = async () => {
    try {
      if (!session?.user?.token) {
        console.warn("Session or token missing during fetch");
        return;
      }
      const splitValue = session.user?.token.split("NEXT2121ANG");
      const formfields = {
        "EDate": format(new Date(selectedDate), "yyyy-MM-dd"),
        "ETime": selectedTime,
        "CenterNo": centerNumber
      }
      const credentialsJson = JSON.stringify(formfields);
      const { Data } = encryptData(credentialsJson, splitValue[1]);
      const response = await questionPaperPacking(Data);
      const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
      let parsedData = JSON.parse(decryptedData);
      // If API returns empty, fallback to sample data from the provided PDF
      setQuestionPaperData(parsedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching question paper packing:", error);
      setLoading(false);
    }
  };
  // PDF generation functions (keeping your existing implementation)
  const handleGeneratePDF = async () => {
    try {
      handleGenerateCourseWisePDF();
      handleGenerateRoomWisePackingPDF();
      handleGenerateAttendanceSheetPDF(selectedDate, selectedTime, attendanceSheet);
      handleGenerateQuestionPaperPDF();
      if (onSeatingPlanGenerated) {
        onSeatingPlanGenerated(true);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. See console for details.");
    }
  };
  const handleGenerateCourseWisePDF = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const addHeaderFooter = (pdf: jsPDF, pageNumber: number, totalPages: number, date: any, time: any) => {
        pdf.setFontSize(14).setFont("helvetica", "bold");
        pdf.text("Lovely Professional University", pageWidth / 2, 15, { align: "center" });
        pdf.setFontSize(10).setFont("helvetica", "normal");
        pdf.text(`Exam Date: ${date} | Exam Time: ${time}`, pageWidth / 2, 22, { align: "center" });
        pdf.text(`Page ${pageNumber} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: "center" });
      };
      const addCourseCard = (pdf: jsPDF, courseCode: any, startingECode: any, endingECode: any, roomNo: any, yOffset: number) => {
        const cardWidth = pageWidth - 40;
        const colWidths = [cardWidth * 0.3, cardWidth * 0.3, cardWidth * 0.4];
        const rowHeight = 7;
        // Header row background
        pdf.setFillColor(0, 0, 0).rect(20, yOffset, cardWidth, rowHeight, "F");
        pdf.setTextColor(255, 255, 255).setFontSize(10);
        pdf.text(`Course Code: ${courseCode}`, pageWidth / 2, yOffset + 4.5, { align: "center" });
        pdf.setTextColor(0, 0, 0);
        // Table headers
        pdf.setFillColor(240, 240, 240);
        pdf.rect(20, yOffset + rowHeight, colWidths[0], rowHeight, "F");
        pdf.rect(20 + colWidths[0], yOffset + rowHeight, colWidths[1], rowHeight, "F");
        pdf.rect(20 + colWidths[0] + colWidths[1], yOffset + rowHeight, colWidths[2], rowHeight, "F");
        pdf.setFont("helvetica", "bold").setFontSize(8);
        pdf.text("Starting E-Code", 20 + colWidths[0] / 2, yOffset + rowHeight + rowHeight / 2, { align: "center" });
        pdf.text("Ending E-Code", 20 + colWidths[0] + colWidths[1] / 2, yOffset + rowHeight + rowHeight / 2, { align: "center" });
        pdf.text("Room No", 20 + colWidths[0] + colWidths[1] + colWidths[2] / 2, yOffset + rowHeight + rowHeight / 2, { align: "center" });
        // Data row
        pdf.setFont("helvetica", "normal").setFontSize(8);
        pdf.rect(20, yOffset + rowHeight * 2, colWidths[0], rowHeight);
        pdf.rect(20 + colWidths[0], yOffset + rowHeight * 2, colWidths[1], rowHeight);
        pdf.rect(20 + colWidths[0] + colWidths[1], yOffset + rowHeight * 2, colWidths[2], rowHeight);
        pdf.text(startingECode, 20 + colWidths[0] / 2, yOffset + rowHeight * 2 + rowHeight / 2, { align: "center" });
        pdf.text(endingECode, 20 + colWidths[0] + colWidths[1] / 2, yOffset + rowHeight * 2 + rowHeight / 2, { align: "center" });
        pdf.text(roomNo, 20 + colWidths[0] + colWidths[1] + colWidths[2] / 2, yOffset + rowHeight * 2 + rowHeight / 2, { align: "center" });
      };
      // Settings for layout
      const courseCardHeight = 21;
      const gapBetweenCards = 4;
      const cardsPerPage = 10;
      const totalPages = Math.ceil(seatingPlanCourseWiseData.length / cardsPerPage);
      let pageNumber = 1;
      let yOffset = 30;
      addHeaderFooter(pdf, pageNumber, totalPages, format(new Date(selectedDate), "dd MMM yyyy"), selectedTime);
      seatingPlanCourseWiseData?.map((item, index) => {
        if (index > 0 && index % cardsPerPage === 0) {
          pdf.addPage();
          pageNumber++;
          yOffset = 30;
          addHeaderFooter(pdf, pageNumber, totalPages, format(new Date(selectedDate), "dd MMM yyyy"), selectedTime);
        }
        addCourseCard(pdf, item.CourseCode, item.Starting, item.Ending, item.RoomNo, yOffset);
        yOffset += courseCardHeight + gapBetweenCards;
      });
      pdf.save("course-wise-seating-plan.pdf");
    } catch (error) {
      console.error("Error generating course-wise PDF:", error);
    }
  };
  const handleGenerateRoomWisePackingPDF = async () => {
    try {
      const pdf = new jsPDF("l", "mm", "a4"); // Changed to landscape for horizontal orientation
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const examDate = selectedDate ? format(new Date(selectedDate), "dd MMM yyyy") : "No date selected";
      const examTime = selectedTime || "No time selected";
      const centerNo = centerNumber || "501";
      // Group data by roomNo
      const roomsMap: Record<string, any[]> = {};
      seatingPlanRoomWiseData.forEach((row) => {
        const key = row.RoomNo;
        if (!roomsMap[key]) roomsMap[key] = [];
        roomsMap[key].push(row);
      });
      const roomKeys = Object.keys(roomsMap);
      const totalPages = roomKeys.length;
      let pageNumber = 1;
      const addHeaderFooter = (pdf: jsPDF, pageNumber: number, roomNo: string = "") => {
        pdf.setFontSize(10);
        pdf.text("Best Wishes", 10, 10);
        pdf.text("Best Wishes", pageWidth - 20, 10);
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Lovely Professional University", pageWidth / 2, 15, { align: "center" });
        pdf.setFontSize(10);
        pdf.text(`Page ${pageNumber.toString()} of ${totalPages.toString()}`, pageWidth / 2, pageHeight - 10, { align: "center" });
      };
      const addSeatingPlanDetails = (pdf: jsPDF, roomNo: string, roomRows: any[], roomInfo: Room | undefined) => {
        // Header section with exam details - reduced spacing
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text(`Seating Plan : Exam Date: ${examDate} - Exam Time : ${examTime}`, pageWidth / 2, 20, { align: "center" });
        // Center and room info boxes - moved up
        const boxWidth = 55;
        const boxHeight = 10;
        const boxY = 25;
        const boxX1 = pageWidth / 2 - 60;
        const boxX2 = pageWidth / 2 + 5;
        pdf.rect(boxX1, boxY, boxWidth, boxHeight);
        pdf.text(`Center No : ${centerNo}`, boxX1 + 5, boxY + 7);
        pdf.rect(boxX2, boxY, boxWidth, boxHeight);
        pdf.text(`Room No : ${roomNo}`, boxX2 + 5, boxY + 7);
        // Table - moved up
        const rows = roomInfo?.Row ?? 12;
        const cols = roomInfo?.Col ?? 12;
        const tableX = 20; // Adjusted for row numbers on left
        const tableY = 40;
        const cellHeight = 8; // Reduced for better fit
        const cellSpacing = 0.2; // Reduced spacing
        const cellWidth = (pageWidth - 40) / cols - cellSpacing; // Adjusted margins
        pdf.setLineWidth(0.2);
        pdf.setDrawColor(0);
        // Col headers
        for (let col = 0; col < cols; col++) {
          const x = tableX + col * (cellWidth + cellSpacing);
          const y = tableY;
          pdf.rect(x, y, cellWidth, cellHeight);
          pdf.setFontSize(8);
          pdf.setFont("helvetica", "bold");
          pdf.text(`Col ${col + 1}`, x + cellWidth / 2, y + cellHeight / 2, { align: "center" });
        }
        // Data rows with row numbers outside on the left
        for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
          const y = tableY + (rowIdx + 1) * (cellHeight + cellSpacing); // +1 for header row
          // Row number on the left, outside the table boxes
          pdf.setFontSize(8);
          pdf.setFont("helvetica", "bold");
          pdf.text(`Row ${rowIdx + 1}`, tableX - 18, y + cellHeight / 2, { align: "left" }); // Positioned left of table
          for (let colIdx = 0; colIdx < cols; colIdx++) {
            const x = tableX + colIdx * (cellWidth + cellSpacing);
            pdf.rect(x, y, cellWidth, cellHeight);
            let regNo = '';
            let courseCode = '';
            if (rowIdx < roomRows.length) {
              regNo = roomRows[rowIdx][`R${colIdx + 1}`] || '';
              courseCode = roomRows[rowIdx][`CC${colIdx + 1}`] || '';
            }
            const centerX = x + cellWidth / 2;
            pdf.setFontSize(6);
            pdf.setFont("helvetica", "normal");
            pdf.text(regNo, centerX, y + 3.5, { align: "center" });
            pdf.text(courseCode, centerX, y + 6.5, { align: "center" });
          }
        }
        const tableHeight = (rows * cellHeight) + ((rows - 1) * cellSpacing) + cellHeight; // + header
        // Add legend
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "italic");
        const legendY = tableY + tableHeight + 5;
        pdf.text("REGXXXX: Registration Number | CSEXXX: Course Code",
          pageWidth / 2, legendY, { align: "center" });
        // Check if instructions fit on the page
        const instructionsBoxY = legendY + 5;
        const instructionsBoxHeight = 30;
        if (instructionsBoxY + instructionsBoxHeight + 10 > pageHeight) {
          pdf.addPage();
          addHeaderFooter(pdf, ++pageNumber, roomNo);
          // Reset positions for instructions on new page
          const newInstructionsBoxY = 20; // Start near top on new page
          addInstructions(pdf, newInstructionsBoxY, pageWidth, pageHeight);
        } else {
          addInstructions(pdf, instructionsBoxY, pageWidth, pageHeight);
        }
      };
      const addInstructions = (pdf: jsPDF, instructionsBoxY: number, pageWidth: number, pageHeight: number) => {
        // Add instructions box at bottom left
        const instructionsBoxX = 10;
        const instructionsBoxWidth = 90;
        const instructionsBoxHeight = 30;
        pdf.rect(instructionsBoxX, instructionsBoxY, instructionsBoxWidth, instructionsBoxHeight);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.text("Instructions:", instructionsBoxX + 2, instructionsBoxY + 5);
        pdf.setFont("helvetica", "normal");
        pdf.text("1. Sit as per your Seating Plan", instructionsBoxX + 2, instructionsBoxY + 9);
        pdf.text("2. Mobile Phones Should be kept outside the examination Hall.", instructionsBoxX + 2, instructionsBoxY + 13);
        pdf.text("3. Col 1 of Seating Plan starts from the left side of the Room.", instructionsBoxX + 2, instructionsBoxY + 17);
        pdf.text("4. Maintain proper discipline in the Examination Hall.", instructionsBoxX + 2, instructionsBoxY + 21);
        // Add "Mobile Phones Not Allowed" box with image
        const phoneBoxX = instructionsBoxX + instructionsBoxWidth + 10;
        const phoneBoxY = instructionsBoxY;
        const phoneBoxWidth = 80;
        const phoneBoxHeight = 30;
        pdf.rect(phoneBoxX, phoneBoxY, phoneBoxWidth, phoneBoxHeight);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.text("Mobile Phones Not Allowed", phoneBoxX + phoneBoxWidth / 2, phoneBoxY + 7, { align: "center" });
        // Draw phone icon that fits within the box
        const phoneIconX = phoneBoxX + phoneBoxWidth / 2;
        const phoneIconY = phoneBoxY + 17;
        const phoneWidth = 10;
        const phoneHeight = 16;
        // Draw phone outline (black)
        pdf.setDrawColor(0);
        pdf.setFillColor(255, 255, 255);
        pdf.setLineWidth(0.5);
        // Phone body
        pdf.roundedRect(phoneIconX - phoneWidth / 2, phoneIconY - phoneHeight / 2, phoneWidth, phoneHeight, 1, 1, 'FD');
        // Phone screen
        pdf.setFillColor(220, 220, 220);
        pdf.roundedRect(phoneIconX - phoneWidth / 2 + 1, phoneIconY - phoneHeight / 2 + 2, phoneWidth - 2, phoneHeight / 2, 0.5, 0.5, 'FD');
        // Home button
        pdf.circle(phoneIconX, phoneIconY + phoneHeight / 2 - 3, 1, 'FD');
        // Red circle with slash - make it fit within the box
        pdf.setDrawColor(255, 0, 0);
        pdf.setLineWidth(0.8);
        const circleRadius = Math.min(phoneWidth, phoneHeight) / 2 + 2;
        pdf.circle(phoneIconX, phoneIconY, circleRadius, 'S');
        pdf.line(
          phoneIconX - circleRadius * 0.7,
          phoneIconY - circleRadius * 0.7,
          phoneIconX + circleRadius * 0.7,
          phoneIconY + circleRadius * 0.7
        );
        // Reset colors
        pdf.setDrawColor(0);
        pdf.setFillColor(0, 0, 0);
        pdf.setFont("helvetica", "normal");
        pdf.text("Powered By: Lovely Professional University Exam Information System", 10, pageHeight - 10);
      };
      roomKeys.forEach((roomKey, index) => {
        if (index > 0) pdf.addPage();
        addHeaderFooter(pdf, pageNumber++, roomKey);
        const roomRows = roomsMap[roomKey];
        const roomInfo = rooms.find(r => r.RoomNo === roomKey);
        addSeatingPlanDetails(pdf, roomKey, roomRows, roomInfo);
      });
      pdf.save("room-wise-seating.pdf");
    } catch (err) {
      console.error("PDF error:", err);
    }
  };

  const handleGenerateAttendanceSheetPDF = async (date: Date | string | null, time: string, data: any[]) => {
    try {
      if (!data.length) {
        console.warn("No attendance sheet data to generate PDF");
        return;
      }
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const examDate = date ? format(date, "dd MMM yyyy") : "----";
      const examTime = time || "----";

      const groupedRooms: Record<string, { roomNo: string; students: any[] }> = {};
      data.forEach((obj: any) => {
        const roomNo = obj.Center || "----";
        if (!groupedRooms[roomNo]) {
          groupedRooms[roomNo] = { roomNo, students: [] };
        }
        for (let i = 1; ; i++) {
          if (!obj[`RegdNo${i}`]) break;
          groupedRooms[roomNo].students.push({
            regdNo: obj[`RegdNo${i}`] || "----",
            rollNumber: obj[`RollNumber${i}`] || "----",
            courseCode: obj[`CourseCode${i}`] || "----",
            name: obj[`Name${i}`] || "----",
            pic: obj[`Pic${i}`] || null,
          });
        }
      });
      const rooms = Object.values(groupedRooms);

      const addHeaderFooter = (
        pageNumber: number,
        totalPages: number,
        roomNo: string,
        studentCount: number
      ) => {
        pdf.setFontSize(14).setFont("helvetica", "bold").setTextColor(0, 0, 0);
        pdf.text("Lovely Professional University", pageWidth / 2, 12, { align: "center" });
        pdf.setFontSize(12);
        pdf.text("Exam Center : " + centerNumber, pageWidth / 2, 18, { align: "center" });
        pdf.text("Attendance Sheet", pageWidth / 2, 24, { align: "center" });
        pdf.setFontSize(9).setFont("helvetica", "normal");
        pdf.text(
          `Exam Date : ${examDate} Room No : ${roomNo} Student Count: ${studentCount} Exam Time: ${examTime}`,
          pageWidth / 2,
          30,
          { align: "center" }
        );

        const footerY = pageHeight - 55;
        const footerBoxWidth = pageWidth - 40;
        pdf.setFontSize(7).setTextColor(0, 0, 0);
        pdf.rect(20, footerY, footerBoxWidth * 0.7, 28);
        const leftMargin = 22;
        const textRowHeight = 5;
        pdf.text("** Write Absent in the Signature column if student is Absent with Red Pen", leftMargin, footerY + 4);
        pdf.text("I have personally checked and verified the identity of the above mentioned students.", leftMargin, footerY + 4 + textRowHeight);
        pdf.text("Signature of Invigilator I_________________Contact No_____________", leftMargin, footerY + 4 + textRowHeight * 2);
        pdf.text("Signature of Invigilator II_________________Contact No_____________", leftMargin, footerY + 4 + textRowHeight * 3);
        pdf.text("Page wise Count: Present_________ Absent_______", leftMargin, footerY + 4 + textRowHeight * 4);
        pdf.rect(20, footerY + 30, footerBoxWidth * 0.7, 12);
        pdf.text("**I certify that I have marked the attendance of above students on the DeLauncher Software.", leftMargin, footerY + 37);
        const rightBoxX = 20 + footerBoxWidth * 0.7 + 2;
        const rightBoxWidth = footerBoxWidth * 0.25 + 3;
        pdf.rect(rightBoxX, footerY, rightBoxWidth, 15);
        pdf.text("Signature of Observer", rightBoxX + rightBoxWidth / 2, footerY + 8, { align: "center" });
        pdf.rect(rightBoxX, footerY + 17, rightBoxWidth, 15);
        pdf.text("Signature of", rightBoxX + rightBoxWidth / 2, footerY + 22, { align: "center" });
        pdf.text("Superintendent", rightBoxX + rightBoxWidth / 2, footerY + 27, { align: "center" });
        pdf.text(`PageNo. :: ${pageNumber}/${totalPages}`, 20, pageHeight - 3);
        pdf.text(`${format(new Date(), "dd-MM-yyyy HH:mm:ss")}`, pageWidth - 20, pageHeight - 3, { align: "right" });
      };

      const addStudentDetails = (
        yOffset: number,
        student: any,
        idx: number,
        studentIndexOnPage: number,
        rowHeight: number
      ) => {
        const gap = 1;
        const colsPerRow = 3;
        const boxWidth = (pageWidth - 40 - (colsPerRow - 1) * gap) / colsPerRow;
        const boxHeight = rowHeight;
        const colIndex = studentIndexOnPage % colsPerRow;
        const rowIndex = Math.floor(studentIndexOnPage / colsPerRow);
        const xPos = 20 + (boxWidth + gap) * colIndex;
        const yPos = yOffset + (boxHeight + gap) * rowIndex;

        pdf.setDrawColor(0).setLineWidth(0.4);
        pdf.setFillColor(255, 255, 255);
        pdf.rect(xPos, yPos, boxWidth, boxHeight, "FD");

        const padding = 1;
        const sectionHeight = boxHeight / 7;
        let currentY = yPos;

        pdf.setFontSize(8).setFont("helvetica", "normal").setTextColor(0, 0, 0);
        pdf.text(`${idx + 1}. Regd No: ${student.regdNo}`, xPos + padding, currentY + sectionHeight * 0.5);
        currentY += sectionHeight;

        pdf.setLineWidth(0.1);
        pdf.line(xPos, currentY, xPos + boxWidth, currentY);

        const photoWidth = boxWidth * 0.6;
        const photoHeight = sectionHeight * 2;
        const photoX = xPos + (boxWidth - photoWidth) / 2;
        const photoY = currentY;

        pdf.setFillColor(245, 245, 245);
        pdf.rect(photoX, photoY, photoWidth, photoHeight, "FD");
        if (student.pic) {
          try {
            pdf.addImage(
              `data:image/jpeg;base64,${student.pic}`,
              "JPEG",
              photoX + 1,
              photoY + 1,
              photoWidth - 2,
              photoHeight - 2,
              undefined,
              "FAST"
            );
          } catch {
            pdf.setFontSize(6).setTextColor(0, 0, 0);
            pdf.text("Invalid Img", photoX + photoWidth / 2, photoY + photoHeight / 2, { align: "center" });
          }
        } else {
          pdf.setFontSize(6).setTextColor(0, 0, 0);
          pdf.text("No Image", photoX + photoWidth / 2, photoY + photoHeight / 2, { align: "center" });
        }
        currentY += sectionHeight * 2;

        pdf.line(xPos, currentY, xPos + boxWidth, currentY);

        pdf.setFontSize(8).setFont("helvetica", "normal").setTextColor(0, 0, 0);
        const displayName = (student.name || "Student Name").length > 18 ? (student.name || "Student Name").substring(0, 18) + "..." : (student.name || "Student Name");
        pdf.text(`Name: ${displayName}`, xPos + padding, currentY + sectionHeight * 0.5);
        currentY += sectionHeight;

        pdf.line(xPos, currentY, xPos + boxWidth, currentY);

        const courseEcodeText = `${student.courseCode || ""}, E-code: ${student.rollNumber || ""}`;
        pdf.text(courseEcodeText, xPos + padding, currentY + sectionHeight * 0.5);
        currentY += sectionHeight;

        pdf.line(xPos, currentY, xPos + boxWidth, currentY);

        pdf.text("Answer Sheet:", xPos + padding, currentY + sectionHeight * 0.5);
        currentY += sectionHeight;

        pdf.line(xPos, currentY, xPos + boxWidth, currentY);

        pdf.text("Signature:", xPos + padding, currentY + sectionHeight * 0.5);
      };

      const addCourseStrength = (students: any[], y: number) => {
        const courseMap = new Map<string, number>();
        students.forEach((student) => {
          const course = student.courseCode || "----";
          courseMap.set(course, (courseMap.get(course) || 0) + 1);
        });
        const sortedCourses = Array.from(courseMap.keys()).sort();
        sortedCourses.forEach((course) => {
          const count = courseMap.get(course) || 0;
          pdf.setFontSize(8).setTextColor(0, 0, 0);
          pdf.text(`[${course} : T :${count},P :____,A :____ ]`, 20, y);
          y += 6;
        });
        y += 6;
        pdf.text("Room Wise Course Strength", 20, y);
        y += 6;
        pdf.text("Total " + students.length + " Present ___ Absent ___", 20, y);
      };

      for (let roomIndex = 0; roomIndex < rooms.length; roomIndex++) {
        const { roomNo, students } = rooms[roomIndex];
        const studentCount = students.length;
        let pageNumber = 1;
        const headerHeight = 35;
        const footerHeight = 60;
        const usableHeight = pageHeight - headerHeight - footerHeight;
        const rowsPerPage = 3;
        const colsPerRow = 3;
        const studentsPerPage = rowsPerPage * colsPerRow;
        const rowHeight = (usableHeight - (rowsPerPage - 1) * 1) / rowsPerPage;
        const totalPages = Math.ceil(studentCount / studentsPerPage);

        addHeaderFooter(pageNumber, totalPages, roomNo, studentCount);
        let yOffset = headerHeight;

        for (let idx = 0; idx < studentCount; idx++) {
          if (idx > 0 && idx % studentsPerPage === 0) {
            pdf.addPage();
            pageNumber++;
            addHeaderFooter(pageNumber, totalPages, roomNo, studentCount);
            yOffset = headerHeight;
          }

          const studentIndexOnPage = idx % studentsPerPage;
          addStudentDetails(yOffset, students[idx], idx, studentIndexOnPage, rowHeight);

          if (idx === studentCount - 1 && pageNumber === totalPages) {
            const isLastPageFull = studentCount % studentsPerPage === 0 || studentIndexOnPage === studentsPerPage - 1;
            let strengthY = yOffset + (Math.floor(studentIndexOnPage / colsPerRow) + 1) * (rowHeight + 1) + 10;

            if (isLastPageFull || strengthY > pageHeight - footerHeight - 30) {
              pdf.addPage();
              pageNumber++;
              addHeaderFooter(pageNumber, totalPages + 1, roomNo, studentCount);
              strengthY = headerHeight + 20;
            }
            addCourseStrength(students, strengthY);
          }
        }
        if (roomIndex < rooms.length - 1) pdf.addPage();
      }
      pdf.save("attendance-sheet.pdf");
    } catch (error) {
      console.error("Error generating attendance sheet PDF:", error);
    }
  };

  const handleGenerateQuestionPaperPDF = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const examDate = selectedDate ? format(new Date(selectedDate), "dd MMM yyyy") : "10 Dec 2024";
      const examTime = selectedTime || "02:30-05:30";
      const centerNo = centerNumber || "501";

      // Group data by room number - each room gets its own page
      const roomsMap: Record<string, { courses: { courseCode: string; strength: number }[]; total: number }> = {};

      questionPaperData.forEach((item) => {
        const roomNo = String(item.RoomNo || "A");
        if (!roomsMap[roomNo]) {
          roomsMap[roomNo] = { courses: [], total: 0 };
        }

        roomsMap[roomNo].courses.push({
          courseCode: String(item.CourseCode || ""),
          strength: Number(item.Strength || 0)
        });
        roomsMap[roomNo].total += Number(item.Strength || 0);
      });

      const roomKeys = Object.keys(roomsMap);

      // Create a separate page for each room
      roomKeys.forEach((roomNo, roomIndex) => {
        if (roomIndex > 0) pdf.addPage(); // Add new page for each room except first

        // Header exactly like sample PDF
        pdf.setFontSize(14).setFont("helvetica", "bold");
        pdf.text("Lovely Professional University", pageWidth / 2, 15, { align: "center" });

        // Exam details section - exactly like sample PDF format
        pdf.setFontSize(10).setFont("helvetica", "normal");
        pdf.text(`Exam Date: ${examDate}`, 20, 25);
        pdf.text(`Exam Time: ${examTime}`, 20, 32);
        pdf.text(`Center No: ${centerNo}`, 20, 39);
        pdf.text(`Room No : ${roomNo}`, pageWidth - 60, 39);

        // Table for courses - exact structure from sample PDF
        const tableX = 20;
        const tableY = 50;
        const colWidths = [15, 25, 20, 30, 30, 35]; // Adjusted for exact PDF match
        const rowHeight = 10;

        // Table headers with exact text from sample PDF
        pdf.setLineWidth(0.3);
        pdf.setDrawColor(0, 0, 0);

        // Draw all table cells for headers
        pdf.rect(tableX, tableY, colWidths[0], rowHeight);
        pdf.rect(tableX + colWidths[0], tableY, colWidths[1], rowHeight);
        pdf.rect(tableX + colWidths[0] + colWidths[1], tableY, colWidths[2], rowHeight);
        pdf.rect(tableX + colWidths[0] + colWidths[1] + colWidths[2], tableY, colWidths[3], rowHeight);
        pdf.rect(tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], tableY, colWidths[4], rowHeight);
        pdf.rect(tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], tableY, colWidths[5], rowHeight);

        // Header text - exactly as in sample PDF
        pdf.setFont("helvetica", "bold").setFontSize(8);
        pdf.text("Sr", tableX + colWidths[0] / 2, tableY + 4, { align: "center" });
        pdf.text("No.", tableX + colWidths[0] / 2, tableY + 7, { align: "center" });

        pdf.text("Course", tableX + colWidths[0] + colWidths[1] / 2, tableY + 4, { align: "center" });
        pdf.text("Code", tableX + colWidths[0] + colWidths[1] / 2, tableY + 7, { align: "center" });

        pdf.text("Strength", tableX + colWidths[0] + colWidths[1] + colWidths[2] / 2, tableY + 6, { align: "center" });

        pdf.text("No of Question", tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] / 2, tableY + 4, { align: "center" });
        pdf.text("Papers Used", tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] / 2, tableY + 7, { align: "center" });

        pdf.text("Unused Question", tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] / 2, tableY + 4, { align: "center" });
        pdf.text("Papers", tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] / 2, tableY + 7, { align: "center" });

        pdf.text("Signature of", tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] / 2, tableY + 4, { align: "center" });
        pdf.text("Invigilator", tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] / 2, tableY + 7, { align: "center" });

        // Process courses for this specific room
        const roomData = roomsMap[roomNo];
        let currentY = tableY + rowHeight;

        // Create data rows from room's course data
        roomData.courses.forEach((course, index) => {
          // Draw cells for each row
          pdf.rect(tableX, currentY, colWidths[0], rowHeight);
          pdf.rect(tableX + colWidths[0], currentY, colWidths[1], rowHeight);
          pdf.rect(tableX + colWidths[0] + colWidths[1], currentY, colWidths[2], rowHeight);
          pdf.rect(tableX + colWidths[0] + colWidths[1] + colWidths[2], currentY, colWidths[3], rowHeight);
          pdf.rect(tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], currentY, colWidths[4], rowHeight);
          pdf.rect(tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], currentY, colWidths[5], rowHeight);

          // Fill data
          pdf.setFont("helvetica", "normal").setFontSize(9);
          pdf.text(String(index + 1), tableX + colWidths[0] / 2, currentY + 6, { align: "center" });
          pdf.text(String(course.courseCode), tableX + colWidths[0] + colWidths[1] / 2, currentY + 6, { align: "center" });
          pdf.text(String(course.strength), tableX + colWidths[0] + colWidths[1] + colWidths[2] / 2, currentY + 6, { align: "center" });

          // Leave other columns empty for manual filling (as in sample PDF)

          currentY += rowHeight;
        });

        // Total row - exactly as in sample PDF
        pdf.rect(tableX, currentY, colWidths[0], rowHeight);
        pdf.rect(tableX + colWidths[0], currentY, colWidths[1], rowHeight);
        pdf.rect(tableX + colWidths[0] + colWidths[1], currentY, colWidths[2], rowHeight);
        pdf.rect(tableX + colWidths[0] + colWidths[1] + colWidths[2], currentY, colWidths[3], rowHeight);
        pdf.rect(tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], currentY, colWidths[4], rowHeight);
        pdf.rect(tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], currentY, colWidths[5], rowHeight);

        pdf.setFont("helvetica", "bold").setFontSize(9);
        pdf.text("Total", tableX + 2, currentY + 6);
        pdf.text(String(roomData.total), tableX + colWidths[0] + colWidths[1] + colWidths[2] / 2, currentY + 6, { align: "center" });

        // Footer timestamp - exactly as in sample PDF
        pdf.setFont("helvetica", "normal").setFontSize(8);
        pdf.text(`${format(new Date(), "dd:MM:yyyy")}`, 10, pageHeight - 5);
      });

      pdf.save("SeatingPlanQuestionPaperPacking.pdf");
    } catch (error) {
      console.error("Error generating question paper packing PDF:", error);
    }
  };
  const handleToggleAll = () => {
    if (selectedRoomIds.length === displayedRooms.length) {
      setSelectedRoomIds([]);
      updateAvailableRooms([]); // deselect all
    } else {
      const allIds = displayedRooms?.map(room => room.Id);
      setSelectedRoomIds(allIds);
      updateAvailableRooms(allIds); // select all
    }
  };


  React.useEffect(() => {
    // Check if strength is an object (not an array) and calculate the sum
    if (strength && typeof strength === 'object' && !Array.isArray(strength)) {
      const theoryCount = Number(strength.Theory || 0);
      const libraryTheoryCount = Number(strength.LibraryTheory || 0);
      const totalRequired = theoryCount + libraryTheoryCount;
      setRequiredCapacity(totalRequired);
    } else if (Array.isArray(strength) && strength.length > 0) {
      // Fallback for array format (if needed for backward compatibility)
      setRequiredCapacity(Number(strength[0]?.Th || 0));
    } else {
      setRequiredCapacity(0);
    }
  }, [strength]);

  React.useEffect(() => {
    if (centerNumber) {
      fetchRooms();
    }
  }, [centerNumber]);

  return (
    <Box>
      {/* Summary Section */}
      <Box mt={2} p={2} borderRadius={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Exam Room Details
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ChairIcon />}
            disabled={!updateRoomsRes || loadingRooms}
            onClick={handleGeneratePDF}
          >
            {loadingRooms ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Generate Seating Plan"
            )}
          </Button>
        </Box>
        <BlankCard sx={{ pl: 2, mb: 2, borderRadius: 0 }}>
          <Stack direction="row" spacing={2} alignItems="center" mb={0} p={2}>
            <Chip
              label={`Required Capacity: ${requiredCapacity}`}
              color="info"
              variant="outlined"
              icon={<PersonIcon />}
              sx={{ backgroundColor: "#e3f2fd", borderColor: "#42a5f5" }}
            />
            <Chip
              label={`Selected Capacity: ${selectedCapacity}`}
              color={selectedCapacity >= requiredCapacity ? "success" : "warning"}
              variant="outlined"
              icon={<PersonIcon />}
              sx={{
                backgroundColor: selectedCapacity >= requiredCapacity ? "#e8f5e9" : "#fff3e0",
                borderColor: selectedCapacity >= requiredCapacity ? "#66bb6a" : "#ffa726",
                color: "black"
              }}
            />
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box flexGrow={1} p={1}>
              <LinearProgress
                variant="determinate"
                value={progressValue}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  transition: "0.5s ease-in-out",
                  backgroundColor: selectedCapacity >= requiredCapacity ? "#c8e6c9" : "#ffcc80",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: selectedCapacity >= requiredCapacity ? "#66bb6a" : "#ffa726",
                  },
                }}
              />
            </Box>
            <Typography variant="body2" color="textSecondary" pr={2}>
              {progressValue.toFixed(0)}%
            </Typography>
          </Stack>
        </BlankCard>
      </Box>
      {/* Select/Deselect All Buttons */}
      <Box mb={2} display="flex" gap={2}>
        <Button
          variant="outlined"
          color={selectedRoomIds.length === displayedRooms.length ? "secondary" : "primary"}
          onClick={handleToggleAll}
        >
          {selectedRoomIds.length === displayedRooms.length
            ? `Deselect All (${selectedRoomIds.length})`
            : `Select All Rooms (${displayedRooms.length})`}
        </Button>
      </Box>
      {/* Exam Room Details Section */}
      <div id="seating-plan-content">
        <Grid container spacing={2} sx={{ overflowY: "auto", maxHeight: "350px" }}>
          {displayedRooms?.map((room, index) => {
            const isSelected = selectedRoomIds.includes(room?.Id);
            return (
              <Grid key={room.Id} size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                <Box sx={{ cursor: "pointer" }}>
                  <BlankCard
                    sx={{
                      border: 1,
                      borderColor: isSelected ? "success.main" : "grey.400",
                      transition: "0.3s",
                      "&:hover": { boxShadow: 4, borderColor: "primary.main" },
                      animation: isSelected ? `${scaleAnimation} 0.3s ease-in-out` : "none",
                      width: "100%", // take full grid width
                      height: 60, // shorter card height (adjust to taste)
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      p={1}
                      sx={{
                        borderWidth: "0 0 0 5px",
                        borderStyle: "solid",
                        borderColor: isSelected ? "success.main" : "grey.400",
                        width: "100%",
                        height: "100%", // fill the card
                      }}
                    >
                      <CardContent
                        sx={{
                          p: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer", // so user knows it's clickable
                        }}
                        onClick={() => handleToggleRoom(room.Id)} // toggle selection on click
                      >
                        {/* LEFT SIDE */}
                        <Box>
                          <Typography variant="h6" fontWeight="bold" color="textPrimary">
                            Room No: {room.RoomNo}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Rows: {room.Row}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Columns: {room.Col}
                          </Typography>
                        </Box>
                        {/* RIGHT SIDE (Capacity Chip) */}
                        <Box
                          sx={{
                            backgroundColor: isSelected ? "success.main" : "primary.main",
                            color: "white",
                            px: 2,
                            py: 0.5,
                            borderRadius: "20px",
                            fontSize: "0.8rem",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Capacity: {room.Capacity ?? room.Row * room.Col}
                        </Box>
                      </CardContent>
                    </Box>
                  </BlankCard>
                </Box>
              </Grid>
            );
          })}
        </Grid>
        {!updateRoomsRes && <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ float: "right" }}
          disabled={isDisabled || loadingRooms}
        >
          {loadingRooms ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Submit Rooms"
          )}
        </Button>}
      </div>
    </Box>
  );
};


export default SecondStep;

