

"use client"
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useEffect, useRef, useState } from "react";
import { decryptDataforResponse } from "@/app/api/services/auth/Encrptdecrpt";
import { useSession } from "next-auth/react";
import { AcademicDetail } from "@/app/actions/OJTDashboard/AcademicDetailAction";



const OJTAcademicDetails = ({ onDataFetched }:any) => {

    const [loading, setLoading] = useState<boolean>(true);
    const isDataFetched = useRef(false);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();
     const [academic, setacadetail] = useState<any[]>([]);
    

    useEffect(() => {
        const fetchPlacementData = async () => {
            if (isDataFetched.current) return;

            try {
                setLoading(true);
                const response = await AcademicDetail();
            
                if (response.status === "success") {
                    let apiData = response.ApiData;
                    let splitValue = String(session?.user?.token).split("NEXT2121ANG");
                    const decryptedData = decryptDataforResponse(apiData, splitValue[1]);
                    const parsedData = JSON.parse(decryptedData);
                    setacadetail(parsedData);
                    onDataFetched(apiData);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error occurred");
            } finally {
                setLoading(false);
                isDataFetched.current = true;
            }
        };

        fetchPlacementData();
    }, [onDataFetched, session]);

    return (

<>
         {academic.map((item,i) => (
        <><Grid size={{ xs: 3 }} key={i}>

                 <Typography variant="body2" color="text.secondary">
                     Attendance
                 </Typography>
                 <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                     {item.AttPercentage}
                 </Typography>
             </Grid><Grid size={{ xs: 3 }}>
                     <Typography variant="body2" color="text.secondary">
                         CGPA
                     </Typography>
                     <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                         {item.Cgpa}
                     </Typography>
                 </Grid><Grid size={{ xs: 3 }}>
                     <Typography variant="body2" color="text.secondary">
                         Academice Status
                     </Typography>
                     <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                         {item.AcademicStatus}
                     </Typography>
                 </Grid><Grid size={{ xs: 3 }}>
                     <Typography variant="body2" color="text.secondary">
                         Standing F Grades
                     </Typography>
                     <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                         {item.FGrade}
                     </Typography>
                 </Grid><Grid size={{ xs: 3 }}>
                     <Typography variant="body2" color="text.secondary">
                         Standing I Grades
                     </Typography>
                     <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                         {item.iGrade}
                     </Typography>
                 </Grid><Grid size={{ xs: 3 }}>
                     <Typography variant="body2" color="text.secondary">
                         Standing ERG Grades
                     </Typography>
                     <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                        {item.StandingERG}
                     </Typography>
                 </Grid><Grid size={{ xs: 3 }}>
                     <Typography variant="body2" color="text.secondary">
                         Fee Balance
                     </Typography>
                     <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                         {item.FeeBalance}
                     </Typography>
                 </Grid><Typography
                     variant="body2"
                     sx={{
                         mt: 2,
                         color: "red",
                         fontWeight: 500,
                     }}
                 >
                     <span style={{ color: "blue", fontWeight: "bold" }}>
                         Note:
                     </span>{" "}
                     1.You shall continue attending all classes as per allocated
                     courses{" "}
                     <b>
                         until 3 days prior to Internship/ OJT start date (Subject to
                         Approval)
                     </b>{" "}
                     and should not have been reported for any disciplinary action
                     during this period.
                 </Typography><Typography
                     variant="body2"
                     sx={{
                         color: "red",
                         fontWeight: 500,
                     }}
                 >
                     <span style={{ color: "blue", fontWeight: "bold" }}>

                     </span>{" "}
                     2.You are advised to clear your Pending dues(if any ) for current term in next 2 days
                     {" "}
                     <b>
                         or else your OJT may not be approved.
                     </b>{" "}

                 </Typography></>
         ))}</>
    
        )}

export default OJTAcademicDetails;
