"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    Box,
    Button,
    Typography,
    Chip,
    Stack,
    CircularProgress,
    InputAdornment,
    useTheme,
    Backdrop,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import jsPDF from "jspdf";
import { format, isToday, min, max, parseISO, differenceInDays } from "date-fns";
import { useSession } from "next-auth/react";
import { decryptDataforResponse, encryptData } from "@/app/api/services/auth/Encrptdecrpt";
import { useSelector } from "react-redux";
import { getExamDates } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/sheetConsumption/getExamDates";
import { seatingplanRoomWise } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/seatingPlanGeneration/seatingPlanRoomWise";
import { getRoomsAction } from "@/app/actions/DECAActions/DistanceExamination/roomMaster/getRooms";
import { seatingAttendanceSheet } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/seatingPlanGeneration/seatingAttendanceSheet";
import { seatingplanCourseWise } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/seatingPlanGeneration/seatingPlanCourseWise";
import { questionPaperPacking } from "@/app/actions/DECAActions/DistanceExamination/dailyActivity/challanProcessing/questionPaperChecking";
// Type definition for Room
interface Room {
    RoomNo: string;
    Row: number;
    Col: number;
}

// Type definition for ExamDate
interface ExamDate {
    Date: string;
    Session: string;
    ExamType: number;
    [key: string]: any;
}

const DownloadSeatingplan: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [examDates, setExamDates] = useState<ExamDate[]>([]);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const centerNumber = useSelector((state: any) => state.center.centerNumber);
    const { data: session } = useSession();
    const theme = useTheme();

    // Fetch exam dates
    const fetchExamDates = useCallback(async () => {
        if (!session?.user?.token || !centerNumber) return;
        try {
            setLoading(true);
            const splitValue = session.user?.token.split("NEXT2121ANG");
            const formfields = { CenterNo: centerNumber };
            const credentialsJson = JSON.stringify(formfields);
            const { Data } = encryptData(credentialsJson, splitValue[1]);
            const response = await getExamDates(Data);
            const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
            const parsedData = JSON.parse(decryptedData);
            setExamDates(parsedData || []);
        } catch (error) {
            console.error("Error fetching exam dates:", error);
            setExamDates([]);
        } finally {
            setLoading(false);
        }
    }, [session?.user?.token, centerNumber]);

    // Fetch rooms
    const fetchRooms = async (): Promise<Room[]> => {
        try {
            if (!session?.user?.token) {
                console.warn("Session or token missing during fetch");
                return [];
            }
            const splitValue = session.user?.token.split("NEXT2121ANG");
            const formfields = { CenterNo: centerNumber };
            const credentialsJson = JSON.stringify(formfields);
            const { Data } = encryptData(credentialsJson, splitValue[1]);
            const response = await getRoomsAction(Data);
            const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
            return JSON.parse(decryptedData);
        } catch (error) {
            console.error("Error fetching rooms:", error);
            return [];
        }
    };

    // Fetch seating plan room-wise
    const fetchSeatingPlanRoomWise = async (date: string, time: string): Promise<any[]> => {
        try {
            if (!session?.user?.token || !date || !time || !centerNumber) {
                console.warn("Missing required parameters");
                return [];
            }
            const splitValue = session.user?.token.split("NEXT2121ANG");
            const formfields = {
                EDate: date,
                ETime: time.replace(/\s/g, ""),
                CenterNo: centerNumber,
            };
            const credentialsJson = JSON.stringify(formfields);
            const { Data } = encryptData(credentialsJson, splitValue[1]);
            const response = await seatingplanRoomWise(Data);
        
            const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);

            return JSON.parse(decryptedData);
        } catch (error) {
            console.error("Error fetching seating plan room-wise:", error);
            return [];
        }
    };
    const [error, setError] = useState<string | null>(null);
    // Fetch seating plan course-wise
    const fetchSeatingPlanCourseWise = async (date: string, time: string): Promise<any[]> => {
        try {
            if (!session?.user?.token || !date || !time || !centerNumber) {
                console.warn("Missing required parameters");
                return [];
            }
            const splitValue = session.user?.token.split("NEXT2121ANG");
            const formfields = {
                EDate: date,
                ETime: time.replace(/\s/g, ""),
                CenterNo: centerNumber,
            };
            const credentialsJson = JSON.stringify(formfields);
            const { Data } = encryptData(credentialsJson, splitValue[1]);
            const response = await seatingplanCourseWise(Data);

    

            const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
            return JSON.parse(decryptedData);
        } catch (error) {
            console.error("Error fetching seating plan course-wise:", error);
            return [];
        }
    };

    // Fetch attendance sheet
    const fetchAttendanceSheetPlan = async (date: string, time: string): Promise<any[]> => {
        try {
            if (!session?.user?.token || !date || !time || !centerNumber) {
                console.warn("Missing required parameters");
                return [];
            }
            const splitValue = session.user?.token.split("NEXT2121ANG");
            const formfields = {
                EDate: date,
                ETime: time.replace(/\s/g, ""),
                CenterNo: centerNumber,
            };
            const credentialsJson = JSON.stringify(formfields);
            const { Data } = encryptData(credentialsJson, splitValue[1]);
            const response = await seatingAttendanceSheet(Data);
            
            const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);
            return JSON.parse(decryptedData);
        } catch (error) {
            console.error("Error fetching attendance sheet:", error);
            return [];
        }
    };

    // Fetch question paper packing
    const fetchQuestionPaperPacking = async (date: string, time: string): Promise<any[]> => {
        try {
            if (!session?.user?.token || !date || !time || !centerNumber) {
                console.warn("Missing required parameters");
                return [];
            }
            const splitValue = session.user?.token.split("NEXT2121ANG");
            const formfields = {
                EDate: date,
                ETime: time.replace(/\s/g, ""),
                CenterNo: centerNumber,
            };
            const credentialsJson = JSON.stringify(formfields);
            const { Data } = encryptData(credentialsJson, splitValue[1]);
            const response = await questionPaperPacking(Data);
           
            const decryptedData = decryptDataforResponse(response?.data, splitValue[1]);

            return JSON.parse(decryptedData);
        } catch (error) {
            console.error("Error fetching question paper packing:", error);
            return [];
        }
    };

    // Compute normalized date set for disabling dates
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

    // Compute min and max dates
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
    // Filter sessions based on selected date
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

    // Set initial date and session
    const findNearestAllowedDate = useCallback(() => {
        const today = new Date();
        const todayStr = format(today, "yyyy-MM-dd");
        if (normalizedDateSet.has(todayStr)) {
            return todayStr;
        }
        const allowedDates: Date[] = Array.from(normalizedDateSet).map((d) => parseISO(d));
        if (allowedDates.length === 0) return null;
        allowedDates.sort(
            (a, b) =>
                Math.abs(differenceInDays(a, today)) - Math.abs(differenceInDays(b, today))
        );
        return format(allowedDates[0], "yyyy-MM-dd");
    }, [normalizedDateSet]);

    useEffect(() => {
        if (examDates.length > 0 && !selectedDate && normalizedDateSet.size > 0) {
            const nearestDate = findNearestAllowedDate();
            if (nearestDate) {
                setSelectedDate(nearestDate);
            }
        }
    }, [examDates.length, selectedDate, normalizedDateSet, findNearestAllowedDate]);
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
            setSelectedTime(sortedSessions[0]);
        }
    }, [filteredSessions]);



    // Fetch exam dates on mount
    useEffect(() => {
        if (centerNumber && session?.user?.token) {
            fetchExamDates();
        }
    }, [centerNumber, session?.user?.token, fetchExamDates]);

    // PDF generation functions (unchanged from previous response)
    const handleGenerateCourseWisePDF = async (date: Date | null, time: string, data: any[]) => {
        try {
            if (!data.length) {
                console.warn("No course-wise data to generate PDF");
                return;
            }
            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const addHeaderFooter = (pageNumber: number, totalPages: number) => {
                pdf.setFontSize(14).setFont("helvetica", "bold");
                pdf.setTextColor(0, 0, 0);
                pdf.text("Lovely Professional University", pageWidth / 2, 15, { align: "center" });
                pdf.setFontSize(10).setFont("helvetica", "normal");
                pdf.text(
                    `Exam Date: ${date ? format(date, "dd MMM yyyy") : ""} | Exam Time: ${time}`,
                    pageWidth / 2,
                    22,
                    { align: "center" }
                );
                pdf.text(`Page ${pageNumber} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: "center" });
            };

            const addCourseCard = (
                courseCode: string,
                startingECode: string,
                endingECode: string,
                roomNo: string,
                yOffset: number
            ) => {
                const cardWidth = pageWidth - 40;
                const colWidths = [cardWidth * 0.3, cardWidth * 0.3, cardWidth * 0.4];
                const rowHeight = 7;

                pdf.setFillColor(200, 200, 200);
                pdf.rect(20, yOffset, cardWidth, rowHeight, "F");
                pdf.setTextColor(0, 0, 0);
                pdf.setFontSize(10).setFont("helvetica", "bold");
                pdf.text(`Course Code: ${courseCode}`, pageWidth / 2, yOffset + 4.5, { align: "center" });

                pdf.setFillColor(240, 240, 240);
                pdf.rect(20, yOffset + rowHeight, colWidths[0], rowHeight, "F");
                pdf.rect(20 + colWidths[0], yOffset + rowHeight, colWidths[1], rowHeight, "F");
                pdf.rect(20 + colWidths[0] + colWidths[1], yOffset + rowHeight, colWidths[2], rowHeight, "F");
                pdf.setFont("helvetica", "bold").setFontSize(8);
                pdf.text("Starting E-Code", 20 + colWidths[0] / 2, yOffset + rowHeight + rowHeight / 2, { align: "center" });
                pdf.text("Ending E-Code", 20 + colWidths[0] + colWidths[1] / 2, yOffset + rowHeight + rowHeight / 2, { align: "center" });
                pdf.text("Room No", 20 + colWidths[0] + colWidths[1] + colWidths[2] / 2, yOffset + rowHeight + rowHeight / 2, { align: "center" });

                pdf.setFillColor(255, 255, 255);
                pdf.rect(20, yOffset + rowHeight * 2, colWidths[0], rowHeight);
                pdf.rect(20 + colWidths[0], yOffset + rowHeight * 2, colWidths[1], rowHeight);
                pdf.rect(20 + colWidths[0] + colWidths[1], yOffset + rowHeight * 2, colWidths[2], rowHeight);
                pdf.setFont("helvetica", "normal").setFontSize(8);
                pdf.text(startingECode || "", 20 + colWidths[0] / 2, yOffset + rowHeight * 2 + rowHeight / 2, { align: "center" });
                pdf.text(endingECode || "", 20 + colWidths[0] + colWidths[1] / 2, yOffset + rowHeight * 2 + rowHeight / 2, { align: "center" });
                pdf.text(roomNo || "", 20 + colWidths[0] + colWidths[1] + colWidths[2] / 2, yOffset + rowHeight * 2 + rowHeight / 2, { align: "center" });
            };

            const courseCardHeight = 21;
            const gapBetweenCards = 4;
            const cardsPerPage = 10;
            const totalPages = Math.ceil(data.length / cardsPerPage);
            let pageNumber = 1;
            let yOffset = 30;

            addHeaderFooter(pageNumber, totalPages);
            data.forEach((item, index) => {
                if (index > 0 && index % cardsPerPage === 0) {
                    pdf.addPage();
                    pageNumber++;
                    yOffset = 30;
                    addHeaderFooter(pageNumber, totalPages);
                }
                addCourseCard(item.CourseCode, item.Starting, item.Ending, item.RoomNo, yOffset);
                yOffset += courseCardHeight + gapBetweenCards;
            });

            pdf.save("course-wise-seating-plan.pdf");
        } catch (error) {
            console.error("Error generating course-wise PDF:", error);
        }
    };

    const handleGenerateRoomWisePackingPDF = async (date: Date | null, time: string, data: any[], rooms: Room[]) => {
        try {
            if (!data.length) {
                console.warn("No room-wise data to generate PDF");
                return;
            }
            const pdf = new jsPDF("l", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const examDate = date ? format(date, "dd MMM yyyy") : "No date selected";
            const examTime = time || "No time selected";
            const centerNo = centerNumber || "501";

            const roomsMap: Record<string, any[]> = {};
            data.forEach((row) => {
                const key = row.RoomNo;
                if (!roomsMap[key]) roomsMap[key] = [];
                roomsMap[key].push(row);
            });
            const roomKeys = Object.keys(roomsMap);
            const totalPages = roomKeys.length;

            const addHeaderFooter = (pageNumber: number, roomNo: string = "") => {
                pdf.setFontSize(10).setTextColor(0, 0, 0);
                pdf.text("Best Wishes", 10, 10);
                pdf.text("Best Wishes", pageWidth - 20, 10);
                pdf.setFontSize(14).setFont("helvetica", "bold");
                pdf.text("Lovely Professional University", pageWidth / 2, 15, { align: "center" });
                pdf.setFontSize(10).setFont("helvetica", "normal");
                pdf.text(`Page ${pageNumber} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: "center" });
            };

            const addSeatingPlanDetails = (roomNo: string, roomRows: any[], roomInfo: Room | undefined) => {
                pdf.setFontSize(12).setFont("helvetica", "bold").setTextColor(0, 0, 0);
                pdf.text(`Seating Plan : Exam Date: ${examDate} - Exam Time : ${examTime}`, pageWidth / 2, 20, { align: "center" });

                const boxWidth = 55;
                const boxHeight = 10;
                const boxY = 25;
                const boxX1 = pageWidth / 2 - 60;
                const boxX2 = pageWidth / 2 + 5;
                pdf.setDrawColor(0, 0, 0).setLineWidth(0.2);
                pdf.rect(boxX1, boxY, boxWidth, boxHeight);
                pdf.rect(boxX2, boxY, boxWidth, boxHeight);
                pdf.setFontSize(10).setFont("helvetica", "normal");
                pdf.text(`Center No : ${centerNo}`, boxX1 + 5, boxY + 7);
                pdf.text(`Room No : ${roomNo}`, boxX2 + 5, boxY + 7);

                const rows = roomInfo?.Row ?? 12;
                const cols = roomInfo?.Col ?? 12;
                const tableX = 20;
                const tableY = 40;
                const cellHeight = 8;
                const cellSpacing = 0.2;
                const cellWidth = (pageWidth - 40) / cols - cellSpacing;

                pdf.setLineWidth(0.2).setDrawColor(0, 0, 0);
                for (let col = 0; col < cols; col++) {
                    const x = tableX + col * (cellWidth + cellSpacing);
                    pdf.setFillColor(240, 240, 240);
                    pdf.rect(x, tableY, cellWidth, cellHeight, "F");
                    pdf.setFontSize(8).setFont("helvetica", "bold").setTextColor(0, 0, 0);
                    pdf.text(`Col ${col + 1}`, x + cellWidth / 2, tableY + cellHeight / 2, { align: "center" });
                }

                for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
                    const y = tableY + (rowIdx + 1) * (cellHeight + cellSpacing);
                    pdf.setFontSize(8).setFont("helvetica", "bold").setTextColor(0, 0, 0);
                    pdf.text(`Row ${rowIdx + 1}`, tableX - 18, y + cellHeight / 2, { align: "left" });
                    for (let colIdx = 0; colIdx < cols; colIdx++) {
                        const x = tableX + colIdx * (cellWidth + cellSpacing);
                        pdf.setFillColor(255, 255, 255);
                        pdf.rect(x, y, cellWidth, cellHeight, "FD");
                        let regNo = "";
                        let courseCode = "";
                        if (rowIdx < roomRows.length) {
                            regNo = roomRows[rowIdx][`R${colIdx + 1}`] || "";
                            courseCode = roomRows[rowIdx][`CC${colIdx + 1}`] || "";
                        }
                        pdf.setFontSize(6).setFont("helvetica", "normal").setTextColor(0, 0, 0);
                        pdf.text(regNo, x + cellWidth / 2, y + 3.5, { align: "center" });
                        pdf.text(courseCode, x + cellWidth / 2, y + 6.5, { align: "center" });
                    }
                }

                const tableHeight = (rows * cellHeight) + ((rows - 1) * cellSpacing) + cellHeight;
                pdf.setFontSize(8).setFont("helvetica", "italic").setTextColor(0, 0, 0);
                pdf.text("REGXXXX: Registration Number | CSEXXX: Course Code", pageWidth / 2, tableY + tableHeight + 5, { align: "center" });

                const instructionsBoxY = tableY + tableHeight + 10;
                if (instructionsBoxY + 30 + 10 > pageHeight) {
                    pdf.addPage();
                    addHeaderFooter(totalPages + 1, roomNo);
                    addInstructions(20);
                } else {
                    addInstructions(instructionsBoxY);
                }
            };

            const addInstructions = (instructionsBoxY: number) => {
                const instructionsBoxX = 10;
                const instructionsBoxWidth = 90;
                const instructionsBoxHeight = 30;
                pdf.setDrawColor(0, 0, 0).setLineWidth(0.2);
                pdf.rect(instructionsBoxX, instructionsBoxY, instructionsBoxWidth, instructionsBoxHeight);
                pdf.setFont("helvetica", "bold").setFontSize(8).setTextColor(0, 0, 0);
                pdf.text("Instructions:", instructionsBoxX + 2, instructionsBoxY + 5);
                pdf.setFont("helvetica", "normal");
                pdf.text("1. Sit as per your Seating Plan", instructionsBoxX + 2, instructionsBoxY + 9);
                pdf.text("2. Mobile Phones Should be kept outside the examination Hall.", instructionsBoxX + 2, instructionsBoxY + 13);
                pdf.text("3. Col 1 of Seating Plan starts from the left side of the Room.", instructionsBoxX + 2, instructionsBoxY + 17);
                pdf.text("4. Maintain proper discipline in the Examination Hall.", instructionsBoxX + 2, instructionsBoxY + 21);

                const phoneBoxX = instructionsBoxX + instructionsBoxWidth + 10;
                const phoneBoxY = instructionsBoxY;
                const phoneBoxWidth = 80;
                const phoneBoxHeight = 30;
                pdf.rect(phoneBoxX, phoneBoxY, phoneBoxWidth, phoneBoxHeight);
                pdf.setFont("helvetica", "bold").setFontSize(10);
                pdf.text("Mobile Phones Not Allowed", phoneBoxX + phoneBoxWidth / 2, phoneBoxY + 7, { align: "center" });

                const phoneIconX = phoneBoxX + phoneBoxWidth / 2;
                const phoneIconY = phoneBoxY + 17;
                const phoneWidth = 10;
                const phoneHeight = 16;
                pdf.setDrawColor(0).setFillColor(255, 255, 255).setLineWidth(0.5);
                pdf.roundedRect(phoneIconX - phoneWidth / 2, phoneIconY - phoneHeight / 2, phoneWidth, phoneHeight, 1, 1, "FD");
                pdf.setFillColor(220, 220, 220);
                pdf.roundedRect(phoneIconX - phoneWidth / 2 + 1, phoneIconY - phoneHeight / 2 + 2, phoneWidth - 2, phoneHeight / 2, 0.5, 0.5, "FD");
                pdf.circle(phoneIconX, phoneIconY + phoneHeight / 2 - 3, 1, "FD");
                pdf.setDrawColor(255, 0, 0).setLineWidth(0.8);
                const circleRadius = Math.min(phoneWidth, phoneHeight) / 2 + 2;
                pdf.circle(phoneIconX, phoneIconY, circleRadius, "S");
                pdf.line(
                    phoneIconX - circleRadius * 0.7,
                    phoneIconY - circleRadius * 0.7,
                    phoneIconX + circleRadius * 0.7,
                    phoneIconY + circleRadius * 0.7
                );
                pdf.setDrawColor(0).setFont("helvetica", "normal").setFontSize(8);
                pdf.text("Powered By: Lovely Professional University Exam Information System", 10, pageHeight - 10);
            };

            let pageNumber = 1;
            roomKeys.forEach((roomKey, index) => {
                if (index > 0) pdf.addPage();
                addHeaderFooter(pageNumber++, roomKey);
                const roomRows = roomsMap[roomKey];
                const roomInfo = rooms.find((r) => r.RoomNo === roomKey);
                addSeatingPlanDetails(roomKey, roomRows, roomInfo);
            });

            pdf.save("room-wise-seating.pdf");
        } catch (error) {
            console.error("PDF error:", error);
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
 
    const handleGenerateQuestionPaperPDF = async (date: Date | null, time: string, data: any[]) => {
        try {
            if (!data.length) {
                console.warn("No question paper data to generate PDF");
                return;
            }
            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const examDate = date ? format(date, "dd MMM yyyy") : "10 Dec 2024";
            const examTime = time || "02:30-05:30";
            const centerNo = centerNumber || "501";

            const roomsMap: Record<string, { courses: { courseCode: string; strength: number }[]; total: number }> = {};
            data.forEach((item) => {
                const roomNo = String(item.RoomNo || "A");
                if (!roomsMap[roomNo]) {
                    roomsMap[roomNo] = { courses: [], total: 0 };
                }
                roomsMap[roomNo].courses.push({
                    courseCode: String(item.CourseCode || ""),
                    strength: Number(item.Strength || 0),
                });
                roomsMap[roomNo].total += Number(item.Strength || 0);
            });

            const roomKeys = Object.keys(roomsMap);

            roomKeys.forEach((roomNo, roomIndex) => {
                if (roomIndex > 0) pdf.addPage();

                pdf.setFontSize(14).setFont("helvetica", "bold").setTextColor(0, 0, 0);
                pdf.text("Lovely Professional University", pageWidth / 2, 15, { align: "center" });
                pdf.setFontSize(10).setFont("helvetica", "normal");
                pdf.text(`Exam Date: ${examDate}`, 20, 25);
                pdf.text(`Exam Time: ${examTime}`, 20, 32);
                pdf.text(`Center No: ${centerNo}`, 20, 39);
                pdf.text(`Room No : ${roomNo}`, pageWidth - 60, 39);

                const tableX = 20;
                const tableY = 50;
                const colWidths = [15, 25, 20, 30, 30, 35];
                const rowHeight = 10;

                pdf.setLineWidth(0.3).setDrawColor(0, 0, 0).setFillColor(240, 240, 240);
                pdf.rect(tableX, tableY, colWidths[0], rowHeight, "F");
                pdf.rect(tableX + colWidths[0], tableY, colWidths[1], rowHeight, "F");
                pdf.rect(tableX + colWidths[0] + colWidths[1], tableY, colWidths[2], rowHeight, "F");
                pdf.rect(tableX + colWidths[0] + colWidths[1] + colWidths[2], tableY, colWidths[3], rowHeight, "F");
                pdf.rect(tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], tableY, colWidths[4], rowHeight, "F");
                pdf.rect(tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], tableY, colWidths[5], rowHeight, "F");

                pdf.setFont("helvetica", "bold").setFontSize(8).setTextColor(0, 0, 0);
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

                const roomData = roomsMap[roomNo];
                let currentY = tableY + rowHeight;

                roomData.courses.forEach((course, index) => {
                    pdf.setFillColor(255, 255, 255);
                    pdf.rect(tableX, currentY, colWidths[0], rowHeight, "FD");
                    pdf.rect(tableX + colWidths[0], currentY, colWidths[1], rowHeight, "FD");
                    pdf.rect(tableX + colWidths[0] + colWidths[1], currentY, colWidths[2], rowHeight, "FD");
                    pdf.rect(tableX + colWidths[0] + colWidths[1] + colWidths[2], currentY, colWidths[3], rowHeight, "FD");
                    pdf.rect(tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], currentY, colWidths[4], rowHeight, "FD");
                    pdf.rect(tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], currentY, colWidths[5], rowHeight, "FD");

                    pdf.setFont("helvetica", "normal").setFontSize(9).setTextColor(0, 0, 0);
                    pdf.text(String(index + 1), tableX + colWidths[0] / 2, currentY + 6, { align: "center" });
                    pdf.text(String(course.courseCode), tableX + colWidths[0] + colWidths[1] / 2, currentY + 6, { align: "center" });
                    pdf.text(String(course.strength), tableX + colWidths[0] + colWidths[1] + colWidths[2] / 2, currentY + 6, { align: "center" });

                    currentY += rowHeight;
                });

                pdf.setFillColor(255, 255, 255);
                pdf.rect(tableX, currentY, colWidths[0], rowHeight, "FD");
                pdf.rect(tableX + colWidths[0], currentY, colWidths[1], rowHeight, "FD");
                pdf.rect(tableX + colWidths[0] + colWidths[1], currentY, colWidths[2], rowHeight, "FD");
                pdf.rect(tableX + colWidths[0] + colWidths[1] + colWidths[2], currentY, colWidths[3], rowHeight, "FD");
                pdf.rect(tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], currentY, colWidths[4], rowHeight, "FD");
                pdf.rect(tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], currentY, colWidths[5], rowHeight, "FD");

                pdf.setFont("helvetica", "bold").setFontSize(9).setTextColor(0, 0, 0);
                pdf.text("Total", tableX + 2, currentY + 6);
                pdf.text(String(roomData.total), tableX + colWidths[0] + colWidths[1] + colWidths[2] / 2, currentY + 6, { align: "center" });

                pdf.setFont("helvetica", "normal").setFontSize(8).setTextColor(0, 0, 0);
                pdf.text(`${format(new Date(), "dd:MM:yyyy")}`, 10, pageHeight - 5);
            });

            pdf.save("SeatingPlanQuestionPaperPacking.pdf");
        } catch (error) {
            console.error("Error generating question paper packing PDF:", error);
        }
    };

    const handleGeneratePDF = async (
        date: Date | null,
        time: string,
        rooms: Room[],
        roomWiseData: any[],
        courseWiseData: any[],
        attendanceSheetData: any[],
        questionPaperData: any[]
    ) => {
        await Promise.all([
            handleGenerateCourseWisePDF(date, time, courseWiseData),
            handleGenerateRoomWisePackingPDF(date, time, roomWiseData, rooms),
            handleGenerateAttendanceSheetPDF(date, time, attendanceSheetData),
            handleGenerateQuestionPaperPDF(date, time, questionPaperData),
        ]);
    };

    const [hasRooms, setHasRooms] = useState(false);
    const [hasRoomWiseData, setHasRoomWiseData] = useState(false);
    const [hasCourseWiseData, setHasCourseWiseData] = useState(false);
    const [hasAttendanceSheetData, setHasAttendanceSheetData] = useState(false);
    const [hasQuestionPaperData, setHasQuestionPaperData] = useState(false);

    // ✅ helper function
    // Helper to check if attendance data is empty (ignoring meta fields)
    const isAttendanceDataEmpty = (data: any) => {
        if (!data) return true; // null or undefined

        // Ensure it's an array
        const rows = Array.isArray(data) ? data : [data];

        return rows.every((row: any) => {
            // Keys to ignore (meta fields that are always filled)
            const ignoreKeys = ["CenterNo", "Session", "EDate", "RowNo", "Center"];

            // Check only the remaining fields
            return Object.entries(row)
                .filter(([key]) => !ignoreKeys.includes(key))
                .every(([_, val]) => val === null || val === 0 || val === "");
        });
    };

    const onGeneratePDF = async () => {
        if (!selectedDate || !selectedTime) {
            alert("Please select both date and session!");
            setErrorMessage(null);
            return;
        }
        if (!centerNumber) {
            alert("Center number is missing!");
            setErrorMessage(null);
            return;
        }

        setLoading(true);
        setErrorMessage(null);
        const formattedDate = format(new Date(selectedDate + "T00:00:00"), "yyyy-MM-dd");

        try {
            const [
                rooms,
                roomWiseData,
                courseWiseData,
                attendanceSheetData,
                questionPaperData,
            ] = await Promise.all([
                fetchRooms(),
                fetchSeatingPlanRoomWise(formattedDate, selectedTime),
                fetchSeatingPlanCourseWise(formattedDate, selectedTime),
                fetchAttendanceSheetPlan(formattedDate, selectedTime),
                fetchQuestionPaperPacking(formattedDate, selectedTime),
            ]);

            if (isAttendanceDataEmpty(attendanceSheetData)) {
                setErrorMessage("Data not found , Please generate rooms from daily activity.");
                return;
            }


            // ✅ If everything is empty → error
            if (
                !rooms?.length &&
                !roomWiseData?.length &&
                !courseWiseData?.length &&
                isAttendanceDataEmpty(attendanceSheetData) &&
                !questionPaperData?.length
            ) {
                setErrorMessage("Data not found. Please generate rooms from Daily Activity");
                return;
            }

            // ✅ otherwise generate PDF
            await handleGeneratePDF(
                selectedDate ? new Date(selectedDate + "T00:00:00") : null,
                selectedTime,
                rooms,
                roomWiseData,
                courseWiseData,
                attendanceSheetData,
                questionPaperData
            );
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. See console for details.");
            setErrorMessage("Error occurred while generating PDFs. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Custom renderDay function for DatePicker
  const renderDay = useCallback(
  (props: import('@mui/x-date-pickers').PickersDayProps) => {
    const { day, outsideCurrentMonth } = props;
    const realDay = day instanceof Date ? day : day.toDate();   // NEW
    const dayStr = format(realDay, "yyyy-MM-dd");
    const isAllowed = normalizedDateSet.has(dayStr);
    const isSelected = selectedDate === dayStr;
    const isTodayDate = isToday(realDay);

    if (outsideCurrentMonth) return <Box sx={{ width: 40, height: 40 }} />;

    return (
      <Button
        sx={{
          minWidth: 40,
          width: 40,
          height: 40,
          m: 0.25,
          ...(isSelected
            ? { bgcolor: theme.palette.success.main + "!important", color: "#fff!important" }
            : isTodayDate
            ? { bgcolor: theme.palette.primary.main + "!important", color: "#fff!important" }
            : isAllowed
            ? { bgcolor: "rgba(0,123,255,0.2)", color: theme.palette.primary.main }
            : { color: theme.palette.text.disabled }),
          "&:disabled": { bgcolor: "transparent!important", color: theme.palette.text.disabled + "!important" },
        }}
        disabled={!isAllowed}
        onClick={() => {
          if (isAllowed) {
            setSelectedDate(dayStr);
            setIsCalendarOpen(false);
            setErrorMessage(null);
          }
        }}
      >
        {realDay.getDate()}
      </Button>
    );
  },
  [normalizedDateSet, selectedDate, theme.palette]
);
    // Handle session selection
    const handleSessionClick = (session: string) => {
        setSelectedTime(session);
        setErrorMessage(null); // Clear error message on session change
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                p: 2,
                maxWidth: 700,
                mx: "auto",
                mt: 5,
                bgcolor: theme.palette.background.paper, // Added background color
                // borderRadius: 2, // Optional: adds rounded corners for better aesthetics
                boxShadow: 1, // Optional: adds a subtle shadow for depth
            }}
        >
            <Typography variant="h6" fontWeight={600}>
                Download Seating Plan
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={2}>
                    <DatePicker
                        label="Select Exam Date"
                        open={isCalendarOpen}
                        onOpen={() => setIsCalendarOpen(true)}
                        onClose={() => setIsCalendarOpen(false)}
                        value={selectedDate ? new Date(selectedDate + "T00:00:00") : null}
                      onChange={(newValue) => {
  if (!newValue) return;
  const d = newValue instanceof Date ? newValue : newValue.toDate();   // NEW
  const str = format(d, "yyyy-MM-dd");
  if (normalizedDateSet.has(str)) {
    setSelectedDate(str);
    setErrorMessage(null);
  }
  setIsCalendarOpen(false);
}}
                        minDate={minMaxDates.minDate}
                        maxDate={minMaxDates.maxDate}
shouldDisableDate={(date) => {
  const d = date instanceof Date ? date : date.toDate();   // <-- NEW
  return !normalizedDateSet.has(format(d, "yyyy-MM-dd"));
}}                        slots={{ day: renderDay }}
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
                                        onClick={() => handleSessionClick(session)}
                                        color={selectedTime === session ? "success" : "default"}
                                        sx={{
                                            minWidth: 120,
                                            justifyContent: "center",
                                            ...(selectedTime === session
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

                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onGeneratePDF}
                            disabled={loading || !selectedDate || !selectedTime}
                            sx={{
                                whiteSpace: "nowrap",
                                height: "36px",
                                px: 10,
                                borderRadius: "12px",
                                boxShadow: 3,
                                textTransform: "none",
                                width: "40px",
                                fontWeight: 600,
                                // mt: "-50px",
                            }}
                        >
                            {loading ? <CircularProgress size={20} color="inherit" /> : "Generate PDFs"}
                        </Button>
                    </Box>

                    {/* Error Message */}
                    {errorMessage && (
                        <Typography
                            variant="body1"
                            color="error"
                            sx={{ mt: 2, textAlign: "center" }}
                            role="alert"
                        >
                            {errorMessage}
                        </Typography>
                    )}
                </Stack>
            </LocalizationProvider>

            {/* Loading Backdrop */}
            <Backdrop
                sx={{
                    zIndex: (theme) => theme.zIndex.modal + 1,
                    color: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
                open={loading}
            >
                <CircularProgress color="inherit" size={60} />
                <Typography variant="h6" sx={{ color: "#fff" }}>
                    Fetching data and generating PDFs...
                </Typography>
            </Backdrop>
        </Box>
    );
};


export default DownloadSeatingplan;
