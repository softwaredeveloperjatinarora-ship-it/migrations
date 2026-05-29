
'use client'
import { Box, CircularProgress, Typography } from "@mui/material";
import convertAttendenceData from "./attendenceUtils";
import TableCollapsible from "./TableCollapsible";
import BarChartAndGauge from "./BarChartAndGauge";
import { useEffect, useState } from "react";
import { getAttendenceSummaryAction } from "@/app/actions/homeAction/AttendenceSummary/getAttendenceSummaryAction";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import { useSession } from "next-auth/react";
import { getAttendenceDetailsAction } from "@/app/actions/homeAction/AttendenceDetails/getAttendenceDetailsAction";
import React from "react";

export type allArray = {
    percentageArray: number[],
    colorArray: string[],
    courseCodeArr: string[],
    dutyLeaveArr: number[],
    totalPresent: number,
    CourseName: String[],
    classData: { totalDeliverd: number, totalAttend: number }[]
}

export type attendenceDetail = {
    RegistrationNumber: string;
    Name: string;
    BatchYear: number;
    ProgramName: string;
    RollNumber: string;
    CourseCode: string;
    CourseName: string;
    Last_Date: string;
    Grade: string;
    Total_Delv: number;
    Total_Attd: number;
    Total_Perc: number;
    DutyLeave: number;
    Total: number;
}
export type filteredStruct = {
    CourseCode: string;
    Coursecode: string;
    CourseName: string;
    AttendanceDate: string;
    AttendanceTime: string;
    AttendanceType: string;
    AttendanceCode: string;
    Name: string;
    LoginName: string;
    BlockReason: string;
    DutyLeave: string;
}


function Attendance({ onDataFetched }: any) {
    const [loading, setLoading] = useState(true);
    const isDataFetched = React.useRef(false);
    const { data: session } = useSession();

    const [attendenceDetails, setAttendenceDetails] = useState<any[]>([]);
    const [attendenceSummary, setAttendenceSummary] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string>("");

    const [initialValue, setInitialValue] = useState<allArray>({
        percentageArray: [],
        colorArray: [],
        courseCodeArr: [],
        dutyLeaveArr: [],
        totalPresent: 0,
        CourseName: [],
        classData: []
    });

    useEffect(() => {
        const fetchData = async () => {
            if (isDataFetched.current) return;
            setLoading(true);

            try {
                const response1 = await getAttendenceDetailsAction();
                const response2 = await getAttendenceSummaryAction();

                let splitValue = String(session?.user?.token).split("NEXT2121ANG");

                if (response1.status === "success" && response2.status === "success") {
                    const decryptedData1 = decryptDataforResponse(response1.ApiData, splitValue[1]);
                    const decryptedData2 = decryptDataforResponse(response2.ApiData, splitValue[1]);

                    const parsed1 = JSON.parse(decryptedData1);
                    const parsed2 = JSON.parse(decryptedData2);
                    // console.log("color",parsed1 )
                    //  console.log("coloree",parsed2 )

                    setAttendenceDetails(parsed1);
                    setAttendenceSummary(parsed2);
                    setInitialValue(convertAttendenceData(parsed2));

                    onDataFetched(parsed1, parsed2);
                    setLastUpdated(new Date().toLocaleString());
                } else {
                    setError(response1.message || response2.message);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error occurred");
            } finally {
                setLoading(false);
                isDataFetched.current = true;
            }
        };

        fetchData();
    }, [onDataFetched, session]);


    return (
        <>
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <CircularProgress />
                </Box>
            ) : attendenceSummary.length === 0 || attendenceDetails.length === 0 ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
                    <Typography variant="h6" color="textSecondary">
                        No data available
                    </Typography>
                </Box>
            ) : (
                <Box id={`row-${'Top'}`} sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100%', p: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1, alignSelf: 'flex-end' }}>
                        {lastUpdated}
                    </Typography>

                    <BarChartAndGauge attendenceDetail={attendenceSummary} />

                    <TableCollapsible
                        courseCode={initialValue.courseCodeArr}
                        superData={{ attendenceDetail: attendenceSummary, allCourse: attendenceDetails }}
                    />
                </Box>
            )}
        </>
    );

}

export default Attendance;


